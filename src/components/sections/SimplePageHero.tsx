import Link from 'next/link'

// Shared hero for the generic "simple page" shape (/[slug] — Terms & Conditions is the first
// consumer, Onboard Prices is next). Adinda's dictation 2026-07-24, modelled on the ORIGINAL
// booking-page light-band pattern (the one /booking wore for a day before it moved to a photo
// hero); her reference was the live site's own T&C page.
//
// LIGHT BAND, no image. Deliberately NOT a photo hero, and deliberately NOT the texture band
// either: flat colour, no texture, no bottom hairline (Adinda: the seam is the white card
// overlapping it — a hairline underneath would read as leftover chrome, same call as BookingHero).
// Server Component — no interactivity.
//
// 🟡 BACKGROUND IS A STAND-IN, FLAG AT QA. Adinda asked for "beige 250". `bg-bg-accent`
// (beige-150 #f5f0e8) is used instead because there is NO semantic background token on beige-250:
// the primitive `--beige-250: #e4d8c4` DOES exist in globals.css (it backs
// --color-text-ondark-linkhover) but primitives live in `:root`, NOT in `@theme`, so no
// `bg-beige-250` utility is emitted and inventing one renders NOTHING (the class-must-exist rule).
// bg-bg-accent is the deepest light background the semantic layer actually exposes. If she wants
// the deeper tone at QA, the fix is a new semantic token in @theme, not a primitive class.
//
// TYPE: H1 is the LOCKED booking split — text-editorial-h1 on mobile, text-display-h1 from lg.
// Same per-breakpoint ramp mix BookingHero carries (see its header for why); don't unify it.
// Breadcrumb markup is BookingHero's verbatim, re-themed to the LIGHT palette: base
// text-text-secondary → hover text-text-primary, current page text-action-primary.
//
// RHYTHM (Adinda's explicit ask): roughly EQUAL visual space above and below the hero content
// block — nav-bottom → content, and content → the top edge of the overlapping body card. The
// paddings are computed against the two known constants rather than eyeballed:
//   desktop  nav ≈ 110px tall, pt-[190px] → 80px clear;  pb-[176px] − card lg:-mt-96 → 80px clear.
//   mobile   nav ≈  56px tall, pt-[112px] → 56px clear;  pb-[104px] − card    -mt-48 → 56px clear.
// So the two gaps match by construction. If either the nav height or SimplePageBody's negative
// margin changes, these numbers must be recomputed — that coupling is the reason it is spelled
// out here. Every value is arbitrary on purpose: the spacing scale has no steps between 96 and
// 128/160, and rounding to a scale step is exactly the drift bug the conventions rule warns about.
export function SimplePageHero({
  title,
  breadcrumbTitle,
  headingId = 'simple-page-heading',
}: {
  title?: string
  /** Last crumb — the seo.breadcrumbTitle override when set, else the page title. */
  breadcrumbTitle?: string
  headingId?: string
}) {
  if (!title) return null

  return (
    <section
      id="page-hero"
      aria-labelledby={headingId}
      className="relative w-full bg-bg-accent"
    >
      <div
        data-reveal
        className="flex w-full flex-col items-center gap-16 page-gutter-x pb-[104px] pt-[112px] text-center lg:pb-[176px] lg:pt-[190px]"
      >
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center justify-center gap-8 text-caption-label uppercase text-text-secondary">
            <li>
              <Link href="/" className="transition-colors duration-300 ease-in-out hover:text-text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-action-primary" aria-current="page">
              {breadcrumbTitle || title}
            </li>
          </ol>
        </nav>

        <h1 id={headingId} className="max-w-[720px] text-editorial-h1 text-text-primary lg:text-display-h1">
          {title}
        </h1>
      </div>
    </section>
  )
}
