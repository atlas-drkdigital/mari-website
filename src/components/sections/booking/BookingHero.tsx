import Link from 'next/link'

import { RichText } from '@/components/RichText'
import type { ScheduleRatesData } from '@/sanity/queries'

// Schedule & Rates (/booking) hero — T&C-reference-screenshot pattern per Adinda's dictation
// 2026-07-24 (revising _internal/PAGE-SPECS.md #2): a LIGHT-TEXTURE band, no hero image, no
// SubNav. Server Component — no interactivity.
//
// Ground is bg-bg-accent-secondary (beige-100) — deliberately ONE STEP DEEPER than the widget
// band's bg-bg-page (beige-50) below it, so the two bands read as different surfaces across the
// hairline seam. Texture recipe verbatim from Contact.tsx/BoatSpecs.tsx (tileable pattern,
// [background-size:720px_auto], bg-repeat, opacity-20).
//
// The bottom hairline uses the SAME value as the nav's light-theme hairline
// (0_1px_0_0 rgb(0_0_0/0.06) → here a solid h-px bg-black/[0.06] line) so the seam and the
// scrolled nav's edge read as one system.
//
// Padding: top clears the FIXED overlaid nav (~110px desktop full nav, ~56px mobile bar) plus
// breathing room; bottom leaves room for the widget card that OVERLAPS this band's seam via
// negative top margin (BookingSchedule's -mt-[64px] / lg:-mt-[120px]). All arbitrary values —
// the spacing scale has no 40/120-class steps for these, and rounding to scale is the drift bug.
//
// Breadcrumb markup is ChartersHero's, restyled to the light-theme colors (text-secondary base,
// text-primary hover, action-primary current — the light-background interactive accent family).
export function BookingHero({ schedule }: { schedule: ScheduleRatesData }) {
  return (
    <section
      id="booking-hero"
      aria-labelledby="booking-hero-heading"
      className="relative isolate w-full bg-bg-accent-secondary"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--texture-light)] [background-size:720px_auto] bg-repeat opacity-20"
      />

      <div
        data-reveal
        className="flex w-full flex-col items-center gap-24 page-gutter-x pb-[104px] pt-[112px] text-center lg:gap-32 lg:pb-[200px] lg:pt-[224px]"
      >
        <div className="flex flex-col items-center gap-16">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center justify-center gap-8 text-caption-label uppercase text-text-secondary">
              <li>
                <Link href="/" className="transition-colors duration-300 ease-in-out hover:text-text-primary">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-action-primary" aria-current="page">
                {schedule.seo?.breadcrumbTitle || schedule.title || 'Schedule & Rates'}
              </li>
            </ol>
          </nav>

          {schedule.title ? (
            <h1 id="booking-hero-heading" className="max-w-[720px] text-display-h1 text-text-primary">
              {schedule.title}
            </h1>
          ) : null}
        </div>

        {schedule.description?.length ? (
          // Paragraph-spacing rule: the WRAPPER owns the gap (body-medium → gap-12, stepping to
          // body-large → gap-16 with the responsive type step).
          <div className="flex max-w-[720px] flex-col gap-12 text-body-medium text-text-primary lg:gap-16 lg:text-body-large">
            <RichText value={schedule.description} />
          </div>
        ) : null}
      </div>

      {/* Seam hairline — same 6%-black value as the nav's light hairline. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-black/[0.06]" />
    </section>
  )
}
