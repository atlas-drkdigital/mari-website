import { EmbedHtml } from '@/components/EmbedHtml'

// Figma 774:7626 (Upcoming Trips / booking widget shell). Server Component shell; the embed itself
// mounts client-side via EmbedHtml (its <script> must execute — see that component's header).
//
// This is a SHELL by design (Adinda, 2026-07-22): section chrome from Destination Defaults around
// a raw per-destination embed slot. The embed area renders whatever HTML the editor pastes —
// today a styled placeholder, later the real INSEANQ widget filtered to this destination. Empty
// embed → the page renders nothing here and drops the subnav item ("hide what's empty").
//
// Background: LIGHT TEXTURE over bg-page, NOT the mock's plain white — Adinda's explicit override
// of the Figma node, 2026-07-22 ("I want to use our light texture here"). Recipe verbatim from
// globals.css's --texture-light note: tileable pattern, bg-repeat, opacity-20.
//
// The CTA button reuses the Contact form's solid-navy button expression; it links to the Schedule
// & Rates page per the mock ("View all trips") — route not built yet, linked anyway per the
// established convention (the FAQ sections already link /faq the same way).
export function DestinationTrips({
  eyebrow,
  heading,
  intro,
  ctaText,
  embedHtml,
}: {
  eyebrow?: string
  heading?: string
  intro?: string
  ctaText?: string
  embedHtml?: string
}) {
  if (!embedHtml?.trim()) return null

  return (
    <section
      id="upcoming-trips"
      aria-labelledby="upcoming-trips-heading"
      className="relative isolate w-full scroll-mt-[70px] bg-bg-page pt-80 pb-80 lg:scroll-mt-[110px] lg:pt-160 lg:pb-160"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--texture-light)] bg-repeat opacity-20" />
      {/* Gutter override for THIS section only (Adinda, 2026-07-22, trial — "still not sure"):
          160px sides on desktop instead of page-gutter's 80, so the widget doesn't run full
          content width. Mobile/tablet keep the standard page-gutter values (24/48) — she signed
          off mobile as-is. Not page-gutter-x because a lg:px-* can't reliably override it. */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-[36px] px-24 md:px-48 lg:gap-64 lg:px-[160px]">
        <div data-reveal className="flex flex-col items-center gap-24 text-center lg:gap-32">
          <p className="text-eyebrow uppercase text-action-primary">{eyebrow}</p>
          {/* 800px cap is a one-off exception (Adinda, 2026-07-22): at 720 the templated heading
              ("Upcoming {destination} liveaboard trips") wrapped awkwardly. Desktop only. */}
          <h2 id="upcoming-trips-heading" className="max-w-[720px] text-display-h2 text-text-primary lg:max-w-[800px]">{heading}</h2>
          {intro ? <p className="max-w-[560px] text-body-medium text-text-secondary lg:text-body-large">{intro}</p> : null}
        </div>

        {/* Card chrome mirrors the Testimonials cards (same surface + shadow — Adinda's ask).
            EmbedHtml, not dangerouslySetInnerHTML: the INSEANQ embed is a loader <script>, and
            innerHTML-inserted scripts never execute — the widget silently stayed blank.
            MOBILE FULL-BLEED (Adinda, 2026-07-22: "feels very narrow"): negative margins exactly
            cancel the wrapper's px-24, NOT w-screen/100vw — vw includes the scrollbar and is the
            past horizontal-scroll bug. self-stretch (not w-full) is load-bearing: in this flex
            column a stretched item's width is container + negative margins, while w-full would
            pin it to container width and only shift it left. md+ restores the gutters. */}
        <div data-reveal className="-mx-24 self-stretch bg-bg-surface p-16 shadow-[0px_4px_10px_rgba(44,37,34,0.2)] md:mx-0 lg:p-24">
          <EmbedHtml html={embedHtml} />
        </div>

        {ctaText ? (
          <a
            href="/schedule-rates"
            className="group inline-flex h-48 w-fit items-center gap-[6px] rounded-xs bg-background-ondark-page py-8 pl-20 pr-12 text-button-small uppercase text-text-ondark-primary transition-opacity duration-300 ease-in-out hover:opacity-85"
          >
            {ctaText}
            <span aria-hidden="true" className="block size-[15px] shrink-0 bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] [mask-image:url('/assets/icon-arrow-up-right.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
          </a>
        ) : null}
      </div>
    </section>
  )
}
