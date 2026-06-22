"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

const GOLD = "#C9A84C";
const DARK = "#1a1a1a";
const GREY = "#666";

function fmt(n: number) {
  return `₦${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

async function loadLogoBase64(): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(c.toDataURL("image/jpeg"));
    };
    img.onerror = reject;
    img.src = "/bethel-logo.jpg";
  });
}

export default function DownloadReceiptButton({ orderNumber }: { orderNumber: string }) {
  const [loading, setLoading] = useState(false);
  const logoRef = useRef<string | null>(null);

  useEffect(() => {
    loadLogoBase64().then((d) => { logoRef.current = d; }).catch(() => {});
  }, []);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/receipt?orderNumber=${orderNumber}`);
      if (!res.ok) throw new Error("Receipt not ready");
      const { order, paystackData } = await res.json();

      const paidAt = paystackData?.paid_at
        ? new Date(paystackData.paid_at).toLocaleString("en-NG", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
        : new Date(order.createdAt).toLocaleString("en-NG", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

      const channel = paystackData?.channel?.toUpperCase() || "—";
      const cardInfo = paystackData?.authorization
        ? `${paystackData.authorization.card_type?.toUpperCase() || ""} ****${paystackData.authorization.last4 || ""}`
        : "—";
      const bank = paystackData?.authorization?.bank || "—";

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pw = doc.internal.pageSize.getWidth();
      let y = 15;

      const goldLine = (yy: number) => {
        doc.setDrawColor(201, 168, 76);
        doc.setLineWidth(0.5);
        doc.line(15, yy, pw - 15, yy);
      };

      const sectionTitle = (title: string) => {
        y += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(26, 26, 26);
        doc.text(title, 15, y);
        y += 6;
      };

      const kv = (label: string, value: string, opts?: { mono?: boolean; color?: number[] }) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(102, 102, 102);
        doc.text(label, 15, y);
        doc.setFont(opts?.mono ? "courier" : "helvetica", "normal");
        if (opts?.color) doc.setTextColor(opts.color[0], opts.color[1], opts.color[2]);
        else doc.setTextColor(26, 26, 26);
        doc.text(value, pw - 15, y, { align: "right" });
        y += 5;
      };

      // ── Logo ──
      if (logoRef.current) {
        try {
          doc.addImage(logoRef.current, "JPEG", pw / 2 - 15, y, 30, 30);
          y += 34;
        } catch { y += 4; }
      } else {
        y += 4;
      }

      // ── Header ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(201, 168, 76);
      doc.text("BETHEL EMPIRE", pw / 2, y, { align: "center" });
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(102, 102, 102);
      doc.text("Premium Handcrafted Bags", pw / 2, y, { align: "center" });
      y += 4;
      doc.setFontSize(8);
      doc.text("contact@bethelempire.com", pw / 2, y, { align: "center" });
      y += 6;
      goldLine(y);
      y += 6;

      // ── Title ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(26, 26, 26);
      doc.text("PAYMENT RECEIPT", pw / 2, y, { align: "center" });
      y += 8;

      // ── Order Details ──
      sectionTitle("ORDER DETAILS");
      kv("Order Number:", order.orderNumber, { mono: true });
      kv("Date:", paidAt);
      kv("Status:", "PAID", { color: [22, 163, 74] });

      // ── Customer ──
      sectionTitle("CUSTOMER");
      kv("Name:", order.customerName);
      kv("Email:", order.customerEmail);
      if (order.customerPhone) kv("Phone:", order.customerPhone);
      kv("Address:", `${order.shippingAddress}, ${order.city}, ${order.state}`);

      // ── Items Table ──
      sectionTitle("ITEMS");
      doc.setFillColor(245, 237, 214);
      doc.rect(15, y - 3, pw - 30, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(26, 26, 26);
      doc.text("Item", 18, y + 1);
      doc.text("Qty", 130, y + 1, { align: "center" });
      doc.text("Price", 155, y + 1, { align: "right" });
      doc.text("Total", 185, y + 1, { align: "right" });
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      for (const item of order.items) {
        const lines = doc.splitTextToSize(item.name || "", 110);
        doc.setTextColor(26, 26, 26);
        doc.text(lines[0], 18, y);
        doc.setTextColor(102, 102, 102);
        doc.text(String(item.quantity), 130, y, { align: "center" });
        doc.text(fmt(item.price), 155, y, { align: "right" });
        doc.text(fmt(item.price * item.quantity), 185, y, { align: "right" });
        y += 5;
      }

      y += 2;
      goldLine(y);
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(26, 26, 26);
      doc.text("Total Paid:", 140, y, { align: "right" });
      doc.setTextColor(201, 168, 76);
      doc.text(fmt(order.total), 195, y, { align: "right" });
      y += 8;

      // ── Payment Details ──
      goldLine(y);
      y += 5;
      sectionTitle("PAYMENT DETAILS");
      kv("Reference:", order.paystackRef || "—", { mono: true });
      kv("Amount:", fmt(order.total));
      kv("Currency:", paystackData?.currency || "NGN");
      kv("Channel:", channel);
      kv("Card:", cardInfo);
      kv("Bank:", bank);
      if (paystackData?.id) kv("Transaction ID:", `#${paystackData.id}`);
      if (paystackData?.paid_at) kv("Paid At:", paystackData.paid_at ? new Date(paystackData.paid_at).toLocaleString("en-NG") : "—");
      if (paystackData?.fees != null) kv("Transaction Fee:", fmt(paystackData.fees / 100));

      // ── Footer ──
      y = Math.max(y + 10, 270);
      goldLine(y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(102, 102, 102);
      doc.text("This is a computer-generated receipt. No signature required.", pw / 2, y, { align: "center" });
      y += 4;
      doc.text("Thank you for choosing Bethel Empire!", pw / 2, y, { align: "center" });

      doc.save(`receipt-${order.orderNumber}.pdf`);

      fetch("/api/cart/clear", { method: "POST" }).catch(() => {});
    } catch (err: any) {
      toast.error(err.message || "Failed to download receipt");
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 text-sm text-gold hover:text-white border border-gold/40 hover:bg-gold/10 px-5 py-2 transition-colors disabled:opacity-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {loading ? "Generating PDF..." : "Download Receipt"}
    </button>
  );
}
