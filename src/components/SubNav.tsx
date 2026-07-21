'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

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
//
// This is the NON-FLOATING state: the page pins it to the hero's bottom edge. The floating
// (scrolled/compact) state is a later pass. Desktop-only for now — mobile arrives with it.
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

  // Re-observe only when the set of targets actually changes (a string key, not the array
  // identity — `items` is rebuilt every render by the page).
  const targetsKey = [...new Set(items.map((i) => i.targetId))].join(' ')
  useEffect(() => {
    // The band is the viewport's top third (below the 70px sticky nav): a section is "current"
    // while it overlaps that strip. One observer, one threshold crossing per section edge — with
    // a handful of sections the cost is negligible, and nothing runs per scroll frame.
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

  if (!items.length) return null

  // Active item: the one matching the spied section; among siblings sharing that section, prefer
  // the one whose href matches the current hash. Before any section has crossed the band (page
  // top), the first item reads as active — matching the mockup's default state.
  const candidates = activeTarget ? items.filter((i) => i.targetId === activeTarget) : []
  const activeHref = candidates.length
    ? (candidates.find((i) => i.href === (currentHash || null)) ?? candidates[0]).href
    : items[0].href

  return (
    <nav aria-label="Page sections" className={className}>
      {items.map((item) => {
        const active = item.href === activeHref
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={active ? 'true' : undefined}
            className={`shrink-0 border-b-2 p-16 text-button-small uppercase transition-colors duration-300 ease-in-out ${
              active
                ? 'border-text-ondark-primary text-text-ondark-primary'
                : 'border-text-ondark-primary/40 text-text-ondark-primary/40 hover:border-text-ondark-primary/70 hover:text-text-ondark-primary/70'
            }`}
          >
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
