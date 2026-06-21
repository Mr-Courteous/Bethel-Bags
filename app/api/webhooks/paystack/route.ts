import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY!;

    // Validate webhook signature
    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
    if (hash !== signature) {
      console.warn("Invalid Paystack webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const order = await prisma.order.findUnique({
        where: { paystackRef: reference },
        include: { items: true },
      });

      if (order && order.status !== "PAID") {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: order.id },
            data: { status: "PAID", paystackStatus: "success" },
          }),
          ...order.items.map((item) =>
            prisma.product.update({
              where: { id: item.productId! },
              data: { stock: { decrement: item.quantity } },
            })
          ),
        ]);
        console.log(`✅ Webhook: Order ${order.orderNumber} marked PAID`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
