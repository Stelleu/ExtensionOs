import type { HairTextureSubtype } from "@/lib/salon-helpers";

/** Simple original SVG strand icons — one curl pattern per subtype. */
export function HairSubtypeIcon({
  subtype,
  selected,
}: {
  subtype: HairTextureSubtype;
  selected?: boolean;
}) {
  const stroke = selected ? "#B8956E" : "#6B5E58";
  const path = STRAND_PATHS[subtype];

  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden
      className="h-10 w-10 shrink-0"
      fill="none"
    >
      <path
        d={path}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STRAND_PATHS: Record<HairTextureSubtype, string> = {
  "1a": "M8 24 H40",
  "1b": "M8 24 Q24 22 40 24",
  "1c": "M8 24 Q18 20 28 24 T40 24",
  "2a": "M8 24 Q16 18 24 24 T40 24",
  "2b": "M8 24 Q14 14 24 24 T34 14 T40 24",
  "2c": "M8 24 Q12 12 20 24 T28 12 T36 24 T40 24",
  "3a": "M8 24 Q12 16 16 24 T20 16 T24 24 T28 16 T32 24 T36 16 T40 24",
  "3b": "M8 24 Q10 14 14 24 T18 14 T22 24 T26 14 T30 24 T34 14 T38 24 T40 24",
  "3c": "M8 24 Q9 12 13 24 T17 12 T21 24 T25 12 T29 24 T33 12 T37 24 T40 24",
  "4a": "M8 24 L12 18 L16 24 L20 18 L24 24 L28 18 L32 24 L36 18 L40 24",
  "4b": "M8 24 L11 16 L14 24 L17 16 L20 24 L23 16 L26 24 L29 16 L32 24 L35 16 L38 24 L40 24",
  "4c": "M8 24 L10 14 L13 24 L16 14 L19 24 L22 14 L25 24 L28 14 L31 24 L34 14 L37 24 L40 14 L40 24",
};
