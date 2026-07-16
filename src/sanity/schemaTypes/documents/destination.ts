import { defineArrayMember, defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'

// Named `destination`, not `destinationPage` — the "Page" suffix wasn't an actual convention in
// this schema (scheduleRates/blogPost don't have it either), so dropped it. No documents existed
// yet under the old name, so this was a free rename (2026-07-16), unlike `boat` which needed an
// actual data migration — see MANAGER.md.
//
// Shell built 2026-07-15/16 from the locked spec in mari-project skill's
// references/website.md (Komodo pilot, Figma node 675-2363) — the design sprint already spec'd
// this page in detail, but the schema pass itself hadn't been started yet. Treat this as a
// first-pass shell (skeleton-first convention, same as boat's first pass) — field names may
// still change before real content loads.
//
// Sections deliberately NOT modeled as fields here, because they're not this page's own content:
// "Boats on this route" (auto — queries `boat` documents), the itinerary carousel (auto — queries
// `itinerary` documents referencing this destination), FAQ (separate `faq` documents with scope:
// 'destination' referencing this page), and CTA/Contact/Footer (shared components, same exclusion
// `boat` already applies).
export const destinationType = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  groups: [
    { name: 'basicInfo', title: 'Basic Info', default: true },
    { name: 'overview', title: 'Overview' },
    { name: 'gallery', title: 'Gallery' },
    { name: 'itineraries', title: 'Itineraries' },
    { name: 'upcomingTrips', title: 'Upcoming Trips' },
    { name: 'sections', title: 'Section Headings' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Basic Info — same short name / full title / slug order locked across every page type.
    defineField({
      name: 'name',
      title: 'Short name',
      type: 'string',
      group: 'basicInfo',
      description: 'Short reference name — used in the nav breadcrumb and anywhere this item is referenced by name elsewhere.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageTitle',
      title: 'Full title',
      type: 'string',
      group: 'basicInfo',
      description: 'The full page heading, distinct from the short name above.',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      components: { input: AutoSlugInput },
      group: 'basicInfo',
      description: 'URL path for this page.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'imageWithAlt',
      group: 'basicInfo',
      description: 'Used as the hero background and wherever this destination appears as a card/thumbnail elsewhere.',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline / short description',
      type: 'text',
      rows: 2,
      group: 'basicInfo',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: 'basicInfo',
      description: 'At-a-glance stats shown in the hero.',
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

    // Overview
    defineField({
      name: 'showOverviewEyebrow',
      title: 'Show eyebrow?',
      type: 'boolean',
      group: 'overview',
      initialValue: false,
    }),
    defineField({
      name: 'overviewEyebrow',
      title: 'Overview eyebrow',
      type: 'string',
      group: 'overview',
      hidden: ({ parent }) => !parent?.showOverviewEyebrow,
    }),
    defineField({
      name: 'overviewHeading',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'overviewBody',
      title: 'Overview body',
      type: 'richTextFull',
      group: 'overview',
      description: 'Editorial intro copy. Named dive sites can get heading treatment here for SEO — see website.md\'s "Dive sites" note.',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      group: 'overview',
      description: 'Mixed diving and non-diving highlights shown in the Overview carousel (e.g. a marine-life encounter, a land excursion).',
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

    // Gallery — same flat-array-on-page pattern as boat.gallery, for native bulk upload.
    defineField({
      name: 'showGalleryEyebrow',
      title: 'Show eyebrow?',
      type: 'boolean',
      group: 'gallery',
      initialValue: false,
    }),
    defineField({
      name: 'galleryEyebrow',
      title: 'Gallery eyebrow',
      type: 'string',
      group: 'gallery',
      hidden: ({ parent }) => !parent?.showGalleryEyebrow,
    }),
    defineField({
      name: 'galleryTitle',
      type: 'string',
      group: 'gallery',
      initialValue: 'Gallery',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'gallery',
      of: [defineArrayMember({ type: 'galleryImage' })],
      description: 'Drop or select many images at once — they upload straight onto this list.',
    }),

    // Itineraries — the cards themselves come from `itinerary` documents referencing this
    // destination; this is just the heading block above the carousel. The booking/availability
    // widget is its own section below ("Upcoming Trips"), not part of this one.
    defineField({
      name: 'showItinerariesEyebrow',
      title: 'Show eyebrow?',
      type: 'boolean',
      group: 'itineraries',
      initialValue: false,
    }),
    defineField({
      name: 'itinerariesEyebrow',
      title: 'Itineraries eyebrow',
      type: 'string',
      group: 'itineraries',
      hidden: ({ parent }) => !parent?.showItinerariesEyebrow,
    }),
    defineField({
      name: 'itinerariesHeading',
      type: 'string',
      group: 'itineraries',
    }),
    defineField({
      name: 'itinerariesIntro',
      type: 'richTextBasic',
      group: 'itineraries',
      description: 'Optional intro line under the heading, above the itinerary cards.',
    }),

    // Upcoming Trips — the live availability/booking widget (the scheduling-partner embed). The
    // widget itself is the ONE global embed, reused from Schedule & Rates and rendered by the
    // frontend — NOT a per-destination field, because the mockup's widget lists every route with
    // its own date/route filters. Only this section's eyebrow/heading/intro are editable here. If
    // per-destination filtering is ever needed, revisit an override embed (flagged in MANAGER.md,
    // not built speculatively).
    defineField({
      name: 'showUpcomingTripsEyebrow',
      title: 'Show eyebrow?',
      type: 'boolean',
      group: 'upcomingTrips',
      initialValue: false,
    }),
    defineField({
      name: 'upcomingTripsEyebrow',
      title: 'Upcoming Trips eyebrow',
      type: 'string',
      group: 'upcomingTrips',
      hidden: ({ parent }) => !parent?.showUpcomingTripsEyebrow,
    }),
    defineField({
      name: 'upcomingTripsHeading',
      type: 'string',
      group: 'upcomingTrips',
    }),
    defineField({
      name: 'upcomingTripsIntro',
      title: 'Upcoming Trips intro',
      type: 'richTextBasic',
      group: 'upcomingTrips',
      description: 'Short line shown above the availability widget.',
    }),

    // Section Headings — these sections render their CONTENT automatically (FAQ items, boats, and
    // blog articles are all separate documents queried by reference/scope), but their section
    // eyebrow + heading are editable page chrome, per the "every heading is editable" rule.
    defineField({
      name: 'showFaqEyebrow',
      title: 'Show FAQ eyebrow?',
      type: 'boolean',
      group: 'sections',
      initialValue: false,
    }),
    defineField({
      name: 'faqEyebrow',
      title: 'FAQ eyebrow',
      type: 'string',
      group: 'sections',
      hidden: ({ parent }) => !parent?.showFaqEyebrow,
    }),
    defineField({
      name: 'faqHeading',
      title: 'FAQ heading',
      type: 'string',
      group: 'sections',
      description: 'Heading for this destination\'s FAQ section. The questions are separate FAQ documents scoped to this destination.',
    }),
    defineField({
      name: 'showBoatsEyebrow',
      title: 'Show boats eyebrow?',
      type: 'boolean',
      group: 'sections',
      initialValue: false,
    }),
    defineField({
      name: 'boatsEyebrow',
      title: 'Boats eyebrow',
      type: 'string',
      group: 'sections',
      hidden: ({ parent }) => !parent?.showBoatsEyebrow,
    }),
    defineField({
      name: 'boatsHeading',
      title: 'Boats heading',
      type: 'string',
      group: 'sections',
      description: 'Heading for the "About the boats" section. The boat cards come from boat documents.',
    }),
    defineField({
      name: 'showArticlesEyebrow',
      title: 'Show articles eyebrow?',
      type: 'boolean',
      group: 'sections',
      initialValue: false,
    }),
    defineField({
      name: 'articlesEyebrow',
      title: 'Articles eyebrow',
      type: 'string',
      group: 'sections',
      hidden: ({ parent }) => !parent?.showArticlesEyebrow,
    }),
    defineField({
      name: 'articlesHeading',
      title: 'Articles heading',
      type: 'string',
      group: 'sections',
      description: 'Heading for the "Latest articles" section. The article cards come from blog posts referencing this destination.',
    }),

    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'name', media: 'coverImage' },
  },
})
