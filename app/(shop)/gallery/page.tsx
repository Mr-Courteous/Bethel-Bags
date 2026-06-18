export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our portfolio of handcrafted bags and students' work at Bethel Empire.",
};

const CATEGORIES = ["All", "Handbags", "Tote Bags", "Clutch Bags", "Backpacks", "Students' Work"];

async function getGalleryItems() {
  return prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <div>
      {/* Hero */}
      <section className="bg-empire-black py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-gold" />
            <p className="text-gold text-xs tracking-[0.4em] uppercase">Portfolio</p>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white leading-tight">
            The Gallery
          </h1>
          <p className="text-gray-400 mt-4 text-lg max-w-xl">
            Every piece tells a story. Browse our collection of handcrafted bags and the beautiful work of our trained artisans.
          </p>
        </div>
      </section>

      {/* Filter tabs - client component placeholder */}
      <section className="bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-30">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                className={`whitespace-nowrap px-5 py-2 text-xs tracking-widest uppercase font-sans transition-colors ${
                  i === 0
                    ? "bg-empire-black text-white"
                    : "text-empire-grey hover:text-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding bg-empire-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          {items.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="break-inside-avoid bg-white overflow-hidden group cursor-pointer border border-gray-100 hover:shadow-lg transition-all">
                  <div className="aspect-square bg-gold-muted relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-6xl text-gold opacity-20">BE</span>
                    </div>
                    <div className="absolute inset-0 bg-empire-black/0 group-hover:bg-empire-black/40 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">View</span>
                    </div>
                  </div>
                  {(item.title || item.category) && (
                    <div className="p-4">
                      {item.title && <p className="font-serif text-sm text-empire-black">{item.title}</p>}
                      {item.category && <p className="text-xs text-gold tracking-wide uppercase mt-0.5">{item.category}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Placeholder grid when no items yet */
            <div>
              <p className="text-center text-empire-grey text-sm mb-8 italic">Gallery items will appear here once added from the admin panel.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-white border border-gray-100 flex items-center justify-center group hover:border-gold/40 transition-colors">
                    <span className="font-serif text-5xl text-gold opacity-10 group-hover:opacity-20 transition-opacity">BE</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upload CTA for students */}
      <section className="section-padding bg-empire-charcoal">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Are you a graduate?</p>
          <h2 className="font-serif text-4xl text-white mb-4">Share Your Work</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Completed one of our courses? We'd love to feature your work in our gallery. Reach out and send us your photos.
          </p>
          <a href="/contact" className="btn-gold">Get In Touch</a>
        </div>
      </section>
    </div>
  );
}
