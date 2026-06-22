import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const CART_COOKIE = "be_cart_session";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;
    const sessionId = cookies().get(CART_COOKIE)?.value;

    let count = 0;

    if (userId) {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      });
      count = cart?.items.reduce((s, i) => s + i.quantity, 0) || 0;
    } else if (sessionId) {
      const cart = await prisma.cart.findUnique({
        where: { sessionId },
        include: { items: true },
      });
      count = cart?.items.reduce((s, i) => s + i.quantity, 0) || 0;
    }

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
