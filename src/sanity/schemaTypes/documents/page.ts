import { defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'

// Generic simple page — title, slug, rich text body. Terms & Conditions is one entry of this
// type, not its own schema. `body` uses the shared `richTextFull` type (Tier 3 of the locked
// content model, see CLAUDE.md) — same editor as any other full-rich-text field; update
// richTextFull.ts once, every field using it updates together.
export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content' }),
    // Slug order locked 2026-07-15: short name/title, then slug, immediately after — same order
    // for every page type, not a settings-tab afterthought.
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      components: { input: AutoSlugInput },
      group: 'content',
      description: 'URL path for this page.',
    }),
    defineField({
      name: 'body',
      type: 'richTextFull',
      group: 'content',
    }),
    defineField({
      name: 'showContactSection',
      title: 'Show "Talk to Us" section at bottom',
      type: 'boolean',
      initialValue: true,
      group: 'content',
    }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
    // Localization prep — inert until the document-internationalization plugin is installed.
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true, group: 'content' }),
  ],
})
