import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

const STATUS_COLORS: Record<string, string> = {
  PENDING:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID:       "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED:  "bg-red-50 text-red-700 border-red-200",
};

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } }, user: true },
  });
  if (!order) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/orders" className="text-xs text-empire-grey hover:text-gold transition-colors flex items-center gap-1 mb-3">← Back to Orders</Link>
          <h1 className="font-serif text-3xl text-empire-black">Order {order.orderNumber}</h1>
          <p className="text-empire-grey text-sm mt-1">
            Placed {new Date(order.createdAt).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <span className={`text-sm font-medium px-4 py-2 border uppercase tracking-wide ${STATUS_COLORS[order.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left – Items */}
        <div className="lg:col-span-2 space-y-5">
          {/* Order items */}
          <div className="bg-white border border-gray-100 p-6">
            <h2 className="font-serif text-xl text-empire-black mb-5">Items ({order.items.length})</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-14 h-14 bg-gold-muted flex-shrink-0 flex items-center justify-center">
                    <span className="font-serif text-gold text-xl opacity-30">BE</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-empire-black">{item.name}</p>
                    <p className="text-xs text-empire-grey mt-0.5">{formatPrice(item.price)} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-empire-black">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-empire-grey">
                <span>Subtotal</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between font-serif text-xl font-bold text-empire-black border-t border-gray-100 pt-3 mt-3">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-white border border-gray-100 p-6">
            <h2 className="font-serif text-xl text-empire-black mb-5">Payment</h2>
            <div className="space-y-3 text-sm">
              {[
                ["Payment Reference", order.paystackRef || "—"],
                ["Payment Status", order.paystackStatus || "—"],
                ["Order Status", order.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-empire-grey">{label}</span>
                  <span className="font-medium text-empire-black text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right – Customer, Address, Status Update */}
        <div className="space-y-5">
          {/* Customer info */}
          <div className="bg-white border border-gray-100 p-6">
            <h2 className="font-serif text-lg text-empire-black mb-4">Customer</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gold/15 flex items-center justify-center flex-shrink-0">
                <span className="text-gold font-serif font-bold">{order.customerName[0]}</span>
              </div>
              <div>
                <p className="font-semibold text-empire-black">{order.customerName}</p>
                {order.user && <p className="text-xs text-gold tracking-wide">Registered Customer</p>}
              </div>
            </div>
            <div className="space-y-2 text-sm text-empire-grey border-t border-gray-100 pt-4">
              <p>{order.customerEmail}</p>
              {order.customerPhone && <p>{order.customerPhone}</p>}
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white border border-gray-100 p-6">
            <h2 className="font-serif text-lg text-empire-black mb-4">Delivery Address</h2>
            <div className="text-sm text-empire-grey space-y-1">
              <p className="font-medium text-empire-black">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.city}, {order.state}</p>
            </div>
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-empire-grey tracking-widest uppercase mb-1">Notes</p>
                <p className="text-sm text-empire-grey italic">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Status updater */}
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  );
}
