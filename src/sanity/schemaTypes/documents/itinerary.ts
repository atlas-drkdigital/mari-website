import { defineArrayMember, defineField, defineType } from 'sanity'

// Stub only, per locked scope (mari-project skill / CLAUDE.md): itineraries are listed on the
// Schedule & Rates page and referenced from their destination page, but individual itinerary
// pages are NOT clickable/published at launch — full itinerary detail pages are a future paid
// add-on. This shell exists so the list/reference use case works, not to render a full page.
export const itineraryType = defineType({
  name: 'itinerary',
  title: 'Itinerary',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'e.g. "Komodo to Badas"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'reference',
      to: [{ type: 'destination' }],
    }),
    defineField({
      name: 'duration',
      type: 'string',
      description: 'e.g. "11 nights"',
    }),
    defineField({
      name: 'route',
      type: 'string',
      description: 'e.g. "Labuan Bajo to Badas"',
    }),
    defineField({
      name: 'highlights',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Short bullet points shown on the itinerary card.',
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'duration' },
  },
})
