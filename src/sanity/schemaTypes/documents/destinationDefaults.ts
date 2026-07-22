import { defineField, defineType } from 'sanity'

// Shown under every section header in this form. Evergreen + generic per CLAUDE.md's
// field-description discipline: no destination names, no dates, no instance-specific examples.
const TOKEN_HINT = 'Type {destination} in any field here to insert the destination’s name automatically.'

// Singleton (one document, id "destinationDefaults") — pinned in Structure, nested under the
// "Destinations" folder in the sidebar. Holds the section eyebrows + headings that are the SAME
// across every destination page, edited ONCE here instead of retyped on each destination (locked
// 2026-07-16, Adinda's ask). Use the token {destination} anywhere the destination's short name
// should appear — the frontend swaps it in per page. Per-destination UNIQUE content (the Overview
// heading/body, tagline, stats values, highlights, gallery images) stays on each `destination`
// document; only shared chrome lives here.
//
// Eyebrows are rendered as <p>/<span>, never a heading tag (SEO/a11y — see CLAUDE.md); they carry
// little direct SEO weight, so they're plain editable text, not headings.
//
// Groups (tabs) + matching fieldsets since 2026-07-22 (Adinda: the single scroll outgrew itself as
// sections accumulated). Site-wide convention: every field declares both; the fieldset keeps the
// header visible in the flat "All Fields" view. Same change applied to boatDefaults.
export const destinationDefaultsType = defineType({
  name: 'destinationDefaults',
  title: 'Destination Defaults',
  type: 'document',
  description:
    'Shared eyebrows and section headings used on every destination page — edit once here. ' +
    'Type {destination} in any field below to drop in the destination’s name automatically.',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'gallery', title: 'Gallery' },
    { name: 'itineraries', title: 'Itineraries' },
    { name: 'upcomingTrips', title: 'Upcoming Trips' },
    { name: 'faq', title: 'FAQ' },
    { name: 'boats', title: 'Boats' },
    { name: 'articles', title: 'Articles' },
    { name: 'subnav', title: 'Section Nav' },
  ],
  // The {destination} hint repeats on EVERY fieldset, not just the document description (Adinda,
  // 2026-07-17). A token nobody knows about is a token nobody uses, and the document-level
  // description scrolls out of view as soon as an editor is working in a section. Mirrors
  // `boatDefaults` — the two types are deliberately the same shape.
  fieldsets: [
    { name: 'overview', title: 'Overview', description: TOKEN_HINT },
    { name: 'gallery', title: 'Gallery', description: TOKEN_HINT },
    { name: 'itineraries', title: 'Itineraries', description: TOKEN_HINT },
    { name: 'upcomingTrips', title: 'Upcoming Trips', description: TOKEN_HINT },
    { name: 'faq', title: 'FAQ', description: TOKEN_HINT },
    { name: 'boats', title: 'About the Boats', description: TOKEN_HINT },
    { name: 'articles', title: 'Latest Articles', description: TOKEN_HINT },
    {
      name: 'subnav',
      title: 'Section navigation',
      description: 'Labels in the strip of section links on the destination page hero.',
    },
  ],
  fields: [
    defineField({
      name: 'overviewEyebrow',
      title: 'Overview eyebrow',
      type: 'string',
      fieldset: 'overview',
      group: 'overview',
      description: 'Kicker above the Overview heading. The Overview heading itself is written per destination.',
      initialValue: '{destination} Liveaboard Indonesia Overview',
    }),
    // galleryEyebrow + galleryTitle REMOVED 2026-07-22 (Adinda) — the destination gallery is a
    // full-bleed grid with NO visible heading (mock 778:8677), so both fields were controls wired
    // to nothing. The section's accessible (sr-only) name reuses subnavGalleryLabel below — one
    // field, one concept. The button label below is the section's only visible chrome.
    defineField({
      name: 'galleryCtaText',
      title: 'Gallery button label',
      type: 'string',
      fieldset: 'gallery',
      group: 'gallery',
      description: 'The button floating on the gallery grid — opens the full-screen gallery.',
      initialValue: 'View All Images',
    }),
    defineField({
      name: 'itinerariesEyebrow',
      title: 'Itineraries eyebrow',
      type: 'string',
      fieldset: 'itineraries',
      group: 'itineraries',
    }),
    defineField({
      name: 'itinerariesHeading',
      title: 'Itineraries heading',
      type: 'string',
      fieldset: 'itineraries',
      group: 'itineraries',
      initialValue: '{destination} liveaboard itineraries',
    }),
    defineField({
      name: 'upcomingTripsEyebrow',
      title: 'Upcoming Trips eyebrow',
      type: 'string',
      fieldset: 'upcomingTrips',
      group: 'upcomingTrips',
      initialValue: 'Availability',
    }),
    defineField({
      name: 'upcomingTripsHeading',
      title: 'Upcoming Trips heading',
      type: 'string',
      fieldset: 'upcomingTrips',
      group: 'upcomingTrips',
      initialValue: 'Upcoming {destination} liveaboard trips',
    }),
    defineField({
      name: 'upcomingTripsIntro',
      title: 'Upcoming Trips intro',
      type: 'text',
      rows: 2,
      fieldset: 'upcomingTrips',
      group: 'upcomingTrips',
      initialValue: 'Book directly through our scheduling partner to view real-time availability and reserve your cabin.',
    }),
    defineField({
      name: 'upcomingTripsCtaText',
      title: 'Upcoming Trips button text',
      type: 'string',
      fieldset: 'upcomingTrips',
      group: 'upcomingTrips',
      description: 'Label on the button linking to the full Schedule & Rates page.',
      initialValue: 'View all trips',
    }),
    defineField({
      name: 'faqEyebrow',
      title: 'FAQ eyebrow',
      type: 'string',
      fieldset: 'faq',
      group: 'faq',
      initialValue: 'Good to know',
    }),
    defineField({
      name: 'faqHeading',
      title: 'FAQ heading',
      type: 'string',
      fieldset: 'faq',
      group: 'faq',
      initialValue: '{destination} FAQ',
    }),
    defineField({
      name: 'faqLinkText',
      title: 'FAQ button text',
      type: 'string',
      fieldset: 'faq',
      group: 'faq',
      description: 'Label on the button linking to the full FAQ page.',
      initialValue: 'Read All FAQ',
    }),
    defineField({
      name: 'boatsEyebrow',
      title: 'Boats eyebrow',
      type: 'string',
      fieldset: 'boats',
      group: 'boats',
      initialValue: 'Sail {destination} in comfort',
    }),
    defineField({
      name: 'boatsHeading',
      title: 'Boats heading',
      type: 'string',
      fieldset: 'boats',
      group: 'boats',
      initialValue: 'About the boats',
    }),
    defineField({
      name: 'articlesEyebrow',
      title: 'Articles eyebrow',
      type: 'string',
      fieldset: 'articles',
      group: 'articles',
      initialValue: 'Our journal',
    }),
    defineField({
      name: 'articlesHeading',
      title: 'Articles heading',
      type: 'string',
      fieldset: 'articles',
      group: 'articles',
      initialValue: '{destination} articles & news',
    }),
    defineField({
      name: 'articlesLinkText',
      title: 'Articles button text',
      type: 'string',
      fieldset: 'articles',
      group: 'articles',
      description: 'Label on the button linking to the blog.',
      initialValue: 'More blog posts',
    }),
    // Sub-nav labels live HERE rather than hardcoded — same rationale as boatDefaults (2026-07-21):
    // they ride the singleton's field-level localization when i18n lands. The ITEMS (which sections
    // exist, their order, their anchors) are structural and stay in code; only the words are editable.
    defineField({
      name: 'subnavOverviewLabel',
      title: 'Overview label',
      type: 'string',
      fieldset: 'subnav',
      group: 'subnav',
      initialValue: 'Overview',
    }),
    defineField({
      name: 'subnavGalleryLabel',
      title: 'Gallery label',
      type: 'string',
      fieldset: 'subnav',
      group: 'subnav',
      initialValue: 'Gallery',
    }),
    defineField({
      name: 'subnavItinerariesLabel',
      title: 'Itineraries label',
      type: 'string',
      fieldset: 'subnav',
      group: 'subnav',
      initialValue: 'Itineraries',
    }),
    defineField({
      name: 'subnavFaqLabel',
      title: 'FAQ label',
      type: 'string',
      fieldset: 'subnav',
      group: 'subnav',
      initialValue: 'FAQ',
    }),
    defineField({
      name: 'subnavTripsLabel',
      title: 'Upcoming Trips label',
      type: 'string',
      fieldset: 'subnav',
      group: 'subnav',
      initialValue: 'Upcoming Trips',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Destination Defaults' }),
  },
})
