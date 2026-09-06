"use client";

import type { HairAddonPriceRow } from "@/types/database";
import {
  HAIR_TEXTURE_SUBTYPE_GROUPS,
  suggestHairMatch,
  type HairTextureSubtype,
  type HairThickness,
  type NaturalHairProfile,
} from "@/lib/salon-helpers";
import { formatPrice } from "@/lib/format";
import { HairSubtypeIcon } from "@/components/booking/HairSubtypeIcon";

interface NaturalHairIntakeProps {
  textureSubtype: HairTextureSubtype | "";
  thickness: HairThickness | "";
  chemicalTreatment: boolean | null;
  notes: string;
  hairAddonPricing: HairAddonPriceRow[];
  onTextureChange: (subtype: HairTextureSubtype) => void;
  onThicknessChange: (thickness: HairThickness) => void;
  onChemicalTreatmentChange: (value: boolean) => void;
  onNotesChange: (notes: string) => void;
}

export function NaturalHairIntake({
  textureSubtype,
  thickness,
  chemicalTreatment,
  notes,
  hairAddonPricing,
  onTextureChange,
  onThicknessChange,
  onChemicalTreatmentChange,
  onNotesChange,
}: NaturalHairIntakeProps) {
  const profileReady =
    !!textureSubtype && !!thickness && chemicalTreatment !== null;

  const suggestion =
    profileReady && textureSubtype && thickness && chemicalTreatment !== null
      ? suggestHairMatch(
          {
            textureSubtype,
            thickness,
            chemical_treatment: chemicalTreatment,
          },
          hairAddonPricing
        )
      : null;

  const matchedTextures = suggestion
    ? [...new Set(suggestion.matches.map((m) => m.texture))]
    : [];

  return (
    <div className="mt-4 space-y-4 border-t border-[#E8E0D8] pt-4">
      <div>
        <p className="text-sm font-medium text-[#1A1614]">
          Tell us about your natural hair
        </p>
        <p className="mt-1 text-xs text-[#9C8E86]">
          This helps your stylist prepare — not a final recommendation.
        </p>
      </div>

      <div className="space-y-3">
        {HAIR_TEXTURE_SUBTYPE_GROUPS.map((group) => (
          <div key={group.family}>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#9C8E86]">
              {group.label}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {group.subtypes.map((subtype) => {
                const selected = textureSubtype === subtype;
                return (
                  <button
                    key={subtype}
                    type="button"
                    onClick={() => onTextureChange(subtype)}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-xs transition-all ${
                      selected
                        ? "border-[#B8956E] bg-white ring-2 ring-[#B8956E]/20"
                        : "border-[#E8E0D8] bg-white hover:border-[#B8956E]/40"
                    }`}
                  >
                    <HairSubtypeIcon subtype={subtype} selected={selected} />
                    <span className="font-medium uppercase text-[#1A1614]">
                      {subtype}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div>
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
          Thickness
        </span>
        <div className="flex flex-wrap gap-2">
          {(["fine", "medium", "thick"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onThicknessChange(option)}
              className={`rounded-full px-4 py-2 text-xs font-medium capitalize transition-all ${
                thickness === option
                  ? "bg-[#1A1614] text-white"
                  : "border border-[#E8E0D8] bg-white text-[#6B5E58] hover:border-[#B8956E]/40"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
          Chemical treatment
        </span>
        <p className="mb-2 text-xs text-[#9C8E86]">
          Relaxer, colour, keratin, or similar in the last few months?
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ].map(({ value, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => onChemicalTreatmentChange(value)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                chemicalTreatment === value
                  ? "bg-[#1A1614] text-white"
                  : "border border-[#E8E0D8] bg-white text-[#6B5E58] hover:border-[#B8956E]/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#9C8E86]">
          Notes (optional)
        </span>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={2}
          placeholder="Anything else about your natural hair…"
          className="w-full resize-none rounded-xl border border-[#E8E0D8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#B8956E] focus:ring-2 focus:ring-[#B8956E]/20"
        />
      </label>

      {profileReady && (
        <div className="rounded-xl border border-[#B8956E]/30 bg-[#FAF8F5] px-4 py-3 text-sm text-[#6B5E58]">
          {matchedTextures.length > 0 ? (
            <>
              <p>
                Based on what you&apos;ve told us,{" "}
                <span className="font-medium text-[#1A1614]">
                  {matchedTextures.join(", ")}
                </span>{" "}
                may blend best with your natural hair.
              </p>
              {suggestion?.matches.some((m) => m.price > 0) && (
                <p className="mt-2 text-xs text-[#9C8E86]">
                  Available from{" "}
                  {formatPrice(
                    Math.min(...suggestion.matches.map((m) => m.price))
                  )}
                  .
                </p>
              )}
            </>
          ) : (
            <p>
              Your stylist will help you choose the best match at your
              appointment.
            </p>
          )}
          <p className="mt-2 text-xs text-[#9C8E86]">
            Your stylist will confirm the best option for you before your
            appointment.
          </p>
          {suggestion && suggestion.notes.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-[#E8E0D8] pt-3 text-xs">
              {suggestion.notes.map((note) => (
                <li key={note}>· {note}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function buildNaturalHairProfile(input: {
  textureSubtype: HairTextureSubtype | "";
  thickness: HairThickness | "";
  chemicalTreatment: boolean | null;
  notes: string;
}): NaturalHairProfile | null {
  if (
    !input.textureSubtype ||
    !input.thickness ||
    input.chemicalTreatment === null
  ) {
    return null;
  }
  const profile: NaturalHairProfile = {
    textureSubtype: input.textureSubtype,
    thickness: input.thickness,
    chemical_treatment: input.chemicalTreatment,
  };
  const trimmed = input.notes.trim();
  if (trimmed) profile.notes = trimmed;
  return profile;
}
