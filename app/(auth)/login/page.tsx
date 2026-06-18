"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import toast from "react-hot-toast";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
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
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push(callbackUrl);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-empire-light flex">
      {/* Left panel - gold branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-empire-black flex-col justify-between p-12">
        <Logo variant="light" size="lg" />
        <div>
          <h2 className="font-serif text-5xl text-white leading-tight mb-4">
            Welcome<br />
            <span className="text-transparent bg-clip-text bg-gold-gradient">Back.</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Sign in to access your orders, wishlist, and exclusive member benefits.
          </p>
        </div>
        <p className="text-gray-600 text-xs tracking-widest uppercase">Bethel Empire – Crafted With Passion</p>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <h1 className="font-serif text-3xl text-empire-black mb-2">Sign In</h1>
          <p className="text-empire-grey text-sm mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-gold hover:underline">Create one</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-empire-grey text-center mt-6">
            <Link href="/forgot-password" className="hover:text-gold transition-colors">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-empire-light flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

