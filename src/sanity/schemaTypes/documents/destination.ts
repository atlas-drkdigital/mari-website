import { defineArrayMember, defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'

// Named `destination`, not `destinationPage` — the "Page" suffix wasn't an actual convention in
// this schema (scheduleRates/blogPost don't have it either), so dropped it. No documents existed
// yet under the old name, so this was a free rename (2026-07-16), unlike `boat` which needed an
// actual data migration — see MANAGER.md.
//
// Built out from a shell 2026-07-16 against the REAL Figma mockup (node 778:8608, `Page/Destination`
// — newer + more detailed than the older 675-2363 the skill docs referenced).
//
// Sections deliberately NOT modeled as fields here, because they're not this page's own content:
// the itinerary carousel cards (auto — `itinerary` documents referencing this destination), the
// availability/booking widget (the ONE global scheduling embed, reused from Schedule & Rates), the
// FAQ items / boats / articles CONTENT (separate documents queried by scope/reference), and
// CTA/Contact/Footer (shared components — the CTA is the generic two-card block, confirmed against
// the mockup, no per-destination override).
//
// Groups (tabs) are each mirrored by a titled `fieldset` (site-wide convention, locked 2026-07-16 —
// see CLAUDE.md): fieldsets render as visible section headers even in the flat "All Fields" view,
// groups only separate tabs. Every field declares BOTH its group and its matching fieldset.
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
  fieldsets: [
    { name: 'basicInfoFs', title: 'Basic Info' },
    { name: 'overviewFs', title: 'Overview' },
    { name: 'galleryFs', title: 'Gallery' },
    { name: 'itinerariesFs', title: 'Itineraries' },
    { name: 'upcomingTripsFs', title: 'Upcoming Trips' },
    { name: 'sectionsFs', title: 'Section Headings' },
    { name: 'seoFs', title: 'SEO' },
  ],
  fields: [
    // Basic Info — same short name / full title / slug order locked across every page type.
    defineField({
      name: 'name',
      title: 'Short name',
      type: 'string',
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
      description: 'Short reference name — used in the nav breadcrumb and anywhere this item is referenced by name elsewhere.',
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
      description: 'Used as the hero background and wherever this destination appears as a card/thumbnail elsewhere.',
    }),
    // Optional hero video — a hosted-video URL, NOT a Sanity upload. Research 2026-07-16 (see
    // MANAGER.md): Sanity's free tier caps bandwidth at 10GB/mo with NO overage (serving just
    // blocks), and a hero background video can't be lazy-loaded, so self-hosting it in the dataset
    // would burn the cap fast. Sanity's Media Library video CDN is Enterprise-only, so that's out
    // too. Instead the editor points at a video CDN (Cloudflare Stream / Bunny / Cloudinary). When
    // set, the frontend plays it muted + looped + playsinline as the hero background over the cover
    // image (which stays as poster/fallback + the card/thumbnail source elsewhere); autoplay/mute/
    // loop are fixed behavior, not editor toggles.
    defineField({
      name: 'coverVideo',
      title: 'Cover video',
      type: 'object',
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
      description: 'Optional hero background video. Leave empty to just use the cover image.',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'url',
          title: 'Video URL',
          type: 'url',
          description: 'Link to a video hosted on a video CDN (e.g. Cloudflare Stream, Bunny, Cloudinary) — do not upload large video into Sanity. Recommended: a seamless silent loop, MP4 (H.264), 720p, under ~5MB, 5–15 seconds.',
        }),
        defineField({
          name: 'playOnMobile',
          title: 'Play on mobile?',
          type: 'boolean',
          initialValue: false,
          description: 'Off by default — mobile shows the cover image instead, to save data and keep the page fast.',
          hidden: ({ parent }) => !parent?.url,
        }),
      ],
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline / short description',
      type: 'text',
      rows: 2,
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
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
      fieldset: 'overviewFs',
      initialValue: false,
    }),
    defineField({
      name: 'overviewEyebrow',
      title: 'Overview eyebrow',
      type: 'string',
      group: 'overview',
      fieldset: 'overviewFs',
      hidden: ({ parent }) => !parent?.showOverviewEyebrow,
    }),
    defineField({
      name: 'overviewHeading',
      type: 'string',
      group: 'overview',
      fieldset: 'overviewFs',
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
      description: 'Mixed diving and non-diving highlights shown in the Overview carousel (e.g. a marine-life encounter, a land excursion). Each needs its own image.',
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
      fieldset: 'galleryFs',
      initialValue: false,
    }),
    defineField({
      name: 'galleryEyebrow',
      title: 'Gallery eyebrow',
      type: 'string',
      group: 'gallery',
      fieldset: 'galleryFs',
      hidden: ({ parent }) => !parent?.showGalleryEyebrow,
    }),
    defineField({
      name: 'galleryTitle',
      type: 'string',
      group: 'gallery',
      fieldset: 'galleryFs',
      initialValue: 'Gallery',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'gallery',
      fieldset: 'galleryFs',
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
      fieldset: 'itinerariesFs',
      initialValue: false,
    }),
    defineField({
      name: 'itinerariesEyebrow',
      title: 'Itineraries eyebrow',
      type: 'string',
      group: 'itineraries',
      fieldset: 'itinerariesFs',
      hidden: ({ parent }) => !parent?.showItinerariesEyebrow,
    }),
    defineField({
      name: 'itinerariesHeading',
      type: 'string',
      group: 'itineraries',
      fieldset: 'itinerariesFs',
    }),
    defineField({
      name: 'itinerariesIntro',
      type: 'richTextBasic',
      group: 'itineraries',
      fieldset: 'itinerariesFs',
      description: 'Optional intro line under the heading, above the itinerary cards.',
    }),

    // Upcoming Trips — the live availability/booking widget (the scheduling-partner embed). The
    // widget itself is the ONE global embed, reused from Schedule & Rates and rendered by the
    // frontend — NOT a per-destination field, because the mockup's widget lists every route with
    // its own date/route filters. Only this section's eyebrow/heading/intro are editable here.
    defineField({
      name: 'showUpcomingTripsEyebrow',
      title: 'Show eyebrow?',
      type: 'boolean',
      group: 'upcomingTrips',
      fieldset: 'upcomingTripsFs',
      initialValue: false,
    }),
    defineField({
      name: 'upcomingTripsEyebrow',
      title: 'Upcoming Trips eyebrow',
      type: 'string',
      group: 'upcomingTrips',
      fieldset: 'upcomingTripsFs',
      hidden: ({ parent }) => !parent?.showUpcomingTripsEyebrow,
    }),
    defineField({
      name: 'upcomingTripsHeading',
      type: 'string',
      group: 'upcomingTrips',
      fieldset: 'upcomingTripsFs',
    }),
    defineField({
      name: 'upcomingTripsIntro',
      title: 'Upcoming Trips intro',
      type: 'richTextBasic',
      group: 'upcomingTrips',
      fieldset: 'upcomingTripsFs',
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
      fieldset: 'sectionsFs',
      initialValue: false,
    }),
    defineField({
      name: 'faqEyebrow',
      title: 'FAQ eyebrow',
      type: 'string',
      group: 'sections',
      fieldset: 'sectionsFs',
      hidden: ({ parent }) => !parent?.showFaqEyebrow,
    }),
    defineField({
      name: 'faqHeading',
      title: 'FAQ heading',
      type: 'string',
      group: 'sections',
      fieldset: 'sectionsFs',
      description: 'Heading for this destination\'s FAQ section. The questions are separate FAQ documents scoped to this destination.',
    }),
    defineField({
      name: 'showBoatsEyebrow',
      title: 'Show boats eyebrow?',
      type: 'boolean',
      group: 'sections',
      fieldset: 'sectionsFs',
      initialValue: false,
    }),
    defineField({
      name: 'boatsEyebrow',
      title: 'Boats eyebrow',
      type: 'string',
      group: 'sections',
      fieldset: 'sectionsFs',
      hidden: ({ parent }) => !parent?.showBoatsEyebrow,
    }),
    defineField({
      name: 'boatsHeading',
      title: 'Boats heading',
      type: 'string',
      group: 'sections',
      fieldset: 'sectionsFs',
      description: 'Heading for the "About the boats" section. The boat cards come from boat documents.',
    }),
    defineField({
      name: 'showArticlesEyebrow',
      title: 'Show articles eyebrow?',
      type: 'boolean',
      group: 'sections',
      fieldset: 'sectionsFs',
      initialValue: false,
    }),
    defineField({
      name: 'articlesEyebrow',
      title: 'Articles eyebrow',
      type: 'string',
      group: 'sections',
      fieldset: 'sectionsFs',
      hidden: ({ parent }) => !parent?.showArticlesEyebrow,
    }),
    defineField({
      name: 'articlesHeading',
      title: 'Articles heading',
      type: 'string',
      group: 'sections',
      fieldset: 'sectionsFs',
      description: 'Heading for the "Latest articles" section. The article cards come from blog posts referencing this destination.',
    }),

    defineField({ name: 'seo', type: 'seo', group: 'seo', fieldset: 'seoFs' }),
  ],
  preview: {
    select: { title: 'name', media: 'coverImage' },
  },
})
