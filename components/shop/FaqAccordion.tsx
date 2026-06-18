"use client";
import { useState } from "react";

interface FaqItem { q: string; a: string; }
interface FaqCategory { category: string; items: FaqItem[]; }

export default function FaqAccordion({ faqs }: { faqs: FaqCategory[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {faqs.map((section) => (
        <div key={section.category}>
          <div className="flex items-center gap-4 mb-5">
            <h2 className="font-serif text-xl text-empire-black">{section.category}</h2>
            <div className="flex-1 h-px bg-gold/30" />
          </div>
          <div className="space-y-2">
            {section.items.map((item) => {
              const id = `${section.category}-${item.q}`;
              const isOpen = open === id;
              return (
                <div key={id} className="bg-white border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gold/5 transition-colors"
                  >
                    <span className="font-sans font-medium text-empire-black pr-4">{item.q}</span>
                    <span className={`text-gold text-xl flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-64" : "max-h-0"}`}>
                    <p className="px-6 pb-6 text-empire-grey text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
