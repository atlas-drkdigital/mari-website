'use client'

import { useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import { CarouselChevron } from '@/components/CarouselChevron'
import { RichText } from '@/components/RichText'
import type { LightboxSlide } from '@/components/SiteLightbox'
import { sanityImageProps, urlForImage } from '@/sanity/lib/image'
import type { BoatData, GalleryImageData, GalleryTabData } from '@/sanity/queries'

// DYNAMIC, ssr:false — an explicit condition of adopting YARL. The library plus its three
// stylesheets (~40KB) are pulled only when a visitor actually opens the lightbox, and the module is
// never rendered below until `hasOpened` flips, so nothing is fetched on page load. Importing
// SiteLightbox statically would undo all of that with no visible symptom.
const SiteLightbox = dynamic(
  () => import('@/components/SiteLightbox').then((m) => m.SiteLightbox),
  { ssr: false },
)

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
  // `lightboxIndex === null` means closed. `hasOpened` latches TRUE on the first open and never
  // resets: it is what keeps the dynamic chunk out of the initial load while still letting YARL run
  // its own close animation (unmounting the component on close would cut that animation off).
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [hasOpened, setHasOpened] = useState(false)

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
  const openLightbox = useCallback((index: number) => {
    if (index < 0) return
    setHasOpened(true)
    setLightboxIndex(index)
  }, [])

  // THE LIGHTBOX'S read: every image, combined, ignoring the active tab (Adinda, explicit). Built
  // from `all`, never from `visible` — feeding it the filtered list is the bug that looks correct on
  // tab one.
  //
  // fit('max') is mandatory: it is the only guard against the CDN happily upscaling past the master,
  // and our masters top out around 1535px. auto('format') is the ONLY path to AVIF. q75 is the
  // measured choice — q80 busts the byte budget on the cold WebP path, which is what most
  // first-time visitors actually get. See CLAUDE.md's image-pipeline section.
  //
  // `title` no longer exists on galleryImage (removed from the schema — it duplicated `alt`), so
  // `caption` is the only caption source and `alt` is used for aria/alt text only.
  // An image with no asset can't produce a CDN URL, so it is dropped. `openable` is kept as its own
  // array — the lightbox index must be an index into THIS list, not into `all`, or a single missing
  // asset silently shifts every slide after it by one.
  const openable = useMemo(() => all.filter((img) => img.asset?._ref), [all])
  const lightboxSlides: LightboxSlide[] = useMemo(
    () =>
      openable.map((img) => ({
        src: urlForImage(img).width(1920).fit('max').quality(75).auto('format').url(),
        alt: img.alt,
        caption: img.caption,
      })),
    [openable],
  )

  // `tabs` is already filtered to those holding images, so an empty list means there is genuinely
  // nothing to show and the whole section hides. This also covers images tagged with a category that
  // has no tab row — they'd be unreachable, so the section correctly treats them as nothing.
  if (!tabs.length) return null

  // Vertical padding GATED (audit 2026-07-20): desktop = Figma (96/160); mobile 64/96 to match the
  // homepage rhythm. Was flat `pt-96 pb-160` — desktop-sized padding on phones.
  return (
    <section id="gallery" aria-labelledby="boat-gallery-heading" className="w-full bg-bg-page pt-64 pb-96 lg:pt-96 lg:pb-160">
      {/* GRID, not flex (Adinda, 2026-07-20). On mobile the tab panel (category heading + body) must
          sit BELOW the image, while the section heading + tabs stay above it. Those two text blocks
          are not siblings of the image, so flex `order` cannot reach across the nesting — grid can,
          by placing three children into explicit areas per breakpoint. No DOM duplication.
            mobile   1 column: heading+tabs (1) · image (2) · tab panel (3)
            desktop  2 columns: heading+tabs and tab panel stacked in col 1, image spans both rows
                     in col 2 — visually identical to the previous flex layout.
          DOM order is heading → panel → image, i.e. reading order, so screen readers and tab order
          keep the copy together regardless of the visual arrangement. */}
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-start gap-48 lg:grid-cols-[minmax(0,560px)_708px] lg:justify-between lg:gap-x-64 lg:gap-y-48 lg:pl-160">
        <div className="order-1 flex w-full flex-col gap-48 page-gutter-x lg:order-none lg:col-start-1 lg:row-start-1 lg:px-0">
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
                <div className="flex items-center gap-12 lg:gap-16">
                  {/* MOBILE: the inactive underline runs the FULL width of the tablist, not just under
                      the tabs, so it reaches to ~12px before the arrows (Adinda, 2026-07-20). The
                      border lives on the SCROLL CONTAINER, so it spans the flex-1 track rather than
                      ending after the last tab. Each tab's own border-b-2 draws over it at the same
                      offset, so the active tab still reads as a solid segment on the lighter rail.
                      Desktop drops it (`lg:border-b-0`) — there the arrows sit up by the heading and
                      the rail would run to the column edge with nothing to stop at. */}
                  <div
                    role="tablist"
                    aria-label="Gallery categories"
                    className="flex min-w-0 flex-1 overflow-x-auto border-b-2 border-action-primary/35 [-ms-overflow-style:none] [scrollbar-width:none] lg:overflow-visible lg:border-b-0 [&::-webkit-scrollbar]:hidden"
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
                          // -mb-[2px] pulls each tab down over the container's rail so the ACTIVE
                          // tab's 2px border REPLACES it rather than stacking above it. Without this
                          // the two borders sit at different offsets and the active segment looks
                          // thinner than the rail it's meant to cover (Adinda spotted it 2026-07-20).
                          className={`-mb-[2px] shrink-0 border-b-2 px-12 py-8 text-button-small whitespace-nowrap uppercase transition-colors duration-300 ease-in-out ${
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
          </div>
        </div>

        {/* TAB PANEL — a GRID CHILD, deliberately not nested in the heading column. That is what lets
            it sit below the image on mobile (order-3) while staying under the heading on desktop
            (col 1 / row 2). Moving it back inside the column would silently undo the mobile order. */}
        {activeTab ? (
          <div
            role="tabpanel"
            id={`gallery-panel-${activeTab._key}`}
            aria-labelledby={`gallery-tab-${activeTab._key}`}
            /* lg:pr-48 for deliberate asymmetry (Adinda, 2026-07-20). Scoped to THIS panel only
               — the tab heading + body. The section heading, eyebrow and tab strip above are
               untouched, and it is desktop-only so mobile keeps the full gutter width. */
            className="order-3 flex flex-col gap-16 page-gutter-x lg:order-none lg:col-start-1 lg:row-start-2 lg:px-0 lg:pr-48"
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

        {/* Image sits flush to the right edge (the frame has pl-160 only, no pr) — mirror image of
            the Cabins block, which is flush left.
            order-2 on mobile puts it BETWEEN the tabs and the tab panel; on desktop it spans both
            grid rows in column 2, which reproduces the old flex layout exactly. */}
        <div className="order-2 w-full shrink-0 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:w-[708px]">
          {/* aspect-[3/2] (2026-07-20, Adinda) — was 708/532 (1.331). Now matches Key Features
              (BoatOverview.tsx:142) and Cabins, so every non-hero image block on the page shares
              one ratio. */}
          {visible.length ? (
            <div className="group/gallery relative aspect-[3/2] w-full overflow-hidden" data-reveal>
              <button
                type="button"
                onClick={() => openLightbox(openable.indexOf(currentImage))}
                aria-label={`Open ${currentImage?.alt ?? 'photo'} in full screen`}
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

      {/* The hand-rolled overlay that used to live here (fixed inset-0 div, manual keyboard
          handling, manual filmstrip) was replaced by YARL on 2026-07-20 — it had no focus trap and
          no touch-swipe, which is what the library was adopted for. Config lives in SiteLightbox.
          Gated on `hasOpened` so the dynamic chunk is never fetched until a visitor clicks. */}
      {hasOpened ? (
        <SiteLightbox
          open={lightboxIndex !== null}
          index={lightboxIndex ?? 0}
          slides={lightboxSlides}
          onClose={closeLightbox}
          ariaLabel="gallery"
        />
      ) : null}
    </section>
  )
}
