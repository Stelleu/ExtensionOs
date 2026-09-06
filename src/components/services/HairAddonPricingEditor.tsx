"use client";

import type { HairAddonPriceEntry } from "@/types/database";

interface HairAddonPricingEditorProps {
  rows: HairAddonPriceEntry[];
  onChange: (rows: HairAddonPriceEntry[]) => void;
}

export function HairAddonPricingEditor({
  rows,
  onChange,
}: HairAddonPricingEditorProps) {
  function updateRow(index: number, patch: Partial<HairAddonPriceEntry>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <div className="space-y-3 rounded-2xl border border-[#E8E0D8] bg-[#FAF8F5]/50 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
        Hair addon pricing
      </p>
      <p className="text-xs text-[#6B5E58]">
        Clients only see combinations you list here. Type any length or texture.
      </p>
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div
            key={`${row.length}-${row.texture}-${index}`}
            className="grid grid-cols-[1fr_1fr_5rem_auto] items-center gap-2"
          >
            <input
              type="text"
              value={row.length}
              onChange={(e) => updateRow(index, { length: e.target.value })}
              placeholder='Length (e.g. 18")'
              className="rounded-xl border border-[#E8E0D8] bg-white px-3 py-2 text-sm"
              aria-label="Length"
            />
            <input
              type="text"
              value={row.texture}
              onChange={(e) => updateRow(index, { texture: e.target.value })}
              placeholder="Texture"
              className="rounded-xl border border-[#E8E0D8] bg-white px-3 py-2 text-sm"
              aria-label="Texture"
            />
            <input
              type="number"
              min={0}
              value={row.price}
              onChange={(e) =>
                updateRow(index, { price: Number(e.target.value) })
              }
              className="rounded-xl border border-[#E8E0D8] bg-white px-3 py-2 text-sm"
              aria-label="Price"
            />
            <button
              type="button"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              className="text-xs text-[#9C8E86] hover:text-[#1A1614]"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          onChange([
            ...rows,
            { length: '18"', texture: "body-wavy", price: 120 },
          ])
        }
        className="text-xs font-semibold uppercase tracking-wider text-[#B8956E]"
      >
        + Add row
      </button>
    </div>
  );
}
