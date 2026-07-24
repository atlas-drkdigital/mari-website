import Image from 'next/image'
import Link from 'next/link'

import { HeroVideo } from '@/components/HeroVideo'
import { sanityImageProps } from '@/sanity/lib/image'
import type { DestinationData } from '@/sanity/queries'

// Figma Page/Destination hero = 778:8612. Server Component — no interactivity.
//
// Deliberately a sibling COPY of BoatHero (2026-07-22), not a shared abstraction: the two heroes
// differ in breadcrumb trail, content widths, and the boat's brochure CTA (absent here). Per the
// just-in-time componentization lock (2026-07-21), a shared PageHero is extracted only if a THIRD
// hero repeats the shape — two instances aren't enough evidence for the right parameter seams.
// Everything else (scrim recipe, ondark families, reveal, stats strip) matches BoatHero verbatim —
// read its header comments for the reasoning behind each; they are not repeated here.
//
// Width deltas vs BoatHero, both from the node (conventions govern tokens/spacing, Figma governs
// structure): H1 max-w-[560px] (boat: 480), subheadline max-w-[480px] (boat: 560).
export function DestinationHero({ destination }: { destination: DestinationData }) {
  const stats = destination.stats ?? []

  return (
    <section
      id="destination-hero"
      aria-labelledby="destination-hero-heading"
      className="relative isolate z-10 flex min-h-dvh w-full flex-col justify-center lg:justify-end"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          {...sanityImageProps(destination.coverImage, '/assets/placeholder-photo.svg')}
          alt={destination.coverImage?.alt ?? ''}
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        <HeroVideo url={destination.coverVideo?.url} playOnMobile={destination.coverVideo?.playOnMobile} />
        <div className="absolute inset-0 bg-linear-to-r from-background-ondark-page/78 via-background-ondark-page/40 to-transparent lg:from-background-ondark-page/70 lg:via-background-ondark-page/25" />
        <div className="absolute inset-x-0 bottom-0 h-[160px] bg-gradient-to-t from-background-ondark-page/70 to-transparent" />
      </div>

      <div
        data-reveal="left"
        className="flex w-full translate-y-[40px] flex-col gap-32 page-gutter-x py-32 lg:translate-y-0 lg:gap-48 lg:pb-128 lg:pt-128"
      >
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-8 text-caption-label uppercase text-text-ondark-muted">
            <li>
              <Link href="/" className="transition-colors duration-300 ease-in-out hover:text-text-ondark-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/destinations" className="transition-colors duration-300 ease-in-out hover:text-text-ondark-primary">
                Destinations
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-accent-ondark-primary" aria-current="page">
              {destination.seo?.breadcrumbTitle || destination.name}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-24 lg:gap-32">
          <h1 id="destination-hero-heading" className="max-w-[560px] text-display-h1 text-text-ondark-primary">
            {destination.pageTitle || destination.name}
          </h1>
          {destination.tagline ? (
            // Full-opacity white on MOBILE, muted on desktop (Adinda, 2026-07-22, site-wide hero
            // rule — see Hero.tsx).
            <p className="max-w-[480px] text-body-medium text-text-ondark-primary lg:text-body-large lg:text-text-ondark-muted">
              {destination.tagline}
            </p>
          ) : null}
        </div>

        {stats.length ? (
          <dl className="flex max-w-full flex-nowrap gap-24 overflow-x-auto scrollbar-hidden lg:flex-wrap lg:gap-x-48 lg:gap-y-24 lg:overflow-visible">
            {stats.map((stat) => (
              <div key={stat._key} className="flex shrink-0 flex-col gap-8">
                <dt className="text-caption-label uppercase text-accent-ondark-primary">{stat.label}</dt>
                <dd className="text-body-medium text-text-ondark-primary">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  )
}
