'use client'

import { useEffect, useRef, useState } from 'react'

import { RichText } from '@/components/RichText'
import { useDragScroll } from '@/lib/useDragScroll'
import type { FaqSectionData } from '@/sanity/queries'

// Figma Section/FAQWithCategories = 703:3047 (via 778:8696). REBUILT 2026-07-21 (Adinda) as the
// `categorized` FAQ layout — the homepage's <Faq> is the `default` variant (two columns, no
// categories); this is its derivative: category rail left, single accordion column right. The two
// names are the locked layout-variant values (CLAUDE.md, 2026-07-17) — named for what they do, not
// their geometry. When the componentization pass runs, these merge into one Faq component with a
// `layout` prop; until then this file deliberately copies the homepage's expression verbatim
// (section shell, header, Block/FAQItem rows) so the merge is a diff, not a redesign.
//
// Conventions over Figma (locked, site-wide) — overrides in this file, both values named:
//   - vertical padding: pt-80/pb-80 mobile, lg pt-[144px]/pb-160 (homepage FAQ rhythm); Figma says
//     pt-144/pb-196.
//   - header-to-content gap: gap-[36px]/lg:gap-64 (homepage); Figma says 80.
//   - gutters: page-gutter-x; Figma says flat px-160.
//   - min-height: lg:min-h-[calc(100dvh-70px)] same as the homepage FAQ (Adinda, 2026-07-21).
// Kept from Figma (no established name): the 320px rail cap, the rail/list gap-96 (on-scale),
// the rail's 4px active bar, pl-24/py-16 rail rows.
//
// Accordion mechanics: the homepage button pattern, NOT <details>/<summary> — decided with Adinda
// 2026-07-21. For SEO the two are equivalent (all answers stay in the DOM either way; the levers
// are the page-level FAQPage JSON-LD + real headings + anchors, all present); the button pattern
// buys exact behavioral parity with the shipped homepage section (500ms ease, one-open-at-a-time
// cross-browser). What it forgoes vs <details>: no-JS resilience and Chrome's find-in-page
// auto-expand. Do not "upgrade" this back to <details> for SEO reasons — there is no SEO gain.
//
// EVERY category's Q&As render into the DOM; inactive categories are CSS-hidden, not unmounted —
// so the served HTML always matches the page's FAQPage JSON-LD (which spans all categories), and
// crawlers/answer engines see every answer without clicking. Stable per-question #anchors kept.
//
// Mobile: the category rail becomes horizontally draggable chips, same pattern as Destinations
// (locked with the variant decision, 2026-07-17) — same track classes, same useDragScroll hook.
//
// Sections arrive COMPOSED from the page (boat's own + the General FAQ pulls) — this component
// renders what it's given and stays reusable for the destination page, which composes differently.
export function BoatFaq({
  sections,
  eyebrow,
  heading,
  linkText,
}: {
  sections: FaqSectionData[]
  eyebrow?: string
  heading?: string
  linkText?: string
}) {
  const [activeCat, setActiveCat] = useState(0)
  // First question open on load (homepage lock, same rationale: one expanded item shows the rest
  // are clickable). Re-opens the first question of whichever category is switched to.
  const [openId, setOpenId] = useState<string | null>('0-0')
  const chipTrackRef = useDragScroll<HTMLDivElement>()
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Global rail behavior (Adinda, 2026-07-21 — same fix the gallery tabs got): a tapped chip
  // scrolls into view, aligned to the start of the track; for the last chip the browser clamps to
  // max scroll, so it simply becomes fully visible with its neighbours. Skip the mount run —
  // `block: 'nearest'` would vertically scroll the PAGE to this section on load otherwise (the
  // exact bug the Destinations/gallery implementations already guard against).
  const skipFirstScrollIntoView = useRef(true)
  useEffect(() => {
    if (skipFirstScrollIntoView.current) {
      skipFirstScrollIntoView.current = false
      return
    }
    chipRefs.current[activeCat]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }, [activeCat])

  // Empty → the section disappears entirely, same as the homepage (Adinda, 2026-07-21). The page
  // already filters empty categories out before passing them down. Hooks stay above this return.
  if (!sections.length) return null

  const selectCategory = (i: number) => {
    setActiveCat(i)
    setOpenId(`${i}-0`)
  }
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <section id="faq" aria-labelledby="boat-faq-heading" className="relative isolate w-full scroll-mt-[70px] pt-80 pb-80 lg:min-h-[calc(100dvh-70px)] lg:scroll-mt-[110px] lg:pt-[144px] lg:pb-160">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--texture-dark)] bg-cover bg-center" />
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-[36px] page-gutter-x lg:gap-64">
        {/* Header — identical markup to the homepage Faq. The link is a plain <a> like the
            homepage's; /faq ships later (Adinda: link the not-yet-existing route now). */}
        <div data-reveal="left" className="flex flex-col gap-24 lg:gap-32">
          <p className="text-eyebrow uppercase text-accent-ondark-primary">{eyebrow}</p>
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:gap-48">
            <h2 id="boat-faq-heading" className="mr-[40px] max-w-[640px] text-display-h2 text-text-ondark-primary lg:mr-0">{heading}</h2>
            <a href="/faq" className="group inline-flex h-48 w-fit shrink-0 items-center gap-4 border border-border-onimage-primary px-20 py-8 text-button-small uppercase text-text-ondark-primary transition-colors duration-300 ease-in-out hover:bg-text-ondark-primary/10 lg:ml-auto">
              {linkText}
              <span aria-hidden="true" className="block size-[12px] shrink-0 bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] [mask-image:url('/assets/icon-arrow.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </a>
          </div>
        </div>

        <div data-reveal className="flex flex-col gap-32 lg:flex-row lg:gap-96">
          {/* Category rail — desktop. Active: editorial-h3 + 4px bar; inactive: 40% text + 1px
              hairline (Figma 703:3056). The bars butt together into one continuous rule. */}
          <div className="hidden lg:flex lg:w-full lg:max-w-[320px] lg:shrink-0 lg:flex-col" role="tablist" aria-label="FAQ categories">
            {sections.map((section, i) => {
              const active = i === activeCat
              return (
                <button
                  key={section._key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => selectCategory(i)}
                  className="relative flex flex-col items-start justify-center py-16 pl-24 text-left"
                >
                  <span aria-hidden="true" className={`absolute top-0 left-0 h-full transition-colors duration-300 ease-in-out ${active ? 'w-[4px] bg-text-ondark-primary' : 'w-px bg-text-ondark-primary/30'}`} />
                  <span className={`text-editorial-h3 transition-colors duration-300 ease-in-out ${active ? 'text-text-ondark-primary' : 'text-text-ondark-primary/40 hover:text-text-ondark-primary/70'}`}>
                    {section.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Category chips — mobile. Same draggable track as Destinations' tabs, per the locked
              variant decision. */}
          <div
            ref={chipTrackRef}
            className="flex cursor-grab items-center overflow-x-auto scroll-smooth py-2 select-none active:cursor-grabbing scrollbar-hidden lg:hidden"
            role="tablist"
            aria-label="FAQ categories"
          >
            {sections.map((section, i) => (
              <button
                key={section._key}
                ref={(el) => {
                  chipRefs.current[i] = el
                }}
                type="button"
                role="tab"
                aria-selected={i === activeCat}
                aria-controls={`faq-panel-${i}`}
                onClick={() => selectCategory(i)}
                className={`shrink-0 border-b-2 p-8 text-button-small uppercase transition-colors duration-300 ease-in-out ${
                  i === activeCat ? 'border-text-ondark-primary text-text-ondark-primary' : 'border-text-ondark-primary/40 text-text-ondark-primary/40 hover:border-text-ondark-primary/70 hover:text-text-ondark-primary/70'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* One panel per category, all in the DOM; only the active one is visible. */}
          <div className="flex min-w-0 flex-1 flex-col">
            {sections.map((section, i) => (
              <div key={section._key} id={`faq-panel-${i}`} role="tabpanel" className={i === activeCat ? 'flex flex-col' : 'hidden'}>
                {(section.questions ?? []).map((q, j) => {
                  const id = `${i}-${j}`
                  const active = openId === id
                  const anchor = slugifyQuestion(q.question) || `q-${id}`
                  return (
                    <div
                      key={id}
                      id={anchor}
                      className={`mb-8 flex flex-col border-b-[0.75px] py-12 [transition:opacity_500ms_cubic-bezier(0.65,0,0.35,1),border-color_500ms_cubic-bezier(0.65,0,0.35,1)] ${
                        active ? 'border-border-onimage-primary' : 'border-accent-ondark-subtle opacity-80'
                      }`}
                    >
                      <h3>
                        <button type="button" aria-expanded={active} onClick={() => toggle(id)} className="flex w-full items-center justify-between gap-8 text-left">
                          <span className={`flex-1 text-text-ondark-primary [transition:color_500ms_cubic-bezier(0.65,0,0.35,1)] ${active ? 'text-editorial-h5' : 'text-body-large'}`}>{q.question}</span>
                          <span aria-hidden="true" className="flex size-[20px] shrink-0 items-center justify-center">
                            {/* Specs accordion's flattened glyph (Adinda, 2026-07-21) — see
                                Faq.tsx / BoatSpecs.tsx for the sizing history. */}
                            <span className={`block h-[6.5px] w-[10px] bg-text-ondark-primary [transition:transform_500ms_cubic-bezier(0.65,0,0.35,1)] [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%_100%] ${active ? 'rotate-180' : ''}`} />
                          </span>
                        </button>
                      </h3>
                      <div className={`grid [transition:grid-template-rows_500ms_cubic-bezier(0.65,0,0.35,1)] ${active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        {/* Answers are tier-2 rich text (paragraph/bold/italic/link/bullets — no
                            headings), so RichText's light-background heading colors never fire
                            here; paragraphs inherit the ondark color set on this wrapper.
                            Paragraph spacing rule (Adinda, 2026-07-21): the RichText WRAPPER owns
                            it — gap-12 for body-medium copy, gap-16 for body-large. This answer is
                            medium on mobile / large on lg, so the gap steps with the type. */}
                        <div className="overflow-hidden">
                          <div className="mt-12 flex flex-col gap-12 text-body-medium text-text-ondark-primary lg:gap-16 lg:text-body-large">
                            <RichText value={q.answer} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Anchors derive from the question text so they're readable and citable. They shift if the question
// is reworded — acceptable here (no external links to these yet); revisit if that changes.
function slugifyQuestion(question?: string): string {
  if (!question) return ''
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}
