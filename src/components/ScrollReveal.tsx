'use client'

import { useEffect } from 'react'

// Ported from ../v1-static-homepage/assets/reveal.js. Fades/slides every [data-reveal]
// element in as it enters the viewport by adding [data-revealed] (the visual is pure
// CSS — see globals.css). Mount once, near the root of the page. Graceful: if
// IntersectionObserver is unsupported or the user prefers reduced motion, reveals
// everything immediately (the CSS also keeps content visible under reduced motion).
//
// Manual fallback check (2026-07-15): real iOS Safari/Chrome (WebKit) was found to silently
// fail to fire intersection callbacks for below-the-fold [data-reveal] elements — content
// stayed permanently at opacity:0, confirmed via real-device screenshots. Neither Chromium
// mobile emulation nor desktop Playwright WebKit reproduced it, so the exact WebKit
// mechanism (suspected: dynamic toolbar resizing the viewport mid-scroll, interacting badly
// with rootMargin) isn't nailed down — but content must never depend on getting that exactly
// right. A throttled scroll/resize listener independently re-checks each unrevealed
// element's actual position and reveals it once it's genuinely near the viewport, same
// trigger condition as the observer, just computed manually as a backup — not a blind
// timer, so it doesn't force-reveal content the user hasn't scrolled anywhere near yet.
export function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!els.length) return

    const reveal = (el: Element) => el.setAttribute('data-revealed', '')
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(reveal)
      return
    }

    const pending = new Set(els)

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target)
            pending.delete(entry.target)
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach((el) => io.observe(el))

    // Backup pass: same "near viewport" condition as the observer's rootMargin, checked
    // manually in case the observer itself never fires on this engine/device.
    let raf = 0
    const checkPending = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const vh = window.innerHeight
        pending.forEach((el) => {
          const top = el.getBoundingClientRect().top
          if (top < vh * 0.92) {
            reveal(el)
            pending.delete(el)
            io.unobserve(el)
          }
        })
      })
    }

    window.addEventListener('scroll', checkPending, { passive: true })
    window.addEventListener('resize', checkPending)
    checkPending()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', checkPending)
      window.removeEventListener('resize', checkPending)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
