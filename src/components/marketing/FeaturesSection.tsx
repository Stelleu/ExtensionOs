import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { GlassCard } from "@/components/marketing/GlassCard";

const features = [
  {
    title: "Automatic client CRM",
    body: "Every booking builds a client profile — visit count, hair notes, and history — with zero manual data entry.",
    accent: "01",
  },
  {
    title: "Hair-texture matching",
    body: "Clients complete a natural-hair intake during booking. You see their texture profile and suggested addon matches before they arrive.",
    accent: "02",
  },
  {
    title: "Maintenance reminders",
    body: "Extension clients get automated nudges before their maintenance window closes — so rebooks happen on autopilot.",
    accent: "03",
  },
  {
    title: "Deposits & confirmations",
    body: "Secure deposits at checkout, instant confirmation emails, and prep instructions sent automatically.",
    accent: "04",
  },
  {
    title: "Three premium themes",
    body: "Your booking site reflects your brand — choose from three genuinely distinct designs, not a one-size-fits-all template.",
    accent: "05",
    themes: true,
  },
];

const themeSwatches = [
  { name: "Luxury Black & Gold", bg: "#1A1614", accent: "#B8956E" },
  { name: "Soft Editorial", bg: "#FAF6F1", accent: "#C9A897", text: "#2C2825" },
  { name: "Bold Afro", bg: "#1B4332", accent: "#E8A849" },
];

export function FeaturesSection() {
  return (
    <section className="relative border-t border-white/5 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <ScrollReveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--mkt-accent-rose)]">
            Features
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl text-[var(--mkt-text)] sm:text-4xl">
            Everything an extension artist needs —{" "}
            <span className="marketing-gradient-text italic">nothing you don&apos;t</span>
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 60}>
              <GlassCard className="group h-full p-6 transition-all hover:border-[var(--mkt-accent-rose)]/20 hover:shadow-[0_0_40px_-12px_var(--mkt-glow)] lg:p-8">
                <span className="font-display text-3xl marketing-gradient-text opacity-60">
                  {feature.accent}
                </span>
                <h3 className="mt-4 font-display text-xl text-[var(--mkt-text)]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--mkt-text-muted)]">
                  {feature.body}
                </p>
                {feature.themes && (
                  <div className="mt-5 flex gap-2">
                    {themeSwatches.map((t) => (
                      <div
                        key={t.name}
                        title={t.name}
                        className="h-12 flex-1 overflow-hidden rounded-lg border border-white/10"
                        style={{ background: t.bg }}
                      >
                        <div
                          className="mx-auto mt-4 h-1 w-6 rounded-full"
                          style={{ background: t.accent }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
