import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-empire-black">Blog Posts</h1>
          <p className="text-empire-grey text-sm mt-1">{posts.length} posts total</p>
        </div>
        <Link href="/admin/blog/new" className="btn-gold">+ New Post</Link>
      </div>
      <div className="bg-white border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Title", "Category", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs tracking-widests uppercase text-empire-grey font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-empire-black">{p.title}</td>
                <td className="px-5 py-4 text-empire-grey">{p.category || "—"}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 text-xs ${p.published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4 text-empire-grey text-xs">
                  {new Date(p.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-5 py-4">
                  <Link href={`/admin/blog/${p.id}/edit`} className="text-xs text-blue-600 hover:underline mr-3">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <div className="text-center py-16 text-empire-grey">
            <p className="font-serif text-lg mb-2">No posts yet</p>
            <Link href="/admin/blog/new" className="text-sm text-gold hover:underline">Write your first post</Link>
          </div>
        )}
      </div>
    </div>
  );
}
