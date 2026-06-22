import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";

const CART_COOKIE = "be_cart_session";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;
    const sessionId = cookies().get(CART_COOKIE)?.value;

    if (userId) {
      const userCart = await prisma.cart.findUnique({ where: { userId } });
      if (userCart) await prisma.cartItem.deleteMany({ where: { cartId: userCart.id } });
    } else if (sessionId) {
      const guestCart = await prisma.cart.findUnique({ where: { sessionId } });
      if (guestCart) await prisma.cartItem.deleteMany({ where: { cartId: guestCart.id } });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(CART_COOKIE, "", { maxAge: 0, path: "/" });
    return res;
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
