/**
 * jetLagCalculator.js — ties together time zone math + circadian-inspired timeline layout.
 *
 * Heavy “sleep direction / phase” **if/else** rules live in `circadianLogic.js` and the 3-day
 * loop lives in `threeDayPlan.js` (`generateThreeDayPlan`). This file stays “glue code”: read the
 * form → call Luxon → return props for React. Still **not** medical-grade modeling.
 */

import { getCityLabel } from '../data/supportedCities.js'
import { WELLNESS_DISCLAIMER, getGradualAdjustmentTip, getTravelDirection } from './circadianLogic.js'
import { isDepartureDateTodayLocal } from './recommendationTime.js'
import { computeTimezoneDifferenceHours } from './timezoneDifference.js'
import { generateThreeDayPlan } from './threeDayPlan.js'

/** @typedef {'morning' | 'night'} SleepPreference */
/** @typedef {'short' | 'medium' | 'large'} ShiftCategory */

/**
 * How big the jump feels, using the *absolute* hour gap (Phase 10 bands):
 * - **Small:** about 1–3 h → this code treats |h| ≤ 3 (0–3 h) as the easy bucket.
 * - **Medium:** about 4–7 h → 3 < |h| ≤ 7.
 * - **Large:** about 8+ h → |h| > 7.
 */
export function getShiftCategory(absHours) {
  const h = Math.abs(absHours)
  if (h <= 3) return 'short'
  if (h <= 7) return 'medium'
  return 'large'
}

/**
 * Friendly label for the UI (not a medical grade).
 */
export function getDifficultyLabel(category) {
  if (category === 'short') return 'Easy adjustment'
  if (category === 'medium') return 'Moderate adjustment'
  return 'Major adjustment'
}

/**
 * Pretty string like "+3 h" or "−8 h" for the results page.
 */
export function formatOffsetHours(hours) {
  const abs = Math.abs(hours)
  const rounded =
    Math.abs(abs - Math.round(abs)) < 1e-6 ? Math.round(abs) : Math.round(abs * 10) / 10
  const sign = hours >= 0 ? '+' : '−'
  return `${sign}${rounded} h`
}

function formatDepartureDate(isoDate) {
  if (!isoDate) return 'Date TBD'
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return 'Date TBD'
  const local = new Date(y, m - 1, d)
  return local.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Main entry: reads the form (with IANA time zone strings), computes the hour gap,
 * then asks `circadianLogic` for direction-aware timeline blocks.
 *
 * @param {{
 *   departureTimeZone: string,
 *   destinationTimeZone: string,
 *   departureDate: string,
 *   sleepPreference: SleepPreference,
 *   wantsMagnesium?: boolean,
 * }} form
 */
export function generateJetLagPlan(form) {
  const originTz = form.departureTimeZone || 'America/Los_Angeles'
  const destTz = form.destinationTimeZone || 'America/New_York'

  const departureLabel = getCityLabel(originTz)
  const destinationLabel = getCityLabel(destTz)
  const dateLabel = formatDepartureDate(form.departureDate)

  const { hours: offsetHours, usedFallback } = computeTimezoneDifferenceHours(
    originTz,
    destTz,
    form.departureDate,
  )

  const category = getShiftCategory(offsetHours)
  const difficultyLabel = getDifficultyLabel(category)
  const suffix = `${Date.now()}`
  const isMorning = form.sleepPreference === 'morning'

  const offsetLabel = formatOffsetHours(offsetHours)
  const isEstimate = usedFallback

  const travelDirection = getTravelDirection(offsetHours)
  const gradualAdjustmentNote = getGradualAdjustmentTip(category, travelDirection)

  const directionHint = usedFallback
    ? 'Could not compute offset—please pick two supported cities.'
    : offsetHours > 0
      ? 'Destination’s offset is ahead for the date you picked (noon UTC reference).'
      : offsetHours < 0
        ? 'Destination’s offset is behind for the date you picked (noon UTC reference).'
        : 'Same UTC offset on that date—still use the gentle template below.'

  const estimateHint = usedFallback ? ' · Offset unavailable' : ''

  const offsetNote = usedFallback
    ? 'Choose two cities from the planner list so Luxon can read real IANA zones.'
    : 'Computed with Luxon using IANA zones and your departure date (noon UTC anchor).'

  const trip = {
    id: `plan-${suffix}`,
    route: `${departureLabel} → ${destinationLabel}`,
    detail: `${dateLabel} · ${offsetLabel} · ${difficultyLabel}${estimateHint}`,
    circleClass: isMorning
      ? 'bg-gradient-to-br from-orange-400 to-amber-500'
      : 'bg-gradient-to-br from-slate-600 to-navy',
  }

  const applySameDayPastFilter = isDepartureDateTodayLocal(form.departureDate)

  const threeDayPlan = generateThreeDayPlan(
    {
      sleepPreference: form.sleepPreference,
      wantsMagnesium: form.wantsMagnesium,
      applySameDayPastFilter,
    },
    { shiftCategory: category, travelDirection },
  )

  return {
    trip,
    threeDayPlan,
    sameDayTimelineFilter: {
      applied: applySameDayPastFilter,
      detail:
        'Luxon compares your departure date to this device’s local calendar. When they match, Day 1 clips or hides timeline rows before your current local time—see recommendationTime.js.',
    },
    offsetHours,
    offsetLabel,
    directionHint,
    shiftCategory: category,
    difficultyLabel,
    isEstimate,
    offsetNote,
    travelDirection,
    gradualAdjustmentNote,
    wellnessDisclaimer: WELLNESS_DISCLAIMER,
  }
}
