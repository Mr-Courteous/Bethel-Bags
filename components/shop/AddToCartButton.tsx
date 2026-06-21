"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AddToCartButton({ productId, inStock }: { productId: string; inStock: boolean }) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

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
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      // Refresh navbar cart count
      if ((window as any).__refreshCartCount) (window as any).__refreshCartCount();
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
        <Link href="/contact" className="btn-outline w-full text-center text-sm block">Notify Me When Available</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-xs tracking-widest uppercase text-empire-grey w-20">Quantity</label>
        <div className="flex items-center border border-gray-200">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-empire-black text-xl transition-colors">−</button>
          <span className="w-12 text-center text-sm font-semibold">{qty}</span>
          <button type="button" onClick={() => setQty(qty + 1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-empire-black text-xl transition-colors">+</button>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={addToCart} disabled={loading}
          className={`btn-gold flex-1 transition-all ${added ? "bg-emerald-500 border-emerald-500" : ""}`}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-empire-black/30 border-t-empire-black rounded-full animate-spin" />
              Adding...
            </span>
          ) : added ? "✓ Added!" : "Add to Cart"}
        </button>
        <Link href="/cart" className="btn-outline px-4 flex items-center justify-center" title="View Cart">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </Link>
      </div>
      <p className="text-xs text-empire-grey text-center">Free returns within 7 days · Secure checkout</p>
    </div>
  );
}
