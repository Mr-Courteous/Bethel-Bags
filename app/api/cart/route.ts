import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getOrCreateCart(userId: string | null, sessionId: string) {
  if (userId) {
    return prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: { items: { include: { product: true } } },
    });
  }
  return prisma.cart.upsert({
    where: { sessionId },
    create: { sessionId },
    update: {},
    include: { items: { include: { product: true } } },
  });
}

function getSessionId() {
  const cookieStore = cookies();
  let sessionId = cookieStore.get("cart_session")?.value;
  if (!sessionId) sessionId = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return sessionId;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;
    const sessionId = getSessionId();
    const cart = await getOrCreateCart(userId, sessionId);
    return NextResponse.json(cart);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;
    const sessionId = getSessionId();
    const { productId, quantity = 1 } = await req.json();

    const cart = await getOrCreateCart(userId, sessionId);
    const existing = (cart as any).items?.find((i: any) => i.productId === productId);

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    const response = NextResponse.json({ success: true });
    if (!userId) {
      response.cookies.set("cart_session", sessionId, { maxAge: 60 * 60 * 24 * 30, httpOnly: true });
    }
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { itemId, quantity } = await req.json();
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const itemId = req.nextUrl.searchParams.get("itemId");
    if (itemId) await prisma.cartItem.delete({ where: { id: itemId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
