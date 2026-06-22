import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystackPayment } from "@/lib/paystack";
import { cookies } from "next/headers";

const CART_COOKIE = "be_cart_session";

export async function POST(req: NextRequest) {
  try {
    const { reference, orderId } = await req.json();
    if (!reference || !orderId) {
      return NextResponse.json({ error: "reference and orderId are required" }, { status: 400 });
    }

    // Verify with Paystack
    const verification = await verifyPaystackPayment(reference);
    if (verification.data?.status !== "success") {
      return NextResponse.json({ error: "Payment not confirmed by Paystack" }, { status: 400 });
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status === "PAID") return NextResponse.json({ success: true, alreadyPaid: true });

    // Verify amount matches (Paystack returns kobo)
    const paidAmount = verification.data.amount / 100;
    if (paidAmount < order.total) {
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    // Update order status + reduce stock atomically
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID", paystackRef: reference, paystackStatus: "success", receiptData: verification.data },
      }),
      ...order.items.map((item) =>
        prisma.product.update({
          where: { id: item.productId! },
          data: { stock: { decrement: item.quantity } },
        })
      ),
    ]);

    // Clear guest cart
    const sessionId = cookies().get(CART_COOKIE)?.value;
    if (sessionId) {
      const guestCart = await prisma.cart.findUnique({ where: { sessionId } });
      if (guestCart) await prisma.cartItem.deleteMany({ where: { cartId: guestCart.id } });
    }
    if (order.userId) {
      const userCart = await prisma.cart.findUnique({ where: { userId: order.userId } });
      if (userCart) await prisma.cartItem.deleteMany({ where: { cartId: userCart.id } });
    }

    // Clear the guest cart cookie so the cart shows empty after checkout
    const res = NextResponse.json({ success: true, orderNumber: order.orderNumber });
    if (sessionId) {
      res.cookies.set(CART_COOKIE, "", { maxAge: 0, path: "/" });
    }
    return res;
  } catch (err) {
    console.error("Verify payment error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
