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
    { name: 'seoFs', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content', fieldset: 'contentFs' }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      components: { input: AutoSlugInput },
      group: 'content',
      fieldset: 'contentFs',
      description: 'URL path for this page.',
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
    defineField({ name: 'seo', type: 'seo', group: 'seo', fieldset: 'seoFs' }),
    // Localization prep — inert until the document-internationalization plugin is installed.
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true, group: 'content', fieldset: 'contentFs' }),
  ],
})
