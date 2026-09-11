import { describe, expect, it } from "vitest";
import {
  currencySymbol,
  formatHairLength,
  formatPrice,
  resolveDisplayCurrency,
} from "@/lib/format";
import {
  formatSlotLabel,
  formatDisplayDate,
  formatDurationLabel,
} from "@/lib/salon-helpers";

describe("formatPrice (src/lib/format.ts)", () => {
  it("returns Free for zero", () => {
    expect(formatPrice(0)).toBe("Free");
  });

  it("formats with a currency symbol (GBP fallback without browser locale)", () => {
    expect(formatPrice(50)).toMatch(/50/);
    expect(formatPrice(50)).toMatch(/£|GBP|\$|€/);
    expect(resolveDisplayCurrency("en-GB")).toBe("GBP");
    expect(currencySymbol("en-GB")).toMatch(/£/);
  });
});

describe("formatHairLength", () => {
  it("adds an inch mark when missing", () => {
    expect(formatHairLength("18")).toBe('18"');
  });

  it("does not double the inch mark", () => {
    expect(formatHairLength('18"')).toBe('18"');
  });
});

describe("date/time helpers (src/lib/salon-helpers.ts)", () => {
  // Date/time formatters live here — not in format.ts (which only has formatPrice).
  it("formats slot labels in 12-hour style", () => {
    expect(formatSlotLabel("10:00")).toBe("10am");
    expect(formatSlotLabel("14:30")).toBe("2:30pm");
    expect(formatSlotLabel("00:00")).toBe("12am");
  });

  it("formats display dates in en-GB long form", () => {
    const label = formatDisplayDate("2026-08-10");
    expect(label).toContain("August");
    expect(label).toContain("2026");
  });

  it("formats duration labels", () => {
    expect(formatDurationLabel(30)).toBe("30 min");
    expect(formatDurationLabel(60)).toBe("1 hr");
    expect(formatDurationLabel(120)).toBe("2 hrs");
    expect(formatDurationLabel(90)).toBe("1h 30m");
  });
});
