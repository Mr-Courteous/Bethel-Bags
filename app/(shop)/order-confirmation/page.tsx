import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Order Confirmed!" };

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { order?: string; ref?: string };
}) {
  if (!searchParams.order) notFound();

  const order = await prisma.order.findUnique({
    where: { orderNumber: searchParams.order },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div>
      <section className="bg-empire-black py-16 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          {/* Success checkmark */}
          <div className="w-20 h-20 border-2 border-gold flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Payment Successful</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-white mb-3">Order Confirmed!</h1>
          <p className="text-gray-400 text-lg">Thank you for shopping with Bethel Empire.</p>
          <div className="mt-5 inline-block bg-gold/10 border border-gold/30 px-6 py-3">
            <p className="text-xs text-gold tracking-widests uppercase mb-1">Order Number</p>
            <p className="font-mono font-bold text-white text-xl tracking-wider">{order.orderNumber}</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-empire-light">
        <div className="container-max px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Order details */}
            <div className="bg-white border border-gray-100 p-6">
              <h2 className="font-serif text-lg text-empire-black mb-4">Order Details</h2>
              <div className="space-y-3 text-sm">
                {[
                  ["Order Number", order.orderNumber],
                  ["Status", order.status],
                  ["Date", new Date(order.createdAt).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
                  ["Payment Ref", searchParams.ref || order.paystackRef || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-empire-grey flex-shrink-0">{label}</span>
                    <span className={`font-medium text-right ${label === "Status" ? "text-emerald-600 uppercase text-xs tracking-wide" : "text-empire-black"}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery details */}
            <div className="bg-white border border-gray-100 p-6">
              <h2 className="font-serif text-lg text-empire-black mb-4">Delivery To</h2>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-empire-black">{order.customerName}</p>
                <p className="text-empire-grey">{order.customerEmail}</p>
                {order.customerPhone && <p className="text-empire-grey">{order.customerPhone}</p>}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-empire-grey">{order.shippingAddress}</p>
                  <p className="text-empire-grey">{order.city}, {order.state}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-100 p-6 mb-6">
            <h2 className="font-serif text-lg text-empire-black mb-5">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-14 h-14 bg-gold-muted flex-shrink-0 flex items-center justify-center">
                    <span className="font-serif text-xl text-gold opacity-30">BE</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-empire-black">{item.name}</p>
                    <p className="text-xs text-empire-grey">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-semibold text-empire-black">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-serif text-xl font-bold text-empire-black">
              <span>Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* What's next */}
          <div className="bg-empire-charcoal p-7 mb-8">
            <h3 className="font-serif text-xl text-white mb-5">What Happens Next?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { icon: "✉️", title: "Confirmation Email", desc: "A receipt has been sent to your email address." },
                { icon: "📦", title: "Order Processing", desc: "We'll start preparing your order within 24 hours." },
                { icon: "🚚", title: "Delivery", desc: `Expected delivery to ${order.state} in 3–7 business days.` },
              ].map((s) => (
                <div key={s.title} className="text-center">
                  <span className="text-3xl block mb-3">{s.icon}</span>
                  <p className="font-sans font-semibold text-white text-sm mb-1">{s.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="btn-gold">Continue Shopping</Link>
            <Link href="/account/orders" className="btn-outline">View My Orders</Link>
            <Link href="/contact" className="btn-dark">Need Help?</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
