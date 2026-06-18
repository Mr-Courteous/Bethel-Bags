import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  PAID: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-purple-50 text-purple-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-empire-black">Orders</h1>
        <p className="text-empire-grey text-sm mt-1">{orders.length} orders total</p>
      </div>

      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Order #", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs tracking-widest uppercase text-empire-grey font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs font-medium text-gold">{o.orderNumber}</td>
                <td className="px-5 py-4">
                  <p className="font-medium">{o.customerName}</p>
                  <p className="text-xs text-empire-grey">{o.customerEmail}</p>
                </td>
                <td className="px-5 py-4 text-empire-grey">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                <td className="px-5 py-4 font-medium">{formatPrice(o.total)}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-sm ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-600"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-empire-grey text-xs whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-5 py-4">
                  <a href={`/admin/orders/${o.id}`} className="text-xs text-blue-600 hover:underline">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-16 text-empire-grey">
            <p className="font-serif text-lg">No orders yet</p>
            <p className="text-sm mt-1">Orders will appear here when customers purchase.</p>
          </div>
        )}
      </div>
    </div>
  );
}
