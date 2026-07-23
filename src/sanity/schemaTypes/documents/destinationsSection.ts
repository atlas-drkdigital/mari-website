import { defineArrayMember, defineField, defineType } from 'sanity'

// "Destinations" carousel SHARED SECTION singleton (2026-07-23, Adinda — the boatsSection twin,
// living in the Destinations folder). The drag-ordered reference array is BOTH controls in one:
// drag = display order, leaving a destination out = hidden from the carousel. Same curation model
// as destination.itineraries (locked 2026-07-22 — no numeric order field, do not reintroduce).
//
// Scope: this governs the Destinations CAROUSEL section (homepage + Private Charters). It does
// NOT govern the hero search or the contact form's dropdown — those deliberately list every
// destination. The old numeric `destination.order` field still sorts those all-lists; its
// retirement is a queued follow-up, not done in this pass.
export const destinationsSectionType = defineType({
  name: 'destinationsSection',
  title: 'Destinations Section',
  type: 'document',
  description: 'The destinations carousel shown across pages — edited once, changes everywhere.',
  fields: [
    defineField({
      name: 'destinations',
      title: 'Destinations',
      type: 'array',
      description:
        'Drag to set the order the carousel shows destinations in. A destination left off this list is hidden from the carousel (it stays available everywhere else, like the contact form).',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'destination' }] })],
    }),
  ],
  preview: {
    select: { destinations: 'destinations' },
    prepare({ destinations }) {
      const n = Array.isArray(destinations) ? destinations.length : 0
      return { title: 'Destinations Section', subtitle: `${n} destination${n === 1 ? '' : 's'} in the carousel` }
    },
  },
})
