import { dayWindow, sampleTimelineBlocks } from '../data/sampleTimeline.js'

function formatHourLabel(totalMinutes) {
  const h24 = Math.floor(totalMinutes / 60) % 24
  const am = h24 < 12
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}${am ? 'am' : 'pm'}`
}

function blockLayout(startMinutes, endMinutes, window) {
  const { startMinutes: d0, endMinutes: d1 } = window
  const span = d1 - d0
  const heightPct = ((endMinutes - startMinutes) / span) * 100
  const topPct = ((startMinutes - d0) / span) * 100
  return { top: `${topPct}%`, height: `${heightPct}%` }
}

function IconBright() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function IconCoffeeOff() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M6 18h8a4 4 0 0 0 4-4h1a3 3 0 0 0 3-3h-7M6 18v-7M6 18H4M4 6l16 16" />
    </svg>
  )
}

function IconNap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 14c2.5 1.5 5.5 1 7-1M10 10h.01M14 10h.01M18 14h-4a2 2 0 0 0-2 2v2" />
      <path d="M4 18h16" />
    </svg>
  )
}

function IconMoon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 6.5 6.5 0 1 0 21 14.5z" />
    </svg>
  )
}

/** Simple capsule icon for optional supplement-style reminders (not a drug logo). */
function IconCapsule() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="8" y="5" width="8" height="14" rx="4" ry="4" transform="rotate(45 12 12)" />
    </svg>
  )
}

function BlockIcon({ kind }) {
  const common = 'mb-1.5 drop-shadow-sm'
  if (kind === 'bright-light') {
    return (
      <span className={`${common} text-white`}>
        <IconBright />
      </span>
    )
  }
  if (kind === 'avoid-caffeine') {
    return (
      <span className={`${common} text-coffee`}>
        <IconCoffeeOff />
      </span>
    )
  }
  if (kind === 'nap') {
    return (
      <span className={`${common} text-amber-800`}>
        <IconNap />
      </span>
    )
  }
  if (kind === 'sleep-support') {
    return (
      <span className={`${common} text-violet-700`}>
        <IconCapsule />
      </span>
    )
  }
  return (
    <span className={`${common} text-white`}>
      <IconMoon />
    </span>
  )
}

function barClassForKind(kind) {
  if (kind === 'bright-light') {
    return 'w-14 rounded-full bg-accent shadow-[0_6px_20px_rgba(245,166,35,0.35)]'
  }
  if (kind === 'avoid-caffeine') {
    return 'w-5 rounded-full border-[2.5px] border-coffee bg-cream shadow-none'
  }
  if (kind === 'nap') {
    return 'w-10 rounded-full border border-orange-200/90 bg-accent-soft'
  }
  if (kind === 'sleep-support') {
    return 'w-9 rounded-full border border-violet-200 bg-violet-50 shadow-sm'
  }
  return 'w-12 rounded-full bg-navy shadow-inner'
}

/**
 * PlanTimeline — vertical day strip with pill bars (duration ∝ height).
 *
 * Props:
 * - blocks: timeline rows to draw (same shape as sampleTimelineBlocks).
 * - heading / description: optional section text (defaults keep the old copy).
 */
export default function PlanTimeline({
  blocks = sampleTimelineBlocks,
  heading = 'Sample day at destination',
  description = 'Illustrative blocks only—not medical advice.',
}) {
  const window = dayWindow
  const { startMinutes: d0, endMinutes: d1 } = window
  const ticks = []
  for (let m = d0; m <= d1; m += 60) {
    ticks.push(m)
  }

  return (
    <section className="border-t border-line pt-14" aria-labelledby="timeline-heading">
      <div className="text-center">
        <h2 id="timeline-heading" className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
          {heading}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{description}</p>
      </div>

      <div className="mx-auto mt-10 max-w-md">
        <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <div className="flex min-h-[28rem] gap-0">
            <div className="relative w-12 shrink-0 sm:w-14">
              <div className="absolute inset-0 pr-2 pt-2">
                {ticks.map((m) => {
                  const top = ((m - d0) / (d1 - d0)) * 100
                  return (
                    <span
                      key={m}
                      className="absolute right-0 translate-y-[-50%] text-[11px] font-medium tabular-nums text-ink-muted"
                      style={{ top: `${top}%` }}
                    >
                      {formatHourLabel(m)}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="relative min-h-[28rem] flex-1 border-l border-line">
              {blocks.map((block) => {
                const layout = blockLayout(block.startMinutes, block.endMinutes, window)
                return (
                  <div
                    key={block.id}
                    className="absolute left-1/2 flex w-[88px] min-h-[4.5rem] -translate-x-1/2 flex-col items-center"
                    style={{ top: layout.top, height: layout.height }}
                  >
                    <BlockIcon kind={block.kind} />
                    <div
                      className={`min-h-8 flex-1 ${barClassForKind(block.kind)}`}
                      title={block.title}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <ul className="space-y-3 border-t border-line bg-cream px-5 py-4 text-left text-sm text-ink-muted">
            {blocks.map((b) => (
              <li key={b.id}>
                <span className="font-medium text-ink">{b.title}</span>
                <span className="text-ink-muted"> — {b.subtitle}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
