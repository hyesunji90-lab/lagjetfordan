/**
 * demoGateStorage.js — remembers that someone typed the **friends demo** password.
 *
 * This is **not** security: anyone can read or edit localStorage in DevTools.
 * It only stops casual visitors from seeing the planner until they know the shared password.
 */

const STORAGE_KEY = 'jetLagPlanner.friendsDemoUnlocked'

export function isDemoUnlocked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    // Private browsing / storage blocked — treat as locked.
    return false
  }
}

export function setDemoUnlocked() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // If storage fails, the parent UI still unlocks for this session only.
  }
}

export function clearDemoUnlock() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
