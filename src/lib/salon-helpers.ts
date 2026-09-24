import type { HairAddonPriceRow, HairTexture } from "@/types/database";

export const HAIR_LENGTHS = ['14"', '16"', '18"', '20"', '22"', '24"', '26"'] as const;

export const HAIR_ADDON_LENGTH_OPTIONS = ['14"', '18"', '22"', '26"'] as const;

export const HAIR_TEXTURES: HairTexture[] = [
  "straight",
  "body-wavy",
  "kinky-curly",
  "yaki",
  "kinky",
];

export const DEFAULT_HAIR_ADDON_PRICING: HairAddonPriceRow[] = [
  { length: '14"', texture: "body-wavy", price: 80 },
  { length: '18"', texture: "straight", price: 120 },
  { length: '22"', texture: "kinky", price: 160 },
  { length: '26"', texture: "kinky-curly", price: 200 },
];

export function parseHairAddonPricing(raw: unknown): HairAddonPriceRow[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const r = row as Record<string, unknown>;
    const length = String(r.length ?? "").trim();
    const texture = String(r.texture ?? "").trim();
    const price = Number(r.price);
    if (!length || !texture || Number.isNaN(price)) {
      return [];
    }
    const imageUrl =
      typeof r.image_url === "string" && r.image_url.trim()
        ? r.image_url.trim()
        : undefined;
    return imageUrl
      ? [{ length, texture, price, image_url: imageUrl }]
      : [{ length, texture, price }];
  });
}

export function findHairAddonPrice(
  rows: HairAddonPriceRow[],
  length: string | null | undefined,
  texture: string | null | undefined
): number | null {
  if (!length || !texture) return null;
  const match = rows.find((r) => r.length === length && r.texture === texture);
  return match ? Number(match.price) : null;
}

export function uniqueAddonLengths(rows: HairAddonPriceRow[]): string[] {
  return [...new Set(rows.map((r) => r.length))];
}

export function texturesForLength(
  rows: HairAddonPriceRow[],
  length: string
): string[] {
  return rows
    .filter((r) => r.length === length)
    .map((r) => r.texture)
    .filter((t, i, arr) => arr.indexOf(t) === i);
}

export function formatDurationLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return h === 1 ? "1 hr" : `${h} hrs`;
  return `${h}h ${m}m`;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);
}

export function formatSlotLabel(time: string): string {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m === 0
    ? `${hour}${period}`
    : `${hour}:${String(m).padStart(2, "0")}${period}`;
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getMonthDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];
  const startPad = (first.getDay() + 6) % 7;
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export const DEFAULT_CANCELLATION_POLICY =
  "Deposits are required to secure your appointment. Deposits are non-refundable in case of late cancellation or no-show.";

export const DEFAULT_DEPOSIT_POLICY =
  "A deposit is required to confirm all bookings (except free consultations). Deposits are non-refundable but transferrable with 48 hours notice.";

export const DEFAULT_AFTERCARE =
  "Avoid oil-based products at the bonds, sleep with hair in a loose braid, and book maintenance every 6–8 weeks for best results.";

export const DEFAULT_PREP_INSTRUCTIONS =
  "Please arrive with clean, dry hair. Avoid heavy oils or styling products on the day of your appointment. Bring any inspiration photos you would like to share with your stylist.";

export type HairTextureSubtype =
  | "1"
  | "2a"
  | "2b"
  | "2c"
  | "3a"
  | "3b"
  | "3c"
  | "4a"
  | "4b"
  | "4c";

export type HairThickness = "fine" | "medium" | "thick";
export type HairTypeFamily = "straight" | "wavy" | "curly" | "coily";

export interface NaturalHairProfile {
  textureSubtype: HairTextureSubtype;
  thickness: HairThickness;
  chemical_treatment: boolean;
  notes?: string;
}

export const HAIR_TEXTURE_SUBTYPES: HairTextureSubtype[] = [
  "1",
  "2a",
  "2b",
  "2c",
  "3a",
  "3b",
  "3c",
  "4a",
  "4b",
  "4c",
];

export const HAIR_TEXTURE_SUBTYPE_GROUPS: {
  family: HairTypeFamily;
  label: string;
  subtypes: HairTextureSubtype[];
}[] = [
  { family: "straight", label: "Straight", subtypes: ["1"] },
  { family: "wavy", label: "Wavy", subtypes: ["2a", "2b", "2c"] },
  { family: "curly", label: "Curly", subtypes: ["3a", "3b", "3c"] },
  { family: "coily", label: "Coily", subtypes: ["4a", "4b", "4c"] },
];

export function hairTypeFamily(subtype: string): HairTypeFamily | null {
  const bucket = subtype.trim().charAt(0);
  if (bucket === "1") return "straight";
  if (bucket === "2") return "wavy";
  if (bucket === "3") return "curly";
  if (bucket === "4") return "coily";
  return null;
}

/** Normalize texture labels so "body-wave" and "body-wavy" match. */
export function normalizeHairTextureKey(texture: string): string {
  const t = texture.toLowerCase().trim().replace(/[_ ]+/g, "-");
  if (t === "body-wave" || t === "bodywave") return "body-wavy";
  if (t === "deep-wavy" || t === "deepwave") return "deep-wave";
  if (t === "kinkycurly") return "kinky-curly";
  return t;
}

/** Default weft textures by natural-hair family when the stylist has not curated. */
const DEFAULT_FAMILY_RECOMMENDATIONS: Record<HairTypeFamily, string[]> = {
  straight: ["straight", "yaki"],
  wavy: ["body-wavy", "body-wave", "deep-wave"],
  curly: ["kinky-curly", "deep-wave"],
  coily: ["kinky", "kinky-curly"],
};

/** Safe lookup of stylist-curated texture recommendations for a hair type. */
export function getRecommendationFor(
  subtype: string | null | undefined,
  hairTypeRecommendations: unknown
): string[] {
  if (!subtype || typeof subtype !== "string") return [];
  if (
    !hairTypeRecommendations ||
    typeof hairTypeRecommendations !== "object" ||
    Array.isArray(hairTypeRecommendations)
  ) {
    return [];
  }
  const raw = (hairTypeRecommendations as Record<string, unknown>)[subtype];
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

/**
 * Curated recommendations first; otherwise family defaults filtered to textures
 * the salon actually sells (so clients still see a weft suggestion).
 */
export function resolveRecommendations(
  subtype: string | null | undefined,
  hairTypeRecommendations: unknown,
  availableTextures: string[] = []
): string[] {
  const curated = getRecommendationFor(subtype, hairTypeRecommendations);
  if (curated.length > 0) return curated;

  const family = subtype ? hairTypeFamily(subtype) : null;
  if (!family) return [];

  const defaults = DEFAULT_FAMILY_RECOMMENDATIONS[family];
  if (availableTextures.length === 0) {
    // Prefer canonical "body-wavy" over the alias when nothing is configured.
    return defaults.filter((t) => t !== "body-wave");
  }

  const availableKeys = new Set(
    availableTextures.map((t) => normalizeHairTextureKey(t))
  );
  const matched: string[] = [];
  const seen = new Set<string>();
  for (const label of defaults) {
    const key = normalizeHairTextureKey(label);
    if (!availableKeys.has(key) || seen.has(key)) continue;
    seen.add(key);
    const display =
      availableTextures.find(
        (t) => normalizeHairTextureKey(t) === key
      ) ?? label;
    matched.push(display);
  }
  return matched;
}

export function parseHairTypeRecommendations(
  raw: unknown
): Record<string, string[]> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(value)) continue;
    const labels = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
    if (labels.length > 0) out[key] = labels;
  }
  return out;
}

export function parseHairTypePhotos(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === "string" && value.trim()) {
      out[key] = value.trim();
    }
  }
  return out;
}

/** Ordered public gallery image URLs from businesses.gallery_urls. */
export function parseGalleryUrls(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

/** Match pricing rows whose texture appears in a recommendation label list. */
export function pricingRowsForRecommendations(
  recommendations: string[],
  hairAddonPricing: HairAddonPriceRow[]
): HairAddonPriceRow[] {
  if (recommendations.length === 0) return [];
  const wanted = new Set(
    recommendations.map((r) => normalizeHairTextureKey(r))
  );
  return hairAddonPricing.filter((row) =>
    wanted.has(normalizeHairTextureKey(row.texture))
  );
}

export function formatNaturalHairProfile(profile: NaturalHairProfile): string {
  const family = hairTypeFamily(profile.textureSubtype);
  const familyLabel = family
    ? family.charAt(0).toUpperCase() + family.slice(1)
    : "Unknown";
  const chemical = profile.chemical_treatment ? "Yes" : "No";
  const thickness =
    profile.thickness.charAt(0).toUpperCase() + profile.thickness.slice(1);
  return `${profile.textureSubtype.toUpperCase()} (${familyLabel}) · ${thickness} · Chemical treatment: ${chemical}`;
}

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Display order Monday → Sunday */
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export const NOTICE_HOUR_OPTIONS = [
  { value: 0, label: "Same day" },
  { value: 12, label: "12 hours" },
  { value: 24, label: "24 hours" },
  { value: 48, label: "48 hours" },
] as const;

export const BOOKING_BUFFER_MINUTE_OPTIONS = [
  { value: 0, label: "No buffer" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" },
] as const;

export const PAYMENT_CONFIRMATION_WINDOW_OPTIONS = [
  { value: 2, label: "2 hours" },
  { value: 4, label: "4 hours" },
  { value: 12, label: "12 hours" },
  { value: 24, label: "24 hours" },
] as const;

export type TimeWindow = { start: string; end: string };

export type DayAvailability = {
  day: number;
  enabled: boolean;
  windows: TimeWindow[];
};

export function defaultWeekSchedule(): DayAvailability[] {
  return [0, 1, 2, 3, 4, 5, 6].map((day) => {
    const isWeekday = day >= 2 && day <= 5;
    const isSaturday = day === 6;
    return {
      day,
      enabled: isWeekday || isSaturday,
      windows: [{ start: "10:00", end: isSaturday ? "16:00" : "18:00" }],
    };
  });
}

export function scheduleToRows(schedule: DayAvailability[]) {
  return schedule
    .filter((d) => d.enabled)
    .flatMap((d) =>
      d.windows
        .filter((w) => w.start && w.end && w.start < w.end)
        .map((w) => ({
          day_of_week: d.day,
          start_time: w.start.slice(0, 5),
          end_time: w.end.slice(0, 5),
        }))
    );
}

export function rowsToSchedule(
  rows: { day_of_week: number; start_time: string; end_time: string }[]
): DayAvailability[] {
  const schedule = defaultWeekSchedule().map((d) => ({
    ...d,
    enabled: false,
    windows: [{ start: "10:00", end: "18:00" }] as TimeWindow[],
  }));

  for (const day of [0, 1, 2, 3, 4, 5, 6]) {
    const dayRows = rows.filter((r) => r.day_of_week === day);
    if (dayRows.length === 0) continue;
    schedule[day] = {
      day,
      enabled: true,
      windows: dayRows.map((r) => ({
        start: String(r.start_time).slice(0, 5),
        end: String(r.end_time).slice(0, 5),
      })),
    };
  }

  return schedule;
}

export function formatConfirmationDeadlineRemaining(deadline: string): {
  label: string;
  isExpired: boolean;
} {
  const end = new Date(deadline).getTime();
  if (Number.isNaN(end)) {
    return { label: "Expiring soon", isExpired: true };
  }

  const diffMs = end - Date.now();
  if (diffMs <= 0) {
    return { label: "Expiring soon", isExpired: true };
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return {
      label: remHours > 0 ? `${days}d ${remHours}h left` : `${days}d left`,
      isExpired: false,
    };
  }
  if (hours > 0) {
    return { label: `${hours}h ${minutes}m left`, isExpired: false };
  }
  return { label: `${minutes}m left`, isExpired: false };
}

/** Read-only label for stylists when loyalty is enabled. */
export function loyaltyProgressLabel(
  visitCount: number,
  visitsRequired: number,
  discountPercent: number
): string {
  const visits = Math.max(0, visitCount);
  const required = Math.max(2, visitsRequired);
  const percent = Math.max(1, discountPercent);
  if (visits >= required) {
    return `${visits} visits — eligible for ${percent}% off`;
  }
  const remaining = required - visits;
  return `${visits} / ${required} visits — ${remaining} more until ${percent}% off`;
}

export function loyaltyPublicNote(
  visitsRequired: number,
  discountPercent: number
): string {
  return `Loyalty: get ${discountPercent}% off after ${visitsRequired} visits`;
}

