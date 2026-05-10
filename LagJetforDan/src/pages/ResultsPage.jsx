import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import PlanInsightChips from '../components/PlanInsightChips.jsx'
import ThreeDayPlanSection from '../components/ThreeDayPlanSection.jsx'
import SunlightContextCard from '../components/SunlightContextCard.jsx'
import TripCard from '../components/TripCard.jsx'
import { ghostLinkClass } from '../components/ui/buttonClasses.js'
import { getCityLabel } from '../data/supportedCities.js'
import { generateJetLagPlan } from '../lib/jetLagCalculator.js'
import { generateSunlightAdvice } from '../lib/sunlightAdvisor.js'
import { getTravelCoachNote } from '../lib/travelCoach.js'

function travelDirectionSummary(direction) {
  if (direction === 'eastbound') {
    return 'Eastbound-style — destination clocks are ahead (advance-sleep story in this demo).'
  }
  if (direction === 'westbound') {
    return 'Westbound-style — destination clocks are behind (delay-sleep story in this demo).'
  }
  return 'Neutral offset — no directional shift in this demo; still use the gentle template below.'
}

/**
 * ResultsPage — reads `location.state.form`, runs `generateJetLagPlan`, shows summary + timeline.
 *
 * Phase 8: we also call `generateSunlightAdvice(plan, form)` so sunlight hints stay in sync with the
 * same plan object the timeline uses—no extra network calls, just another pure function.
 */
export default function ResultsPage() {
  const location = useLocation()
  const form = location.state?.form

  const plan = useMemo(() => {
    if (!form) return null
    return generateJetLagPlan(form)
  }, [form])

  const sunlight = useMemo(() => {
    if (!plan || !form) return null
    return generateSunlightAdvice(plan, form)
  }, [plan, form])

  if (!form || !plan) {
    return (
      <div className="py-10 sm:py-14">
        <EmptyState
          title="No plan to show here"
          description="That usually means you opened this page directly or refreshed. Trip data lives in your browser session until you generate a new plan from the home planner."
          actionLabel="Go to planner"
          actionTo="/"
        />
        <div className="mt-8 text-center">
          <Link to="/" className={ghostLinkClass}>
            <span aria-hidden>←</span> Back to planner
          </Link>
        </div>
      </div>
    )
  }

  const trip = plan.trip
  const coachNote = getTravelCoachNote(form)

  return (
    <div className="space-y-8 pb-4 pt-6 sm:space-y-10 sm:pt-8">
      <div>
        <Link to="/" className={ghostLinkClass}>
          <span aria-hidden>←</span> Back to planner
        </Link>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:mt-6 sm:text-3xl">
          Your mock jet lag plan
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
          Time gap uses real IANA zones (Luxon). Below is a three-day destination rhythm sketch using
          simplified circadian-style rules for learning—not medical advice.
        </p>
        <div className="mt-6">
          <PlanInsightChips
            offsetLabel={plan.offsetLabel}
            directionHint={plan.directionHint}
            difficultyLabel={plan.difficultyLabel}
            shiftCategory={plan.shiftCategory}
            isEstimate={plan.isEstimate}
            offsetNote={plan.offsetNote}
          />
        </div>
        <aside
          className="mt-6 rounded-2xl border border-sky-200 bg-sky-50/90 px-4 py-3 text-sm leading-relaxed text-sky-950 sm:px-5"
          role="note"
          aria-label="Travel direction and gradual adjustment"
        >
          <p className="font-medium text-sky-950">{travelDirectionSummary(plan.travelDirection)}</p>
          <p className="mt-2 text-sky-900/90">{plan.gradualAdjustmentNote}</p>
        </aside>
        {coachNote && (
          <aside
            className="mt-6 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 text-sm leading-relaxed text-violet-950 sm:px-5"
            role="note"
          >
            {coachNote}
          </aside>
        )}
      </div>

      {sunlight && <SunlightContextCard sunlight={sunlight} />}

      <section
        className="rounded-2xl border border-line bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:p-7"
        aria-labelledby="summary-heading"
      >
        <h2 id="summary-heading" className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
          Trip summary
        </h2>
        <div className="mt-4 border-t border-line pt-4">
          <TripCard route={trip.route} detail={trip.detail} circleClass={trip.circleClass} />
        </div>
        <dl className="mt-6 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-muted">Departure city</dt>
            <dd className="font-medium text-ink">
              <span className="block">{getCityLabel(form.departureTimeZone)}</span>
              <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                {form.departureTimeZone || '—'}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted">Destination city</dt>
            <dd className="font-medium text-ink">
              <span className="block">{getCityLabel(form.destinationTimeZone)}</span>
              <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                {form.destinationTimeZone || '—'}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted">Departure date</dt>
            <dd className="font-medium text-ink">{form.departureDate || '—'}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Sleep preference</dt>
            <dd className="font-medium text-ink">
              {form.sleepPreference === 'morning' ? 'Morning person' : 'Night person'}
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted">Magnesium sleep-support reminders</dt>
            <dd className="font-medium text-ink">
              {form.wantsMagnesium === true
                ? 'Yes — optional routine reminder added to your timeline'
                : 'No'}
            </dd>
          </div>
        </dl>
      </section>

      <ThreeDayPlanSection
        threeDayPlan={plan.threeDayPlan}
        sameDayTimelineFilter={plan.sameDayTimelineFilter}
        planMetaText={
          form.wantsMagnesium === true
            ? `Built for a ${plan.shiftCategory} time change (${plan.offsetLabel}), ${plan.travelDirection} pattern, and your sleep style. Optional magnesium reminders appear on each day you enabled them—education only.`
            : `Built for a ${plan.shiftCategory} time change (${plan.offsetLabel}), ${plan.travelDirection} pattern, and your sleep style—learning demo only.`
        }
      />

      <p className="text-center text-xs leading-relaxed text-ink-muted">{plan.wellnessDisclaimer}</p>
    </div>
  )
}
