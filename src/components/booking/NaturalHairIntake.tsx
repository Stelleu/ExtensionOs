"use client";

import {
  HAIR_TEXTURE_SUBTYPE_GROUPS,
  resolveRecommendations,
  hairTypeFamily,
  type HairTextureSubtype,
  type HairThickness,
  type NaturalHairProfile,
} from "@/lib/salon-helpers";
import type { HairTypeRecommendations } from "@/types/database";
import { HairTypeIcon } from "@/components/booking/HairTypeIcon";

interface NaturalHairIntakeProps {
  textureSubtype: HairTextureSubtype | "";
  thickness: HairThickness | "";
  chemicalTreatment: boolean | null;
  notes: string;
  hairTypeRecommendations?: HairTypeRecommendations;
  hairTypePhotos?: Record<string, string>;
  /** Textures from the service's hair addon pricing — used for default recs. */
  availableTextures?: string[];
  onTextureChange: (subtype: HairTextureSubtype) => void;
  onThicknessChange: (thickness: HairThickness) => void;
  onChemicalTreatmentChange: (value: boolean) => void;
  onNotesChange: (notes: string) => void;
}

function formatRecommendationList(labels: string[]): string {
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} or ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, or ${labels[labels.length - 1]}`;
}

function recommendationCopy(
  textureSubtype: HairTextureSubtype,
  thickness: HairThickness | "",
  recommendations: string[]
): string {
  const family = hairTypeFamily(textureSubtype) ?? "natural";
  const hairDesc = thickness ? `${thickness} ${family}` : family;
  return `You have ${hairDesc} hair — we'd recommend ${formatRecommendationList(recommendations)}.`;
}

export function NaturalHairIntake({
  textureSubtype,
  thickness,
  chemicalTreatment,
  notes,
  hairTypeRecommendations = {},
  hairTypePhotos = {},
  availableTextures = [],
  onTextureChange,
  onThicknessChange,
  onChemicalTreatmentChange,
  onNotesChange,
}: NaturalHairIntakeProps) {
  const recommendations = textureSubtype
    ? resolveRecommendations(
        textureSubtype,
        hairTypeRecommendations,
        availableTextures
      )
    : [];

  return (
    <div className="mt-4 min-w-0 space-y-4 overflow-hidden border-t border-[#E8E0D8] pt-4">
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
            <div
              className={`grid w-full min-w-0 gap-1.5 sm:gap-2 ${
                group.subtypes.length === 1
                  ? "grid-cols-1 sm:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-3"
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
                    className={`box-border flex min-h-11 min-w-0 w-full flex-col items-center justify-center gap-1 rounded-xl border px-1.5 py-2.5 text-xs transition-all sm:px-2 sm:py-3 ${
                      selected
                        ? "border-[#B8956E] bg-white ring-2 ring-[#B8956E]/20"
                        : "border-[#E8E0D8] bg-white hover:border-[#B8956E]/40"
                    }`}
                  >
                    <div className="flex h-14 w-10 max-w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#FAF8F5]">
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

      {textureSubtype ? (
        <div className="rounded-xl border border-[#B8956E]/30 bg-[#FAF8F5] px-4 py-3 text-sm text-[#6B5E58]">
          {recommendations.length > 0 ? (
            <p className="font-medium text-[#1A1614]">
              {recommendationCopy(textureSubtype, thickness, recommendations)}
            </p>
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
        </div>
      ) : null}

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
