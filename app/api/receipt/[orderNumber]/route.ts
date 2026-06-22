import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReceiptPDF } from "@/lib/receipt";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: params.orderNumber },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PAID" || !order.receiptData) {
      return NextResponse.json({ error: "Receipt not available yet" }, { status: 400 });
    }

    const paystackData = order.receiptData as Record<string, any>;
    const pdfBuffer = generateReceiptPDF(
      {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        city: order.city,
        state: order.state,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      },
      paystackData as any
    );

    return new Response(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${order.orderNumber}.pdf"`,
        "Content-Length": String(pdfBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error("Receipt generation error:", err);
    return NextResponse.json({ error: "Failed to generate receipt" }, { status: 500 });
  }
}
