"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success("Account created! Signing you in...");
      await signIn("credentials", { email: form.email, password: form.password, callbackUrl: "/" });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-empire-light flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 lg:p-10">
        <div className="mb-8"><Logo size="md" /></div>
        <h1 className="font-serif text-3xl text-empire-black mb-2">Create Account</h1>
        <p className="text-empire-grey text-sm mb-8">
          Already have an account? <Link href="/login" className="text-gold hover:underline">Sign in</Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
            { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", key: "password", type: "password", placeholder: "Min. 8 characters" },
            { label: "Confirm Password", key: "confirm", type: "password", placeholder: "Repeat password" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">{label}</label>
              <input
                type={type}
                required
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="input-field"
                placeholder={placeholder}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-gold w-full mt-2">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
