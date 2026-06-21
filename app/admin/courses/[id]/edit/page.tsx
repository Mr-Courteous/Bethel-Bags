import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CourseForm from "@/components/admin/CourseForm";
import Link from "next/link";

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const course = await prisma.course.findUnique({ where: { id: params.id } });
  if (!course) notFound();
  return (
    <div>
      <Link href="/admin/courses" className="text-xs text-empire-grey hover:text-gold mb-3 flex items-center gap-1">← Back to Courses</Link>
      <h1 className="font-serif text-3xl text-empire-black mb-8">Edit Course</h1>
      <CourseForm initialData={course} />
    </div>
  );
}
