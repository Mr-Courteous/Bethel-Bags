import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get("orderNumber");
  if (!orderNumber) {
    return NextResponse.json({ error: "orderNumber required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order || order.status !== "PAID") {
    return NextResponse.json({ error: "Receipt not available" }, { status: 404 });
  }

  return NextResponse.json({ order, paystackData: order.receiptData });
}
