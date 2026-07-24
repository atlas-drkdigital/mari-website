import type { PortableTextBlock } from 'sanity'

import { RichText } from '@/components/RichText'

// Body band for the generic "simple page" shape (/[slug]) — a white card OVERLAPPING the
// SimplePageHero band's bottom edge, holding the page's full tier-3 rich text. Adinda's dictation
// 2026-07-24; the card chrome is BookingSchedule's pattern verbatim (which is itself
// DestinationTrips'), so the three stay identical by construction:
//   - beige-100 band (`bg-bg-accent-secondary`) under a `bg-bg-surface` card
//   - shadow-[0px_4px_10px_rgba(44,37,34,0.2)]
//   - the lg:px-[160px] gutter override (160 on desktop instead of page-gutter's 80, so long-form
//     copy doesn't run the full content width), mobile/tablet keeping the standard 24/48
//   - MOBILE FULL-BLEED via `-mx-24` exactly cancelling the wrapper's px-24 — NEVER w-screen or
//     100vw (vw includes the scrollbar; that is the old horizontal-scroll bug)
//
// The negative top margin is what creates the overlap, and it is HALF of a pair: SimplePageHero's
// bottom padding is set so that (heroPb − |mt|) equals the clear space above the hero content.
// Changing -mt-48 / lg:-mt-96 breaks that rhythm — see SimplePageHero's header before touching it.
// Both values are on the spacing scale, so they are real utilities, not arbitrary.
//
// Inner padding is roomy per the reference (~100px desktop insets), stepping down on mobile where
// the card is full-bleed and 24px matches the page gutter it replaced.
//
// PARAGRAPH SPACING: the wrapper owns it (RichText blocks carry no margins). The type step is
// body-medium → body-large at lg, so the gap steps 12 → 16 with it, per the locked rule.
export function SimplePageBody({ body }: { body?: PortableTextBlock[] | null }) {
  if (!body?.length) return null

  return (
    <section id="page-body" aria-label="Page content" className="relative w-full bg-bg-accent-secondary pb-64 lg:pb-160">
      <div className="mx-auto w-full max-w-[1400px] px-24 md:px-48 lg:px-[160px]">
        <div
          data-reveal
          className="relative z-10 -mx-24 -mt-48 bg-bg-surface p-24 shadow-[0px_4px_10px_rgba(44,37,34,0.2)] md:mx-0 md:p-48 lg:-mt-96 lg:p-[100px]"
        >
          <div className="flex flex-col gap-12 text-body-medium text-text-primary lg:gap-16 lg:text-body-large">
            <RichText value={body} />
          </div>
        </div>
      </div>
    </section>
  )
}
