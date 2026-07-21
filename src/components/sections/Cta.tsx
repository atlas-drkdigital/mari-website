import Image from 'next/image'

import { resolveLink } from '@/lib/links'
import { sanityImageProps } from '@/sanity/lib/image'
import type { CtaCardData } from '@/sanity/queries'

// Ported from ../v1-static-homepage/sections/cta.html. Figma Section/CTA 401:2438.
// Whole card (photo, heading, body, link text) is ONE <a> — not a card with a nested link,
// per Adinda's explicit "the entire image, as well as Find Out More, should be clickable."
// Content comes from the shared `cta` singleton (reused across pages) — no hardcoded fallback
// (full-wire slice, 2026-07-16). Background photos stay decorative (alt="", aria-hidden) — the
// text lives in the DOM alongside them.
export function Cta({ cta }: { cta: { cards?: CtaCardData[] } | null }) {
  const cards = (cta?.cards ?? []).map((c) => ({
    key: c._key,
    heading: c.heading ?? '',
    description: c.description ?? '',
    buttonText: c.buttonText ?? '',
    // The editor's `buttonLink` (objects/link.ts), resolved to a real href. Until it's set the card
    // links nowhere — a `#` placeholder is honest here (the control now works; it just needs a value)
    // and is far better than the old HARDCODED `href="#"` that ignored the field entirely.
    link: resolveLink(c.buttonLink),
    imageProps: sanityImageProps(c.image, '/assets/cta-private-charter.webp'),
  }))

  if (cards.length === 0) return null

  return (
    <section id="cta" aria-labelledby="cta-heading" className="w-full">
      <h2 id="cta-heading" className="sr-only">Book your Mari Liveaboard trip</h2>
      <div className="flex w-full flex-col lg:flex-row">
        {cards.map((card) => (
          <a
            key={card.key}
            href={card.link?.href ?? '#'}
            {...(card.link?.newTab ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
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
