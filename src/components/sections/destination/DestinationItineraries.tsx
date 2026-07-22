'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

import { CarouselArrowButton } from '@/components/CarouselArrowButton'
import { useDragScroll } from '@/lib/useDragScroll'
import { sanityImageProps } from '@/sanity/lib/image'
import type { ItineraryCardData } from '@/sanity/queries'

// Figma Section/Destination/Itinerary Carousel = 778:8688. Built 2026-07-22, behavior specced
// live by Adinda (recorded here because none of it is visible in the static mock):
//
//   - REVEAL: every card is CLOSED at rest (key info + title + route over a light top scrim).
//     Desktop: hover/focus opens it — image darkens hard, description + CTA fade in; mouse-out
//     closes. NO card starts open ("that's confusing"). Touch devices: first tap opens, and only
//     the CTA link navigates.
//   - NAVIGATION: the CTA (and on hover-capable devices the WHOLE card) jumps to
//     #upcoming-trips — but only when this destination actually has a trips embed. No embed →
//     no CTA, card not clickable at all (the Trips section + its subnav item already hide).
//   - CAROUSEL: the row is static while every card fits (3 visible on lg, 2 on md, 1 on mobile —
//     "visible number fits → not scrollable, arrows disappear, no looping"). Only when there are
//     MORE cards than fit does it become a drag carousel with an INFINITE loop (Adinda's call)
//     and the header arrows appear. So with today's 3 Komodo itineraries: desktop is a static
//     row, mobile loops. Arrows are lg-only, like the mock — mobile follows the Why Us pattern
//     (peek + drag, no arrows).
//
// The infinite loop is the one genuinely new mechanism (flagged as the risk item in _RESUME.md):
// implemented as THREE copies of the card list in a native scroll-snap track, positioned on the
// middle copy, re-centred by a silent scrollLeft jump when scrolling settles inside an outer
// copy. Normalising only when idle (scroll quiets for 120ms) is what avoids visible jumps during
// iOS momentum — do not normalise inside the scroll handler itself. Outer copies are aria-hidden
// with focus disabled, so screen readers and tab order see each itinerary exactly once.
//
// Conventions over Figma (per the locked rule, deltas recorded):
//   - description is Bricolage body-large — the mock sets it in Inter (drift; site has no Inter)
//   - scrims are the NAVY ondark family, not the mock's raw black (0,0,0) fills
//   - arrows are CarouselArrowButton `outline` — the mock's chocolate ring predates the
//     extracted standard (the destination Overview on this same page uses `outline`)
//   - heading→track gap 64, not the mock's 63; card text inset 32, not 31
//   - ✦ separator is the CHARACTER at 10px, not an icon asset (the HighlightCard lesson)

function visibleFor(width: number): number {
  if (width >= 1024) return 3
  if (width >= 768) return 2
  return 1
}

export function DestinationItineraries({
  itineraries,
  eyebrow,
  heading,
  cardCtaText,
  hasTripsTarget,
}: {
  itineraries: ItineraryCardData[]
  eyebrow?: string
  heading?: string
  cardCtaText?: string
  hasTripsTarget: boolean
}) {
  const cards = useMemo(
    () => (itineraries ?? []).filter((it) => it.title),
    [itineraries],
  )

  // null = "open on hover/tap" state cleared. On the looped track a clone shares its source's
  // _id, so hovering a clone lights the same itinerary — which is exactly right.
  const [activeId, setActiveId] = useState<string | null>(null)
  // Hover-capable devices reveal on hover and make the whole card a link; touch devices reveal
  // on tap. Determined after mount (SSR can't know), defaulting to hover:false so a touch
  // visitor's first tap never navigates blind.
  const [hasHover, setHasHover] = useState(false)
  // Carousel mode is breakpoint-dependent: only when more cards exist than fit the row. SSR
  // renders the static row; the effect upgrades after mount.
  const [isCarousel, setIsCarousel] = useState(false)

  const trackRef = useDragScroll<HTMLDivElement>()
  const settleTimer = useRef<number | null>(null)
  // Where a touch started, for the tap-vs-swipe test in the pointer handlers below.
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const apply = () => setHasHover(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const apply = () => setIsCarousel(cards.length > visibleFor(window.innerWidth))
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [cards.length])

  // Loop plumbing: when the carousel engages, park the scroll on the middle copy; when scrolling
  // settles inside an outer copy, jump one copy-width back toward the middle. The jump is a
  // direct scrollLeft write (no smooth behavior), so it lands between frames and is invisible —
  // the three copies are pixel-identical by construction.
  useEffect(() => {
    const el = trackRef.current
    if (!el || !isCarousel) return
    const copyWidth = () => el.scrollWidth / 3
    el.scrollLeft = copyWidth()

    const normalize = () => {
      const w = copyWidth()
      if (w <= 0) return
      if (el.scrollLeft < w * 0.5) el.scrollLeft += w
      else if (el.scrollLeft >= w * 1.5) el.scrollLeft -= w
    }
    const onScroll = () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current)
      settleTimer.current = window.setTimeout(normalize, 120)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (settleTimer.current) window.clearTimeout(settleTimer.current)
    }
  }, [isCarousel, trackRef, cards.length])

  const step = useCallback(
    (delta: number) => {
      const el = trackRef.current
      if (!el) return
      const card = el.querySelector<HTMLElement>('[data-itinerary-card]')
      const gap = 24
      const width = (card?.offsetWidth ?? 464) + gap
      el.scrollBy({ left: delta * width, behavior: 'smooth' })
    },
    [trackRef],
  )

  if (!cards.length) return null

  // Three copies only in carousel mode; the middle copy (copy === 1) is the canonical one.
  const copies = isCarousel ? [0, 1, 2] : [1]

  return (
    <section
      id="itineraries"
      aria-labelledby="destination-itineraries-heading"
      /* NO texture — it originally carried the Trips-section treatment per the mock, removed on
         Adinda's call 2026-07-22 ("it's fighting with the next section"): Upcoming Trips sits
         directly below and keeps the texture, so this section stays plain bg-page. */
      className="w-full scroll-mt-[70px] bg-bg-page pt-64 pb-96 lg:scroll-mt-[110px] lg:pt-80 lg:pb-128"
    >

      <div className="mx-auto flex w-full flex-col gap-48 lg:gap-64">
        {/* Header keeps the Trips section's gutter treatment (page-gutter mobile, 160 desktop). */}
        <div data-reveal className="flex w-full flex-col gap-32 page-gutter-x lg:px-160">
          {eyebrow ? <p className="text-eyebrow uppercase text-text-eyebrow">{eyebrow}</p> : null}
          <div className="flex items-center justify-between gap-24">
            {heading ? (
              <h2
                id="destination-itineraries-heading"
                className="max-w-[560px] text-display-h2 text-text-primary"
              >
                {heading}
              </h2>
            ) : null}
            {/* Arrows exist only when the row actually scrolls — on EVERY breakpoint (Adinda,
                2026-07-22: "I want the arrows still" on mobile; an earlier lg-only pass followed
                Why Us, which has none). CarouselArrowButton is 36px mobile / 52px lg on its own. */}
            {isCarousel ? (
              <div className="flex shrink-0 gap-12">
                <CarouselArrowButton direction="prev" onClick={() => step(-1)} ariaLabel="Previous itinerary" />
                <CarouselArrowButton direction="next" onClick={() => step(1)} ariaLabel="Next itinerary" />
              </div>
            ) : null}
          </div>
        </div>

        {/* Track starts flush at the viewport's left edge (mock: card 1 at x=0, no gutter). */}
        <div
          ref={trackRef}
          data-reveal
          onMouseLeave={() => setActiveId(null)}
          className={`flex w-full gap-16 lg:gap-24 ${
            isCarousel
              ? 'cursor-grab snap-x snap-mandatory overflow-x-auto select-none scrollbar-hidden active:cursor-grabbing'
              : 'mx-auto max-w-[1440px] overflow-hidden'
          }`}
        >
          {copies.map((copy) =>
            cards.map((card) => {
              const isClone = copy !== 1
              const isOpen = activeId === card._id
              const clickable = hasTripsTarget
              return (
                <article
                  key={`${copy}-${card._id}`}
                  data-itinerary-card
                  aria-hidden={isClone || undefined}
                  onMouseEnter={hasHover ? () => setActiveId(card._id) : undefined}
                  onFocus={hasHover ? () => setActiveId(card._id) : undefined}
                  /* Touch reveal rides POINTERUP, not click (fixed 2026-07-22, Adinda's catch:
                     "I have to tap twice"). iOS Safari consumes the first tap on hover-reactive
                     content as hover-emulation and only delivers `click` on the second — pointer
                     events have no such heuristic, so pointerup fires on every tap. The ≤10px
                     movement test is what keeps carousel swipes from toggling the card they
                     started on; taps inside the CTA <a> are skipped so navigating doesn't also
                     collapse the card (the closest() test replaces the old stopPropagation-on-
                     click, which pointerup would bypass). */
                  onPointerDown={
                    !hasHover
                      ? (e) => {
                          if (e.pointerType === 'touch') touchStart.current = { x: e.clientX, y: e.clientY }
                        }
                      : undefined
                  }
                  onPointerUp={
                    !hasHover
                      ? (e) => {
                          if (e.pointerType !== 'touch' || !touchStart.current) return
                          const moved = Math.hypot(
                            e.clientX - touchStart.current.x,
                            e.clientY - touchStart.current.y,
                          )
                          touchStart.current = null
                          if (moved > 10) return
                          if ((e.target as HTMLElement).closest('a')) return
                          setActiveId((cur) => (cur === card._id ? null : card._id))
                        }
                      : undefined
                  }
                  /* Mobile height is dvh-based, not an aspect ratio (Adinda, 2026-07-22): "a
                     little less than one full viewport height" so the description fits without
                     drowning the card. 70dvh, capped so tall phones don't balloon it; desktop
                     keeps the mock's fixed 464x580. */
                  className="group/card relative h-[70dvh] max-h-[640px] w-[84%] shrink-0 snap-center overflow-hidden md:w-[46%] lg:h-[580px] lg:max-h-none lg:w-[464px] lg:snap-start"
                >
                  <Image
                    {...sanityImageProps(card.image, '/assets/placeholder-photo.svg')}
                    alt={card.image?.alt ?? ''}
                    fill
                    sizes="(min-width: 1024px) 464px, (min-width: 768px) 46vw, 84vw"
                    className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/card:scale-105"
                  />

                  {/* Crossfading scrims — closed: light top wash for the header text; open: the
                      hard darken that makes the description legible (Adinda: darker on reveal). */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-background-ondark-page/40 to-transparent transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                  />
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 bg-background-ondark-page/60 transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                  />

                  {/* NO whole-card link — REMOVED 2026-07-22 (Adinda: "I cannot scroll drag the
                      itineraries, and that is extremely annoying"). A full-card <a> turns every
                      drag attempt into a navigation, so the CTA below is the ONLY way to the
                      trips section, on every device. Do not reintroduce the overlay link. */}

                  <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between px-24 pt-32 pb-48 lg:px-32 lg:pt-48 lg:pb-64">
                    <div className="flex flex-col gap-16">
                      <p className="flex items-center gap-8 text-body-medium font-medium text-text-ondark-primary">
                        {card.season ? <span>{card.season}</span> : null}
                        {card.season && card.duration ? (
                          <span aria-hidden="true" className="text-[10px] leading-none">✦</span>
                        ) : null}
                        {card.duration ? <span>{card.duration}</span> : null}
                      </p>
                      <h3 className="max-w-[400px] text-display-h3 text-text-ondark-primary">
                        {card.title}
                      </h3>
                      {/* body-medium to match the season/duration line, NOT the mock's 16px
                          (Adinda, 2026-07-22: route should read as a label, same size as the key
                          info); pin scaled down with it. */}
                      {card.route ? (
                        <p className="flex items-center gap-4 text-body-medium text-text-ondark-primary">
                          <span
                            aria-hidden="true"
                            className="block size-[14px] shrink-0 bg-text-ondark-primary [mask-image:url('/assets/icon-location.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
                          />
                          {card.route}
                        </p>
                      ) : null}
                    </div>

                    <div
                      className={`flex flex-col items-start gap-32 transition-opacity duration-500 ease-in-out lg:gap-64 ${
                        isOpen ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {/* line-clamp-6 on mobile only (Adinda, 2026-07-22) — the dvh card can't
                          grow with the text, so an over-long summary truncates with an ellipsis
                          instead of colliding with the CTA. Studio pairs this with a 240-char
                          counter on the field; the clamp is the safety net, not the editor UX. */}
                      {card.summary ? (
                        <p className="line-clamp-6 max-w-[400px] text-body-large text-text-ondark-primary lg:line-clamp-none">
                          {card.summary}
                        </p>
                      ) : null}
                      {clickable && cardCtaText ? (
                        <a
                          href="#upcoming-trips"
                          tabIndex={isClone || !isOpen ? -1 : undefined}
                          className={`group/cta border-b border-border-onimage-primary py-4 ${
                            isOpen ? 'pointer-events-auto' : ''
                          }`}
                        >
                          <span className="flex items-center gap-4 text-button-small uppercase text-text-ondark-primary">
                            {cardCtaText}
                            <span
                              aria-hidden="true"
                              className="block size-[16px] shrink-0 bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover/cta:translate-x-[2px] [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
                            />
                          </span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            }),
          )}
        </div>
      </div>
    </section>
  )
}
