'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { CarouselChevron } from '@/components/CarouselChevron'
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
//     by the paired 52px outline arrows (homepage Destinations' arrow expression + the shared
//     CarouselChevron glyph; Figma's heavier arrow icon is deliberately NOT used, see
//     CarouselChevron.tsx).
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
                the homepage Destinations backgrounds, so switching never flashes white. */}
            <div className="relative aspect-[458/366.4] w-full overflow-hidden">
              {highlights.map((h, i) => (
                <Image
                  key={h._key}
                  {...sanityImageProps(h.image, '/assets/placeholder-photo.svg')}
                  alt={i === highlightIndex ? (h.image?.alt ?? '') : ''}
                  fill
                  sizes="(min-width: 1024px) 458px, 100vw"
                  className={`object-cover transition-opacity duration-700 ease-in-out ${
                    i === highlightIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-start gap-12">
              <div className="flex min-w-0 flex-1 flex-col gap-16">
                <div className="flex flex-col gap-8">
                  <p className="text-eyebrow uppercase text-action-primary">
                    Highlight
                    {/* beige-400 — no semantic token, see header. */}
                    <span className="text-[#c9b89a]">/{String(highlightIndex + 1).padStart(2, '0')}</span>
                  </p>
                  <h3 className="text-editorial-h3 text-text-primary">{active?.title}</h3>
                </div>
                {active?.body ? (
                  <div className="flex flex-col gap-16 text-body-large text-text-primary">
                    <RichText value={active.body} />
                  </div>
                ) : null}
              </div>

              {highlights.length > 1 ? (
                <div className="flex shrink-0 items-start gap-12 pt-32">
                  <button
                    type="button"
                    onClick={() => goTo(highlightIndex - 1)}
                    aria-label="Previous highlight"
                    className="grid size-[52px] shrink-0 place-items-center rounded-full border border-text-primary text-text-primary transition-colors duration-300 ease-in-out hover:bg-text-primary/5"
                  >
                    <CarouselChevron direction="left" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(highlightIndex + 1)}
                    aria-label="Next highlight"
                    className="grid size-[52px] shrink-0 place-items-center rounded-full border border-text-primary text-text-primary transition-colors duration-300 ease-in-out hover:bg-text-primary/5"
                  >
                    <CarouselChevron direction="right" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
