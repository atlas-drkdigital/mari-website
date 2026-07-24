import { defineArrayMember, defineField, defineType } from 'sanity'

// About page — SINGLETON (spec: _PAGE-SPECS.md #1, Adinda 2026-07-23). Dedicated type superseding
// the pinned generic `page-about` (same evolution as Private Charters: a structured section page
// can't live in one rich-text body). No mockup exists — the page reuses built sections by spec:
// PC-style hero (NO brochure, NO subnav — her explicit call), PC-style overview, shared
// WhyUs/CTA/Testimonials/Contact, plus the NEW crew section.
export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'overview', title: 'Overview' },
    { name: 'crew', title: 'Crew' },
    { name: 'seo', title: 'SEO' },
  ],
  fieldsets: [
    { name: 'heroFs', title: 'Hero' },
    { name: 'overviewFs', title: 'Overview' },
    { name: 'crewFs', title: 'Crew' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Short name',
      type: 'string',
      group: 'hero',
      fieldset: 'heroFs',
      description: 'Short reference name — used in the nav breadcrumb and anywhere this page is referenced by name elsewhere.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroHeadingIntro',
      title: 'Heading — intro line',
      type: 'string',
      group: 'hero',
      fieldset: 'heroFs',
      description: 'The smaller first line of the hero heading, shown above the main line.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroHeadingMain',
      title: 'Heading — main line',
      type: 'string',
      group: 'hero',
      fieldset: 'heroFs',
      description: 'The large second line of the hero heading. Optional — leave empty to show only the intro line.',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
      group: 'hero',
      fieldset: 'heroFs',
    }),
    defineField({
      name: 'heroImage',
      title: 'Background image',
      type: 'imageWithAlt',
      group: 'hero',
      fieldset: 'heroFs',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroVideo',
      title: 'Background video',
      type: 'heroVideo',
      group: 'hero',
      fieldset: 'heroFs',
      description: 'Optional hero background video. Leave empty to just use the background image.',
    }),

    // ----- Overview (the PC-shaped centered overview: eyebrow + heading + tier-3 body) -----
    defineField({
      name: 'overviewEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'overview',
      fieldset: 'overviewFs',
      description: 'The small kicker text above the section heading.',
    }),
    defineField({
      name: 'overviewHeading',
      title: 'Heading',
      type: 'string',
      group: 'overview',
      fieldset: 'overviewFs',
    }),
    defineField({
      name: 'overviewBody',
      title: 'Body',
      type: 'richTextFull',
      group: 'overview',
      fieldset: 'overviewFs',
      description: 'The section copy. Images can be added anywhere inside it.',
    }),

    // ----- Crew (spec: circular portraits, 4 per row, click opens the bio; section disappears
    // when the list is empty — expected at first, real crew data takes a while to gather) -----
    defineField({
      name: 'crewEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'crew',
      fieldset: 'crewFs',
    }),
    defineField({
      name: 'crewHeading',
      title: 'Heading',
      type: 'string',
      group: 'crew',
      fieldset: 'crewFs',
    }),
    defineField({
      name: 'crewIntro',
      title: 'Intro text',
      type: 'richTextBasic',
      group: 'crew',
      fieldset: 'crewFs',
      description: 'Shown under the heading, above the crew portraits.',
    }),
    defineField({
      name: 'crewMembers',
      title: 'Crew members',
      type: 'array',
      group: 'crew',
      fieldset: 'crewFs',
      description:
        'Drag to set the display order. A crew member left off this list is not shown. The section disappears entirely while this is empty.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'crewMember' }] })],
    }),
    defineField({
      name: 'crewViewMoreText',
      title: 'View More button text',
      type: 'string',
      group: 'crew',
      fieldset: 'crewFs',
      description:
        'Label for the mobile-only button that reveals the rest of the crew. Only appears on phones when more than four members are listed.',
      initialValue: 'View More',
    }),
    defineField({
      name: 'crewViewLessText',
      title: 'View Less button text',
      type: 'string',
      group: 'crew',
      fieldset: 'crewFs',
      description: 'Label for the same button once the list is expanded, to collapse it again.',
      initialValue: 'View Less',
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'name', media: 'heroImage' },
    prepare({ title, media }) {
      return { title: title ?? 'About', media }
    },
  },
})
