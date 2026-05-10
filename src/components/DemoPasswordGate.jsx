import { createContext, useCallback, useContext, useState } from 'react'

import { clearDemoUnlock, isDemoUnlocked, setDemoUnlocked } from '../lib/demoGateStorage.js'

/**
 * Shared password for the casual friends demo (not a secret in production apps).
 * Anyone reading this source file can see it—that is OK for this use case.
 */
const DEMO_PASSWORD = 'dan'

const DemoGateContext = createContext(null)

export function useDemoGate() {
  const ctx = useContext(DemoGateContext)
  if (!ctx) {
    throw new Error('useDemoGate must be used inside DemoPasswordGate after unlock')
  }
  return ctx
}

function DemoLoginScreen({ onSuccess }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed === DEMO_PASSWORD) {
      setDemoUnlocked()
      setError('')
      onSuccess()
      return
    }
    setError('That password does not match. Hint: check the lowercase demo word you were sent.')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-12 text-ink">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-8">
        <h1 className="text-center text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          Friends demo
        </h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-ink-muted">
          This Jet Lag Planner build is shared privately. Enter the demo password once—your browser
          will remember it until you log out or clear site data.
        </p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="demo-password" className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Password
            </label>
            <input
              id="demo-password"
              type="password"
              autoComplete="current-password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setError('')
              }}
              className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink shadow-sm outline-none ring-ink/20 transition focus:border-ink/30 focus:ring-2"
              placeholder="Demo password"
            />
          </div>
          {error && (
            <p className="text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Unlock planner
          </button>
        </form>
        <p className="mt-6 text-center text-xs leading-relaxed text-ink-muted">
          Casual protection only—not encryption, not accounts, not real access control.
        </p>
      </div>
    </div>
  )
}

/**
 * Wraps the real app: shows a password screen until access is granted, then renders `children`.
 * After unlock, provides `logout()` via `useDemoGate()` for a small header button.
 */
export default function DemoPasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => isDemoUnlocked())

  const unlock = useCallback(() => {
    setUnlocked(true)
  }, [])

  const logout = useCallback(() => {
    clearDemoUnlock()
    setUnlocked(false)
  }, [])

  if (!unlocked) {
    return <DemoLoginScreen onSuccess={unlock} />
  }

  return <DemoGateContext.Provider value={{ logout }}>{children}</DemoGateContext.Provider>
}
