import BlogPostForm from "@/components/admin/BlogPostForm";
export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-empire-black mb-2">New Blog Post</h1>
      <p className="text-empire-grey text-sm mb-8">Write and publish an article to your blog.</p>
      <BlogPostForm />
    </div>
  );
}
