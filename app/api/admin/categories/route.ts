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
    const { name, description } = await req.json();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const slug = slugify(name);
    const category = await prisma.category.create({ data: { name, slug, description } });
    return NextResponse.json(category, { status: 201 });
  } catch (err: any) {
    if (err.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if ((err as any).code === "P2002") return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
