import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/products" className="text-xs text-empire-grey hover:text-gold transition-colors flex items-center gap-1 mb-3">← Back to Products</Link>
        <h1 className="font-serif text-3xl text-empire-black">Edit Product</h1>
        <p className="text-empire-grey text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm categories={categories} initialData={product} />
    </div>
  );
}
