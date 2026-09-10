"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { GlassCard } from "@/components/marketing/GlassCard";
import { DemoSequence } from "@/components/marketing/demo/DemoSequence";
import { BookingDemoMock } from "@/components/marketing/demo/BookingDemoMock";
import { HairConsultDemoMock } from "@/components/marketing/demo/HairConsultDemoMock";
import { DashboardDemoMock } from "@/components/marketing/demo/DashboardDemoMock";

const tabs = [
  {
    id: "booking",
    label: "Client booking",
    title: "Seamless online booking",
    description:
      "Clients pick a service, see only real available slots, and pay their deposit, no back-and-forth DMs.",
  },
  {
    id: "consult",
    label: "Hair consultation",
    title: "Texture-aware consultation",
    description:
      "The hair-type intake and match suggestions generic booking tools simply don't have.",
  },
  {
    id: "dashboard",
    label: "Stylist dashboard",
    title: "Your command centre",
    description:
      "Confirmed bookings, client profiles, and visit history updated automatically.",
  },
] as const;

export function DemoSection() {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("booking");

  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="demo" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <ScrollReveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--mkt-accent-rose)]">
            See it in action
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl text-[var(--mkt-text)] sm:text-4xl lg:text-5xl">
            Watch the flow your clients{" "}
            <span className="marketing-gradient-text italic">actually use</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mt-10 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-all ${
                  activeTab === tab.id
                    ? "marketing-gradient-bg text-[#0c0a0f]"
                    : "border border-white/10 text-[var(--mkt-text-muted)] hover:border-white/20 hover:text-[var(--mkt-text)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={180}>
          <GlassCard glow className="mt-10 p-6 sm:p-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <h3 className="font-display text-2xl text-[var(--mkt-text)]">
                  {active.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--mkt-text-muted)]">
                  {active.description}
                </p>
              </div>

              <div className="min-h-[320px]">
                {activeTab === "booking" && (
                  <DemoSequence intervalMs={2800}>
                    <BookingDemoMock step="service" />
                    <BookingDemoMock step="datetime" />
                    <BookingDemoMock step="confirm" />
                  </DemoSequence>
                )}
                {activeTab === "consult" && (
                  <DemoSequence intervalMs={3200}>
                    <HairConsultDemoMock phase="select" />
                    <HairConsultDemoMock phase="match" />
                  </DemoSequence>
                )}
                {activeTab === "dashboard" && (
                  <DashboardDemoMock />
                )}
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
