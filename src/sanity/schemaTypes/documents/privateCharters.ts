import { defineArrayMember, defineField, defineType } from 'sanity'

import { sharedComponentNote } from '../../components/SharedComponentNote'

// Private Charters page — SINGLETON (enforced in structure.ts, same as homePage). Figma
// Page/PrivateCharters = 778:8908; built section by section from 2026-07-23.
//
// DEDICATED type, not the generic `page` (the inventory's 2026-07-15 "default assumption is
// generic page" predates the mockup): the design is a structured section page — hero, overview,
// benefits, shared Destinations/Boats/FAQ/dates sections — which the generic `page`'s single
// rich-text body cannot express. structure.ts's old pinned `page-private-charters` generic doc is
// superseded by this singleton.
//
// Same incremental pattern as the destination build: groups/fields land per section as each slice
// ships. Hero + Section Labels + SEO first (2026-07-23).
//
// Field-description discipline (2026-07-15): descriptions are evergreen and generic — reasoning
// lives in comments like this one, not in Studio-visible text.
export const privateChartersType = defineType({
  name: 'privateCharters',
  title: 'Private Charters',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'overview', title: 'Overview' },
    { name: 'benefits', title: 'Benefits' },
    { name: 'boats', title: 'Boats' },
    { name: 'availability', title: 'Availability' },
    { name: 'faq', title: 'FAQ' },
    // "Section Nav", NOT "Section Labels" (Adinda, 2026-07-23): these are the SUB-NAVIGATION tab
    // labels, and "Section Labels" already means something else site-wide (the homepage's
    // eyebrow/kicker texts). Matches destinationDefaults' group of the same name.
    { name: 'sectionLabels', title: 'Section Nav' },
    { name: 'seo', title: 'SEO' },
  ],
  fieldsets: [
    { name: 'heroFs', title: 'Hero' },
    { name: 'overviewFs', title: 'Overview' },
    { name: 'benefitsFs', title: 'Benefits' },
    { name: 'boatsFs', title: 'Boats' },
    { name: 'availabilityFs', title: 'Availability' },
    { name: 'faqFs', title: 'FAQ' },
    {
      name: 'sectionLabelsFs',
      title: 'Section Nav — the tab items in the in-page section navigation (not the section headings; those live in each section\'s own tab)',
    },
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
    // The hero heading is TWO lines by design — a smaller light intro line over a large main
    // line (e.g. an intro phrase over the destination-country word). Two fields, not one string
    // with markup, so the editor controls the split directly.
    defineField({
      name: 'heroHeadingIntro',
      title: 'Heading — intro line',
      type: 'string',
      group: 'hero',
      fieldset: 'heroFs',
      description: 'The smaller first line of the hero heading, shown above the main line.',
      validation: (Rule) => Rule.required(),
    }),
    // NOT required (Adinda, 2026-07-23): an editor may want only the smaller intro line as the
    // whole heading — the frontend renders whichever lines are present.
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
    defineField({
      name: 'brochurePdf',
      title: 'Brochure PDF',
      type: 'file',
      options: { accept: 'application/pdf' },
      group: 'hero',
      fieldset: 'heroFs',
      description: 'Downloadable brochure. Frontend must hide the download button entirely when this is empty, not show a dead link.',
    }),

    // ----- Overview (Figma 778:8938) — centered single-column section. Body is TIER-3 rich text
    // (the page-builder overview case the tier model always named for exactly this page): the
    // destinations-map graphic is uploaded INLINE in the body, not a separate field, so the editor
    // controls where it sits in the copy (Adinda, 2026-07-23). -----
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
      description: 'The section copy. Images (like the destinations map) can be added anywhere inside it.',
    }),

    // ----- Benefits (Figma 778:8956) — the image-driven accordion, model locked with Adinda
    // 2026-07-23: ONE IMAGE = ONE BENEFIT. The image's Title is the accordion heading, its Caption
    // is the accordion body AND the lightbox caption (plain text by her call — the image IS the
    // content). Array of bare `image` members so multi-file drag-drop batch upload works (same
    // reasoning as the gallery — never a wrapper object). Array order = accordion + carousel order.
    defineField({
      name: 'benefitsEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'benefits',
      fieldset: 'benefitsFs',
      description: 'The small kicker text above the section heading.',
    }),
    defineField({
      name: 'benefitsHeading',
      title: 'Heading',
      type: 'string',
      group: 'benefits',
      fieldset: 'benefitsFs',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      group: 'benefits',
      fieldset: 'benefitsFs',
      description:
        'One image per benefit, in display order. Each image\'s Title is the benefit heading and its Caption is the text shown under it (and with the enlarged image). An image without a title is not shown.',
      of: [
        defineArrayMember({
          type: 'image',
          name: 'benefitImage',
          title: 'Benefit',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'title',
              title: 'Benefit title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Benefit text',
              type: 'text',
              rows: 4,
              description: 'Shown under the benefit title, and as the caption when the image is enlarged.',
            }),
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Strongly recommended, not required.',
            }),
          ],
          preview: {
            select: { title: 'title', media: 'asset' },
          },
        }),
      ],
    }),

    // ----- Boats — the shared About-the-Boats section. Chrome moved to the `boatsSection`
    // SINGLETON 2026-07-23 (Adinda's shared-sections model): edited once, changes on every page
    // that mounts the component. This page resolves its {destination} token as "Indonesia". A
    // Studio note is all that remains here, so an editor looking for the section knows where
    // its text lives. -----
    sharedComponentNote({
      name: 'boatsNote',
      title: 'About this section',
      message:
        'The "About the Boats" section is shared across pages. Its heading and texts are edited once in Shared Components → Boats Section; the boat cards themselves come from the Boats documents.',
      group: 'boats',
      fieldset: 'boatsFs',
    }),

    // ----- Availability (the dates/booking embed — same component as the destination page's
    // Upcoming Trips). The embed lives HERE because no Schedule & Rates document exists yet;
    // revisit the source of truth when that page is built. -----
    defineField({
      name: 'availabilityEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'availability',
      fieldset: 'availabilityFs',
    }),
    defineField({
      name: 'availabilityHeading',
      title: 'Heading',
      type: 'string',
      group: 'availability',
      fieldset: 'availabilityFs',
    }),
    // richTextBasic, not plain text (Adinda, 2026-07-23): embed-section intros support links /
    // bold / multi-paragraph — e.g. "contact us" links to the #contact section. Applies to every
    // embed-holding section (destinationDefaults.upcomingTripsIntro upgraded in the same pass).
    defineField({
      name: 'availabilityIntro',
      title: 'Intro text',
      type: 'richTextBasic',
      group: 'availability',
      fieldset: 'availabilityFs',
      description: 'Shown above the booking widget — explain how to find and book charter dates.',
    }),
    defineField({
      name: 'availabilityCtaText',
      title: 'Button text',
      type: 'string',
      group: 'availability',
      fieldset: 'availabilityFs',
    }),
    defineField({
      name: 'availabilityEmbed',
      title: 'Booking widget embed',
      type: 'htmlEmbed',
      group: 'availability',
      fieldset: 'availabilityFs',
      description: 'The booking widget code. The section is hidden entirely while this is empty.',
    }),

    // ----- FAQ — this page's own categories; the page also shows shared General FAQ categories
    // via their "Show on the Private Charters page" toggle (same composition as boat/destination). -----
    sharedComponentNote({
      name: 'faqNote',
      title: 'About this section',
      message:
        'Add the questions that are specific to private charters. The page also shows shared categories that apply to every trip — those are edited on the FAQ page, not here.',
      group: 'faq',
      fieldset: 'faqFs',
    }),
    defineField({
      name: 'faqEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'faq',
      fieldset: 'faqFs',
    }),
    defineField({
      name: 'faqHeading',
      title: 'Heading',
      type: 'string',
      group: 'faq',
      fieldset: 'faqFs',
    }),
    defineField({
      name: 'faqLinkText',
      title: 'Link text',
      type: 'string',
      group: 'faq',
      fieldset: 'faqFs',
      description: 'Text of the link to the FAQ page.',
    }),
    defineField({
      name: 'faqSections',
      title: 'FAQ categories',
      type: 'array',
      group: 'faq',
      fieldset: 'faqFs',
      of: [defineArrayMember({ type: 'faqSection' })],
      initialValue: [{ _type: 'faqSection', title: 'Private Charters', questions: [] }],
    }),

    // ----- Section Labels (sub-nav items; a label left empty hides nothing — the section's own
    // empty test governs visibility, the label only names the tab) -----
    defineField({
      name: 'subnavOverviewLabel',
      title: 'Overview',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
      initialValue: 'Overview',
    }),
    defineField({
      name: 'subnavBenefitsLabel',
      title: 'Benefits',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
      initialValue: 'Benefits',
    }),
    defineField({
      name: 'subnavDestinationsLabel',
      title: 'Destinations',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
      initialValue: 'Destinations',
    }),
    defineField({
      name: 'subnavBoatsLabel',
      title: 'Boats',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
      initialValue: 'Boats',
    }),
    defineField({
      name: 'subnavFaqLabel',
      title: 'FAQ',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
      initialValue: 'FAQ',
    }),
    // ONE tab for the dates section, not two: "Available Dates" + "Check Availability" were
    // redundant (Adinda, 2026-07-23) — this tab alone navigates to the dates section. (The
    // removed `subnavDatesLabel` field never shipped to a review, so deleting it was free.
    // Its amber "highlighted" variant was also tried and rejected the same day — plain item.)
    defineField({
      name: 'subnavCheckAvailabilityLabel',
      title: 'Check Availability',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
      description: 'The last item in the section navigation — leads to the available dates section.',
      initialValue: 'Check Availability',
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'name', media: 'heroImage' },
    prepare({ title, media }) {
      return { title: title ?? 'Private Charters', media }
    },
  },
})
