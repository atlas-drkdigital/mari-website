import { defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'

// Generic simple page — title, slug, rich text body. Terms & Conditions is one entry of this
// type, not its own schema. `body` uses the shared `richTextFull` type (Tier 3 of the content
// model). Groups mirrored by titled fieldsets (site-wide convention) so section headers show in
// "All Fields".
export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fieldsets: [
    { name: 'contentFs', title: 'Content' },
  ],
  fields: [
    // title + slug are REQUIRED here (added with the /terms slice, 2026-07-24) because the route
    // is literally built from them: `src/app/[slug]` resolves the document BY slug and renders the
    // title as the page's only H1. A page missing either is not an incomplete document, it is an
    // unreachable or heading-less URL — the one case where validation is load-bearing rather than
    // tidiness. Everything else on this type stays optional.
    defineField({ name: 'title', type: 'string', group: 'content', fieldset: 'contentFs', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      components: { input: AutoSlugInput },
      group: 'content',
      fieldset: 'contentFs',
      description: 'URL path for this page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'body', type: 'richTextFull', group: 'content', fieldset: 'contentFs' }),
    defineField({
      name: 'showContactSection',
      title: 'Show "Talk to Us" section at bottom',
      type: 'boolean',
      initialValue: true,
      group: 'content',
      fieldset: 'contentFs',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    // Localization prep — inert until the document-internationalization plugin is installed.
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true, group: 'content', fieldset: 'contentFs' }),
  ],
})
