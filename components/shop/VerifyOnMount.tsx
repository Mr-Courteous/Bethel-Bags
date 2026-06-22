"use client";
import { useEffect } from "react";

export default function VerifyOnMount({
  orderNumber,
  paystackRef,
  isPending,
}: {
  orderNumber: string;
  paystackRef: string;
  isPending: boolean;
}) {
  useEffect(() => {
    if (!isPending || !paystackRef) return;

    fetch("/api/orders/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: paystackRef, orderNumber }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          fetch("/api/cart/clear", { method: "POST" }).catch(() => {});
          if ((window as any).__refreshCartCount) (window as any).__refreshCartCount();
        }
      })
      .catch(() => {});
  }, [isPending, paystackRef, orderNumber]);

  return null;
}
