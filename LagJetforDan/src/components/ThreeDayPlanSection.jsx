import { useState } from 'react'
import PlanTimeline from './PlanTimeline.jsx'

/**
 * Tabbed UI for Phase 10: Day 1–3 destination timelines (wellness demo only).
 *
 * @param {{
 *   threeDayPlan: { days: Array<{
 *     dayNumber: number,
 *     heading: string,
 *     narrative: string,
 *     timelineBlocks: object[],
 *     targetBedtimeLabel: string,
 *     caffeineCutoffSummary: string,
 *   }> },
 *   planMetaText: string,
 *   sameDayTimelineFilter?: { applied: boolean, detail: string },
 * }} props
 */
export default function ThreeDayPlanSection({ threeDayPlan, planMetaText, sameDayTimelineFilter }) {
  const [active, setActive] = useState(0)

  if (!threeDayPlan?.days?.length) {
    return null
  }

  const day = threeDayPlan.days[active]

  return (
    <section
      className="rounded-2xl border border-line bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:p-7"
      aria-labelledby="three-day-heading"
    >
      <h2
        id="three-day-heading"
        className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted"
      >
        Three-day destination rhythm (demo)
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-center text-sm leading-relaxed text-ink-muted">
        {planMetaText}
      </p>
      <p className="mx-auto mt-3 max-w-xl text-center text-xs leading-relaxed text-ink-muted">
        Day 1 uses the strongest adjustment hints for this trip profile. Day 2 relaxes slightly. Day 3
        moves closer to an everyday local schedule. Light timing is weighted heavily because bright
        light is the strongest common zeitgeber in teaching models—not a perfect map of your biology.
      </p>

      {sameDayTimelineFilter?.applied && (
        <aside
          className="mx-auto mt-5 max-w-xl rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-xs leading-relaxed text-amber-950 sm:px-5"
          role="status"
        >
          <p className="font-semibold text-amber-950">Same-day departure — current time awareness</p>
          <p className="mt-1.5 text-amber-950/95">{sameDayTimelineFilter.detail}</p>
        </aside>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Choose day">
        {threeDayPlan.days.map((d, i) => {
          const selected = i === active
          return (
            <button
              key={d.dayNumber}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`day-tab-${d.dayNumber}`}
              aria-controls={`day-panel-${d.dayNumber}`}
              onClick={() => setActive(i)}
              className={`min-h-[44px] rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30 ${
                selected
                  ? 'bg-ink text-cream shadow-sm'
                  : 'border border-line bg-cream text-ink-muted hover:border-ink/20 hover:text-ink'
              }`}
            >
              Day {d.dayNumber}
            </button>
          )
        })}
      </div>

      <div
        id={`day-panel-${day.dayNumber}`}
        role="tabpanel"
        aria-labelledby={`day-tab-${day.dayNumber}`}
        className="mt-8"
      >
        <p className="text-center text-sm text-ink-muted">{day.narrative}</p>
        <div className="mx-auto mt-5 max-w-lg rounded-xl border border-line bg-cream/40 px-4 py-3 text-sm text-ink">
          <p className="font-medium leading-snug">{day.targetBedtimeLabel}</p>
          <p className="mt-2 leading-relaxed text-ink-muted">{day.caffeineCutoffSummary}</p>
        </div>
        <PlanTimeline
          key={day.dayNumber}
          blocks={day.timelineBlocks}
          heading={day.heading}
          description="Bright light anchors the day; caffeine ends before wind-down; naps stay short and earlier when possible. General wellness guidance only—not medical advice."
        />
      </div>
    </section>
  )
}
