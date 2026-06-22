export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import AddToCartButton from "@/components/shop/AddToCartButton";

function absUrl(url: string) {
  if (url.startsWith("http")) return url;
  const base = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
    || "https://bethelempire.com";
  return `${base.replace(/\/+$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return { title: "Product Not Found" };
  const image = product.images[0] || "/bethel-logo.jpg";
  const ogImage = absUrl(image);
  const title = `${product.name} – Bethel Empire`;
  const description = product.description.slice(0, 155);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, published: true },
    include: { category: true },
  });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { published: true, id: { not: product.id }, categoryId: product.categoryId ?? undefined },
    take: 4,
    include: { category: true },
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-empire-grey">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gold transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-empire-black">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product */}
      <section className="section-padding bg-white">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square bg-gold-muted overflow-hidden relative flex items-center justify-center">
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                ) : (
                  <span className="font-serif text-[10rem] text-gold opacity-10">BE</span>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {product.images.slice(1, 5).map((img, i) => (
                    <div key={i} className="aspect-square bg-gold-muted relative overflow-hidden cursor-pointer border-2 border-transparent hover:border-gold transition-colors">
                      <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {product.category && (
                <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{product.category.name}</p>
              )}
              <h1 className="font-serif text-4xl lg:text-5xl text-empire-black leading-tight mb-5">{product.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-serif text-3xl text-empire-black font-bold">{formatPrice(product.price)}</span>
                {product.comparePrice && (
                  <span className="text-lg text-empire-grey line-through">{formatPrice(product.comparePrice)}</span>
                )}
                {product.comparePrice && (
                  <span className="bg-gold/15 text-gold-dark text-xs font-bold px-2 py-1 uppercase">
                    Save {formatPrice(product.comparePrice - product.price)}
                  </span>
                )}
              </div>

              <p className="text-empire-grey leading-relaxed mb-8">{product.description}</p>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-8">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-sm text-empire-grey">
                  {product.stock > 5 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
                </span>
              </div>

              <AddToCartButton productId={product.id} inStock={product.stock > 0} />

              {/* Meta */}
              <div className="border-t border-gray-100 mt-8 pt-8 space-y-3">
                {[
                  ["Category", product.category?.name || "—"],
                  ["Availability", product.stock > 0 ? "In Stock" : "Out of Stock"],
                  ["Craftsmanship", "100% Handmade"],
                  ["Origin", "Made in Nigeria"],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4 text-sm">
                    <span className="text-empire-grey w-28 flex-shrink-0">{label}</span>
                    <span className="text-empire-black font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="section-padding bg-empire-light">
          <div className="container-max px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl text-empire-black mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="card-product group">
                  <div className="aspect-square bg-gold-muted overflow-hidden relative flex items-center justify-center">
                    {p.images[0] ? (
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="font-serif text-5xl text-gold opacity-15">BE</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-base text-empire-black group-hover:text-gold transition-colors">{p.name}</h3>
                    <p className="font-semibold text-sm mt-2">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
