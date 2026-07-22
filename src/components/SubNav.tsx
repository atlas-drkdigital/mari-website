'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { DESKTOP_MIN_WIDTH, NAV_FLIP_SCROLL_Y, navChrome } from '@/lib/navScroll'
import { useDragScroll } from '@/lib/useDragScroll'

// SubNav — in-page section navigation. Figma Block/SubNav = 734:7644 (boat page instance 778:8711).
// Built 2026-07-21 for the boat page; SHARED BY DESIGN — the destination page mounts the same
// component with its own items. Per Adinda: across projects the STYLING may change but this
// behavior contract is the component:
//   - real server-rendered <a href="#…"> anchor links (crawlable; Google can surface them as
//     jump-links) — never buttons
//   - scroll-spy via IntersectionObserver (passive, off-main-thread; zero scroll-handler jank)
//     marks the section currently in the top-third band of the viewport
//   - smooth scrolling comes from `motion-safe:scroll-smooth` on <html> (layout.tsx), NOT from JS
//     here — native anchor navigation stays intact (URL hash updates, hashchange fires, deep links
//     work, reduced-motion users get instant jumps)
//   - two items may target the SAME section (boat: Layout + Specs → #layout-and-specs, each with
//     its own hash so the section can pre-select a tab; see BoatSpecs' hashchange listener). The
//     spy disambiguates via the last-clicked/current hash, defaulting to the first matching item.
//   - an item whose section doesn't render is not passed in (the "hide what's empty" rule — the
//     PAGE decides, this component renders what it's given)
//   - TabRail mobile behavior: drag-scrollable, scrollbar hidden, active item start-aligns itself
//     (browser-clamped near the end). The rail scrolls itself HORIZONTALLY ONLY (scrollTo on the
//     track, never scrollIntoView — the static rail lives on the hero, and scrollIntoView would
//     drag the PAGE back up to it whenever the spy fires mid-page).
//
// TWO POSITIONS, one instance (floating state added 2026-07-21, option A per Adinda's call);
// the static/floating split differs PER BREAKPOINT (Adinda, 2026-07-21):
//   - DESKTOP static: pinned by the page to the hero's bottom edge (the `className` prop positions
//     the wrapper). Dark on-image styling.
//   - DESKTOP floating (final form 2026-07-21, Adinda — TWO-ROW floating chrome): once the
//     hero's bottom edge scrolls under the main nav, the main nav renders its COMPACT single row
//     (Mari · menu items · Find a Trip — Nav.tsx's navCompact) and THIS bar sits directly beneath
//     it as row two: section items centred in nav-menu typography, no underlines, active/hover =
//     colour only, light bg + hairline shadow. `top` tracks the measured header height, so the
//     bar hugs whichever nav form is showing. No scroll-direction logic anywhere — the full
//     two-row nav returns only near the top of the page. Items are nowrap in a scrollable
//     hidden-scrollbar track, so many items overflow sideways rather than wrap.
//   - MOBILE: NO static rail on the hero at all (removed on Adinda's call — it read clunky there;
//     the pre-removal state is the `806c9c3` backup commit). The floating bar is the only mobile
//     form, and it appears at the SAME scroll threshold that flips the main nav to its light skin
//     (NAV_FLIP_SCROLL_Y, shared constant — one moment, both bars).
//   - The nav's height is MEASURED from the <header> (56-ish mobile / ~110 desktop) — never
//     hardcoded, it differs per breakpoint and would drift.
//   - z-40: below the main nav's z-50, so the mega menus and mobile menu overlay this bar.
//
// Item styling = the TabRail chip family sized up (Figma: p-16 vs the chips' p-8, same
// button-small uppercase, border-b-2). Inactive opacity is the TabRail's 40%, overriding Figma's
// 55% border / 60% text (Adinda, 2026-07-21) — one family, one opacity. Every item carries the
// underline, so the inactive borders merge into the continuous hairline the mockup shows.

export type SubNavItem = {
  /** Anchor href, e.g. "#cabins". May differ from targetId when several items share a section. */
  href: string
  /** id of the section element the scroll-spy watches for this item. */
  targetId: string
  label: string
}

// The URL hash as an external store — the React-idiomatic way to read browser state that changes
// outside React (native anchor clicks fire hashchange; no setState-in-effect needed). The server
// snapshot is '' so SSR/hydration render the default state deterministically.
function subscribeHash(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
const getHash = () => window.location.hash
const getServerHash = () => ''

export function SubNav({ items, className = '' }: { items: SubNavItem[]; className?: string }) {
  // Which section the spy currently sees; the current hash breaks ties between items sharing a
  // targetId (Layout/Specs).
  const [activeTarget, setActiveTarget] = useState<string | null>(null)
  const currentHash = useSyncExternalStore(subscribeHash, getHash, getServerHash)

  // Floating state, per breakpoint: desktop floats once the static wrapper's bottom edge scrolls
  // above the nav's lower edge; mobile floats at the main nav's own flip threshold (there is no
  // static rail to hand off from). Values come from the DOM in a passive scroll listener (same
  // approach as Nav.tsx's own `scrolled`); the initial compute runs in a rAF callback, not the
  // effect body (lint: set-state-in-effect).
  const [floating, setFloating] = useState(false)
  const [navHeight, setNavHeight] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  // ⚠️ The desktop float BOUNDARY uses the FULL nav's height, frozen while floating — never the
  // live height. Floating itself shrinks the header (full two rows → compact row), so a live
  // boundary oscillates in the band between the two heights: float → header shrinks → "not past
  // the boundary" → unfloat → header grows → float again, every scroll event. Shipped and caught
  // by Adinda 2026-07-21 ("subnav does not float anymore"). Positioning (navHeight state) still
  // tracks the live height — only the boundary is frozen.
  const floatBoundaryRef = useRef(0)
  const floatingRef = useRef(false)
  useEffect(() => {
    // Announce this page HAS a SubNav (desktop: suppresses the nav's intermediate light flip so
    // the chrome changes costume once, not twice). Store write, not React state — allowed in the
    // effect body.
    navChrome.set({ subNavPresent: true })
    const header = document.querySelector('header')
    const recompute = () => {
      const navH = header?.getBoundingClientRect().height ?? 0
      setNavHeight(navH)
      let isFloating: boolean
      if (window.innerWidth < DESKTOP_MIN_WIDTH) {
        isFloating = window.scrollY > NAV_FLIP_SCROLL_Y.mobile
      } else {
        const boundary = floatingRef.current ? floatBoundaryRef.current : navH
        const wrapper = wrapperRef.current
        isFloating = wrapper ? wrapper.getBoundingClientRect().bottom <= boundary : false
        // While NOT floating the header is in its full form — that's the height the boundary
        // must hold on to for the whole floating stretch.
        if (!isFloating) floatBoundaryRef.current = navH
      }
      floatingRef.current = isFloating
      setFloating(isFloating)
      // Published so the main nav knows it may auto-hide on this page (navChrome store).
      navChrome.set({ subNavFloating: isFloating })
    }
    const raf = requestAnimationFrame(recompute)
    window.addEventListener('scroll', recompute, { passive: true })
    window.addEventListener('resize', recompute)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', recompute)
      window.removeEventListener('resize', recompute)
      // Leaving the page (unmount) must release the nav — otherwise the NEXT page inherits a
      // stale subnav flag from this one.
      navChrome.set({ subNavPresent: false, subNavFloating: false })
    }
  }, [])


  // Re-observe only when the set of targets actually changes (a string key, not the array
  // identity — `items` is rebuilt every render by the page).
  const targetsKey = [...new Set(items.map((i) => i.targetId))].join(' ')
  useEffect(() => {
    // Scroll-spy. The observer's band (nav bottom → 35% viewport) decides WHEN to look; WHICH
    // section is active is recomputed from actual positions on every callback: the last section
    // in document order whose top has passed the 35% line. Never derived from entry order —
    // that was a real bug (Adinda, 2026-07-21): a fast anchor jump backward flies PAST a section,
    // and its "entered" event could land in the same observer batch as the destination's, with
    // the fly-past section winning by registration order. Nothing corrected it until the next
    // manual scroll. Positional recompute is order-independent and self-corrects every tick.
    const line = () => window.innerHeight * 0.35
    const targets = targetsKey.split(' ')
    const observer = new IntersectionObserver(
      () => {
        // "Last section whose top has passed the line" must be measured by POSITION, not by items
        // order — the destination page's subnav lists FAQ before Upcoming Trips (mock order) while
        // the sections sit Trips-then-FAQ in the document, and the old order-dependent loop kept
        // Trips active forever once passed (Adinda, 2026-07-22). Picking the max top <= line is
        // order-independent for any items/DOM arrangement.
        let current: string | null = null
        let best = -Infinity
        for (const id of targets) {
          const el = document.getElementById(id)
          if (!el) continue
          const top = el.getBoundingClientRect().top
          if (top <= line() && top > best) {
            best = top
            current = id
          }
        }
        setActiveTarget(current)
      },
      { rootMargin: '-70px 0px -65% 0px' },
    )
    for (const id of targets) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [targetsKey])

  // Active item: the one matching the spied section; among siblings sharing that section, prefer
  // the one whose href matches the current hash. Before any section has crossed the band (page
  // top), the first item reads as active — matching the mockup's default state.
  const candidates = activeTarget ? items.filter((i) => i.targetId === activeTarget) : []
  const activeHref = candidates.length
    ? (candidates.find((i) => i.href === (currentHash || null)) ?? candidates[0]).href
    : items[0]?.href
  const activeIndex = items.findIndex((i) => i.href === activeHref)

  // Keep the active item VISIBLE on the mobile rail — reveal, don't re-align (Adinda, 2026-07-21:
  // a fully visible item must NOT move; the first pass start-aligned every tap, which read as the
  // rail reordering itself). Only a partially-hidden/off-track active item scrolls, start-aligned
  // (minus the track's own left padding, so it lands at the content edge; the browser clamps near
  // the end, so a last item simply becomes fully visible). Fire ONLY on a real activeIndex change,
  // never on mount. NOTE: this is a HORIZONTAL scrollTo on the rail track (not scrollIntoView — see
  // the header), so a mount-fire only nudges the rail sideways, never the page; still, guard by the
  // PREVIOUS index rather than a `useRef(true)` skip-first flag, which React Strict Mode's double
  // effect-invoke on mount defeats (same hardening as Destinations/Gallery/FAQ).
  const trackRef = useDragScroll<HTMLDivElement>()
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const prevActiveRef = useRef(activeIndex)
  useEffect(() => {
    if (prevActiveRef.current === activeIndex) return
    prevActiveRef.current = activeIndex
    const track = trackRef.current
    const el = activeIndex >= 0 ? itemRefs.current[activeIndex] : null
    if (!track || !el || track.scrollWidth <= track.clientWidth) return
    const trackRect = track.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    const fullyVisible = rect.left >= trackRect.left - 1 && rect.right <= trackRect.right + 1
    if (fullyVisible) return
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0
    track.scrollTo({ left: el.offsetLeft - pad, behavior: 'smooth' })
  }, [activeIndex, trackRef])

  if (!items.length) return null

  // Gutter is written in PLAIN core utilities, not `lg:page-gutter-x` — a responsive variant on
  // the custom @utility compiled ambiguously (nested media inside media) and shipped desktop with
  // a 24px gutter instead of 80 (caught by Adinda, 2026-07-21). 0 / md:48 / lg:80 = page-gutter-x's
  // own ladder with a flush base, which is what the mobile rail wants anyway.
  //
  // The scroll TRACK is the same inner <div> in both states (trackRef must stay on one stable
  // node — useDragScroll binds its listeners once at mount). In the static state the track IS the
  // whole rail; in the floating state it is the centre lane between the brand and the CTA.
  const trackStatic =
    'flex w-full items-center cursor-grab overflow-x-auto select-none scrollbar-hidden active:cursor-grabbing md:px-48 lg:cursor-auto lg:overflow-visible lg:select-auto lg:px-80'
  // lg keeps overflow-x-auto deliberately: items are nowrap, so a long item list scrolls instead
  // of wrapping (Adinda's requirement). ⚠️ Same caveat as the Cabins tabs: justify-center + an
  // overflowing track makes the start edge unreachable in some browsers — fine at today's item
  // counts; revisit if a page ever exceeds ~8 items.
  const trackFloating =
    'flex min-w-0 flex-1 items-center cursor-grab overflow-x-auto select-none scrollbar-hidden active:cursor-grabbing lg:cursor-auto lg:select-auto lg:justify-center lg:gap-32'

  return (
    // The wrapper holds the STATIC position (the page's className) at all times — while the nav
    // inside is off floating, the wrapper's rect still marks the rail's home on desktop, which is
    // what the float/dock boundary is measured against.
    <div ref={wrapperRef} className={className}>
      <nav
        aria-label="Page sections"
        // `top` = the MEASURED header height (the compact row on desktop while floating, the
        // mobile bar on phones), transitioned so nav-form changes glide rather than jump.
        style={floating ? { top: navHeight } : undefined}
        className={
          floating
            ? /* lg:h-48 mirrors the compact nav row's fixed height exactly (equal rows, Adinda).
                 DESKTOP bg = navy glass (90% + blur, same family as the scroll-top button) — the
                 section row takes centre stage while the compact nav above stays quiet light
                 (Adinda's flip, 2026-07-21 second pass). Mobile keeps the light chip bar.
                 Entrance = the subnav-reveal FADE, gated motion-safe; deliberately NO transition
                 on `top` — that animated the bar up from its hero position and read as sliding in
                 from the bottom of the screen (Adinda: "does not make sense"). */
              `fixed inset-x-0 z-40 flex items-center bg-bg-page shadow-[0_1px_0_0_rgb(0_0_0/0.06)] motion-safe:animate-[subnav-reveal_300ms_ease-out] md:px-48 lg:h-48 lg:bg-background-ondark-page/90 lg:px-80 lg:backdrop-blur-sm`
            : /* static rail exists on DESKTOP ONLY — mobile's only form is the floating bar */
              'hidden lg:block'
        }
      >
        <div ref={trackRef} className={floating ? trackFloating : trackStatic}>
          {items.map((item, i) => {
            const active = item.href === activeHref
            return (
              <a
                key={item.href}
                href={item.href}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                aria-current={active ? 'true' : undefined}
                className={`shrink-0 whitespace-nowrap uppercase transition-colors duration-300 ease-in-out ${
                  floating
                    ? /* mobile: light TabRail chip (underline); lg: nav-menu link on the NAVY bar
                         (no border, text-nav, pb-4) — on-dark family there: amber active/hover,
                         light text inactive, mirroring the dark nav's own conventions. */
                      `border-b-2 p-16 text-button-small lg:border-b-0 lg:p-0 lg:pb-4 lg:text-nav ${
                        active
                          ? 'border-action-primary text-action-primary lg:text-accent-ondark-primary'
                          : 'border-action-primary/35 text-action-primary/55 hover:text-action-primary lg:text-text-ondark-primary lg:opacity-85 lg:hover:text-accent-ondark-primary lg:hover:opacity-100'
                      }`
                    : `border-b-2 p-16 text-button-small ${
                        active
                          ? 'border-text-ondark-primary text-text-ondark-primary'
                          : 'border-text-ondark-primary/40 text-text-ondark-primary/40 hover:border-text-ondark-primary/70 hover:text-text-ondark-primary/70'
                      }`
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </div>

      </nav>
    </div>
  )
}
