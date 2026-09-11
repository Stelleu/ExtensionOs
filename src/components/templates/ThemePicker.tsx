"use client";

import type { TemplateId } from "@/types/salon";
import { salonThemes, TEMPLATE_IDS } from "@/lib/templates";

interface ThemePickerProps {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}

/** Mini layout diagrams so swatches reflect structure, not just palette. */
function LayoutPreview({ id }: { id: TemplateId }) {
  if (id === "luxury-black-gold") {
    return (
      <div className="flex h-24 flex-col gap-1 bg-[#1A1614] p-2.5">
        <div className="h-7 rounded-sm bg-[#2C2420]" />
        <div className="grid flex-1 grid-cols-2 gap-1">
          <div className="rounded-sm bg-[#B8956E]/35" />
          <div className="space-y-1">
            <div className="h-1.5 w-3/4 rounded-full bg-[#FAF8F5]/40" />
            <div className="h-1 w-1/2 rounded-full bg-[#9C8E86]/50" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className="h-3 rounded-sm bg-[#B8956E]/25" />
          <div className="h-3 rounded-sm bg-[#B8956E]/25" />
          <div className="h-3 rounded-sm bg-[#B8956E]/25" />
        </div>
      </div>
    );
  }

  if (id === "soft-editorial") {
    return (
      <div className="flex h-24 flex-col gap-1 bg-[#FAF6F1] p-2.5">
        <div className="grid flex-1 grid-cols-2 gap-1">
          <div className="flex flex-col justify-end gap-1 p-1">
            <div className="h-1.5 w-4/5 rounded-full bg-[#2C2825]/50" />
            <div className="h-1 w-3/5 rounded-full bg-[#C9A897]/70" />
          </div>
          <div className="rounded-sm bg-[#C9A897]/40" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1">
            <div className="h-1 flex-1 rounded-full bg-[#2C2825]/25" />
            <div className="h-1 w-4 rounded-full bg-[#C9A897]" />
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 flex-1 rounded-full bg-[#2C2825]/20" />
            <div className="h-1 w-3 rounded-full bg-[#C9A897]/80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-24 flex-col gap-1 bg-[#1B4332] p-2.5">
      <div className="flex flex-1 flex-col justify-end gap-1 pb-1">
        <div className="h-2 w-4/5 rounded-sm bg-[#FFF8F0]/90" />
        <div className="h-2 w-3/5 rounded-sm bg-[#FFF8F0]/70" />
        <div className="h-1.5 w-8 rounded-full bg-[#E8A849]" />
      </div>
      <div className="grid grid-cols-3 gap-1">
        <div className="col-span-2 row-span-2 h-6 rounded-md bg-[#C45C3E]" />
        <div className="h-2.5 rounded-md bg-[#E8A849]" />
        <div className="h-2.5 rounded-md bg-[#FFF8F0]/80" />
      </div>
    </div>
  );
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
              <div className="relative border-b border-black/5">
                <LayoutPreview id={id} />
                {selected && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-[#1A1614] shadow">
                    ✓
                  </span>
                )}
              </div>
              <div className="bg-white px-4 py-3">
                <p className="text-sm font-medium text-[#1A1614]">{theme.name}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-[#9C8E86]">
                  {id === "luxury-black-gold" && "Classic stacked sections"}
                  {id === "soft-editorial" && "Split hero · menu list"}
                  {id === "bold-afro" && "Type hero · bento grid"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
