import Image from 'next/image'
import Link from 'next/link'

import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { ScheduleRatesData } from '@/sanity/queries'

// Schedule & Rates (/booking) hero — PHOTO hero per Adinda's QA round 1 (2026-07-24). The
// light-texture band this shipped with lasted exactly one day; her call on the real render was a
// full-bleed photo hero using the ChartersHero background recipe (image fill + the FLAT 60%
// full-cover overlay). Server Component — no interactivity.
//
// Deltas vs ChartersHero, all deliberate:
//   - NOT min-h-dvh. This is a title band, not a full-viewport hero — roughly a 45–50dvh feel,
//     content vertically centered in it (Adinda's mobile QA: the band must stay proportionate).
//     The paddings below are the real height driver; the min-h is a floor for short content.
//   - NO bottom gradient band. That exists for SubNav legibility on the other heroes; this page
//     has no SubNav, and the photo edge itself is now the seam the widget card overlaps
//     (BookingSchedule's -mt-[64px] / lg:-mt-[120px]). The old hairline div is gone with it —
//     Adinda: "we can get rid of that bottom border."
//   - H1 is text-editorial-h1, NOT text-display-h1 — deliberate ramp override, Adinda 2026-07-24:
//     display-h1 read too big on this title-only hero; editorial-h1 is her explicit pick. This
//     contradicts the display-anchors-sections default on purpose — don't "fix" it back.
//
// Padding: top clears the FIXED overlaid nav (~110px desktop full nav, ~56px mobile bar); bottom
// leaves room for the widget card overlapping the hero's bottom edge. Desktop top is 176px —
// was 224px, moved the content up 48px at QA round 1 (Adinda). All arbitrary values — the
// spacing scale has no steps in this class, and rounding to scale is the drift bug.
//
// Breadcrumb markup is ChartersHero's verbatim (ondark family).
export function BookingHero({ schedule }: { schedule: ScheduleRatesData }) {
  return (
    <section
      id="booking-hero"
      aria-labelledby="booking-hero-heading"
      className="relative isolate flex min-h-[45dvh] w-full flex-col items-center justify-center lg:min-h-[50dvh]"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          {...sanityImageProps(schedule.heroImage, '/assets/placeholder-photo.svg')}
          alt={schedule.heroImage?.alt ?? ''}
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        {/* Flat full-cover overlay — started at ChartersHero's 60%, eased to 50% at QA round 2
            (Adinda, 2026-07-24: "opacity can slightly be reduced" — the pink-beach photo is
            bright enough to carry a lighter scrim; contrast re-checked against the ondark text). */}
        <div className="absolute inset-0 bg-background-ondark-page/50" />
      </div>

      <div
        data-reveal
        /* Mobile pt 112→96 / pb 104→120 (QA round 2, Adinda): content sits 16px higher WITHOUT
           changing the band's height — the 216px padding total is preserved, only redistributed. */
        className="flex w-full flex-col items-center gap-24 page-gutter-x pb-[120px] pt-[96px] text-center lg:gap-32 lg:pb-[200px] lg:pt-[176px]"
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
                {schedule.seo?.breadcrumbTitle || schedule.title || 'Schedule & Rates'}
              </li>
            </ol>
          </nav>

          {schedule.title ? (
            // editorial-h1 on purpose — see the ramp-override note in the header.
            <h1 id="booking-hero-heading" className="max-w-[720px] text-editorial-h1 text-text-ondark-primary">
              {schedule.title}
            </h1>
          ) : null}
        </div>

        {schedule.description?.length ? (
          // Paragraph-spacing rule: the WRAPPER owns the gap (body-medium → gap-12, stepping to
          // body-large → gap-16 with the responsive type step).
          <div className="flex max-w-[720px] flex-col gap-12 text-body-medium text-text-ondark-primary lg:gap-16 lg:text-body-large">
            <RichText value={schedule.description} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
