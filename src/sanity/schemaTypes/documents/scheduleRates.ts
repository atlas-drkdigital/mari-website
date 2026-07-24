import { defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'

// Schedule & Rates page — SINGLETON since the booking slice (2026-07-24, enforced in structure.ts
// like privateCharters/aboutPage). Route is /booking (locked by Adinda 2026-07-24). INSEANQ is a
// copy-paste embed, not a real integration — see MANAGER.md.
//
// Grown from the original 4-field scaffold in the same slice. Existing field NAMES (title, slug,
// embedCode, seo) are kept — renames are the expensive bucket per the 80/20 rule. embedCode's TYPE
// changed text → htmlEmbed (matches privateCharters.availabilityEmbed); safe because zero
// scheduleRates documents existed at change time (verified by GROQ 2026-07-24).
//
// Page shape (Adinda's dictation 2026-07-24, revised same day at QA round 1): PHOTO hero band
// (H1 + description over a full-bleed image — was a light-texture band for one day) → widget
// card overlapping the band seam → categorized FAQ (General FAQ categories toggled on via
// showOnBookingPage) → Contact. FAQ chrome mirrors privateCharters' faq block; no page-own FAQ
// categories here — this page only composes shared General FAQ ones.
// Groups mirrored by titled fieldsets (site-wide convention).
export const scheduleRatesType = defineType({
  name: 'scheduleRates',
  title: 'Schedule & Rates',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'faq', title: 'FAQ' },
    { name: 'seo', title: 'SEO' },
  ],
  fieldsets: [
    { name: 'contentFs', title: 'Content' },
    { name: 'faqFs', title: 'FAQ' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content', fieldset: 'contentFs' }),
    // Slug order locked: title, then slug immediately after — same for every page type. NOTE the
    // live route is the fixed /booking path (singleton — the route path itself is the URL, same
    // as privateCharters); this field predates that lock and is kept per the no-renames call.
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      components: { input: AutoSlugInput },
      group: 'content',
      fieldset: 'contentFs',
      description: 'URL path for this page.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'richTextBasic',
      group: 'content',
      fieldset: 'contentFs',
      description: 'Shown under the page title — supports bold, links, multiple paragraphs.',
    }),
    // Added at QA round 1 (2026-07-24, Adinda): the hero became a photo hero (was a light-texture
    // band for exactly one day). Same imageWithAlt shape as every other page hero.
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageWithAlt',
      group: 'content',
      fieldset: 'contentFs',
      description: 'Full-width background image for the page hero.',
    }),
    defineField({
      name: 'embedCode',
      title: 'INSEANQ embed code',
      type: 'htmlEmbed',
      group: 'content',
      fieldset: 'contentFs',
      description: 'The booking widget code. The section is hidden entirely while this is empty.',
    }),

    // ----- FAQ — shared General FAQ categories composed in via their "Show on the Schedule &
    // Rates page" toggle. Chrome fields mirror privateCharters.ts's faq block. -----
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

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Schedule & Rates' }
    },
  },
})
