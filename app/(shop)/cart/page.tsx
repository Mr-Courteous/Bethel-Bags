export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import CartPageClient from "@/components/shop/CartPageClient";

export const metadata: Metadata = { title: "Shopping Cart" };

export default function CartPage() {
  return (
    <div>
      <section className="bg-empire-black py-20 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold" />
            <p className="text-gold text-xs tracking-[0.4em] uppercase">Your Cart</p>
          </div>
          <h1 className="font-serif text-5xl text-white">Shopping Cart</h1>
        </div>
      </section>
      <section className="section-padding bg-empire-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <CartPageClient />
        </div>
      </section>
    </div>
  );
}
