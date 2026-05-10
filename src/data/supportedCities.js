/**
 * supportedCities.js — small allow-list of cities the app knows about.
 * Each row pairs a friendly label with an IANA time zone string (used by Luxon).
 *
 * Why IANA? The whole world agrees on names like "America/New_York" so libraries
 * can apply DST rules for a specific calendar date.
 */
export const SUPPORTED_CITIES = [
  { label: 'San Francisco', timeZone: 'America/Los_Angeles' },
  { label: 'New York', timeZone: 'America/New_York' },
  { label: 'London', timeZone: 'Europe/London' },
  { label: 'Tokyo', timeZone: 'Asia/Tokyo' },
  { label: 'Paris', timeZone: 'Europe/Paris' },
  { label: 'Sydney', timeZone: 'Australia/Sydney' },
]

/** Quick lookup so we only accept time zones we shipped in the UI. */
export const SUPPORTED_TIMEZONE_SET = new Set(SUPPORTED_CITIES.map((c) => c.timeZone))

/**
 * Given an IANA string from the form, return the pretty city name for cards and headings.
 * If we cannot find it (should be rare), fall back to showing the raw string.
 */
export function getCityLabel(timeZone) {
  if (!timeZone) return '—'
  const row = SUPPORTED_CITIES.find((c) => c.timeZone === timeZone)
  return row ? row.label : timeZone
}
