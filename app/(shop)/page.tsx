import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import NewsletterForm from "@/components/shop/NewsletterForm";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, published: true },
    include: { category: true },
    take: 3,
  });
}

async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { approved: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
}

export default async function HomePage() {
  const [featured, testimonials] = await Promise.all([getFeaturedProducts(), getTestimonials()]);

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative bg-empire-black min-h-[92vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <span
            className="absolute right-[-8vw] top-1/2 -translate-y-1/2 font-serif font-bold text-white opacity-[0.03] leading-none"
            style={{ fontSize: "55vw" }}
          >BE</span>
        </div>
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 gold-shimmer" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl animate-fadeInUp">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gold" />
              <p className="text-gold font-sans text-xs tracking-[0.4em] uppercase">Premium Handcrafted Bags</p>
            </div>
            <h1 className="font-serif text-6xl lg:text-8xl text-white leading-[1.05] mb-8">
              Wear the<br />
              <span className="text-transparent bg-clip-text bg-gold-gradient italic">Empire.</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-lg">
              Every Bethel Empire bag is handcrafted with precision and passion — a statement piece that speaks before you do.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-gold text-sm">Shop Collection</Link>
              <Link href="/gallery" className="btn-outline text-sm">View Gallery</Link>
            </div>
          </div>
        </div>

        {/* Bottom scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-8 bg-gold animate-pulse" />
          <p className="text-gold text-[10px] tracking-widest uppercase">Scroll</p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-gold py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "500+", label: "Bags Crafted" },
              { num: "200+", label: "Happy Customers" },
              { num: "50+", label: "Trainees Graduated" },
              { num: "5★", label: "Average Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-2xl font-bold text-empire-black">{s.num}</p>
                <p className="font-sans text-xs tracking-widest uppercase text-empire-black/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section-padding bg-empire-light">
        <div className="container-max">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Curated Collection</p>
              <h2 className="font-serif text-4xl lg:text-5xl text-empire-black">Featured Pieces</h2>
              <div className="h-px w-16 bg-gold-gradient mt-4" />
            </div>
            <Link href="/products" className="text-sm text-empire-grey hover:text-gold transition-colors tracking-wide uppercase self-end">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.length > 0 ? featured.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="card-product group">
                <div className="aspect-[4/3] bg-gold-muted overflow-hidden relative">
                  {product.images[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif text-7xl text-gold opacity-20">BE</span>
                    </div>
                  )}
                  {product.comparePrice && (
                    <span className="absolute top-3 left-3 bg-gold text-empire-black text-xs font-bold px-2 py-1 uppercase tracking-wide">
                      Sale
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-empire-grey tracking-wide uppercase mb-1">{product.category?.name}</p>
                  <h3 className="font-serif text-xl text-empire-black group-hover:text-gold transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-empire-black">{formatPrice(product.price)}</span>
                      {product.comparePrice && (
                        <span className="text-sm text-empire-grey line-through">{formatPrice(product.comparePrice)}</span>
                      )}
                    </div>
                    <span className="text-xs text-gold tracking-wide uppercase">View →</span>
                  </div>
                </div>
              </Link>
            )) : (
              // Placeholders while no products
              ["Imperial Leather Handbag", "Empire Signature Tote", "Gold Evening Clutch"].map((name, i) => (
                <div key={i} className="card-product group">
                  <div className="aspect-[4/3] bg-gold-muted flex items-center justify-center">
                    <span className="font-serif text-7xl text-gold opacity-20">BE</span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-empire-grey tracking-wide uppercase mb-1">Handbags</p>
                    <h3 className="font-serif text-xl text-empire-black">{name}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-semibold text-empire-black">₦45,000</span>
                      <span className="text-xs text-gold tracking-wide uppercase">View →</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── WHY BETHEL EMPIRE ── */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Why Choose Us</p>
              <h2 className="font-serif text-4xl lg:text-5xl text-empire-black leading-tight mb-6">
                Craftsmanship<br />You Can Feel.
              </h2>
              <p className="text-empire-grey leading-relaxed mb-8">
                At Bethel Empire, every stitch is intentional. We source premium materials and combine traditional techniques with contemporary design to create bags that are not just accessories — they are heirlooms.
              </p>
              <div className="space-y-5">
                {[
                  { icon: "✦", title: "100% Handcrafted", desc: "Each piece is made by hand with attention to every detail." },
                  { icon: "✦", title: "Premium Materials", desc: "Only the finest leathers, fabrics, and hardware are used." },
                  { icon: "✦", title: "Made in Nigeria", desc: "Proudly designed and crafted in Nigeria for the world." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-gold text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-sans font-semibold text-empire-black text-sm mb-1">{item.title}</h4>
                      <p className="text-empire-grey text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn-dark mt-10 inline-flex">Our Story</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] bg-gold-muted flex items-center justify-center col-span-2 md:col-span-1">
                <span className="font-serif text-8xl text-gold opacity-20">B</span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="aspect-square bg-empire-black flex items-center justify-center">
                  <span className="text-gold text-4xl">✦</span>
                </div>
                <div className="aspect-square bg-gold-muted flex items-center justify-center">
                  <span className="font-serif text-5xl text-gold opacity-30">E</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRAINING CTA ── */}
      <section className="relative section-padding bg-empire-charcoal overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none opacity-5">
          <span className="absolute right-[-5%] top-[-10%] font-serif font-bold text-white leading-none" style={{ fontSize: "60vw" }}>B</span>
        </div>
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="container-max relative">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Learn The Craft</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6">Turn Your Passion Into a Business</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              Join our hands-on bag-making masterclass and learn from expert artisans. From complete beginner to confident creator in just a few weeks.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/training" className="btn-gold">Explore Courses</Link>
              <Link href="/gallery" className="btn-outline">See Students' Work</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-empire-light">
          <div className="container-max">
            <div className="text-center mb-12">
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">What People Say</p>
              <h2 className="font-serif text-4xl text-empire-black">Loved By Many</h2>
              <div className="h-px w-16 bg-gold-gradient mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-7 border border-gray-100">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-gold text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-empire-grey text-sm leading-relaxed mb-5 italic">"{t.content}"</p>
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div className="w-8 h-8 bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold font-serif font-bold text-sm">{t.authorName[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-empire-black text-sm">{t.authorName}</p>
                      <p className="text-xs text-empire-grey uppercase tracking-wide">{t.source}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/testimonials" className="btn-outline text-sm">Read More Reviews</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ── */}
      <section className="section-padding bg-gold">
        <div className="container-max">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-serif text-3xl text-empire-black mb-3">Stay in the Loop</h2>
            <p className="text-empire-black/70 text-sm mb-8">New arrivals, exclusive offers, and bag-making tips — delivered to your inbox.</p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
