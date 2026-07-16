import { defineArrayMember, defineField, defineType } from 'sanity'

// Singleton shell — homepage content is still 100% hardcoded in components (Hero, TheBoat, WhyUs,
// Destinations, LatestArticles, Cta, Contact — see src/app/page.tsx). This document exists so the
// page appears in Studio and the section list is visible; per-section field depth is built out in
// the "wire the homepage to Sanity" slice (against the EXISTING built homepage, which is the source
// of truth — not the mockup). Faq and Testimonials pull from `faq`/`testimonial` documents; CTA is
// now the shared `cta` singleton (the ctaHeading/ctaSubline here are legacy shell fields, reconciled
// in the wiring slice). Groups mirrored by titled fieldsets (site-wide convention).
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
  fieldsets: [
    { name: 'heroFs', title: 'Hero' },
    { name: 'theBoatFs', title: 'The Boat' },
    { name: 'whyUsFs', title: 'Why Us' },
    { name: 'destinationsFs', title: 'Destinations' },
    { name: 'latestArticlesFs', title: 'Latest Articles' },
    { name: 'ctaFs', title: 'CTA' },
    { name: 'contactFs', title: 'Contact' },
    { name: 'seoFs', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'heroHeading', type: 'string', group: 'hero', fieldset: 'heroFs' }),
    defineField({ name: 'heroSubheading', type: 'text', rows: 2, group: 'hero', fieldset: 'heroFs' }),

    defineField({ name: 'theBoatHeading', type: 'string', group: 'theBoat', fieldset: 'theBoatFs' }),
    defineField({ name: 'theBoatBody', type: 'richTextBasic', group: 'theBoat', fieldset: 'theBoatFs' }),

    defineField({ name: 'whyUsHeading', type: 'string', group: 'whyUs', fieldset: 'whyUsFs' }),
    defineField({
      name: 'whyUsItems',
      title: 'Why Us items',
      type: 'array',
      group: 'whyUs',
      fieldset: 'whyUsFs',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'whyUsItem' }] })],
      validation: (Rule) => Rule.min(2).max(4),
    }),

    defineField({ name: 'destinationsHeading', type: 'string', group: 'destinations', fieldset: 'destinationsFs' }),
    defineField({
      name: 'destinationsIntro',
      type: 'text',
      rows: 2,
      group: 'destinations',
      fieldset: 'destinationsFs',
      description: 'Destination cards themselves come from destination documents, not a field here.',
    }),

    defineField({ name: 'latestArticlesHeading', type: 'string', group: 'latestArticles', fieldset: 'latestArticlesFs' }),

    defineField({ name: 'ctaHeading', type: 'string', group: 'cta', fieldset: 'ctaFs' }),
    defineField({ name: 'ctaSubline', type: 'string', group: 'cta', fieldset: 'ctaFs' }),

    defineField({ name: 'contactHeading', type: 'string', group: 'contact', fieldset: 'contactFs' }),

    defineField({ name: 'seo', type: 'seo', group: 'seo', fieldset: 'seoFs' }),
  ],
})
