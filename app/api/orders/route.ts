import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { cookies } from "next/headers";

const CART_COOKIE = "be_cart_session";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;
    const sessionId = cookies().get(CART_COOKIE)?.value;

    const body = await req.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, city, state, notes } = body;

    if (!customerName || !customerEmail || !shippingAddress || !city || !state) {
      return NextResponse.json({ error: "All shipping fields are required" }, { status: 400 });
    }

    // Get cart
    const cart = userId
      ? await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true } } } })
      : sessionId
      ? await prisma.cart.findUnique({ where: { sessionId }, include: { items: { include: { product: true } } } })
      : null;

    if (!cart || (cart as any).items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const items = (cart as any).items;

    // Validate stock
    for (const item of items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${item.product.name}". Only ${item.product.stock} available.` },
          { status: 400 }
        );
      }
    }

    const total = items.reduce((s: number, i: any) => s + i.product.price * i.quantity, 0);
    const orderNumber = generateOrderNumber();
    const paystackRef = `BE-ORD-${orderNumber}-${Date.now()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        state,
        notes,
        total,
        status: "PENDING",
        paystackRef,
        items: {
          create: items.map((i: any) => ({
            productId: i.productId,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.images[0] || null,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order, paystackRef }, { status: 201 });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = (session.user as any)?.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
