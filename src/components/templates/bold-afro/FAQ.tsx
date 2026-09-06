"use client";

import { useState } from "react";
import type { SalonProfile } from "@/types/salon";

interface FAQProps {
  salon: SalonProfile;
}

export function FAQ({ salon }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[#1B4332] py-20 text-[#FFF8F0] lg:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8A849]">
            FAQ
          </p>
          <h2 className="mt-3 text-4xl font-extrabold">Got questions?</h2>
        </div>

        <div className="mt-10 space-y-3">
          {salon.faqs.map((faq, i) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl bg-[#FFF8F0]/10"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left"
              >
                <span className="font-semibold">{faq.question}</span>
                <span
                  className={`shrink-0 text-[#E8A849] transition-transform ${open === i ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="border-t border-[#FFF8F0]/10 px-6 pb-6 pt-4">
                  <p className="text-sm leading-relaxed text-[#FFF8F0]/80">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
