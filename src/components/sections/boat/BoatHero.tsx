import Image from 'next/image'
import Link from 'next/link'

import { sanityImageProps } from '@/sanity/lib/image'
import type { BoatData } from '@/sanity/queries'

// Figma Page/Boat hero = 778:8706. Server Component — no interactivity.
//
// ⚠️ REBUILT 2026-07-17 after the first pass rendered wrong. The cause is worth keeping: the first
// version used INVENTED utility names (`text-beige-50`, `bg-navy-950/45`, `gap-x-40`, `py-120`).
// None of them exist in this theme, and Tailwind emits nothing for a class it doesn't know — so
// the text silently inherited dark navy on a bright photo, and the stats strip lost every gap and
// ran together as "CabinsGuestsBoat SizeCrew". Nothing errored; it just looked broken.
//   - Colours come from the SEMANTIC layer only (globals.css `@theme`). There is no `beige-*` or
//     `navy-*` utility. For text over a photo the family is `*-ondark-*` / `*-onimage-*`.
//   - The spacing scale is 0,2,4,8,12,16,20,24,32,48,64,80,96,128,160. There is NO 40 and NO 120.
// Read globals.css before adding a class here; don't pattern-match a name that "looks like" the
// palette.
//
// The meta strip renders `boat.stats` (Cabins / Guests / Boat Size / Crew), NOT Figma's
// Season / Duration / Minimum Skill Level: those are the DESTINATION page's fields, left in this
// frame by a copy-paste. Locked 2026-07-17 — the mockup's labels are wrong, the styling is right.
//
// The SubNav (778:8712) sits at the hero's bottom edge in Figma. It's step 3 and shared with the
// destination page, so it is NOT rendered here — the page composes it once it exists.
export function BoatHero({ boat }: { boat: BoatData }) {
  const stats = boat.stats ?? []

  return (
    <section
      id="boat-hero"
      aria-labelledby="boat-hero-heading"
      className="relative isolate z-10 flex min-h-dvh w-full flex-col justify-end"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          {...sanityImageProps(boat.coverImage, '/assets/placeholder-photo.svg')}
          alt={boat.coverImage?.alt ?? ''}
          fill
          priority
          // 80, not the default 75 — matches the static build's photographic-hero pass.
          // next.config.ts already allows [75, 80], but a quality Next isn't told to use is never
          // used: every image on the site currently renders q=75, which made that config inert.
          // This only helps a source image with pixels to spare; it cannot rescue an upscale.
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        {/* Same scrim recipe as the homepage hero: a left-to-right gradient, not a flat overlay.
            The copy sits left, so the photo stays readable on the right where it's uncovered. */}
        <div className="absolute inset-0 bg-linear-to-r from-background-ondark-page/78 via-background-ondark-page/40 to-transparent lg:from-background-ondark-page/70 lg:via-background-ondark-page/25" />
      </div>

      {/* data-reveal="left" — fade + slide in from the left, same as the homepage hero's content
          block. ScrollReveal (rendered by the page) adds [data-revealed]; the animation itself is
          pure CSS in globals.css, and is skipped entirely under prefers-reduced-motion. */}
      {/* Mobile bottom padding is 144px, not 96 — lifts the hero content ~48px off the bottom edge
          (Adinda, 2026-07-17: it sat too low). 144 isn't on the spacing scale (…96,128,160), so
          it's an arbitrary value rather than rounded to 128 or 160 — the ask was a specific 48px
          lift, and rounding would under- or overshoot it.
          NOTE: the homepage hero solves this differently — `justify-center` + py-32, centring the
          block in the viewport. Not copied here because this hero is bottom-anchored by design (the
          SubNav lands at its bottom edge in Figma). If the lift still reads wrong, switching mobile
          to the homepage's centred model is the next thing to try, not more padding. */}
      <div
        data-reveal="left"
        className="flex w-full flex-col gap-32 page-gutter-x pb-[144px] pt-128 lg:gap-48 lg:pb-128"
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
              <Link href="/boats" className="transition-colors duration-300 ease-in-out hover:text-text-ondark-primary">
                Boats
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            {/* Current page — a link to itself is noise, so it's plain text. */}
            <li className="text-accent-ondark-primary" aria-current="page">
              {boat.name}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-24 lg:gap-32">
          <h1 id="boat-hero-heading" className="max-w-[480px] text-display-h1 text-text-ondark-primary">
            {boat.pageTitle || boat.name}
          </h1>
          {boat.tagline ? (
            <p className="max-w-[560px] text-body-medium text-text-ondark-muted lg:text-body-large">
              {boat.tagline}
            </p>
          ) : null}
        </div>

        {stats.length ? (
          <dl className="flex flex-wrap gap-x-48 gap-y-24">
            {stats.map((stat) => (
              <div key={stat._key} className="flex flex-col gap-8">
                <dt className="text-caption-label uppercase text-accent-ondark-primary">{stat.label}</dt>
                <dd className="text-body-medium text-text-ondark-primary">{stat.value}</dd>
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
            className="group inline-flex w-fit items-center gap-16 text-text-ondark-primary transition-colors duration-300 ease-in-out hover:text-accent-ondark-primary"
          >
            <span className="grid size-[38px] shrink-0 place-items-center rounded-full border border-text-ondark-primary transition-colors duration-300 ease-in-out group-hover:border-accent-ondark-primary">
              <span
                aria-hidden="true"
                className="block size-[16px] bg-current [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
              />
            </span>
            <span className="text-button-small">Download Brochure</span>
          </a>
        ) : null}
      </div>
    </section>
  )
}
