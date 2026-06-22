import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import ReceiptPrintButton from "./ReceiptPrintButton";

export const metadata: Metadata = { title: "Receipt" };

interface PageProps {
  params: { orderNumber: string };
  searchParams: { ref?: string };
}

export default async function ReceiptPage({ params }: PageProps) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { items: true },
  });

  if (!order || order.status !== "PAID") notFound();

  const paystackData = order.receiptData as Record<string, any> | null;

  const paidAt = paystackData?.paid_at
    ? new Date(paystackData.paid_at).toLocaleString("en-NG", {
        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : new Date(order.createdAt).toLocaleString("en-NG", {
        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
      });

  const channel = paystackData?.channel?.toUpperCase() || "—";
  const cardInfo = paystackData?.authorization
    ? `${paystackData.authorization.card_type?.toUpperCase() || ""} ****${paystackData.authorization.last4 || ""}`
    : "—";
  const bank = paystackData?.authorization?.bank || "—";

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <ReceiptPrintButton />

      <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none min-h-screen print:min-h-0 p-8 sm:p-12 print:p-8">
        {/* Header */}
        <div className="text-center border-b-2 border-gold pb-6 mb-6">
          <h1 className="font-serif text-3xl text-empire-black">BETHEL EMPIRE</h1>
          <p className="text-sm text-empire-grey">Premium Handcrafted Bags</p>
          <p className="text-xs text-empire-grey mt-1">contact@bethelempire.com</p>
        </div>

        <h2 className="font-serif text-2xl text-empire-black text-center mb-8">PAYMENT RECEIPT</h2>

        {/* Order & Customer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-empire-grey mb-3">Order Details</h3>
            <div className="space-y-1.5 text-sm">
              <Row label="Order Number" value={order.orderNumber} mono />
              <Row label="Date" value={paidAt} />
              <Row label="Status" value="PAID" color="text-emerald-600" />
              <Row label="Payment Ref" value={order.paystackRef || "—"} mono />
            </div>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-empire-grey mb-3">Customer</h3>
            <div className="space-y-1.5 text-sm">
              <Row label="Name" value={order.customerName} />
              <Row label="Email" value={order.customerEmail} />
              {order.customerPhone && <Row label="Phone" value={order.customerPhone} />}
              <Row label="Address" value={`${order.shippingAddress}, ${order.city}, ${order.state}`} />
            </div>
          </div>
        </div>

        {/* Items */}
        <h3 className="text-xs uppercase tracking-widest text-empire-grey mb-3">Items</h3>
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-2 px-2 font-semibold text-empire-black">Item</th>
              <th className="text-center py-2 px-2 font-semibold text-empire-black w-12">Qty</th>
              <th className="text-right py-2 px-2 font-semibold text-empire-black w-24">Price</th>
              <th className="text-right py-2 px-2 font-semibold text-empire-black w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2 px-2 text-empire-black">{item.name}</td>
                <td className="py-2 px-2 text-center text-empire-grey">{item.quantity}</td>
                <td className="py-2 px-2 text-right text-empire-grey">{formatPrice(item.price)}</td>
                <td className="py-2 px-2 text-right font-medium text-empire-black">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right py-3 px-2 font-semibold text-empire-black text-base">Total Paid</td>
              <td className="text-right py-3 px-2 font-bold text-gold text-base">{formatPrice(order.total)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Payment Details */}
        <h3 className="text-xs uppercase tracking-widest text-empire-grey mb-3">Payment Details</h3>
        <div className="space-y-1.5 text-sm mb-8">
          <Row label="Channel" value={channel} />
          <Row label="Card" value={cardInfo} />
          <Row label="Bank" value={bank} />
          {paystackData?.id && <Row label="Transaction ID" value={`#${paystackData.id}`} />}
          {paystackData?.fees != null && <Row label="Transaction Fee" value={formatPrice(paystackData.fees / 100)} />}
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-200 pt-6 mt-8">
          <p className="text-xs text-empire-grey">
            This is a computer-generated receipt. No signature required.
          </p>
          <p className="text-xs text-empire-grey mt-1">Thank you for choosing Bethel Empire!</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono, color }: { label: string; value: string; mono?: boolean; color?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-empire-grey flex-shrink-0">{label}</span>
      <span className={`font-medium text-right break-all max-w-[60%] ${mono ? "font-mono text-xs" : ""} ${color || "text-empire-black"}`}>
        {value}
      </span>
    </div>
  );
}
