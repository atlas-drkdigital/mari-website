'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { useDragScroll } from '@/lib/useDragScroll'
import { sanityImageProps } from '@/sanity/lib/image'
import type { DestinationCardData } from '@/sanity/queries'

// Ported from ../v1-static-homepage/sections/destinations.html + assets/destinations.js.
// Figma Home/Section/Destinations 401:2510. Full-bleed crossfade slideshow, one slide per
// destination — "infinite" next/prev is just the index wrapping with modulo, no scroll-clone
// trickery needed. Overlay: flat navy-900/40% wash (confirmed against Figma's layer panel,
// not the raw code export — see the original file's comment for why).
// SIMPLIFIED vs. the static build: the original's pointer-drag also live-previewed the
// incoming photo sliding in from off-screen during the drag itself (a two-photo slide, not
// just a swap on release). Ported here as swipe-to-switch on threshold release (same
// crossfade as tabs/arrows) without that live drag-preview — a real visual polish item to
// revisit, not a functional gap.
// Content now comes from real `destination` docs (2026-07-16 full-wire slice) — season·nights,
// tagline and the card summary are Sanity fields, not the old hardcoded maps. The card links
// still point at "#" until the destination page slice ships (nav/footer links un-hardcode per
// slice); the card image falls back to the matching local asset only if a doc has no coverImage.
export function Destinations({ destinations }: { destinations: DestinationCardData[] }) {
  const [index, setIndex] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({ dragging: false, startX: 0, moved: 0 })
  const tabTrackRef = useDragScroll<HTMLDivElement>()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const count = destinations.length
  const goTo = (newIndex: number) => (count ? setIndex(((newIndex % count) + count) % count) : undefined)

  // Keep the active tab in view — aligns it to the start of the visible track; for tabs near
  // the end (not enough remaining items to fill the width), the browser naturally clamps this
  // to the max scroll position instead, showing as much trailing content as exists.
  // Must skip the very first run: this effect fires on mount too (not just on real index
  // changes), and `block: 'nearest'` scrolls the whole PAGE vertically if the tab isn't yet
  // in the viewport — which it never is on load, since the user starts at the top of the
  // page. Without this guard, every page load force-scrolls straight to the Destinations
  // section regardless of where the user actually is.
  const skipFirstScrollIntoView = useRef(true)
  useEffect(() => {
    if (skipFirstScrollIntoView.current) {
      skipFirstScrollIntoView.current = false
      return
    }
    tabRefs.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }, [index])

  // Nothing to show if no destinations are published — hide the section rather than render an
  // empty stage (graceful degradation; seeded content means this won't happen in practice).
  if (count === 0) return null

  return (
    <section id="destinations" aria-labelledby="destinations-heading" className="group/dest relative isolate flex min-h-[max(720px,calc(100dvh-70px))] w-full flex-col bg-background-ondark-page">
      <h2 id="destinations-heading" className="sr-only">Destinations</h2>

      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {destinations.map((dest, i) => (
          <div key={dest._id} className={`absolute inset-0 overflow-hidden transition-opacity duration-0 lg:duration-700 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}>
            <Image {...sanityImageProps(dest.coverImage, `/assets/destination-${dest.slug}.webp`)} alt="" fill sizes="100vw" className="object-cover transition-transform duration-700 ease-in-out group-hover/dest:scale-105" />
            <div className="absolute inset-0 bg-background-ondark-page/40" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between gap-24 page-gutter-x pt-64 lg:pt-[100px]">
        <div
          ref={tabTrackRef}
          className="flex flex-1 cursor-grab items-center overflow-x-auto scroll-smooth select-none py-2 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] lg:max-w-[632px] [&::-webkit-scrollbar]:hidden"
        >
          {destinations.map((dest, i) => (
            <button
              key={dest._id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              onClick={() => goTo(i)}
              className={`shrink-0 border-b-2 p-8 text-button-small uppercase transition-colors duration-300 ease-in-out ${
                i === index ? 'border-text-ondark-primary text-text-ondark-primary' : 'border-text-ondark-primary/40 text-text-ondark-primary/40 hover:border-text-ondark-primary/70 hover:text-text-ondark-primary/70'
              }`}
            >
              {dest.name}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 gap-[9px]">
          <button type="button" onClick={() => goTo(index - 1)} aria-label="Previous destination" className="group grid size-[36px] shrink-0 place-items-center rounded-full border border-bg-surface text-text-ondark-primary transition-colors duration-300 ease-in-out hover:bg-text-ondark-primary/10 lg:size-[52px]">
            <span aria-hidden="true" className="block size-[16px] rotate-180 bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover:scale-105 [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
          </button>
          <button type="button" onClick={() => goTo(index + 1)} aria-label="Next destination" className="group grid size-[36px] shrink-0 place-items-center rounded-full border border-bg-surface text-text-ondark-primary transition-colors duration-300 ease-in-out hover:bg-text-ondark-primary/10 lg:size-[52px]">
            <span aria-hidden="true" className="block size-[16px] bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover:scale-105 [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        className="relative z-10 flex flex-1 flex-col [touch-action:pan-y]"
        onPointerDown={(e) => {
          dragState.current = { dragging: true, startX: e.clientX, moved: 0 }
        }}
        onPointerMove={(e) => {
          if (!dragState.current.dragging) return
          dragState.current.moved = e.clientX - dragState.current.startX
        }}
        onPointerUp={() => {
          if (!dragState.current.dragging) return
          dragState.current.dragging = false
          const THRESHOLD = 50
          const { moved } = dragState.current
          if (moved <= -THRESHOLD) goTo(index + 1)
          else if (moved >= THRESHOLD) goTo(index - 1)
        }}
      >
        {destinations.map((dest, i) => (
          <article
            key={dest._id}
            {...(i !== index ? { inert: true } : {})}
            className={`absolute inset-0 flex flex-col justify-between page-gutter-x pb-64 pt-24 transition-opacity duration-700 ease-in-out lg:pb-[120px] lg:pt-24 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex w-full lg:w-[max(520px,42%)] flex-col gap-16">
              <div className="flex items-center gap-8 text-body-medium text-text-ondark-primary">
                <span>{dest.seasonNights}</span>
              </div>
              <h3 className="text-display-h2 text-text-ondark-primary">
                <a href="#" className="transition-opacity duration-300 ease-in-out hover:opacity-80">{dest.name}</a>
              </h3>
              <p className="text-body-large text-text-ondark-primary">{dest.tagline}</p>
            </div>
            <div className="flex w-full lg:w-[max(520px,42%)] flex-col gap-24 lg:gap-28">
              <p className="text-body-medium lg:text-body-large text-text-ondark-primary">{dest.excerpt}</p>
              <a href="#" className="group inline-flex w-fit items-center gap-4 border-b border-text-ondark-primary py-4 text-button-small uppercase text-text-ondark-primary">
                Explore {dest.name}
                <span aria-hidden="true" className="block size-[16px] shrink-0 bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
