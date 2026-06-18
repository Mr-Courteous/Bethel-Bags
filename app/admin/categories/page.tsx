export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-empire-black">Categories</h1>
          <p className="text-empire-grey text-sm mt-1">{categories.length} categories</p>
        </div>
        <Link href="/admin/categories/new" className="btn-gold">+ Add Category</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-gray-100 p-6 hover:border-gold/30 transition-colors">
            <h3 className="font-serif text-xl text-empire-black mb-1">{cat.name}</h3>
            <p className="text-empire-grey text-sm mb-3">{cat.description || "No description"}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gold">{cat._count.products} product{cat._count.products !== 1 ? "s" : ""}</span>
              <Link href={`/admin/categories/${cat.id}/edit`} className="text-xs text-blue-600 hover:underline">Edit</Link>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full bg-white border border-gray-100 text-center py-16">
            <p className="text-empire-grey font-serif text-lg">No categories yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
