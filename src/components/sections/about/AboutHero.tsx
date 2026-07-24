import Image from 'next/image'
import Link from 'next/link'

import { HeroVideo } from '@/components/HeroVideo'
import { sanityImageProps } from '@/sanity/lib/image'
import type { AboutPageData } from '@/sanity/queries'

// About hero (spec: _PAGE-SPECS.md #1, Adinda 2026-07-23) — "IDENTICAL to the Private Charters
// hero in structure, but NO Download Brochure", and no SubNav either (schema-note lock, same day).
// Deliberately a sibling COPY of ChartersHero, not a shared abstraction — this is now the FOURTH
// hero repeating the shape, further past the componentization threshold ChartersHero's header
// already flags; extraction stays parked for the componentization pass, not done mid-slice.
// All expression decisions (flat 60% overlay, bottom scrim band, two-line H1 with the load-bearing
// trailing space, 480px heading cap, mobile-white/desktop-muted subheading) are inherited from
// ChartersHero verbatim — read that file's header for their history; not re-argued here.
export function AboutHero({ about }: { about: AboutPageData }) {
  return (
    <section
      id="about-hero"
      aria-labelledby="about-hero-heading"
      className="relative isolate z-10 flex min-h-dvh w-full flex-col items-center justify-center"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          {...sanityImageProps(about.heroImage, '/assets/placeholder-photo.svg')}
          alt={about.heroImage?.alt ?? ''}
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        <HeroVideo url={about.heroVideo?.url} playOnMobile={about.heroVideo?.playOnMobile} />
        <div className="absolute inset-0 bg-background-ondark-page/60" />
        <div className="absolute inset-x-0 bottom-0 h-[160px] bg-gradient-to-t from-background-ondark-page/70 to-transparent" />
      </div>

      {/* No SubNav on this page, so the bottom padding is symmetric-ish rather than clearing a
          rail (charters reserves pb for its pinned SubNav). */}
      <div
        data-reveal
        className="flex w-full flex-col items-center gap-32 page-gutter-x pb-64 pt-[96px] text-center lg:pb-96 lg:pt-[128px]"
      >
        <div className="flex flex-col items-center gap-16">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center justify-center gap-8 text-caption-label uppercase text-text-ondark-muted">
              <li>
                <Link href="/" className="transition-colors duration-300 ease-in-out hover:text-text-ondark-primary">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-accent-ondark-primary" aria-current="page">
                {about.seo?.breadcrumbTitle || about.name}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col items-center gap-20">
            {/* WIDTH EXCEPTION vs ChartersHero's 480 cap (Adinda, 2026-07-23 QA: "more breathing
                room, something wider") — 800px so the intro line "The Story of Mari: Built from
                Tradition." holds ONE line at the sized-up 44px. Subheading widened to match. */}
            <h1 id="about-hero-heading" className="max-w-[800px] text-text-ondark-primary">
              {about.heroHeadingIntro ? (
                // Trailing {' '} is LOAD-BEARING — see ChartersHero (crawled h1 text would run the
                // display:block lines together without it). 44px is a step up from the charters
                // hero's 36px intro (her "size it up" call) — still no ramp entry, arbitrary value.
                <span className="block text-[26px] font-extralight leading-[1.2] tracking-[-1.5px] lg:text-[44px] lg:tracking-[-2px]">
                  {about.heroHeadingIntro}{' '}
                </span>
              ) : null}
              {about.heroHeadingMain ? (
                <span className="block text-display-h1">{about.heroHeadingMain}</span>
              ) : null}
            </h1>
            {about.heroSubheading ? (
              <p className="max-w-[440px] text-body-medium text-text-ondark-primary lg:max-w-[560px] lg:text-body-large lg:text-text-ondark-muted">
                {about.heroSubheading}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Scroll-down circle — the homepage Hero's indicator, brought here because this hero has
          no SubNav rail (Adinda, 2026-07-23). CENTERED on all breakpoints (her call — homepage
          left-aligns it at lg). A plain anchor, not the homepage's JS button: this is a Server
          Component, and html's motion-safe:scroll-smooth + PageOverview's scroll-mt give the
          identical smooth scroll + nav offset natively. */}
      <a
        href="#overview"
        aria-label="Scroll to next section"
        className="group absolute bottom-32 left-1/2 grid size-[36px] -translate-x-1/2 place-items-center rounded-full border border-bg-surface text-text-ondark-primary transition-colors duration-300 ease-in-out hover:bg-text-ondark-primary/10 lg:bottom-48 lg:size-[52px]"
      >
        <span
          aria-hidden="true"
          className="block size-[16px] bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover:scale-105 [mask-image:url('/assets/icon-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
        />
      </a>
    </section>
  )
}
