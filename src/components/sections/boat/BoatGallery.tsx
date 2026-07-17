'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'

import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { BoatData, GalleryImageData, GalleryTabData } from '@/sanity/queries'

// Figma Section/Boat Page/Amenities = 778:8845 — but the section is called GALLERY everywhere in
// our code and in the rendered heading. Figma is the stale side; our code supersedes it (Adinda,
// 2026-07-17). See boat.ts's header comment. Do not "fix" this toward the mockup.
//
// ⚠️ THE ONE TRAP, locked 2026-07-17 — one array, TWO different reads:
//   - each TAB's carousel shows ONLY that category's images (filter on `categories`)
//   - the LIGHTBOX shows ALL images combined, ignoring the tab
// Feeding the carousel the unfiltered array is the bug that LOOKS correct: tab one usually renders
// plausibly because its images happen to sort first. It must be checked on a LATER tab, not the
// first. `visible` and `all` below are deliberately separate for exactly this reason — if you find
// yourself passing `all` to the carousel, that's the bug.
export function BoatGallery({
  boat,
  eyebrow,
  heading,
}: {
  boat: BoatData
  eyebrow?: string
  heading?: string
}) {
  const tabs: GalleryTabData[] = boat.galleryTabs ?? []
  const all: GalleryImageData[] = useMemo(() => boat.gallery ?? [], [boat.gallery])

  const [activeCategory, setActiveCategory] = useState<string | undefined>(tabs[0]?.category)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const activeTab = tabs.find((tab) => tab.category === activeCategory)

  // THE CAROUSEL'S read: this tab's category only.
  const visible = useMemo(
    () => all.filter((img) => (img.categories ?? []).includes(activeCategory ?? '')),
    [all, activeCategory],
  )

  // Section hides entirely when there's nothing to show — auto-hide guard, same convention as the
  // homepage sections. Tabs with no images still render as tabs (an editor should see the tab
  // exists and is empty); the whole section going away is different from one empty tab.
  if (!all.length && !tabs.length) return null

  const lightboxImage = lightboxIndex === null ? null : all[lightboxIndex]

  return (
    <section id="gallery" aria-labelledby="boat-gallery-heading" className="w-full bg-bg-page py-96">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-48 page-gutter-x lg:flex-row lg:gap-64">
        <div className="flex w-full flex-col gap-32 lg:w-[423px] lg:shrink-0">
          <div className="flex flex-col gap-24">
            {eyebrow ? <p className="text-eyebrow uppercase text-text-eyebrow">{eyebrow}</p> : null}
            {heading ? (
              <h2 id="boat-gallery-heading" className="text-display-h2 text-text-primary">
                {heading}
              </h2>
            ) : null}
            {boat.galleryDescription?.length ? (
              <div className="flex flex-col gap-16 text-body-large text-text-primary">
                <RichText value={boat.galleryDescription} />
              </div>
            ) : null}
          </div>

          {tabs.length ? (
            <div role="tablist" aria-label="Gallery categories" className="flex flex-wrap gap-16">
              {tabs.map((tab) => {
                const selected = tab.category === activeCategory
                return (
                  <button
                    key={tab._key}
                    role="tab"
                    type="button"
                    id={`gallery-tab-${tab._key}`}
                    aria-selected={selected}
                    aria-controls={`gallery-panel-${tab._key}`}
                    onClick={() => setActiveCategory(tab.category)}
                    className={`border-b py-4 text-button-small uppercase transition-colors duration-300 ease-in-out ${
                      selected
                        ? 'border-action-primary text-action-primary'
                        : 'border-transparent text-text-secondary hover:text-action-primary'
                    }`}
                  >
                    {tab.category}
                  </button>
                )
              })}
            </div>
          ) : null}

          {activeTab ? (
            <div
              role="tabpanel"
              id={`gallery-panel-${activeTab._key}`}
              aria-labelledby={`gallery-tab-${activeTab._key}`}
              className="flex flex-col gap-16"
            >
              {activeTab.heading ? (
                <h3 className="text-display-h3 text-text-primary">{activeTab.heading}</h3>
              ) : null}
              {activeTab.body?.length ? (
                <div className="flex flex-col gap-16 text-body-large text-text-primary">
                  <RichText value={activeTab.body} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-16">
          {visible.length ? (
            <ul className="flex snap-x snap-mandatory gap-16 overflow-x-auto">
              {visible.map((img) => {
                // Index into `all`, not `visible` — the lightbox browses the whole gallery, so it
                // needs the image's position in the combined array, not in this tab's slice.
                const indexInAll = all.indexOf(img)
                return (
                  <li key={img._key} className="w-full shrink-0 snap-start">
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(indexInAll)}
                      className="relative block aspect-[708/532] w-full overflow-hidden"
                    >
                      <Image
                        {...sanityImageProps(img, '/assets/placeholder-photo.svg')}
                        alt={img.alt ?? ''}
                        fill
                        sizes="(min-width: 1024px) 55vw, 100vw"
                        className="object-cover"
                      />
                      {img.caption ? (
                        <span className="absolute inset-x-0 bottom-0 bg-navy-950/60 p-16 text-left text-body-small text-beige-50">
                          {img.caption}
                        </span>
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            // An empty tab says so, rather than collapsing to nothing — otherwise an editor can't
            // tell "no images tagged for this tab" from "the tab is broken".
            <div className="flex aspect-[708/532] w-full items-center justify-center bg-beige-150">
              <p className="text-body-small text-text-secondary">No photos in this category yet</p>
            </div>
          )}
        </div>
      </div>

      {/* THE LIGHTBOX'S read: every image, combined, ignoring the active tab. */}
      {lightboxImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-16 bg-navy-950/90 p-24"
        >
          <div className="relative aspect-[3/2] w-full max-w-[1100px]">
            <Image
              {...sanityImageProps(lightboxImage, '/assets/placeholder-photo.svg')}
              alt={lightboxImage.alt ?? ''}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <p className="text-body-small text-beige-150">
            {lightboxIndex! + 1} / {all.length}
            {lightboxImage.caption ? ` — ${lightboxImage.caption}` : ''}
          </p>
          <div className="flex gap-16">
            <button
              type="button"
              onClick={() => setLightboxIndex((i) => (i! - 1 + all.length) % all.length)}
              className="text-button-small uppercase text-beige-50 hover:text-accent-muted"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="text-button-small uppercase text-beige-50 hover:text-accent-muted"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => setLightboxIndex((i) => (i! + 1) % all.length)}
              className="text-button-small uppercase text-beige-50 hover:text-accent-muted"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
