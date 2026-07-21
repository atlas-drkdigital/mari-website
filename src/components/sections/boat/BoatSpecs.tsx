'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import { RichText } from '@/components/RichText'
import type { LightboxSlide } from '@/components/SiteLightbox'
import { sanityImageProps, urlForImage } from '@/sanity/lib/image'
import type { SanityImageWithMeta } from '@/sanity/lib/image'
import type { BoatData } from '@/sanity/queries'
import type { PortableTextBlock } from 'sanity'

// DYNAMIC, ssr:false — same as BoatGallery/BoatCabins: YARL + its stylesheets load only when a
// visitor opens a layout diagram, never on page load.
const SiteLightbox = dynamic(
  () => import('@/components/SiteLightbox').then((m) => m.SiteLightbox),
  { ssr: false },
)

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

// LAYOUT tab — NOT an accordion (Adinda, 2026-07-20). Each diagram is just an editorial-h3 label,
// a description, then the image below it. The Figma node (778:8878) only spec'd the Specifications
// tab (accordion); the Layout tab shape comes from Adinda's direct instruction.
//   - container capped at 720px (the accordion is full-width; a single stacked column at that width
//     ran too long a line)
//   - gap-48 between the description block and the image (on the spacing scale; the description +
//     image are the two children of each diagram's flex, so one gap value sets both)
//   - image gets the Testimonials card treatment: rounded-[2px] + the exact card shadow token
//   - aspect-square because the deck plan asset is 1:1 (2000x2000); object-contain so a
//     non-square replacement later still shows in full rather than cropping.
// `imageStartIndex` is where THIS diagram's images begin in the flattened lightbox list, so a click
// opens the right slide even across multiple diagrams.
function LayoutPanel({
  rows,
  imageStartIndex,
  onOpen,
}: {
  rows: AccordionRow[]
  imageStartIndex: number[]
  onOpen: (index: number) => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-64 page-gutter-x lg:px-0">
      {rows.map((row, r) => (
        <div key={row.key} className="flex flex-col gap-48">
          <div className="flex flex-col gap-16">
            {row.title ? (
              <h3 className="text-editorial-h3 text-text-primary">{row.title}</h3>
            ) : null}
            {row.body?.length ? (
              /* gap-12 = the paragraph-spacing rule (2026-07-21): the RichText wrapper owns it —
                 gap-12 for body-medium copy, gap-16 for body-large. */
              <div className="flex flex-col gap-12 text-body-medium text-text-primary">
                <RichText value={row.body} />
              </div>
            ) : null}
          </div>
          {row.images?.map((img, i) => {
            // Respect the image's OWN ratio (Adinda, 2026-07-20) — not a forced aspect-square. The
            // box's aspect-ratio comes from the asset's real dimensions (already in the query), so a
            // wide deck plan lays out wide and a tall one tall. object-contain keeps the whole plan
            // visible either way. Falls back to 3/2 only if dimensions are somehow missing.
            const dims = img.dimensions
            const ratio = dims?.width && dims?.height ? `${dims.width} / ${dims.height}` : '3 / 2'
            return (
              <button
                key={i}
                type="button"
                onClick={() => onOpen(imageStartIndex[r] + i)}
                aria-label={`Open ${img.alt ?? row.title ?? 'deck plan'} full screen`}
                style={{ aspectRatio: ratio }}
                className="group/layout relative w-full cursor-zoom-in rounded-[2px] shadow-[0px_4px_10px_rgba(44,37,34,0.2)]"
              >
                {/* Shadow and overflow clip live on SEPARATE elements deliberately (Adinda, 2026-07-21):
                    with both on the button, Chromium bleeds the shadow inward along the clip edge the
                    moment the child image starts its hover transform — it reads as a thin black border
                    around the plan. Splitting them is the canonical fix; visually identical otherwise. */}
                <div className="absolute inset-0 overflow-hidden rounded-[2px]">
                  <Image
                    {...sanityImageProps(img, '/assets/placeholder-photo.svg')}
                    alt={img.alt ?? ''}
                    fill
                    sizes="(min-width: 1024px) 720px, 100vw"
                    className="object-contain transition-transform duration-[1100ms] ease-in-out group-hover/layout:scale-105"
                  />
                </div>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
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
        // Hover = the active row's COLOR treatment only — opacity + title/chevron colour, NOT the
        // weight bump, rotation, or expansion (Adinda, 2026-07-21; site-wide accordion rule, see
        // CLAUDE.md). group/row carries the hover to the title span and chevron below.
        return (
          <div
            key={row.key}
            className={`group/row mb-8 flex flex-col border-b-[0.75px] border-accent-subtle py-12 [transition:opacity_500ms_cubic-bezier(0.65,0,0.35,1),border-color_500ms_cubic-bezier(0.65,0,0.35,1)] ${
              active ? '' : 'opacity-80 hover:opacity-100'
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
                {/* NO color transition (Adinda, 2026-07-20). font-weight applies INSTANTLY while a
                    500ms color transition lagged behind it, so on click the label flashed
                    bold-in-the-inactive-colour before fading to accent. Dropping the transition makes
                    weight and colour flip together in one frame — the chevron still animates. */}
                {/* Hover lights the COLOUR only — no font-semibold on hover, both per the
                    colors-not-typography hover rule (Adinda, 2026-07-21) and because a weight
                    change on hover would reflow the row (the exact thing the weight+colour
                    active treatment was tuned to avoid mid-animation). */}
                <span
                  className={`flex-1 text-body-large ${
                    active ? 'font-semibold text-action-primary' : 'text-text-primary group-hover/row:text-action-primary'
                  }`}
                >
                  {row.title}
                </span>
                {/* Chevron: box size-[20px] + glyph size-[10px] + mask-size:contain — BYTE-IDENTICAL
                    to the homepage FAQ (Faq.tsx:38-39). Colour is the only intended difference:
                    Figma's Accent/Primary = action-primary (chocolate-600) when open, the subtle
                    accent = accent-subtle (beige-400) when closed. Was bg-text-primary (navy) in both
                    states, which is the wrong colour and reads heavier than the FAQ's. Colour now
                    transitions on the same curve as the rotation. */}
                <span
                  aria-hidden="true"
                  className="flex size-[20px] shrink-0 items-center justify-center"
                >
                  {/* Flattened ~1px shorter than the FAQ's square glyph (Adinda, 2026-07-20). The
                      contained 10x10 rendered ~7.6px tall and read elongated; -2px (5.5) went too far
                      and read as a pancake, so it's back to h-[6.5px] — half the original reduction.
                      Explicit height + mask-size:100%_100% sets the height directly instead of
                      letting `contain` derive it from the width. */}
                  <span
                    className={`block h-[6.5px] w-[10px] [transition:transform_500ms_cubic-bezier(0.65,0,0.35,1),background-color_500ms_cubic-bezier(0.65,0,0.35,1)] [mask-image:url("/assets/icon-nav-chevron.svg")] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%_100%] ${
                      active ? 'rotate-180 bg-action-primary' : 'bg-accent-subtle group-hover/row:bg-action-primary'
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
                {/* Answer is body-medium on BOTH breakpoints — exactly one step below the body-large
                    question (Adinda, 2026-07-20). This DIVERGES from the homepage FAQ, whose answer
                    bumps to lg:text-body-large; there the question is editorial-h5 (bigger), so its
                    answer sitting at body-large is still a step down. Here the question is body-large,
                    so the answer has to be body-medium to keep that one-step relationship. The
                    `flex flex-col gap-16` wrapper stays removed — it stacked a 16px gap on top of
                    RichText's own paragraph spacing. Images keep their own spacing block below. */}
                {/* pb-4 only when open (Adinda, 2026-07-20) — a little breathing room below the
                    answer before the row's bottom border. Harmless while closed: the row is
                    height-clipped to 0 in that state. */}
                <div className={`mt-12 flex flex-col gap-12 text-body-medium text-text-primary ${active ? 'pb-4' : ''}`}>
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
  // Memoised because it feeds the lightbox useMemos below — recreating it every render would defeat
  // their memoization (the React compiler flags exactly that).
  const layoutRows: AccordionRow[] = useMemo(
    () =>
      (boat.layoutDiagrams ?? [])
        .filter((d) => d.body?.length || d.images?.length)
        .map((d) => ({
          key: `layout-${d._key}`,
          title: d.heading ?? '',
          body: d.body,
          images: d.images,
        })),
    [boat.layoutDiagrams],
  )

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

  // SubNav tab pre-select (Adinda, 2026-07-21): the hero's LAYOUT and SPECS items both scroll to
  // this one section, each carrying its own hash — #layout / #specs are real anchor spans at the
  // section's top, so deep links (`/boats/mari#specs`) scroll natively too, and this listener
  // switches the tab to match. Runs on mount for the deep-link case, then on every hashchange
  // (which native anchor clicks fire; the SubNav deliberately doesn't preventDefault).
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash
      const wantId = hash === '#specs' ? 'specifications' : hash === '#layout' ? 'layout' : null
      if (!wantId) return
      const idx = tabs.findIndex((tab) => tab.id === wantId)
      if (idx >= 0) setTabIndex(idx)
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
    // tabs is rebuilt each render from boat data that never changes on the client — the ids and
    // order it yields are stable, so mount + hashchange are the only triggers that matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Layout-tab lightbox — every layout diagram's images flattened into ONE list, so a deck plan (or
  // several) opens as a lightbox gallery (Adinda, 2026-07-20). Same dynamic/hasOpened pattern as
  // BoatGallery/BoatCabins. `null` = closed.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [hasOpened, setHasOpened] = useState(false)

  const layoutSlides: LightboxSlide[] = useMemo(
    () =>
      layoutRows.flatMap((row) =>
        (row.images ?? [])
          .filter((img) => img.asset?._ref)
          .map((img) => ({
            src: urlForImage(img).width(1920).fit('max').quality(75).auto('format').url(),
            alt: img.alt,
            label: row.title || undefined,
            caption: img.alt || row.title || undefined,
          })),
      ),
    [layoutRows],
  )

  // Where each diagram's images start in the flattened list. Counted over the SAME asset._ref filter
  // as the slides, or a missing asset shifts every later click's target. Pure reduce (no mutated
  // accumulator) — the React compiler's immutability rule rejects the latter.
  const layoutOffsets = useMemo(
    () =>
      layoutRows.map((_row, index) =>
        layoutRows
          .slice(0, index)
          .reduce((total, prev) => total + (prev.images ?? []).filter((img) => img.asset?._ref).length, 0),
      ),
    [layoutRows],
  )

  const openLightbox = (index: number) => {
    setHasOpened(true)
    setLightboxIndex(index)
  }

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
      className="relative isolate w-full scroll-mt-[70px] bg-bg-page py-64 lg:scroll-mt-[110px] lg:py-[120px]"
    >
      {/* Real anchor targets for the SubNav's LAYOUT / SPECS items — zero-size, at the section's
          top edge, so native #layout / #specs navigation (clicks AND deep links) scrolls here;
          the hashchange listener above picks the matching tab. scroll-mt values follow the
          BoatOverview convention (70px sticky nav, 110 with desktop breathing room). */}
      <span id="layout" aria-hidden="true" className="absolute top-0 scroll-mt-[70px] lg:scroll-mt-[110px]" />
      <span id="specs" aria-hidden="true" className="absolute top-0 scroll-mt-[70px] lg:scroll-mt-[110px]" />
      {/* texture-light overlay (Adinda, 2026-07-20) — the tileable topographic pattern visible
          behind this section in the mockup. Identical treatment to WhyUs / Testimonials / Contact:
          same 720px tile, same opacity-20, same -z-10 under an `isolate` parent so it can never
          stack above content. Copied rather than re-derived so all four stay in step. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--texture-light)] [background-size:720px_auto] bg-repeat opacity-20"
      />
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
                    // Sync the OTHER direction too (Adinda, 2026-07-21): the SubNav's LAYOUT/SPECS
                    // items disambiguate by hash, so an in-section tab click must update it or the
                    // SubNav keeps highlighting the stale one. replaceState = no scroll jump, no
                    // history entry; replaceState doesn't fire hashchange, so we dispatch it —
                    // the SubNav's hash store (and this section's own listener, a harmless no-op
                    // here) both re-read from it.
                    const hash = tab.id === 'specifications' ? '#specs' : '#layout'
                    window.history.replaceState(null, '', hash)
                    window.dispatchEvent(new HashChangeEvent('hashchange'))
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

          {/* The Layout tab is a stacked heading/description/image panel; Specifications is the
              two-column accordion. Same tabpanel wrapper, different body. */}
          <div
            role="tabpanel"
            id={`specs-panel-${active.id}`}
            aria-labelledby={`specs-tab-${active.id}`}
          >
            {active.id === 'layout' ? (
              <LayoutPanel rows={rows} imageStartIndex={layoutOffsets} onOpen={openLightbox} />
            ) : (
              // Two STABLE columns at lg, one below — see the header note on why this isn't CSS
              // `columns-2`. col2 is empty when a tab has a single row; flex-1 on an empty column
              // would still claim half the width, so it's only rendered when it has content.
              <div className="flex flex-col gap-8 page-gutter-x lg:flex-row lg:items-start lg:gap-80">
                <AccordionColumn rows={col1} openKey={resolvedOpenKey} onToggle={toggle} />
                {col2.length ? (
                  <AccordionColumn rows={col2} openKey={resolvedOpenKey} onToggle={toggle} />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gated on hasOpened so the dynamic chunk is never fetched until a visitor clicks a diagram. */}
      {hasOpened ? (
        <SiteLightbox
          open={lightboxIndex !== null}
          index={lightboxIndex ?? 0}
          slides={layoutSlides}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </section>
  )
}
