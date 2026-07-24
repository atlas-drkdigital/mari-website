import { defineField, defineType } from 'sanity'

import { CharCountInput } from '../../components/CharCountInput'
import { JsonLdPrefillInput } from '../../components/JsonLdPrefillInput'

// Comprehensive SEO/AEO field set — scanned against Yoast SEO's coverage and
// DRK's drk-seo skill (technical-seo.md, aeo-considerations.md). Character
// limits are guidance (`.warning()`, never `.error()`) — see that skill's
// "Quality Bar Before Shipping" for the 50-60 / 150-160 char targets.
export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fieldsets: [
    {
      name: 'social',
      title: 'Social sharing (Open Graph + Twitter/X)',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'advanced',
      title: 'Advanced',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title',
      type: 'string',
      description: 'Shown in search results and browser tabs. Aim for 50-60 characters. Type {siteName} to insert the site name from Site Settings.',
      // maxLength is a custom option read by CharCountInput — not part of Sanity's built-in StringOptions typing.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options: { maxLength: 60 } as any,
      components: { input: CharCountInput },
      validation: (Rule) => Rule.max(60).warning('Titles over ~60 characters may get truncated in search results.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Shown under the title in search results. Aim for 150-160 characters, include a call to action.',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options: { maxLength: 160 } as any,
      components: { input: CharCountInput },
      validation: (Rule) => Rule.max(160).warning('Descriptions over ~160 characters may get truncated in search results.'),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL override',
      type: 'url',
      description: 'Leave blank to use this page’s own URL. Only set this if this content is duplicated elsewhere and another URL is the "master" version.',
    }),
    defineField({
      name: 'focusKeyword',
      title: 'Focus keyword',
      type: 'string',
      fieldset: 'advanced',
      description: 'The main phrase this page targets. Editorial reference only — there’s no automated scoring tool wired up (unlike Yoast), it just keeps writing focused and searchable.',
    }),
    defineField({
      name: 'breadcrumbTitle',
      title: 'Breadcrumb title',
      type: 'string',
      fieldset: 'advanced',
      description: 'A short label for the breadcrumb trail, if the SEO/page title is too long to show there.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines (noindex)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'noFollow',
      title: 'Don’t follow links on this page (nofollow)',
      type: 'boolean',
      initialValue: false,
      fieldset: 'advanced',
      description: 'Rare — only for pages where you don’t want search engines crediting the pages you link to.',
    }),
    defineField({
      name: 'ogTitle',
      title: 'Social title override',
      type: 'string',
      fieldset: 'social',
      description: 'Leave blank to reuse the SEO title above.',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Social description override',
      type: 'text',
      rows: 2,
      fieldset: 'social',
      description: 'Leave blank to reuse the meta description above.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      fieldset: 'social',
      description: 'Used for Facebook/LinkedIn/etc. link previews. 1200×630px recommended.',
    }),
    defineField({
      name: 'twitterTitle',
      title: 'Twitter/X title override',
      type: 'string',
      fieldset: 'social',
      description: 'Leave blank to reuse the social title (or SEO title) above.',
    }),
    defineField({
      name: 'twitterDescription',
      title: 'Twitter/X description override',
      type: 'text',
      rows: 2,
      fieldset: 'social',
      description: 'Leave blank to reuse the social (or meta) description above.',
    }),
    defineField({
      name: 'twitterImage',
      title: 'Twitter/X image override',
      type: 'image',
      fieldset: 'social',
      description: 'Leave blank to reuse the social share image above.',
    }),
    defineField({
      name: 'overrideJsonLd',
      title: 'Override structured data (JSON-LD)',
      type: 'boolean',
      initialValue: false,
      fieldset: 'advanced',
      description: 'Leave off — structured data is auto-generated from page content. Only enable if you know what you’re doing.',
    }),
    defineField({
      name: 'jsonLd',
      title: 'JSON-LD override',
      type: 'text',
      rows: 12,
      fieldset: 'advanced',
      hidden: ({ parent }) => !parent?.overrideJsonLd,
      components: { input: JsonLdPrefillInput },
      description:
        'Click "Load current structured data" to start from what the page generates, then edit. ' +
        'Invalid JSON is ignored and the automatic structured data is used instead.',
      // Warning, not error: the frontend already fails safe (resolveJsonLd falls back to the
      // generated block on a parse failure) — this just tells the editor their override is
      // being ignored, which closes the _POLISH-BACKLOG "surface invalid JSON in Studio" item.
      validation: (Rule) =>
        Rule.custom((value?: string) => {
          if (!value?.trim()) return true
          try {
            JSON.parse(value)
            return true
          } catch {
            return 'Not valid JSON — the site will ignore this and use the automatic structured data.'
          }
        }).warning(),
    }),
  ],
})
