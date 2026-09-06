import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { GlassCard } from "@/components/marketing/GlassCard";

const contrasts = [
  {
    generic: "One booking form for every salon type",
    extensionos: "Hair-texture consultation built into checkout",
  },
  {
    generic: "You manually track client history in spreadsheets",
    extensionos: "CRM updates automatically with every booking",
  },
  {
    generic: "Clients forget maintenance — you chase them in DMs",
    extensionos: "Automated maintenance reminders before the window closes",
  },
  {
    generic: "Your site looks like everyone else's template",
    extensionos: "Three premium themes designed for extension brands",
  },
];

export function PositioningSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="marketing-orb right-0 top-1/2 h-72 w-72 -translate-y-1/2 bg-[#d4af37]/10" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <ScrollReveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--mkt-accent-rose)]">
            Built for specialists
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-3xl text-[var(--mkt-text)] sm:text-4xl lg:text-5xl">
            Generic salon software wasn&apos;t built for{" "}
            <span className="marketing-gradient-text italic">your craft</span>
          </h2>
          <p className="mt-6 max-w-2xl text-[var(--mkt-text-muted)] leading-relaxed">
            Extension work has a consultation flow, a maintenance cycle, and a
            client relationship that generic booking tools simply ignore.
            ExtensionOS was designed around all three.
          </p>
        </ScrollReveal>

        <div className="mt-14 space-y-4">
          {contrasts.map((row, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <GlassCard className="overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="border-b border-white/5 p-6 md:border-b-0 md:border-r">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--mkt-text-dim)]">
                      Generic tools
                    </p>
                    <p className="mt-2 text-sm text-[var(--mkt-text-muted)] line-through decoration-[var(--mkt-text-dim)]">
                      {row.generic}
                    </p>
                  </div>
                  <div className="bg-white/[0.02] p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--mkt-accent-rose)]">
                      ExtensionOS
                    </p>
                    <p className="mt-2 text-sm text-[var(--mkt-text)]">
                      {row.extensionos}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
