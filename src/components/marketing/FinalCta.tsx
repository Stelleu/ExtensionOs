import { MARKETING_CONFIG } from "@/components/marketing/config";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { GradientButton } from "@/components/marketing/GradientButton";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="marketing-orb left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-[#d4af37]/15 marketing-animate-glow" />

      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
        <ScrollReveal>
          <h2 className="font-display text-3xl text-[var(--mkt-text)] sm:text-4xl lg:text-5xl">
            Ready to run your extension business{" "}
            <span className="marketing-gradient-text italic">like a pro</span>?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[var(--mkt-text-muted)]">
            Join extension specialists who&apos;ve replaced DMs, spreadsheets, and
            generic booking links with one platform built for their craft.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <GradientButton href={MARKETING_CONFIG.signupPath}>
              {MARKETING_CONFIG.trialLabel}
            </GradientButton>
            <GradientButton href={MARKETING_CONFIG.demoSalonPath} variant="ghost">
              View live salon demo
            </GradientButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
