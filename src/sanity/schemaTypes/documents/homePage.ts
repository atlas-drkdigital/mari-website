import { defineArrayMember, defineField, defineType } from 'sanity'

// Singleton shell only — homepage content is still 100% hardcoded in components (Hero, TheBoat,
// WhyUs, Destinations, LatestArticles, Cta, Contact — see src/app/page.tsx for the locked
// section order). This document exists so the page appears in Studio's structure and the
// section list is visible; per-section field depth is deliberately NOT built out yet — that's
// its own future pass ("wire the homepage to Sanity", CLAUDE.md's roadmap), not this shell.
// Faq and Testimonials sections have no fields here at all: they pull from `faq` (scope:
// 'general') and `testimonial` documents directly, not from homePage content.
export const homePageType = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'theBoat', title: 'The Boat' },
    { name: 'whyUs', title: 'Why Us' },
    { name: 'destinations', title: 'Destinations' },
    { name: 'latestArticles', title: 'Latest Articles' },
    { name: 'cta', title: 'CTA' },
    { name: 'contact', title: 'Contact' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'heroHeading', type: 'string', group: 'hero' }),
    defineField({ name: 'heroSubheading', type: 'text', rows: 2, group: 'hero' }),

    defineField({ name: 'theBoatHeading', type: 'string', group: 'theBoat' }),
    defineField({ name: 'theBoatBody', type: 'richTextBasic', group: 'theBoat' }),

    defineField({ name: 'whyUsHeading', type: 'string', group: 'whyUs' }),
    // References `whyUsItem` documents (own type, 2026-07-16 — each card is image + headline +
    // description) rather than an inline array, so the same card could be reused elsewhere later
    // without duplicating content. 2-4 cards, per Adinda's ask.
    defineField({
      name: 'whyUsItems',
      title: 'Why Us items',
      type: 'array',
      group: 'whyUs',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'whyUsItem' }] })],
      validation: (Rule) => Rule.min(2).max(4),
    }),

    defineField({ name: 'destinationsHeading', type: 'string', group: 'destinations' }),
    defineField({
      name: 'destinationsIntro',
      type: 'text',
      rows: 2,
      group: 'destinations',
      description: 'Destination cards themselves come from destination documents, not a field here.',
    }),

    defineField({ name: 'latestArticlesHeading', type: 'string', group: 'latestArticles' }),

    defineField({ name: 'ctaHeading', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaSubline', type: 'string', group: 'cta' }),

    defineField({ name: 'contactHeading', type: 'string', group: 'contact' }),

    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
})
