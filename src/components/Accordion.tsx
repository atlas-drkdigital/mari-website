import type { ReactNode } from 'react'

// Shared accordion primitives (componentization pass, 2026-07-21). Extracted from the byte-identical
// duplication across Faq / BoatFaq / BoatSpecs. See COMPONENTS.md for the contract + why this is TWO
// pieces (a shared chevron primitive + a FAQ row variant) rather than one over-parameterised component:
// the FAQ rows (ondark, active = size swap) and the Specs row (light, active = weight+colour, stable
// height) genuinely diverge, so only the LOCKED chevron glyph is truly shared across all three.

// ── AccordionChevron ─────────────────────────────────────────────────────────────────────────────
// THE locked accordion chevron (CLAUDE.md Styling, Adinda 2026-07-21): an h-[6.5px] w-[10px] glyph with
// [mask-size:100%_100%] inside a size-[20px] centring box, masking icon-nav-chevron.svg, rotating 180°
// when open. NEVER size-[10px] + contain — that renders the mask ~7.6px tall and reads elongated (5.5px
// was tried and read as a pancake; full tuning history in BoatSpecs' git blame). The GEOMETRY lives here
// so every accordion site-wide is uniform by construction. Colour + which transitions run are the only
// per-context differences and are passed in via `className`:
//   • FAQ rows (ondark): "bg-text-ondark-primary [transition:transform_…]" — transform only.
//   • Specs row (light): recolours accent-subtle→action-primary, so it also transitions background-color.
export function AccordionChevron({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className="flex size-[20px] shrink-0 items-center justify-center">
      <span
        className={`block h-[6.5px] w-[10px] [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%_100%] ${open ? 'rotate-180' : ''} ${className}`}
      />
    </span>
  )
}

// ── FaqAccordionItem ─────────────────────────────────────────────────────────────────────────────
// One row of the ondark FAQ accordion — shared by the homepage Faq (default layout) and the boat
// BoatFaq (categorized layout), and reused by the Destination FAQ. Owns the wrapper, the h3>button
// header, the title (active swaps to editorial-h5, per the FAQ variant), the chevron, and the
// grid-template-rows collapse. The ANSWER is passed as children so each caller supplies its own content
// (a plain <p> of pre-flattened text on the homepage, a <RichText> in a gap column on the boat page) —
// the component just wraps it in the overflow-hidden collapse panel.
//
// Locked contract (CLAUDE.md Styling): only one item open at a time is the CALLER's concern (single
// openId + toggle); hover = the active row's COLOUR treatment only (border + opacity), never its
// size/rotation/expansion; button pattern, NOT <details>/<summary> (no SEO gain — do not "upgrade").
export function FaqAccordionItem({
  question,
  open,
  onToggle,
  id,
  children,
}: {
  question: string
  open: boolean
  onToggle: () => void
  /** Optional citable anchor id (boat FAQ derives one from the question text). */
  id?: string
  /** The answer content, already styled by the caller (plain <p> or a RichText gap column). */
  children: ReactNode
}) {
  return (
    <div
      id={id}
      /* Hover = the active row's COLOUR treatment only — border + opacity, no size/rotation/expansion
         (Adinda, 2026-07-21; site-wide accordion rule, see CLAUDE.md). */
      className={`mb-8 flex flex-col border-b-[0.75px] py-12 [transition:opacity_500ms_cubic-bezier(0.65,0,0.35,1),border-color_500ms_cubic-bezier(0.65,0,0.35,1)] ${
        open
          ? 'border-border-onimage-primary'
          : 'border-accent-ondark-subtle opacity-80 hover:border-border-onimage-primary hover:opacity-100'
      }`}
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-8 text-left"
        >
          <span
            className={`flex-1 text-text-ondark-primary [transition:color_500ms_cubic-bezier(0.65,0,0.35,1)] ${
              open ? 'text-editorial-h5' : 'text-body-large'
            }`}
          >
            {question}
          </span>
          <AccordionChevron
            open={open}
            className="bg-text-ondark-primary [transition:transform_500ms_cubic-bezier(0.65,0,0.35,1)]"
          />
        </button>
      </h3>
      <div
        className={`grid [transition:grid-template-rows_500ms_cubic-bezier(0.65,0,0.35,1)] ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
