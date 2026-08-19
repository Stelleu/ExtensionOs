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
  { length: '18"', texture: "body-wavy", price: 120 },
  { length: '22"', texture: "body-wavy", price: 160 },
  { length: '26"', texture: "body-wavy", price: 200 },
];

export function parseHairAddonPricing(raw: unknown): HairAddonPriceRow[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const r = row as Record<string, unknown>;
    const length = String(r.length ?? "").trim();
    const texture = r.texture as HairTexture;
    const price = Number(r.price);
    if (!length || !HAIR_TEXTURES.includes(texture) || Number.isNaN(price)) {
      return [];
    }
    return [{ length, texture, price }];
  });
}

export function findHairAddonPrice(
  rows: HairAddonPriceRow[],
  length: string | null | undefined,
  texture: HairTexture | null | undefined
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
): HairTexture[] {
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

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Display order Monday → Sunday */
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export const NOTICE_HOUR_OPTIONS = [
  { value: 0, label: "Same day" },
  { value: 12, label: "12 hours" },
  { value: 24, label: "24 hours" },
  { value: 48, label: "48 hours" },
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
