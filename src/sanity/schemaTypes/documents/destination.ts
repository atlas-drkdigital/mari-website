import { defineArrayMember, defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'
import { sharedComponentNote } from '../../components/SharedComponentNote'

// Named `destination`, not `destinationPage` — the "Page" suffix wasn't an actual convention here
// (scheduleRates/blogPost don't have it either). Free rename 2026-07-16 (no content existed yet).
//
// Built against the real Figma mockup (node 778:8608, `Page/Destination`).
//
// Slimmed 2026-07-16: the shared section eyebrows + structural headings (Overview eyebrow, Gallery
// eyebrow/title, Itineraries/Upcoming Trips/FAQ/Boats/Articles eyebrows + headings) moved to the
// `destinationDefaults` singleton — edited ONCE for all destinations, with a {destination} token
// for the name (see destinationDefaults.ts / CLAUDE.md). This document now holds ONLY what's
// genuinely unique per destination: the Overview heading (the bespoke line) + body + highlights,
// tagline, stats values, gallery images, cover, slug, SEO.
//
// Auto-queried / shared sections are not fields here: itinerary cards (from `itinerary` docs
// referencing this destination), boats-on-route (from `boat` docs), articles (from `blogPost` docs),
// the booking widget (the one global scheduling embed), and CTA/Contact/Footer (shared components —
// CTA is now the `cta` singleton). FAQs are a hybrid: this destination's own questions are the
// inline `faqSections` field below, and the page additionally pulls shared categories from the
// General FAQ singleton at render time.
//
// Groups mirrored by titled fieldsets (site-wide convention) so section headers show in "All
// Fields"; every field declares both.
export const destinationType = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  groups: [
    { name: 'basicInfo', title: 'Basic Info', default: true },
    { name: 'cards', title: 'Cards' },
    { name: 'overview', title: 'Overview' },
    { name: 'gallery', title: 'Gallery' },
    { name: 'faq', title: 'FAQ' },
    { name: 'seo', title: 'SEO' },
  ],
  fieldsets: [
    { name: 'basicInfoFs', title: 'Basic Info' },
    {
      name: 'cardsFs',
      title: 'Cards',
      description: 'Only used where this destination appears as a card (homepage carousel, lists) — never on the page itself.',
    },
    { name: 'overviewFs', title: 'Overview' },
    { name: 'galleryFs', title: 'Gallery' },
    { name: 'faqFs', title: 'FAQ' },
  ],
  fields: [
    // Basic Info — same short name / full title / slug order locked across every page type.
    defineField({
      name: 'name',
      title: 'Short name',
      type: 'string',
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
      description: 'Short reference name — used in the nav breadcrumb, and dropped into shared headings via the {destination} token.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageTitle',
      title: 'Full title',
      type: 'string',
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
      description: 'The full page heading, distinct from the short name above.',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      components: { input: AutoSlugInput },
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
      description: 'URL path for this page.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'imageWithAlt',
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
      description: 'Used as the hero background — and on cards, unless a separate card image is set in the Cards tab.',
    }),
    // Optional hero background video (CDN URL, not an upload) — plays over the cover image, which
    // stays as poster + fallback. Shared object type; see objects/heroVideo.ts for the full rationale
    // (was an inline object here; consolidated 2026-07-21 so boat/homePage/destination share one shape).
    defineField({
      name: 'coverVideo',
      title: 'Cover video',
      type: 'heroVideo',
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
      description: 'Optional hero background video. Leave empty to just use the cover image.',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline / short description',
      type: 'text',
      rows: 2,
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
      description: 'The short punchy line shown under the name on cards and the homepage carousel.',
    }),
    // Cards tab (Adinda, 2026-07-22): everything here is card-only, grouped so that's obvious in
    // Studio. The old `seasonNights` string was REMOVED the same day — the card's season/duration
    // line is now derived from the hero `stats` values (Season + Duration), one source of truth.
    defineField({
      name: 'excerpt',
      title: 'Card summary',
      type: 'text',
      rows: 3,
      group: 'cards',
      fieldset: 'cardsFs',
      description: 'A few sentences summarising this destination, shown on the homepage carousel and destination cards.',
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      group: 'cards',
      fieldset: 'cardsFs',
      description: 'Controls the order destinations appear in lists and the homepage carousel (lower first).',
    }),
    // Toggle-to-reveal, same mechanism as the eyebrow toggles: cards reuse the cover image by
    // default; switching the toggle OFF reveals a dedicated card image field (Adinda, 2026-07-22 —
    // also added to `boat`). `!== false` so existing docs (field undefined) keep the default ON.
    defineField({
      name: 'useCoverAsCardImage',
      title: 'Use the cover image on cards',
      type: 'boolean',
      group: 'cards',
      fieldset: 'cardsFs',
      initialValue: true,
      description: 'Cards reuse the cover image. Turn off to upload a different image just for cards.',
    }),
    defineField({
      name: 'cardImage',
      title: 'Card image',
      type: 'imageWithAlt',
      group: 'cards',
      fieldset: 'cardsFs',
      hidden: ({ parent }) => parent?.useCoverAsCardImage !== false,
      description: 'Shown wherever this destination appears as a card. Recommended: landscape, at least 1600px wide.',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
      description: 'At-a-glance stats shown in the hero. Labels are seeded; fill the values per destination.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'value', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
      initialValue: [
        { label: 'Season', value: '' },
        { label: 'Duration', value: '' },
        { label: 'Minimum Skill Level', value: '' },
      ],
    }),

    // Overview — the heading + body + highlights are UNIQUE per destination (the eyebrow is shared,
    // in Destination Defaults).
    defineField({
      name: 'overviewHeading',
      title: 'Overview heading',
      type: 'string',
      group: 'overview',
      fieldset: 'overviewFs',
      description: 'The bespoke headline for this destination (not templated) — e.g. a line that captures what makes it special.',
    }),
    defineField({
      name: 'overviewBody',
      title: 'Overview body',
      type: 'richTextFull',
      group: 'overview',
      fieldset: 'overviewFs',
      description: 'Editorial intro copy. Named dive sites can get heading treatment here for SEO.',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      group: 'overview',
      fieldset: 'overviewFs',
      description: 'Mixed diving and non-diving highlights shown in the Overview carousel. Each needs its own image.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'highlight',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'body', type: 'richTextBasic' }),
            defineField({ name: 'image', type: 'imageWithAlt' }),
          ],
          preview: { select: { title: 'title', media: 'image' } },
        }),
      ],
    }),

    // Gallery — the IMAGES are unique per destination (the eyebrow/heading are shared, in
    // Destination Defaults). Flat array-on-page for native bulk upload.
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'gallery',
      fieldset: 'galleryFs',
      of: [defineArrayMember({ type: 'galleryImage' })],
      description: 'Drop or select many images at once — they upload straight onto this list.',
    }),

    // FAQ — this destination's own questions. The page also shows shared categories pulled from the
    // General FAQ (see the signpost note), so cross-cutting questions are written once, not repeated
    // on every destination.
    sharedComponentNote({
      name: 'faqNote',
      title: 'About this section',
      message:
        'Add the questions that are specific to this destination. The page also shows shared questions that apply to every trip — those are edited on the FAQ page, not here.',
      group: 'faq',
      fieldset: 'faqFs',
    }),
    defineField({
      name: 'faqSections',
      title: 'FAQ categories',
      type: 'array',
      group: 'faq',
      fieldset: 'faqFs',
      of: [defineArrayMember({ type: 'faqSection' })],
      initialValue: [
        { _type: 'faqSection', title: 'Diving', questions: [] },
        { _type: 'faqSection', title: 'Travel', questions: [] },
        { _type: 'faqSection', title: 'Others', questions: [] },
      ],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'name', media: 'coverImage' },
  },
})
