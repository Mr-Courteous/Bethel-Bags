"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen bg-empire-light flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 border border-gold/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-gold text-2xl">!</span>
        </div>
        <h1 className="font-serif text-4xl text-empire-black mb-3">Something went wrong</h1>
        <p className="text-empire-grey mb-8">We encountered an unexpected error. Please try again or contact us if the issue persists.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={reset} className="btn-gold">Try Again</button>
          <Link href="/" className="btn-outline">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
