import { defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'

// INSEANQ is a copy-paste embed, not a real integration — see MANAGER.md.
// Sidebar layout question deliberately deprioritized; ship the simple layout.
export const scheduleRatesType = defineType({
  name: 'scheduleRates',
  title: 'Schedule & Rates',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content' }),
    defineField({
      name: 'embedCode',
      title: 'INSEANQ embed code',
      type: 'text',
      rows: 8,
      group: 'content',
    }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      components: { input: AutoSlugInput },
      group: 'settings',
    }),
  ],
})
