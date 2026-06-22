import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  PENDING:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID:       "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED:  "bg-red-50 text-red-700 border-red-200",
};

const STATUS_BG: Record<string, string> = {
  PENDING:    "bg-yellow-50 text-yellow-700",
  PAID:       "bg-blue-50 text-blue-700",
  PROCESSING: "bg-purple-50 text-purple-700",
  SHIPPED:    "bg-indigo-50 text-indigo-700",
  DELIVERED:  "bg-emerald-50 text-emerald-700",
  CANCELLED:  "bg-red-50 text-red-700",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = orders
    .filter((o) => o.status === "PAID" || o.status === "DELIVERED" || o.status === "SHIPPED" || o.status === "PROCESSING")
    .reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <div className="mb-6 lg:mb-8">
        <h1 className="font-serif text-2xl lg:text-3xl text-empire-black">Orders</h1>
        <p className="text-empire-grey text-sm mt-1">{orders.length} total orders · {formatPrice(totalRevenue)} revenue</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 lg:gap-4 mb-6 lg:mb-8">
        {["PENDING","PAID","PROCESSING","SHIPPED","DELIVERED"].map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          return (
            <div key={s} className={`p-3 lg:p-4 border text-center ${STATUS_COLORS[s] || "bg-gray-50 text-gray-600"} border-current/20`}>
              <p className="font-serif text-lg lg:text-2xl font-bold">{count}</p>
              <p className="text-[10px] lg:text-xs uppercase tracking-widest mt-0.5 lg:mt-1 opacity-70">{s}</p>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="bg-white border border-gray-100 overflow-x-auto hidden sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Order #", "Customer", "Items", "Total", "Status", "Date", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs tracking-widest uppercase text-empire-grey font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs font-bold text-gold">{o.orderNumber}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-empire-black">{o.customerName}</p>
                  <p className="text-xs text-empire-grey">{o.customerEmail}</p>
                </td>
                <td className="px-5 py-4 text-empire-grey">{o.items.length}</td>
                <td className="px-5 py-4 font-semibold text-empire-black">{formatPrice(o.total)}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-sm ${STATUS_BG[o.status] || "bg-gray-100 text-gray-600"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-empire-grey text-xs whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-5 py-4">
                  <Link href={`/admin/orders/${o.id}`} className="text-xs text-blue-600 hover:underline font-medium whitespace-nowrap">View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-empire-grey bg-white border border-gray-100">
            <span className="font-serif text-5xl text-gold opacity-10">BE</span>
            <p className="font-serif text-lg mt-4">No orders yet</p>
            <p className="text-sm mt-1">Orders appear here when customers complete checkout.</p>
          </div>
        ) : (
          orders.map((o) => (
            <Link key={o.id} href={`/admin/orders/${o.id}`} className="block bg-white border border-gray-100 p-4 hover:border-gold/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-gold">{o.orderNumber}</span>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm ${STATUS_BG[o.status] || "bg-gray-100 text-gray-600"}`}>
                  {o.status}
                </span>
              </div>
              <p className="font-medium text-empire-black text-sm">{o.customerName}</p>
              <p className="text-xs text-empire-grey truncate">{o.customerEmail}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-sm">
                <span className="text-empire-grey text-xs">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</span>
                <span className="font-semibold text-empire-black">{formatPrice(o.total)}</span>
              </div>
              <p className="text-[10px] text-empire-grey mt-1">
                {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
