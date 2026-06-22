import PDFDocument from "pdfkit";

interface ReceiptData {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  channel: string;
  paid_at: string;
  created_at: string;
  fees: number;
  authorization?: {
    last4: string;
    exp_month: string;
    exp_year: string;
    card_type: string;
    bank: string;
    brand: string;
  };
  customer?: {
    email: string;
    phone?: string;
  };
}

interface OrderInfo {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string;
  city: string;
  state: string;
  total: number;
  createdAt: Date;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

export function generateReceiptPDF(order: OrderInfo, paystackData: ReceiptData): Uint8Array {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  const gold = "#B8860B";
  const dark = "#1a1a1a";
  const grey = "#666";
  const lightGrey = "#f5f5f5";

  function header() {
    doc.fontSize(24).font("Helvetica-Bold").fillColor(gold).text("BETHEL EMPIRE", { align: "center" });
    doc.fontSize(10).font("Helvetica").fillColor(grey).text("Premium Handcrafted Bags", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(8).fillColor(grey).text("contact@bethelempire.com", { align: "center" });
    doc.moveDown(1.5);
    doc.strokeColor(gold).lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);
  }

  function sectionTitle(title: string) {
    doc.moveDown(0.5);
    doc.fontSize(11).font("Helvetica-Bold").fillColor(dark).text(title);
    doc.moveDown(0.3);
  }

  function labelValue(label: string, value: string, opts?: { color?: string; monospace?: boolean }) {
    const font = opts?.monospace ? "Courier" : "Helvetica";
    doc.font(font).fontSize(9);
    doc.fillColor(grey).text(label, { continued: true, width: 150 });
    doc.fillColor(opts?.color || dark).text(value, { align: "right" });
  }

  header();

  // Receipt header
  doc.fontSize(16).font("Helvetica-Bold").fillColor(dark).text("PAYMENT RECEIPT", { align: "center" });
  doc.moveDown(1.5);

  // Order info
  sectionTitle("Order Details");
  labelValue("Order Number:", order.orderNumber, { monospace: true });
  labelValue("Date:", new Date(order.createdAt).toLocaleDateString("en-NG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }));
  labelValue("Status:", "PAID", { color: "#16a34a" });
  doc.moveDown(1);

  // Customer info
  sectionTitle("Customer");
  labelValue("Name:", order.customerName);
  labelValue("Email:", order.customerEmail);
  if (order.customerPhone) labelValue("Phone:", order.customerPhone);
  labelValue("Address:", `${order.shippingAddress}, ${order.city}, ${order.state}`);
  doc.moveDown(1);

  // Items
  sectionTitle("Items");
  doc.rect(50, doc.y, 495, 20).fill(lightGrey);
  doc.fillColor(dark).fontSize(9).font("Helvetica-Bold");
  doc.text("Item", 55, doc.y - 15, { width: 250 });
  doc.text("Qty", 310, doc.y, { width: 40, align: "center" });
  doc.text("Price", 365, doc.y, { width: 80, align: "right" });
  doc.text("Total", 460, doc.y, { width: 80, align: "right" });
  doc.moveDown(0.7);

  doc.font("Helvetica").fontSize(9);
  for (const item of order.items) {
    const y = doc.y;
    doc.text(item.name, 55, y, { width: 250 });
    doc.text(String(item.quantity), 310, y, { width: 40, align: "center" });
    doc.text(formatPrice(item.price), 365, y, { width: 80, align: "right" });
    doc.text(formatPrice(item.price * item.quantity), 460, y, { width: 80, align: "right" });
    doc.moveDown(0.5);
  }

  doc.moveDown(0.5);
  doc.strokeColor(grey).lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(12);
  doc.text("Total Paid:", 365, doc.y, { width: 80, align: "right" });
  doc.fillColor(gold).text(formatPrice(order.total), 460, doc.y - 13, { width: 80, align: "right" });
  doc.moveDown(1.5);

  // Payment details
  sectionTitle("Payment Details");
  labelValue("Paystack Reference:", paystackData.reference, { monospace: true });
  labelValue("Amount Paid:", formatPrice(paystackData.amount / 100));
  labelValue("Currency:", paystackData.currency);
  labelValue("Channel:", paystackData.channel?.toUpperCase() || "N/A");
  if (paystackData.authorization) {
    const auth = paystackData.authorization;
    labelValue("Card:", `${auth.card_type?.toUpperCase() || ""} ****${auth.last4 || ""}`);
    labelValue("Bank:", auth.bank || "N/A");
  }
  labelValue("Transaction ID:", `#${paystackData.id}`);
  labelValue("Paid At:", paystackData.paid_at
    ? new Date(paystackData.paid_at).toLocaleString("en-NG")
    : "N/A"
  );
  if (paystackData.fees != null) {
    labelValue("Transaction Fee:", formatPrice(paystackData.fees / 100));
  }
  doc.moveDown(2);

  // Footer
  doc.strokeColor(gold).lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.5);
  doc.fontSize(8).font("Helvetica").fillColor(grey).text(
    "This is a computer-generated receipt. No signature required.\nThank you for choosing Bethel Empire!",
    { align: "center" }
  );

  doc.end();

  return new Uint8Array(Buffer.concat(chunks));
}

function formatPrice(amount: number): string {
  return `₦${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
