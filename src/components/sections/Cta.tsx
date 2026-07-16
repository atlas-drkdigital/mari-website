import Image from 'next/image'

import { sanityImageProps } from '@/sanity/lib/image'
import type { CtaCardData } from '@/sanity/queries'

// Ported from ../v1-static-homepage/sections/cta.html. Figma Section/CTA 401:2438.
// Whole card (photo, heading, body, link text) is ONE <a> — not a card with a nested link,
// per Adinda's explicit "the entire image, as well as Find Out More, should be clickable."
// Content comes from the shared `cta` singleton (reused across pages); the two cards fall back to
// the original hardcoded copy/images if the singleton is empty. Background photos stay decorative
// (alt="", aria-hidden) — the text lives in the DOM alongside them.
const FALLBACK = [
  {
    heading: 'Book a private charter',
    description:
      'Charter the entire boat for a private liveaboard adventure in Indonesia. Full itinerary flexibility, exclusive use, up to 14 guests.',
    buttonText: 'Find Out More',
    imageSrc: '/assets/cta-private-charter.webp',
  },
  {
    heading: 'Join a shared diving trip',
    description: 'Join a scheduled dive cruise departure and dive Indonesia’s best waters alongside fellow divers',
    buttonText: 'Find a Trip',
    imageSrc: '/assets/cta-shared-trip.webp',
  },
]

export function Cta({ cta }: { cta: { cards?: CtaCardData[] } | null }) {
  const cards = FALLBACK.map((f, i) => {
    const c = cta?.cards?.[i]
    return {
      key: c?._key ?? f.imageSrc,
      heading: c?.heading ?? f.heading,
      description: c?.description ?? f.description,
      buttonText: c?.buttonText ?? f.buttonText,
      imageProps: sanityImageProps(c?.image, f.imageSrc),
    }
  })

  return (
    <section id="cta" aria-labelledby="cta-heading" className="w-full">
      <h2 id="cta-heading" className="sr-only">Book your Mari Liveaboard trip</h2>
      <div className="flex w-full flex-col lg:flex-row">
        {cards.map((card) => (
          <a
            key={card.key}
            href="#"
            data-reveal
            className="group/cta relative isolate flex h-[calc(50dvh-28px)] w-full flex-col justify-between overflow-hidden px-24 pb-[56px] pt-64 lg:h-[669px] lg:w-1/2 lg:px-64 lg:pb-[88px] lg:pt-96"
          >
            <Image {...card.imageProps} alt="" aria-hidden="true" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-10 object-cover transition-transform duration-700 ease-in-out group-hover/cta:scale-105" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-black/20 to-transparent" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-background-ondark-page/40" />

            <div className="flex max-w-[480px] flex-col gap-16">
              <h3 className="text-display-h2 text-text-ondark-primary">{card.heading}</h3>
              <p className="text-body-medium lg:text-body-large text-text-ondark-primary">{card.description}</p>
            </div>
            <span className="inline-flex w-fit items-center gap-4 border-b border-border-onimage-primary py-4 text-button-small uppercase text-text-ondark-primary">
              {card.buttonText}
              <span aria-hidden="true" className="block size-[16px] shrink-0 bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover/cta:translate-x-[2px] [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
