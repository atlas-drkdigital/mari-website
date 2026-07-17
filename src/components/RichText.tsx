import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'

// Shared renderer for BOTH rich-text tiers (see CLAUDE.md's Portable Text tiers):
//   tier 2 `richTextBasic` — Normal + bold/italic/link + bullet lists
//   tier 3 `richTextFull`  — H1–H6 + Normal + Quote, bold/italic/underline/strike/code, alignment
// A tier-2 field simply never emits the tier-3 blocks, so one component serves both safely.
//
// Layout/spacing is governed by the PARENT (e.g. a flex column with gap), so blocks render with no
// imposed margins here.
//
// ⚠️ HEADINGS USE THE **EDITORIAL** RAMP, NOT DISPLAY (Adinda, 2026-07-17). The two ramps are not
// interchangeable and picking by number alone is the trap:
//   display-*   — marketing headings that ANCHOR a section (the page H1, a section H2). Large,
//                 tight leading, negative tracking. Set by a COMPONENT, never by an editor.
//   editorial-* — headings WITHIN body copy, which is exactly what rich text is. Smaller, looser
//                 leading, sized to sit next to paragraphs without shouting over them.
// An editor typing "H3" in a rich-text box means an article subheading, so it maps to
// editorial-h3. Using display-h3 there would render a body subheading at section-title scale.
//
// This was previously missing ENTIRELY — no `block` styles at all, so every h1–h6 fell through to
// a bare tag. Tailwind's preflight resets heading tags to inherit, so they rendered as plain body
// text: an editor could apply H3 in Studio and see nothing change on the page. Found 2026-07-17 by
// seeding a body with real headings — the first time any rich-text heading reached a page.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h1: ({ children }) => <h1 className="text-editorial-h1 text-text-primary">{children}</h1>,
    h2: ({ children }) => <h2 className="text-editorial-h2 text-text-primary">{children}</h2>,
    h3: ({ children }) => <h3 className="text-editorial-h3 text-text-primary">{children}</h3>,
    h4: ({ children }) => <h4 className="text-editorial-h4 text-text-primary">{children}</h4>,
    h5: ({ children }) => <h5 className="text-editorial-h5 text-text-primary">{children}</h5>,
    h6: ({ children }) => <h6 className="text-editorial-h6 text-text-primary">{children}</h6>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent-muted pl-24 text-editorial-quote-text text-text-primary">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    // underline / strike-through / code are offered by richTextFull's schema but were never
    // rendered — an editor could apply them and see nothing. `code` uses a neutral surface rather
    // than a colour token, since it carries no brand meaning.
    underline: ({ children }) => <span className="underline">{children}</span>,
    'strike-through': ({ children }) => <span className="line-through">{children}</span>,
    code: ({ children }) => (
      <code className="rounded-sm bg-bg-surface px-4 py-2 font-mono text-[0.9em]">{children}</code>
    ),
    link: ({ value, children }) => {
      // Only open EXTERNAL links in a new tab. The blanket target="_blank" this replaces sent
      // internal links off into a new tab too, which is disorienting and drops client-side nav.
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
