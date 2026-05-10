import { WELLNESS_DISCLAIMER } from '../lib/circadianLogic.js'

/**
 * SiteFooter — thin divider, quiet copy.
 */
export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-line py-8 text-center text-xs text-ink-muted sm:mt-20">
      <p>Learning project with React and Tailwind. Timelines are for layout practice only.</p>
      <p className="mx-auto mt-3 max-w-md leading-relaxed">{WELLNESS_DISCLAIMER}</p>
    </footer>
  )
}
