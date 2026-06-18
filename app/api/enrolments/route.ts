import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { studentName, studentEmail, studentPhone, courseId } = await req.json();
    if (!studentName || !studentEmail || !courseId) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const paystackRef = `BE-ENR-${nanoid(10).toUpperCase()}`;
    const enrolment = await prisma.enrolment.create({
      data: {
        studentName, studentEmail, studentPhone,
        courseId,
        userId: (session?.user as any)?.id || null,
        paystackRef,
        status: "PENDING",
      },
    });
    return NextResponse.json({ enrolmentId: enrolment.id, paystackRef }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create enrolment" }, { status: 500 });
  }
}
