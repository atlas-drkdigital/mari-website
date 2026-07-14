'use client'

import { useEffect } from 'react'

// Ported from ../v1-static-homepage/assets/reveal.js. Fades/slides every [data-reveal]
// element in as it enters the viewport by adding [data-revealed] (the visual is pure
// CSS — see globals.css). Mount once, near the root of the page. Graceful: if
// IntersectionObserver is unsupported or the user prefers reduced motion, reveals
// everything immediately (the CSS also keeps content visible under reduced motion).
export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!els.length) return

    const reveal = (el: Element) => el.setAttribute('data-revealed', '')
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(reveal)
      return
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target)
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
