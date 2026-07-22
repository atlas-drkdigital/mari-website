'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { CarouselArrowButton } from '@/components/CarouselArrowButton'
import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { DestinationData } from '@/sanity/queries'

// Figma Design/Section/Destination Overview = 778:8647. Client Component: the Read More collapse
// and the highlights carousel both need state.
//
// Two halves, both derivative — read the originals for the reasoning, it is not repeated here:
//   - LEFT (eyebrow/heading/body/Read More): BoatOverview.tsx's locked site-wide read-more
//     pattern, copied verbatim — measured max-height collapse, fade mask, collapse-scrolls-to-
//     section-top, button only when actually clipped.
//   - RIGHT: the highlights carousel — image + "HIGHLIGHT/NN" caption + title + descriptor, cycled
//     by the paired arrows (shared CarouselArrowButton, THE standard tailed-arrow control — a
//     chevron shipped here first and Adinda caught it, 2026-07-22) AND by swipe on the image
//     (the homepage Destinations' pointer-drag pattern; arrows and drag both work, per the
//     site-wide carousel convention). Arrows align to the highlight TITLE line, not the eyebrow.
//
// From the node (no established name existed): right column w-[458px], image aspect-[458/366.4],
// image→caption gap-32, caption block gap-8/16, arrows pt-32. Everything with an established name
// follows the codebase, not the node (gutters, section rhythm, type ramp, 1440 cap per
// BoatOverview's 2026-07-20 widening).
//
// "/NN" in the caption is beige-400 (#c9b89a) in Figma — that primitive has NO semantic token and
// accent-muted is a different colour (chocolate-500), so it stays an arbitrary value by the
// only-when-no-name-exists rule.
export function DestinationOverview({
  destination,
  eyebrow,
}: {
  destination: DestinationData
  eyebrow?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const highlights = destination.highlights ?? []
  const hasBody = Boolean(destination.overviewBody?.length)

  const bodyRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [canExpand, setCanExpand] = useState(false)
  const [fullHeight, setFullHeight] = useState(0)

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const measure = () => {
      setFullHeight(el.scrollHeight)
      if (!expanded) setCanExpand(el.scrollHeight > el.clientHeight + 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => observer.disconnect()
  }, [expanded, destination.overviewBody])

  const collapseToSectionTop = () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    sectionRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const toggle = () => {
    if (expanded) collapseToSectionTop()
    setExpanded((open) => !open)
  }

  const goTo = (next: number) => {
    const count = highlights.length
    if (!count) return
    setHighlightIndex(((next % count) + count) % count)
  }

  // Swipe on the highlight image — verbatim the homepage Destinations drag pattern (threshold 50,
  // touch-action:pan-y so vertical page scroll stays native).
  const dragState = useRef({ dragging: false, startX: 0, moved: 0 })

  const active = highlights[highlightIndex]

  return (
    <section
      ref={sectionRef}
      id="overview"
      aria-labelledby="destination-overview-heading"
      className="w-full scroll-mt-[70px] bg-bg-page py-80 lg:scroll-mt-[110px] lg:py-160"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-48 page-gutter-x lg:flex-row lg:items-start lg:justify-between lg:gap-96">
        {/* Left: the editorial column. */}
        <div data-reveal="left" className="flex w-full flex-col gap-24 lg:max-w-[640px]">
          {eyebrow ? <p className="text-eyebrow uppercase text-action-primary">{eyebrow}</p> : null}

          <div className="flex w-full flex-col gap-24">
            {destination.overviewHeading ? (
              <h2 id="destination-overview-heading" className="text-display-h2 text-text-primary">
                {destination.overviewHeading}
              </h2>
            ) : null}

            {hasBody ? (
              <div className={`flex w-full flex-col ${expanded ? 'gap-[28px]' : 'gap-20'}`}>
                <div
                  ref={bodyRef}
                  id="destination-overview-body"
                  style={expanded ? { maxHeight: fullHeight } : undefined}
                  className={`flex flex-col gap-16 overflow-hidden text-body-large text-text-primary transition-[max-height] duration-700 ease-out ${
                    expanded
                      ? ''
                      : 'max-h-[max(240px,60dvh)] lg:max-h-[max(240px,calc(60dvh_-_80px))] [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]'
                  }`}
                >
                  <RichText value={destination.overviewBody!} />
                </div>

                {canExpand ? (
                  <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={expanded}
                    aria-controls="destination-overview-body"
                    className={`group inline-flex w-fit items-center gap-4 py-4 text-button-small uppercase text-action-primary transition-colors duration-300 ease-in-out hover:text-accent-muted ${
                      expanded ? '' : '-mt-16'
                    }`}
                  >
                    {expanded ? 'Read less' : 'Read more'}
                    <span
                      aria-hidden="true"
                      className={`block h-[6px] w-[7px] shrink-0 bg-current transition-transform duration-300 ease-in-out [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${
                        expanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* Right: the highlights carousel. Hidden entirely when no highlights exist. */}
        {highlights.length ? (
          <div data-reveal className="flex w-full flex-col gap-32 lg:w-[458px] lg:shrink-0">
            {/* All highlight images stay mounted; the active one fades in — same crossfade model as
                the homepage Destinations backgrounds, so switching never flashes white. Swipeable
                like every other carousel on the site. */}
            {/* group/highlight drives the site-wide subtle hover zoom (scale-105 over 1100ms, same
                as CTA/Cabins/Gallery). Crossfade opacity lives on a WRAPPER per slide, transform on
                the image itself — one element can't carry two different durations.
                draggable={false} on the images: they are the pointer target, and the browser's
                native image-drag (ghost image) was swallowing the mouse gesture before our handler
                ran — which is why drag worked on touch but "did nothing" on desktop. */}
            <div
              className="group/highlight relative aspect-[458/366.4] w-full cursor-grab overflow-hidden select-none [touch-action:pan-y] active:cursor-grabbing"
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
                if (moved <= -THRESHOLD) goTo(highlightIndex + 1)
                else if (moved >= THRESHOLD) goTo(highlightIndex - 1)
              }}
            >
              {highlights.map((h, i) => (
                <div
                  key={h._key}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    i === highlightIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    {...sanityImageProps(h.image, '/assets/placeholder-photo.svg')}
                    alt={i === highlightIndex ? (h.image?.alt ?? '') : ''}
                    fill
                    draggable={false}
                    sizes="(min-width: 1024px) 458px, 100vw"
                    className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/highlight:scale-105"
                  />
                </div>
              ))}
            </div>

            {/* Caption layout (Adinda, 2026-07-22, LOCKED after four iterations — per her
                screenshot): arrows vertically centered on the TITLE line only (not the eyebrow);
                eyebrow above the row; description below capped to the TITLE'S width — pr matches
                the arrows column (2 buttons + gaps: 96 mobile / 128 lg, both on-scale) so copy
                never runs under the buttons. */}
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-8">
                <p className="text-eyebrow uppercase text-action-primary">
                  Highlight
                  {/* beige-400 — no semantic token, see header. */}
                  <span className="text-[#c9b89a]">/{String(highlightIndex + 1).padStart(2, '0')}</span>
                </p>
                <div className="flex items-center gap-12">
                  <h3 className="min-w-0 flex-1 text-editorial-h3 text-text-primary">{active?.title}</h3>
                  {highlights.length > 1 ? (
                    <div className="flex shrink-0 gap-12">
                      <CarouselArrowButton direction="prev" onClick={() => goTo(highlightIndex - 1)} ariaLabel="Previous highlight" />
                      <CarouselArrowButton direction="next" onClick={() => goTo(highlightIndex + 1)} ariaLabel="Next highlight" />
                    </div>
                  ) : null}
                </div>
              </div>
              {active?.body ? (
                <div className="flex flex-col gap-16 pr-96 text-body-large text-text-primary lg:pr-128">
                  <RichText value={active.body} />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
