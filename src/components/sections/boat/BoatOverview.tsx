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
  const [canExpand, setCanExpand] = useState(false)

  useEffect(() => {
    const el = bodyRef.current
    if (!el || expanded) return
    const measure = () => setCanExpand(el.scrollHeight > el.clientHeight + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    // Webfonts land after first paint and reflow the text — re-measure once they're ready.
    document.fonts?.ready.then(measure).catch(() => {})
    return () => observer.disconnect()
  }, [expanded, boat.overviewBody])

  return (
    <section id="overview" aria-labelledby="boat-overview-heading" className="w-full bg-bg-page py-64 lg:py-[120px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-48 page-gutter-x lg:flex-row lg:gap-80">
        {/* Left: image, then Key Features BELOW it on the page background — not overlaid on the
            photo. Hides when there's neither an image nor a feature to show.

            order-2 on mobile: Key Features drops BELOW the overview copy (Adinda, 2026-07-17). On a
            narrow screen the columns stack, and leading with a photo + feature list buries the
            heading that says what the page is about. Desktop keeps Figma's order (features left,
            copy right) via lg:order-1. Using `order` rather than reordering the JSX keeps the DOM in
            reading order for screen readers and keyboard tab order — the flip is purely visual. */}
        {keyFeatures.length || boat.keyFeaturesImage ? (
          <div data-reveal className="order-2 flex w-full flex-col gap-[40px] lg:order-1 lg:w-[480px] lg:shrink-0">
            <div className="relative aspect-[485/387.2] w-full overflow-hidden">
              <Image
                {...sanityImageProps(boat.keyFeaturesImage, '/assets/placeholder-photo.svg')}
                alt={boat.keyFeaturesImage?.alt ?? ''}
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
            </div>

            {keyFeatures.length ? (
              <div className="flex flex-col gap-16 px-[8px]">
                {keyFeaturesHeading ? (
                  <h3 className="text-editorial-h3 text-text-primary">{keyFeaturesHeading}</h3>
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

        <div className="order-1 flex flex-1 flex-col gap-24 lg:order-2 lg:pl-24 lg:pr-48 lg:pt-64" data-reveal="left">
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

            {hasBody ? (
              <div className="flex w-full flex-col gap-32">
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

                    NOTE: no height transition. Animating to/from a clamp() max-height needs a
                    measured pixel target; deferred to polish rather than faked with a guess. */}
                <div
                  ref={bodyRef}
                  id="boat-overview-body"
                  className={`flex flex-col gap-16 text-body-large text-text-primary ${
                    expanded
                      ? ''
                      : 'max-h-[clamp(180px,45dvh,340px)] overflow-hidden lg:max-h-[clamp(220px,32dvh,420px)]'
                  }`}
                >
                  <RichText value={boat.overviewBody!} />
                </div>

                {/* Rendered ONLY when the text is actually clipped. A button that expands to reveal
                    nothing is worse than no button. */}
                {canExpand ? (
                  <button
                    type="button"
                    onClick={() => setExpanded((open) => !open)}
                    aria-expanded={expanded}
                    aria-controls="boat-overview-body"
                    className="group inline-flex w-fit items-center gap-4 py-4 text-button-small uppercase text-action-primary transition-colors duration-300 ease-in-out hover:text-accent-muted"
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
