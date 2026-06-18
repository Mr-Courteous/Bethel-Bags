import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

async function getDashboardStats() {
  const [totalOrders, totalProducts, totalUsers, paidOrders, pendingOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({ where: { status: "PAID" }, select: { total: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  return { totalOrders, totalProducts, totalUsers, revenue, pendingOrders };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: "Total Revenue", value: formatPrice(stats.revenue), icon: "₦", color: "text-gold" },
    { label: "Total Orders", value: stats.totalOrders.toString(), icon: "📦", color: "text-blue-600" },
    { label: "Pending Orders", value: stats.pendingOrders.toString(), icon: "⏳", color: "text-orange-500" },
    { label: "Products", value: stats.totalProducts.toString(), icon: "🛍️", color: "text-emerald-600" },
    { label: "Customers", value: stats.totalUsers.toString(), icon: "👤", color: "text-purple-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-empire-black">Dashboard</h1>
        <p className="text-empire-grey text-sm mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs tracking-widest uppercase text-empire-grey">{s.label}</p>
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className={`font-serif text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Add New Product", desc: "List a new bag in the store", href: "/admin/products/new", icon: "+" },
          { title: "Manage Orders", desc: "View and update order statuses", href: "/admin/orders", icon: "📋" },
          { title: "Add Course", desc: "Create a new training course", href: "/admin/courses/new", icon: "📚" },
        ].map((a) => (
          <a key={a.href} href={a.href} className="bg-white border border-gray-100 p-6 hover:border-gold hover:shadow-md transition-all group">
            <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold text-xl mb-4 group-hover:bg-gold group-hover:text-white transition-colors">
              {a.icon}
            </div>
            <h3 className="font-serif text-lg text-empire-black mb-1">{a.title}</h3>
            <p className="text-sm text-empire-grey">{a.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
