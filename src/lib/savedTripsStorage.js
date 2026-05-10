/**
 * savedTripsStorage.js — read/write saved trips in the browser’s localStorage.
 *
 * WHAT IS localStorage?
 * -----------------------
 * `localStorage` is a small built-in key–value store in the browser.
 * - Keys and values are always **strings**.
 * - Data **stays after refresh** (until the user clears site data or you overwrite it).
 * - Data is **only on this device + browser** (not a cloud backup).
 * - There is **no login**—any script on your domain can read it, so never store secrets.
 *
 * PATTERN WE USE
 * --------------
 * We keep **one JSON array** under a single key (`STORAGE_KEY`).
 * When saving: `JSON.stringify(array)` → `localStorage.setItem(...)`.
 * When loading: `localStorage.getItem(...)` → `JSON.parse(...)` inside try/catch.
 */

import { getCityLabel } from '../data/supportedCities.js'

/** One key for the whole app so we don’t collide with other sites’ data. */
const STORAGE_KEY = 'jetLagPlanner.savedTrips.v1'

/**
 * Read all saved trips (newest first). Returns [] if nothing saved or JSON is broken.
 */
export function loadSavedTrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // JSON.parse can throw if someone edited DevTools—fail soft with an empty list.
    return []
  }
}

/**
 * Write the full list back to localStorage (we replace the whole array each time).
 */
function writeAllTrips(trips) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
}

/**
 * Add one trip after the user generates a plan. `form` + `plan` come from the planner flow.
 * @returns {object} the new entry (includes `id`) so callers can log or use it later.
 */
export function saveNewTrip(form, plan) {
  const trips = loadSavedTrips()
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `trip-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  const entry = {
    id,
    savedAt: new Date().toISOString(),
    form: {
      departureTimeZone: form.departureTimeZone,
      destinationTimeZone: form.destinationTimeZone,
      departureDate: form.departureDate,
      sleepPreference: form.sleepPreference,
      // Optional sleep-support preference (boolean keeps JSON small and easy to read).
      wantsMagnesium: Boolean(form.wantsMagnesium),
    },
    offsetLabel: plan.offsetLabel,
    offsetHours: plan.offsetHours,
    difficultyLabel: plan.difficultyLabel,
    shiftCategory: plan.shiftCategory,
  }

  // Newest trips appear first in the UI.
  const next = [entry, ...trips]
  writeAllTrips(next)
  return entry
}

/**
 * Remove a trip by id, then rewrite storage.
 */
export function deleteSavedTrip(id) {
  const next = loadSavedTrips().filter((trip) => trip.id !== id)
  writeAllTrips(next)
}

/**
 * Small helper for cards: pretty city names from the stored IANA strings.
 */
export function describeTripCities(form) {
  return {
    departure: getCityLabel(form.departureTimeZone),
    destination: getCityLabel(form.destinationTimeZone),
  }
}
