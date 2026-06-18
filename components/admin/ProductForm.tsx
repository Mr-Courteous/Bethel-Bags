"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Category } from "@prisma/client";

interface ProductFormProps {
  categories: Category[];
  initialData?: any;
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    comparePrice: initialData?.comparePrice?.toString() || "",
    stock: initialData?.stock?.toString() || "0",
    categoryId: initialData?.categoryId || "",
    featured: initialData?.featured || false,
    published: initialData?.published ?? true,
    images: initialData?.images || [],
  });

  function set(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) return toast.error("Name and price are required");
    setLoading(true);
    try {
      const method = initialData ? "PATCH" : "POST";
      const url = initialData ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
          stock: parseInt(form.stock),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");
      toast.success(initialData ? "Product updated!" : "Product created!");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-100 p-6">
            <h3 className="font-serif text-lg text-empire-black mb-5">Product Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Product Name *</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} className="input-field" placeholder="e.g. Imperial Leather Handbag" required />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Description *</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="input-field min-h-[140px] resize-y" placeholder="Describe this product..." required />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6">
            <h3 className="font-serif text-lg text-empire-black mb-5">Images</h3>
            <p className="text-sm text-empire-grey">Image upload via Cloudinary will be available after setup. For now, enter image URLs:</p>
            <input
              className="input-field mt-3"
              placeholder="https://res.cloudinary.com/..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) { set("images", [...form.images, val]); (e.target as HTMLInputElement).value = ""; }
                }
              }}
            />
            <p className="text-xs text-empire-grey mt-2">Press Enter to add each URL</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {form.images.map((img: string, i: number) => (
                <div key={i} className="flex items-center gap-1 bg-gray-100 px-2 py-1 text-xs">
                  <span className="truncate max-w-[180px]">{img}</span>
                  <button type="button" onClick={() => set("images", form.images.filter((_: any, j: number) => j !== i))} className="text-red-500 ml-1">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-100 p-6">
            <h3 className="font-serif text-lg text-empire-black mb-5">Pricing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Price (₦) *</label>
                <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className="input-field" placeholder="0" min="0" step="0.01" required />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Compare Price (₦)</label>
                <input type="number" value={form.comparePrice} onChange={(e) => set("comparePrice", e.target.value)} className="input-field" placeholder="Optional strikethrough price" min="0" step="0.01" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6">
            <h3 className="font-serif text-lg text-empire-black mb-5">Inventory</h3>
            <div>
              <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Stock Quantity</label>
              <input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} className="input-field" min="0" />
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6">
            <h3 className="font-serif text-lg text-empire-black mb-5">Organisation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Category</label>
                <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="input-field">
                  <option value="">No category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-gold" />
                <span className="text-sm text-empire-grey">Feature on homepage</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="w-4 h-4 accent-gold" />
                <span className="text-sm text-empire-grey">Published (visible in store)</span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? "Saving..." : initialData ? "Update Product" : "Add Product"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline w-full">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
