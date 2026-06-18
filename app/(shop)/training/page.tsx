import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Training & Courses",
  description: "Learn bag-making from expert artisans at Bethel Empire. Enrol in our hands-on masterclasses.",
};

async function getCourses() {
  return prisma.course.findMany({ where: { published: true }, orderBy: { createdAt: "asc" } });
}

const SAMPLE_COURSES: any[] = [
  { id: "1", slug: "beginner-bag-making", title: "Beginner Bag Making Masterclass", description: "Learn the fundamentals of bag making from scratch. Covers materials, cutting, stitching, lining, and finishing. Perfect for complete beginners.", price: 25000, duration: "4 Weeks", level: "Beginner" },
  { id: "2", slug: "intermediate-leather-craft", title: "Intermediate Leather Craft", description: "Take your skills to the next level with leather-specific techniques including edge finishing, hardware installation, and pattern making.", price: 40000, duration: "6 Weeks", level: "Intermediate" },
  { id: "3", slug: "business-of-bags", title: "The Business of Bags", description: "Learn how to turn your bag-making skill into a profitable business — pricing, marketing, branding, and finding clients.", price: 30000, duration: "3 Weeks", level: "All Levels" },
];

const LEVEL_COLORS: Record<string, string> = {
  "Beginner": "bg-emerald-50 text-emerald-700",
  "Intermediate": "bg-blue-50 text-blue-700",
  "Advanced": "bg-purple-50 text-purple-700",
  "All Levels": "bg-gold/15 text-gold-dark",
};

const perks = [
  { icon: "✦", title: "Expert Instructors", desc: "Learn directly from seasoned artisans with years of professional bag-making experience." },
  { icon: "◈", title: "Hands-On Training", desc: "No theory-only classes. You'll be building real bags from Day 1." },
  { icon: "❖", title: "Certificate Awarded", desc: "Receive a Bethel Empire Certificate of Completion to showcase your new skills." },
  { icon: "✧", title: "Small Class Sizes", desc: "Personalised attention in small groups ensures you learn effectively at your own pace." },
  { icon: "★", title: "Materials Provided", desc: "All materials and tools are included in the training fee. Just show up ready to learn." },
  { icon: "↗", title: "Business Support", desc: "Post-training mentorship to help you launch your own bag business confidently." },
];

export default async function TrainingPage() {
  const courses = await getCourses();
  const displayCourses = courses.length > 0 ? courses : SAMPLE_COURSES;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-empire-black py-28 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]">
          <span className="absolute right-[-5%] top-[-20%] font-serif font-bold text-white leading-none" style={{ fontSize: "60vw" }}>E</span>
        </div>
        <div className="container-max px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-gold" />
            <p className="text-gold text-xs tracking-[0.4em] uppercase">Learn The Craft</p>
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl text-white leading-tight max-w-2xl mb-6">
            Become a<br />
            <span className="text-transparent bg-clip-text bg-gold-gradient italic">Master Artisan.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
            Our hands-on bag-making courses are designed to take you from zero to confident creator — and beyond. Join the growing community of Bethel Empire graduates running their own businesses.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="section-padding bg-white">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Why Train With Us</p>
            <h2 className="font-serif text-4xl text-empire-black">The Bethel Empire Difference</h2>
            <div className="h-px w-16 bg-gold-gradient mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((p) => (
              <div key={p.title} className="flex gap-4 p-6 border border-gray-100 hover:border-gold/30 transition-colors">
                <span className="text-gold text-xl flex-shrink-0 mt-0.5">{p.icon}</span>
                <div>
                  <h3 className="font-sans font-semibold text-empire-black mb-1">{p.title}</h3>
                  <p className="text-empire-grey text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="section-padding bg-empire-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Enrol Today</p>
            <h2 className="font-serif text-4xl text-empire-black">Available Courses</h2>
            <div className="h-px w-16 bg-gold-gradient mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {displayCourses.map((course: any, i: number) => (
              <div key={course.id} className="bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                <div className="h-3 bg-gold-gradient" />
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-xs font-medium px-3 py-1 uppercase tracking-wide ${LEVEL_COLORS[course.level] || "bg-gray-100 text-gray-600"}`}>
                      {course.level}
                    </span>
                    <span className="text-xs text-empire-grey">{course.duration}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-empire-black mb-3 group-hover:text-gold transition-colors">{course.title}</h3>
                  <p className="text-empire-grey text-sm leading-relaxed flex-1 mb-6">{course.description}</p>
                  <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-empire-grey tracking-widest uppercase mb-1">Course Fee</p>
                      <p className="font-serif text-2xl text-empire-black font-bold">{formatPrice(course.price)}</p>
                    </div>
                    <Link href={`/enrol?course=${course.slug}`} className="btn-gold text-xs py-2.5 px-5">
                      Enrol Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-empire-charcoal">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">The Journey</p>
            <h2 className="font-serif text-4xl text-white">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Choose Course", desc: "Select the course that matches your current skill level and goals." },
              { step: "02", title: "Register & Pay", desc: "Complete your registration and make secure payment online." },
              { step: "03", title: "Attend Training", desc: "Show up to our workshop and learn through hands-on practice." },
              { step: "04", title: "Graduate & Grow", desc: "Receive your certificate and start your bag-making journey." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 border border-gold/40 flex items-center justify-center mx-auto mb-4">
                  <span className="font-serif text-gold text-xl font-bold">{s.step}</span>
                </div>
                <h3 className="font-serif text-lg text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="section-padding bg-empire-light">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl text-empire-black mb-4">Have Questions About Training?</h2>
          <p className="text-empire-grey max-w-md mx-auto mb-8">Check our FAQ page or get in touch with us directly.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/faq" className="btn-gold">Read the FAQ</Link>
            <Link href="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
