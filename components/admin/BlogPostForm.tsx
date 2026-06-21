"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CATEGORIES = ["Care Tips", "Style", "Business", "Behind the Scenes", "News", "Training"];

export default function BlogPostForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
    image: initialData?.image || "",
    published: initialData?.published ?? false,
  });

  function set(k: string, v: any) { setForm((p) => ({ ...p, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.content) return toast.error("Title and content are required");
    setLoading(true);
    try {
      const method = initialData ? "PATCH" : "POST";
      const url = initialData ? `/api/admin/blog/${initialData.id}` : "/api/admin/blog";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, publishedAt: form.published ? new Date().toISOString() : null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success(initialData ? "Post updated!" : "Post created!");
      router.push("/admin/blog");
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
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-100 p-6 space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Title *</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} required className="input-field text-lg" placeholder="Article title..." />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className="input-field min-h-[80px] resize-none" placeholder="Short summary shown on blog listing..." />
            </div>
            <div>
              <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Content * (HTML supported)</label>
              <textarea value={form.content} onChange={(e) => set("content", e.target.value)} required className="input-field min-h-[360px] resize-y font-mono text-sm" placeholder="<p>Write your article here...</p>" />
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white border border-gray-100 p-6 space-y-4">
            <h3 className="font-serif text-lg text-empire-black">Settings</h3>
            <div>
              <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input-field">
                <option value="">No category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Cover Image URL</label>
              <input value={form.image} onChange={(e) => set("image", e.target.value)} className="input-field" placeholder="https://..." />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="w-4 h-4 accent-gold" />
              <span className="text-sm text-empire-grey">Publish immediately</span>
            </label>
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? "Saving..." : initialData ? "Update Post" : "Create Post"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline w-full">Cancel</button>
        </div>
      </div>
    </form>
  );
}
