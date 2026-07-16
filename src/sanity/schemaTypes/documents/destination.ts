import { defineArrayMember, defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'

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
// referencing this destination), FAQ items (`faq` docs scoped to this destination), boats-on-route
// (from `boat` docs), articles (from `blogPost` docs), the booking widget (the one global
// scheduling embed), and CTA/Contact/Footer (shared components — CTA is now the `cta` singleton).
//
// Groups mirrored by titled fieldsets (site-wide convention) so section headers show in "All
// Fields"; every field declares both.
export const destinationType = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  groups: [
    { name: 'basicInfo', title: 'Basic Info', default: true },
    { name: 'overview', title: 'Overview' },
    { name: 'gallery', title: 'Gallery' },
    { name: 'seo', title: 'SEO' },
  ],
  fieldsets: [
    { name: 'basicInfoFs', title: 'Basic Info' },
    { name: 'overviewFs', title: 'Overview' },
    { name: 'galleryFs', title: 'Gallery' },
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
      description: 'Used as the hero background and wherever this destination appears as a card/thumbnail elsewhere.',
    }),
    // Optional hero video — a hosted-video URL, NOT a Sanity upload. Research 2026-07-16 (see
    // MANAGER.md): Sanity's free tier caps bandwidth at 10GB/mo with NO overage (serving just
    // blocks), and a hero background video can't be lazy-loaded, so self-hosting it in the dataset
    // would burn the cap fast. Sanity's Media Library video CDN is Enterprise-only, so that's out
    // too. Instead the editor points at a video CDN (Cloudflare Stream / Bunny / Cloudinary). When
    // set, the frontend plays it muted + looped + playsinline as the hero background over the cover
    // image (which stays as poster/fallback); autoplay/mute/loop are fixed behavior, not toggles.
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

    defineField({ name: 'seo', type: 'seo', group: 'seo', fieldset: 'seoFs' }),
  ],
  preview: {
    select: { title: 'name', media: 'coverImage' },
  },
})
