import Image from 'next/image'
import Link from 'next/link'

import { HeroVideo } from '@/components/HeroVideo'
import { sanityImageProps } from '@/sanity/lib/image'
import type { PrivateChartersData } from '@/sanity/queries'

// Figma Page/PrivateCharters hero = 778:8911. Server Component — no interactivity.
//
// Deliberately a sibling of BoatHero/DestinationHero, not a shared abstraction — but note this IS
// the third hero repeating the shape, so the just-in-time componentization lock's threshold is now
// met: a shared PageHero is a candidate at the componentization pass (the seams are visible here:
// alignment, height, scrim recipe, breadcrumb trail, heading shape). Not extracted mid-slice.
//
// Deltas vs the other two heroes, all from the node (Figma governs structure, conventions govern
// expression):
//   - CENTERED content, not left-aligned/bottom-anchored.
//   - FULL min-h-dvh, matching the other heroes. History, kept because it reversed twice in one
//     day (2026-07-23): the brief started as "not full viewport so the next section peeks" →
//     72dvh → 78dvh → Adinda's QA verdict on the real render: "still feels very tight between the
//     content... bump up the size to match the other hero images." Full height won on sight.
//     Don't re-shrink without a fresh explicit call.
//   - FLAT overlay, not the left-to-right scrim (Adinda, 2026-07-23 + the node: a full-cover
//     rgba(18,29,52,0.6) layer — centered copy has no uncovered side to protect). The node's navy
//     #121d34 resolves to the ondark family; convention keeps the scrim in background-ondark-page
//     like every other hero, not the visually-identical navy-950 primitive.
//   - Two-line H1: a smaller extralight intro line over the display-h1 main line. The intro line
//     (Figma: 36px extralight, 1.2 leading, -2px tracking) has NO ramp entry — arbitrary values
//     per the "only when we genuinely have no name for it" rule, stepped down on mobile.
//   - Breadcrumb is Home / {name} — two levels, no collection page in between.
//   - Brochure CTA copied from BoatHero verbatim (Adinda-approved build, incl. the download-glyph
//     override and hide-when-empty rule).
export function ChartersHero({ charters }: { charters: PrivateChartersData }) {
  return (
    <section
      id="charters-hero"
      aria-labelledby="charters-hero-heading"
      className="relative isolate z-10 flex min-h-dvh w-full flex-col items-center justify-center"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          {...sanityImageProps(charters.heroImage, '/assets/placeholder-photo.svg')}
          alt={charters.heroImage?.alt ?? ''}
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        <HeroVideo url={charters.heroVideo?.url} playOnMobile={charters.heroVideo?.playOnMobile} />
        {/* Flat full-cover overlay (see header) — node 778:8914 says 60%. */}
        <div className="absolute inset-0 bg-background-ondark-page/60" />
        {/* Bottom scrim band under the SubNav, same recipe as BoatHero — the node darkens its last
            20% for the same reason. */}
        <div className="absolute inset-x-0 bottom-0 h-[160px] bg-gradient-to-t from-background-ondark-page/70 to-transparent" />
      </div>

      {/* pt clears the overlaid main nav; pb clears the SubNav rail pinned to the hero's bottom
          edge on desktop (rail ≈ 66px tall). Centered column — gaps per the node: heading block
          gap-20, block→CTA gap-32. */}
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
                {charters.seo?.breadcrumbTitle || charters.name}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col items-center gap-20">
            {/* max-w 480 = the node's own width (778:8925), reasserted by Adinda on QA (2026-07-23):
                tight on purpose so the intro line wraps to TWO lines. Was 560 (copied from the
                other heroes) — that let the intro run long and read worse. */}
            <h1 id="charters-hero-heading" className="max-w-[480px] text-text-ondark-primary">
              {charters.heroHeadingIntro ? (
                <span className="block text-[26px] font-extralight leading-[1.2] tracking-[-1.5px] lg:text-[36px] lg:tracking-[-2px]">
                  {charters.heroHeadingIntro}
                </span>
              ) : null}
              {/* Optional (Adinda, 2026-07-23) — an intro-only heading is a valid state. */}
              {charters.heroHeadingMain ? (
                <span className="block text-display-h1">{charters.heroHeadingMain}</span>
              ) : null}
            </h1>
            {charters.heroSubheading ? (
              // Full-opacity white on MOBILE, muted on desktop (site-wide hero rule — see Hero.tsx).
              <p className="max-w-[440px] text-body-medium text-text-ondark-primary lg:text-body-large lg:text-text-ondark-muted">
                {charters.heroSubheading}
              </p>
            ) : null}
          </div>
        </div>

        {charters.brochureUrl ? (
          <a
            href={charters.brochureUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex w-fit items-center gap-8 text-accent-onimage-muted transition-colors duration-300 ease-in-out hover:text-text-ondark-primary"
          >
            <span className="grid size-[38px] shrink-0 place-items-center rounded-full border border-current">
              <span
                aria-hidden="true"
                className="block size-[14px] bg-current [mask-image:url('/assets/icon-pdf.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
              />
            </span>
            <span className="flex items-center gap-4 py-4 text-body-medium font-bold">
              Download Brochure
              <span
                aria-hidden="true"
                className="block size-[16px] shrink-0 bg-current transition-transform duration-300 ease-in-out group-hover:translate-y-[2px] [mask-image:url('/assets/icon-download.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
              />
            </span>
          </a>
        ) : null}
      </div>
    </section>
  )
}
