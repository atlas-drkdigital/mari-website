import { defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'

// Editor-managed categories (not a hardcoded options list) — Adinda wants to be able to add/rename
// blog categories without a code change, 2026-07-16. Same reasoning already applied to gallery
// categories elsewhere (MANAGER.md's "Gallery categories" note) — a managed list beats a fixed
// enum once the client owns adding to it. "Marine Life Guide" is one category value here, not its
// own page/document type.
export const blogCategoryType = defineType({
  name: 'blogCategory',
  title: 'Blog Category',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      components: { input: AutoSlugInput },
      description: 'Used for category filter URLs on the blog listing page.',
    }),
  ],
  preview: {
    select: { title: 'name' },
  },
})
