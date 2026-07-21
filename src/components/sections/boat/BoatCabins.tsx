'use client'

import { useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import { CarouselChevron } from '@/components/CarouselChevron'
import { RichText } from '@/components/RichText'
import type { LightboxSlide } from '@/components/SiteLightbox'
import { useDragScroll } from '@/lib/useDragScroll'
import { sanityImageProps, urlForImage } from '@/sanity/lib/image'
import type { BoatData, CabinTypeData } from '@/sanity/queries'

// DYNAMIC, ssr:false — see the matching note in BoatGallery. YARL and its stylesheets (~40KB) load
// only once a visitor opens the lightbox; a static import would silently put them back in the
// page's first load.
const SiteLightbox = dynamic(
  () => import('@/components/SiteLightbox').then((m) => m.SiteLightbox),
  { ssr: false },
)

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
// `deckLocation` deliberately NOT in this list (Adinda, 2026-07-20) — it moved up into the
// count/guests eyebrow line as its third item ("3 Cabins · Max. 2 Guests · Main Deck"). It is still
// a cabinType field and still editor-set; only where it RENDERS changed. Do not add it back here or
// it will appear twice.
const SPEC_FIELDS = [
  'bedConfiguration',
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
  // Drag-to-scroll the cabin-type tablist — the site-wide rule is that any horizontally
  // scrollable track is draggable on mouse AND touch, not just the image carousels.
  const tabTrackRef = useDragScroll<HTMLDivElement>()
  const [imageIndex, setImageIndex] = useState(0)
  // `lightboxIndex === null` means closed; `hasOpened` latches TRUE on the first open and never
  // resets, so the dynamic chunk stays out of the initial load while YARL still gets to run its own
  // close animation (unmounting on close would cut that off). Same pattern as BoatGallery.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [hasOpened, setHasOpened] = useState(false)

  // ONE lightbox holding EVERY cabin type's photos, flattened in the order `cabinTypes` arrives
  // (Deluxe then Superior — the query already orders by `order asc, name asc`). Each slide is
  // stamped with the cabin it came from, DERIVED from `cabin.name`, never hand-typed, so the label
  // cannot drift if a cabin is renamed.
  //
  // ⚠️ `cabinType.images` is `imageWithAlt`, which has NO caption field — unlike the gallery's
  // `galleryImage`. So `alt` doubles as the caption text here, falling back to the cabin name when
  // an editor has left alt empty (recommended-not-required, per the site-wide alt rule).
  //
  // fit('max') is mandatory — the only guard against the CDN upscaling past the master.
  // auto('format') is the ONLY path to AVIF; q75 is the measured choice for the cold WebP path.
  const cabinSlides: LightboxSlide[] = useMemo(
    () =>
      cabinTypes.flatMap((cabin) =>
        (cabin.images ?? [])
          .filter((img) => img.asset?._ref)
          .map((img) => ({
            src: urlForImage(img).width(1920).fit('max').quality(75).auto('format').url(),
            alt: img.alt,
            label: cabin.name,
            caption: img.alt || cabin.name,
          })),
      ),
    [cabinTypes],
  )

  // Where each cabin type's photos START inside that flattened list. Opening from the Superior tab
  // must land on the Superior slide the visitor was actually looking at, not on slide 0 — which is
  // exactly what a naive `imageIndex` would do. Counted over the SAME filter as the slides above,
  // or one missing asset shifts the offsets out from under the index.
  // Written as a running SUM of the preceding types rather than a mutated accumulator: the React
  // compiler's immutability rule rejects reassigning a local across a render-phase callback.
  const slideOffsets = useMemo(
    () =>
      cabinTypes.map((_cabin, index) =>
        cabinTypes
          .slice(0, index)
          .reduce(
            (total, prev) =>
              total + (prev.images ?? []).filter((img) => img.asset?._ref).length,
            0,
          ),
      ),
    [cabinTypes],
  )

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

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

  // Open the COMBINED lightbox on the photo currently showing. The index is resolved against the
  // filtered list (`openableImages`), not `images`, so it matches `cabinSlides` exactly.
  const openableImages = images.filter((img) => img.asset?._ref)
  const openLightbox = () => {
    if (!cabinSlides.length) return
    const within = currentImage ? openableImages.indexOf(currentImage) : -1
    setHasOpened(true)
    setLightboxIndex(slideOffsets[typeIndex] + Math.max(within, 0))
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
      className="w-full scroll-mt-[70px] bg-bg-accent-secondary pt-64 pb-80 lg:scroll-mt-[110px] lg:pt-[120px] lg:pb-160"
    >
      {/* EVEN GAPS around the tab strip (Adinda, 2026-07-21): description → tabs → first image are
          equal spaces — 32 mobile / 48 desktop, this outer gap and the inner one below in step.
          Replaces 48 here + 24/80 below, which left the tabs hugging the image on mobile and
          floating far from it on desktop. */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-32 lg:gap-48">
        {/* section-heading (778:8764) — 720px measure, centred.
            SPACING FOLLOWS THE HOMEPAGE, NOT FIGMA (Adinda, 2026-07-17: established conventions
            supersede Figma for type + spacing). eyebrow→h2 is gap-32, matching WhyUs.tsx's centred
            heading (Figma agrees here). heading→body is gap-24, matching TheBoat.tsx — Figma says
            gap-8, and that's the side that loses. */}
        {/* 720 -> 800 (Adinda, 2026-07-20). Follows the existing max-w ladder, which steps in 80s at
            the small end (480/560/640/720). 840 was considered and rejected as too wide for centred
            prose. This is the reference for any future centred section heading + description. */}
        <div className="mx-auto flex max-w-[800px] flex-col gap-24 page-gutter-x text-center">
          <div className="flex flex-col gap-32">
            {eyebrow ? <p className="text-eyebrow uppercase text-text-eyebrow">{eyebrow}</p> : null}
            {heading ? (
              <h2 id="boat-cabins-heading" className="text-display-h2 text-text-primary">
                {heading}
              </h2>
            ) : null}
          </div>
          {boat.cabinsIntro?.length ? (
            /* gap-16 = the paragraph-spacing rule (2026-07-21): wrapper owns it, 12 for
               body-medium / 16 for body-large. */
            <div className="flex flex-col gap-16 text-body-large text-text-primary">
              <RichText value={boat.cabinsIntro} />
            </div>
          ) : null}
        </div>

        {/* One step off the outer gap-32 by design: +4px (one spacing unit) of extra air between
            the tab strip and the image, Adinda 2026-07-21 — mobile only, desktop stays at the even
            48. 36 is off the spacing scale, hence the arbitrary value (never round to 32/48).
            History: 24/80 (2026-07-20) → even 32/48 → this. */}
        <div className="flex flex-col gap-[36px] lg:gap-48">
          {/* tab-items (778:8770) — the underline is a continuous 2px track across the whole row, so
              the tabs butt together (px-12 each, NO gap) rather than sitting apart. A gap-4 between
              tabs was tried 2026-07-21 and rejected same-day (the seam in the track "looks very
              strange" — Adinda); don't reintroduce it. On mobile the row scrolls horizontally
              instead of wrapping, which keeps that track unbroken.
              justify-center on mobile too (2026-07-20, Adinda) — was justify-start. Desktop was
              already centred, so this only changes mobile.
              ⚠️ Caveat if cabin types grow: with overflow-x-auto, a centred flex row whose content is
              WIDER than the viewport becomes unscrollable at the start edge in some browsers — the
              first tab gets clipped and can't be reached. Two types fit comfortably today. If a third
              is ever added, re-check on a narrow phone and fall back to justify-start when
              overflowing. */}
          <div
            ref={tabTrackRef}
            role="tablist"
            aria-label="Cabin types"
            className="flex cursor-grab justify-center overflow-x-auto select-none page-gutter-x scrollbar-hidden active:cursor-grabbing lg:cursor-auto lg:justify-center lg:overflow-visible lg:px-0 lg:select-auto"
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
                  // text-button-small on MOBILE only (Adinda, 2026-07-20) so the cabin tabs match the
                  // gallery's 12px tabs on a phone. Desktop keeps 14px (text-button) — the size
                  // difference between the two sections is deliberate there, per the Figma note above.
                  className={`shrink-0 border-b-2 px-12 py-8 text-button-small whitespace-nowrap uppercase transition-colors duration-300 ease-in-out lg:text-button ${
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
            {/* cursor-zoom-in matches the Gallery (Adinda, 2026-07-20 — the hover CTA overlay was
                tried and rejected as "annoying"; the zoom cursor is the affordance instead). The
                cursor now tells the truth: as of 2026-07-20 the click opens the combined cabin
                lightbox. The image is wrapped in a <button>, and that button is an ABSOLUTE OVERLAY
                rather than the outer element — the prev/next chevrons are siblings inside this same
                box, and a <button> nested in a <button> is invalid HTML. Same structure as the
                Gallery, for the same reason. */}
            <div className="group/cabin relative aspect-[3/2] w-full shrink-0 cursor-zoom-in overflow-hidden lg:w-[708px]" data-reveal>
              {/* Hover zoom + data-reveal — site-wide non-hero image treatment; opt-in per
                  component, which is why this section never had it. */}
              {currentImage ? (
                <button
                  type="button"
                  onClick={openLightbox}
                  aria-label={`Open ${currentImage.alt || active.name || 'cabin photo'} in full screen`}
                  className="absolute inset-0 block size-full cursor-zoom-in"
                >
                  <Image
                    {...sanityImageProps(currentImage, '/assets/placeholder-photo.svg')}
                    alt={currentImage.alt ?? ''}
                    fill
                    sizes="(min-width: 1024px) 708px, 100vw"
                    className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/cabin:scale-105"
                  />
                </button>
              ) : null}

              {/* Bare chevrons, no circle — see the matching note in BoatGallery. These step through
                  PHOTOS; the round arrows by the heading step through CABIN TYPES.
                  🔴 pointer-events-none on the CONTAINER (Adinda, 2026-07-20 — was missing). This row
                  spans the full width across the image's vertical centre; without it, its empty
                  middle band (a z-10 div with no handler) SWALLOWED taps and the lightbox never
                  opened — worst on mobile, where you naturally tap centre. The buttons re-enable
                  pointer-events for themselves. Gallery already had this; Cabins did not. */}
              {images.length > 1 ? (
                <div className="pointer-events-none absolute inset-x-16 top-1/2 z-10 flex -translate-y-1/2 items-center justify-between">
                  <button
                    type="button"
                    onClick={() => stepImage(-1)}
                    aria-label="Previous photo"
                    style={{ filter: 'drop-shadow(0 1px 4px rgba(19, 29, 52, 0.55))' }}
                    className="pointer-events-auto flex size-[44px] items-center justify-center text-text-ondark-primary opacity-80 transition-opacity duration-300 ease-in-out hover:opacity-100"
                  >
                    <CarouselChevron direction="left" sizeClassName="h-[12.13px] w-[16px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepImage(1)}
                    aria-label="Next photo"
                    style={{ filter: 'drop-shadow(0 1px 4px rgba(19, 29, 52, 0.55))' }}
                    className="pointer-events-auto flex size-[44px] items-center justify-center text-text-ondark-primary opacity-80 transition-opacity duration-300 ease-in-out hover:opacity-100"
                  >
                    <CarouselChevron direction="right" sizeClassName="h-[12.13px] w-[16px]" />
                  </button>
                </div>
              ) : null}
            </div>

            {/* right-col-content (778:8781) — 475.86px in Figma, rounded to 476. */}
            {/* lg:pt-24 removed (Adinda, 2026-07-20) — the text column sat 24px below the image.
                Parent is already lg:items-start, so dropping the offset top-aligns the two. Same
                change as the Gallery's lg:pt-64. */}
            <div className="flex flex-col gap-16 page-gutter-x lg:w-[476px] lg:shrink-0 lg:px-0">
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
                  {active.count || active.maxGuests || active.deckLocation ? (
                    <p className="text-eyebrow uppercase text-text-eyebrow">
                      {[
                        active.count ? `${active.count} Cabins` : null,
                        active.maxGuests ? `Max. ${active.maxGuests} Guests` : null,
                        // Third item (Adinda, 2026-07-20), moved up out of the spec list below.
                        active.deckLocation,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  ) : null}
                </div>

                {active.description?.length ? (
                  <div className="flex flex-col gap-12 text-body-medium text-text-primary">
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

      {/* ONE lightbox for ALL cabin types combined (see cabinSlides above), not one per tab — a
          visitor browsing photos shouldn't have to come back out and switch tabs to keep going.
          Gated on `hasOpened` so the dynamic chunk is never fetched until a visitor clicks. */}
      {hasOpened ? (
        <SiteLightbox
          open={lightboxIndex !== null}
          index={lightboxIndex ?? 0}
          slides={cabinSlides}
          onClose={closeLightbox}
          ariaLabel="cabin photos"
        />
      ) : null}
    </section>
  )
}
