import { defineArrayMember, defineField, defineType } from 'sanity'

// Singleton (id "cta") — the shared "two-card" CTA section (Private Charter vs Shared Trip) reused
// across pages (destination, etc.). Lives in the Shared Components sidebar section alongside
// Announcements / Why Us / FAQ / Testimonials (Adinda's ask 2026-07-16). Nothing hardcoded — each
// card's heading, description, and button text are editable here.
export const ctaType = defineType({
  name: 'cta',
  title: 'CTA Section',
  type: 'document',
  description: 'The shared two-card call-to-action section reused across pages.',
  fields: [
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      description: 'Two cards, shown side by side.',
      validation: (Rule) => Rule.min(2).max(2),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'ctaCard',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
            defineField({ name: 'buttonText', type: 'string' }),
            defineField({ name: 'buttonLink', title: 'Button link', type: 'link' }),
            defineField({ name: 'image', type: 'imageWithAlt' }),
          ],
          preview: { select: { title: 'heading', subtitle: 'buttonText', media: 'image' } },
        }),
      ],
      initialValue: [
        {
          _key: 'privateCharter',
          _type: 'ctaCard',
          heading: 'Book a private charter',
          description:
            'Charter the entire boat for a private liveaboard adventure in Indonesia. Full itinerary flexibility, exclusive use, up to 14 guests.',
          buttonText: 'Find out more',
        },
        {
          _key: 'sharedTrip',
          _type: 'ctaCard',
          heading: 'Join a shared diving trip',
          description:
            "Join a scheduled dive cruise departure and dive Indonesia's best waters alongside fellow divers.",
          buttonText: 'Find a trip',
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'CTA Section' }),
  },
})
