import { Link } from 'react-router-dom'
import { describeTripCities } from '../lib/savedTripsStorage.js'
import { primaryButtonClass, secondaryButtonClass } from './ui/buttonClasses.js'

function sleepLabel(pref) {
  return pref === 'morning' ? 'Morning person' : 'Night person'
}

function difficultyPillClass(shiftCategory) {
  if (shiftCategory === 'short') return 'border-emerald-200 bg-emerald-50 text-emerald-900'
  if (shiftCategory === 'medium') return 'border-amber-200 bg-accent-soft text-amber-950'
  return 'border-navy/25 bg-navy text-cream'
}

/**
 * SavedTripCard — one saved trip with actions.
 */
export default function SavedTripCard({ trip, onDelete }) {
  const { departure, destination } = describeTripCities(trip.form)

  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-sm ring-1 ring-black/[0.03] transition hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-base font-semibold leading-snug text-ink sm:text-lg">
            {departure} → {destination}
          </p>
          <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-ink-muted">Departure date</dt>
              <dd className="mt-0.5 font-medium text-ink">{trip.form.departureDate || '—'}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Sleep preference</dt>
              <dd className="mt-0.5 font-medium text-ink">{sleepLabel(trip.form.sleepPreference)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Magnesium reminders</dt>
              <dd className="mt-0.5 font-medium text-ink">
                {trip.form.wantsMagnesium === true ? 'Yes' : 'No'}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">Time difference</dt>
              <dd className="mt-0.5 font-medium tabular-nums text-ink">{trip.offsetLabel}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Difficulty</dt>
              <dd className="mt-0.5">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${difficultyPillClass(trip.shiftCategory)}`}
                >
                  {trip.difficultyLabel}
                </span>
              </dd>
            </div>
          </dl>
          <p className="text-xs text-ink-muted">
            Saved{' '}
            {new Date(trip.savedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:min-w-[10.5rem]">
          <Link
            to="/results"
            state={{ form: trip.form }}
            className={`${primaryButtonClass} no-underline`}
          >
            View Plan
          </Link>
          <button
            type="button"
            onClick={() => onDelete(trip.id)}
            className={`${secondaryButtonClass} hover:border-red-200 hover:bg-red-50 hover:text-red-900`}
          >
            Delete Trip
          </button>
        </div>
      </div>
    </article>
  )
}
