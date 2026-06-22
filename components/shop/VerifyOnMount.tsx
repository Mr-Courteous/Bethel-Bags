"use client";
import { useEffect, useRef } from "react";

export default function VerifyOnMount({
  orderNumber,
  paystackRef,
  isPending,
}: {
  orderNumber: string;
  paystackRef: string;
  isPending: boolean;
}) {
  const called = useRef(false);

  useEffect(() => {
    if (!isPending || !paystackRef || called.current) return;
    called.current = true;

    fetch("/api/orders/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: paystackRef, orderNumber }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && (window as any).__refreshCartCount) {
          (window as any).__refreshCartCount();
        }
      })
      .catch(() => {});
  }, [isPending, paystackRef, orderNumber]);

  return null;
}
