'use client'

import { useState } from 'react'
import Image from 'next/image'

import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { SanityImageWithMeta } from '@/sanity/lib/image'
import type { BoatData } from '@/sanity/queries'
import type { PortableTextBlock } from 'sanity'

// Figma Section/LayoutAndSpecs = 778:8878.
//
// REBUILT 2026-07-20: was a left-aligned single-column list (specs stacked left, layout diagrams
// stacked right). Now a centred heading + a two-tab strip (Layout / Specifications) over a
// two-column accordion.
//
// TWO PATTERNS COPIED, NOT INVENTED:
//   - the tab strip is BoatCabins.tsx's tab strip, class for class (continuous 2px underline track,
//     tabs butting together with px-12 and no gap, centred, text-button-small on mobile).
//   - the accordion is the homepage FAQ (Faq.tsx): two STABLE HTML columns rather than CSS
//     `columns-2` (a multi-column layout re-balances by height on every reflow, so expanding one
//     item visibly shifts OTHER items — a real bug Adinda caught in the original build), one item
//     open at a time, and the grid-template-rows 0fr->1fr collapse.
//
// ⚠️ DEVIATION FROM THE BRIEF, deliberate — this is NOT native <details>/<summary> any more.
// The old file used <details> and the brief asked to keep it. It is incompatible with the FAQ's
// animation: when React removes the `open` attribute the UA hides the content INSTANTLY
// (display:none on the non-summary children), so the grid-template-rows transition never runs in
// either direction. Since "match the FAQ's open/close animation" is the more specific requirement,
// this uses the FAQ's exact <h3><button aria-expanded> markup instead. The two properties <details>
// was chosen for are both preserved: it is keyboard-accessible (a real <button>), and every answer
// is in the DOM while collapsed (the collapse is visual only), so it stays crawlable.
//
// TOKEN SUBSTITUTIONS — the FAQ sits on the dark texture, this section sits on bg-bg-page (cream),
// so every *-ondark-* token became its light-surface equivalent:
//   text-text-ondark-primary      -> text-text-primary
//   bg-text-ondark-primary        -> bg-text-primary          (the chevron mask fill)
//   border-border-onimage-primary -> border-accent-subtle     (beige-400, the OPEN row's rule —
//                                    also what this section's dividers already used)
//   border-accent-ondark-subtle   -> border-border-subtle     (beige-200, the closed row's rule)
//
// A row with no body doesn't render at all (locked 2026-07-17) — the spec categories are a fixed
// list, so an unfilled one is normal, not an error. A layout row also survives on images alone.
// A tab with no rows left after that filter isn't shown ("hide what's empty", same as the gallery).

type AccordionRow = {
  key: string
  title: string
  body?: PortableTextBlock[]
  images?: SanityImageWithMeta[]
}

function AccordionColumn({
  rows,
  openKey,
  onToggle,
}: {
  rows: AccordionRow[]
  openKey: string | null
  onToggle: (key: string) => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      {rows.map((row) => {
        const active = openKey === row.key
        // beige-400 at 0.75px for EVERY row, open or closed (Adinda, 2026-07-20) —
        // border-accent-subtle IS beige-400 (globals.css:224). The closed rows were on
        // border-subtle (beige-200), which read as a different, lighter rule. Only the opacity
        // still differs between states.
        return (
          <div
            key={row.key}
            className={`mb-8 flex flex-col border-b-[0.75px] border-accent-subtle py-12 [transition:opacity_500ms_cubic-bezier(0.65,0,0.35,1),border-color_500ms_cubic-bezier(0.65,0,0.35,1)] ${
              active ? '' : 'opacity-80'
            }`}
          >
            <h3>
              <button
                type="button"
                aria-expanded={active}
                onClick={() => onToggle(row.key)}
                className="flex w-full items-center justify-between gap-8 text-left"
              >
                {/* ACTIVE = bold + accent (Adinda, 2026-07-20). action-primary is chocolate-600,
                    which is the "Accent/Primary" in the mockup. Inactive stays regular weight in
                    text-primary — it is NOT a size change like the homepage FAQ's
                    editorial-h5/body-large swap; here only weight and colour move, so the rows keep
                    a stable height and the column split doesn't reflow as you open and close. */}
                <span
                  className={`flex-1 text-body-large [transition:color_500ms_cubic-bezier(0.65,0,0.35,1)] ${
                    active ? 'font-semibold text-action-primary' : 'text-text-primary'
                  }`}
                >
                  {row.title}
                </span>
                <span
                  aria-hidden="true"
                  className="flex size-[20px] shrink-0 items-center justify-center"
                >
                  <span
                    className={`block size-[10px] bg-text-primary [transition:transform_500ms_cubic-bezier(0.65,0,0.35,1)] [mask-image:url("/assets/icon-nav-chevron.svg")] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${
                      active ? 'rotate-180' : ''
                    }`}
                  />
                </span>
              </button>
            </h3>
            <div
              className={`grid [transition:grid-template-rows_500ms_cubic-bezier(0.65,0,0.35,1)] ${
                active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                {/* Type ramp matches the homepage FAQ answer exactly (Faq.tsx:44):
                    mt-12 + text-body-medium -> lg:text-body-large. The `flex flex-col gap-16`
                    wrapper was REMOVED — it stacked a 16px flex gap on top of RichText's own
                    paragraph spacing, which is what made the line spacing read as too loose. The FAQ
                    has no such wrapper. Images keep their own spacing block below. */}
                <div className="mt-12 text-body-medium text-text-primary lg:text-body-large">
                  {row.body?.length ? <RichText value={row.body} /> : null}
                  {row.images?.map((img, i) => (
                    <div key={i} className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        {...sanityImageProps(img, '/assets/placeholder-photo.svg')}
                        alt={img.alt ?? ''}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function BoatSpecs({
  boat,
  eyebrow,
  heading,
}: {
  boat: BoatData
  eyebrow?: string
  heading?: string
}) {
  // A layout row survives on images alone; a spec row needs a body (it has nothing else to show).
  const layoutRows: AccordionRow[] = (boat.layoutDiagrams ?? [])
    .filter((d) => d.body?.length || d.images?.length)
    .map((d) => ({
      key: `layout-${d._key}`,
      title: d.heading ?? '',
      body: d.body,
      images: d.images,
    }))

  const specRows: AccordionRow[] = (boat.specifications ?? [])
    .filter((s) => s.body?.length)
    .map((s) => ({ key: `spec-${s._key}`, title: s.category ?? '', body: s.body }))

  const tabs = [
    { id: 'layout', label: 'Layout', rows: layoutRows },
    { id: 'specifications', label: 'Specifications', rows: specRows },
  ].filter((tab) => tab.rows.length)

  const [tabIndex, setTabIndex] = useState(0)
  // First row of the active tab open on load, same as the FAQ (locked 2026-07-17, Adinda): one
  // expanded item shows the rest are clickable. Derived from the row key rather than a fixed index
  // so it can't point at a row that doesn't exist — the FAQ shipped that exact bug.
  const [openKey, setOpenKey] = useState<string | null | undefined>(undefined)

  // Hooks must run before any early return, or hook order changes between renders.
  if (!tabs.length) return null

  const active = tabs[Math.min(tabIndex, tabs.length - 1)]
  const rows = active.rows
  // 🔴 `null` means CLOSED and must survive. The previous version fell back to `rows[0].key`
  // whenever openKey was null, so closing the first row instantly re-opened it — you could only
  // "close" a row by opening a different one (Adinda hit this immediately).
  // `undefined` is the distinct "never touched" state that opens the first row on load; a stale key
  // pointing at a row from another tab resolves back to that default rather than to nothing.
  const resolvedOpenKey =
    openKey === undefined
      ? rows[0].key
      : openKey && rows.some((r) => r.key === openKey)
        ? openKey
        : null
  const toggle = (key: string) => setOpenKey((prev) => (prev === key ? null : key))

  const splitAt = Math.ceil(rows.length / 2)
  const col1 = rows.slice(0, splitAt)
  const col2 = rows.slice(splitAt)

  // Vertical padding GATED (audit 2026-07-20): desktop = Figma (120); mobile 64 to match the
  // homepage + BoatOverview rhythm.
  return (
    <section
      id="layout-and-specs"
      aria-labelledby="boat-specs-heading"
      className="w-full bg-bg-page py-64 lg:py-[120px]"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-48">
        {/* Centred heading block. Spacing follows the homepage/BoatCabins convention, not Figma:
            eyebrow->h2 is gap-32, and the 800px measure is the locked ladder step for a centred
            section heading (Adinda, 2026-07-20 — see BoatCabins.tsx). */}
        <div className="mx-auto flex max-w-[800px] flex-col gap-32 page-gutter-x text-center">
          {eyebrow ? <p className="text-eyebrow uppercase text-text-eyebrow">{eyebrow}</p> : null}
          {heading ? (
            <h2 id="boat-specs-heading" className="text-display-h2 text-text-primary">
              {heading}
            </h2>
          ) : null}
        </div>

        <div className="flex flex-col gap-24 lg:gap-64">
          {/* Tab strip copied from BoatCabins.tsx (778:8770) — the underline is a continuous 2px
              track across the whole row, so the tabs butt together (px-12 each, NO gap) rather than
              sitting apart. On mobile the row scrolls horizontally instead of wrapping, which keeps
              that track unbroken.
              The strip renders even when only ONE tab survives the empty-content filter. As of
              2026-07-20 `boat.layoutDiagrams` is empty in Sanity, so "Layout" is correctly hidden —
              dropping the whole strip too would leave the section looking unbuilt against the
              mockup. The lone remaining tab reads as a label for the accordion under it, and the
              second tab appears by itself the moment a layout diagram is added. */}
          <div
            role="tablist"
            aria-label="Layout and specifications"
            className="flex justify-center overflow-x-auto page-gutter-x lg:justify-center lg:overflow-visible lg:px-0"
          >
            {tabs.map((tab, i) => {
              const selected = i === tabIndex
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  id={`specs-tab-${tab.id}`}
                  aria-selected={selected}
                  aria-controls={`specs-panel-${tab.id}`}
                  onClick={() => {
                    setTabIndex(i)
                    setOpenKey(null)
                  }}
                  className={`shrink-0 border-b-2 px-12 py-8 text-button-small whitespace-nowrap uppercase transition-colors duration-300 ease-in-out lg:text-button ${
                    selected
                      ? 'border-action-primary text-action-primary'
                      : 'border-action-primary/35 text-action-primary/55 hover:text-action-primary'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Two STABLE columns at lg, one column below — see the header note on why this isn't
              CSS `columns-2`. col2 is empty when a tab has a single row; flex-1 on an empty column
              would still claim half the width, so it's only rendered when it has content. */}
          <div
            role="tabpanel"
            id={`specs-panel-${active.id}`}
            aria-labelledby={`specs-tab-${active.id}`}
            className="flex flex-col gap-8 page-gutter-x lg:flex-row lg:items-start lg:gap-80"
          >
            <AccordionColumn rows={col1} openKey={resolvedOpenKey} onToggle={toggle} />
            {col2.length ? (
              <AccordionColumn rows={col2} openKey={resolvedOpenKey} onToggle={toggle} />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
