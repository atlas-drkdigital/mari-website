'use client'

import { useState, useSyncExternalStore } from 'react'

// Hero background video — a client island layered OVER the hero's poster image (which stays mounted
// underneath as the LCP element + fallback). Behaviour is FIXED, not toggled (locked 2026-07-16,
// MANAGER.md; schema is objects/heroVideo.ts): muted + looped + playsInline autoplay, pointing at a
// CDN-hosted MP4 (never a Sanity upload — the 10GB/mo bandwidth cap).
//
// It mounts only when the guards below pass, and the decision is read through useSyncExternalStore
// (NOT an effect-and-setState, which triggers the cascading-render lint rule). The server snapshot
// is always false, so SSR/first paint shows the image: no layout shift, and the image keeps the LCP
// (a hero video is never the LCP element). The store re-reads live, so rotating a phone or toggling
// OS reduced-motion flips it without a reload. Guards: no URL, prefers-reduced-motion (an
// autoplaying loop is exactly what that setting is for), or mobile without playOnMobile (mobile
// shows the poster to save data). If the video stalls or errors, the image underneath still shows —
// it is never unmounted. Rendered INSIDE the hero's `-z-10` background wrapper, between the <Image>
// and the scrim, so it sits over the poster and under the gradient.
const MOBILE_QUERY = '(max-width: 1023.98px)'
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void) {
  const queries = [window.matchMedia(MOBILE_QUERY), window.matchMedia(REDUCE_QUERY)]
  queries.forEach((q) => q.addEventListener('change', callback))
  return () => queries.forEach((q) => q.removeEventListener('change', callback))
}

export function HeroVideo({
  url,
  playOnMobile = false,
  className,
}: {
  url?: string | null
  playOnMobile?: boolean
  /** Extra classes — e.g. an object-position to match the poster's crop. */
  className?: string
}) {
  const allowed = useSyncExternalStore(
    subscribe,
    () =>
      !window.matchMedia(REDUCE_QUERY).matches &&
      (playOnMobile || !window.matchMedia(MOBILE_QUERY).matches),
    () => false, // server + first paint: never render the video, show the poster image
  )

  const [ready, setReady] = useState(false)

  if (!url || !allowed) return null

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
      className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-in-out ${
        ready ? 'opacity-100' : 'opacity-0'
      }${className ? ` ${className}` : ''}`}
    >
      <source src={url} />
    </video>
  )
}
