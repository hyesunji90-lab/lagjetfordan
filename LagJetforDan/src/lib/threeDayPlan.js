/**
 * threeDayPlan.js — builds a **3-day destination wellness sketch** after arrival (Day 1–3).
 *
 * HOW DAYS ARE CALCULATED (teaching version, not a clinical model)
 * ---------------------------------------------------------------
 * - **Day 1** assumes you are still the “most shifted” relative to local time, so eastbound demos
 *   **push morning light and wind-down earlier** a bit more; westbound demos **allow slightly later**
 *   anchors so your clock can **delay** toward local night.
 * - **Day 2** uses **middle-strength** nudges—same story as Day 1 but toned down.
 * - **Day 3** moves toward a **steady local routine** (smallest extra nudges on top of the base template).
 *
 * Severity (`short` / `medium` / `large` from absolute hour gap) **scales** how big those
 * extra nudges are: small shifts barely change the pattern; large shifts exaggerate the demo.
 *
 * Bright light, caffeine windows, optional short naps, dim/wind-down, and optional magnesium rows
 * are assembled in `circadianLogic.js`; this file only **loops three days** and adds bedtime copy.
 *
 * Same-day departures (Phase 11): when `applySameDayPastFilter` is true, **Day 1 only** runs
 * `filterPastRecommendations` from `recommendationTime.js` **before** magnesium is appended, so
 * optional supplement timing still hugs the remaining evening window.
 */

import { DateTime } from 'luxon'
import {
  appendMagnesiumIfRequested,
  buildCircadianTimelineBlocks,
  formatMinutesAsClock,
  getTargetBedtimeLabel,
} from './circadianLogic.js'
import { ensureEveningBlocksIfEmpty, filterPastRecommendations } from './recommendationTime.js'

/**
 * @typedef {'morning' | 'night'} SleepPreference
 * @typedef {'short' | 'medium' | 'large'} ShiftCategory
 * @typedef {'eastbound' | 'westbound' | 'neutral'} TravelDirection
 */

/**
 * @param {{
 *   sleepPreference: SleepPreference,
 *   wantsMagnesium?: boolean,
 *   applySameDayPastFilter?: boolean,
 * }} tripDetails — mirrors planner `form` fields this engine cares about, plus same-day flag.
 * @param {{
 *   shiftCategory: ShiftCategory,
 *   travelDirection: TravelDirection,
 * }} circadianProfile — precomputed from the signed time-zone gap (see `jetLagCalculator.js`).
 * @returns {{
 *   days: Array<{
 *     dayNumber: number,
 *     heading: string,
 *     narrative: string,
 *     timelineBlocks: object[],
 *     targetBedtimeLabel: string,
 *     caffeineCutoffSummary: string,
 *   }>,
 * }}
 */
export function generateThreeDayPlan(tripDetails, circadianProfile) {
  const { shiftCategory, travelDirection } = circadianProfile
  const wantsMagnesium = tripDetails.wantsMagnesium === true
  const applySameDayPastFilter = tripDetails.applySameDayPastFilter === true
  const suffix =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  const dayNarratives = [
    'First local calendar day after arrival: strongest demo nudges (still not medical advice).',
    'Second day: same direction story, slightly relaxed so the schedule can settle.',
    'Third day: closer to a steady local rhythm—keep morning light consistent.',
  ]

  const days = [1, 2, 3].map((dayNumber, index) => {
    const daySuffix = `${suffix}-d${dayNumber}`
    const nowLocal = DateTime.now()
    const nowMinute = nowLocal.hour * 60 + nowLocal.minute

    let narrative = dayNarratives[index]

    let timelineBlocks = buildCircadianTimelineBlocks({
      shiftCategory,
      sleepPreference: tripDetails.sleepPreference,
      direction: travelDirection,
      suffix: daySuffix,
      dayIndex: dayNumber,
    })

    if (dayNumber === 1 && applySameDayPastFilter) {
      timelineBlocks = filterPastRecommendations(timelineBlocks, nowLocal)
      timelineBlocks = ensureEveningBlocksIfEmpty(timelineBlocks, nowLocal, daySuffix)

      if (nowMinute >= 20 * 60) {
        narrative =
          'Same-day departure: it is already evening on this device’s clock, so earlier daytime items are hidden—focus on wind-down and bedtime targets below (demo only).'
      } else {
        narrative =
          'Same-day departure: the Day 1 strip starts near your current local time; recommendation windows that already passed today were removed (demo only).'
      }
    }

    timelineBlocks = appendMagnesiumIfRequested(timelineBlocks, wantsMagnesium, daySuffix)

    const windDown = timelineBlocks.find((b) => b.kind === 'wind-down')
    const cafBlock = timelineBlocks.find((b) => b.kind === 'avoid-caffeine')

    const caffeineCutoffSummary = cafBlock
      ? `Favor finishing caffeine by about ${formatMinutesAsClock(cafBlock.endMinutes)} local (demo “last sip” window)—earlier is gentler on sleep pressure.`
      : dayNumber === 1 && applySameDayPastFilter
        ? 'No open caffeine window remains on this filtered Day 1 view—choose uncaffeinated drinks for the rest of today (general wellness copy).'
        : 'Keep afternoon caffeine light so it does not fight your target bedtime (general wellness copy).'

    return {
      dayNumber,
      heading: `Day ${dayNumber} at destination`,
      narrative,
      timelineBlocks,
      targetBedtimeLabel: getTargetBedtimeLabel({
        shiftCategory,
        sleepPreference: tripDetails.sleepPreference,
        direction: travelDirection,
        dayIndex: dayNumber,
        windDownBlock: windDown,
      }),
      caffeineCutoffSummary,
    }
  })

  return { days }
}
