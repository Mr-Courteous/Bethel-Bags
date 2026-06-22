import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-NG", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

const MARGIN = 50;
const PAGE_WIDTH = 595.28;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function drawHeader(doc: PDFKit.PDFDocument) {
  doc.fontSize(24).font("Helvetica-Bold").fillColor("#1a1a1a").text("BETHEL EMPIRE", MARGIN, 45);
  doc.fontSize(8).font("Helvetica").fillColor("#888").text("Premium Handcrafted Bags", MARGIN, 75);
  doc.fontSize(18).font("Helvetica-Bold").fillColor("#B8860B").text("RECEIPT", MARGIN, 100);
  doc.strokeColor("#B8860B").lineWidth(1.5).moveTo(MARGIN, 130).lineTo(PAGE_WIDTH - MARGIN, 130).stroke();
}

function drawDetails(
  doc: PDFKit.PDFDocument,
  order: {
    orderNumber: string;
    paystackRef: string | null;
    createdAt: Date;
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    shippingAddress: string;
    city: string;
    state: string;
  },
) {
  const leftX = MARGIN;
  const rightX = PAGE_WIDTH - MARGIN - 200;

  doc.fontSize(9).font("Helvetica-Bold").fillColor("#555").text("RECEIPT DETAILS", leftX, 150);
  doc.fontSize(9).font("Helvetica").fillColor("#333");
  doc.text(`Receipt No:  ${order.orderNumber}`, leftX, 168);
  doc.text(`Date:        ${formatDate(new Date(order.createdAt))}`, leftX, 183);
  doc.text(`Paystack Ref: ${order.paystackRef || "—"}`, leftX, 198);

  doc.fontSize(9).font("Helvetica-Bold").fillColor("#555").text("CUSTOMER", rightX, 150);
  doc.fontSize(9).font("Helvetica").fillColor("#333");
  doc.text(order.customerName, rightX, 168);
  doc.text(order.customerEmail, rightX, 183);
  if (order.customerPhone) doc.text(order.customerPhone, rightX, 198);

  doc.fontSize(9).font("Helvetica-Bold").fillColor("#555").text("DELIVER TO", leftX, 225);
  doc.fontSize(9).font("Helvetica").fillColor("#333");
  doc.text(order.shippingAddress, leftX, 243);
  doc.text(`${order.city}, ${order.state}`, leftX, 258);

  return 280;
}

function drawTable(
  doc: PDFKit.PDFDocument,
  startY: number,
  items: { name: string; quantity: number; price: number }[],
  total: number,
) {
  const cols = {
    item: { x: MARGIN, w: 260 },
    qty: { x: MARGIN + 260, w: 60 },
    price: { x: MARGIN + 320, w: 80 },
    total: { x: MARGIN + 400, w: 90 },
  };

  doc.fontSize(8).font("Helvetica-Bold").fillColor("#fff");
  doc.rect(MARGIN, startY, CONTENT_WIDTH, 20).fill("#B8860B");
  doc.fillColor("#fff")
    .text("ITEM", cols.item.x + 8, startY + 5, { width: cols.item.w - 16 })
    .text("QTY", cols.qty.x + 8, startY + 5, { width: cols.qty.w - 16 })
    .text("PRICE", cols.price.x + 8, startY + 5, { width: cols.price.w - 16 })
    .text("TOTAL", cols.total.x + 8, startY + 5, { width: cols.total.w - 16 });

  let y = startY + 20;

  items.forEach((item, i) => {
    const bgColor = i % 2 === 0 ? "#fafafa" : "#ffffff";
    doc.rect(MARGIN, y, CONTENT_WIDTH, 22).fill(bgColor);
    doc.fontSize(9).font("Helvetica").fillColor("#333")
      .text(item.name, cols.item.x + 8, y + 5, { width: cols.item.w - 16 })
      .text(String(item.quantity), cols.qty.x + 8, y + 5, { width: cols.qty.w - 16, align: "center" })
      .text(formatPrice(item.price), cols.price.x + 8, y + 5, { width: cols.price.w - 16, align: "right" })
      .text(formatPrice(item.price * item.quantity), cols.total.x + 8, y + 5, { width: cols.total.w - 16, align: "right" });
    y += 22;
  });

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  y += 10;
  doc.fontSize(10).font("Helvetica").fillColor("#555")
    .text("Subtotal", MARGIN + 320, y, { width: 80, align: "right" })
    .text(formatPrice(subtotal), MARGIN + 400, y, { width: 90, align: "right" });
  y += 18;
  doc.font("Helvetica").fillColor("#555")
    .text("Shipping", MARGIN + 320, y, { width: 80, align: "right" })
    .text(formatPrice(total - subtotal), MARGIN + 400, y, { width: 90, align: "right" });
  y += 18;

  doc.rect(MARGIN, y - 4, CONTENT_WIDTH, 30).fill("#1a1a1a");
  doc.fontSize(12).font("Helvetica-Bold").fillColor("#fff")
    .text("TOTAL", MARGIN + 320, y + 2, { width: 80, align: "right" })
    .text(formatPrice(total), MARGIN + 400, y + 2, { width: 90, align: "right" });

  return y + 35;
}

function drawFooter(doc: PDFKit.PDFDocument, startY: number) {
  if (startY > 650) {
    doc.addPage();
    startY = MARGIN;
  }

  doc.strokeColor("#ddd").lineWidth(0.5).moveTo(MARGIN, startY).lineTo(PAGE_WIDTH - MARGIN, startY).stroke();

  doc.fontSize(8).font("Helvetica").fillColor("#999")
    .text("Payment Status: PAID", MARGIN, startY + 12)
    .text("Thank you for shopping with Bethel Empire!", MARGIN, startY + 26);

  doc.fontSize(7).fillColor("#bbb")
    .text("Bethel Empire — Premium Handcrafted Bags", PAGE_WIDTH - MARGIN, startY + 12, { align: "right" })
    .text("hello@bethelempire.com | bethelempire.com", PAGE_WIDTH - MARGIN, startY + 24, { align: "right" });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { orderNumber: string } },
) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: params.orderNumber },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PAID") {
      return NextResponse.json({ error: "Order not yet paid" }, { status: 400 });
    }

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      info: {
        Title: `Bethel Empire Receipt – ${order.orderNumber}`,
        Author: "Bethel Empire",
        Subject: "Payment Receipt",
      },
    });

    drawHeader(doc);
    const detailEndY = drawDetails(doc, order);
    const tableEndY = drawTable(doc, detailEndY, order.items, order.total);
    drawFooter(doc, tableEndY);

    doc.end();

    // Collect PDF chunks into a Uint8Array
    const chunks: Uint8Array[] = [];
    for await (const chunk of doc) {
      chunks.push(chunk as Uint8Array);
    }
    const len = chunks.reduce((s, c) => s + c.length, 0);
    const pdfBuffer = new Uint8Array(len);
    let offset = 0;
    for (const chunk of chunks) {
      pdfBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    return new NextResponse(pdfBuffer as unknown as string, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${order.orderNumber}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Receipt generation error:", err);
    return NextResponse.json({ error: "Failed to generate receipt" }, { status: 500 });
  }
}
