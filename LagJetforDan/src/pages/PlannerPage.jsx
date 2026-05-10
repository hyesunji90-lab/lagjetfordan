import { useNavigate } from 'react-router-dom'
import TripPlannerForm from '../components/TripPlannerForm.jsx'
import { generateJetLagPlan } from '../lib/jetLagCalculator.js'
import { saveNewTrip } from '../lib/savedTripsStorage.js'

/** Short pause so the UI can show “Generating…”—purely for UX, not a real network call. */
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * PlannerPage — trip form only. Submitting validates in the form, then we save + navigate.
 */
export default function PlannerPage() {
  const navigate = useNavigate()

  async function handleGeneratePlan(formValues) {
    await delay(700)
    const plan = generateJetLagPlan(formValues)
    saveNewTrip(formValues, plan)
    navigate('/results', { state: { form: formValues } })
  }

  return (
    <div className="px-0 pt-6 sm:pt-10">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Plan your trip
      </h1>
      <p className="mx-auto mt-3 max-w-lg px-1 text-center text-sm leading-relaxed text-ink-muted">
        Build a day-at-destination preview. Each successful generate is saved in this browser so you
        can reopen it from Saved trips.
      </p>
      <TripPlannerForm onGeneratePlan={handleGeneratePlan} showTopDivider={false} />
    </div>
  )
}
