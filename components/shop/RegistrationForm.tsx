"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Course { id: string; title: string; price: number; duration: string; level: string; slug: string; }

export default function RegistrationForm({ courses }: { courses: Course[] }) {
  const searchParams = useSearchParams();
  const preselect = searchParams.get("course");

  const [form, setForm] = useState({
    studentName: "", studentEmail: "", studentPhone: "", courseId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preselect) {
      const match = courses.find((c) => c.slug === preselect);
      if (match) setForm((p) => ({ ...p, courseId: match.id }));
    }
  }, [preselect, courses]);

  function set(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  const selectedCourse = courses.find((c) => c.id === form.courseId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.courseId) return toast.error("Please select a course");
    setLoading(true);
    try {
      const res = await fetch("/api/enrolments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      // Paystack payment
      const PaystackPop = (window as any).PaystackPop;
      if (!PaystackPop) return toast.error("Payment system unavailable. Please try again.");
      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: form.studentEmail,
        amount: selectedCourse!.price * 100,
        ref: data.paystackRef,
        onSuccess: async (reference: any) => {
          await fetch("/api/enrolments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: reference.reference, enrolmentId: data.enrolmentId }),
          });
          toast.success("Enrolment confirmed! Check your email for details.");
        },
        onClose: () => toast("Payment cancelled. Your spot is reserved for 15 minutes."),
      });
      handler.openIframe();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <script src="https://js.paystack.co/v1/inline.js" async />
      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-8 space-y-6">
        <h3 className="font-serif text-2xl text-empire-black">Your Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Full Name *</label>
            <input required value={form.studentName} onChange={(e) => set("studentName", e.target.value)} className="input-field" placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Phone Number *</label>
            <input required value={form.studentPhone} onChange={(e) => set("studentPhone", e.target.value)} className="input-field" placeholder="+234..." />
          </div>
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Email Address *</label>
          <input required type="email" value={form.studentEmail} onChange={(e) => set("studentEmail", e.target.value)} className="input-field" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Select Course *</label>
          <select required value={form.courseId} onChange={(e) => set("courseId", e.target.value)} className="input-field">
            <option value="">Choose a course...</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title} — {formatPrice(c.price)} ({c.duration})</option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <div className="bg-gold-muted border border-gold/20 p-5">
            <p className="text-xs tracking-widests uppercase text-empire-grey mb-2">Selected Course</p>
            <p className="font-serif text-lg text-empire-black">{selectedCourse.title}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-empire-grey">
              <span>Duration: {selectedCourse.duration}</span>
              <span>·</span>
              <span>Level: {selectedCourse.level}</span>
            </div>
            <p className="font-bold text-xl text-empire-black mt-3">{formatPrice(selectedCourse.price)}</p>
          </div>
        )}

        <button type="submit" disabled={loading || !form.courseId} className="btn-gold w-full">
          {loading ? "Processing..." : `Proceed to Payment${selectedCourse ? ` — ${formatPrice(selectedCourse.price)}` : ""}`}
        </button>
        <p className="text-xs text-empire-grey text-center">Secure payment powered by Paystack. Your data is encrypted and safe.</p>
      </form>
    </>
  );
}
