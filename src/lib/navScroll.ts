// Scroll thresholds at which the main nav flips to its light/floating skin (Nav.tsx) — SHARED
// with SubNav, whose mobile floating bar must appear at the same moment (Adinda, 2026-07-21).
// One constant, two consumers, no drift.
export const NAV_FLIP_SCROLL_Y = { mobile: 40, desktop: 80 }

// Tailwind's lg breakpoint (64rem) in px — the mobile/desktop behavior boundary for both navs.
export const DESKTOP_MIN_WIDTH = 1024

// ---- Nav ↔ SubNav coordination store (auto-hide, Adinda 2026-07-21) -------------------------
// The main nav auto-hides on scroll-down ONLY on pages with a floating SubNav (desktop only —
// mobile keeps the always-visible nav; the hamburger is the phone's wayfinding). That requires
// the two components to know two things about each other, and THIS store is the single place
// that coupling lives: SubNav publishes whether it exists/floats; Nav publishes whether it is
// hidden (so the SubNav can move to the viewport top in sync). Plain module state +
// useSyncExternalStore on the consumer side — no context provider, no re-render cascade.

type NavChromeState = {
  /** A SubNav is mounted on this page and currently in its floating state. While true (desktop),
   *  the main nav renders its COMPACT single row (Mari · menu items · Find a Trip) and the
   *  floating SubNav row sits beneath it — the two-row floating chrome (Adinda, 2026-07-21). */
  subNavFloating: boolean
}

let navChromeState: NavChromeState = { subNavFloating: false }
const navChromeListeners = new Set<() => void>()
const SERVER_SNAPSHOT: NavChromeState = { subNavFloating: false }

export const navChrome = {
  get: (): NavChromeState => navChromeState,
  getServer: (): NavChromeState => SERVER_SNAPSHOT,
  set(partial: Partial<NavChromeState>) {
    const next = { ...navChromeState, ...partial }
    if (next.subNavFloating === navChromeState.subNavFloating) return
    navChromeState = next
    navChromeListeners.forEach((l) => l())
  },
  subscribe(cb: () => void) {
    navChromeListeners.add(cb)
    return () => {
      navChromeListeners.delete(cb)
    }
  },
}
