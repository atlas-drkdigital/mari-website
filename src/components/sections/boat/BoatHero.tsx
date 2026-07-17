import Image from 'next/image'

import { sanityImageProps } from '@/sanity/lib/image'
import type { BoatData } from '@/sanity/queries'

// Figma Page/Boat hero = 778:8706. Server Component — no interactivity.
//
// The meta strip renders `boat.stats` (Cabins / Guests / Boat Size / Crew), NOT Figma's
// Season / Duration / Minimum Skill Level: those are the DESTINATION page's fields, left in the
// boat frame by a copy-paste. Locked 2026-07-17 — don't "restore" them from the mockup.
//
// The SubNav (778:8712, y=708) sits inside this hero in Figma. It's rendered by the page, not
// here, because it's shared with the destination page.
export function BoatHero({ boat }: { boat: BoatData }) {
  const stats = boat.stats ?? []

  return (
    <section aria-labelledby="boat-hero-heading" className="relative flex min-h-[764px] w-full flex-col justify-center">
      <div className="absolute inset-0 -z-10">
        <Image
          {...sanityImageProps(boat.coverImage, '/assets/placeholder-photo.svg')}
          alt={boat.coverImage?.alt ?? ''}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Scrim — the hero copy sits on a photo, so contrast can't be left to the image. */}
        <div aria-hidden="true" className="absolute inset-0 bg-navy-950/45" />
      </div>

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-48 page-gutter-x pt-160 pb-96">
        <div className="flex flex-col gap-24">
          {boat.tagline ? <p className="text-eyebrow uppercase text-beige-150">{boat.tagline}</p> : null}
          <h1 id="boat-hero-heading" className="max-w-[480px] text-display-h1 text-beige-50">
            {boat.pageTitle || boat.name}
          </h1>
        </div>

        {stats.length ? (
          <dl className="flex flex-wrap gap-x-40 gap-y-16">
            {stats.map((stat) => (
              <div key={stat._key} className="flex flex-col gap-4">
                <dt className="text-body-small text-beige-150">{stat.label}</dt>
                <dd className="text-body-large text-beige-50">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {/* Figma 778:8741. Hidden entirely when no PDF is uploaded — a download button with
            nothing behind it is worse than no button. */}
        {boat.brochureUrl ? (
          <a
            href={boat.brochureUrl}
            download
            className="inline-flex w-fit items-center gap-8 border-b border-beige-50 py-4 text-button-small uppercase text-beige-50 transition-colors duration-300 ease-in-out hover:border-accent-muted hover:text-accent-muted"
          >
            Download brochure
          </a>
        ) : null}
      </div>
    </section>
  )
}
