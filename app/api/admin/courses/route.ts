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
    const { title, description, price, duration, level, image, published } = await req.json();
    if (!title || !price) return NextResponse.json({ error: "Title and price required" }, { status: 400 });
    const slug = slugify(title);
    const existing = await prisma.course.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
    const course = await prisma.course.create({
      data: { title, slug: finalSlug, description, price, duration, level, image, published: published ?? true },
    });
    return NextResponse.json(course, { status: 201 });
  } catch (err: any) {
    if (err.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
