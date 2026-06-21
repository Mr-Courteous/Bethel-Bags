import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import RegistrationForm from "@/components/shop/RegistrationForm";

export const metadata: Metadata = {
  title: "Course Registration",
  description: "Register for a Bethel Empire bag-making course.",
};

async function getCourses() {
  return prisma.course.findMany({ where: { published: true }, orderBy: { price: "asc" } });
}

export default async function RegisterPage() {
  const courses = await getCourses();

  return (
    <div>
      <section className="bg-empire-black py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-gold" />
            <p className="text-gold text-xs tracking-[0.4em] uppercase">Enrolment</p>
          </div>
          <h1 className="font-serif text-5xl text-white">Course Registration</h1>
          <p className="text-gray-400 mt-4 max-w-xl">Fill in your details below to reserve your spot. Payment is required to confirm your enrolment.</p>
        </div>
      </section>

      <section className="section-padding bg-empire-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <RegistrationForm courses={courses} />
            </div>
            <div className="space-y-5">
              <div className="bg-empire-black p-7">
                <h3 className="font-serif text-xl text-white mb-5">What's Included</h3>
                <ul className="space-y-3">
                  {["All materials & tools", "Expert instruction", "Certificate of Completion", "Post-training support", "Access to our alumni network"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="text-gold flex-shrink-0">✦</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-gray-100 p-7">
                <h3 className="font-sans font-semibold text-empire-black mb-3">Need Help?</h3>
                <p className="text-empire-grey text-sm mb-4">Have questions about which course to choose? We're happy to guide you.</p>
                <a href="/contact" className="text-gold text-sm hover:underline">Contact Us →</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
