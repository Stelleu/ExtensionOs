import {
  formatNaturalHairProfile,
  getRecommendationFor,
  pricingRowsForRecommendations,
} from "@/lib/salon-helpers";
import type {
  HairAddonPriceRow,
  HairTypeRecommendations,
} from "@/types/database";
import type { NaturalHairProfile } from "@/lib/salon-helpers";
import { HairTypeIcon } from "@/components/booking/HairTypeIcon";
import { HairAddonCard } from "@/components/booking/HairAddonCard";

interface NaturalHairProfileSectionProps {
  profile: NaturalHairProfile | null | undefined;
  hairAddonPricing?: HairAddonPriceRow[];
  hairTypeRecommendations?: HairTypeRecommendations;
  hairTypePhotos?: Record<string, string>;
}

export function NaturalHairProfileSection({
  profile,
  hairAddonPricing = [],
  hairTypeRecommendations = {},
  hairTypePhotos = {},
}: NaturalHairProfileSectionProps) {
  if (!profile?.textureSubtype) return null;

  const recommendations = getRecommendationFor(
    profile.textureSubtype,
    hairTypeRecommendations
  );
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
  const photo = hairTypePhotos[profile.textureSubtype];

  return (
    <div className="mt-4 rounded-xl border border-[#E8E0D8] bg-[#FAF8F5] px-4 py-3 text-sm text-[#6B5E58]">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9C8E86]">
        Natural hair profile
      </p>
      <div className="mt-2 flex items-start gap-3">
        <div className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-[#E8E0D8]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <HairTypeIcon subtype={profile.textureSubtype} selected />
          )}
        </div>
        <div>
          <p className="font-medium text-[#1A1614]">
            {formatNaturalHairProfile(profile)}
          </p>
          {profile.notes && (
            <p className="mt-2 text-sm text-[#6B5E58]">{profile.notes}</p>
          )}
        </div>
      </div>

      <div className="mt-3 border-t border-[#E8E0D8] pt-3 text-xs">
        {recommendations.length > 0 ? (
          <>
            <p className="font-medium text-[#1A1614]">
              Stylist recommendation for this hair type
            </p>
            <div className="mt-2 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
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
          </>
        ) : (
          <p>No recommendation set for this hair type yet.</p>
        )}
      </div>
    </div>
  );
}
