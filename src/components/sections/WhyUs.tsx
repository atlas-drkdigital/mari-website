'use client'

import Image from 'next/image'
import { useState } from 'react'

import { toPlainText } from '@/components/RichText'
import { useDragScroll } from '@/lib/useDragScroll'
import { sanityImageProps } from '@/sanity/lib/image'
import type { HomePageData } from '@/sanity/queries'

// Ported from ../v1-static-homepage/sections/why-us.html + assets/why-us.js.
// Figma Home/Section/Why Us 218:1345. Desktop: 4 equal cards, hovering/focusing one expands
// it (~50%) and fades in its description; leaving the track clears the active state entirely
// (no default-active card, per Adinda's 2026-07-07 correction). Mobile: horizontal
// peek-carousel (scroll-snap + drag-to-scroll).
const CARDS = [
  {
    id: 'divers',
    title: 'Built for Divers',
    description: 'Spacious dive deck, Nitrox, 3 dedicated tenders, and experienced local dive guides.',
    image: '/assets/why-us-divers.webp',
    alt: 'Aerial view of divers in wetsuits preparing their gear on the dive deck of the Mari phinisi',
    objectPosition: '58% center',
  },
  {
    id: 'dining',
    title: 'Premium Comfort',
    description: '7 sea-view ensuite cabins, 50 sqm al fresco dining with bar and 270° sea views, sundeck, and shaded lounge deck.',
    image: '/assets/why-us-dining.webp',
    alt: "Long communal dining table set with fresh fruit and drinks in the boat's al fresco saloon",
  },
  {
    id: 'cabin',
    title: 'Exceptional Value',
    description: 'Premium amenities and personal service at a fraction of comparable liveaboard rates.',
    image: '/assets/why-us-cabin.webp',
    alt: 'Guest cabin with a made bed beside a curtained window',
  },
  {
    id: 'crew',
    title: '1:1 Crew to Guest Ratio',
    description: '14 crew for 14 guests, including a 4:1 diver-to-guide ratio, ensuring attentive service throughout.',
    image: '/assets/why-us-crew.webp',
    alt: 'Mari crew standing on the bowsprit of the phinisi under a clear blue sky',
  },
]

type WhyUsCard = {
  id: string
  title: string
  description: string
  imageProps: ReturnType<typeof sanityImageProps>
  alt: string
  objectPosition?: string
}

export function WhyUs({ home }: { home: HomePageData | null }) {
  const eyebrow = home?.whyUsEyebrow ?? 'About Us'
  const heading = home?.whyUsHeading ?? 'Why choose Mari'
  // Sanity items when present, else the original hardcoded cards.
  const cards: WhyUsCard[] = home?.whyUsItems?.length
    ? home.whyUsItems.map((item) => ({
        id: item._id,
        title: item.headline ?? '',
        description: toPlainText(item.description),
        imageProps: sanityImageProps(item.image, '/assets/why-us-cabin.webp'),
        alt: item.image?.alt ?? '',
      }))
    : CARDS.map((c) => ({ id: c.id, title: c.title, description: c.description, imageProps: { src: c.image }, alt: c.alt, objectPosition: c.objectPosition }))

  const [active, setActive] = useState<string | null>(null)
  const trackRef = useDragScroll<HTMLDivElement>()

  return (
    <section id="why-us" aria-labelledby="why-us-heading" className="relative isolate flex w-full flex-col items-center gap-[28px] bg-bg-page pt-80 pb-80 lg:gap-48 lg:pb-160">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--texture-light)] [background-size:720px_auto] bg-repeat opacity-20" />

      <div data-reveal="left" className="flex max-w-[720px] flex-col items-center gap-32 px-24 text-center">
        <p className="text-eyebrow uppercase text-action-primary">{eyebrow}</p>
        <h2 id="why-us-heading" className="text-display-h2 text-text-primary">{heading}</h2>
      </div>

      <div
        ref={trackRef}
        onMouseLeave={() => setActive(null)}
        data-reveal
        className="mx-auto flex w-full max-w-[1920px] cursor-grab snap-x snap-mandatory gap-16 overflow-x-auto px-24 pb-4 select-none [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden lg:cursor-auto lg:select-auto lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {cards.map((card) => {
          const isActive = active === card.id
          return (
            <article
              key={card.id}
              onMouseEnter={() => setActive(card.id)}
              onFocus={() => setActive(card.id)}
              className={`group/card relative aspect-[2/3] w-[84%] shrink-0 snap-center overflow-hidden [transition:flex-grow_500ms_cubic-bezier(0.65,0,0.35,1)] lg:h-[580px] lg:w-auto lg:flex-1 ${isActive ? 'lg:grow-[3]' : ''}`}
            >
              {/* Wrapper carries the "wider than the card, shifted to center" framing — next/image's
                  `fill` mode forces `width:100%;height:100%` as an INLINE style on the <img> itself,
                  which no Tailwind class (however specific) can ever override. Putting the sizing
                  classes on this wrapper instead, and letting the Image just `fill` *it*, is what
                  actually makes the effect work under next/image. */}
              <div className="absolute inset-0 lg:left-1/2 lg:w-[55vw] lg:max-w-none lg:-translate-x-1/2">
                <Image
                  {...card.imageProps}
                  alt={card.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 55vw, 84vw"
                  style={card.objectPosition ? { objectPosition: card.objectPosition } : undefined}
                  className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/card:scale-105"
                />
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background-ondark-page via-background-ondark-page/50 via-45% to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-12 p-24 lg:p-32">
                <h3 className="text-display-h4 text-text-ondark-primary">{card.title}</h3>
                <p
                  className={`text-body-medium lg:text-body-large text-text-ondark-primary lg:overflow-hidden [transition:max-height_500ms_cubic-bezier(0.65,0,0.35,1),opacity_500ms_cubic-bezier(0.65,0,0.35,1)] ${
                    isActive ? 'lg:max-h-[3.3rem] lg:opacity-100' : 'lg:max-h-0 lg:opacity-0'
                  }`}
                >
                  {card.description}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
