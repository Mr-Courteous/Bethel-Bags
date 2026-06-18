"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  function set(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent! We'll be in touch soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Full Name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} className="input-field" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Phone</label>
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="input-field" placeholder="+234..." />
        </div>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Email Address *</label>
        <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="input-field" placeholder="you@example.com" />
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Subject</label>
        <select value={form.subject} onChange={(e) => set("subject", e.target.value)} className="input-field">
          <option value="">Select a subject</option>
          <option>Order Enquiry</option>
          <option>Product Question</option>
          <option>Training / Courses</option>
          <option>Custom Order</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-xs tracking-widests uppercase text-empire-grey mb-2">Message *</label>
        <textarea required value={form.message} onChange={(e) => set("message", e.target.value)} className="input-field min-h-[140px] resize-y" placeholder="Tell us how we can help..." />
      </div>
      <button type="submit" disabled={loading} className="btn-gold w-full">
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
