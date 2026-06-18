export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-empire-black">Add New Product</h1>
        <p className="text-empire-grey text-sm mt-1">Fill in the details below to list a new bag.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
