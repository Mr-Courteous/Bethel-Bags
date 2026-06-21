"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CategoryForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const method = initialData ? "PATCH" : "POST";
      const url = initialData ? `/api/admin/categories/${initialData.id}` : "/api/admin/categories";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success(initialData ? "Category updated!" : "Category created!");
      router.push("/admin/categories");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <div className="bg-white border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Category Name *</label>
          <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input-field" placeholder="e.g. Handbags" />
        </div>
        <div>
          <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Description</label>
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input-field min-h-[100px] resize-none" placeholder="Optional description..." />
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button type="submit" disabled={loading} className="btn-gold">{loading ? "Saving..." : initialData ? "Update" : "Create Category"}</button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
