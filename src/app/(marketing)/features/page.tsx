import type { Metadata } from "next";
import { DemoSection } from "@/components/marketing/DemoSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { PositioningSection } from "@/components/marketing/PositioningSection";
import { FinalCta } from "@/components/marketing/FinalCta";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";

export const metadata: Metadata = {
  title: "Features — ExtensionOS",
  description:
    "Hair-texture consultation, automatic CRM, maintenance reminders, and premium booking themes — built for extension specialists.",
};

export default function FeaturesPage() {
  return (
    <>
      <section className="pt-32 pb-12 lg:pt-40">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <ScrollReveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--mkt-accent-rose)]">
              Features
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl text-[var(--mkt-text)] lg:text-5xl">
              Purpose-built for the extension artist&apos;s workflow
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--mkt-text-muted)]">
              From the client&apos;s first click to their sixth maintenance
              appointment — every touchpoint is designed around how extension
              work actually runs.
            </p>
          </ScrollReveal>
        </div>
      </section>
      <DemoSection />
      <FeaturesSection />
      <PositioningSection />
      <FinalCta />
    </>
  );
}
