/**
 * circadianLogic.js — simplified, rule-based sleep timing ideas for learning.
 *
 * EASTBOUND vs WESTBOUND (sign of the time zone gap)
 * ---------------------------------------------------
 * We use the same sign as `offsetHours` from Luxon: **positive** means the destination’s
 * clocks are **ahead** of the departure zone (think “fly toward the sunrise” in many routes).
 * In travel apps this is often called **eastbound-style**. **Negative** means the destination is
 * **behind** (**westbound-style**). This is a teaching label, not a pilot log or medical chart.
 *
 * SLEEP PHASE: ADVANCE vs DELAY (very rough cartoon)
 * ---------------------------------------------------
 * - **Eastbound-style** often feels like you must **advance** your sleep—fall asleep and wake
 *   **earlier** in local time. So we **prioritize earlier morning light** and **earlier dim
 *   evenings** in the demo timeline.
 * - **Westbound-style** often feels like you must **delay** sleep—stay awake a bit **later** in
 *   local time. So we **tolerate a little more evening light** (carefully) and **shift wind-down
 *   later** in this demo—not a prescription.
 *
 * WHY LIGHT AND CAFFEINE MOVE
 * ---------------------------
 * Light is the strongest everyday “clock setter” in normal life. Caffeine late in the day can
 * mask sleepiness, so in **eastbound** demos we **tighten late caffeine** more than in **westbound**
 * demos. These rules are **not** personalized medicine—just if/else patterns for the UI.
 */

/** Shown in footer and results so users remember this is wellness education, not care. */
export const WELLNESS_DISCLAIMER =
  'This app provides general wellness guidance and is not medical advice.'

/**
 * @param {number} offsetHours — signed hours (destination minus origin at reference instant).
 * @returns {'eastbound' | 'westbound' | 'neutral'}
 */
export function getTravelDirection(offsetHours) {
  if (offsetHours > 0) return 'eastbound'
  if (offsetHours < 0) return 'westbound'
  return 'neutral'
}

/**
 * Plain-language tip about **gradual** changes before/during travel (simplified “chronotype” story).
 * - **Small shift:** almost business as usual.
 * - **Medium:** nudge about an hour at a time (not exact science).
 * - **Large:** remind to consider slow shifts before departure (still not medical advice).
 */
export function getGradualAdjustmentTip(shiftCategory, direction) {
  if (shiftCategory === 'short') {
    return 'Small shift: minimal schedule change—keep normal daylight and a steady wind-down.'
  }
  if (shiftCategory === 'medium') {
    return 'Medium shift: demo suggests moving bedtime about an hour toward your destination rhythm over a few days—not a strict protocol.'
  }
  const dirWord = direction === 'westbound' ? 'later' : 'earlier'
  return `Large shift: consider gradually moving sleep ${dirWord} before travel (simplified coaching only—not a treatment plan).`
}

/**
 * Clamp a time-of-day (minutes from midnight) into the demo “day window” so bars stay visible.
 */
function clampMinutes(m) {
  const min = 6 * 60
  const max = 22 * 60
  return Math.max(min, Math.min(max, m))
}

function shiftRange(start, end, deltaStart, deltaEnd) {
  return {
    startMinutes: clampMinutes(start + deltaStart),
    endMinutes: clampMinutes(end + deltaEnd),
  }
}

/**
 * Pretty 12-hour clock for UI strings (minutes from midnight, same day only).
 */
export function formatMinutesAsClock(totalMinutes) {
  const m = Math.round(totalMinutes) % (24 * 60)
  const h24 = Math.floor(m / 60)
  const min = m % 60
  const am = h24 < 12
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  const mm = min === 0 ? '' : `:${String(min).padStart(2, '0')}`
  return `${h12}${mm}${am ? 'a.m.' : 'p.m.'}`
}

/**
 * Extra minute shifts for **Day 1 / 2 / 3** after arrival (on top of base templates).
 * Day 1 = strongest “catch local rhythm” cartoon; Day 3 = closer to steady local life.
 */
function getDayIndexNudge(dayIndex, direction, shiftCategory) {
  const scale = shiftCategory === 'short' ? 0.45 : shiftCategory === 'medium' ? 0.72 : 1
  const tier = dayIndex === 1 ? 1 : dayIndex === 2 ? 0.55 : 0.28

  if (direction === 'neutral') {
    return { ls: 0, le: 0, cs: 0, ce: 0, ns: 0, ne: 0, ds: 0, de: 0 }
  }

  const f = scale * tier

  if (direction === 'eastbound') {
    const raw = { ls: -22, le: -22, cs: -10, ce: -22, ns: -18, ne: -18, ds: -26, de: -26 }
    return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Math.round(v * f)]))
  }

  const raw = { ls: 18, le: 18, cs: 0, ce: 16, ns: 10, ne: 10, ds: 20, de: 20 }
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Math.round(v * f)]))
}

/**
 * One-line bedtime target from wind-down timing + direction + day (wellness demo only).
 */
export function getTargetBedtimeLabel({
  shiftCategory,
  sleepPreference,
  direction,
  dayIndex,
  windDownBlock,
}) {
  let target = 22 * 60 + 30
  if (windDownBlock) {
    target = windDownBlock.endMinutes + 40
  }
  if (direction === 'eastbound') {
    target -= dayIndex === 1 ? 22 : dayIndex === 2 ? 12 : 5
  } else if (direction === 'westbound') {
    target += dayIndex === 1 ? 18 : dayIndex === 2 ? 10 : 4
  }
  if (sleepPreference === 'morning') {
    target -= 12
  } else {
    target += 18
  }
  if (shiftCategory === 'large' && direction === 'eastbound') {
    target -= 8
  }
  target = Math.max(20 * 60 + 15, Math.min(23 * 60 + 45, target))

  return `Target bedtime (demo): about ${formatMinutesAsClock(target)} local. Adjust if you feel wired or heavy-eyed—this is not medical advice.`
}

/**
 * Builds four timeline rows for `PlanTimeline.jsx`, using direction + severity + sleep type.
 * `wantsMagnesium` is handled separately in `jetLagCalculator.js` so this file stays about rhythm.
 *
 * @param {{ dayIndex?: 1 | 2 | 3 }} [opts] — `dayIndex` strengthens or relaxes the **post-arrival**
 *   story: Day 1 nudges hardest toward advance (east) or delay (west); Day 3 is milder.
 */
export function buildCircadianTimelineBlocks({
  shiftCategory,
  sleepPreference,
  direction,
  suffix,
  dayIndex = 2,
}) {
  const morning = sleepPreference === 'morning'
  const east = direction === 'eastbound'
  const west = direction === 'westbound'

  // Base template minutes (before direction nudges). Morning people get earlier anchors; night people get later ones.
  let lightStart = 8 * 60
  let lightEnd = 9 * 60 + 30
  let cafStart = 10 * 60
  let cafEnd = 12 * 60
  let napStart = 13 * 60
  let napEnd = 13 * 60 + 30
  let dimStart = 19 * 60 + 30
  let dimEnd = 21 * 60

  if (shiftCategory === 'short') {
    if (morning) {
      lightStart = 8 * 60
      lightEnd = 9 * 60 + 30
      cafStart = 10 * 60
      cafEnd = 12 * 60
      napStart = 13 * 60
      napEnd = 13 * 60 + 30
      dimStart = 19 * 60 + 30
      dimEnd = 21 * 60
    } else {
      lightStart = 9 * 60
      lightEnd = 10 * 60 + 30
      cafStart = 11 * 60
      cafEnd = 13 * 60
      napStart = 14 * 60
      napEnd = 14 * 60 + 30
      dimStart = 20 * 60
      dimEnd = 21 * 60 + 30
    }
  }

  if (shiftCategory === 'medium') {
    if (morning) {
      lightStart = 7 * 60
      lightEnd = 9 * 60
      cafStart = 10 * 60
      cafEnd = 13 * 60
      napStart = 13 * 60 + 15
      napEnd = 13 * 60 + 45
      dimStart = 19 * 60
      dimEnd = 21 * 60
    } else {
      lightStart = 9 * 60
      lightEnd = 11 * 60
      cafStart = 11 * 60 + 30
      cafEnd = 15 * 60
      napStart = 15 * 60 + 30
      napEnd = 16 * 60
      dimStart = 20 * 60
      dimEnd = 22 * 60
    }
  }

  if (shiftCategory === 'large') {
    if (morning) {
      lightStart = 6 * 60 + 30
      lightEnd = 9 * 60
      cafStart = 9 * 60 + 30
      cafEnd = 14 * 60
      napStart = 14 * 60
      napEnd = 14 * 60 + 30
      dimStart = 18 * 60 + 30
      dimEnd = 21 * 60
    } else {
      lightStart = 9 * 60 + 30
      lightEnd = 12 * 60
      cafStart = 12 * 60
      cafEnd = 16 * 60
      napStart = 16 * 60 + 30
      napEnd = 17 * 60
      dimStart = 20 * 60
      dimEnd = 22 * 60
    }
  }

  // Phase 10: Day 1–3 progression (arrival week cartoon). Applied before direction nudges.
  const dayN = getDayIndexNudge(dayIndex, direction, shiftCategory)
  lightStart += dayN.ls
  lightEnd += dayN.le
  cafStart += dayN.cs
  cafEnd += dayN.ce
  napStart += dayN.ns
  napEnd += dayN.ne
  dimStart += dayN.ds
  dimEnd += dayN.de

  // Direction nudges (advance vs delay), still clamped later per block.
  let lightDelta = 0
  let cafStartDelta = 0
  let cafEndDelta = 0
  let dimDelta = 0

  if (east) {
    // Advance rhythm: earlier light, tighten late caffeine window, earlier dim.
    lightDelta = shiftCategory === 'large' ? -30 : shiftCategory === 'medium' ? -20 : -10
    cafStartDelta = shiftCategory === 'large' ? -30 : -15
    cafEndDelta = shiftCategory === 'large' ? -30 : -15
    dimDelta = shiftCategory === 'large' ? -25 : -15
  } else if (west) {
    // Delay rhythm: slightly later light, shorter strict caffeine window end pushed later, later dim.
    lightDelta = shiftCategory === 'large' ? 20 : 10
    cafStartDelta = 0
    cafEndDelta = shiftCategory === 'large' ? 30 : 15
    dimDelta = shiftCategory === 'large' ? 25 : 15
  }

  const light = shiftRange(lightStart, lightEnd, lightDelta, lightDelta)
  const caf = shiftRange(cafStart, cafEnd, cafStartDelta, cafEndDelta)
  const nap = shiftRange(napStart, napEnd, 0, 0)
  const dim = shiftRange(dimStart, dimEnd, dimDelta, dimDelta)

  const lightTitle =
    shiftCategory === 'large' ? 'Bright light (priority window)' : 'Bright light'
  const lightSubtitle = (() => {
    if (east) {
      return morning
        ? 'Eastbound-style shift: advance your “day” with earlier bright light (demo only).'
        : 'Eastbound-style: still anchor morning light earlier, even if you like late nights (education).'
    }
    if (west) {
      return morning
        ? 'Westbound-style: you can tolerate a slightly later light push than eastbound demos (not medical advice).'
        : 'Westbound-style: evening-friendly schedule—keep bright light from drifting too late (demo).'
    }
    return 'Neutral offset: keep a steady daytime light anchor (learning app).'
  })()

  const cafTitle = 'Caffeine window'
  const cafSubtitle = (() => {
    if (east) {
      return 'Eastbound: trim late caffeine so it does not fight an earlier wind-down (simplified rule).'
    }
    if (west) {
      return 'Westbound: late caffeine is slightly less “risky” in this demo, but still avoid a strong cup near bedtime.'
    }
    return 'Keep caffeine modest in the afternoon for any small shift (general wellness copy).'
  })()

  const napTitle = 'Short nap (optional)'
  const napSubtitle = (() => {
    const earlyTip =
      'Keep naps short and before mid-afternoon so they do not steal from night sleep (common teaching point, not individualized advice).'
    if (shiftCategory === 'large') {
      return `Large shift, day ${dayIndex}: optional brief nap. ${earlyTip}`
    }
    return `Day ${dayIndex}: ${earlyTip}`
  })()

  const dimTitle = shiftCategory === 'large' ? 'Dim lights (wind-down)' : 'Dim lights'
  const dimSubtitle = (() => {
    if (east) {
      return 'Eastbound: dim earlier to support an “advance” bedtime story in this mock day.'
    }
    if (west) {
      return 'Westbound: wind-down can sit a bit later; still soften screens before sleep (education).'
    }
    return 'Even dimming helps any traveler build a predictable evening (non-medical tip).'
  })()

  const rows = [
    {
      kind: 'bright-light',
      title: lightTitle,
      subtitle: lightSubtitle,
      startMinutes: light.startMinutes,
      endMinutes: Math.max(light.startMinutes + 25, light.endMinutes),
    },
    {
      kind: 'avoid-caffeine',
      title: cafTitle,
      subtitle: cafSubtitle,
      startMinutes: caf.startMinutes,
      endMinutes: Math.max(caf.startMinutes + 30, caf.endMinutes),
    },
    {
      kind: 'nap',
      title: napTitle,
      subtitle: napSubtitle,
      startMinutes: nap.startMinutes,
      endMinutes: Math.max(nap.startMinutes + 20, nap.endMinutes),
    },
    {
      kind: 'wind-down',
      title: dimTitle,
      subtitle: dimSubtitle,
      startMinutes: dim.startMinutes,
      endMinutes: Math.max(dim.startMinutes + 45, dim.endMinutes),
    },
  ]

  return rows.map((row, index) => ({
    ...row,
    id: `circadian-${shiftCategory}-${direction}-${suffix}-${index}`,
  }))
}

/**
 * Same behavior as before: optional magnesium row, kept here so `jetLagCalculator` can chain it
 * after circadian blocks (or import from circadian—either way). Exported for one import site.
 */
export function appendMagnesiumIfRequested(blocks, wantsMagnesium, suffix) {
  if (!wantsMagnesium) return blocks

  const windDown = blocks.find((b) => b.kind === 'wind-down')
  let endMinutes = 19 * 60
  let startMinutes = 18 * 60 + 30

  if (windDown) {
    endMinutes = Math.max(17 * 60 + 30, windDown.startMinutes - 75)
    startMinutes = Math.max(17 * 60, endMinutes - 30)
    if (startMinutes >= endMinutes) {
      startMinutes = endMinutes - 25
    }
  }

  let end = Math.min(endMinutes, startMinutes + 35)
  if (end <= startMinutes) {
    end = startMinutes + 25
  }

  const block = {
    id: `sleep-support-${suffix}`,
    kind: 'sleep-support',
    title: 'Magnesium glycinate (optional)',
    subtitle:
      'If magnesium glycinate is already part of your routine, some travelers consider it about 1–2 hours before their target bedtime. Optional idea only—not medical advice, not a dose, and not a claim it treats jet lag or insomnia.',
    startMinutes,
    endMinutes: end,
  }

  return [...blocks, block].sort((a, b) => a.startMinutes - b.startMinutes)
}
