import { SalonTemplate } from "@/components/templates/SalonTemplate";
import { TEMPLATE_IDS } from "@/lib/templates";
import { compareSalon } from "@/lib/theme-compare-fixture";
import type { TemplateId } from "@/types/salon";

/** Side-by-side theme QA — not linked from marketing nav. */
export default function ThemeComparePage() {
  return (
    <div className="min-h-screen bg-[#111]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111]/95 px-4 py-3 backdrop-blur">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white/70">
          Theme structure compare · scroll each column
        </p>
      </header>
      <div className="grid lg:grid-cols-3">
        {TEMPLATE_IDS.map((id) => (
          <div
            key={id}
            className="max-h-[100svh] overflow-y-auto border-white/10 lg:border-r"
          >
            <div className="sticky top-0 z-10 bg-black/80 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
              {id}
            </div>
            <div className="origin-top scale-[0.92] lg:scale-[0.85]">
              <SalonTemplate salon={compareSalon(id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
