'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

import { CarouselChevron } from '@/components/CarouselChevron'
import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { BoatData, GalleryImageData, GalleryTabData } from '@/sanity/queries'

// Figma Section/Gallery = 778:8845. REBUILT 2026-07-17 against the node.
//
// ⚠️ THE FIGMA FRAME IS ON A BLACK CANVAS AND THIS IS *NOT* A DARK SECTION. The node sets no
// background at all, so it inherits `bg-page` (cream). A screenshot of it looks like navy text on
// black, which reads as a broken page — it isn't. Same trap already documented in CLAUDE.md for the
// Overview. Confirmed with Adinda 2026-07-17. Do not "fix" this toward the screenshot.
//
// ⚠️ THE ONE DATA TRAP, locked 2026-07-17 — one array, TWO different reads:
//   - each TAB's carousel shows ONLY that category's images (filter on `categories`)
//   - the LIGHTBOX shows ALL images combined, ignoring the tab (Adinda, explicit, 2026-07-17)
// Feeding the carousel the unfiltered array is the bug that LOOKS correct: tab one usually renders
// plausibly because its images happen to sort first. It must be checked on a LATER tab, not the
// first. `visible` and `all` below are deliberately separate for exactly this reason — if you find
// yourself passing `all` to the carousel, that's the bug.
//
// ⚠️ TWO ARROW SETS, TWO JOBS (Adinda, explicit, 2026-07-17):
//   - the ROUND paired arrows in the LEFT column (778:8861) step through CATEGORIES, not images
//   - the SMALL arrows overlaid on the photo (778:8874/8876) step through the current tab's IMAGES
//
// The image block is 708.144 x 532.072 — IDENTICAL to the cabins block (778:8775), which is why
// `sizes` says 708px and every image verdict uses a 1416px @2x target. The old code claimed 55vw
// (=792px); that was never in the design. Do not reintroduce a vw fraction here.
// Paired round CATEGORY arrows. Rendered TWICE — beside the heading on desktop, at the end of the
// tab row on mobile — because the two breakpoints want them in structurally different places and
// only one is ever visible (`hidden lg:flex` / `flex lg:hidden`). One component, so a change to the
// hover state or the icon cannot land on one and miss the other.
//
// The glyph is a CSS mask of icon-arrow-forward.svg, the SAME asset Destinations uses, rotated for
// "previous". It replaced the raw character `→`: a typeface decides a glyph's weight and shape, so
// it never matches the site's other arrows — the exact problem that produced CarouselChevron.
// Size 36/52 responsive, matching Destinations. Colour is action-primary (cream section), not
// Destinations' ondark tokens.
function CategoryArrows({
  onPrev,
  onNext,
  show,
  className = '',
}: {
  onPrev: () => void
  onNext: () => void
  show: boolean
  className?: string
}) {
  if (!show) return null

  const button =
    'group grid size-[36px] shrink-0 place-items-center rounded-full border border-action-primary transition-colors duration-300 ease-in-out hover:bg-action-primary lg:size-[52px]'
  // DOUBLE-quoted deliberately: the class contains single quotes inside url(...). Writing this as a
  // single-quoted JS string needs \' escapes, and Tailwind then bakes the BACKSLASHES into the class
  // name — it emits url(\'...\'), which the bundler cannot resolve. tsc and eslint both pass; the
  // only symptom is a 500 and a "Module not found" line in .next/dev/logs.
  const glyph =
    "block size-[16px] bg-action-primary transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:bg-action-primary-text [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"

  return (
    <div className={`shrink-0 gap-12 ${className}`}>
      <button type="button" onClick={onPrev} aria-label="Previous category" className={button}>
        <span aria-hidden="true" className={`${glyph} rotate-180`} />
      </button>
      <button type="button" onClick={onNext} aria-label="Next category" className={button}>
        <span aria-hidden="true" className={glyph} />
      </button>
    </div>
  )
}

export function BoatGallery({
  boat,
  eyebrow,
  heading,
}: {
  boat: BoatData
  eyebrow?: string
  heading?: string
}) {
  const all: GalleryImageData[] = useMemo(() => boat.gallery ?? [], [boat.gallery])

  // A tab with no images tagged to it is not rendered (Adinda 2026-07-17). The category list stays
  // fixed in `galleryCategories.ts` — this is what makes an unused one ('Others' today) cost nothing:
  // the editor sees the row in Studio, the visitor doesn't see an empty tab, and the tab appears on
  // its own the moment an image is tagged. No category is special-cased. A tab whose `category` is
  // unset hides for the same reason — it can never match an image.
  const tabs: GalleryTabData[] = useMemo(
    () =>
      (boat.galleryTabs ?? []).filter((tab) => {
        const category = tab.category
        return !!category && all.some((img) => (img.categories ?? []).includes(category))
      }),
    [boat.galleryTabs, all],
  )

  const [tabIndex, setTabIndex] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const activeTab = tabs[Math.min(tabIndex, Math.max(tabs.length - 1, 0))]

  // THE CAROUSEL'S read: this tab's category only.
  const visible = useMemo(
    () => all.filter((img) => (img.categories ?? []).includes(activeTab?.category ?? '')),
    [all, activeTab],
  )

  const currentImage = visible[Math.min(imageIndex, Math.max(visible.length - 1, 0))]

  // Changing category resets the photo — otherwise landing on a shorter category at image 6 shows
  // an empty slot.
  const selectTab = useCallback((index: number) => {
    setTabIndex(index)
    setImageIndex(0)
  }, [])
  const stepTab = (delta: number) => {
    if (!tabs.length) return
    selectTab((tabIndex + delta + tabs.length) % tabs.length)
  }
  const stepImage = (delta: number) => {
    if (visible.length < 2) return
    setImageIndex((i) => (i + delta + visible.length) % visible.length)
  }

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const stepLightbox = useCallback(
    (delta: number) =>
      setLightboxIndex((i) => (i === null ? null : (i + delta + all.length) % all.length)),
    [all.length],
  )

  // Keyboard + scroll lock. NOTE: this is deliberately NOT a full modal implementation — there is no
  // focus trap and no touch-swipe. Both are pending the decision on `yet-another-react-lightbox`
  // (see _handoff/_REVIEW-2026-07-17-boat-sections.md §6). Do not call this lightbox done.
  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') stepLightbox(1)
      if (e.key === 'ArrowLeft') stepLightbox(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [lightboxIndex, closeLightbox, stepLightbox])

  // `tabs` is already filtered to those holding images, so an empty list means there is genuinely
  // nothing to show and the whole section hides. This also covers images tagged with a category that
  // has no tab row — they'd be unreachable, so the section correctly treats them as nothing.
  if (!tabs.length) return null

  const lightboxImage = lightboxIndex === null ? null : all[lightboxIndex]

  // Vertical padding GATED (audit 2026-07-20): desktop = Figma (96/160); mobile 64/96 to match the
  // homepage rhythm. Was flat `pt-96 pb-160` — desktop-sized padding on phones.
  return (
    <section id="gallery" aria-labelledby="boat-gallery-heading" className="w-full bg-bg-page pt-64 pb-96 lg:pt-96 lg:pb-160">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-48 lg:flex-row lg:gap-64 lg:pl-160">
        <div className="flex w-full flex-col gap-48 page-gutter-x lg:w-auto lg:max-w-[560px] lg:flex-1 lg:px-0 lg:pt-64">
          <div className="flex flex-col gap-64">
            {/* Block/SectionHeading (778:8849) — gap-34 is off-scale, so it's an arbitrary value.
                NOTE: this node has NO eyebrow child (unlike Cabins' SectionHeading). It's rendered
                conditionally so `boatDefaults.galleryEyebrow` isn't an orphaned field, but leave it
                empty in Studio to match the mockup. Flagged for review. */}
            <div className="flex flex-col gap-[34px]">
              {/* Eyebrow on its OWN line, then heading + arrows sharing a row — the
                  LatestArticles.tsx:44-52 pattern (eyebrow above, h2 and its button aligned to each
                  other). This is what makes the arrows align to "Gallery" rather than floating at the
                  centre of the eyebrow+heading block, which is what they did before.
                  gap-24 between eyebrow and h2, NOT Figma's gap-8 — conventions supersede Figma. */}
              <div className="flex flex-col gap-24">
                {eyebrow ? (
                  <p className="text-eyebrow uppercase text-text-eyebrow">{eyebrow}</p>
                ) : null}
                <div className="flex items-center justify-between gap-24">
                  {heading ? (
                    <h2 id="boat-gallery-heading" className="text-display-h2 text-text-primary">
                      {heading}
                    </h2>
                  ) : null}
                  {/* "VIEW FULL GALLERY" (778:8849;700:3347) is DELIBERATELY NOT BUILT — it needs a
                      destination and there is no /gallery route. See §2 of the review doc. */}
                  <CategoryArrows
                    onPrev={() => stepTab(-1)}
                    onNext={() => stepTab(1)}
                    show={tabs.length > 1}
                    className="hidden lg:flex"
                  />
                </div>
              </div>

              {/* tab-items (778:8850) — continuous 2px underline track, so tabs butt together
                  (px-12, no gap). 12px here (text-button-small), genuinely SMALLER than the Cabins
                  tabs at 14px — that's the design, not a slip. Mobile: horizontal drag-scroll.
                  MOBILE-ONLY arrows live at the end of THIS row (Adinda, 2026-07-20) so the tab
                  underline track stops short of them — the Destinations treatment. Desktop keeps its
                  arrows up beside the heading, so the two placements are mutually exclusive and only
                  ever one is visible. Both render the SAME component, so they cannot drift apart.
                  Note the tablist lost its `-mx-24 px-24` edge-bleed: it now has to be a flex-1
                  sibling of the arrows for the track to end before them. */}
              {tabs.length ? (
                <div className="flex items-center gap-16">
                  <div
                    role="tablist"
                    aria-label="Gallery categories"
                    className="flex min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] lg:overflow-visible [&::-webkit-scrollbar]:hidden"
                  >
                    {tabs.map((tab, i) => {
                      const selected = i === tabIndex
                      return (
                        <button
                          key={tab._key}
                          role="tab"
                          type="button"
                          id={`gallery-tab-${tab._key}`}
                          aria-selected={selected}
                          aria-controls={`gallery-panel-${tab._key}`}
                          onClick={() => selectTab(i)}
                          className={`shrink-0 border-b-2 px-12 py-8 text-button-small whitespace-nowrap uppercase transition-colors duration-300 ease-in-out ${
                            selected
                              ? 'border-action-primary text-action-primary'
                              : 'border-action-primary/35 text-action-primary/55 hover:text-action-primary'
                          }`}
                        >
                          {tab.category}
                        </button>
                      )
                    })}
                  </div>
                  <CategoryArrows
                    onPrev={() => stepTab(-1)}
                    onNext={() => stepTab(1)}
                    show={tabs.length > 1}
                    className="flex lg:hidden"
                  />
                </div>
              ) : null}
            </div>

            {activeTab ? (
              <div
                role="tabpanel"
                id={`gallery-panel-${activeTab._key}`}
                aria-labelledby={`gallery-tab-${activeTab._key}`}
                className="flex flex-col gap-16"
              >
                {/* EDITORIAL h3 (23px), not display — this is a heading inside body copy, not a
                    section anchor. The old code used display-h3 (34px). See the ramp rule in
                    CLAUDE.md; picking by number alone is how that drifts. */}
                {activeTab.heading ? (
                  <h3 className="text-editorial-h3 text-text-primary">{activeTab.heading}</h3>
                ) : null}
                {activeTab.body?.length ? (
                  <div className="text-body-large text-text-primary">
                    <RichText value={activeTab.body} />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Element/Carousel/Arrows Paired (778:8861) moved UP into the heading row — see the note
              there. Figma places these below the tab panel; the homepage convention puts section
              arrows beside the heading, and conventions supersede Figma. */}
        </div>

        {/* Image sits flush to the right edge (the frame has pl-160 only, no pr) — mirror image of
            the Cabins block, which is flush left. */}
        <div className="w-full shrink-0 lg:w-[708px]">
          {/* aspect-[3/2] (2026-07-20, Adinda) — was 708/532 (1.331). Now matches Key Features
              (BoatOverview.tsx:142) and Cabins, so every non-hero image block on the page shares
              one ratio. */}
          {visible.length ? (
            <div className="group/gallery relative aspect-[3/2] w-full overflow-hidden" data-reveal>
              <button
                type="button"
                onClick={() => setLightboxIndex(all.indexOf(currentImage))}
                aria-label={`Open ${currentImage?.title ?? 'photo'} in full screen`}
                className="absolute inset-0 block size-full cursor-zoom-in"
              >
                {/* Hover zoom — the site-wide treatment for every non-hero image (TheBoat, WhyUs,
                    Destinations, Cta, LatestArticles). It is opt-in per component, not automatic,
                    which is why this section never had it. duration-[1100ms] matches TheBoat. */}
                <Image
                  {...sanityImageProps(currentImage, '/assets/placeholder-photo.svg')}
                  alt={currentImage?.alt ?? ''}
                  fill
                  sizes="(min-width: 1024px) 708px, 100vw"
                  className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/gallery:scale-105"
                />

              </button>

              {/* Bare chevrons — NO circle (Adinda, 2026-07-20). The white circular buttons read as
                  the same control as the round CATEGORY arrows beside the heading, so two different
                  jobs looked identical and competed. These step through PHOTOS; those step through
                  CATEGORIES. Stripping the circle separates them visually.
                  Legibility over a photo now comes from a drop-shadow instead of the circle. It is an
                  inline style, not an arbitrary class: `filter:drop-shadow(...)` contains commas and
                  parens that Tailwind's class parser mangles — the same family of trap as the escaped
                  url() that 500'd the site earlier today. drop-shadow follows the mask's alpha, so it
                  traces the chevron outline rather than boxing it.
                  Chevron scaled 10 -> 16px wide since there's no longer a circle giving it presence;
                  height follows the 7.91668:6 viewBox ratio (see CarouselChevron). */}
              {visible.length > 1 ? (
                <div className="pointer-events-none absolute inset-x-16 top-1/2 flex -translate-y-1/2 items-center justify-between">
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
          ) : null}
        </div>
      </div>

      {/* THE LIGHTBOX'S read: every image, combined, ignoring the active tab (Adinda, explicit). */}
      {lightboxImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery"
          className="fixed inset-0 z-50 flex flex-col bg-background-lightbox-scrim/92 backdrop-blur-md p-16 pb-[env(safe-area-inset-bottom)] lg:p-24"
        >
          <div className="flex shrink-0 items-center justify-between gap-16 pb-16">
            <p className="text-body-medium text-text-ondark-secondary">
              {lightboxIndex! + 1} / {all.length}
            </p>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close gallery"
              className="flex size-[44px] items-center justify-center rounded-full border border-border-ondark-muted text-text-ondark-primary transition-colors duration-300 hover:bg-background-ondark-surface"
            >
              <span aria-hidden className="text-[20px] leading-none">
                ✕
              </span>
            </button>
          </div>

          {/* object-contain, so a PORTRAIT is height-bound here and passes easily — the same
              portrait can still fail the cover-cropped carousel above, where it's width-bound.
              "Is this image big enough" has no single answer, only a per-slot one. */}
          <div className="relative min-h-0 flex-1">
            <Image
              {...sanityImageProps(lightboxImage, '/assets/placeholder-photo.svg')}
              alt={lightboxImage.alt ?? ''}
              fill
              sizes="100vw"
              className="object-contain"
            />
            {all.length > 1 ? (
              <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between">
                <button
                  type="button"
                  onClick={() => stepLightbox(-1)}
                  aria-label="Previous photo"
                  className="pointer-events-auto flex size-[44px] items-center justify-center rounded-full bg-background-ondark-page/60 text-text-ondark-primary transition-opacity duration-300 hover:opacity-80"
                >
                  {/* Same chevron size as the 36px buttons — uniform across the site beats scaling per button. */}
                  <CarouselChevron direction="left" />
                </button>
                <button
                  type="button"
                  onClick={() => stepLightbox(1)}
                  aria-label="Next photo"
                  className="pointer-events-auto flex size-[44px] items-center justify-center rounded-full bg-background-ondark-page/60 text-text-ondark-primary transition-opacity duration-300 hover:opacity-80"
                >
                  <CarouselChevron direction="right" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Caption: title + caption together as ONE block below the image (Adinda's ask). Worth
              knowing: YARL's Captions plugin does NOT do this — it overlays them and splits title to
              the top of the viewport and description to the bottom. Matching this layout under YARL
              needs `render.slideFooter`. */}
          {lightboxImage.title || lightboxImage.caption ? (
            <div className="mx-auto flex w-full max-w-[720px] shrink-0 flex-col gap-4 pt-16 text-center">
              {lightboxImage.title ? (
                <p className="text-button-small uppercase text-text-ondark-eyebrow">
                  {lightboxImage.title}
                </p>
              ) : null}
              {lightboxImage.caption ? (
                <p className="text-body-medium text-text-ondark-secondary">{lightboxImage.caption}</p>
              ) : null}
            </div>
          ) : null}

          {/* Thumbnail filmstrip — hidden on mobile to preserve vertical space for a portrait under
              object-contain. That's the common pattern across leading lightboxes, and it also dodges
              YARL's open issue #398 (its filmstrip isn't independently swipeable on touch). */}
          {all.length > 1 ? (
            <div className="hidden shrink-0 gap-8 overflow-x-auto pt-16 lg:flex">
              {all.map((img, i) => (
                <button
                  key={img._key}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  aria-current={i === lightboxIndex}
                  className={`relative aspect-[3/2] h-[64px] shrink-0 overflow-hidden transition-opacity duration-300 ${
                    i === lightboxIndex
                      ? 'opacity-100 ring-2 ring-accent-ondark-primary'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image
                    {...sanityImageProps(img, '/assets/placeholder-photo.svg')}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
