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
// Fieldsets (not tabs) give each section a visible header — it's a settings singleton, a single
// scroll reads better than 7 tabs.
export const destinationDefaultsType = defineType({
  name: 'destinationDefaults',
  title: 'Destination Defaults',
  type: 'document',
  description:
    'Shared eyebrows and section headings used on every destination page — edit once here. ' +
    'Type {destination} in any field below to drop in the destination’s name automatically.',
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
