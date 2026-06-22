"use client";
import { useRouter } from "next/navigation";

export default function ReceiptPrintButton() {
  const router = useRouter();

  return (
    <div className="max-w-[210mm] mx-auto bg-white print:hidden px-8 pt-4 pb-2 flex justify-between items-center">
      <button
        onClick={() => router.back()}
        className="text-sm text-empire-grey hover:text-empire-black"
      >
        &larr; Back
      </button>
      <button
        onClick={() => window.print()}
        className="btn-gold text-sm"
      >
        Print / Save as PDF
      </button>
    </div>
  );
}
