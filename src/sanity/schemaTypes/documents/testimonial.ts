import { defineField, defineType } from 'sanity'

// Fields mirror what's already hardcoded in Testimonials.tsx (name/date/title/text) so the real
// draft reviews there can migrate in as-is once this is wired up — not a new content shape.
// Appears on BOTH the homepage and the About page (same component, confirmed 2026-07-15) — not
// homepage-only, so this is its own document type rather than a homePage field.
export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Guest name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'date', type: 'date' }),
    defineField({ name: 'title', title: 'Headline', type: 'string' }),
    defineField({ name: 'text', title: 'Review text', type: 'text', rows: 5 }),
    defineField({ name: 'rating', type: 'number', initialValue: 5, validation: (Rule) => Rule.min(1).max(5) }),
    defineField({ name: 'photo', title: 'Guest photo', type: 'imageWithAlt', description: 'Optional.' }),
    defineField({
      name: 'tripAdvisorEmbedCode',
      title: 'TripAdvisor link/embed',
      type: 'text',
      rows: 3,
      description: 'Optional. If present, the card\'s "Read more" button becomes "View on TripAdvisor" and links out directly instead of expanding inline.',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'title' },
  },
})
