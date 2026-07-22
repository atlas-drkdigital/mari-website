'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

import { CarouselArrowButton } from '@/components/CarouselArrowButton'
import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { BoatCardData } from '@/sanity/queries'

// Figma Section/TheBoats = 778:8697. Built 2026-07-22.
//
// ⚠️ THE FIGMA FRAME SITS ON A DARK CANVAS AND THIS IS *NOT* A DARK SECTION — Adinda's reference
// screenshot showed it on black, but the node itself is the LIGHT texture over bg-page (the same
// documented trap as the boat Overview/Gallery). Navy heading, chocolate eyebrow, cream card.
//
// Everything renders from the `boat` documents — nothing hardcoded (Adinda's explicit spec):
//   - image = the boat page's hero (coverImage), or the boat's dedicated card image when its
//     "use cover on cards" toggle is off — the boat schema's Cards tab names this section as a
//     consumer, so the toggle is honoured here
//   - name, stats line, description (overviewBody — the boat page's own overview copy),
//     "More about the boat" → /boats/{slug}
//   - one boat shown at a time; the header arrows step through boats (wrapping) and DISAPPEAR
//     when only one boat exists
//   - heading is boatsHeadingSingular/boatsHeading picked by boat count — two explicit fields,
//     not automatic pluralization, so localization later just fills both forms per language
//
// Desktop geometry (the deliberate asymmetry, per the node): image 640x472 in the left gutter
// column, pushed DOWN 64px; the cream card overlaps the image's right edge by ~96px (node math:
// 99 — nearest scale step wins per convention), sits HIGHER than the image, and bleeds all the
// way to the RIGHT viewport edge (no right gutter). Mobile: image first at 3:2, stacked, no
// overlap, standard gutters (Adinda's spec).
export function DestinationBoats({
  boats,
  eyebrow,
  heading,
  headingSingular,
  ctaText,
}: {
  boats: BoatCardData[]
  eyebrow?: string
  heading?: string
  headingSingular?: string
  ctaText?: string
}) {
  const [index, setIndex] = useState(0)
  // Touch swipe on the image steps boats (Adinda, 2026-07-22). The image is a LINK, so a swipe
  // must also suppress the click that follows pointerup — the ref flag is read (and reset) in
  // onClick. Touch-only: desktop has the arrows, and a mouse-drag-on-link would fight
  // click-to-navigate.
  const swipe = useRef<{ startX: number; suppressClick: boolean } | null>(null)

  if (!boats.length) return null

  const boat = boats[Math.min(index, boats.length - 1)]
  const step = (delta: number) => setIndex((i) => (i + delta + boats.length) % boats.length)
  const resolvedHeading = boats.length === 1 ? headingSingular || heading : heading
  const image = boat.useCoverAsCardImage !== false ? boat.coverImage : (boat.cardImage ?? boat.coverImage)

  // The stats line reads "30m · 7 cabins · 14 guests · 14 crew" — value + lowercased label,
  // except size-ish stats whose value ("30m") already says everything. Label-match derivation,
  // same precedent as the destination card's season line. Size sorts FIRST (the mock leads with
  // it; the boat doc's own order leads with cabins — hero order, not card order).
  const stats = (boat.stats ?? []).filter((s) => s.value)
  const isSize = (s: { label?: string }) => (s.label ?? '').toLowerCase().includes('size')
  const statsLine = [...stats.filter(isSize), ...stats.filter((s) => !isSize(s))]
    .map((s) => (isSize(s) ? s.value : `${s.value} ${(s.label ?? '').toLowerCase()}`.trim()))
    .join(' · ')

  return (
    <section
      id="boats"
      aria-labelledby="destination-boats-heading"
      /* lg:pb-[112px] = 64 + the extra 48 Adinda asked for on desktop (2026-07-22). */
      className="relative isolate w-full scroll-mt-[70px] overflow-hidden bg-bg-page pt-64 pb-64 lg:scroll-mt-[110px] lg:pt-[120px] lg:pb-[112px]"
    >
      {/* Light texture — per the node AND Adinda's explicit "be very careful that we do use the
          light texture here". Itineraries above deliberately has none. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--texture-light)] [background-size:720px_auto] bg-repeat opacity-20"
      />

      <div className="flex w-full flex-col gap-[40px]">
        {/* Header — the Itineraries recipe verbatim (page-gutter mobile, 160 desktop). */}
        <div data-reveal className="flex w-full flex-col gap-32 page-gutter-x lg:px-160">
          {eyebrow ? <p className="text-eyebrow uppercase text-text-eyebrow">{eyebrow}</p> : null}
          <div className="flex items-center justify-between gap-24">
            {resolvedHeading ? (
              <h2 id="destination-boats-heading" className="max-w-[560px] text-display-h2 text-text-primary">
                {resolvedHeading}
              </h2>
            ) : null}
            {boats.length > 1 ? (
              <div className="flex shrink-0 gap-12">
                <CarouselArrowButton direction="prev" onClick={() => step(-1)} ariaLabel="Previous boat" />
                <CarouselArrowButton direction="next" onClick={() => step(1)} ariaLabel="Next boat" />
              </div>
            ) : null}
          </div>
        </div>

        {/* aria-live so the arrows announce the swapped boat to screen readers.
            🔴 NO `key={boat._id}` and data-reveal ONLY on this STABLE element — the first build
            keyed this div, and every arrow click remounted it as a fresh [data-reveal] node that
            ScrollReveal (which scans once on mount) never observes, so the card swapped to
            PERMANENTLY INVISIBLE ("nothing is loaded, it's just empty" — Adinda's 2026-07-22
            catch). Content must swap IN PLACE inside a reveal-stable wrapper. */}
        {/* Mobile is FULL-BLEED (Adinda, 2026-07-22): no side gutters, image edge-to-edge at
            3:2 with the beige card directly beneath as the visual separator (gap-0 — a bg-page
            strip between them read as a seam, not a separator). Desktop unchanged. */}
        <div
          aria-live="polite"
          data-reveal
          className="flex w-full flex-col lg:flex-row lg:items-start lg:pl-160"
        >
          {/* Image: a LINK to the boat's page with the site-wide hover zoom (Adinda, 2026-07-22
              — same treatment as every non-hero image). Desktop: fixed 640x472 pushed 64px down
              so the card (top-aligned) reads as sitting ON it. Slug is guaranteed — the query
              filters on defined(slug.current). */}
          <a
            href={`/boats/${boat.slug}`}
            aria-label={`More about ${boat.name ?? 'this boat'}`}
            onPointerDown={(e) => {
              if (e.pointerType === 'touch') swipe.current = { startX: e.clientX, suppressClick: false }
            }}
            onPointerUp={(e) => {
              if (e.pointerType !== 'touch' || !swipe.current) return
              const dx = e.clientX - swipe.current.startX
              if (Math.abs(dx) >= 50 && boats.length > 1) {
                step(dx < 0 ? 1 : -1)
                swipe.current.suppressClick = true
              }
            }}
            onClick={(e) => {
              if (swipe.current?.suppressClick) {
                e.preventDefault()
                swipe.current = null
              }
            }}
            /* [touch-action:pan-y]: vertical page scroll stays native, horizontal swipes reach
               the handlers above. */
            className="group/photo relative block aspect-[3/2] w-full shrink-0 overflow-hidden [touch-action:pan-y] lg:mt-64 lg:aspect-auto lg:h-[472px] lg:w-[640px]"
          >
            <Image
              {...sanityImageProps(image, '/assets/placeholder-photo.svg')}
              alt={image?.alt ?? ''}
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/photo:scale-105"
            />
          </a>

          {/* Card: cream-50 (#f5f0e8 = beige-150 = bg-accent), overlapping the image by 96px
              (node math 99 — scale step wins) and bleeding to the right viewport edge (the row
              has NO right padding on lg). z-10 puts it above the image. */}
          <div className="z-10 flex flex-col gap-16 bg-bg-accent p-24 lg:-ml-96 lg:flex-1 lg:pt-48 lg:pr-80 lg:pb-80 lg:pl-64">
            <div className="flex flex-col gap-16">
              {boat.name ? <h3 className="text-display-h3 text-text-primary">{boat.name}</h3> : null}
              {statsLine ? (
                <p className="text-eyebrow uppercase text-text-eyebrow">{statsLine}</p>
              ) : null}
            </div>
            {/* excerpt (the boat's Card summary), NOT overviewBody — the full overview is the
                boat page's own copy and reads far too long here (Adinda, 2026-07-22).
                gap-16 = the paragraph-spacing rule: wrapper owns it, 16 for body-large. */}
            {boat.excerpt?.length ? (
              <div className="flex flex-col gap-16 text-body-large text-text-primary">
                <RichText value={boat.excerpt} />
              </div>
            ) : null}
            {ctaText && boat.slug ? (
              <a
                href={`/boats/${boat.slug}`}
                className="group mt-16 w-fit border-b border-action-primary py-4"
              >
                <span className="flex items-center gap-4 text-button-small uppercase text-action-primary">
                  {ctaText}
                  <span
                    aria-hidden="true"
                    className="block size-[16px] shrink-0 bg-action-primary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
                  />
                </span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
