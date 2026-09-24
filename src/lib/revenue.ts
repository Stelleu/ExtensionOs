export type RevenueMonthRow = {
  month_start: string;
  deposits_collected: number;
  service_value: number;
  booking_count: number;
};

export function parseRevenueRows(raw: unknown): RevenueMonthRow[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      month_start: String(r.month_start).slice(0, 10),
      deposits_collected: Number(r.deposits_collected) || 0,
      service_value: Number(r.service_value) || 0,
      booking_count: Number(r.booking_count) || 0,
    };
  });
}

/** Percent change current vs previous. null when previous is 0 and current > 0. */
export function monthOverMonthPercent(
  current: number,
  previous: number
): number | null {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return ((current - previous) / previous) * 100;
}

export function formatMomLabel(pct: number | null): {
  text: string;
  tone: "up" | "down" | "flat" | "na";
} {
  if (pct === null) {
    return { text: "vs last month — new activity", tone: "na" };
  }
  if (pct === 0) {
    return { text: "0% vs last month", tone: "flat" };
  }
  const rounded = Math.round(pct);
  const sign = rounded > 0 ? "+" : "";
  return {
    text: `${sign}${rounded}% vs last month`,
    tone: rounded > 0 ? "up" : "down",
  };
}

export function formatMonthLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function formatRevenueAmount(amount: number): string {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `£${Math.round(amount)}`;
  }
}
