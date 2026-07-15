import { defineType } from 'sanity'

// Tier 2 of the locked 3-tier content model (CLAUDE.md, revised 2026-07-15 to include bullet
// lists) — most body copy: overview paragraphs, cabin/gallery descriptions, FAQ answers, spec
// summaries. Paragraph + bold/italic/link + bullet lists — no heading styles or alignment
// override, layout/CSS still governs presentation. Tier 3 (headings + alignment) stays inlined
// per-field (see page.ts's `body`) until a second tier-3 field actually needs it.
export const richTextBasicType = defineType({
  name: 'richTextBasic',
  title: 'Text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{ name: 'href', type: 'url', title: 'URL' }],
          },
        ],
      },
    },
  ],
})
