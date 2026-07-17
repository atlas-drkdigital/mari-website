'use client'

import { useState } from 'react'
import Image from 'next/image'

import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { BoatData } from '@/sanity/queries'

// Figma Section/Boat Page/Overview = 778:8747. HighlightCard (778:8748) on the left = keyFeatures;
// copy on the right.
//
// "Read More" (778:8757) is a TRUNCATE/EXPAND on the same body text — NOT a link to another page.
// That's why this is a Client Component: the expand is real state. Locked 2026-07-17.
//
// `eyebrow` + `keyFeaturesHeading` arrive already token-resolved from the page — do not resolve
// here, or the {boat} substitution lands in two places and drifts.
export function BoatOverview({
  boat,
  eyebrow,
  keyFeaturesHeading,
}: {
  boat: BoatData
  eyebrow?: string
  keyFeaturesHeading?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const keyFeatures = boat.keyFeatures ?? []
  const hasBody = Boolean(boat.overviewBody?.length)

  return (
    <section id="overview" aria-labelledby="boat-overview-heading" className="w-full bg-bg-page py-120">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-64 page-gutter-x lg:flex-row lg:gap-80">
        {/* Key features card — hides when there's nothing to list, rather than rendering an
            empty bordered box. */}
        {keyFeatures.length ? (
          <div data-reveal className="relative flex w-full flex-col justify-end overflow-hidden lg:w-[480px] lg:shrink-0">
            <Image
              {...sanityImageProps(boat.keyFeaturesImage, '/assets/placeholder-photo.svg')}
              alt={boat.keyFeaturesImage?.alt ?? ''}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-navy-950/50" />
            <div className="relative flex flex-col gap-24 p-40">
              {keyFeaturesHeading ? (
                <h3 className="text-display-h3 text-beige-50">{keyFeaturesHeading}</h3>
              ) : null}
              <ul className="flex flex-col gap-16">
                {keyFeatures.map((feature) => (
                  <li key={feature} className="text-body-large text-beige-50">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="flex flex-1 flex-col gap-24" data-reveal="left">
          {eyebrow ? <p className="text-eyebrow uppercase text-text-eyebrow">{eyebrow}</p> : null}
          {boat.overviewHeading ? (
            <h2 id="boat-overview-heading" className="text-display-h2 text-text-primary">
              {boat.overviewHeading}
            </h2>
          ) : null}

          {hasBody ? (
            <>
              {/* Collapsed height is a line-clamp, not a hidden block: the full text stays in the
                  DOM so it's always crawlable and findable via in-page search, expanded or not. */}
              <div
                id="boat-overview-body"
                className={`flex flex-col gap-16 text-body-large text-text-primary ${
                  expanded ? '' : 'line-clamp-6'
                }`}
              >
                <RichText value={boat.overviewBody!} />
              </div>
              <button
                type="button"
                onClick={() => setExpanded((open) => !open)}
                aria-expanded={expanded}
                aria-controls="boat-overview-body"
                className="inline-flex w-fit items-center gap-4 border-b border-action-primary py-4 text-button-small uppercase text-action-primary transition-colors duration-300 ease-in-out hover:border-accent-muted hover:text-accent-muted"
              >
                {expanded ? 'Read less' : 'Read more'}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
