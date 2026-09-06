"use client";

import type { TemplateId } from "@/types/salon";
import { salonThemes, TEMPLATE_IDS } from "@/lib/templates";

const swatches: Record<
  TemplateId,
  { bg: string; accent: string; headingClass: string; bodyClass: string }
> = {
  "luxury-black-gold": {
    bg: "bg-[#1A1614]",
    accent: "bg-[#B8956E]",
    headingClass: "font-serif text-[#FAF8F5]",
    bodyClass: "text-[#9C8E86]",
  },
  "soft-editorial": {
    bg: "bg-[#FAF6F1]",
    accent: "bg-[#C9A897]",
    headingClass: "font-[family-name:var(--font-cormorant)] text-[#2C2825]",
    bodyClass: "text-[#7A726A]",
  },
  "bold-afro": {
    bg: "bg-[#1B4332]",
    accent: "bg-[#E8A849]",
    headingClass: "font-[family-name:var(--font-nunito)] font-bold text-[#FFF8F0]",
    bodyClass: "text-[#E8A849]/80",
  },
};

interface ThemePickerProps {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <fieldset className="block">
      <legend className="mb-3 block text-xs uppercase tracking-wider text-[#9C8E86]">
        Site theme
      </legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {TEMPLATE_IDS.map((id) => {
          const theme = salonThemes[id];
          const swatch = swatches[id];
          const selected = value === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`overflow-hidden rounded-2xl text-left ring-2 transition-all ${
                selected
                  ? "ring-[#1A1614] shadow-md"
                  : "ring-[#E8E0D8] hover:ring-[#C9A897]/60"
              }`}
            >
              <div
                className={`relative px-4 py-5 ${swatch.bg} border-b border-black/5`}
              >
                <div className={`h-1.5 w-10 rounded-full ${swatch.accent}`} />
                <p
                  className={`mt-3 text-lg leading-tight ${swatch.headingClass}`}
                >
                  Aa
                </p>
                <p className={`mt-1 text-[10px] uppercase tracking-[0.2em] ${swatch.bodyClass}`}>
                  Heading · Body
                </p>
                {selected && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-[#1A1614] shadow">
                    ✓
                  </span>
                )}
              </div>
              <div className="bg-white px-4 py-3">
                <p className="text-sm font-medium text-[#1A1614]">{theme.name}</p>
              </div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
