/**
 * sunlightAdvisor.js — rule-based “sunlight context” copy for the results screen.
 *
 * WHAT THIS FILE DOES
 * -------------------
 * It looks at the **already computed plan** (hour offset, small/medium/large bucket) plus basic
 * **trip details** (form fields) and returns plain strings for the UI.
 * There is **no weather API**, no sun position math, and no medical diagnosis—just simple if/else
 * rules so you can practice “product logic” in one place.
 *
 * HOW RULE-BASED ADVICE WORKS HERE
 * --------------------------------
 * 1. We reuse `plan.shiftCategory` (`short` / `medium` / `large`) from `jetLagCalculator.js` so
 *    sunlight hints line up with how big the **time zone gap** feels in the app.
 * 2. For **large** gaps we also look at the **sign** of `plan.offsetHours`:
 *    - Positive → destination “ahead” → we call that **eastbound-style** in plain language.
 *    - Negative → **westbound-style**.
 * 3. Each branch returns friendly, **non-prescriptive** sentences (education / UX only).
 */

import { getCityLabel } from '../data/supportedCities.js'

/**
 * Build the copy blocks for the “Sunlight Context” card.
 *
 * @param {object} plan — output from `generateJetLagPlan` (`offsetHours`, `shiftCategory`, `offsetLabel`, …).
 * @param {object} tripDetails — same shape as the planner `form` (time zones, date, etc.).
 * @returns {{
 *   whyLightMatters: string,
 *   likelyLightFocus: string,
 *   adviceParagraph: string,
 *   ruleTag: string,
 *   destinationLabel: string,
 * }}
 */
export function generateSunlightAdvice(plan, tripDetails) {
  const hours = plan.offsetHours ?? 0
  const category = plan.shiftCategory
  const direction =
    plan.travelDirection ??
    (hours > 0 ? 'eastbound' : hours < 0 ? 'westbound' : 'neutral')
  const eastboundStyle = direction === 'eastbound'
  const westboundStyle = direction === 'westbound'

  const destinationLabel = getCityLabel(tripDetails?.destinationTimeZone)

  const whyLightMatters =
    'Bright daylight and darker evenings are common levers people talk about for circadian rhythm. ' +
    'This section is a learning demo only—it is not medical advice and not a perfect model of your body clock.'

  /** Short label for “what part of the day to think about” — still rule-based, not a forecast. */
  let likelyLightFocus
  /** Main coaching sentence for the card body. */
  let adviceParagraph
  /** Tiny chip text so users see which rule fired (helpful while learning). */
  let ruleTag

  if (category === 'short') {
    likelyLightFocus = 'Balanced daylight (typical day rhythm)'
    adviceParagraph =
      'Use normal daylight exposure at your destination—think “regular bright days and dim evenings,” not a special protocol for this smaller time change (frontend demo only).'
    ruleTag = 'Rule: small time difference'
  } else if (category === 'medium') {
    likelyLightFocus = 'Morning light after arrival'
    adviceParagraph =
      'Prioritize morning light after arrival so your eyes get a clear daytime signal early in the local day. Still a rough teaching hint—not a treatment plan.'
    ruleTag = 'Rule: medium time difference'
  } else if (category === 'large' && eastboundStyle) {
    likelyLightFocus = 'Morning bright light + calmer evenings'
    adviceParagraph =
      'Get bright morning light and dim lights at night. In this demo we treat a large “destination ahead” gap as eastbound-style language only—it is not a clinical label.'
    ruleTag = 'Rule: large shift, eastbound-style'
  } else if (category === 'large' && westboundStyle) {
    likelyLightFocus = 'Afternoon / evening light, used carefully'
    adviceParagraph =
      'Use afternoon and evening light carefully so you do not accidentally nudge sleep even later. Westbound-style wording here is for learning UI, not a diagnosis.'
    ruleTag = 'Rule: large shift, westbound-style'
  } else {
    // Large category with exactly 0 offset is unlikely; keep a safe fallback.
    likelyLightFocus = 'Balanced daylight with steady evenings'
    adviceParagraph =
      'Keep daytime reasonably bright and evenings softer. This fallback keeps the UI friendly when the hour gap is unusual (still not medical advice).'
    ruleTag = 'Rule: fallback'
  }

  return {
    whyLightMatters,
    likelyLightFocus,
    adviceParagraph,
    ruleTag,
    destinationLabel,
    offsetLabel: plan.offsetLabel,
  }
}
