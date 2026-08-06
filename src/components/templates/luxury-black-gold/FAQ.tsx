"use client";

import { useState } from "react";
import type { SalonProfile } from "@/types/salon";

interface FAQProps {
  salon: SalonProfile;
}

export function FAQ({ salon }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[#FAF8F5] py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#B8956E]">
            FAQ
          </p>
          <h2 className="mt-4 font-serif text-4xl text-[#1A1614]">
            Got questions?
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {salon.faqs.map((faq, i) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#1A1614]/5"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left"
              >
                <span className="font-medium text-[#1A1614]">{faq.question}</span>
                <span className={`shrink-0 text-[#B8956E] transition-transform ${open === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="border-t border-[#E8E0D8] px-6 pb-6 pt-4">
                  <p className="text-sm leading-relaxed text-[#6B5E58]">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
