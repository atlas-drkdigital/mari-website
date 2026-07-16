import { defineField, defineType } from 'sanity'

// Singleton (one document, id "siteSettings") — locked via Structure, see src/sanity/structure.ts.
export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description:
    'Site-wide settings: company/contact info, social links, favicon and logo, and the fallback SEO used ' +
    'when a page doesn’t set its own. This is not page content — individual pages have their own SEO tab.',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'assets', title: 'Assets' },
  ],
  // Fieldsets render as titled sections even in the flat "All Fields" tab, unlike groups
  // (which only separate tabs) — use them for visual headers within/across tabs.
  fieldsets: [
    { name: 'siteBasics', title: 'Site Basics' },
    { name: 'contact', title: 'Contact & Social' },
    { name: 'contactSection', title: 'Contact Section (heading & intro shown on the contact form)' },
    { name: 'assetsFieldset', title: 'Assets' },
    { name: 'seoDefaults', title: 'Default SEO' },
    { name: 'tracking', title: 'Tracking & Verification' },
  ],
  fields: [
    defineField({
      name: 'companyName',
      type: 'string',
      group: 'general',
      fieldset: 'siteBasics',
      initialValue: 'PT Wisata Laut Indah',
      description: 'Legal/full company name — used in footer copyright and structured data (Organization schema).',
    }),
    defineField({
      name: 'siteTitle',
      type: 'string',
      group: 'general',
      fieldset: 'siteBasics',
      description: 'The site’s brand name as shown in browser tabs and search results by default (pages can override this in their own SEO tab).',
    }),
    defineField({
      name: 'siteDescription',
      type: 'text',
      rows: 3,
      group: 'general',
      fieldset: 'siteBasics',
      description: 'Fallback meta description for pages that don’t set their own.',
    }),
    defineField({
      name: 'contactEmails',
      title: 'Contact emails',
      type: 'array',
      of: [{ type: 'contactEmail' }],
      group: 'general',
      fieldset: 'contact',
      description: 'Shown in the footer / contact page.',
    }),
    defineField({
      name: 'contactPhones',
      title: 'Contact phones',
      type: 'array',
      of: [{ type: 'contactPhone' }],
      group: 'general',
      fieldset: 'contact',
      description: 'Mark each as WhatsApp or landline — the frontend shows the WhatsApp click-to-chat icon only for WhatsApp numbers.',
    }),
    defineField({
      name: 'socialLinks',
      type: 'array',
      of: [{ type: 'socialLink' }],
      group: 'general',
      fieldset: 'contact',
      description: 'Shown in the footer (and header, if the design calls for it).',
    }),
    // Contact SECTION copy (eyebrow/heading/intro) — the editorial text on the contact form, which
    // appears near-everywhere, so it's edited once here rather than per page (moved out of homePage
    // 2026-07-16, Adinda's call). The form fields themselves are UI (in code); only this copy is
    // content. The contact EMAILS/phones/socials above are the actual contact details.
    defineField({
      name: 'contactEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'general',
      fieldset: 'contactSection',
      description: 'Small kicker above the contact heading, e.g. “Contact Us”.',
    }),
    defineField({
      name: 'contactHeading',
      title: 'Heading',
      type: 'string',
      group: 'general',
      fieldset: 'contactSection',
    }),
    defineField({
      name: 'contactIntro',
      title: 'Intro',
      type: 'text',
      rows: 2,
      group: 'general',
      fieldset: 'contactSection',
    }),
    defineField({
      name: 'logo',
      type: 'imageWithAlt',
      group: 'assets',
      fieldset: 'assetsFieldset',
      description: 'Main site logo — used in the header and footer.',
    }),
    defineField({
      name: 'favicon',
      type: 'imageWithAlt',
      group: 'assets',
      fieldset: 'assetsFieldset',
      description: 'Browser tab icon. Square, works best simplified (favicons render very small). Alt text here is mostly moot (favicons aren\'t announced by screen readers) but kept for schema consistency — the hard site-wide image rule applies everywhere, no per-field exceptions.',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      fieldset: 'seoDefaults',
      description: 'Fallback used by any page that doesn’t set its own SEO tab — not homepage-specific, applies to every page without its own SEO override.',
    }),
    // Added 2026-07-16, Adinda's ask — a place to paste tracking/verification snippets (Google Tag
    // Manager, Google Search Console site-verification meta tag, etc.) without a code deploy.
    // Rendered into the document <head> once the frontend's metadata/layout wiring reads this
    // field — not built yet (no components consume siteSettings yet, same status as everything
    // else waiting on the Sanity-wiring pass). robots.txt / llms.txt are separate: they're static
    // Next.js route files (src/app/robots.ts and similar), not Sanity content, so nothing to add
    // here for those.
    defineField({
      name: 'headScripts',
      title: 'Head scripts',
      type: 'text',
      rows: 8,
      group: 'seo',
      fieldset: 'tracking',
      description: 'Raw HTML/script snippets injected into every page\'s <head> — e.g. Google Tag Manager, Google Search Console verification, other meta tracking tags.',
    }),
  ],
})
