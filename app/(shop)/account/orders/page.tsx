import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account/orders");

  const userId = (session.user as any)?.id;
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="bg-empire-black py-20 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold" />
            <p className="text-gold text-xs tracking-[0.4em] uppercase">Account</p>
          </div>
          <h1 className="font-serif text-4xl text-white">My Orders</h1>
          <p className="text-gray-400 mt-2">Welcome back, {session.user?.name?.split(" ")[0]}.</p>
        </div>
      </section>

      <section className="section-padding bg-empire-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-100">
              <span className="font-serif text-8xl text-gold opacity-10">BE</span>
              <h2 className="font-serif text-3xl text-empire-black mt-6 mb-3">No orders yet</h2>
              <p className="text-empire-grey mb-8">Your order history will appear here.</p>
              <Link href="/products" className="btn-gold">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-100 overflow-hidden">
                  {/* Order header */}
                  <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-gray-100 gap-3">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-empire-grey tracking-widests uppercase mb-0.5">Order</p>
                        <p className="font-mono font-bold text-empire-black">{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-empire-grey tracking-widests uppercase mb-0.5">Date</p>
                        <p className="font-medium text-empire-black text-sm">
                          {new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-empire-grey tracking-widests uppercase mb-0.5">Total</p>
                        <p className="font-semibold text-empire-black">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1.5 border uppercase tracking-wide ${STATUS_COLORS[order.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <div className="w-10 h-10 bg-gold-muted flex-shrink-0 flex items-center justify-center">
                            <span className="font-serif text-gold text-sm opacity-40">BE</span>
                          </div>
                          <span className="flex-1 text-empire-black">{item.name}</span>
                          <span className="text-empire-grey">× {item.quantity}</span>
                          <span className="font-medium text-empire-black">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 bg-gray-50 flex items-center justify-between gap-3 text-sm">
                    <p className="text-empire-grey text-xs">
                      Delivering to {order.city}, {order.state}
                    </p>
                    <Link href="/contact" className="text-xs text-gold hover:underline">Need help with this order?</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
