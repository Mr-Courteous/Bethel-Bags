import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const CART_COOKIE = "be_cart_session";

function getOrCreateSessionId(): { id: string; isNew: boolean } {
  const cookieStore = cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;
  if (existing) return { id: existing, isNew: false };
  return { id: `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`, isNew: true };
}

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

function responseWithCookie(data: any, sessionId: string, status = 200) {
  const res = NextResponse.json(data, { status });
  res.cookies.set(CART_COOKIE, sessionId, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    path: "/",
  });
  return res;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;
    const { id: sessionId, isNew } = getOrCreateSessionId();
    const cart = await getOrCreateCart(userId, sessionId);
    if (isNew || !userId) return responseWithCookie(cart, sessionId);
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
    const { id: sessionId, isNew } = getOrCreateSessionId();
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

    return responseWithCookie({ success: true }, sessionId);
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
