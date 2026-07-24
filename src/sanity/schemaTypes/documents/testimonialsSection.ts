import { defineArrayMember, defineField, defineType } from 'sanity'

// Testimonials SHARED SECTION singleton (2026-07-23, Adinda's spec for the About build:
// "Testimonials — same as homepage. Needs to be componentized… TestimonialsSection separate").
// Third of the shared-section family (boatsSection / destinationsSection): the section's chrome +
// drag-curated testimonial list edited ONCE for every page that mounts it — homepage + About
// today, the Testimonials Page later. Replaces the testimonials* fields that lived on homePage
// (migrated by _scripts/migrate-testimonials-section.ts). Lives in the Testimonials folder
// (Secondary Pages) — topic beats abstraction, same as the other two.
export const testimonialsSectionType = defineType({
  name: 'testimonialsSection',
  title: 'Testimonials Section',
  type: 'document',
  description: 'The testimonials section shown across pages — edited once, changes everywhere.',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'linkText',
      title: 'Link text',
      type: 'string',
      description: 'Text of the link to the testimonials page.',
    }),
    defineField({
      name: 'testimonialItems',
      title: 'Testimonials',
      type: 'array',
      description: 'Drag to set the order. A testimonial left off this list is hidden from the section (the future testimonials page shows every testimonial regardless).',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
    }),
  ],
  preview: {
    select: { items: 'testimonialItems' },
    prepare({ items }) {
      const n = Array.isArray(items) ? items.length : 0
      return { title: 'Testimonials Section', subtitle: `${n} testimonial${n === 1 ? '' : 's'} shown` }
    },
  },
})
