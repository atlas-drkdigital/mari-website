import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'
import Image from 'next/image'

import { sanityImageProps, type SanityImageWithMeta } from '@/sanity/lib/image'

// Shared renderer for BOTH rich-text tiers (see CLAUDE.md's Portable Text tiers):
//   tier 2 `richTextBasic` — Normal + bold/italic/link + bullet lists
//   tier 3 `richTextFull`  — H1–H6 + Normal + Quote, bold/italic/underline/strike/code, an align
//                            annotation, an inline image (size + alignment), and an htmlEmbed
// A tier-2 field never emits the tier-3 blocks, so one component serves both safely.
//
// Layout/spacing is governed by the PARENT (e.g. a flex column with gap) — blocks carry no imposed
// margins, with ONE deliberate exception: editorial headings get `mt-8` (see HEADING_SPACING).
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

const IMAGE_SIZE: Record<string, string> = {
  full: 'w-full',
  large: 'w-full lg:w-3/4',
  medium: 'w-full lg:w-1/2',
  small: 'w-full lg:w-1/3',
}

// `center` maps to mx-auto rather than a text-align: the image is a block, so it's centred by its
// own margins, not by its parent's text alignment.
const IMAGE_ALIGN: Record<string, string> = {
  center: 'mx-auto',
  left: 'mr-auto',
  right: 'ml-auto',
}

type InlineImageValue = SanityImageWithMeta & {
  caption?: string
  size?: string
  alignment?: string
}

// Extra space ABOVE every editorial heading, on top of whatever gap the parent sets. `first:mt-0`
// so a heading opening a rich-text block stays flush with the container. See the header note for
// why this is a margin and not the parent's gap.
const HEADING_SPACING = 'mt-8 first:mt-0'

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
    // Inline image — richTextFull's second array member. Size and alignment are editor choices on
    // the block itself. Sizing only applies from lg up: a "33%" image on a phone is unreadable, so
    // every size is full-width on mobile.
    image: ({ value }: { value: InlineImageValue }) => {
      if (!value?.asset?._ref) return null
      const width = IMAGE_SIZE[value.size ?? 'full'] ?? IMAGE_SIZE.full
      const align = IMAGE_ALIGN[value.alignment ?? 'center'] ?? IMAGE_ALIGN.center
      return (
        <figure className={`flex flex-col gap-8 ${width} ${align}`}>
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <Image
              {...sanityImageProps(value, '/assets/placeholder-photo.svg')}
              alt={value.alt ?? ''}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {value.caption ? (
            <figcaption className="text-caption-label text-text-secondary">{value.caption}</figcaption>
          ) : null}
        </figure>
      )
    },
    // Raw HTML embed — richTextFull's third member. Author-supplied markup from Studio (booking
    // widgets, maps). dangerouslySetInnerHTML is the point of the field; the trust boundary is
    // Studio access, which is the same boundary that already governs every other field.
    htmlEmbed: ({ value }: { value: { html?: string } }) =>
      value?.html ? <div dangerouslySetInnerHTML={{ __html: value.html }} /> : null,
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
