/** Google Maps search URL for a free-text location (no geocoding). */
export function googleMapsSearchUrl(location: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location.trim()
  )}`;
}
