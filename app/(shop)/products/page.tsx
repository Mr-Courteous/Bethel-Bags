import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our collection of premium handcrafted bags at Bethel Empire.",
};

async function getProducts(category?: string) {
  return prisma.product.findMany({
    where: {
      published: true,
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams.category),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-empire-black py-20 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold" />
            <p className="text-gold text-xs tracking-[0.4em] uppercase">Collection</p>
          </div>
          <h1 className="font-serif text-5xl text-white">Shop All Bags</h1>
          <p className="text-gray-400 mt-3">{products.length} piece{products.length !== 1 ? "s" : ""} available</p>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-30">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            <Link
              href="/products"
              className={`whitespace-nowrap px-5 py-2 text-xs tracking-widest uppercase transition-colors ${!searchParams.category ? "bg-empire-black text-white" : "text-empire-grey hover:text-gold"}`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className={`whitespace-nowrap px-5 py-2 text-xs tracking-widests uppercase transition-colors ${searchParams.category === cat.slug ? "bg-empire-black text-white" : "text-empire-grey hover:text-gold"}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="section-padding bg-empire-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="card-product group">
                  <div className="aspect-square bg-gold-muted overflow-hidden relative flex items-center justify-center">
                    {product.images[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="font-serif text-7xl text-gold opacity-15">BE</span>
                    )}
                    {product.comparePrice && (
                      <span className="absolute top-3 left-3 bg-gold text-empire-black text-xs font-bold px-2 py-1 uppercase tracking-wide">Sale</span>
                    )}
                    {product.featured && !product.comparePrice && (
                      <span className="absolute top-3 left-3 bg-empire-black text-white text-xs px-2 py-1 uppercase tracking-wide">Featured</span>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-xs tracking-widests uppercase text-empire-grey font-medium">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-empire-grey tracking-wide uppercase mb-1">{product.category?.name}</p>
                    <h3 className="font-serif text-lg text-empire-black group-hover:text-gold transition-colors leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="font-semibold text-empire-black">{formatPrice(product.price)}</span>
                      {product.comparePrice && (
                        <span className="text-sm text-empire-grey line-through">{formatPrice(product.comparePrice)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <span className="font-serif text-8xl text-gold opacity-10">BE</span>
              <p className="font-serif text-2xl text-empire-black mt-6 mb-2">No products found</p>
              <p className="text-empire-grey text-sm mb-6">
                {searchParams.category ? "No products in this category yet." : "No products available yet."}
              </p>
              {searchParams.category && (
                <Link href="/products" className="btn-outline text-sm">View All Products</Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
