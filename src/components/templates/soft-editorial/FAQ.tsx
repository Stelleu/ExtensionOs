"use client";

import { useState } from "react";
import type { SalonProfile } from "@/types/salon";

interface FAQProps {
  salon: SalonProfile;
}

export function FAQ({ salon }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-[#E5DDD4] py-28 lg:py-36">
      <div className="mx-auto max-w-2xl px-8 lg:px-12">
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#C9A897]">
            FAQ
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#2C2825]">
            Common questions
          </h2>
        </div>

        <div className="mt-12 divide-y divide-[#E5DDD4] border-y border-[#E5DDD4]">
          {salon.faqs.map((faq, i) => (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
              >
                <span className="text-sm text-[#2C2825]">{faq.question}</span>
                <span
                  className={`shrink-0 text-[#C9A897] transition-transform ${open === i ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="pb-6">
                  <p className="text-sm leading-relaxed text-[#7A726A]">
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
