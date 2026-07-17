'use client'

import { useState } from 'react'
import Image from 'next/image'

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
      className="w-full bg-bg-accent-secondary pt-[120px] pb-160"
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
              scrolls horizontally instead of wrapping, which keeps that track unbroken. */}
          <div
            role="tablist"
            aria-label="Cabin types"
            className="flex justify-start overflow-x-auto page-gutter-x lg:justify-center lg:overflow-visible lg:px-0"
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
            <div className="relative aspect-[708/532] w-full shrink-0 overflow-hidden lg:w-[708px]">
              {currentImage ? (
                <Image
                  {...sanityImageProps(currentImage, '/assets/placeholder-photo.svg')}
                  alt={currentImage.alt ?? ''}
                  fill
                  sizes="(min-width: 1024px) 708px, 100vw"
                  className="object-cover"
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
                    <span aria-hidden className="rotate-180 text-[18px] leading-none">
                      ›
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => stepImage(1)}
                    aria-label="Next photo"
                    className="flex size-[36px] items-center justify-center rounded-full bg-bg-surface text-text-primary shadow-[0_4px_20px_2px_#2C252233] transition-opacity duration-300 hover:opacity-80"
                  >
                    <span aria-hidden className="text-[18px] leading-none">
                      ›
                    </span>
                  </button>
                </div>
              ) : null}
            </div>

            {/* right-col-content (778:8781) — 475.86px in Figma, rounded to 476. */}
            <div className="flex flex-col gap-16 page-gutter-x lg:w-[476px] lg:shrink-0 lg:px-0 lg:pt-24">
              <div className="flex flex-col gap-24">
                <div className="flex items-center justify-center gap-16">
                  <div className="flex min-w-0 flex-1 flex-col gap-16">
                    <h3 className="text-display-h3 text-text-primary">{active.name}</h3>
                    {/* "3 Cabins · Max. 2 Guests" (778:8788) — assembled from the two numeric fields
                        rather than a typed string, so it can't drift from the real counts. It's
                        styled as an eyebrow (11px / 1.375 tracking / action-primary), not body copy. */}
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

                  {cabinTypes.length > 1 ? (
                    <div className="flex shrink-0 gap-12">
                      <button
                        type="button"
                        onClick={() => stepType(-1)}
                        aria-label="Previous cabin type"
                        className="flex size-[52px] items-center justify-center rounded-full border border-action-primary text-action-primary transition-colors duration-300 hover:bg-action-primary hover:text-action-primary-text"
                      >
                        <span aria-hidden className="rotate-180 text-[20px] leading-none">
                          →
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => stepType(1)}
                        aria-label="Next cabin type"
                        className="flex size-[52px] items-center justify-center rounded-full border border-action-primary text-action-primary transition-colors duration-300 hover:bg-action-primary hover:text-action-primary-text"
                      >
                        <span aria-hidden className="text-[20px] leading-none">
                          →
                        </span>
                      </button>
                    </div>
                  ) : null}
                </div>

                {active.description?.length ? (
                  <div className="text-body-medium text-text-primary">
                    <RichText value={active.description} />
                  </div>
                ) : null}
              </div>

              {/* Spec rows (778:8801+) — divider ABOVE every row except the first, plus one closing
                  rule under the last (778:8844). #ece4d6 = border-subtle, added to @theme 2026-07-17
                  because no semantic token resolved to it and this file previously reached for the
                  unexposed `beige-200` primitive, rendering no border at all. */}
              {specRows.length ? (
                <ul className="flex flex-col border-b border-border-subtle">
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
