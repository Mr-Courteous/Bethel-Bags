import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GalleryItemForm from "@/components/admin/GalleryItemForm";
import Link from "next/link";

export default async function EditGalleryItemPage({ params }: { params: { id: string } }) {
  const item = await prisma.galleryItem.findUnique({ where: { id: params.id } });
  if (!item) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/gallery" className="text-xs text-empire-grey hover:text-gold transition-colors flex items-center gap-1 mb-3">← Back to Gallery</Link>
        <h1 className="font-serif text-3xl text-empire-black">Edit Gallery Item</h1>
        <p className="text-empire-grey text-sm mt-1">{item.title || "Untitled"}</p>
      </div>
      <GalleryItemForm initialData={item} />
    </div>
  );
}
