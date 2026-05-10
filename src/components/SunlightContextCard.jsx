/**
 * SunlightContextCard — polished panel for rule-based daylight hints from `sunlightAdvisor.js`.
 * The parent (ResultsPage) calls `generateSunlightAdvice` and passes the returned object here.
 */
export default function SunlightContextCard({ sunlight }) {
  return (
    <section
      className="rounded-2xl border border-sky-200/90 bg-gradient-to-br from-sky-50 via-white to-amber-50/50 p-5 shadow-[0_12px_40px_rgba(14,116,144,0.08)] sm:p-7"
      aria-labelledby="sunlight-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="sunlight-heading"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-900/80"
        >
          Sunlight Context
        </h2>
        <span className="w-fit rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-900 ring-1 ring-sky-100">
          {sunlight.ruleTag}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink">{sunlight.whyLightMatters}</p>

      <div className="mt-5 rounded-xl border border-sky-100/80 bg-white/70 px-4 py-3 sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          Likely light focus for {sunlight.destinationLabel}
        </p>
        <p className="mt-1 text-base font-semibold text-ink">{sunlight.likelyLightFocus}</p>
        <p className="mt-1 text-xs text-ink-muted">Based on {sunlight.offsetLabel} in this demo—not real weather or sun position.</p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{sunlight.adviceParagraph}</p>
    </section>
  )
}
