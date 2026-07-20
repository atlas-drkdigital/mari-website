'use client'

import { useState } from 'react'
import Image from 'next/image'

import { CarouselChevron } from '@/components/CarouselChevron'
import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { BoatData, CabinTypeData } from '@/sanity/queries'

// Figma Section/Cabins = 778:8762. REBUILT 2026-07-17 against the node — the first pass was written
// from the schema spec alone and drifted in ~6 places (tabs at 12px not 14px, description at 16px not
// 14px, no carousel at all, no row icons, and `py-120`/`border-beige-200` which emit NOTHING because
// neither name exists in this theme). Same failure mode as the BoatHero rebuild; see its header.
//
// The tabs (778:8771-8772) are `cabinType` documents, not a fixed list — Figma shows two
// (Deluxe/Superior) because that's what this boat has, not because two is the design.
//
// TWO ARROW PAIRS, TWO JOBS — and this is the one thing to check before touching this file:
//   - the ROUND paired arrows beside the cabin name (778:8789) step through CABIN TYPES (= the tabs)
//   - the SMALL arrows overlaid on the photo (778:8777/8779) step through THAT TYPE'S IMAGES
// This mirrors BoatGallery, where Adinda confirmed the left-hand paired arrows move between
// CATEGORIES and only the on-image arrows move between images. She did NOT confirm it for this
// section specifically — it's inferred from that symmetry and is flagged for review. If it's wrong,
// the fix is to point the paired arrows' onClick at stepImage instead of stepType; nothing else moves.

// Fixed icon per field, chosen in code by field name — never editor-set (locked 2026-07-15,
// cabinType.ts). Assets pulled from the Figma node itself, not approximated: the icons exist.
const SPEC_ICONS: Record<string, string> = {
  bedConfiguration: '/assets/icon-cabin-bed.svg',
  deckLocation: '/assets/icon-cabin-deck.svg',
  window: '/assets/icon-cabin-window.svg',
  bathroom: '/assets/icon-cabin-bathroom.svg',
  airConditioning: '/assets/icon-cabin-air.svg',
}

// Fixed row order. A field an editor leaves blank drops its whole row rather than rendering an
// empty one — blank `window` should mean one less row, not a stray icon.
const SPEC_FIELDS = [
  'bedConfiguration',
  'deckLocation',
  'window',
  'bathroom',
  'airConditioning',
] as const

export function BoatCabins({
  boat,
  cabinTypes,
  eyebrow,
  heading,
}: {
  boat: BoatData
  cabinTypes: CabinTypeData[]
  eyebrow?: string
  heading?: string
}) {
  const [typeIndex, setTypeIndex] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)

  if (!cabinTypes.length) return null

  const active = cabinTypes[Math.min(typeIndex, cabinTypes.length - 1)]
  const images = active.images ?? []
  const currentImage = images[Math.min(imageIndex, Math.max(images.length - 1, 0))]

  // Changing tab resets the photo — otherwise landing on tab 2 at image 4 shows a blank slot when
  // that type has fewer photos than the one you came from.
  const selectType = (index: number) => {
    setTypeIndex(index)
    setImageIndex(0)
  }
  const stepType = (delta: number) =>
    selectType((typeIndex + delta + cabinTypes.length) % cabinTypes.length)
  const stepImage = (delta: number) => {
    if (images.length < 2) return
    setImageIndex((i) => (i + delta + images.length) % images.length)
  }

  const specRows = SPEC_FIELDS.flatMap((field) => {
    const value = active[field]
    return value ? [{ field, icon: SPEC_ICONS[field], value }] : []
  })

  return (
    <section
      id="cabins"
      aria-labelledby="boat-cabins-heading"
      // bg-accent-secondary (beige-100 #fbf8f2), NOT bg-page — Figma 778:8762 paints this section
      // one step warmer than the page ground so it lifts off it. Adinda, 2026-07-17.
      // Vertical padding GATED (audit 2026-07-20): desktop = Figma (120/160); mobile pt-64 / pb-80
      // (bottom = top +1 step on the scale — Adinda 2026-07-20, pb-96 read too big). Was flat
      // `pt-[120px] pb-160` — desktop-sized padding on phones.
      className="w-full bg-bg-accent-secondary pt-64 pb-80 lg:pt-[120px] lg:pb-160"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-48">
        {/* section-heading (778:8764) — 720px measure, centred.
            SPACING FOLLOWS THE HOMEPAGE, NOT FIGMA (Adinda, 2026-07-17: established conventions
            supersede Figma for type + spacing). eyebrow→h2 is gap-32, matching WhyUs.tsx's centred
            heading (Figma agrees here). heading→body is gap-24, matching TheBoat.tsx — Figma says
            gap-8, and that's the side that loses. */}
        <div className="mx-auto flex max-w-[720px] flex-col gap-24 page-gutter-x text-center">
          <div className="flex flex-col gap-32">
            {eyebrow ? <p className="text-eyebrow uppercase text-text-eyebrow">{eyebrow}</p> : null}
            {heading ? (
              <h2 id="boat-cabins-heading" className="text-display-h2 text-text-primary">
                {heading}
              </h2>
            ) : null}
          </div>
          {boat.cabinsIntro?.length ? (
            <div className="text-body-large text-text-primary">
              <RichText value={boat.cabinsIntro} />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-80">
          {/* tab-items (778:8770) — the underline is a continuous 2px track across the whole row, so
              the tabs butt together (px-12 each, NO gap) rather than sitting apart. On mobile the row
              scrolls horizontally instead of wrapping, which keeps that track unbroken.
              justify-center on mobile too (2026-07-20, Adinda) — was justify-start. Desktop was
              already centred, so this only changes mobile.
              ⚠️ Caveat if cabin types grow: with overflow-x-auto, a centred flex row whose content is
              WIDER than the viewport becomes unscrollable at the start edge in some browsers — the
              first tab gets clipped and can't be reached. Two types fit comfortably today. If a third
              is ever added, re-check on a narrow phone and fall back to justify-start when
              overflowing. */}
          <div
            role="tablist"
            aria-label="Cabin types"
            className="flex justify-center overflow-x-auto page-gutter-x lg:justify-center lg:overflow-visible lg:px-0"
          >
            {cabinTypes.map((cabin, i) => {
              const selected = i === typeIndex
              return (
                <button
                  key={cabin._id}
                  role="tab"
                  type="button"
                  id={`cabin-tab-${cabin._id}`}
                  aria-selected={selected}
                  aria-controls={`cabin-panel-${cabin._id}`}
                  onClick={() => selectType(i)}
                  className={`shrink-0 border-b-2 px-12 py-8 text-button whitespace-nowrap uppercase transition-colors duration-300 ease-in-out ${
                    selected
                      ? 'border-action-primary text-action-primary'
                      : 'border-action-primary/35 text-action-primary/55 hover:text-action-primary'
                  }`}
                >
                  {cabin.name}
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id={`cabin-panel-${active._id}`}
            aria-labelledby={`cabin-tab-${active._id}`}
            className="flex flex-col gap-48 lg:flex-row lg:items-start lg:justify-between lg:gap-64 lg:pr-160"
          >
            {/* Image block is a fixed 708x532 on desktop (778:8775), full-bleed on mobile. That 708
                is why `sizes` says 708px — 2x target 1416px. Do NOT swap this for a vw fraction
                without re-reading the node: every image-resolution verdict depends on this number. */}
            {/* aspect-[3/2] (2026-07-20, Adinda) — was 708/532 (1.331), now matches Key Features and
                the Gallery. NOTE the sizes= caveat above still holds: the slot is still 708px wide on
                desktop, only its HEIGHT changed, so the resolution targets are unaffected. */}
            <div className="group/cabin relative aspect-[3/2] w-full shrink-0 overflow-hidden lg:w-[708px]" data-reveal>
              {/* Hover zoom + data-reveal — site-wide non-hero image treatment; opt-in per
                  component, which is why this section never had it. */}
              {currentImage ? (
                <Image
                  {...sanityImageProps(currentImage, '/assets/placeholder-photo.svg')}
                  alt={currentImage.alt ?? ''}
                  fill
                  sizes="(min-width: 1024px) 708px, 100vw"
                  className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/cabin:scale-105"
                />
              ) : null}

              {images.length > 1 ? (
                <div className="absolute inset-x-16 top-1/2 flex -translate-y-1/2 items-center justify-between">
                  <button
                    type="button"
                    onClick={() => stepImage(-1)}
                    aria-label="Previous photo"
                    className="flex size-[36px] items-center justify-center rounded-full bg-bg-surface text-text-primary shadow-[0_4px_20px_2px_#2C252233] transition-opacity duration-300 hover:opacity-80"
                  >
                    <CarouselChevron direction="left" />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepImage(1)}
                    aria-label="Next photo"
                    className="flex size-[36px] items-center justify-center rounded-full bg-bg-surface text-text-primary shadow-[0_4px_20px_2px_#2C252233] transition-opacity duration-300 hover:opacity-80"
                  >
                    <CarouselChevron direction="right" />
                  </button>
                </div>
              ) : null}
            </div>

            {/* right-col-content (778:8781) — 475.86px in Figma, rounded to 476. */}
            <div className="flex flex-col gap-16 page-gutter-x lg:w-[476px] lg:shrink-0 lg:px-0 lg:pt-24">
              <div className="flex flex-col gap-24">
                {/* The cabin NAME shares a row with the arrows so the two align to each other; the
                    "3 Cabins · Max. 2 Guests" label drops to its own row beneath (Adinda, 2026-07-20).
                    Previously all three sat in one row with the arrows centred against the whole
                    name+label block, which left the arrows floating between the two lines.
                    Same fix, same reasoning as the Gallery heading — see LatestArticles.tsx:44-52. */}
                <div className="flex flex-col gap-16">
                  <div className="flex items-center justify-between gap-16">
                    <h3 className="min-w-0 text-display-h3 text-text-primary">{active.name}</h3>

                    {/* Glyph changed from the raw character `→` to a CSS mask of
                        icon-arrow-forward.svg — the SAME asset the Gallery and Destinations use.
                        Not in Adinda's brief, but the Gallery arrows moved to that asset earlier
                        today and these sit on the SAME PAGE: leaving them as a font glyph would have
                        shipped two visibly different arrow weights a few sections apart. Size is
                        36/52 responsive to match. */}
                    {cabinTypes.length > 1 ? (
                      <div className="flex shrink-0 gap-12">
                        <button
                          type="button"
                          onClick={() => stepType(-1)}
                          aria-label="Previous cabin type"
                          className="group grid size-[36px] shrink-0 place-items-center rounded-full border border-action-primary transition-colors duration-300 ease-in-out hover:bg-action-primary lg:size-[52px]"
                        >
                          <span
                            aria-hidden="true"
                            className="block size-[16px] rotate-180 bg-action-primary transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:bg-action-primary-text [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => stepType(1)}
                          aria-label="Next cabin type"
                          className="group grid size-[36px] shrink-0 place-items-center rounded-full border border-action-primary transition-colors duration-300 ease-in-out hover:bg-action-primary lg:size-[52px]"
                        >
                          <span
                            aria-hidden="true"
                            className="block size-[16px] bg-action-primary transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:bg-action-primary-text [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
                          />
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {/* "3 Cabins · Max. 2 Guests" (778:8788) — assembled from the two numeric fields
                      rather than a typed string, so it can't drift from the real counts. Styled as an
                      eyebrow (11px / 1.375 tracking), not body copy. Now on its OWN row below the
                      name+arrows row. */}
                  {active.count || active.maxGuests ? (
                    <p className="text-eyebrow uppercase text-text-eyebrow">
                      {[
                        active.count ? `${active.count} Cabins` : null,
                        active.maxGuests ? `Max. ${active.maxGuests} Guests` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  ) : null}
                </div>

                {active.description?.length ? (
                  <div className="text-body-medium text-text-primary">
                    <RichText value={active.description} />
                  </div>
                ) : null}
              </div>

              {/* Spec rows (778:8801+) — divider ABOVE every row except the first. NO closing rule under
                  the last row: Figma (778:8844) has one, but Adinda removed it on BOTH mobile and desktop
                  2026-07-20 — it dangled at the section's bottom edge and read as a hard stop. #ece4d6 =
                  border-subtle (@theme 2026-07-17) is still what the between-row dividers use. */}
              {specRows.length ? (
                <ul className="flex flex-col">
                  {specRows.map((row, i) => (
                    <li
                      key={row.field}
                      className={`flex items-center gap-[14px] py-16 ${
                        i > 0 ? 'border-t border-border-subtle' : ''
                      }`}
                    >
                      <Image
                        src={row.icon}
                        alt=""
                        aria-hidden
                        width={16}
                        height={16}
                        className="size-16 shrink-0"
                      />
                      <span className="text-body-medium text-text-primary">{row.value}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
