import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-empire-black">Products</h1>
          <p className="text-empire-grey text-sm mt-1">{products.length} products total</p>
        </div>
        <Link href="/admin/products/new" className="btn-gold">+ Add Product</Link>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs tracking-widest uppercase text-empire-grey font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-empire-black">{p.name}</p>
                    <p className="text-xs text-empire-grey">{p.slug}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-empire-grey">{p.category?.name || "—"}</td>
                <td className="px-5 py-4 font-medium">{formatPrice(p.price)}</td>
                <td className="px-5 py-4">
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium ${p.stock > 5 ? "bg-emerald-50 text-emerald-700" : p.stock > 0 ? "bg-orange-50 text-orange-700" : "bg-red-50 text-red-700"}`}>
                    {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-block px-2 py-0.5 text-xs ${p.published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-xs text-blue-600 hover:underline">Edit</Link>
                    <button className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-16 text-empire-grey">
            <p className="text-lg font-serif mb-2">No products yet</p>
            <Link href="/admin/products/new" className="text-sm text-gold hover:underline">Add your first product</Link>
          </div>
        )}
      </div>
    </div>
  );
}
