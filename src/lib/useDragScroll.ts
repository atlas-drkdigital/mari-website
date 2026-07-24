'use client'

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

// Pointer drag-to-scroll ("grab and slide") for a horizontally scrollable track — ported
// verbatim from the same pattern repeated in why-us.js / latest-articles.js / testimonials.js.
// Native touch scroll already works on its own, so touch pointers are left alone; this only
// handles mouse/pen drags. Suspends CSS scroll-snap for the duration of the drag so it
// doesn't fight the manual scrollLeft writes, then lets the browser settle to the nearest
// snap point on release.
export function useDragScroll<T extends HTMLElement>(): RefObject<T | null> {
  const trackRef = useRef<T | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let dragging = false
    let startX = 0
    let startScroll = 0
    let rafId: number | null = null

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      dragging = true
      startX = e.clientX
      startScroll = track.scrollLeft
      track.style.scrollSnapType = 'none'
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - startX
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        track.scrollLeft = startScroll - dx
        rafId = null
      })
    }
    const endDrag = () => {
      if (!dragging) return
      dragging = false
      track.style.scrollSnapType = ''
    }
    const onDragStart = (e: DragEvent) => e.preventDefault()

    track.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    track.addEventListener('dragstart', onDragStart)

    return () => {
      track.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
      track.removeEventListener('dragstart', onDragStart)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return trackRef
}
