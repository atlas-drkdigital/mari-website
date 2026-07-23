'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { CarouselChevron } from '@/components/CarouselChevron'
import { RichText } from '@/components/RichText'
import { sanityImageProps, urlForImage } from '@/sanity/lib/image'
import type { AboutPageData, CrewMemberData } from '@/sanity/queries'

// Crew section — About page (spec: _PAGE-SPECS.md #1 + aboutPage.ts's field notes: circular
// portraits, 4 per row, click opens the bio, section disappears while the list is empty). No
// mockup — layout proposed within conventions, iterated with Adinda per-QA-round.
//
// Bio = a centered MODAL (Adinda, QA round 1: the below-grid panel "looks wrong. It needs to be a
// lightbox that appears in the middle with an X button… an overlay ON the image, not a pure
// lightbox"): the member's photo as the card, name/role/bio overlaid on a bottom gradient band —
// the SiteLightbox caption treatment — on the site's lightbox scrim (92% + blur). Hand-rolled, not
// YARL: this is one bio card, not an image-slide gallery, and pulling the YARL boundary in for it
// would load ~40KB of gallery chrome for a dialog.
//
// Portrait buttons are real <button>s — first-tap activation on iOS; the pointerup rule is for
// hover-reactive NON-interactive elements (see DestinationItineraries).
const MOBILE_VISIBLE = 4

export function AboutCrew({ about }: { about: AboutPageData }) {
  const members = (about.crewMembers ?? []).filter(Boolean)
  // Index-based (was _id-based) since the modal became a carousel (Adinda, QA round 2):
  // prev/next just steps the index, wrapping at the ends.
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  const open = openIdx !== null ? (members[openIdx] ?? null) : null
  const memberCount = members.length

  // Esc closes, arrow keys step the carousel, body scroll locks while the modal is open
  // (the standard dialog contract).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIdx(null)
      if (memberCount > 1 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        const delta = e.key === 'ArrowLeft' ? -1 : 1
        setOpenIdx((i) => (i === null ? i : (i + delta + memberCount) % memberCount))
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, memberCount])

  // Below the hooks — an early return above them changes hook order (the locked guard pattern).
  if (members.length === 0) return null

  return (
    <section
      id="crew"
      aria-labelledby="crew-heading"
      className="relative isolate w-full scroll-mt-[70px] bg-bg-page pt-64 pb-80 lg:scroll-mt-[110px] lg:pt-160 lg:pb-160"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-[36px] page-gutter-x lg:gap-64">
        <div data-reveal className="flex flex-col items-center gap-24 text-center lg:gap-32">
          {about.crewEyebrow ? (
            <p className="text-eyebrow uppercase text-action-primary">{about.crewEyebrow}</p>
          ) : null}
          {about.crewHeading ? (
            <h2 id="crew-heading" className="max-w-[720px] text-display-h2 text-text-primary lg:max-w-[800px]">
              {about.crewHeading}
            </h2>
          ) : null}
          {about.crewIntro?.length ? (
            <div className="flex max-w-[720px] flex-col gap-12 text-body-medium text-text-primary lg:max-w-[800px] lg:gap-16 lg:text-body-large">
              <RichText value={about.crewIntro} />
            </div>
          ) : null}
        </div>

        <ul data-reveal className="grid w-full grid-cols-2 gap-x-24 gap-y-32 lg:grid-cols-4 lg:gap-x-48 lg:gap-y-48">
          {members.map((member, i) => (
            <li key={member._id} className={`${i >= MOBILE_VISIBLE && !showAll ? 'hidden lg:block' : ''}`}>
              <button
                type="button"
                onClick={() => setOpenIdx(i)}
                aria-haspopup="dialog"
                className="group flex w-full flex-col items-center gap-16 text-center"
              >
                {/* Circular portrait — no border; the testimonial-card shadow instead, and the
                    site-wide image zoom on hover (Adinda, QA round 2: match the cards, zoom like
                    everywhere else — replaced the earlier border + hover-border-color treatment). */}
                <span className="block aspect-square w-full max-w-[200px] overflow-hidden rounded-full shadow-[0px_4px_10px_rgba(44,37,34,0.12)]">
                  <Image
                    {...sanityImageProps(member.photo, '/assets/placeholder-photo.svg')}
                    alt={member.photo?.alt ?? ''}
                    width={400}
                    height={400}
                    sizes="(min-width: 1024px) 200px, 45vw"
                    className="size-full object-cover transition-transform duration-[1100ms] ease-in-out group-hover:scale-105"
                  />
                </span>
                <span className="flex flex-col gap-4">
                  <span className="text-body-large font-bold text-text-primary">{member.name}</span>
                  {member.position ? (
                    <span className="text-caption-label uppercase text-action-primary">{member.position}</span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {members.length > MOBILE_VISIBLE ? (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex h-48 w-fit items-center rounded-xs bg-background-ondark-page px-20 py-8 text-button-small uppercase text-text-ondark-primary transition-opacity duration-300 ease-in-out hover:opacity-85 lg:hidden"
          >
            {showAll ? about.crewViewLessText || 'View Less' : about.crewViewMoreText || 'View More'}
          </button>
        ) : null}
      </div>

      {open && openIdx !== null ? (
        <CrewBioModal
          member={open}
          hasSiblings={memberCount > 1}
          onPrev={() => setOpenIdx((openIdx + memberCount - 1) % memberCount)}
          onNext={() => setOpenIdx((openIdx + 1) % memberCount)}
          onClose={() => setOpenIdx(null)}
        />
      ) : null}
    </section>
  )
}

function CrewBioModal({
  member,
  hasSiblings,
  onPrev,
  onNext,
  onClose,
}: {
  member: CrewMemberData
  hasSiblings: boolean
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}) {
  // Portrait at modal size through the Sanity CDN pipeline (fit max so it never upscales).
  const photoUrl = member.photo?.asset?._ref
    ? urlForImage(member.photo).width(1280).fit('max').quality(75).auto('format').url()
    : null

  // PORTALED to <body> with z-[70]: the section's `isolate` traps any z-index inside its own
  // stacking context, so however high the modal's z, the fixed z-50 nav always painted above it —
  // nav visible over the scrim, and on short viewports the opaque light nav swallowed the card's
  // X button (Adinda, QA round 2). z-[70] clears the nav (50) and the mobile menu (60). Safe to
  // touch document here: the modal only ever renders after a click, so we're client-side.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={member.name ? `About ${member.name}` : 'Crew member bio'}
      // Scrim recipe = SiteLightbox's container verbatim (92% lightbox scrim + 12px blur), so the
      // two overlays read as one system.
      className="fixed inset-0 z-[70] flex items-center justify-center p-24 lg:p-48"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-background-lightbox-scrim) 92%, transparent)',
        backdropFilter: 'blur(12px)',
      }}
      onClick={onClose}
    >
      {/* Sized up from max-w 480 (Adinda: "fill it more"); the dvh term keeps the square on
          screen on short viewports — width is the square's height. */}
      <div
        className="relative w-full max-w-[min(640px,calc(100dvh-180px))] overflow-hidden rounded-xs shadow-[0px_4px_10px_rgba(44,37,34,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* The card IS the photo, SQUARE-cropped (Adinda, QA round 2: square card + square
            portrait — easier to provide a square photo; was 3:4); the bio overlays it on the
            bottom gradient band — the SiteLightbox caption treatment, per "overlay ON the image". */}
        <div className="relative aspect-square w-full bg-background-ondark-page">
          {photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element -- CDN-sized URL built above;
               next/image adds nothing but a second optimizer pass here (the double-encode trap). */
            <img src={photoUrl} alt={member.photo?.alt ?? ''} className="absolute inset-0 size-full object-cover" />
          ) : (
            <Image src="/assets/placeholder-photo.svg" alt="" fill className="object-cover" />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[75%]"
            style={{
              background:
                'linear-gradient(to top, rgba(10,17,31,0.95) 0%, rgba(10,17,31,0.75) 40%, rgba(10,17,31,0) 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-8 p-24 lg:p-32">
            <div className="flex flex-col gap-4">
              <p className="text-body-large font-bold text-text-ondark-primary">{member.name}</p>
              {member.position ? (
                <p className="text-caption-label uppercase text-accent-ondark-primary">{member.position}</p>
              ) : null}
            </div>
            {member.bio ? <p className="text-body-medium text-text-ondark-primary">{member.bio}</p> : null}
          </div>

          {/* On-image chevron pair — THE single-image-carousel standard (the boat gallery pair,
              copied via ChartersBenefits: bare CarouselChevron + drop-shadow, inline style because
              the filter's commas/parens mangle Tailwind's parser). Adinda 2026-07-24: replaces the
              round outside arrows, which looked wrong flanking the card. */}
          {hasSiblings ? (
            <div className="pointer-events-none absolute inset-x-16 top-1/2 flex -translate-y-1/2 items-center justify-between">
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous crew member"
                style={{ filter: 'drop-shadow(0 1px 4px rgba(19, 29, 52, 0.55))' }}
                className="group pointer-events-auto flex size-[44px] items-center justify-center text-text-ondark-primary"
              >
                <CarouselChevron direction="left" sizeClassName="h-[18.19px] w-[24px] transition-transform duration-300 ease-in-out group-hover:-translate-x-[2px]" />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next crew member"
                style={{ filter: 'drop-shadow(0 1px 4px rgba(19, 29, 52, 0.55))' }}
                className="group pointer-events-auto flex size-[44px] items-center justify-center text-text-ondark-primary"
              >
                <CarouselChevron direction="right" sizeClassName="h-[18.19px] w-[24px] transition-transform duration-300 ease-in-out group-hover:translate-x-[2px]" />
              </button>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close bio"
          autoFocus
          className="absolute right-12 top-12 grid size-[38px] place-items-center rounded-full bg-background-ondark-page/60 text-text-ondark-primary transition-colors duration-300 ease-in-out hover:bg-background-ondark-page/85"
        >
          <span
            aria-hidden="true"
            className="block size-[16px] bg-current [mask-image:url('/assets/icon-close.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
          />
        </button>
      </div>
    </div>,
    document.body
  )
}
