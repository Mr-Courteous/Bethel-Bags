export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog",
  description: "Bag-making tips, style guides, and updates from the Bethel Empire team.",
};

async function getPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

const SAMPLE_POSTS = [
  { slug: "how-to-care-for-leather-bags", title: "How to Care For Your Leather Bag", excerpt: "Leather is a premium material that, with proper care, can last a lifetime. Here are the top tips our artisans swear by.", category: "Care Tips", publishedAt: new Date("2025-03-15") },
  { slug: "how-to-start-bag-business", title: "How to Start a Bag-Making Business in Nigeria", excerpt: "Thinking of turning your passion for bag-making into a business? Here's a step-by-step guide from people who've done it.", category: "Business", publishedAt: new Date("2025-04-02") },
  { slug: "2025-bag-trends", title: "2025 Bag Trends: What's Hot Right Now", excerpt: "From structured totes to micro bags, we break down the biggest bag trends of the year and how to style them.", category: "Style", publishedAt: new Date("2025-05-10") },
];

export default async function BlogPage() {
  const posts = await getPosts();
  const displayPosts = posts.length > 0 ? posts : SAMPLE_POSTS;
  const [featured, ...rest] = displayPosts;

  return (
    <div>
      {/* Hero */}
      <section className="bg-empire-black py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-gold" />
            <p className="text-gold text-xs tracking-[0.4em] uppercase">Journal</p>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white">The Empire Blog</h1>
          <p className="text-gray-400 mt-4 text-lg max-w-lg">Tips, trends, and stories from the world of handcrafted bags.</p>
        </div>
      </section>

      <section className="section-padding bg-empire-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          {/* Featured post */}
          <Link href={`/blog/${featured.slug}`} className="block mb-12 group">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] lg:aspect-auto bg-gold-muted relative flex items-center justify-center min-h-[280px]">
                {(featured as any).image ? (
                  <Image src={(featured as any).image} alt={featured.title} fill className="object-cover" />
                ) : (
                  <span className="font-serif text-9xl text-gold opacity-10">BE</span>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-gold text-empire-black text-xs font-bold px-3 py-1.5 uppercase tracking-wide">Featured</span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                {featured.category && (
                  <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{featured.category}</p>
                )}
                <h2 className="font-serif text-3xl lg:text-4xl text-empire-black group-hover:text-gold transition-colors leading-tight mb-4">{featured.title}</h2>
                <p className="text-empire-grey leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-empire-grey">
                    {new Date(featured.publishedAt!).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <span className="text-gold text-sm tracking-wide uppercase">Read More →</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Rest of posts */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="card-product group">
                  <div className="aspect-[16/9] bg-gold-muted relative overflow-hidden flex items-center justify-center">
                    {(post as any).image ? (
                      <Image src={(post as any).image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="font-serif text-6xl text-gold opacity-10">BE</span>
                    )}
                  </div>
                  <div className="p-6">
                    {post.category && (
                      <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">{post.category}</p>
                    )}
                    <h3 className="font-serif text-xl text-empire-black group-hover:text-gold transition-colors leading-tight mb-3">{post.title}</h3>
                    <p className="text-empire-grey text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                    <p className="text-xs text-empire-grey">
                      {new Date(post.publishedAt!).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
