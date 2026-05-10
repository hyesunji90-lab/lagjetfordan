/**
 * Hero — centered headline + simple “store” buttons (placeholders, not real store badges).
 */
export default function Hero() {
  return (
    <section className="py-14 text-center sm:py-20">
      <h1 className="mx-auto max-w-3xl text-[1.65rem] font-medium leading-snug tracking-tight text-ink sm:text-3xl">
        Trusted by travelers who want their first day abroad to feel intentional—not
        lost to jet lag.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
        This is a learning prototype: calm layout, clear schedule blocks, and plenty
        of whitespace—before real time zones or science-backed rules.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className="min-w-[10rem] rounded-lg bg-ink px-6 py-3 text-sm font-medium text-cream transition hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          App Store
        </button>
        <button
          type="button"
          className="min-w-[10rem] rounded-lg bg-ink px-6 py-3 text-sm font-medium text-cream transition hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Google Play
        </button>
      </div>
    </section>
  )
}
