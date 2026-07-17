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

  return (
    <section id="gallery" aria-labelledby="boat-gallery-heading" className="w-full bg-bg-page pt-96 pb-160">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-48 lg:flex-row lg:gap-64 lg:pl-160">
        <div className="flex w-full flex-col gap-48 page-gutter-x lg:w-auto lg:max-w-[560px] lg:flex-1 lg:px-0 lg:pt-64">
          <div className="flex flex-col gap-64">
            {/* Block/SectionHeading (778:8849) — gap-34 is off-scale, so it's an arbitrary value.
                NOTE: this node has NO eyebrow child (unlike Cabins' SectionHeading). It's rendered
                conditionally so `boatDefaults.galleryEyebrow` isn't an orphaned field, but leave it
                empty in Studio to match the mockup. Flagged for review. */}
            <div className="flex flex-col gap-[34px]">
              <div className="flex items-center justify-between gap-24">
                <div className="flex min-w-0 flex-1 flex-col gap-8">
                  {eyebrow ? (
                    <p className="text-eyebrow uppercase text-text-eyebrow">{eyebrow}</p>
                  ) : null}
                  {heading ? (
                    <h2 id="boat-gallery-heading" className="text-display-h2 text-text-primary">
                      {heading}
                    </h2>
                  ) : null}
                </div>
                {/* "VIEW FULL GALLERY" (778:8849;700:3347) is DELIBERATELY NOT BUILT. It needs a
                    destination and there is no /gallery route, and no schema field to hold the link
                    — building a button that goes nowhere is worse than omitting it. See §2 of the
                    review doc. */}
              </div>

              {/* tab-items (778:8850) — continuous 2px underline track, so tabs butt together
                  (px-12, no gap). 12px here (text-button-small), genuinely SMALLER than the Cabins
                  tabs at 14px — that's the design, not a slip. Mobile: horizontal drag-scroll, same
                  treatment as Destinations. */}
              {tabs.length ? (
                <div
                  role="tablist"
                  aria-label="Gallery categories"
                  className="-mx-24 flex overflow-x-auto px-24 lg:mx-0 lg:overflow-visible lg:px-0"
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

          {/* Element/Carousel/Arrows Paired (778:8861) — these move between CATEGORIES. */}
          {tabs.length > 1 ? (
            <div className="flex gap-12">
              <button
                type="button"
                onClick={() => stepTab(-1)}
                aria-label="Previous category"
                className="flex size-[52px] items-center justify-center rounded-full border border-action-primary text-action-primary transition-colors duration-300 hover:bg-action-primary hover:text-action-primary-text"
              >
                <span aria-hidden className="rotate-180 text-[20px] leading-none">
                  →
                </span>
              </button>
              <button
                type="button"
                onClick={() => stepTab(1)}
                aria-label="Next category"
                className="flex size-[52px] items-center justify-center rounded-full border border-action-primary text-action-primary transition-colors duration-300 hover:bg-action-primary hover:text-action-primary-text"
              >
                <span aria-hidden className="text-[20px] leading-none">
                  →
                </span>
              </button>
            </div>
          ) : null}
        </div>

        {/* Image sits flush to the right edge (the frame has pl-160 only, no pr) — mirror image of
            the Cabins block, which is flush left. */}
        <div className="w-full shrink-0 lg:w-[708px]">
          {visible.length ? (
            <div className="relative aspect-[708/532] w-full overflow-hidden">
              <button
                type="button"
                onClick={() => setLightboxIndex(all.indexOf(currentImage))}
                aria-label={`Open ${currentImage?.title ?? 'photo'} in full screen`}
                className="absolute inset-0 block size-full cursor-zoom-in"
              >
                <Image
                  {...sanityImageProps(currentImage, '/assets/placeholder-photo.svg')}
                  alt={currentImage?.alt ?? ''}
                  fill
                  sizes="(min-width: 1024px) 708px, 100vw"
                  className="object-cover"
                />
              </button>

              {visible.length > 1 ? (
                <div className="pointer-events-none absolute inset-x-16 top-1/2 flex -translate-y-1/2 items-center justify-between">
                  <button
                    type="button"
                    onClick={() => stepImage(-1)}
                    aria-label="Previous photo"
                    className="pointer-events-auto flex size-[36px] items-center justify-center rounded-full bg-bg-surface text-text-primary shadow-[0_4px_20px_2px_#2C252233] transition-opacity duration-300 hover:opacity-80"
                  >
                    <CarouselChevron direction="left" />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepImage(1)}
                    aria-label="Next photo"
                    className="pointer-events-auto flex size-[36px] items-center justify-center rounded-full bg-bg-surface text-text-primary shadow-[0_4px_20px_2px_#2C252233] transition-opacity duration-300 hover:opacity-80"
                  >
                    <CarouselChevron direction="right" />
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
          className="fixed inset-0 z-50 flex flex-col bg-background-ondark-muted/95 p-16 pb-[env(safe-area-inset-bottom)] lg:p-24"
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
