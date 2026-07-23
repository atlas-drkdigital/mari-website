'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

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
  const [openId, setOpenId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const open = members.find((m) => m._id === openId) ?? null

  // Esc closes + body scroll locks while the modal is open (the standard dialog contract).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

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
                onClick={() => setOpenId(member._id)}
                aria-haspopup="dialog"
                className="group flex w-full flex-col items-center gap-16 text-center"
              >
                {/* Circular portrait — hover takes the active color treatment (the accordion
                    hover rule: colors only, no size/typography change). */}
                <span className="block aspect-square w-full max-w-[200px] overflow-hidden rounded-full border-2 border-border-default transition-colors duration-300 ease-in-out group-hover:border-action-primary">
                  <Image
                    {...sanityImageProps(member.photo, '/assets/placeholder-photo.svg')}
                    alt={member.photo?.alt ?? ''}
                    width={400}
                    height={400}
                    sizes="(min-width: 1024px) 200px, 45vw"
                    className="size-full object-cover"
                  />
                </span>
                <span className="flex flex-col gap-4">
                  <span className="text-body-large font-bold text-text-primary">{member.name}</span>
                  {member.position ? (
                    <span className="text-caption-label uppercase text-text-secondary">{member.position}</span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {members.length > MOBILE_VISIBLE && !showAll ? (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex h-48 w-fit items-center rounded-xs bg-background-ondark-page px-20 py-8 text-button-small uppercase text-text-ondark-primary transition-opacity duration-300 ease-in-out hover:opacity-85 lg:hidden"
          >
            {about.crewViewMoreText || 'View More'}
          </button>
        ) : null}
      </div>

      {open ? <CrewBioModal member={open} onClose={() => setOpenId(null)} /> : null}
    </section>
  )
}

function CrewBioModal({ member, onClose }: { member: CrewMemberData; onClose: () => void }) {
  // Portrait at modal size through the Sanity CDN pipeline (fit max so it never upscales).
  const photoUrl = member.photo?.asset?._ref
    ? urlForImage(member.photo).width(960).fit('max').quality(75).auto('format').url()
    : null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={member.name ? `About ${member.name}` : 'Crew member bio'}
      // Scrim recipe = SiteLightbox's container verbatim (92% lightbox scrim + 12px blur), so the
      // two overlays read as one system.
      className="fixed inset-0 z-50 flex items-center justify-center p-24 lg:p-48"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-background-lightbox-scrim) 92%, transparent)',
        backdropFilter: 'blur(12px)',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] overflow-hidden rounded-xs shadow-[0px_4px_10px_rgba(44,37,34,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* The card IS the photo, portrait-cropped; the bio overlays it on the bottom gradient
            band — the SiteLightbox caption treatment, per Adinda's "overlay ON the image". */}
        <div className="relative aspect-[3/4] w-full bg-background-ondark-page">
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
    </div>
  )
}
