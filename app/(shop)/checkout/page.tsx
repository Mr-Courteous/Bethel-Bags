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
          {/* Progress steps */}
          <div className="flex items-center gap-2 mt-6">
            {[
              { step: "1", label: "Cart" },
              { step: "2", label: "Details" },
              { step: "3", label: "Payment" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-2">
                <div className={`w-7 h-7 flex items-center justify-center text-xs font-bold ${i < 2 ? "bg-gold text-empire-black" : "border border-gold/40 text-gold"}`}>
                  {i < 1 ? "✓" : s.step}
                </div>
                <span className={`text-xs uppercase tracking-wide ${i < 2 ? "text-gold" : "text-gray-500"}`}>{s.label}</span>
                {i < 2 && <div className="w-8 h-px bg-gold/30 mx-1" />}
              </div>
            ))}
          </div>
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
