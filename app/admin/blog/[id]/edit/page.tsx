import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BlogPostForm from "@/components/admin/BlogPostForm";
import Link from "next/link";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();
  return (
    <div>
      <Link href="/admin/blog" className="text-xs text-empire-grey hover:text-gold mb-3 flex items-center gap-1">← Back to Blog</Link>
      <h1 className="font-serif text-3xl text-empire-black mb-8">Edit Post</h1>
      <BlogPostForm initialData={post} />
    </div>
  );
}
