function resolveLocale(): string {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }
  return "en-GB";
}

/** Map visitor locale → display currency; fall back to GBP. */
export function resolveDisplayCurrency(locale = resolveLocale()): string {
  try {
    const region = new Intl.Locale(locale).maximize().region;
    const byRegion: Record<string, string> = {
      US: "USD",
      GB: "GBP",
      AU: "AUD",
      NZ: "NZD",
      CA: "CAD",
      FR: "EUR",
      DE: "EUR",
      ES: "EUR",
      IT: "EUR",
      NL: "EUR",
      BE: "EUR",
      AT: "EUR",
      IE: "EUR",
      PT: "EUR",
      FI: "EUR",
      CH: "CHF",
      JP: "JPY",
      IN: "INR",
      NG: "NGN",
      ZA: "ZAR",
      KE: "KES",
      GH: "GHS",
    };
    if (region && byRegion[region]) return byRegion[region];
  } catch {
    /* fall through */
  }
  return "GBP";
}

export function currencySymbol(locale = resolveLocale()): string {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: resolveDisplayCurrency(locale),
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value ?? "£";
  } catch {
    return "£";
  }
}

export function formatPrice(amount: number): string {
  if (amount === 0) return "Free";
  const locale = resolveLocale();
  const currency = resolveDisplayCurrency(locale);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
    }).format(amount);
  }
}

/** Ensure length displays with an inch mark (handles legacy "18" or "18\""). */
export function formatHairLength(length: string): string {
  if (!length || length === "—") return length;
  const numeric = length.replace(/["″]/g, "").trim();
  if (!numeric) return length;
  return `${numeric}"`;
}
