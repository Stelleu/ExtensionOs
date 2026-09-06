import type { HairAddonPriceRow } from "@/types/database";
import {
  formatNaturalHairProfile,
  suggestHairMatch,
  type NaturalHairProfile,
} from "@/lib/salon-helpers";

interface NaturalHairProfileSectionProps {
  profile: NaturalHairProfile | null | undefined;
  hairAddonPricing?: HairAddonPriceRow[];
}

export function NaturalHairProfileSection({
  profile,
  hairAddonPricing = [],
}: NaturalHairProfileSectionProps) {
  if (!profile?.textureSubtype) return null;

  const suggestion = suggestHairMatch(profile, hairAddonPricing);
  const matchedTextures = [
    ...new Set(suggestion.matches.map((m) => m.texture)),
  ];

  return (
    <div className="mt-4 rounded-xl border border-[#E8E0D8] bg-[#FAF8F5] px-4 py-3 text-sm text-[#6B5E58]">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9C8E86]">
        Natural hair profile
      </p>
      <p className="mt-1 font-medium text-[#1A1614]">
        {formatNaturalHairProfile(profile)}
      </p>
      {profile.notes && (
        <p className="mt-2 text-sm text-[#6B5E58]">{profile.notes}</p>
      )}

      {hairAddonPricing.length > 0 && (
        <div className="mt-3 border-t border-[#E8E0D8] pt-3 text-xs">
          {matchedTextures.length > 0 ? (
            <p>
              Indicative blend match:{" "}
              <span className="font-medium text-[#1A1614]">
                {matchedTextures.join(", ")}
              </span>
            </p>
          ) : (
            <p>No automatic texture match in this service&apos;s pricing.</p>
          )}
          {suggestion.notes.length > 0 && (
            <ul className="mt-2 space-y-1">
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
