/**
 * recommendationTime.js — “what time is it now?” helpers for **same-day departure** UX.
 *
 * ---------------------------------------------------------------------------
 * 10) HOW THE APP DECIDES “TODAY”
 * ---------------------------------------------------------------------------
 * The planner stores `departureDate` as `YYYY-MM-DD` from a native `<input type="date">`.
 * That string is a **calendar date with no embedded time zone**—the browser picks the calendar
 * day the user tapped. We treat “today” as **Luxon’s idea of today in the device’s local zone**:
 * `DateTime.local().toISODate()` (same as `DateTime.now().toISODate()` on a normal laptop).
 * If that ISO string **equals** `departureDate`, we consider the trip a **same-day departure**
 * for filtering purposes. This is a simple product rule, not a legal “travel day” definition.
 *
 * ---------------------------------------------------------------------------
 * 10) HOW CURRENT LOCAL TIME IS READ (Luxon)
 * ---------------------------------------------------------------------------
 * `DateTime.now()` asks Luxon for “right now” expressed in the **system default time zone**
 * (your Mac/Windows/Android region). We read `.hour` and `.minute` to build **minutes from
 * midnight** on that same local calendar day. Those minutes are compared to each timeline row’s
 * `startMinutes` / `endMinutes`, which are also “minutes from midnight” on the **mock day** graph.
 * So for same-day mode we intentionally align the graph’s clock with **your local wall clock**:
 * if it is already 4:00 p.m. locally, the 8:00 a.m. bright-light row is treated as **already past**
 * and is dropped—matching the user story even though a real trip might involve other zones.
 *
 * ---------------------------------------------------------------------------
 * 10) HOW RECOMMENDATIONS ARE FILTERED DYNAMICALLY
 * ---------------------------------------------------------------------------
 * `filterPastRecommendations` walks the schedule **in chronological order**:
 * - Rows whose **entire** window ends at or before “now” are **removed** (expired).
 * - Rows that **span** “now” are **kept** but **clipped**: `startMinutes` moves up to “now” so the
 *   UI starts where you actually are in the day, while `endMinutes` stays put when possible.
 * - Rows that start in the future are **unchanged**.
 * The result is **re-sorted** by `startMinutes` so the vertical timeline order stays coherent.
 * If **everything** was morning-only and it is already late, `ensureEveningBlocksIfEmpty` inserts a
 * single wind-down placeholder so the page still teaches evening habits (wellness demo only).
 */

import { DateTime } from 'luxon'
import { formatMinutesAsClock } from './circadianLogic.js'

/** Minutes from local midnight for a Luxon DateTime (same calendar day as that DateTime). */
export function minuteOfDayFromDateTime(dt) {
  return dt.hour * 60 + dt.minute
}

/**
 * Same-day departure gate: `departureDate` must look like `YYYY-MM-DD` and match **this device’s
 * local calendar today** (Luxon `DateTime.local()`).
 */
export function isDepartureDateTodayLocal(departureDate) {
  if (!departureDate || !/^\d{4}-\d{2}-\d{2}$/.test(departureDate)) {
    return false
  }
  return departureDate === DateTime.local().toISODate()
}

/**
 * Drop or clip timeline rows relative to **currentTime**’s local wall clock.
 *
 * @param {Array<{
 *   id: string,
 *   kind: string,
 *   title: string,
 *   subtitle: string,
 *   startMinutes: number,
 *   endMinutes: number,
 * }>} schedule — timeline blocks from `circadianLogic` / `threeDayPlan`.
 * @param {import('luxon').DateTime} currentTime — use `DateTime.now()` for the user’s local clock.
 * @returns {typeof schedule} new array (does not mutate the input).
 */
export function filterPastRecommendations(schedule, currentTime) {
  const nowM = minuteOfDayFromDateTime(currentTime)
  const out = []

  for (const block of schedule) {
    if (block.endMinutes <= nowM) {
      continue
    }

    const clippedStart = Math.max(block.startMinutes, nowM)
    if (clippedStart >= block.endMinutes) {
      continue
    }

    const wasClipped = block.startMinutes < nowM
    const clipNote = wasClipped
      ? ` Starts from ${formatMinutesAsClock(clippedStart)} local—earlier portion already passed (same-day filter).`
      : ''

    out.push({
      ...block,
      id: `${block.id}-postfilter-${nowM}`,
      startMinutes: clippedStart,
      endMinutes: block.endMinutes,
      subtitle: `${block.subtitle}${clipNote}`,
    })
  }

  out.sort((a, b) => a.startMinutes - b.startMinutes)
  return out
}

/**
 * If every daytime row was stripped, keep the UI useful at night by adding one wind-down band.
 *
 * @param {ReturnType<typeof filterPastRecommendations>} schedule
 * @param {import('luxon').DateTime} currentTime
 * @param {string} idSuffix — stable fragment for React keys.
 */
export function ensureEveningBlocksIfEmpty(schedule, currentTime, idSuffix) {
  if (schedule.length > 0) {
    return schedule
  }

  const nowM = minuteOfDayFromDateTime(currentTime)
  const endM = Math.min(22 * 60 + 45, Math.max(nowM + 45, 21 * 60))
  const startM = Math.min(nowM, endM - 30)

  return [
    {
      id: `same-day-evening-${idSuffix}`,
      kind: 'wind-down',
      title: 'Evening wind-down (same-day focus)',
      subtitle:
        'Local time is already late, so earlier windows were skipped. Dim lights, calm screens, and move toward your target bedtime—general wellness copy only.',
      startMinutes: startM,
      endMinutes: endM,
    },
  ]
}
