"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ImageUploader } from "@/components/ui/ImageUploader";

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
    if (!form.image) return toast.error("Please upload an image");
    setLoading(true);
    try {
      const isEdit = !!initialData;
      const method = isEdit ? "PATCH" : "POST";
      const url = isEdit ? `/api/admin/gallery/${initialData.id}` : "/api/admin/gallery";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success(isEdit ? "Gallery item updated!" : "Gallery item added!");
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
          <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Image *</label>
          <ImageUploader value={form.image} onChange={(url) => set("image", url)} />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Title</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className="input-field" placeholder="Optional title" />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Category</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input-field">
            <option value="">No category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button type="submit" disabled={loading} className="btn-gold">{loading ? "Saving..." : initialData ? "Update Gallery Item" : "Add to Gallery"}</button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
