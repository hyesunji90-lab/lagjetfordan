import TripCard from './TripCard.jsx'
import { sampleTrips } from '../data/sampleTrips.js'

/**
 * TripGrid — lists trip rows from props, or falls back to demo data.
 *
 * Props:
 * - trips: optional array of trip objects. If omitted, we show `sampleTrips`.
 * - listTitle / listHint: optional strings to explain what the list is showing.
 */
export default function TripGrid({ trips, listTitle, listHint }) {
  const list = trips === undefined ? sampleTrips : trips
  const title = listTitle ?? 'Your jet lag plans'
  const hint =
    listHint ??
    'Example trips—use the trip planner above to replace this list with a mock trip.'

  return (
    <section className="border-t border-line pt-12" aria-labelledby="trips-heading">
      <h2
        id="trips-heading"
        className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted"
      >
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-center text-sm text-ink-muted">{hint}</p>
      <div className="mx-auto mt-8 max-w-sm divide-y divide-line">
        {list.map((trip) => (
          <TripCard
            key={trip.id}
            route={trip.route}
            detail={trip.detail}
            circleClass={trip.circleClass}
          />
        ))}
      </div>
    </section>
  )
}
