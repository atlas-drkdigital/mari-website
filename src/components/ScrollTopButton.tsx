'use client'

import { useEffect, useRef, useState } from 'react'

import { DESKTOP_MIN_WIDTH, NAV_FLIP_SCROLL_Y } from '@/lib/navScroll'

// Site-wide back-to-top button (Adinda, 2026-07-21), mounted once in the root layout.
//   - Bottom-right corner, every page, both breakpoints.
//   - Same design language as the homepage hero's scroll indicator — a circle holding the SAME
//     icon-chevron.svg asset — rotated to point up. Colours per Adinda: primary navy circle
//     (background-ondark-page), beige-50 arrow (text-ondark-primary), subtle shadow.
//   - Appears at the SAME scroll threshold that flips the main nav to its floating skin
//     (NAV_FLIP_SCROLL_Y — Adinda: one moment for all the scrolled-state chrome). Hidden at the
//     top of the page; fades/slides in and out.
//   - z-40: below the main nav + its menus (z-50), same layer as the floating SubNav.
//   - The click respects prefers-reduced-motion (window.scrollTo ignores the CSS scroll-behavior
//     rule's motion-safe gating, so it's checked explicitly here).
export function ScrollTopButton() {
  const [visible, setVisible] = useState(false)
  const lastVisible = useRef(false)

  useEffect(() => {
    const recompute = () => {
      const threshold =
        window.innerWidth < DESKTOP_MIN_WIDTH ? NAV_FLIP_SCROLL_Y.mobile : NAV_FLIP_SCROLL_Y.desktop
      const next = window.scrollY > threshold
      if (next !== lastVisible.current) {
        lastVisible.current = next
        setVisible(next)
      }
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

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      // "Glass" treatment (Adinda, 2026-07-21): solid navy vanished against the navy footer and
      // the shadow was imperceptible there. Navy at 75% + backdrop blur + a faint light border
      // reads on BOTH grounds — near-solid on light sections, defined by its edge + blur on dark
      // ones. Deliberately NOT an accent-primary circle: amber is the act-now colour and a
      // persistent floating disc would compete with real CTAs on every page.
      // 90% navy + a whisper of shadow (Adinda's tuning 2026-07-21 — 75% read washy and the
      // 4px/0.3 shadow drew a visible ring; keep the glass border + blur).
      className={`group fixed right-24 bottom-24 z-40 grid size-[44px] place-items-center rounded-full border border-text-ondark-primary/25 bg-background-ondark-page/90 text-text-ondark-primary shadow-[0px_2px_6px_rgba(44,37,34,0.12)] backdrop-blur-sm transition-[opacity,translate] duration-300 ease-in-out lg:right-32 lg:bottom-32 lg:size-[52px] ${
        visible ? 'opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
      }`}
    >
      <span
        aria-hidden="true"
        className="block size-[16px] rotate-180 bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover:-translate-y-[2px] [mask-image:url('/assets/icon-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
      />
    </button>
  )
}
