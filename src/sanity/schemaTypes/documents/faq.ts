import { defineField, defineType } from 'sanity'

// Two taxonomies, split by `scope` (the "generalCategory vs destinationCategory" model from
// atlas-website): the general FAQ HUB (and the boat page's filtered FAQ) uses a 5-category set;
// each DESTINATION page's FAQ uses a separate 3-category set — Diving / Traveling / General
// Information (matches the Figma destination mockup 778:8608 and atlas-website). The right category
// field shows based on `scope`. One document type, one place to manage — no duplicated structure.
// Still first-pass, not locked; refine as the FAQ page gets built on a real page.
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
      name: 'scope',
      title: 'Applies to',
      type: 'string',
      description: 'What this question is about — controls whether it shows on the general FAQ hub or a specific destination/boat page, and which category set applies.',
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
      name: 'generalCategory',
      title: 'Category',
      type: 'string',
      description: 'Topic grouping for the FAQ hub and the boat page.',
      options: {
        list: [
          'General',
          'Boat & Diving',
          'Booking & Payment',
          "What's Included",
          'Travel & Documents',
        ],
      },
      hidden: ({ parent }) => parent?.scope === 'destination',
    }),
    defineField({
      name: 'destinationCategory',
      title: 'Category',
      type: 'string',
      description: 'Topic grouping shown on the destination page FAQ.',
      options: {
        list: ['Diving', 'Traveling', 'General Information'],
      },
      hidden: ({ parent }) => parent?.scope !== 'destination',
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
    select: { title: 'question', subtitle: 'scope' },
  },
})
