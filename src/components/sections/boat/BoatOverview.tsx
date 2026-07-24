'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { BoatData } from '@/sanity/queries'

// Figma Section/Overview = 778:8747. Built from the node's actual spec, not from its name.
//
// Exact values taken from Figma (arbitrary values where our spacing scale has no step — the scale
// is 0,2,4,8,12,16,20,24,32,48,64,80,96,128,160, so 40/120 must be written as [40px]/[120px]
// rather than rounded, or the layout drifts from the mockup):
//   section        px-160 (= page-gutter-x) · py-[120px] · gap-[80px] · items-start
//   left col       w-[480px] · gap-[40px]
//   image          aspect-[485/387.2]
//   features block px-[8px] · gap-16 · list gap-16 · item gap-12
//   bullet         "✦" 18px, action-primary, pt-[4px]  ← a CHARACTER, not an icon asset
//   "Key features" Editorial/H3 = text-editorial-h3 (23px/1.35)
//   right col      pl-24 · pr-48 · pt-64 · gap-24
//   eyebrow        Eyebrow 11px/1.375 tracking, uppercase, ACTION-PRIMARY (not text-eyebrow)
//   h2 -> body     gap-[48px];  body -> Read More  gap-32
//   body           Body/Large 16px/1.8
//   Read More      Button/Small 12px, action-primary, + 14px chevron
//
// "Read More" (778:8757) is a truncate/expand on the same body text, not a link — hence a Client
// Component.
//
// `eyebrow` + `keyFeaturesHeading` arrive already token-resolved from the page; don't resolve here
// or the {boat} substitution lands in two places and drifts.
export function BoatOverview({
  boat,
  eyebrow,
  keyFeaturesHeading,
}: {
  boat: BoatData
  eyebrow?: string
  keyFeaturesHeading?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const keyFeatures = boat.keyFeatures ?? []
  const hasBody = Boolean(boat.overviewBody?.length)

  // "Read more" must appear ONLY when there is genuinely more to read (Adinda, 2026-07-17). The
  // previous `line-clamp-6` was an arbitrary guess: it rendered the button whether or not anything
  // was hidden behind it, so a short body got a button that expanded to reveal nothing.
  //
  // There is no CSS-only way to ask "is this element clipped?", so we measure: scrollHeight (full
  // content) vs clientHeight (the capped box). A ResizeObserver re-checks on viewport resize and on
  // font load, both of which change where the text wraps — a measurement taken once at mount is
  // wrong the moment the window changes width.
  //
  // Deliberately does NOT re-measure while expanded: an open body has scrollHeight === clientHeight
  // by definition, so measuring then would always report "no overflow" and hide the button that is
  // the only way back to collapsed.
  const bodyRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [canExpand, setCanExpand] = useState(false)
  // The expanded height in px. A max-height transition needs a concrete target on BOTH ends —
  // you cannot animate to `none`, and animating to a huge fixed value makes the easing run against
  // a distance the content doesn't occupy, which reads as a lurch then a stop. So we measure the
  // real content height and animate to exactly that.
  const [fullHeight, setFullHeight] = useState(0)

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const measure = () => {
      // scrollHeight is the full content height regardless of the cap, so this stays correct while
      // expanded — unlike the clientHeight comparison below.
      setFullHeight(el.scrollHeight)
      // Don't re-evaluate "is it clipped?" while open: an expanded body has scrollHeight ===
      // clientHeight by definition, which would report "no overflow" and hide the only way back.
      if (!expanded) setCanExpand(el.scrollHeight > el.clientHeight + 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    // Webfonts land after first paint and reflow the text — re-measure once they're ready.
    document.fonts?.ready.then(measure).catch(() => {})
    return () => observer.disconnect()
  }, [expanded, boat.overviewBody])

  // 🔵 SITE-WIDE READ MORE / READ LESS PATTERN (Adinda, 2026-07-17) — collapsing returns the reader
  // to the TOP OF THE CONTAINING SECTION. Applies to every read-more/read-less on the site.
  // **Explicitly NOT accordions** (FAQ, specs): an accordion item is one of a list and closing it
  // should leave the list where it is, so yanking the page would lose the reader's place. A
  // read-more governs the whole section it lives in, which is the difference.
  //
  // Why it's needed: expanding can add hundreds of px BELOW the button. Collapsing removes that in
  // one frame, so the button flies up the viewport and the reader is dumped somewhere in the next
  // section with no idea what moved. Scrolling to the section top is the only stable target — it
  // sits ABOVE the shrinking content, so its position doesn't move while the 700ms collapse
  // animates. (Scrolling to the button itself would chase a moving target.)
  //
  // Reads prefers-reduced-motion rather than always smooth-scrolling: a long smooth scroll is
  // exactly the vestibular trigger that setting exists for. Mirrors globals.css, which already
  // gates the scroll-reveal animations on the same query.
  const collapseToSectionTop = () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    sectionRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const toggle = () => {
    // Read the CURRENT state and scroll before flipping — a setState updater must stay pure (React
    // may invoke it twice in StrictMode, which would fire the scroll twice).
    if (expanded) collapseToSectionTop()
    setExpanded((open) => !open)
  }

  return (
    // scroll-mt keeps the section heading clear of the FIXED nav (Nav.tsx is `fixed top-0`), which
    // would otherwise cover it the moment we scroll here. Values track the nav's real height —
    // ⚠️ these are matched to the mega-menu's `top-[110px]` desktop offset and an estimated 70px
    // mobile bar; they need Adinda's eye, and the sticky sub-nav (step 3) will change them again.
    <section
      ref={sectionRef}
      id="overview"
      aria-labelledby="boat-overview-heading"
      className="w-full scroll-mt-[70px] bg-bg-page py-64 lg:scroll-mt-[110px] lg:py-[120px]"
    >
      {/* max-w 1280 -> 1440 (Adinda, 2026-07-20). She asked for the "side padding" to match the hero;
          the padding was ALREADY identical (both use page-gutter-x = 24/48/80). The gap was the
          CONTAINER: the hero is w-full with no cap, so at 1920 it spans 1760px, while this was capped
          at 1280 and centred — 320px of dead space per side against the hero's 80.
          Went to 1440, NOT uncapped, deliberately: the hero can be uncapped because its text carries
          its own max-w-[480px]/[560px], so lines stay readable. This section's right column is
          flex-1 prose — uncapped, it would run ~1700px per line on a wide monitor. 1440 also matches
          the widest sections already on this page (Gallery, Cabins), so Overview doesn't end up
          visibly wider than its neighbours. Say the word if you want it fully uncapped. */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-48 page-gutter-x lg:flex-row lg:gap-[104px]">
        {/* Left: image, then Key Features BELOW it on the page background — not overlaid on the
            photo. Hides when there's neither an image nor a feature to show.

            order-2 on mobile: Key Features drops BELOW the overview copy (Adinda, 2026-07-17). On a
            narrow screen the columns stack, and leading with a photo + feature list buries the
            heading that says what the page is about. Desktop keeps Figma's order (features left,
            copy right) via lg:order-1. Using `order` rather than reordering the JSX keeps the DOM in
            reading order for screen readers and keyboard tab order — the flip is purely visual. */}
        {/* Left column 480 -> 432 (−10%, Adinda 2026-07-20). The right column is flex-1, so every
            pixel taken off here goes straight to the body copy — which was the point. */}
        {keyFeatures.length || boat.keyFeaturesImage ? (
          <div data-reveal className="order-2 flex w-full flex-col gap-[40px] lg:order-1 lg:w-[432px] lg:shrink-0">
            {/* 3:2, NOT Figma's 485/387.2 (≈1.25, nearly 5:4). Adinda's call 2026-07-17 — the
                mockup's near-square crop reads heavy above the Key Features list. A deliberate
                divergence from the design file, not a miss.
                Capping the RATIO rather than a height keeps it responsive: the column is 480px on
                desktop but full-width on mobile, so a fixed height would crop differently at each
                width. Note the source image is centre-cropped (see the hotspot item in
                _POLISH-BACKLOG.md) — a wider ratio crops MORE off the top and bottom, so this may
                read differently once the hotspot is honoured and real photos land. */}
            {/* group/features + overflow-hidden + slow scale on hover — the SAME image-zoom pattern
                as Cabins/Gallery/Specs (group-hover/x:scale-105, duration-[1100ms]). This image is
                the one that was missing it; the lone overflow-hidden was the leftover intent. */}
            <div className="group/features relative aspect-[3/2] w-full overflow-hidden">
              <Image
                {...sanityImageProps(boat.keyFeaturesImage, '/assets/placeholder-photo.svg')}
                alt={boat.keyFeaturesImage?.alt ?? ''}
                fill
                sizes="(min-width: 1024px) 432px, 100vw"
                className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/features:scale-105"
              />
            </div>

            {keyFeatures.length ? (
              <div className="flex flex-col gap-16 px-[8px]">
                {keyFeaturesHeading ? (
                  // <h2>, not <h3> (Adinda, 2026-07-21): in DOM order this heading precedes the
                  // Overview <h2>, so an <h3> made the outline jump H1 (hero) -> H3, skipping a
                  // level. Kept at the editorial-h3 SIZE — the level is semantic, the ramp is visual.
                  <h2 className="text-editorial-h3 text-text-primary">{keyFeaturesHeading}</h2>
                ) : null}
                <ul className="flex flex-col gap-16">
                  {keyFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-12">
                      {/* Figma uses the character ✦ at 18px in action-primary, not an icon asset —
                          which is why no matching SVG exists in /assets. aria-hidden: it's
                          decorative, and the <ul>/<li> already convey "list" to a screen reader. */}
                      <span
                        aria-hidden="true"
                        className="flex size-[18px] shrink-0 items-center justify-center pt-[4px] text-[18px] leading-none text-action-primary"
                      >
                        ✦
                      </span>
                      <span className="flex-1 text-body-medium text-text-primary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Column gap 80 -> 104 and lg:pr-48 restored (Adinda, 2026-07-20).
            History worth keeping, because the class looks like it was just put back:
            this column originally had `lg:pl-24 lg:pr-48`, which is what made the section read as
            more inset than the hero (right edge at 80+48=128 vs the hero's 80). Both were removed.
            Adinda then asked for the 48 back on the RIGHT ONLY, as a deliberate asymmetry now that
            the column widths and cap have changed — not a revert. `lg:pl-24` stays gone; the gap
            does that job.
            104 is off-scale (the scale has 96 and 128, no 104), so it is an arbitrary value rather
            than rounded to 96 — rounding is what makes a layout drift from the intent. */}
        <div className="order-1 flex flex-1 flex-col gap-24 lg:order-2 lg:pr-48 lg:pt-64" data-reveal="left">
          {eyebrow ? (
            <p className="text-eyebrow uppercase text-action-primary">{eyebrow}</p>
          ) : null}

          {/* gap-24, not Figma's 48 — Adinda's call 2026-07-17: halve the space between the H2 and
              the body. A deliberate divergence from the mockup, not a miss. */}
          <div className="flex w-full flex-col gap-24">
            {boat.overviewHeading ? (
              <h2 id="boat-overview-heading" className="text-display-h2 text-text-primary">
                {boat.overviewHeading}
              </h2>
            ) : null}

            {/* Body → button gap, Adinda 2026-07-17: 32 read too far. Collapsed 20 (−12);
                expanded 28 (−4). They differ ON PURPOSE — collapsed, the fade mask dissolves the
                last line into the background and that dead space reads as part of the gap, so it
                needs to come in further. Expanded, the text ends on a hard edge and only needs a
                nudge. 28 isn't on the spacing scale, so it's an arbitrary value. */}
            {hasBody ? (
              <div className={`flex w-full flex-col ${expanded ? 'gap-[28px]' : 'gap-20'}`}>
                {/* Collapsed is a max-height cap, not a hidden block or a fixed line count: the
                    full text stays in the DOM either way, so it's always crawlable and findable via
                    in-page search, and the cap adapts to whatever the body actually contains
                    (headings, bold, italic, lists all change line height — a line-clamp can't).
                    `overflow-hidden` is what makes scrollHeight > clientHeight measurable above.

                    The cap is clamp(floor, percentage-of-viewport, ceiling) — Adinda's model: a
                    percentage of the height with a fixed minimum, so it never collapses to a sliver
                    on a short viewport nor runs to the section edge on a tall one.
                      mobile  clamp(180px, 45dvh, 340px)   — taller share; the column is full-width
                      desktop clamp(220px, 32dvh, 420px)   — shorter share; sits beside the image
                    dvh, not vh, so mobile browser chrome doesn't skew it. Values are a starting
                    point for review, not derived from Figma (the mockup shows only one body length).

                    Cap is max(240px, 60dvh) — Adinda's number, 2026-07-17. ONE value for mobile and
                    desktop, replacing the earlier per-breakpoint clamps: those carried a px ceiling
                    (404/484) that silently capped BELOW 60dvh on a tall screen, so the viewport
                    share never actually applied. max() keeps the 240px floor (so a short viewport
                    doesn't collapse it to a sliver) and lets 60dvh govern everywhere else.
                    dvh, not vh, so mobile browser chrome doesn't skew it.

                    TRANSITION (Adinda: "feels very snappy and not lux at all"). The first pass had
                    NO transition, so it snapped. Now max-height animates over 700ms ease-out —
                    matching the site's scroll-reveal (globals.css), not the 300ms used for hover
                    states: 300ms on a large height change reads as a jolt, and this is a content
                    reveal, not a hover. The expanded target is the MEASURED height (see above), so
                    the easing runs across exactly the distance the content occupies.

                    FADE (Adinda: fade to 0% at the cut edge so it blends into the background). A
                    mask-image gradient, not an overlay div: a mask needs no knowledge of the
                    background colour, so it can't desync from the page background the way a
                    hardcoded `from-bg-page` overlay would. Applied only while collapsed — a fade on
                    fully-revealed text would dim the last paragraph for no reason. */}
                <div
                  ref={bodyRef}
                  id="boat-overview-body"
                  style={expanded ? { maxHeight: fullHeight } : undefined}
                  className={`flex flex-col gap-16 overflow-hidden text-body-large text-text-primary transition-[max-height] duration-700 ease-out ${
                    expanded
                      ? ''
                      : 'max-h-[max(240px,60dvh)] lg:max-h-[max(240px,calc(60dvh_-_80px))] [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]'
                  }`}
                >
                  <RichText value={boat.overviewBody!} />
                </div>

                {/* Rendered ONLY when the text is actually clipped. A button that expands to reveal
                    nothing is worse than no button. */}
                {canExpand ? (
                  <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={expanded}
                    aria-controls="boat-overview-body"
                    // -mt-16 while COLLAPSED only (Adinda, 2026-07-20): the mask fades the last line
                    // out well before the box ends, so the button sat in dead space. Expanded, the
                    // text ends where the box ends and no pull-up is wanted.
                    className={`group inline-flex w-fit items-center gap-4 py-4 text-button-small uppercase text-action-primary transition-colors duration-300 ease-in-out hover:text-accent-muted ${
                      expanded ? '' : '-mt-16'
                    }`}
                  >
                    {expanded ? 'Read less' : 'Read more'}
                    {/* Same chevron as the nav dropdowns (icon-nav-chevron, 7x6, rotate-180 on
                        open) — Adinda's call: this is the site's one "expand" affordance, so it
                        should read identically wherever it appears. The arrow this replaced is the
                        nav/link "go somewhere" icon, and this goes nowhere. */}
                    <span
                      aria-hidden="true"
                      className={`block h-[6px] w-[7px] shrink-0 bg-current transition-transform duration-300 ease-in-out [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${
                        expanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
