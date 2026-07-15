'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { DESTINATIONS } from '@/lib/destinations'
import { useDragScroll } from '@/lib/useDragScroll'

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
const SEASON_NIGHTS: Record<string, string> = {
  'raja-ampat': 'Year-Round · 7–12 Nights',
  komodo: 'May–September · Itinerary Details TBC',
  'banda-sea': 'September–November · 12 Nights',
  'triton-bay': 'Season TBC · 12 Nights (Combined)',
  sumbawa: 'Year-Round · Combined with Komodo',
  flores: 'Season TBC · Itinerary Details TBC',
  bali: 'Season TBC · Itinerary Details TBC',
  'north-sulawesi': 'Season TBC · Itinerary Details TBC',
  halmahera: 'Season TBC · Itinerary Details TBC',
}

const DESCRIPTIONS: Record<string, string> = {
  'raja-ampat': 'Raja Ampat sits at the apex of the Coral Triangle, with more documented reef fish and coral species than anywhere else on Earth. Expect year-round manta encounters, endemic species found nowhere else, and karst islands rising from turquoise lagoons above the surface.',
  komodo: 'Komodo National Park spans three major islands at the meeting point of the Indian Ocean and the Flores Sea, part of the Coral Triangle’s global epicentre of marine biodiversity. Thrilling drift dives and year-round manta encounters sit alongside a topside landscape of volcanic hills and the Komodo dragon, found nowhere else on Earth.',
  'banda-sea': 'One of the deepest seas in Southeast Asia, the Banda Sea’s extreme depth and seasonal upwellings create rare conditions for schooling hammerhead sharks. Exclusively reachable by liveaboard, it takes in the historic Spice Islands and remote atolls far from the usual routes.',
  'triton-bay': 'Triton Bay shares the Bird’s Head Seascape’s exceptional biodiversity with Raja Ampat, but in a nutrient-rich, plankton-dense bay with some of the most developed soft coral growth in Indonesia. It’s also one of the most reliable places in the country to dive with whale sharks, drawn in by traditional fishing platforms.',
  sumbawa: 'Positioned on the liveaboard corridor between Komodo and Bali, Sumbawa offers healthy reefs and dramatic volcanic scenery with far fewer visitors than its famous neighbours. Highlights include Moyo Island’s reef and wall diving and Teluk Saleh’s seasonal whale shark encounters, among the most reliable in Indonesia.',
  flores: 'Itinerary details for this destination are still being finalized — check back soon.',
  bali: 'Itinerary details for this destination are still being finalized — check back soon.',
  'north-sulawesi': 'Itinerary details for this destination are still being finalized — check back soon.',
  halmahera: 'Itinerary details for this destination are still being finalized — check back soon.',
}

export function Destinations() {
  const [index, setIndex] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({ dragging: false, startX: 0, moved: 0 })
  const tabTrackRef = useDragScroll<HTMLDivElement>()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const count = DESTINATIONS.length
  const goTo = (newIndex: number) => setIndex(((newIndex % count) + count) % count)

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

  return (
    <section id="destinations" aria-labelledby="destinations-heading" className="group/dest relative isolate flex min-h-[max(720px,calc(100dvh-70px))] w-full flex-col bg-background-ondark-page">
      <h2 id="destinations-heading" className="sr-only">Destinations</h2>

      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {DESTINATIONS.map((dest, i) => (
          <div key={dest.id} className={`absolute inset-0 overflow-hidden transition-opacity duration-0 lg:duration-700 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}>
            <Image src={dest.image} alt="" fill sizes="100vw" className="object-cover transition-transform duration-700 ease-in-out group-hover/dest:scale-105" />
            <div className="absolute inset-0 bg-background-ondark-page/40" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between gap-24 page-gutter-x pt-64 lg:pt-[100px]">
        <div
          ref={tabTrackRef}
          className="flex flex-1 cursor-grab items-center overflow-x-auto scroll-smooth select-none py-2 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] lg:max-w-[632px] [&::-webkit-scrollbar]:hidden"
        >
          {DESTINATIONS.map((dest, i) => (
            <button
              key={dest.id}
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
        {DESTINATIONS.map((dest, i) => (
          <article
            key={dest.id}
            {...(i !== index ? { inert: true } : {})}
            className={`absolute inset-0 flex flex-col justify-between page-gutter-x pb-64 pt-24 transition-opacity duration-700 ease-in-out lg:pb-[120px] lg:pt-24 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex w-full lg:w-[max(520px,42%)] flex-col gap-16">
              <div className="flex items-center gap-8 text-body-medium text-text-ondark-primary">
                <span>{SEASON_NIGHTS[dest.id]}</span>
              </div>
              <h3 className="text-display-h2 text-text-ondark-primary">
                <a href="#" className="transition-opacity duration-300 ease-in-out hover:opacity-80">{dest.name}</a>
              </h3>
              <p className="text-body-large text-text-ondark-primary">{dest.tagline}</p>
            </div>
            <div className="flex w-full lg:w-[max(520px,42%)] flex-col gap-24 lg:gap-28">
              <p className="text-body-medium lg:text-body-large text-text-ondark-primary">{DESCRIPTIONS[dest.id]}</p>
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
