"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PendingOrderRefresher({ interval = 5000 }: { interval?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), interval);
    return () => clearInterval(id);
  }, [router, interval]);

  return null;
}
