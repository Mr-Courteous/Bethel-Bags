"use client";
import { useEffect } from "react";

export default function CartCountRefresher() {
  useEffect(() => {
    if ((window as any).__refreshCartCount) (window as any).__refreshCartCount();
  }, []);

  return null;
}
