export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  CONFIRMED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default async function AdminEnrolmentsPage() {
  const enrolments = await prisma.enrolment.findMany({
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-empire-black">Enrolments</h1>
        <p className="text-empire-grey text-sm mt-1">{enrolments.length} total enrolments</p>
      </div>
      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Student", "Course", "Fee", "Status", "Date"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs tracking-widests uppercase text-empire-grey font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enrolments.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-empire-black">{e.studentName}</p>
                  <p className="text-xs text-empire-grey">{e.studentEmail}</p>
                </td>
                <td className="px-5 py-4 text-empire-grey">{e.course.title}</td>
                <td className="px-5 py-4 font-medium">{formatPrice(e.course.price)}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 text-xs font-medium ${STATUS_COLORS[e.status] || "bg-gray-100 text-gray-600"}`}>{e.status}</span>
                </td>
                <td className="px-5 py-4 text-empire-grey text-xs">
                  {new Date(e.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {enrolments.length === 0 && (
          <div className="text-center py-16 text-empire-grey">
            <p className="font-serif text-lg">No enrolments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
