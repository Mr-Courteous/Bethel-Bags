"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  quantity: number;
  product: { id: string; name: string; price: number; images: string[]; slug: string };
}

const NIGERIA_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

const SHIPPING_RATES: Record<string, number> = {
  "Lagos": 1500,
  "Abuja": 2000,
  "FCT - Abuja": 2000,
  "Rivers": 2500,
  "Kano": 3000,
  "default": 3500,
};

type CheckoutStep = "details" | "paying" | "confirming" | "done";

export default function CheckoutClient() {
  const router = useRouter();
  const [cart, setCart] = useState<{ items: CartItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("details");
  const [paystackReady, setPaystackReady] = useState(false);
  const orderRef = useRef<{ id: string; number: string } | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    state: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then(setCart)
      .finally(() => setLoading(false));
  }, []);

  function set(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  const shippingFee = SHIPPING_RATES[form.state] || SHIPPING_RATES["default"];
  const subtotal = cart?.items.reduce((s, i) => s + i.product.price * i.quantity, 0) || 0;
  const total = subtotal + (form.state ? shippingFee : 0);

  const steps = [
    { key: "details", num: "1", label: "Details" },
    { key: "paying", num: "2", label: "Payment" },
    { key: "done", num: "3", label: "Confirmation" },
  ];

  function stepIndex(k: CheckoutStep) {
    return steps.findIndex((s) => s.key === k);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cart?.items.length) return toast.error("Your cart is empty");

    const PaystackPop = (window as any).PaystackPop;
    if (!PaystackPop) {
      toast.error("Payment system still loading. Please wait a moment and try again.");
      return;
    }

    setSubmitting(true);
    setStep("paying");

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, total }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order");

      const { order, paystackRef: ref } = orderData;
      orderRef.current = { id: order.id, number: order.orderNumber };

      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: form.customerEmail,
        amount: Math.round(total * 100),
        ref,
        currency: "NGN",
        label: `Bethel Empire – Order ${order.orderNumber}`,
        metadata: {
          orderNumber: order.orderNumber,
          customerName: form.customerName,
          custom_fields: [
            { display_name: "Order Number", variable_name: "order_number", value: order.orderNumber },
            { display_name: "Customer Name", variable_name: "customer_name", value: form.customerName },
          ],
        },
        onSuccess: async (response: { reference: string }) => {
          setStep("confirming");
          toast.loading("Confirming payment...");
          try {
            const verifyRes = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference, orderId: order.id }),
            });
            const verifyData = await verifyRes.json();
            toast.dismiss();
            if (verifyData.success) {
              setStep("done");
              if ((window as any).__refreshCartCount) (window as any).__refreshCartCount();
              setTimeout(() => {
                router.push(`/order-confirmation?order=${order.orderNumber}&ref=${response.reference}`);
              }, 600);
            } else {
              setStep("details");
              setSubmitting(false);
              toast.error("Payment received but verification failed. Contact us with your payment reference.");
            }
          } catch {
            toast.dismiss();
            setStep("details");
            setSubmitting(false);
            toast.error("Verification error. Please contact support with reference: " + response.reference);
          }
        },
        onClose: () => {
          setSubmitting(false);
          setStep("details");
          toast("Payment cancelled. Your order is saved — complete payment anytime.", { icon: "ℹ️" });
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setSubmitting(false);
      setStep("details");
      toast.error(err.message || "Something went wrong");
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!cart?.items.length) return (
    <div className="text-center py-24">
      <h2 className="font-serif text-3xl text-empire-black mb-4">Your cart is empty</h2>
      <a href="/products" className="btn-gold">Continue Shopping</a>
    </div>
  );

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
        onLoad={() => setPaystackReady(true)}
        onError={() => console.warn("Paystack script failed to load")}
      />

      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => {
          const currentIdx = stepIndex(step);
          const active = i <= currentIdx;
          return (
            <div key={s.key} className="flex items-center gap-2">
              <div className={`w-7 h-7 flex items-center justify-center text-xs font-bold transition-colors ${
                active ? "bg-gold text-empire-black" : "bg-gray-200 text-gray-400"
              }`}>
                {i < currentIdx ? "✓" : s.num}
              </div>
              <span className={`text-xs uppercase tracking-wide transition-colors ${
                active ? "text-gold font-semibold" : "text-gray-400"
              }`}>{s.label}</span>
              {i < steps.length - 1 && (
                <div className={`w-8 h-px mx-1 transition-colors ${active ? "bg-gold/50" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Payment overlay */}
      {(step === "paying" || step === "confirming") && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
            <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <p className="font-serif text-xl text-empire-black mb-2">
              {step === "paying" ? "Opening Payment Window..." : "Confirming Payment..."}
            </p>
            <p className="text-sm text-empire-grey">
              {step === "paying"
                ? "Please complete the payment in the popup that appears."
                : "Please wait while we verify your transaction."}
            </p>
            {step === "paying" && (
              <button
                type="button"
                onClick={() => { setSubmitting(false); setStep("details"); }}
                className="mt-6 text-xs text-empire-grey hover:text-red-500 underline"
              >
                Cancel Payment
              </button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* LEFT – Shipping form */}
          <div className="lg:col-span-3 space-y-6">

            {/* Contact */}
            <div className="bg-white border border-gray-100 p-7">
              <h2 className="font-serif text-xl text-empire-black mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-gold text-empire-black text-xs font-bold flex items-center justify-center">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Full Name *</label>
                  <input required value={form.customerName} onChange={(e) => set("customerName", e.target.value)} className="input-field" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Phone *</label>
                  <input required value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} className="input-field" placeholder="+234..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Email Address *</label>
                  <input required type="email" value={form.customerEmail} onChange={(e) => set("customerEmail", e.target.value)} className="input-field" placeholder="you@example.com (receipt will be sent here)" />
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white border border-gray-100 p-7">
              <h2 className="font-serif text-xl text-empire-black mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-gold text-empire-black text-xs font-bold flex items-center justify-center">2</span>
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Street Address *</label>
                  <input required value={form.shippingAddress} onChange={(e) => set("shippingAddress", e.target.value)} className="input-field" placeholder="House number, street name, landmark..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">City / Town *</label>
                    <input required value={form.city} onChange={(e) => set("city", e.target.value)} className="input-field" placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">State *</label>
                    <select required value={form.state} onChange={(e) => set("state", e.target.value)} className="input-field">
                      <option value="">Select state...</option>
                      {NIGERIA_STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                {form.state && (
                  <div className="bg-gold-muted border border-gold/20 px-4 py-3 text-sm flex items-center gap-2">
                    <span className="text-gold">📦</span>
                    <span className="text-empire-grey">Shipping to <strong className="text-empire-black">{form.state}</strong>: <strong className="text-empire-black">{formatPrice(shippingFee)}</strong></span>
                  </div>
                )}
                <div>
                  <label className="block text-xs tracking-widest uppercase text-empire-grey mb-2">Order Notes (optional)</label>
                  <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="input-field min-h-[80px] resize-none" placeholder="Special delivery instructions..." />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT – Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 p-7 sticky top-32">
              <h2 className="font-serif text-xl text-empire-black mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 bg-gold-muted flex-shrink-0 relative overflow-hidden">
                      {item.product.images[0] ? (
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-serif text-gold text-xl opacity-30">BE</span>
                        </div>
                      )}
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-empire-black text-[10px] font-bold flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-empire-black font-medium leading-tight line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-empire-grey mt-0.5">× {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-empire-black flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-5 space-y-3 text-sm">
                <div className="flex justify-between text-empire-grey">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-empire-grey">
                  <span>Shipping</span>
                  <span className={form.state ? "text-empire-black font-medium" : "text-empire-grey"}>
                    {form.state ? formatPrice(shippingFee) : "Select state above"}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between font-serif text-xl text-empire-black font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !form.state}
                className="btn-gold w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-empire-black/30 border-t-empire-black rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : !paystackReady ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-empire-black/30 border-t-empire-black rounded-full animate-spin" />
                    Loading payment system...
                  </span>
                ) : (
                  `Pay ${formatPrice(total)}`
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-empire-grey">256-bit SSL encrypted checkout</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
