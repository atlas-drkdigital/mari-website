import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'

import { RichTextImage, type RichTextImageValue } from '@/components/RichTextImage'

// Shared renderer for BOTH rich-text tiers (see CLAUDE.md's Portable Text tiers):
//   tier 2 `richTextBasic` — Normal + bold/italic/link + bullet lists
//   tier 3 `richTextFull`  — H1–H6 + Normal + Quote, bold/italic/underline/strike/code, an align
//                            annotation, an inline image (size + alignment), and an htmlEmbed
// A tier-2 field never emits the tier-3 blocks, so one component serves both safely.
//
// Layout/spacing is governed by the PARENT (e.g. a flex column with gap) — blocks carry no imposed
// margins, with ONE deliberate exception: editorial headings get `mt-8` (see HEADING_SPACING).
//
// PARAGRAPH-SPACING RULE (Adinda, 2026-07-21): because blocks carry no margins, every wrapper
// around <RichText> MUST be a flex column with a gap, or multi-paragraph copy renders as one
// unseparated wall (found live in the boat FAQ). The values, stepped with the type size:
//   body-large  → `flex flex-col gap-16`
//   body-medium → `flex flex-col gap-12`
// A wrapper whose text size is responsive steps the gap with it (`gap-12 lg:gap-16`).
//
// Why the exception (Adinda, 2026-07-17). A parent `gap` is SYMMETRIC — it puts the same space above
// a heading as below it. Typographically that's wrong: a heading belongs to the text that FOLLOWS
// it, so it needs more space above than below, or it floats between two paragraphs looking equally
// attached to both. A gap alone cannot express that asymmetry; only a margin on the heading can.
// mt-8 (8px) rides on top of the parent's gap, so in a gap-16 column a heading gets 24px above and
// 16px below. `first:mt-0` keeps the first block flush — a leading margin would push the whole rich
// text off its container's top edge and desync it from whatever sits beside it.
// 8 IS on the spacing scale, so `mt-8` is a real utility (unlike a hypothetical `mt-40`).
//
// ⚠️ HEADINGS USE THE **EDITORIAL** RAMP, NOT DISPLAY (Adinda, 2026-07-17). The two are not
// interchangeable and picking by number alone is the trap:
//   display-*   — headings that ANCHOR a section (page H1, section H2). Large, tight leading,
//                 negative tracking. Set by a COMPONENT, never by an editor.
//   editorial-* — headings WITHIN body copy, which is exactly what rich text is. Smaller, looser
//                 leading, sized to sit beside paragraphs without shouting over them.
// An editor typing "H3" in a rich-text box means an article subheading → editorial-h3. display-h3
// there would render a body subheading at section-title scale.
//
// ⚠️ EVERY option richTextFull offers is rendered here, deliberately. Before 2026-07-17 this file
// had NO block styles and handled 3 of 5 marks, and never rendered the inline image or the
// htmlEmbed at all — so an editor could apply H3, underline, strike, code, an alignment, or drop in
// an image, and see NOTHING change on the page. A control the CMS offers and the frontend ignores
// is worse than a missing feature: it looks like it works. **If a style/mark/member is added to
// richTextFull, add it here in the same pass.**
// (Text colour is deliberately absent from the schema — "not resolved yet" — so there's nothing to
// render for it. That's a schema decision, not a gap here.)

const ALIGN_CLASS: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

// Alignment is stored as an ANNOTATION (in markDefs), not a block style — that's what lets a
// heading keep its h1–h6 style AND be aligned (see alignAnnotation.tsx). So it can't be read off
// `style`; it has to be resolved from the block's own markDefs via its children's marks.
type BlockValue = {
  markDefs?: { _key?: string; _type?: string; align?: string }[]
  children?: { marks?: string[] }[]
}
function alignClassOf(value: unknown): string {
  const block = value as BlockValue | undefined
  const defs = block?.markDefs
  if (!defs?.length) return ''
  const marks = new Set((block?.children ?? []).flatMap((c) => c.marks ?? []))
  const def = defs.find((d) => d._type === 'align' && d._key && marks.has(d._key))
  return def?.align ? ALIGN_CLASS[def.align] ?? '' : ''
}

// Extra space ABOVE every editorial heading, on top of whatever gap the parent sets. `first:mt-0`
// so a heading opening a rich-text block stays flush with the container. See the header note for
// why this is a margin and not the parent's gap.
const HEADING_SPACING = 'mt-8 first:mt-0'

// @sanity/table's row shape — see richTextFull.ts's `table` member.
type TableRow = { _key: string; cells: string[] }
type TableValue = { rows?: TableRow[] }

const components: PortableTextComponents = {
  block: {
    normal: ({ children, value }) => <p className={alignClassOf(value)}>{children}</p>,
    h1: ({ children, value }) => (
      <h1 className={`${HEADING_SPACING} text-editorial-h1 text-text-primary ${alignClassOf(value)}`}>{children}</h1>
    ),
    h2: ({ children, value }) => (
      <h2 className={`${HEADING_SPACING} text-editorial-h2 text-text-primary ${alignClassOf(value)}`}>{children}</h2>
    ),
    h3: ({ children, value }) => (
      <h3 className={`${HEADING_SPACING} text-editorial-h3 text-text-primary ${alignClassOf(value)}`}>{children}</h3>
    ),
    h4: ({ children, value }) => (
      <h4 className={`${HEADING_SPACING} text-editorial-h4 text-text-primary ${alignClassOf(value)}`}>{children}</h4>
    ),
    h5: ({ children, value }) => (
      <h5 className={`${HEADING_SPACING} text-editorial-h5 text-text-primary ${alignClassOf(value)}`}>{children}</h5>
    ),
    h6: ({ children, value }) => (
      <h6 className={`${HEADING_SPACING} text-editorial-h6 text-text-primary ${alignClassOf(value)}`}>{children}</h6>
    ),
    blockquote: ({ children, value }) => (
      <blockquote
        className={`border-l-2 border-accent-muted pl-24 text-editorial-quote-text text-text-primary ${alignClassOf(value)}`}
      >
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    'strike-through': ({ children }) => <span className="line-through">{children}</span>,
    code: ({ children }) => (
      <code className="rounded-sm bg-bg-surface px-4 py-2 font-mono text-[0.9em]">{children}</code>
    ),
    // The align annotation is consumed at BLOCK level (see alignClassOf). Rendering it as a
    // pass-through here stops @portabletext/react warning about an unknown mark, and avoids
    // wrapping the text in a stray span. alignAnnotation.tsx notes that a Fragment-returning
    // annotation component corrupts the editor's DOM — this is the render side, not the editor,
    // but keeping it a plain pass-through avoids the whole class of problem.
    align: ({ children }) => <>{children}</>,
    link: ({ value, children }) => {
      // Only EXTERNAL urls open in a new tab. The blanket target="_blank" this replaces threw
      // internal links into a new tab too, which is disorienting and drops client-side nav.
      const href: string = value?.href ?? ''
      const external = /^https?:\/\//i.test(href)
      return (
        <a
          href={href}
          className="text-text-link underline transition-colors duration-300 ease-in-out hover:text-text-linkhover"
          {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => <ul className="flex list-disc flex-col gap-4 pl-20">{children}</ul>,
    number: ({ children }) => <ol className="flex list-decimal flex-col gap-4 pl-20">{children}</ol>,
  },
  types: {
    // Inline image — richTextFull's second array member. Extracted to RichTextImage (client)
    // 2026-07-23 when it gained click-to-zoom (opens the site lightbox); size/alignment/caption
    // behaviour unchanged, see that file.
    image: ({ value }: { value: RichTextImageValue }) => <RichTextImage value={value} />,
    // Raw HTML embed — richTextFull's third member. Author-supplied markup from Studio (booking
    // widgets, maps). dangerouslySetInnerHTML is the point of the field; the trust boundary is
    // Studio access, which is the same boundary that already governs every other field.
    htmlEmbed: ({ value }: { value: { html?: string } }) =>
      value?.html ? <div dangerouslySetInnerHTML={{ __html: value.html }} /> : null,
    // Table — richTextFull's fourth member, added 2026-07-24 for the Onboard Pricing tables (see
    // richTextFull.ts). Shape from @sanity/table: `{ rows: [{ _key, cells: string[] }, ...] }` — no
    // separate header flag, so by convention (matches every table this plugin has seeded so far) the
    // FIRST row is the header. `overflow-x-auto` is the responsive guard: a 2-column price table must
    // scroll horizontally on a phone rather than force the whole page wide (locked responsive-table
    // rule, CLAUDE.md). Token classes only (verified against globals.css) — FIRST PASS, Adinda will
    // iterate the visual treatment on sight; the structural part (real table/thead/tbody/th/td) is
    // what's load-bearing here, not the exact shade.
    table: ({ value }: { value: TableValue }) => {
      const [headerRow, ...bodyRows] = value?.rows ?? []
      if (!headerRow) return null
      return (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse border border-border-default text-body-medium text-text-primary">
            <thead>
              <tr className="bg-bg-accent-secondary">
                {headerRow.cells.map((cell, i) => (
                  <th
                    key={`${headerRow._key}-${i}`}
                    scope="col"
                    className="border border-border-default px-16 py-12 text-left font-bold text-text-primary"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {bodyRows.map((row) => (
                <tr key={row._key}>
                  {row.cells.map((cell, i) => (
                    <td key={`${row._key}-${i}`} className="border border-border-subtle px-16 py-12 text-left">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
  },
}

export function RichText({ value }: { value?: PortableTextBlock[] | null }) {
  if (!value?.length) return null
  return <PortableText value={value} components={components} />
}

// Flatten rich text to a plain string — for the few places that render into a single text node
// (e.g. the Why Us card description, whose hover-reveal animation measures one <p>). Loses marks,
// which is fine for those short one-line fields.
type SpanChild = { text?: string }
export function toPlainText(value?: PortableTextBlock[] | null): string {
  if (!value?.length) return ''
  return value
    .map((block) =>
      block._type === 'block' && Array.isArray((block as { children?: SpanChild[] }).children)
        ? (block as { children: SpanChild[] }).children.map((c) => c.text ?? '').join('')
        : '',
    )
    .join('\n\n')
    .trim()
}
