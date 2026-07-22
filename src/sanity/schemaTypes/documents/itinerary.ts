import { defineArrayMember, defineField, defineType } from 'sanity'

// Stub only, per locked scope (mari-project skill / CLAUDE.md): itineraries are listed on the
// Schedule & Rates page and referenced from their destination page, but individual itinerary
// pages are NOT clickable/published at launch — full itinerary detail pages are a future paid
// add-on. Content/SEO groups + titled fieldsets added for form consistency (site-wide convention)
// even though it's a stub; SEO included per Adinda's ask 2026-07-16.
export const itineraryType = defineType({
  name: 'itinerary',
  title: 'Itinerary',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fieldsets: [
    { name: 'contentFs', title: 'Content' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'e.g. "Komodo to Badas"',
      validation: (Rule) => Rule.required(),
      group: 'content',
      fieldset: 'contentFs',
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'reference',
      to: [{ type: 'destination' }],
      group: 'content',
      fieldset: 'contentFs',
    }),
    // season + image + order added 2026-07-22 for the destination-page itinerary cards (Figma
    // 778:8688): the card's key-info line is "{season} ✦ {duration}", each card has its own
    // photo, and drag-order isn't available across separate documents so `order` is a number.
    defineField({ name: 'season', type: 'string', description: 'e.g. "May to June"', group: 'content', fieldset: 'contentFs' }),
    defineField({ name: 'duration', type: 'string', description: 'e.g. "11 nights"', group: 'content', fieldset: 'contentFs' }),
    defineField({ name: 'route', type: 'string', description: 'e.g. "Labuan Bajo to Badas"', group: 'content', fieldset: 'contentFs' }),
    defineField({
      name: 'image',
      title: 'Card image',
      type: 'imageWithAlt',
      description: 'Shown on this itinerary’s card. Recommended: portrait, at least 1000px wide.',
      group: 'content',
      fieldset: 'contentFs',
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Controls the order itineraries appear on their destination page (lower first).',
      group: 'content',
      fieldset: 'contentFs',
    }),
    defineField({
      name: 'highlights',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Short bullet points shown on the itinerary card.',
      group: 'content',
      fieldset: 'contentFs',
    }),
    defineField({ name: 'summary', type: 'text', rows: 3, group: 'content', fieldset: 'contentFs' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'duration' },
  },
})
