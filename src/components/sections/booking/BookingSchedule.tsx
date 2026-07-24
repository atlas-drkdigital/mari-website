import { EmbedHtml } from '@/components/EmbedHtml'

// The INSEANQ widget band of /booking (Adinda's dictation 2026-07-24): a white shadowed card
// that OVERLAPS the hero band's hairline seam via negative top margin, sitting on the lighter
// bg-bg-page (beige-50) band — one step lighter than the hero's beige-100, so the seam reads.
// Server Component shell; the embed itself mounts client-side via EmbedHtml (its <script> must
// execute — see that component's header). Empty embed → the section renders nothing at all
// ("hide what's empty").
//
// Gutters are DestinationTrips' override verbatim (160px sides on desktop instead of
// page-gutter's 80, so the widget doesn't run full content width; mobile/tablet keep 24/48).
// Card chrome mirrors DestinationTrips' card (same surface + shadow). MOBILE FULL-BLEED per the
// locked booking-embed rule: negative margins exactly cancel the wrapper's px-24, NEVER
// w-screen/100vw (vw includes the scrollbar — the past horizontal-scroll bug). md+ restores the
// gutters. The -mt values are arbitrary on purpose (no 120 on the spacing scale — don't round).
export function BookingSchedule({ embedCode }: { embedCode?: string }) {
  if (!embedCode?.trim()) return null

  return (
    <section id="booking-schedule" aria-label="Schedule and booking" className="relative w-full bg-bg-page pb-64 lg:pb-160">
      <div className="mx-auto w-full max-w-[1400px] px-24 md:px-48 lg:px-[160px]">
        <div
          data-reveal
          className="relative z-10 -mx-24 -mt-[64px] self-auto bg-bg-surface p-16 shadow-[0px_4px_10px_rgba(44,37,34,0.2)] md:mx-0 lg:-mt-[120px] lg:p-24"
        >
          <EmbedHtml html={embedCode} />
        </div>
      </div>
    </section>
  )
}
