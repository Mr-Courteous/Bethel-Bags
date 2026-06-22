"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DownloadReceiptButton({ orderNumber }: { orderNumber: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
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

      const fmt = (n: number) => `₦${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

      const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Receipt - ${order.orderNumber}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; font-size: 13px; color: #000; padding: 40px; }
  .receipt { max-width: 300px; margin: 0 auto; }
  h1 { font-size: 20px; text-align: center; letter-spacing: 3px; margin-bottom: 2px; }
  .sub { text-align: center; font-size: 10px; color: #555; margin-bottom: 15px; }
  .divider { border-top: 1px dashed #000; margin: 12px 0; }
  .row { display: flex; justify-content: space-between; margin-bottom: 3px; }
  .label { color: #555; }
  .right { text-align: right; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
  th { border-bottom: 1px dashed #000; padding: 4px 0; font-size: 11px; text-align: left; }
  th:nth-child(2), th:nth-child(3) { text-align: right; }
  td { padding: 4px 0; }
  td:nth-child(2), td:nth-child(3) { text-align: right; }
  .total { font-weight: bold; font-size: 16px; text-align: right; margin-top: 8px; }
  .footer { text-align: center; font-size: 10px; color: #555; margin-top: 20px; }
  .footer span { display: block; margin-bottom: 2px; }
</style></head>
<body>
<div class="receipt">
  <h1>BETHEL EMPIRE</h1>
  <p class="sub">Premium Handcrafted Bags</p>
  <div class="divider"></div>
  <div class="row"><span class="label">Order</span><span>${order.orderNumber}</span></div>
  <div class="row"><span class="label">Date</span><span>${paidAt}</span></div>
  <div class="row"><span class="label">Status</span><span>PAID</span></div>
  <div class="divider"></div>
  <div class="row"><span class="label">Customer</span></div>
  <div class="row"><span class="label">Name</span><span>${order.customerName}</span></div>
  <div class="row"><span class="label">Email</span><span>${order.customerEmail}</span></div>
  ${order.customerPhone ? `<div class="row"><span class="label">Phone</span><span>${order.customerPhone}</span></div>` : ""}
  <div class="row"><span class="label">Address</span><span>${order.shippingAddress}, ${order.city}, ${order.state}</span></div>
  <div class="divider"></div>
  <table>
    <thead><tr><th>Item</th><th>Qty</th><th>Amount</th></tr></thead>
    <tbody>
      ${order.items.map((i: any) => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>${fmt(i.price * i.quantity)}</td></tr>`).join("")}
    </tbody>
  </table>
  <div class="divider"></div>
  <div class="total">Total: ${fmt(order.total)}</div>
  <div class="divider"></div>
  <div class="row"><span class="label">Reference</span><span style="font-size:11px">${order.paystackRef || "—"}</span></div>
  <div class="row"><span class="label">Channel</span><span>${channel}</span></div>
  <div class="row"><span class="label">Card</span><span>${cardInfo}</span></div>
  <div class="row"><span class="label">Bank</span><span>${bank}</span></div>
  ${paystackData?.id ? `<div class="row"><span class="label">Txn ID</span><span>#${paystackData.id}</span></div>` : ""}
  ${paystackData?.fees != null ? `<div class="row"><span class="label">Fee</span><span>${fmt(paystackData.fees / 100)}</span></div>` : ""}
  <div class="divider"></div>
  <div class="footer">
    <span>Thank you for choosing Bethel Empire!</span>
    <span>contact@bethelempire.com</span>
  </div>
</div>
</body></html>`;

      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${order.orderNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error(err.message || "Failed to download receipt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 text-sm text-gold hover:text-white border border-gold/40 hover:bg-gold/10 px-5 py-2 transition-colors disabled:opacity-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {loading ? "Generating..." : "Download Receipt"}
    </button>
  );
}
