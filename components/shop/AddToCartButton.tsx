"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AddToCartButton({ productId, inStock }: { productId: string; inStock: boolean }) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  async function addToCart() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: qty }),
      });
      if (!res.ok) throw new Error();
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!inStock) {
    return (
      <div className="space-y-3">
        <button disabled className="btn-gold w-full opacity-50 cursor-not-allowed">Out of Stock</button>
        <Link href="/contact" className="btn-outline w-full text-center text-sm">Contact Us for Restock Notification</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-xs tracking-widests uppercase text-empire-grey">Quantity</label>
        <div className="flex items-center border border-gray-200">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-empire-black text-lg">−</button>
          <span className="w-10 text-center text-sm font-medium">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-empire-black text-lg">+</button>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={addToCart} disabled={loading} className="btn-gold flex-1">
          {loading ? "Adding..." : "Add to Cart"}
        </button>
        <Link href="/cart" className="btn-outline px-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
