'use client'

import { useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import type { LightboxSlide } from '@/components/SiteLightbox'
import { sanityImageProps, urlForImage } from '@/sanity/lib/image'
import type { GalleryImageData } from '@/sanity/queries'

// DYNAMIC, ssr:false — the same YARL loading condition as BoatGallery/BoatCabins: the library and
// its stylesheets download only after a visitor actually opens the lightbox. Never import
// SiteLightbox statically from a section.
const SiteLightbox = dynamic(
  () => import('@/components/SiteLightbox').then((m) => m.SiteLightbox),
  { ssr: false },
)

// Figma Destination Page/Section/Grid Gallery = 778:8677. Built 2026-07-22.
//
// The design is JUST the grid: full-bleed edge-to-edge squares, 4 per row at the 1440 frame
// (360px each = 25vw), gap-0, and — deliberately — NO eyebrow, NO visible heading, NO vertical
// padding of its own (the neighbouring sections' padding carries the rhythm). One tile in the
// mock has a faint top scrim; that is a mock artifact on a single image, not structure.
//
// The section still needs an accessible name, so `title` (destinationDefaults.subnavGalleryLabel
// — the SAME field that names the subnav anchor, one field one concept) renders as an sr-only h2.
// No SEO cost: images are indexed via their alt text regardless of headings, and a generic
// "Gallery" heading carries no keyword weight (confirmed with Adinda 2026-07-22 — the old
// galleryEyebrow/galleryTitle defaults fields were REMOVED on the same call).
//
// "View All Images" pill (Adinda, 2026-07-22, from a reference site): the bare grid wasn't
// clearly clickable, and she wants NO visible heading — so the affordance is a button floating
// ON the grid, bottom-center, 64px up from the grid's bottom edge (48px on mobile). It opens the
// combined lightbox at the first image; tiles stay individually clickable. ROUNDED-full is
// deliberate, not a convention break: the square bordered button is the INLINE section CTA; the
// over-image control family (CarouselArrowButton `surface`, lightbox chrome) is already round
// and solid. bg + shadow are CarouselArrowButton's surface recipe verbatim.
//
// Mobile is unspecified in Figma (desktop frame only): 2 columns, keeping the tiles large and the
// 8-image seed an even 4 rows. "Instagram-like" 3-up read as too small at phone width. Flagged
// for the per-section QA pass.
//
// Unlike BoatGallery there are no category tabs here — every image is in the grid, and the
// lightbox shows the same combined list (Adinda: "using the same lightbox gallery, all are
// combined"). The grid renders `openable` (asset-bearing images only), so a grid index IS a
// lightbox index — this sidesteps the off-by-one trap BoatGallery documents, and an asset-less
// array entry never renders a placeholder tile in what is meant to be a photo band.
export function DestinationGallery({
  images,
  title,
  ctaText,
}: {
  images: GalleryImageData[]
  title?: string
  ctaText?: string
}) {
  const openable = useMemo(() => (images ?? []).filter((img) => img.asset?._ref), [images])

  // `lightboxIndex === null` means closed; `hasOpened` latches so the dynamic chunk loads once and
  // YARL keeps its close animation (see BoatGallery for the full reasoning).
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [hasOpened, setHasOpened] = useState(false)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const openLightbox = useCallback((index: number) => {
    setHasOpened(true)
    setLightboxIndex(index)
  }, [])

  // fit('max') guards against upscaling past the master, auto('format') is the only path to AVIF,
  // q75 is the measured choice for the cold WebP path — CLAUDE.md's image-pipeline section.
  const lightboxSlides: LightboxSlide[] = useMemo(
    () =>
      openable.map((img) => ({
        src: urlForImage(img).width(1920).fit('max').quality(75).auto('format').url(),
        alt: img.alt,
        caption: img.caption,
      })),
    [openable],
  )

  // No images → no section, no subnav item (the page guards #gallery on the same array).
  if (!openable.length) return null

  return (
    <section
      id="gallery"
      aria-labelledby="destination-gallery-heading"
      className="w-full scroll-mt-[70px] bg-bg-page lg:scroll-mt-[110px]"
    >
      <h2 id="destination-gallery-heading" className="sr-only">
        {title || 'Gallery'}
      </h2>
      <div className="relative" data-reveal>
        <div className="grid w-full grid-cols-2 lg:grid-cols-4">
          {openable.map((img, i) => (
            <button
              key={img._key ?? i}
              type="button"
              onClick={() => openLightbox(i)}
              aria-label={`Open ${img.alt ?? 'photo'} in full screen`}
              className="group/tile relative aspect-square w-full cursor-zoom-in overflow-hidden"
            >
              {/* Hover zoom — the site-wide non-hero image treatment; duration matches TheBoat. */}
              <Image
                {...sanityImageProps(img, '/assets/placeholder-photo.svg')}
                alt={img.alt ?? ''}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/tile:scale-105"
              />
            </button>
          ))}
        </div>

        {ctaText ? (
          <button
            type="button"
            onClick={() => openLightbox(0)}
            /* px-16 was px-24 — compacted on Adinda's call 2026-07-22 ("not bad, just trying a
               polish"); if the pill reads cramped, 24 is the value to restore. */
            className="group absolute bottom-48 left-1/2 inline-flex h-48 -translate-x-1/2 items-center gap-8 rounded-full bg-bg-surface px-16 text-button-small whitespace-nowrap uppercase text-action-primary shadow-[0px_4px_10px_rgba(44,37,34,0.2)] transition-opacity duration-300 ease-in-out hover:opacity-85 lg:bottom-64"
          >
            {ctaText}
            <span
              aria-hidden="true"
              className="block size-[12px] shrink-0 bg-action-primary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] [mask-image:url('/assets/icon-arrow.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
            />
          </button>
        ) : null}
      </div>

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
