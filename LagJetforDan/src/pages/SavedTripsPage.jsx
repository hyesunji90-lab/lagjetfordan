import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState.jsx'
import SavedTripCard from '../components/SavedTripCard.jsx'
import { ghostLinkClass } from '../components/ui/buttonClasses.js'
import { deleteSavedTrip, loadSavedTrips } from '../lib/savedTripsStorage.js'

/**
 * SavedTripsPage — lists trips from localStorage.
 * `useState(() => loadSavedTrips())` reads storage once on first mount of this route.
 */
export default function SavedTripsPage() {
  const [trips, setTrips] = useState(() => loadSavedTrips())

  function handleDelete(id) {
    deleteSavedTrip(id)
    setTrips(loadSavedTrips())
  }

  return (
    <div className="space-y-8 px-0 pt-6 sm:pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to="/" className={ghostLinkClass}>
            <span aria-hidden>←</span> Back to planner
          </Link>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Saved trips</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Stored in <span className="font-medium text-ink">localStorage</span> on this device only—not
            synced to a server. Clearing site data removes them.
          </p>
        </div>
      </div>

      {trips.length === 0 ? (
        <EmptyState
          title="No saved trips yet"
          description="When you generate a plan from the home planner, we save a copy here automatically. Create your first trip to see it show up in this list."
          actionLabel="Create a trip"
          actionTo="/"
        />
      ) : (
        <ul className="space-y-4 sm:space-y-5">
          {trips.map((trip) => (
            <li key={trip.id}>
              <SavedTripCard trip={trip} onDelete={handleDelete} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
