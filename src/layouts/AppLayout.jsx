import { Outlet } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'

/**
 * AppLayout — shared chrome (header, footer). Child routes render inside <Outlet />.
 * Extra horizontal padding on very small screens keeps text off the screen edge.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-cream font-sans text-ink antialiased">
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-1 sm:px-6 sm:pb-14 lg:px-8">
        <SiteHeader />
        <main className="min-h-[50vh] pt-1 sm:pt-2">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
