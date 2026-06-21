"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CATEGORIES = ["Handbags", "Tote Bags", "Clutch Bags", "Backpacks", "Students' Work", "Behind the Scenes"];

export default function GalleryItemForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    image: initialData?.image || "",
    title: initialData?.title || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
  });

  function set(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image) return toast.error("Image URL is required");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Gallery item added!");
      router.push("/admin/gallery");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="bg-white border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Image URL *</label>
          <input required value={form.image} onChange={(e) => set("image", e.target.value)} className="input-field" placeholder="https://res.cloudinary.com/..." />
          {form.image && (
            <div className="mt-3 w-32 h-32 bg-gold-muted overflow-hidden">
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as any).style.display = "none"; }} />
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Title</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className="input-field" placeholder="Optional title" />
        </div>
        <div>
          <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Category</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input-field">
            <option value="">No category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button type="submit" disabled={loading} className="btn-gold">{loading ? "Saving..." : "Add to Gallery"}</button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
