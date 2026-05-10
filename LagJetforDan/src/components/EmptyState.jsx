import { Link } from 'react-router-dom'
import { primaryButtonWideClass } from './ui/buttonClasses.js'

/**
 * EmptyState — reusable friendly “nothing here yet” panel with one clear action.
 */
export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-gradient-to-b from-white to-cream-dark/30 px-6 py-14 text-center shadow-sm sm:px-10 sm:py-16">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-2xl shadow-inner ring-1 ring-accent/20"
        aria-hidden
      >
        ✈
      </div>
      <h2 className="mt-6 text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">{description}</p>
      <Link to={actionTo} className={`${primaryButtonWideClass} mx-auto mt-8 max-w-xs no-underline`}>
        {actionLabel}
      </Link>
    </div>
  )
}
