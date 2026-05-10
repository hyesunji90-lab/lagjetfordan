import { useState } from 'react'
import { SUPPORTED_CITIES } from '../data/supportedCities.js'
import { validateTripForm } from '../lib/validateTripForm.js'
import { primaryButtonWideClass } from './ui/buttonClasses.js'

/**
 * Default row: two different zones so the first render already shows a real offset.
 */
const emptyFields = {
  departureTimeZone: 'America/Los_Angeles',
  destinationTimeZone: 'America/New_York',
  departureDate: '',
  sleepPreference: 'morning',
  /** Whether to show optional magnesium glycinate reminder copy (not medical advice). */
  wantsMagnesium: false,
}

const fieldBaseClass =
  'w-full rounded-xl border bg-cream px-3 py-2.5 text-sm text-ink outline-none transition focus:ring-2'
const fieldNormalClass = `${fieldBaseClass} border-line focus:border-ink/20 focus:ring-accent/30`
const fieldErrorClass = `${fieldBaseClass} border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-200`

/**
 * TripPlannerForm — collects trip details, validates, then calls the parent.
 *
 * Props:
 * - onGeneratePlan: async function; we await it so we can show a short “generating” state.
 * - showTopDivider: when false, skip the top border (planner-only page).
 */
export default function TripPlannerForm({ onGeneratePlan, showTopDivider = true }) {
  const [fields, setFields] = useState(emptyFields)
  /** Simple map of field name → error string (empty object means no errors). */
  const [fieldErrors, setFieldErrors] = useState({})
  /** True while we wait on the parent (fake delay + navigation). */
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(name, value) {
    setFields((prev) => ({ ...prev, [name]: value }))
    // Clear that field’s error as soon as the user edits—keeps the form feeling responsive.
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      if (name === 'departureTimeZone' || name === 'destinationTimeZone') {
        delete next.destinationTimeZone
      }
      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = validateTripForm(fields)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)
    try {
      await onGeneratePlan(fields)
    } catch {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      className={showTopDivider ? 'border-t border-line pt-12' : 'pt-8'}
      aria-labelledby="planner-heading"
    >
      <h2
        id="planner-heading"
        className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted"
      >
        Trip planner
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-center text-sm text-ink-muted">
        Pick cities from the list—each maps to a real IANA time zone. Offsets respect your departure
        date (including DST) using Luxon in the browser.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto mt-8 max-w-lg space-y-5 rounded-2xl border border-line bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:p-7"
      >
        <div className="space-y-2">
          <label htmlFor="departureTimeZone" className="block text-sm font-medium text-ink">
            Departure city <span className="text-red-600">*</span>
          </label>
          <select
            id="departureTimeZone"
            name="departureTimeZone"
            value={fields.departureTimeZone}
            onChange={(e) => handleChange('departureTimeZone', e.target.value)}
            aria-invalid={Boolean(fieldErrors.departureTimeZone)}
            className={fieldErrors.departureTimeZone ? fieldErrorClass : fieldNormalClass}
          >
            {SUPPORTED_CITIES.map((city) => (
              <option key={city.timeZone} value={city.timeZone}>
                {city.label} ({city.timeZone})
              </option>
            ))}
          </select>
          {fieldErrors.departureTimeZone && (
            <p className="text-xs text-red-700">{fieldErrors.departureTimeZone}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="destinationTimeZone" className="block text-sm font-medium text-ink">
            Destination city <span className="text-red-600">*</span>
          </label>
          <select
            id="destinationTimeZone"
            name="destinationTimeZone"
            value={fields.destinationTimeZone}
            onChange={(e) => handleChange('destinationTimeZone', e.target.value)}
            aria-invalid={Boolean(fieldErrors.destinationTimeZone)}
            className={fieldErrors.destinationTimeZone ? fieldErrorClass : fieldNormalClass}
          >
            {SUPPORTED_CITIES.map((city) => (
              <option key={`dest-${city.timeZone}`} value={city.timeZone}>
                {city.label} ({city.timeZone})
              </option>
            ))}
          </select>
          {fieldErrors.destinationTimeZone && (
            <p className="text-xs text-red-700">{fieldErrors.destinationTimeZone}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="departureDate" className="block text-sm font-medium text-ink">
            Departure date <span className="text-red-600">*</span>
          </label>
          <input
            id="departureDate"
            name="departureDate"
            type="date"
            value={fields.departureDate}
            onChange={(e) => handleChange('departureDate', e.target.value)}
            aria-invalid={Boolean(fieldErrors.departureDate)}
            className={fieldErrors.departureDate ? fieldErrorClass : fieldNormalClass}
          />
          {fieldErrors.departureDate ? (
            <p className="text-xs text-red-700">{fieldErrors.departureDate}</p>
          ) : (
            <p className="text-xs text-ink-muted">
              Required so we can apply the right daylight-saving rules for that day.
            </p>
          )}
        </div>

        <fieldset className="space-y-2 border-0 p-0">
          <legend className="block text-sm font-medium text-ink">
            Sleep preference <span className="text-red-600">*</span>
          </legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <label className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-line bg-cream px-3 py-2.5 text-sm transition has-[:checked]:border-accent has-[:checked]:bg-accent-soft hover:border-ink/10">
              <input
                type="radio"
                name="sleepPreference"
                value="morning"
                checked={fields.sleepPreference === 'morning'}
                onChange={() => handleChange('sleepPreference', 'morning')}
                className="accent-accent"
              />
              Morning person
            </label>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-line bg-cream px-3 py-2.5 text-sm transition has-[:checked]:border-accent has-[:checked]:bg-accent-soft hover:border-ink/10">
              <input
                type="radio"
                name="sleepPreference"
                value="night"
                checked={fields.sleepPreference === 'night'}
                onChange={() => handleChange('sleepPreference', 'night')}
                className="accent-accent"
              />
              Night person
            </label>
          </div>
          {fieldErrors.sleepPreference && (
            <p className="text-xs text-red-700">{fieldErrors.sleepPreference}</p>
          )}
        </fieldset>

        <fieldset className="space-y-2 border-0 p-0">
          <legend className="block text-sm font-medium leading-snug text-ink">
            Would you like magnesium glycinate sleep-support reminders?{' '}
            <span className="text-red-600">*</span>
          </legend>
          <p className="text-xs leading-relaxed text-ink-muted">
            Optional only—we never suggest a dose, and we do not claim magnesium treats jet lag or
            insomnia.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <label className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-line bg-cream px-3 py-2.5 text-sm transition has-[:checked]:border-accent has-[:checked]:bg-accent-soft hover:border-ink/10">
              <input
                type="radio"
                name="wantsMagnesium"
                checked={fields.wantsMagnesium === true}
                onChange={() => handleChange('wantsMagnesium', true)}
                className="accent-accent"
              />
              Yes
            </label>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-line bg-cream px-3 py-2.5 text-sm transition has-[:checked]:border-accent has-[:checked]:bg-accent-soft hover:border-ink/10">
              <input
                type="radio"
                name="wantsMagnesium"
                checked={fields.wantsMagnesium === false}
                onChange={() => handleChange('wantsMagnesium', false)}
                className="accent-accent"
              />
              No
            </label>
          </div>
          {fieldErrors.wantsMagnesium && (
            <p className="text-xs text-red-700">{fieldErrors.wantsMagnesium}</p>
          )}
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting}
          className={primaryButtonWideClass}
        >
          {isSubmitting ? 'Generating your plan…' : 'Generate Plan'}
        </button>
      </form>
    </section>
  )
}
