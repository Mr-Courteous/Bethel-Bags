import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug, published: true } });
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug, published: true } });
  if (!post) notFound();

  return (
    <div>
      <section className="bg-empire-black py-20 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link href="/blog" className="text-gold text-sm hover:underline flex items-center gap-2 mb-8">← Back to Blog</Link>
          {post.category && <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">{post.category}</p>}
          <h1 className="font-serif text-4xl lg:text-5xl text-white leading-tight">{post.title}</h1>
          <p className="text-gray-400 text-sm mt-4">
            {post.publishedAt && new Date(post.publishedAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="prose prose-lg max-w-none text-empire-grey leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link href="/blog" className="btn-outline text-sm">← More Articles</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
