'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

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
// TWO POSITIONS, one instance (floating state added 2026-07-21, option A per Adinda's call):
//   - STATIC: pinned by the page to the hero's bottom edge (the `className` prop positions the
//     wrapper). Dark on-image styling.
//   - FLOATING: once the hero's bottom edge scrolls under the main nav, the SAME rail re-pins as a
//     slim fixed bar directly beneath the nav — light bg + hairline shadow, visually one unit with
//     the floated nav (which is always visible; we deliberately did NOT hide it — the booking CTA
//     stays reachable, and nothing site-wide changes). Items switch to the light TabRail tokens
//     (action-primary, matching the Cabins tabs + the nav's light-state accent). Scroll back up
//     and it re-docks. The swap is instant, not animated: it happens exactly when the static rail
//     slides under the nav, so the bar visually continues from where the rail left off.
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

  // Floating state: true once the static wrapper's bottom edge has scrolled above the nav's lower
  // edge. Both values come from the DOM in a passive scroll listener (same approach as Nav.tsx's
  // own `scrolled`); the initial compute runs in a rAF callback, not the effect body (lint:
  // set-state-in-effect).
  const [floating, setFloating] = useState(false)
  const [navHeight, setNavHeight] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const header = document.querySelector('header')
    const recompute = () => {
      const navH = header?.getBoundingClientRect().height ?? 0
      setNavHeight(navH)
      const wrapper = wrapperRef.current
      if (wrapper) setFloating(wrapper.getBoundingClientRect().bottom <= navH)
    }
    const raf = requestAnimationFrame(recompute)
    window.addEventListener('scroll', recompute, { passive: true })
    window.addEventListener('resize', recompute)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', recompute)
      window.removeEventListener('resize', recompute)
    }
  }, [])

  // Re-observe only when the set of targets actually changes (a string key, not the array
  // identity — `items` is rebuilt every render by the page).
  const targetsKey = [...new Set(items.map((i) => i.targetId))].join(' ')
  useEffect(() => {
    // The band is the viewport's top third (below the sticky nav): a section is "current" while
    // it overlaps that strip. One observer, one threshold crossing per section edge — with a
    // handful of sections the cost is negligible, and nothing runs per scroll frame.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveTarget(entry.target.id)
        }
      },
      { rootMargin: '-70px 0px -65% 0px' },
    )
    for (const id of targetsKey.split(' ')) {
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

  // Keep the active item in view on the mobile rail — start-aligned, minus the track's own left
  // padding so it lands at the gutter, like scrollIntoView inline:'start' would. Skip the mount
  // run (nothing to reveal on load; the first item already starts at the gutter).
  const trackRef = useDragScroll<HTMLElement>()
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const skipFirstRailScroll = useRef(true)
  useEffect(() => {
    if (skipFirstRailScroll.current) {
      skipFirstRailScroll.current = false
      return
    }
    const track = trackRef.current
    const el = activeIndex >= 0 ? itemRefs.current[activeIndex] : null
    if (!track || !el || track.scrollWidth <= track.clientWidth) return
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0
    track.scrollTo({ left: el.offsetLeft - pad, behavior: 'smooth' })
  }, [activeIndex, trackRef])

  if (!items.length) return null

  const trackBehavior =
    'flex w-full items-center cursor-grab overflow-x-auto select-none scrollbar-hidden active:cursor-grabbing lg:cursor-auto lg:overflow-visible lg:select-auto lg:page-gutter-x'

  return (
    // The wrapper holds the STATIC position (the page's className) at all times — while the nav
    // inside is off floating, the wrapper's rect still marks the rail's home, which is exactly
    // what the float/dock boundary is measured against.
    <div ref={wrapperRef} className={className}>
      <nav
        ref={trackRef}
        aria-label="Page sections"
        style={floating ? { top: navHeight } : undefined}
        className={
          floating
            ? `fixed inset-x-0 z-40 bg-bg-page shadow-[0_1px_0_0_rgb(0_0_0/0.06)] ${trackBehavior}`
            : trackBehavior
        }
      >
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
              className={`shrink-0 border-b-2 p-16 text-button-small uppercase transition-colors duration-300 ease-in-out ${
                floating
                  ? active
                    ? 'border-action-primary text-action-primary'
                    : 'border-action-primary/35 text-action-primary/55 hover:text-action-primary'
                  : active
                    ? 'border-text-ondark-primary text-text-ondark-primary'
                    : 'border-text-ondark-primary/40 text-text-ondark-primary/40 hover:border-text-ondark-primary/70 hover:text-text-ondark-primary/70'
              }`}
            >
              {item.label}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
