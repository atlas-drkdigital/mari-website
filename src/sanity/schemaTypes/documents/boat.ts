import { defineArrayMember, defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'
import { sharedComponentNote } from '../../components/SharedComponentNote'

// Renamed from `boatPage` to `boat` 2026-07-16 — the "Page" suffix wasn't an actual convention
// (scheduleRates/blogPost don't have it either), so it added nothing. Migrated the one real
// document (boatPage-mari -> boat-mari) via _scripts/rename-boatpage-to-boat.ts before this file
// replaced boatPage.ts — see MANAGER.md for the migration record.
//
// Repeatable, NOT a singleton — supports more than one boat, even though only one exists today.
// Nav behavior (see CLAUDE.md's Navigation section): exactly one boat doc → nav shows a single
// direct link; more than one → nav becomes a mega-menu dropdown, same pattern as Destinations. Not
// wired yet — depends on the whole Sanity-wiring pass.
//
// Cabin *types* and individual *cabins* are their own document types referencing this one, not
// inline arrays here — keeps the boat/cabin-type/cabin hierarchy independently queryable.
//
// Field-description discipline (2026-07-15): every `description:` string below is written to be
// evergreen and generic — no dates, no names, no instance-specific examples (an editor working on
// a *different* boat shouldn't read a description that only makes sense for the first one built).
// Decision history/reasoning lives in code comments (this kind of line) and in MANAGER.md /
// _SCHEMA-SPECS.md, not in Studio-visible text.
export const boatType = defineType({
  name: 'boat',
  title: 'Boat',
  type: 'document',
  groups: [
    { name: 'basicInfo', title: 'Basic Info', default: true },
    { name: 'overview', title: 'Overview' },
    { name: 'cabins', title: 'Cabins' },
    { name: 'gallery', title: 'Gallery' },
    { name: 'specifications', title: 'Specifications' },
    { name: 'faq', title: 'FAQ' },
    { name: 'seo', title: 'SEO' },
  ],
  // Fieldsets mirror the groups 1:1 so section headers show even in the flat "All Fields" view
  // (site-wide convention, locked 2026-07-16 — see CLAUDE.md). Every field declares both.
  fieldsets: [
    { name: 'basicInfoFs', title: 'Basic Info' },
    { name: 'overviewFs', title: 'Overview' },
    { name: 'cabinsFs', title: 'Cabins' },
    { name: 'galleryFs', title: 'Gallery' },
    { name: 'specificationsFs', title: 'Specifications' },
    { name: 'faqFs', title: 'FAQ' },
  ],
  fields: [
    // Basic Info — order locked 2026-07-15 (short name, then full title, then slug, WordPress-
    // style) — same order applies to every page type, not just this one.
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
      description: 'Used as the hero background and wherever this item appears as a card/thumbnail elsewhere.',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline / short description',
      type: 'text',
      rows: 2,
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
      description: 'Doubles as the hero subheading and the excerpt shown when this item appears as a card elsewhere.',
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
        { label: 'Cabins', value: '' },
        { label: 'Guests', value: '' },
        { label: 'Boat Size', value: '' },
        { label: 'Crew', value: '' },
      ],
    }),
    defineField({
      name: 'brochurePdf',
      title: 'Brochure PDF',
      type: 'file',
      options: { accept: 'application/pdf' },
      group: 'basicInfo',
      fieldset: 'basicInfoFs',
      description: 'Downloadable brochure. Frontend must hide the download button entirely when this is empty, not show a dead link.',
    }),

    // Overview
    defineField({
      name: 'keyFeaturesImage',
      type: 'imageWithAlt',
      group: 'overview',
      fieldset: 'overviewFs',
    }),
    defineField({
      name: 'keyFeaturesHeading',
      type: 'string',
      group: 'overview',
      fieldset: 'overviewFs',
      initialValue: 'Key features',
    }),
    defineField({
      name: 'keyFeatures',
      title: 'Key features',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'overview',
      fieldset: 'overviewFs',
      description: 'Short bullet points. Add as many as needed.',
    }),
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
    // `overviewCta` (a link field) removed — there's no separate CTA/link here at all; it's a
    // "Read more" truncate-and-expand on this same text (same pattern as the homepage
    // Testimonials cards), not navigation. Frontend requirement, not yet built.
    defineField({
      name: 'overviewBody',
      title: 'Overview body',
      type: 'richTextFull',
      group: 'overview',
      fieldset: 'overviewFs',
    }),

    // Cabins — own group (moved out of Overview 2026-07-15; it's its own page section, not part
    // of the overview visually or content-wise).
    defineField({
      name: 'showCabinsEyebrow',
      title: 'Show eyebrow?',
      type: 'boolean',
      group: 'cabins',
      fieldset: 'cabinsFs',
      initialValue: false,
    }),
    defineField({
      name: 'cabinsEyebrow',
      title: 'Cabins eyebrow',
      type: 'string',
      group: 'cabins',
      fieldset: 'cabinsFs',
      hidden: ({ parent }) => !parent?.showCabinsEyebrow,
    }),
    defineField({
      name: 'cabinsHeading',
      type: 'string',
      group: 'cabins',
      fieldset: 'cabinsFs',
      initialValue: 'Cabins',
    }),
    defineField({
      name: 'cabinsIntro',
      title: 'Cabins section intro',
      type: 'richTextBasic',
      group: 'cabins',
      fieldset: 'cabinsFs',
      description: 'Shared intro copy shown above the cabin type cards. Cabin types themselves are separate documents referencing this boat, not a field here.',
    }),

    // Gallery — lives ON the page as a FLAT array (not separate documents, not grouped by
    // category — see the comment on the `gallery` field itself below for why). Locked 2026-07-15.
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
      name: 'galleryDescription',
      type: 'richTextBasic',
      group: 'gallery',
      fieldset: 'galleryFs',
    }),
    // FLAT array of images — this array's members ARE images, so multi-file drag-drop lands
    // directly on it and uploads (the whole point). Category is a per-image tag field on
    // `galleryImage`, not a grouping level here.
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'gallery',
      fieldset: 'galleryFs',
      of: [defineArrayMember({ type: 'galleryImage' })],
      description:
        'Drop or select many images at once — they upload straight onto this list. Recommended: landscape 4:3, at least 1600×1200px (larger than it displays, so it stays sharp on retina/large screens), web-optimized JPEG or WebP, ideally under ~500KB each.',
    }),

    // Specifications
    defineField({
      name: 'showSpecificationsEyebrow',
      title: 'Show eyebrow?',
      type: 'boolean',
      group: 'specifications',
      fieldset: 'specificationsFs',
      initialValue: false,
    }),
    defineField({
      name: 'specificationsEyebrow',
      title: 'Specifications eyebrow',
      type: 'string',
      group: 'specifications',
      fieldset: 'specificationsFs',
      hidden: ({ parent }) => !parent?.showSpecificationsEyebrow,
    }),
    defineField({
      name: 'specificationsHeading',
      type: 'string',
      group: 'specifications',
      fieldset: 'specificationsFs',
    }),
    defineField({
      name: 'layoutDiagrams',
      title: 'Layout / deck plan',
      type: 'array',
      group: 'specifications',
      fieldset: 'specificationsFs',
      description: 'One entry is usually enough (several images stacked, e.g. one per deck) — heading/body are optional per entry.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'layoutDiagram',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'body', type: 'richTextBasic' }),
            defineField({
              name: 'images',
              type: 'array',
              of: [defineArrayMember({ type: 'imageWithAlt' })],
              validation: (Rule) => Rule.min(1),
            }),
          ],
          preview: { select: { title: 'heading', media: 'images.0' } },
        }),
      ],
    }),
    // Standardized 2026-07-15 against the actual Figma mock (Section/LayoutAndSpecs screenshot) —
    // 8 fixed categories, ALL the same shape: a single rich-text body, not label/value pairs.
    // Frontend requirement, not yet built (no boat page component exists): an accordion item with
    // an empty `body` should not render at all, not show as an empty expandable row.
    defineField({
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      group: 'specifications',
      fieldset: 'specificationsFs',
      description: 'Grouped by fixed category, one rich-text body per category.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'specCategory',
          fields: [
            defineField({
              name: 'category',
              type: 'string',
              description: 'Fixed category label, not free text.',
              options: {
                list: [
                  'Vessel & Accommodation',
                  'Crew',
                  'Diving Equipment',
                  'Tenders',
                  'Machinery & Power',
                  'Navigation & Communication',
                  'Safety Equipment',
                  'Amenities & Others',
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'body', type: 'richTextBasic' }),
          ],
          preview: { select: { title: 'category' } },
        }),
      ],
      initialValue: [
        { category: 'Vessel & Accommodation' },
        { category: 'Crew' },
        { category: 'Diving Equipment' },
        { category: 'Tenders' },
        { category: 'Machinery & Power' },
        { category: 'Navigation & Communication' },
        { category: 'Safety Equipment' },
        { category: 'Amenities & Others' },
      ],
    }),

    // FAQ — this boat's own questions. The page also shows shared categories pulled from the General
    // FAQ (see the signpost note). Questions marked "Feature on homepage" surface in the homepage FAQ
    // section alongside the featured General FAQ ones.
    sharedComponentNote({
      name: 'faqNote',
      title: 'About this section',
      message:
        'Add the questions that are specific to this boat. The page also shows shared questions that apply to every trip — those are edited under General FAQ, not here.',
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
      initialValue: [{ _type: 'faqSection', title: 'General Information', questions: [] }],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'name', media: 'coverImage' },
  },
})
