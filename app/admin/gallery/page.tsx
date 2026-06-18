export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-empire-black">Gallery</h1>
          <p className="text-empire-grey text-sm mt-1">{items.length} items</p>
        </div>
        <Link href="/admin/gallery/new" className="btn-gold">+ Add Item</Link>
      </div>
      {items.length === 0 ? (
        <div className="bg-white border border-gray-100 text-center py-20">
          <p className="font-serif text-2xl text-empire-black mb-2">Gallery is empty</p>
          <p className="text-empire-grey text-sm mb-6">Add photos of bags and students' work to showcase on the site.</p>
          <Link href="/admin/gallery/new" className="btn-gold">Add First Item</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((item) => (
            <div key={item.id} className="aspect-square bg-gold-muted border border-gray-100 flex items-center justify-center relative group overflow-hidden">
              <span className="font-serif text-4xl text-gold opacity-20">BE</span>
              <div className="absolute inset-0 bg-empire-black/0 group-hover:bg-empire-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Link href={`/admin/gallery/${item.id}/edit`} className="text-white text-xs uppercase tracking-wide">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
