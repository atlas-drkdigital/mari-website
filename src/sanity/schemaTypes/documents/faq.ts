import { defineField, defineType } from 'sanity'

// Built as a real shell (not a bare stub) per Adinda's explicit ask 2026-07-15/16, so the shape
// is visible in Studio for review — but the taxonomy is NOT locked. MANAGER.md's standing
// decision: build FAQ scope on one real page first, test it, refine, then carry the refined
// pattern forward. Treat every field below as a first pass, not a final spec.
//
// `category` list matches the three groupings already locked in the Destination Page spec
// (mari-project skill's references/website.md) — "Traveling to [Destination]" / "Diving" /
// "The Liveaboard" — reused here rather than invented, since that's the one place this taxonomy
// was actually designed against real content.
export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      type: 'richTextBasic',
    }),
    defineField({
      name: 'category',
      type: 'string',
      description: 'Topic grouping used for tabs/accordion groups on FAQ hub pages.',
      options: {
        list: ['Traveling', 'Diving', 'The Liveaboard'],
      },
    }),
    defineField({
      name: 'scope',
      title: 'Applies to',
      type: 'string',
      description: 'What this question is about — controls whether it shows on the general FAQ hub or a specific destination/boat page.',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Destination-specific', value: 'destination' },
          { title: 'Boat-specific', value: 'boat' },
        ],
        layout: 'radio',
      },
      initialValue: 'general',
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'reference',
      to: [{ type: 'destination' }],
      hidden: ({ parent }) => parent?.scope !== 'destination',
    }),
    defineField({
      name: 'boat',
      title: 'Boat',
      type: 'reference',
      to: [{ type: 'boat' }],
      hidden: ({ parent }) => parent?.scope !== 'boat',
    }),
  ],
  preview: {
    select: { title: 'question', subtitle: 'category' },
  },
})
