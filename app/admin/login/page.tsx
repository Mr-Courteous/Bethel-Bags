"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Welcome, Admin!");
        router.push("/admin");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-empire-black flex items-center justify-center px-4">
      {/* Gold top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 gold-shimmer" />

      <div className="w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-gold/40 mb-4 relative">
            <Image src="/bethel-logo.jpg" alt="Bethel Empire" fill className="object-contain p-1" />
          </div>
          <h1 className="font-serif text-2xl text-white tracking-wide">Bethel Empire</h1>
          <p className="text-xs tracking-[0.3em] text-gold uppercase mt-1">Admin Portal</p>
        </div>

        <div className="bg-empire-charcoal border border-white/5 p-8">
          <h2 className="font-sans text-sm tracking-widest uppercase text-gray-400 mb-6 text-center">
            Administrator Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-empire-black border border-white/10 text-white text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
                placeholder="admin@bethelempire.com"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 bg-empire-black border border-white/10 text-white text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full mt-2">
              {loading ? "Signing in..." : "Sign In to Admin"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          <a href="/" className="hover:text-gold transition-colors">← Back to Store</a>
        </p>
      </div>
    </div>
  );
}
