import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { title, excerpt, content, category, image, published, publishedAt } = await req.json();
    if (!title || !content) return NextResponse.json({ error: "Title and content required" }, { status: 400 });

    const slug = slugify(title);
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const post = await prisma.blogPost.create({
      data: { title, slug: finalSlug, excerpt, content, category, image, published: published || false, publishedAt: published ? new Date(publishedAt || Date.now()) : null },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err: any) {
    if (err.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
