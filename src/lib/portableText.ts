import type { PortableTextBlock } from 'sanity'

// Portable Text → plain string, for JSON-LD only (schema.org answers/descriptions are plain text,
// never markup). Shared by the boat page + homepage FAQPage blocks so they can't diverge.
export function toPlainText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return ''
  return (blocks as PortableTextBlock[])
    .map((b) =>
      b && typeof b === 'object' && 'children' in b && Array.isArray((b as { children: unknown[] }).children)
        ? (b as { children: { text?: string }[] }).children.map((c) => c.text ?? '').join('')
        : '',
    )
    .join('\n\n')
    .trim()
}
