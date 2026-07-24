'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRef, useState } from 'react'

import { AccordionChevron } from '@/components/Accordion'
import { CarouselChevron } from '@/components/CarouselChevron'
import type { LightboxSlide } from '@/components/SiteLightbox'
import { sanityImageProps, urlForImage } from '@/sanity/lib/image'
import type { BenefitImageData } from '@/sanity/queries'

// Figma Section/SplitLayoutImageAccordion = 778:8956. Client Component — carousel + accordion state.
//
// THE MODEL (locked with Adinda 2026-07-23, via her spec + 3 answered questions): one image = one
// benefit. Image title = accordion heading, image caption = accordion body AND lightbox caption.
// The carousel and the accordion are ONE state: exactly one benefit is active at all times —
// opening a row scrolls the image to it; arrows/swipe advance the image AND open its row. The
// active row cannot be closed to nothing (her explicit call — the visible image always has its
// value open). Wrapping is infinite (modulo), first benefit active on load.
//
// Composition, all from locked patterns — read the originals for reasoning:
//   - Image half: DestinationOverview's highlight carousel verbatim (crossfade slides, pointer-drag
//     swipe with 50px threshold, aria-hidden on inactive slides with REAL alt kept, hover zoom
//     scale-105/1100ms) + the Cabins/Gallery zoom overlay (cursor-zoom-in → SiteLightbox via the
//     dynamic-import boundary). Click-vs-drag disambiguated by movement < 10px (the
//     DestinationItineraries tap test).
//   - Arrows OVERLAID on the image at vertical centre (the node), CarouselArrowButton standard.
//   - Accordion half: BoatSpecs' row anatomy (border-accent-subtle 0.75px every row, inactive
//     opacity-80, hover = the ACTIVE row's colour treatment only, 500ms cubic-bezier transitions,
//     grid-template-rows collapse, locked AccordionChevron) — with the ONE spec'd divergence: the
//     row title is an <h3> at text-editorial-h3 (her call), not body-large.
//
// Layout from the node, expression per conventions: image = the standard 708/532 box, FLUSH to the
// viewport's left edge on lg (the row carries no left gutter; the accordion column carries the
// right gutter). Section bg = the warm token (node: beige-100), py 120/160 desktop.
// Never import SiteLightbox statically — the dynamic-import boundary is what keeps YARL's JS+CSS
// out of the page's first load (see SiteLightbox's header).
const SiteLightbox = dynamic(() => import('@/components/SiteLightbox').then((m) => m.SiteLightbox), {
  ssr: false,
})

export function ChartersBenefits({
  eyebrow,
  heading,
  benefits,
}: {
  eyebrow?: string
  heading?: string
  benefits: BenefitImageData[]
}) {
  // "Hide what's empty": a benefit without a title has no accordion row to live in, so it is not
  // shown anywhere (schema requires title, so this only catches drafts/legacy data).
  const items = benefits.filter((b) => b.title && b.asset?._ref)

  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const dragState = useRef({ dragging: false, startX: 0, moved: 0 })

  const goTo = (next: number) => {
    const count = items.length
    if (!count) return
    setActiveIndex(((next % count) + count) % count)
  }

  if (!items.length) return null

  const slides: LightboxSlide[] = items.map((b) => ({
    src: urlForImage(b).width(1920).fit('max').quality(75).auto('format').url(),
    alt: b.alt,
    label: b.title,
    caption: b.caption || undefined,
  }))

  return (
    // bg-page = beige-50 #fdfcfa (Adinda, 2026-07-23 QA: "for this why us section try beige/50")
    // — overrides the node's beige-100 — PLUS the light texture (her round-3 ask), same recipe as
    // DestinationBoats. Mobile pb is one step up from pt (64→80, her "+1 unit before the next
    // section").
    <section
      id="benefits"
      aria-labelledby="charters-benefits-heading"
      className="relative isolate w-full overflow-hidden scroll-mt-[70px] bg-bg-page pb-80 pt-64 lg:scroll-mt-[110px] lg:pb-160 lg:pt-[120px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--texture-light)] [background-size:720px_auto] bg-repeat opacity-20"
      />
      {/* Heading→content gap: 48 mobile, 80 desktop (Adinda round 3: "+~24px, snap bigger" →
          48+24=72 → 80 on the scale). */}
      <div className="flex w-full flex-col gap-48 lg:gap-80">
        {/* Section heading — centered, eyebrow→heading gap-32 per the node's Block/SectionHeading. */}
        <div data-reveal className="flex flex-col items-center gap-32 px-24 text-center md:px-48 lg:px-80">
          {eyebrow ? <p className="text-eyebrow uppercase text-action-primary">{eyebrow}</p> : null}
          {heading ? (
            // max-w 640, NOT the SectionHeading block's 720 — an explicit EXCEPTION for this
            // heading (Adinda, 2026-07-23): tight on purpose so "with us" lands on the second
            // line. Don't normalize back to 720.
            <h2 id="charters-benefits-heading" className="max-w-[640px] text-display-h2 text-text-primary">
              {heading}
            </h2>
          ) : null}
        </div>

        {/* Column gap: desktop 80 → 96 (Adinda: "size up" — next scale step). Mobile 48 → [40px]
            (her round 3: "reduce by 8px" — 40 is off-scale, so arbitrary, never rounded). */}
        <div className="flex w-full flex-col gap-[40px] lg:flex-row lg:items-start lg:gap-96">
          {/* Image half — full-bleed to the LEFT edge on lg (the node; no gutter on this side).
              Mobile: full-bleed both sides, the mobile treatment already standard for image blocks. */}
          <div data-reveal className="w-full lg:w-1/2 lg:shrink-0">
            {/* 3:2, NOT the node's 708/532 (Adinda, 2026-07-23 QA) — same override BoatOverview's
                key-features image already made against its own near-5:4 node. */}
            <div
              className="group/benefit relative aspect-[3/2] w-full cursor-grab overflow-hidden select-none [touch-action:pan-y] active:cursor-grabbing"
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
                if (moved <= -THRESHOLD) goTo(activeIndex + 1)
                else if (moved >= THRESHOLD) goTo(activeIndex - 1)
              }}
            >
              {items.map((b, i) => (
                <div
                  key={b._key}
                  aria-hidden={i !== activeIndex || undefined}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    i === activeIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    {...sanityImageProps(b, '/assets/placeholder-photo.svg')}
                    alt={b.alt ?? ''}
                    fill
                    draggable={false}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/benefit:scale-105"
                  />
                </div>
              ))}

              {/* Zoom overlay — a real click (not a drag: movement stayed under the tap test's
                  10px) opens the lightbox at the active benefit. Sits under the arrows. */}
              <button
                type="button"
                aria-label={items[activeIndex]?.title ? `View larger: ${items[activeIndex].title}` : 'View larger image'}
                onClick={() => {
                  if (Math.abs(dragState.current.moved) < 10) setLightboxOpen(true)
                }}
                className="absolute inset-0 block size-full cursor-zoom-in"
              />

              {/* Bare-chevron on-image arrows — THE standard for single-image carousels is the
                  boat GALLERY pair (Adinda, 2026-07-23), NOT CarouselArrowButton (that's the
                  round category/step control): CarouselChevron 24×18.19 with a drop-shadow for
                  legibility over the photo (inline style — the filter's commas/parens mangle
                  Tailwind's class parser), size-44 hit target, edge-nudge on hover. Copied from
                  BoatGallery verbatim. */}
              {items.length > 1 ? (
                <div className="pointer-events-none absolute inset-x-16 top-1/2 flex -translate-y-1/2 items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goTo(activeIndex - 1)}
                    aria-label="Previous benefit"
                    style={{ filter: 'drop-shadow(0 1px 4px rgba(19, 29, 52, 0.55))' }}
                    className="group pointer-events-auto flex size-[44px] items-center justify-center text-text-ondark-primary"
                  >
                    <CarouselChevron direction="left" sizeClassName="h-[18.19px] w-[24px] transition-transform duration-300 ease-in-out group-hover:-translate-x-[2px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(activeIndex + 1)}
                    aria-label="Next benefit"
                    style={{ filter: 'drop-shadow(0 1px 4px rgba(19, 29, 52, 0.55))' }}
                    className="group pointer-events-auto flex size-[44px] items-center justify-center text-text-ondark-primary"
                  >
                    <CarouselChevron direction="right" sizeClassName="h-[18.19px] w-[24px] transition-transform duration-300 ease-in-out group-hover:translate-x-[2px]" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Accordion half — gutter ladder on mobile, right gutter only on lg (left flush is the
              image's job). Explicit px, not page-gutter-x: a responsive override on the custom
              utility compiles ambiguously (see SubNav's gutter note). */}
          {/* lg:pt-48 — the list starts 48px below the image's top edge (Adinda, round 3). */}
          <div data-reveal="left" className="flex min-w-0 flex-1 flex-col px-24 md:px-48 lg:pl-0 lg:pr-80 lg:pt-48">
            {items.map((b, i) => {
              const active = i === activeIndex
              // last:border-b-0 — no rule under the last row, BOTH breakpoints (Adinda widened
              // her round-3 mobile-only call to desktop too, same day).
              return (
                <div
                  key={b._key}
                  className={`group/row flex flex-col border-b-[0.75px] border-accent-subtle py-12 [transition:opacity_500ms_cubic-bezier(0.65,0,0.35,1)] last:border-b-0 ${
                    active ? '' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <h3>
                    {/* Tapping the OPEN row advances to the next benefit (wrapping) instead of
                        doing nothing (Adinda, round 3: an unclosable item "feels like a bug" —
                        exactly-one-open stands, so closing = revealing the next). Both breakpoints. */}
                    <button
                      type="button"
                      aria-expanded={active}
                      onClick={() => goTo(i === activeIndex ? activeIndex + 1 : i)}
                      className="flex w-full items-center justify-between gap-8 text-left"
                    >
                      {/* Title: editorial-h4 on mobile / h3 on desktop (Adinda, round 3: mobile
                          labels one level down). Active = accent colour per the node; hover takes
                          the active COLOUR only (site-wide accordion rule). */}
                      <span
                        className={`flex-1 text-editorial-h4 lg:text-editorial-h3 [transition:color_500ms_cubic-bezier(0.65,0,0.35,1)] ${
                          active ? 'text-action-primary' : 'text-text-primary group-hover/row:text-action-primary'
                        }`}
                      >
                        {b.title}
                      </span>
                      <AccordionChevron
                        open={active}
                        className={`[transition:transform_500ms_cubic-bezier(0.65,0,0.35,1),background-color_500ms_cubic-bezier(0.65,0,0.35,1)] ${
                          active ? 'bg-action-primary' : 'bg-accent-subtle group-hover/row:bg-action-primary'
                        }`}
                      />
                    </button>
                  </h3>
                  <div
                    className={`grid [transition:grid-template-rows_500ms_cubic-bezier(0.65,0,0.35,1)] ${
                      active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      {b.caption ? (
                        <p className={`mt-12 text-body-medium text-text-primary ${active ? 'pb-4' : ''}`}>{b.caption}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <SiteLightbox
        open={lightboxOpen}
        index={activeIndex}
        slides={slides}
        onClose={() => setLightboxOpen(false)}
        ariaLabel="Benefits"
      />
    </section>
  )
}
