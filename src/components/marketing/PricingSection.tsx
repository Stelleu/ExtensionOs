import { MARKETING_CONFIG, PRICING_FEATURES } from "@/components/marketing/config";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { GlassCard } from "@/components/marketing/GlassCard";
import { GradientButton } from "@/components/marketing/GradientButton";

interface PricingSectionProps {
  compact?: boolean;
}

export function PricingSection({ compact }: PricingSectionProps) {
  return (
    <section
      id="pricing"
      className={`relative border-t border-white/5 ${compact ? "py-16" : "py-24 lg:py-32"}`}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {!compact && (
          <ScrollReveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--mkt-accent-rose)]">
              Pricing
            </p>
            <h2 className="mt-4 font-display text-3xl text-[var(--mkt-text)] sm:text-4xl">
              One plan. Everything included.
            </h2>
            <p className="mt-4 max-w-lg text-[var(--mkt-text-muted)]">
              No tiers to decode. No per-booking fees. Just a flat monthly rate
              that grows with your business.
            </p>
          </ScrollReveal>
        )}

        <ScrollReveal delay={100}>
          <GlassCard glow className="mx-auto mt-10 max-w-lg p-8 sm:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--mkt-accent-rose)]">
              Pro
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl marketing-gradient-text">
                {MARKETING_CONFIG.currency}
                {MARKETING_CONFIG.monthlyPrice}
              </span>
              <span className="text-[var(--mkt-text-muted)]">/month</span>
            </div>
            <p className="mt-2 text-sm text-[var(--mkt-text-muted)]">
              Free trial · Cancel anytime
            </p>

            <ul className="mt-8 space-y-3 border-t border-white/5 pt-8">
              {PRICING_FEATURES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-[var(--mkt-text-muted)]"
                >
                  <span className="mt-0.5 text-[var(--mkt-accent-start)]">✦</span>
                  {item}
                </li>
              ))}
            </ul>

            <GradientButton
              href={MARKETING_CONFIG.signupPath}
              className="mt-10 w-full"
            >
              {MARKETING_CONFIG.trialLabel}
            </GradientButton>
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
