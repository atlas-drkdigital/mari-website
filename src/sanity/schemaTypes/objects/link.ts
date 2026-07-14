import { defineField, defineType } from 'sanity'

// Shared by navItem, linkItem, and any CTA button — one place to add more
// referenceable page types to `to: [...]` as they're built (destinationPage, boatPage, ...).
export const linkType = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      type: 'string',
      options: { list: ['internal', 'external'], layout: 'radio', direction: 'horizontal' },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internalLink',
      title: 'Page',
      type: 'reference',
      to: [{ type: 'page' }],
      hidden: ({ parent }) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      title: 'URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'external',
    }),
    defineField({
      name: 'openInNewTab',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.linkType !== 'external',
    }),
  ],
})
