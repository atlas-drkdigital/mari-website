import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { sharedComponentNote } from '../../components/SharedComponentNote'

// Homepage singleton (id "homePage"), built against the ACTUAL rendered homepage
// (src/app/page.tsx + src/components/sections/*) — the real page is the source of truth, not the
// Figma mockup (Adinda's call). Section order on the page: Hero, The Boat, Why Us, Destinations,
// Latest Articles, FAQ, Testimonials, CTA, Contact, Footer.
//
// Field organization follows CLAUDE.md's locked conventions:
//  - Every group (tab) is mirrored by a titled fieldset, so section headers also show in the flat
//    "All Fields" view; every field declares BOTH its group and its fieldset.
//  - All section EYEBROWS (kickers) live in one dedicated "Section Labels" tab — an editor must be
//    able to find the little kicker texts in one clearly-labeled place, not hunt per section.
//  - Sections whose content lives in a SHARED component carry a signpost note (sharedComponentNote)
//    telling the editor where to go: CTA → CTA Section; Why Us → Why Us Items; FAQ → FAQ;
//    Testimonials → Testimonials; Latest Articles → Blog Posts.
//  - Footer and Nav are global chrome (every page), so they are NOT modeled here — they belong to
//    siteSettings/navigation, wired in a separate slice.
//  - The Contact SECTION copy (eyebrow/heading/intro) is likewise NOT here: the contact block
//    appears near-everywhere and only its labels are editable, so it lives in siteSettings
//    ("Contact Section"), edited once globally (Adinda's call 2026-07-16). Moved out of homePage.
export const homePageType = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'theBoat', title: 'The Boat' },
    { name: 'whyUs', title: 'Why Us' },
    { name: 'destinations', title: 'Destinations' },
    { name: 'latestArticles', title: 'Latest Articles' },
    { name: 'faq', title: 'FAQ' },
    { name: 'testimonials', title: 'Testimonials' },
    { name: 'cta', title: 'CTA' },
    { name: 'sectionLabels', title: 'Section Labels' },
    { name: 'seo', title: 'SEO' },
  ],
  fieldsets: [
    { name: 'heroFs', title: 'Hero' },
    { name: 'theBoatFs', title: 'The Boat' },
    { name: 'whyUsFs', title: 'Why Us' },
    { name: 'destinationsFs', title: 'Destinations' },
    { name: 'latestArticlesFs', title: 'Latest Articles' },
    { name: 'faqFs', title: 'FAQ' },
    { name: 'testimonialsFs', title: 'Testimonials' },
    { name: 'ctaFs', title: 'CTA' },
    { name: 'sectionLabelsFs', title: 'Section Labels — the small kicker text above each section heading' },
    { name: 'seoFs', title: 'SEO' },
  ],
  fields: [
    // ----- Hero -----
    defineField({
      name: 'heroHeadingAccent',
      title: 'Heading — accent line',
      type: 'string',
      group: 'hero',
      fieldset: 'heroFs',
      description: 'The larger script-styled first line of the hero title.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroHeadingMain',
      title: 'Heading — main line',
      type: 'string',
      group: 'hero',
      fieldset: 'heroFs',
      description: 'The second line of the hero title.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
      group: 'hero',
      fieldset: 'heroFs',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Background image',
      type: 'imageWithAlt',
      group: 'hero',
      fieldset: 'heroFs',
      validation: (Rule) => Rule.required(),
    }),

    // ----- The Boat -----
    defineField({
      name: 'theBoatHeading',
      title: 'Heading',
      type: 'string',
      group: 'theBoat',
      fieldset: 'theBoatFs',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'theBoatBody',
      title: 'Body',
      type: 'richTextBasic',
      group: 'theBoat',
      fieldset: 'theBoatFs',
    }),
    defineField({
      name: 'theBoatImage',
      title: 'Image',
      type: 'imageWithAlt',
      group: 'theBoat',
      fieldset: 'theBoatFs',
    }),
    defineField({
      name: 'theBoatLinkText',
      title: 'Link text',
      type: 'string',
      group: 'theBoat',
      fieldset: 'theBoatFs',
      description: 'Text of the link to the boat page.',
    }),

    // ----- Why Us -----
    defineField({
      name: 'whyUsHeading',
      title: 'Heading',
      type: 'string',
      group: 'whyUs',
      fieldset: 'whyUsFs',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whyUsItems',
      title: 'Items',
      type: 'array',
      group: 'whyUs',
      fieldset: 'whyUsFs',
      description: 'Choose which items appear, and in what order (2 to 4).',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'whyUsItem' }] })],
      validation: (Rule) => Rule.min(2).max(4),
    }),
    sharedComponentNote({
      name: 'whyUsNote',
      title: 'Where this content lives',
      group: 'whyUs',
      fieldset: 'whyUsFs',
      message:
        'Each item’s image, headline, and description are edited under “Why Us Items” in Shared Components. Above you only choose which items appear here and in what order.',
    }),

    // ----- Destinations -----
    sharedComponentNote({
      name: 'destinationsNote',
      title: 'Where this content lives',
      group: 'destinations',
      fieldset: 'destinationsFs',
      message:
        'The destinations carousel is built from your Destination documents. Add or edit destinations, their images, and taglines under “Destinations”.',
    }),

    // ----- Latest Articles -----
    defineField({
      name: 'latestArticlesHeading',
      title: 'Heading',
      type: 'string',
      group: 'latestArticles',
      fieldset: 'latestArticlesFs',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'latestArticlesLinkText',
      title: 'Link text',
      type: 'string',
      group: 'latestArticles',
      fieldset: 'latestArticlesFs',
      description: 'Text of the link to the blog.',
    }),
    sharedComponentNote({
      name: 'latestArticlesNote',
      title: 'Where this content lives',
      group: 'latestArticles',
      fieldset: 'latestArticlesFs',
      message:
        'The three most recent Blog Posts are shown here automatically. Write or edit posts under “Blog Posts”.',
    }),

    // ----- FAQ -----
    defineField({
      name: 'faqHeading',
      title: 'Heading',
      type: 'string',
      group: 'faq',
      fieldset: 'faqFs',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'faqLinkText',
      title: 'Link text',
      type: 'string',
      group: 'faq',
      fieldset: 'faqFs',
      description: 'Text of the link to the full FAQ page.',
    }),
    sharedComponentNote({
      name: 'faqNote',
      title: 'Where this content lives',
      group: 'faq',
      fieldset: 'faqFs',
      message:
        'Your general FAQ questions appear here automatically (the first several) — you don’t pick them one by one. Write and reorder them under “FAQ (General)” in Shared Components; the homepage follows that order.',
    }),

    // ----- Testimonials -----
    defineField({
      name: 'testimonialsHeading',
      title: 'Heading',
      type: 'string',
      group: 'testimonials',
      fieldset: 'testimonialsFs',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'testimonialsLinkText',
      title: 'Link text',
      type: 'string',
      group: 'testimonials',
      fieldset: 'testimonialsFs',
      description: 'Text of the link to the full testimonials page.',
    }),
    defineField({
      name: 'testimonialItems',
      title: 'Reviews',
      type: 'array',
      group: 'testimonials',
      fieldset: 'testimonialsFs',
      description: 'Choose which reviews appear on the homepage, and in what order.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
    }),
    sharedComponentNote({
      name: 'testimonialsNote',
      title: 'Where this content lives',
      group: 'testimonials',
      fieldset: 'testimonialsFs',
      message:
        'Reviews are managed under “Testimonials” in Shared Components. Above you only choose which of them appear on the homepage.',
    }),

    // ----- CTA (fully shared — no homepage-owned content) -----
    sharedComponentNote({
      name: 'ctaNote',
      title: 'Where this content lives',
      group: 'cta',
      fieldset: 'ctaFs',
      message:
        'The two-card call-to-action (Private Charter / Shared Trip) is edited under “CTA Section” in Shared Components. It is reused across pages, so there is nothing to edit for it here.',
    }),

    // Contact section copy moved to siteSettings ("Contact Section") — global, not homepage-owned.

    // ----- Section Labels (all eyebrows in one place) -----
    defineField({
      name: 'heroEyebrow',
      title: 'Hero eyebrow',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
    }),
    defineField({
      name: 'heroSearchPlaceholder',
      title: 'Hero search placeholder',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
      description: 'Placeholder text inside the hero’s destination search box.',
    }),
    defineField({
      name: 'theBoatEyebrow',
      title: 'The Boat eyebrow',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
    }),
    defineField({
      name: 'whyUsEyebrow',
      title: 'Why Us eyebrow',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
    }),
    defineField({
      name: 'latestArticlesEyebrow',
      title: 'Latest Articles eyebrow',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
    }),
    defineField({
      name: 'faqEyebrow',
      title: 'FAQ eyebrow',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
    }),
    defineField({
      name: 'testimonialsEyebrow',
      title: 'Testimonials eyebrow',
      type: 'string',
      group: 'sectionLabels',
      fieldset: 'sectionLabelsFs',
    }),
    // (Contact eyebrow lives in siteSettings "Contact Section", not here.)

    // ----- SEO -----
    defineField({ name: 'seo', type: 'seo', group: 'seo', fieldset: 'seoFs' }),
  ],
  preview: {
    prepare: () => ({ title: 'Homepage' }),
  },
})
