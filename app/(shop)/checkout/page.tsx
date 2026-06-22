import type { Metadata } from "next";
import CheckoutClient from "@/components/shop/CheckoutClient";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div>
      <section className="bg-empire-black py-16 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-gold" />
            <p className="text-gold text-xs tracking-[0.4em] uppercase">Secure Checkout</p>
          </div>
          <h1 className="font-serif text-4xl text-white">Checkout</h1>
        </div>
      </section>

      <section className="section-padding bg-empire-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <CheckoutClient />
        </div>
      </section>
    </div>
  );
}
