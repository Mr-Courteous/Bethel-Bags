export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-empire-black">Testimonials</h1>
        <p className="text-empire-grey text-sm mt-1">{testimonials.length} total — approve to show on site</p>
      </div>
      <div className="space-y-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white border border-gray-100 p-6 flex gap-5 items-start">
            <div className="w-10 h-10 bg-gold/20 flex items-center justify-center flex-shrink-0">
              <span className="text-gold font-serif font-bold">{t.authorName[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <p className="font-medium text-empire-black">{t.authorName}</p>
                <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 uppercase tracking-wide">{t.source}</span>
                <span className="text-xs text-empire-grey">{"★".repeat(t.rating)}</span>
              </div>
              <p className="text-empire-grey text-sm leading-relaxed">{t.content}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-xs px-2 py-1 ${t.approved ? "bg-emerald-50 text-emerald-700" : "bg-yellow-50 text-yellow-700"}`}>
                {t.approved ? "Approved" : "Pending"}
              </span>
              <form action={`/api/admin/testimonials/${t.id}/approve`} method="POST">
                <button type="submit" className="text-xs text-blue-600 hover:underline">
                  {t.approved ? "Unapprove" : "Approve"}
                </button>
              </form>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="bg-white border border-gray-100 text-center py-16 text-empire-grey">
            <p className="font-serif text-lg">No testimonials yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
