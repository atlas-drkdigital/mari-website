import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'

// Shared renderer for tier-2 rich text (richTextBasic): paragraphs + bold/italic/link + bullet
// lists (see CLAUDE.md's Portable Text tiers). Layout/spacing is governed by the PARENT (e.g. a
// flex column with gap), so blocks render as bare <p>/<ul> with no imposed margins here.
const components: PortableTextComponents = {
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a href={value?.href} className="underline" target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="flex list-disc flex-col gap-4 pl-20">{children}</ul>,
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
