import { Link, NavLink } from 'react-router-dom'
import { useDemoGate } from './DemoPasswordGate.jsx'
import { navLinkActiveClass, navLinkClass, navLinkInactiveClass } from './ui/buttonClasses.js'

/**
 * SiteHeader — logo + compact primary navigation (real product routes only).
 */
function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden className="shrink-0">
      <rect x="3" y="10" width="4" height="14" rx="1" fill="#f5a623" />
      <rect x="10" y="6" width="4" height="18" rx="1" fill="#c4c2bc" />
      <rect x="17" y="12" width="4" height="12" rx="1" fill="#1a2744" />
      <rect x="24" y="8" width="4" height="16" rx="1" fill="#e8a849" />
    </svg>
  )
}

function navClassName({ isActive }) {
  return `${navLinkClass} ${isActive ? navLinkActiveClass : navLinkInactiveClass}`
}

export default function SiteHeader() {
  const { logout } = useDemoGate()

  return (
    <header className="border-b border-line py-4 sm:py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-3 text-inherit no-underline transition hover:opacity-90">
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-wide text-ink">JET LAG PLANNER</span>
        </Link>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
          <nav
            className="flex flex-wrap items-stretch gap-1 border-t border-line pt-3 sm:border-t-0 sm:pt-0 sm:pl-2"
            aria-label="Main"
          >
            <NavLink to="/" end className={navClassName}>
              Home
            </NavLink>
            <NavLink to="/saved" className={navClassName}>
              Saved trips
            </NavLink>
          </nav>
          <button
            type="button"
            onClick={logout}
            className="self-end rounded-lg px-2 py-1.5 text-[11px] font-medium text-ink-muted underline-offset-2 transition hover:bg-black/[0.04] hover:text-ink sm:self-auto"
          >
            Log out of demo
          </button>
        </div>
      </div>
    </header>
  )
}
