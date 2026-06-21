"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

export default function CourseForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    duration: initialData?.duration || "",
    level: initialData?.level || "Beginner",
    image: initialData?.image || "",
    published: initialData?.published ?? true,
  });

  function set(k: string, v: any) { setForm((p) => ({ ...p, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const method = initialData ? "PATCH" : "POST";
      const url = initialData ? `/api/admin/courses/${initialData.id}` : "/api/admin/courses";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success(initialData ? "Course updated!" : "Course created!");
      router.push("/admin/courses");
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
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Course Title *</label>
            <input required value={form.title} onChange={(e) => set("title", e.target.value)} className="input-field" placeholder="e.g. Beginner Bag Making Masterclass" />
          </div>
          <div>
            <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Description *</label>
            <textarea required value={form.description} onChange={(e) => set("description", e.target.value)} className="input-field min-h-[180px] resize-y" placeholder="What will students learn?" />
          </div>
          <div>
            <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Cover Image URL</label>
            <input value={form.image} onChange={(e) => set("image", e.target.value)} className="input-field" placeholder="https://res.cloudinary.com/..." />
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Price (₦) *</label>
              <input required type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className="input-field" placeholder="0" min="0" />
            </div>
            <div>
              <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Duration</label>
              <input value={form.duration} onChange={(e) => set("duration", e.target.value)} className="input-field" placeholder="e.g. 4 Weeks" />
            </div>
            <div>
              <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Level</label>
              <select value={form.level} onChange={(e) => set("level", e.target.value)} className="input-field">
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="w-4 h-4 accent-gold" />
              <span className="text-sm text-empire-grey">Published</span>
            </label>
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">{loading ? "Saving..." : initialData ? "Update Course" : "Create Course"}</button>
          <button type="button" onClick={() => router.back()} className="btn-outline w-full">Cancel</button>
        </div>
      </div>
    </form>
  );
}
