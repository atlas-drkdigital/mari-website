'use client'

import { useEffect, useRef, useState } from 'react'
import type { PortableTextBlock } from 'sanity'

import { RichText } from '@/components/RichText'

// Centered single-column overview section — eyebrow + display-h2 + tier-3 rich body with the
// site-wide Read More collapse. Figma Section/Boat Page/Overview = 778:8938 (Private Charters
// instance). GENERALIZED from ChartersOverview 2026-07-23 when the About page became its second
// consumer with identical layout (Adinda's spec: "exact same layout as Private Charters") — the
// just-in-time extraction threshold, met without inventing parameters: the props are exactly the
// three fields both pages pass.
//
// All layout decisions and their history live in this file's git blame via ChartersOverview
// (900px column, heading max 720, content-based desktop Read More cap at 960px vs the standard
// 60dvh mobile cap, bg walked beige-100→150→page-50). Rhythm: eyebrow→heading gap-24 (the
// homepage convention), heading→body gap-32 — one step UP from 24 (Adinda, 2026-07-24: the body
// needed breathing room under the heading; shared component, both charters + about get it).
// The Read More mechanics are BoatOverview's locked pattern verbatim — reasoning lives there.
export function PageOverview({
  id = 'overview',
  headingId,
  eyebrow,
  heading,
  body,
}: {
  /** Section anchor id (subnav target where a page has one). */
  id?: string
  /** aria-labelledby target — unique per page (two pages never render together, but ids must be page-unique). */
  headingId: string
  eyebrow?: string
  heading?: string
  body?: PortableTextBlock[]
}) {
  const [expanded, setExpanded] = useState(false)
  const hasBody = Boolean(body?.length)

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
  }, [expanded, body])

  const collapseToSectionTop = () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    sectionRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const toggle = () => {
    if (expanded) collapseToSectionTop()
    setExpanded((open) => !open)
  }

  if (!heading && !hasBody) return null

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={headingId}
      className="w-full scroll-mt-[70px] bg-bg-page py-64 lg:scroll-mt-[110px] lg:py-[120px]"
    >
      <div data-reveal className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-24 page-gutter-x">
        {eyebrow ? <p className="text-center text-eyebrow uppercase text-action-primary">{eyebrow}</p> : null}

        <div className="flex w-full flex-col items-center gap-32">
          {heading ? (
            <h2 id={headingId} className="max-w-[720px] text-center text-display-h2 text-text-primary">
              {heading}
            </h2>
          ) : null}

          {hasBody ? (
            <div className={`flex w-full flex-col items-center ${expanded ? 'gap-[28px]' : 'gap-20'}`}>
              <div
                ref={bodyRef}
                id={`${id}-body`}
                style={expanded ? { maxHeight: fullHeight } : undefined}
                className={`flex w-full flex-col gap-16 overflow-hidden text-body-large text-text-primary transition-[max-height] duration-700 ease-out ${
                  expanded
                    ? ''
                    : /* Desktop cap is CONTENT-based (Adinda, 2026-07-23): the core content —
                         intro + inline image + closing paragraph — shows entirely before Read
                         More cuts in; mobile keeps the standard 60dvh cap. */
                      'max-h-[max(240px,60dvh)] lg:max-h-[960px] [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]'
                }`}
              >
                <RichText value={body!} />
              </div>

              {canExpand ? (
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={expanded}
                  aria-controls={`${id}-body`}
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
