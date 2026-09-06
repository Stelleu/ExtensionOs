"use client";

import { useEffect, useState } from "react";
import { MARKETING_CONFIG } from "@/components/marketing/config";
import { GradientButton } from "@/components/marketing/GradientButton";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";

export function MarketingHero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      <div
        className="marketing-orb -left-32 top-20 h-96 w-96 bg-[#d4af37]/20 marketing-animate-glow"
        style={{ transform: `translateY(${offset * 0.5}px)` }}
      />
      <div
        className="marketing-orb -right-24 top-40 h-80 w-80 bg-[#c9a897]/15 marketing-animate-glow"
        style={{ transform: `translateY(${offset * 0.3}px)` }}
      />
      <div
        className="marketing-orb bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 bg-[#1a1224]"
        style={{ transform: `translate(-50%, ${offset * 0.2}px)` }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <ScrollReveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--mkt-accent-rose)]">
            <span className="h-1.5 w-1.5 rounded-full marketing-gradient-bg" />
            For extension specialists only
          </p>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <h1 className="mt-8 max-w-4xl font-display text-[2.75rem] leading-[1.05] tracking-tight text-[var(--mkt-text)] sm:text-5xl lg:text-7xl">
            Your booking site, client CRM, and{" "}
            <span className="marketing-gradient-text italic">
              consultation flow
            </span>{" "}
            — in one place
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--mkt-text-muted)]">
            {MARKETING_CONFIG.productName} is the platform built specifically for
            hair-extension stylists. Live booking, automatic client profiles,
            hair-texture matching, and maintenance reminders — without the
            generic salon software bloat.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={240}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <GradientButton href={MARKETING_CONFIG.signupPath}>
              {MARKETING_CONFIG.trialLabel}
            </GradientButton>
            <GradientButton href="/#demo" variant="ghost">
              See how it works
            </GradientButton>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={320}>
          <div
            className="marketing-animate-float relative mx-auto mt-20 max-w-4xl"
            style={{ transform: `translateY(${-offset * 0.1}px)` }}
          >
            <div className="marketing-glass marketing-glow overflow-hidden rounded-3xl p-1">
              <div className="rounded-[1.35rem] bg-[var(--mkt-bg-plum)] p-6 sm:p-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="flex-1 text-center text-[10px] uppercase tracking-wider text-[var(--mkt-text-dim)]">
                    yourstudio.extensionos.com
                  </span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Bookings this week", value: "12" },
                    { label: "Returning clients", value: "68%" },
                    { label: "Deposits secured", value: "£840" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                    >
                      <p className="text-[10px] uppercase tracking-wider text-[var(--mkt-text-dim)]">
                        {stat.label}
                      </p>
                      <p className="mt-1 font-display text-2xl marketing-gradient-text">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
