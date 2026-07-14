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
    { name: 'assetsFieldset', title: 'Assets' },
    { name: 'seoDefaults', title: 'Default SEO' },
  ],
  fields: [
    defineField({
      name: 'companyName',
      type: 'string',
      group: 'general',
      fieldset: 'siteBasics',
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
    defineField({
      name: 'logo',
      type: 'image',
      group: 'assets',
      fieldset: 'assetsFieldset',
      description: 'Main site logo — used in the header and footer.',
    }),
    defineField({
      name: 'favicon',
      type: 'image',
      group: 'assets',
      fieldset: 'assetsFieldset',
      description: 'Browser tab icon. Square, works best simplified (favicons render very small).',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      fieldset: 'seoDefaults',
      description: 'Fallback used by any page that doesn’t set its own SEO tab — not homepage-specific, applies to every page without its own SEO override.',
    }),
  ],
})
