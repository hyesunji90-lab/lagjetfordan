/**
 * TripCard — one “plan” row: large circle + route text (list style, not a grid card).
 */
export default function TripCard({ route, detail, circleClass }) {
  return (
    <article className="flex items-center gap-4 py-3">
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-inner ring-1 ring-black/5 ${circleClass}`}
        aria-hidden
      >
        <span className="text-lg text-white/90 drop-shadow-sm">✈</span>
      </div>
      <div className="min-w-0 text-left">
        <h3 className="text-[15px] font-semibold text-ink">{route}</h3>
        <p className="mt-0.5 text-sm text-ink-muted">{detail}</p>
      </div>
    </article>
  )
}
