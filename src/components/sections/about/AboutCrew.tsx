'use client'

import Image from 'next/image'
import { useState } from 'react'

import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { AboutPageData } from '@/sanity/queries'

// Crew section — NEW build for the About page (spec: _PAGE-SPECS.md #1 + aboutPage.ts's field
// notes: circular portraits, 4 per row, click opens the bio, section disappears while the list is
// empty). No mockup exists — layout PROPOSED within conventions, shown to Adinda before polishing.
//
// Interaction: each portrait is a real <button> toggling that member's bio in ONE panel below the
// grid (per-cell expansion would ragged the 4-up rows). Buttons get first-tap activation on iOS —
// the pointerup rule exists for hover-reactive NON-interactive elements (DestinationItineraries'
// articles); the site's accordions (FaqAccordionItem) already ride button+onClick the same way.
//
// Mobile: 2-up grid, first 4 members shown, the rest behind the "View More" reveal (the
// crewViewMoreText field). Desktop shows everyone — rows of 4.
const MOBILE_VISIBLE = 4

export function AboutCrew({ about }: { about: AboutPageData }) {
  const members = (about.crewMembers ?? []).filter(Boolean)
  const [openId, setOpenId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  // Below the hooks — an early return above them changes hook order (the locked guard pattern).
  if (members.length === 0) return null

  const open = members.find((m) => m._id === openId) ?? null

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
          {members.map((member, i) => {
            const isOpen = member._id === openId
            return (
              <li
                key={member._id}
                className={`${i >= MOBILE_VISIBLE && !showAll ? 'hidden lg:block' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : member._id)}
                  aria-expanded={isOpen}
                  aria-controls="crew-bio"
                  className="group flex w-full flex-col items-center gap-16 text-center"
                >
                  {/* Circular portrait — ring lights up on the open member, and on hover with the
                      same treatment (the accordion hover rule: hover = the active look's colors). */}
                  <span
                    className={`block aspect-square w-full max-w-[200px] overflow-hidden rounded-full border-2 transition-colors duration-300 ease-in-out ${isOpen ? 'border-action-primary' : 'border-border-default group-hover:border-action-primary'}`}
                  >
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
                      <span className="text-caption-label uppercase text-text-secondary">
                        {member.position}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* ONE bio panel under the grid (not per-cell) — keeps the portrait rows even. */}
        <div id="crew-bio" aria-live="polite" className="w-full">
          {open?.bio ? (
            <div className="mx-auto flex max-w-[720px] flex-col gap-8 border-l-2 border-action-primary bg-bg-surface px-24 py-20 text-left lg:px-32 lg:py-24">
              <p className="text-body-large font-bold text-text-primary">
                {open.name}
                {open.position ? (
                  <span className="ml-8 text-caption-label font-normal uppercase text-text-secondary">
                    {open.position}
                  </span>
                ) : null}
              </p>
              <p className="text-body-medium text-text-primary">{open.bio}</p>
            </div>
          ) : null}
        </div>

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
    </section>
  )
}
