export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: { _count: { select: { enrolments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-empire-black">Courses</h1>
          <p className="text-empire-grey text-sm mt-1">{courses.length} courses</p>
        </div>
        <Link href="/admin/courses/new" className="btn-gold">+ Add Course</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div key={c.id} className="bg-white border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-2 bg-gold-gradient" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 uppercase tracking-wide">{c.level}</span>
                <span className={`text-xs px-2 py-0.5 ${c.published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {c.published ? "Published" : "Draft"}
                </span>
              </div>
              <h3 className="font-serif text-xl text-empire-black mb-2">{c.title}</h3>
              <p className="text-empire-grey text-sm mb-4 line-clamp-2">{c.description}</p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <p className="font-bold text-empire-black">{formatPrice(c.price)}</p>
                  <p className="text-xs text-empire-grey">{c._count.enrolments} enrolled · {c.duration}</p>
                </div>
                <Link href={`/admin/courses/${c.id}/edit`} className="text-xs text-blue-600 hover:underline">Edit</Link>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full bg-white border border-gray-100 text-center py-16">
            <p className="text-empire-grey font-serif text-lg mb-2">No courses yet</p>
            <Link href="/admin/courses/new" className="text-sm text-gold hover:underline">Add first course</Link>
          </div>
        )}
      </div>
    </div>
  );
}
