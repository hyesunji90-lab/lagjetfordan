/**
 * Shared button / link styles so the app feels like one product.
 * Import these strings and append `className` extras when needed.
 */

export const primaryButtonClass =
  'inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-ink px-4 py-2.5 text-center text-sm font-semibold text-cream shadow-sm transition hover:bg-ink/90 hover:shadow active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto'

export const primaryButtonWideClass =
  'inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition hover:bg-ink/90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60'

export const secondaryButtonClass =
  'inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-line bg-cream px-4 py-2.5 text-sm font-medium text-ink shadow-sm transition hover:border-ink/15 hover:bg-white active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30 sm:w-auto'

export const navLinkClass =
  'rounded-lg px-2 py-1.5 no-underline transition hover:bg-black/[0.04] hover:text-ink'

export const navLinkActiveClass = 'bg-black/[0.06] text-ink font-semibold'

export const navLinkInactiveClass = 'text-ink-muted'

/** Quiet text link (back navigation, subtle actions). */
export const ghostLinkClass =
  'inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-ink-muted no-underline transition hover:bg-black/[0.04] hover:text-ink'
