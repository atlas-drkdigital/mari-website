import { defineField, defineType } from 'sanity'

// Own document type (not an inline array on homePage), 2026-07-16, Adinda's ask — image +
// headline + description per card. homePage.whyUsItems references these, constrained to 2-4 (see
// homePage.ts) rather than allowing an unbounded array.
export const whyUsItemType = defineType({
  name: 'whyUsItem',
  title: 'Why Us Item',
  type: 'document',
  fields: [
    defineField({ name: 'image', type: 'imageWithAlt' }),
    defineField({ name: 'headline', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', type: 'richTextBasic' }),
  ],
  preview: {
    select: { title: 'headline', media: 'image' },
  },
})
