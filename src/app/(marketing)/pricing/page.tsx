import type { Metadata } from "next";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FinalCta } from "@/components/marketing/FinalCta";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";

export const metadata: Metadata = {
  title: "Pricing — ExtensionOS",
  description:
    "One simple plan for hair-extension specialists. Everything included booking, CRM, consultation flow, and premium themes.",
};

export default function PricingPage() {
  return (
    <>
      <section className="pt-32 pb-4 lg:pt-40">
        <div className="mx-auto max-w-6xl px-6 text-center lg:px-10">
          <ScrollReveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--mkt-accent-rose)]">
              Pricing
            </p>
            <h1 className="mt-4 font-display text-4xl text-[var(--mkt-text)] lg:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-[var(--mkt-text-muted)]">
              No hidden fees. No per-booking charges. One monthly plan with
              everything you need to run a professional extension business.
            </p>
          </ScrollReveal>
        </div>
      </section>
      <PricingSection compact />
      <FinalCta />
    </>
  );
}
