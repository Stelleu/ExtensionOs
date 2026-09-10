"use client";

import {
  HAIR_TEXTURE_SUBTYPE_GROUPS,
  getRecommendationFor,
  pricingRowsForRecommendations,
  type HairTextureSubtype,
  type HairThickness,
  type NaturalHairProfile,
} from "@/lib/salon-helpers";
import type { HairAddonPriceRow, HairTypeRecommendations } from "@/types/database";
import { HairTypeIcon } from "@/components/booking/HairTypeIcon";
import { HairAddonCard } from "@/components/booking/HairAddonCard";

interface NaturalHairIntakeProps {
  textureSubtype: HairTextureSubtype | "";
  thickness: HairThickness | "";
  chemicalTreatment: boolean | null;
  notes: string;
  hairAddonPricing: HairAddonPriceRow[];
  hairTypeRecommendations?: HairTypeRecommendations;
  hairTypePhotos?: Record<string, string>;
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
  hairTypeRecommendations = {},
  hairTypePhotos = {},
  onTextureChange,
  onThicknessChange,
  onChemicalTreatmentChange,
  onNotesChange,
}: NaturalHairIntakeProps) {
  const recommendations = textureSubtype
    ? getRecommendationFor(textureSubtype, hairTypeRecommendations)
    : [];
  const matchedRows = pricingRowsForRecommendations(
    recommendations,
    hairAddonPricing
  );
  const freeTextOnly = recommendations.filter(
    (label) =>
      !hairAddonPricing.some(
        (row) => row.texture.toLowerCase() === label.toLowerCase()
      )
  );

  return (
    <div className="mt-4 min-w-0 space-y-4 overflow-hidden border-t border-[#E8E0D8] pt-4">
      <div>
        <p className="text-sm font-medium text-[#1A1614]">
          Tell us about your natural hair
        </p>
        <p className="mt-1 text-xs text-[#9C8E86]">
          This helps your stylist prepare not a final recommendation.
        </p>
      </div>

      <div className="space-y-3">
        {HAIR_TEXTURE_SUBTYPE_GROUPS.map((group) => (
          <div key={group.family}>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#9C8E86]">
              {group.label}
            </p>
            <div
              className={`grid gap-2 ${
                group.subtypes.length === 1
                  ? "grid-cols-1 sm:grid-cols-3"
                  : "grid-cols-3"
              }`}
            >
              {group.subtypes.map((subtype) => {
                const selected = textureSubtype === subtype;
                const photo = hairTypePhotos[subtype];
                return (
                  <button
                    key={subtype}
                    type="button"
                    onClick={() => onTextureChange(subtype)}
                    className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-xs transition-all ${
                      selected
                        ? "border-[#B8956E] bg-white ring-2 ring-[#B8956E]/20"
                        : "border-[#E8E0D8] bg-white hover:border-[#B8956E]/40"
                    }`}
                  >
                    <div className="flex h-14 w-10 items-center justify-center overflow-hidden rounded-lg bg-[#FAF8F5]">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <HairTypeIcon subtype={subtype} selected={selected} />
                      )}
                    </div>
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
              className={`min-h-11 rounded-full px-4 py-2.5 text-xs font-medium capitalize transition-all ${
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
          Do you have any chemical treatment (relaxer, colour, keratin, etc.)?
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
              className={`min-h-11 rounded-full px-4 py-2.5 text-xs font-medium transition-all ${
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

      {textureSubtype && (
        <div className="rounded-xl border border-[#B8956E]/30 bg-[#FAF8F5] px-4 py-3 text-sm text-[#6B5E58]">
          {recommendations.length > 0 ? (
            <>
              <p className="font-medium text-[#1A1614]">
                Your stylist recommends these for your hair type:
              </p>
              {(matchedRows.length > 0 || freeTextOnly.length > 0) && (
                <div className="mt-3 -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                  {matchedRows.map((entry) => (
                    <HairAddonCard
                      key={`${entry.length}-${entry.texture}`}
                      entry={entry}
                    />
                  ))}
                  {freeTextOnly.map((label) => (
                    <HairAddonCard
                      key={label}
                      entry={{ length: "—", texture: label, price: 0 }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p>
              Your stylist will help you choose the best match at your
              appointment.
            </p>
          )}
          <p className="mt-2 text-xs text-[#9C8E86]">
            She&apos;ll confirm the best option for you before your appointment.
          </p>
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
