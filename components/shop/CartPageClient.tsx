"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  quantity: number;
  product: { id: string; name: string; price: number; images: string[]; slug: string; stock: number };
}

export default function CartPageClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCart() {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCart(); }, []);

  async function updateQty(itemId: string, quantity: number) {
    if (quantity < 1) return removeItem(itemId);
    await fetch("/api/cart", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId, quantity }) });
    loadCart();
  }

  async function removeItem(itemId: string) {
    await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" });
    toast.success("Item removed");
    loadCart();
  }

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  if (loading) return (
    <div className="text-center py-24">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  );

  if (items.length === 0) return (
    <div className="text-center py-24 max-w-md mx-auto">
      <span className="font-serif text-8xl text-gold opacity-10">BE</span>
      <h2 className="font-serif text-3xl text-empire-black mt-6 mb-3">Your cart is empty</h2>
      <p className="text-empire-grey mb-8">Looks like you haven't added any bags yet.</p>
      <Link href="/products" className="btn-gold">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-100 p-5 flex gap-5">
            <div className="w-20 h-20 bg-gold-muted flex-shrink-0 relative overflow-hidden">
              {item.product.images[0] ? (
                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-serif text-2xl text-gold opacity-30">BE</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.product.slug}`} className="font-serif text-lg text-empire-black hover:text-gold transition-colors line-clamp-1">{item.product.name}</Link>
              <p className="font-semibold text-empire-black mt-1">{formatPrice(item.product.price)}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center border border-gray-200">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-sm">−</button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-sm">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
            </div>
          </div>
        ))}
        <Link href="/products" className="text-sm text-gold hover:underline flex items-center gap-2 mt-2">← Continue Shopping</Link>
      </div>

      {/* Summary */}
      <div>
        <div className="bg-white border border-gray-100 p-7 sticky top-32">
          <h3 className="font-serif text-xl text-empire-black mb-6">Order Summary</h3>
          <div className="space-y-3 text-sm border-b border-gray-100 pb-5 mb-5">
            <div className="flex justify-between text-empire-grey">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-empire-grey">
              <span>Shipping</span>
              <span className="text-emerald-600">Calculated at checkout</span>
            </div>
          </div>
          <div className="flex justify-between font-serif text-lg text-empire-black font-bold mb-6">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link href="/checkout" className="btn-gold w-full text-center">Proceed to Checkout</Link>
          <p className="text-xs text-empire-grey text-center mt-4">Secure checkout via Paystack</p>
        </div>
      </div>
    </div>
  );
}
