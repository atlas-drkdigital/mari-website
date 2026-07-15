'use client'

import { useEffect, useState } from 'react'

// Keeps something mounted/rendered for `duration` ms after `isOpen` goes false, so a CSS exit
// transition (opacity, transform) has time to actually play before the element leaves the DOM /
// gets `display:none`'d — `display` itself can't be transitioned, so without this an overlay's
// close is always an instant cut regardless of what transition classes are on it.
//
// Drive the VISUAL open/closed state (opacity-0 vs opacity-100, pointer-events-none vs auto)
// directly off the real `isOpen` value, not this hook's return — this hook only answers "should
// this still be in the DOM at all" (the mount/hidden condition), lagging true→false by `duration`.
//
// The true→false transition needs no delay (mount immediately), so it's handled as a render-phase
// state adjustment (React's documented pattern for "state that needs to change when a prop
// changes," not an effect) rather than a setState call inside useEffect — only the delayed
// false-transition actually needs the effect/timer.
export function useDelayedUnmount(isOpen: boolean, duration = 500): boolean {
  const [rendered, setRendered] = useState(isOpen)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) setRendered(true)
  }

  useEffect(() => {
    if (isOpen) return
    const timer = setTimeout(() => setRendered(false), duration)
    return () => clearTimeout(timer)
  }, [isOpen, duration])

  return rendered
}
