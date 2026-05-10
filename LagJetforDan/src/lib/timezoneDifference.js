import { DateTime } from 'luxon'
import { SUPPORTED_TIMEZONE_SET } from '../data/supportedCities.js'

/**
 * timezoneDifference.js — figures out how many hours “ahead” the destination zone is
 * compared to the departure zone for ONE chosen calendar day.
 *
 * How it works (big picture):
 * 1. We pick a single instant in time: **noon UTC** on your departure date (or today if empty).
 * 2. We ask Luxon: “At that instant, what is each zone’s offset from UTC?”
 *    (Offsets change with DST, so the departure date matters.)
 * 3. We subtract: destinationOffset − departureOffset → signed hour gap.
 *
 * Positive result → destination’s clocks read “later” than departure’s at that instant.
 */

/**
 * Build a stable reference instant on the user’s departure date (middle of the day UTC).
 * Noon UTC avoids many edge cases that happen around local midnight.
 */
function referenceInstantUtc(isoDateString) {
  if (isoDateString && /^\d{4}-\d{2}-\d{2}$/.test(isoDateString)) {
    const [year, month, day] = isoDateString.split('-').map(Number)
    return DateTime.utc(year, month, day, 12, 0, 0)
  }
  // No date yet: use **today** at noon UTC so the math still runs during testing.
  const nowUtc = DateTime.now().toUTC()
  return DateTime.utc(nowUtc.year, nowUtc.month, nowUtc.day, 12, 0, 0)
}

/**
 * @param {string} originIana — e.g. "America/Los_Angeles"
 * @param {string} destIana — e.g. "Asia/Tokyo"
 * @param {string} isoDateString — "YYYY-MM-DD" from <input type="date">, or ""
 * @returns {{ hours: number, usedFallback: boolean }}
 */
export function computeTimezoneDifferenceHours(originIana, destIana, isoDateString) {
  // Guard rails: both zones must be in our small supported list (prevents random strings).
  if (
    !originIana ||
    !destIana ||
    !SUPPORTED_TIMEZONE_SET.has(originIana) ||
    !SUPPORTED_TIMEZONE_SET.has(destIana)
  ) {
    return { hours: 0, usedFallback: true }
  }

  if (originIana === destIana) {
    return { hours: 0, usedFallback: false }
  }

  const instant = referenceInstantUtc(isoDateString)

  // `setZone` keeps the same instant, but `.offset` becomes that zone’s offset from UTC in minutes.
  const origin = instant.setZone(originIana)
  const destination = instant.setZone(destIana)

  const diffMinutes = destination.offset - origin.offset
  const hours = diffMinutes / 60

  return { hours, usedFallback: false }
}
