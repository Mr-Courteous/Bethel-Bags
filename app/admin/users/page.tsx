export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-empire-black">Customers</h1>
        <p className="text-empire-grey text-sm mt-1">{users.length} registered customers</p>
      </div>
      <div className="bg-white border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Customer", "Email", "Orders", "Joined"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs tracking-widests uppercase text-empire-grey font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold/15 flex items-center justify-center">
                      <span className="text-gold font-serif font-bold text-sm">{(u.name || u.email)[0].toUpperCase()}</span>
                    </div>
                    <span className="font-medium text-empire-black">{u.name || "—"}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-empire-grey">{u.email}</td>
                <td className="px-5 py-4 text-empire-grey">{u._count.orders}</td>
                <td className="px-5 py-4 text-empire-grey text-xs">
                  {new Date(u.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-16 text-empire-grey">
            <p className="font-serif text-lg">No customers yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
