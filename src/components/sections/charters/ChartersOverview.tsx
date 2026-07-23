'use client'

import { useEffect, useRef, useState } from 'react'

import { RichText } from '@/components/RichText'
import type { PrivateChartersData } from '@/sanity/queries'

// Figma Section/Boat Page/Overview (Private Charters instance) = 778:8938.
//
// Centered single-column variant of the overview pattern: eyebrow + display-h2 + tier-3 rich-text
// body. The destinations-map graphic lives INSIDE the body as an inline rich-text image (editor
// controls its position in the copy) — this component renders no image of its own.
//
// Values from the node: content column max-w-[900px] (Adinda re-confirmed 900 on the build brief),
// heading max-w-[720px] centered, body Body/Large left-aligned, Read More centered below.
// Heading → body gap is 24, NOT the node's 48 — the established section rhythm (TheBoat.tsx and
// every homepage section; same override BoatOverview already made against its node's 48).
//
// The Read More collapse is BoatOverview's measured pattern verbatim (measure scrollHeight vs
// clientHeight, animate max-height to the measured target, mask-fade the cut edge, button only
// when genuinely clipped, collapse returns to section top). Read that file's comments for the
// full reasoning — not repeated here. ⚠️ One consequence specific to THIS section: the body
// contains a tall inline image, so the collapsed cap (max(240px,60dvh)) can cut mid-map on
// shorter viewports — flagged for Adinda's QA look rather than silently special-cased.
export function ChartersOverview({ charters }: { charters: PrivateChartersData }) {
  const [expanded, setExpanded] = useState(false)
  const hasBody = Boolean(charters.overviewBody?.length)

  const bodyRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [canExpand, setCanExpand] = useState(false)
  const [fullHeight, setFullHeight] = useState(0)

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const measure = () => {
      setFullHeight(el.scrollHeight)
      if (!expanded) setCanExpand(el.scrollHeight > el.clientHeight + 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => observer.disconnect()
  }, [expanded, charters.overviewBody])

  const collapseToSectionTop = () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    sectionRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const toggle = () => {
    if (expanded) collapseToSectionTop()
    setExpanded((open) => !open)
  }

  if (!charters.overviewHeading && !hasBody) return null

  return (
    // bg-page = beige-50 #fdfcfa (Adinda, 2026-07-23 QA round 4 — the section's bg walked
    // beige-100 → beige-150 → back to the page default once Why-book below gained the light
    // texture; the texture now carries the contrast between the two sections).
    <section
      ref={sectionRef}
      id="overview"
      aria-labelledby="charters-overview-heading"
      className="w-full scroll-mt-[70px] bg-bg-page py-64 lg:scroll-mt-[110px] lg:py-[120px]"
    >
      <div data-reveal className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-24 page-gutter-x">
        {charters.overviewEyebrow ? (
          <p className="text-center text-eyebrow uppercase text-action-primary">{charters.overviewEyebrow}</p>
        ) : null}

        <div className="flex w-full flex-col items-center gap-24">
          {charters.overviewHeading ? (
            <h2
              id="charters-overview-heading"
              className="max-w-[720px] text-center text-display-h2 text-text-primary"
            >
              {charters.overviewHeading}
            </h2>
          ) : null}

          {hasBody ? (
            <div className={`flex w-full flex-col items-center ${expanded ? 'gap-[28px]' : 'gap-20'}`}>
              <div
                ref={bodyRef}
                id="charters-overview-body"
                style={expanded ? { maxHeight: fullHeight } : undefined}
                className={`flex w-full flex-col gap-16 overflow-hidden text-body-large text-text-primary transition-[max-height] duration-700 ease-out ${
                  expanded
                    ? ''
                    : /* DESKTOP cap is CONTENT-BASED, not viewport-based (Adinda, 2026-07-23): the
                         core content — intro paragraph + destinations map + closing paragraph,
                         ≈ 870px at the 900px column — must be ENTIRELY visible before Read More
                         cuts in; only the extended copy below it collapses. 960px = that content
                         plus headroom for font-load reflow. Mobile keeps the standard 60dvh cap
                         (she reviewed it: "it looks right"). */
                      'max-h-[max(240px,60dvh)] lg:max-h-[960px] [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]'
                }`}
              >
                <RichText value={charters.overviewBody!} />
              </div>

              {canExpand ? (
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={expanded}
                  aria-controls="charters-overview-body"
                  className={`group inline-flex w-fit items-center gap-4 py-4 text-button-small uppercase text-action-primary transition-colors duration-300 ease-in-out hover:text-accent-muted ${
                    expanded ? '' : '-mt-16'
                  }`}
                >
                  {expanded ? 'Read less' : 'Read more'}
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
    </section>
  )
}
