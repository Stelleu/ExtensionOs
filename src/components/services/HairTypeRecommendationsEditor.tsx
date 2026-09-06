"use client";

import { useState } from "react";
import type { HairAddonPriceEntry, HairTypeRecommendations } from "@/types/database";
import {
  HAIR_TEXTURE_SUBTYPE_GROUPS,
  type HairTextureSubtype,
} from "@/lib/salon-helpers";
import { HairTypeIcon } from "@/components/booking/HairTypeIcon";

interface HairTypeRecommendationsEditorProps {
  pricing: HairAddonPriceEntry[];
  value: HairTypeRecommendations;
  onChange: (value: HairTypeRecommendations) => void;
  hairTypePhotos?: Record<string, string>;
}

export function HairTypeRecommendationsEditor({
  pricing,
  value,
  onChange,
  hairTypePhotos = {},
}: HairTypeRecommendationsEditorProps) {
  const textures = [
    ...new Set(pricing.map((r) => r.texture.trim()).filter(Boolean)),
  ];
  const [customDraft, setCustomDraft] = useState<
    Partial<Record<HairTextureSubtype, string>>
  >({});

  function selectedFor(subtype: HairTextureSubtype): string[] {
    return value[subtype] ?? [];
  }

  function setLabels(subtype: HairTextureSubtype, labels: string[]) {
    const next = { ...value };
    if (labels.length === 0) {
      delete next[subtype];
    } else {
      next[subtype] = labels;
    }
    onChange(next);
  }

  function toggleTexture(subtype: HairTextureSubtype, texture: string) {
    const current = selectedFor(subtype);
    const exists = current.some(
      (t) => t.toLowerCase() === texture.toLowerCase()
    );
    setLabels(
      subtype,
      exists
        ? current.filter((t) => t.toLowerCase() !== texture.toLowerCase())
        : [...current, texture]
    );
  }

  function addCustom(subtype: HairTextureSubtype) {
    const draft = (customDraft[subtype] ?? "").trim();
    if (!draft) return;
    const current = selectedFor(subtype);
    if (current.some((t) => t.toLowerCase() === draft.toLowerCase())) {
      setCustomDraft((d) => ({ ...d, [subtype]: "" }));
      return;
    }
    setLabels(subtype, [...current, draft]);
    setCustomDraft((d) => ({ ...d, [subtype]: "" }));
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[#E8E0D8] bg-[#FAF8F5]/50 p-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
          Hair type recommendations
        </p>
        <p className="mt-1 text-xs text-[#6B5E58]">
          For each natural hair type, pick textures from your pricing list (or
          add a custom label). Clients see these as suggestions — not a final
          match.
        </p>
      </div>

      {HAIR_TEXTURE_SUBTYPE_GROUPS.map((group) => (
        <div key={group.family} className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9C8E86]">
            {group.label}
          </p>
          {group.subtypes.map((subtype) => {
            const selected = selectedFor(subtype);
            const photo = hairTypePhotos[subtype];
            return (
              <div
                key={subtype}
                className="rounded-xl border border-[#E8E0D8] bg-white p-3"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-14 w-10 items-center justify-center overflow-hidden rounded-lg bg-[#FAF8F5]">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <HairTypeIcon subtype={subtype} />
                    )}
                  </div>
                  <span className="text-sm font-medium uppercase text-[#1A1614]">
                    {subtype}
                  </span>
                </div>

                {textures.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {textures.map((texture) => {
                      const on = selected.some(
                        (t) => t.toLowerCase() === texture.toLowerCase()
                      );
                      return (
                        <button
                          key={texture}
                          type="button"
                          onClick={() => toggleTexture(subtype, texture)}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                            on
                              ? "bg-[#1A1614] text-white"
                              : "border border-[#E8E0D8] text-[#6B5E58] hover:border-[#B8956E]/40"
                          }`}
                        >
                          {texture}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[#9C8E86]">
                    Add hair addon pricing rows above to pick from your textures.
                  </p>
                )}

                {selected.length > 0 && (
                  <p className="mt-2 text-[10px] text-[#9C8E86]">
                    Selected: {selected.join(", ")}
                  </p>
                )}

                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={customDraft[subtype] ?? ""}
                    onChange={(e) =>
                      setCustomDraft((d) => ({
                        ...d,
                        [subtype]: e.target.value,
                      }))
                    }
                    placeholder="Custom recommendation…"
                    className="flex-1 rounded-xl border border-[#E8E0D8] px-3 py-2 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustom(subtype);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addCustom(subtype)}
                    className="rounded-full border border-[#E8E0D8] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#6B5E58]"
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
