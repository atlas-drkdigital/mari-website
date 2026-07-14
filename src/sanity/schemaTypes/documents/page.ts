import { defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'

// Generic simple page — title, slug, one rich text body. Terms & Conditions is
// one entry of this type, not its own schema. Body is plain default Portable
// Text today (tier-2 shape); heading/alignment customization (tier-3) is
// deferred per CLAUDE.md's content-modeling rule.
export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content' }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }], group: 'content' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      components: { input: AutoSlugInput },
      group: 'settings',
    }),
    // Localization prep — inert until the document-internationalization plugin is installed.
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true, group: 'settings' }),
  ],
})
