import { defineField, defineType } from 'sanity'

// Shell, 2026-07-16 — bio/photo are a reasonable first-pass shape for a byline; adjust once the
// blog build actually needs more (e.g. a role/title, social links).
export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'photo', type: 'imageWithAlt' }),
    defineField({ name: 'bio', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'name', media: 'photo' },
  },
})
