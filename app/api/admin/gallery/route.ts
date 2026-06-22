import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { image, title, category, description } = await req.json();
    if (!image) return NextResponse.json({ error: "Image URL required" }, { status: 400 });
    const item = await prisma.galleryItem.create({ data: { image, title, category, description } });
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    if (err.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
