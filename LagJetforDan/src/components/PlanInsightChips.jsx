/**
 * PlanInsightChips — shows the computed hour gap + difficulty on the results page.
 */
export default function PlanInsightChips({
  offsetLabel,
  directionHint,
  difficultyLabel,
  shiftCategory,
  isEstimate,
  offsetNote,
}) {
  const difficultyStyles =
    shiftCategory === 'short'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : shiftCategory === 'medium'
        ? 'border-amber-200 bg-accent-soft text-amber-950'
        : 'border-navy/25 bg-navy text-cream'

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
      <div className="rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          Time difference (calculated)
        </p>
        <p className="mt-1 text-lg font-semibold tabular-nums text-ink">{offsetLabel}</p>
        <p className="mt-0.5 text-xs text-ink-muted">{directionHint}</p>
        {offsetNote && <p className="mt-2 text-xs leading-relaxed text-ink-muted">{offsetNote}</p>}
        {isEstimate && (
          <p className="mt-2 text-xs font-medium text-accent">
            We could not read those zones—stick to the cities in the planner list.
          </p>
        )}
      </div>
      <div
        className={`rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm ${difficultyStyles}`}
        role="status"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">Difficulty (demo)</p>
        <p className="mt-1">{difficultyLabel}</p>
      </div>
    </div>
  )
}
