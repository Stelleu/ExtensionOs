import type { HairTextureSubtype } from "@/lib/salon-helpers";

/**
 * Original single-strand hair-typing icons.
 * Tall narrow viewBox; stroke tightens from type 1 → 4c.
 */
export function HairTypeIcon({
  subtype,
  selected,
  className,
}: {
  subtype: HairTextureSubtype;
  selected?: boolean;
  className?: string;
}) {
  const stroke = selected ? "#B8956E" : "#6B5E58";
  const path = STRAND_PATHS[subtype];

  return (
    <svg
      viewBox="0 0 24 56"
      aria-hidden
      className={className ?? "h-14 w-6 shrink-0"}
      fill="none"
    >
      <path
        d={path}
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** @deprecated Prefer HairTypeIcon */
export const HairSubtypeIcon = HairTypeIcon;

const STRAND_PATHS: Record<HairTextureSubtype, string> = {
  // Straight — one clean vertical line
  "1": "M12 4 V52",
  // Soft wave
  "2a": "M12 4 C16 12 8 20 12 28 C16 36 8 44 12 52",
  // Medium wave
  "2b": "M12 4 C18 10 6 18 12 24 C18 30 6 38 12 44 C16 48 10 50 12 52",
  // Deep wave
  "2c": "M12 4 C19 9 5 15 12 21 C19 27 5 33 12 39 C19 45 7 49 12 52",
  // Loose curl
  "3a":
    "M12 4 C18 8 6 12 12 16 C18 20 6 24 12 28 C18 32 6 36 12 40 C18 44 8 48 12 52",
  // Medium curl
  "3b":
    "M12 4 C17 7 7 10 12 13 C17 16 7 19 12 22 C17 25 7 28 12 31 C17 34 7 37 12 40 C17 43 8 47 12 52",
  // Tight curl
  "3c":
    "M12 4 C16 6 8 8 12 10 C16 12 8 14 12 16 C16 18 8 20 12 22 C16 24 8 26 12 28 C16 30 8 32 12 34 C16 36 8 38 12 40 C16 42 8 45 12 48 C14 50 11 51 12 52",
  // Soft coil
  "4a":
    "M12 4 C15 5.5 9 7 12 8.5 C15 10 9 11.5 12 13 C15 14.5 9 16 12 17.5 C15 19 9 20.5 12 22 C15 23.5 9 25 12 26.5 C15 28 9 29.5 12 31 C15 32.5 9 34 12 35.5 C15 37 9 38.5 12 40 C15 41.5 9 43.5 12 45.5 C14 47 11 49 12 52",
  // Medium coil
  "4b":
    "M12 4 C14.5 5 9.5 6 12 7 C14.5 8 9.5 9 12 10 C14.5 11 9.5 12 12 13 C14.5 14 9.5 15 12 16 C14.5 17 9.5 18 12 19 C14.5 20 9.5 21 12 22 C14.5 23 9.5 24 12 25 C14.5 26 9.5 27 12 28 C14.5 29 9.5 30 12 31 C14.5 32 9.5 33 12 34 C14.5 35 9.5 36 12 37 C14.5 38 9.5 39.5 12 41 C14.5 42.5 10 45 12 47 C13.5 49 11.5 50.5 12 52",
  // Tight coil
  "4c":
    "M12 4 C14 4.8 10 5.6 12 6.4 C14 7.2 10 8 12 8.8 C14 9.6 10 10.4 12 11.2 C14 12 10 12.8 12 13.6 C14 14.4 10 15.2 12 16 C14 16.8 10 17.6 12 18.4 C14 19.2 10 20 12 20.8 C14 21.6 10 22.4 12 23.2 C14 24 10 24.8 12 25.6 C14 26.4 10 27.2 12 28 C14 28.8 10 29.6 12 30.4 C14 31.2 10 32 12 32.8 C14 33.6 10 34.4 12 35.2 C14 36 10 36.8 12 37.6 C14 38.4 10 39.2 12 40 C14 40.8 10 41.8 12 42.8 C14 43.8 10.5 45.2 12 46.5 C13 47.5 11.5 49 12 52",
};
