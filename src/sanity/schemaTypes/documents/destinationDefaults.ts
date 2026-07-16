import { defineField, defineType } from 'sanity'

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
// Fieldsets (not tabs) give each section a visible header — it's a settings singleton, a single
// scroll reads better than 7 tabs.
export const destinationDefaultsType = defineType({
  name: 'destinationDefaults',
  title: 'Destination Defaults',
  type: 'document',
  description:
    'Shared eyebrows and section headings used on every destination page — edit once here. ' +
    'Use {destination} to drop in a page’s destination name automatically.',
  fieldsets: [
    { name: 'overview', title: 'Overview' },
    { name: 'gallery', title: 'Gallery' },
    { name: 'itineraries', title: 'Itineraries' },
    { name: 'upcomingTrips', title: 'Upcoming Trips' },
    { name: 'faq', title: 'FAQ' },
    { name: 'boats', title: 'About the Boats' },
    { name: 'articles', title: 'Latest Articles' },
  ],
  fields: [
    defineField({
      name: 'overviewEyebrow',
      title: 'Overview eyebrow',
      type: 'string',
      fieldset: 'overview',
      description: 'Kicker above the Overview heading. The Overview heading itself is written per destination.',
      initialValue: '{destination} Liveaboard Indonesia Overview',
    }),
    defineField({
      name: 'galleryEyebrow',
      title: 'Gallery eyebrow',
      type: 'string',
      fieldset: 'gallery',
      initialValue: 'Discover the best',
    }),
    defineField({
      name: 'galleryTitle',
      title: 'Gallery heading',
      type: 'string',
      fieldset: 'gallery',
      initialValue: 'Gallery',
    }),
    defineField({
      name: 'itinerariesEyebrow',
      title: 'Itineraries eyebrow',
      type: 'string',
      fieldset: 'itineraries',
    }),
    defineField({
      name: 'itinerariesHeading',
      title: 'Itineraries heading',
      type: 'string',
      fieldset: 'itineraries',
      initialValue: '{destination} liveaboard itineraries',
    }),
    defineField({
      name: 'upcomingTripsEyebrow',
      title: 'Upcoming Trips eyebrow',
      type: 'string',
      fieldset: 'upcomingTrips',
      initialValue: 'Availability',
    }),
    defineField({
      name: 'upcomingTripsHeading',
      title: 'Upcoming Trips heading',
      type: 'string',
      fieldset: 'upcomingTrips',
      initialValue: 'Upcoming {destination} liveaboard trips',
    }),
    defineField({
      name: 'upcomingTripsIntro',
      title: 'Upcoming Trips intro',
      type: 'text',
      rows: 2,
      fieldset: 'upcomingTrips',
      initialValue: 'Book directly through our scheduling partner to view real-time availability and reserve your cabin.',
    }),
    defineField({
      name: 'faqEyebrow',
      title: 'FAQ eyebrow',
      type: 'string',
      fieldset: 'faq',
      initialValue: 'Good to know',
    }),
    defineField({
      name: 'faqHeading',
      title: 'FAQ heading',
      type: 'string',
      fieldset: 'faq',
      initialValue: '{destination} FAQ',
    }),
    defineField({
      name: 'boatsEyebrow',
      title: 'Boats eyebrow',
      type: 'string',
      fieldset: 'boats',
      initialValue: 'Sail {destination} in comfort',
    }),
    defineField({
      name: 'boatsHeading',
      title: 'Boats heading',
      type: 'string',
      fieldset: 'boats',
      initialValue: 'About the boats',
    }),
    defineField({
      name: 'articlesEyebrow',
      title: 'Articles eyebrow',
      type: 'string',
      fieldset: 'articles',
      initialValue: 'Our journal',
    }),
    defineField({
      name: 'articlesHeading',
      title: 'Articles heading',
      type: 'string',
      fieldset: 'articles',
      initialValue: '{destination} articles & news',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Destination Defaults' }),
  },
})
