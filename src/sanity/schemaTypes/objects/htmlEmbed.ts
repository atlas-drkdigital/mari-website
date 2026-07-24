import { defineField, defineType } from 'sanity'

// Ported from the MVP repo — same shape, kept in sync.
export const htmlEmbedType = defineType({
  name: 'htmlEmbed',
  title: 'Custom HTML / Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'html',
      title: 'HTML',
      type: 'text',
      rows: 8,
      description: 'Paste any HTML here — YouTube iframe, <table>, embed code, etc.',
    }),
  ],
  preview: {
    select: { html: 'html' },
    prepare: ({ html }) => ({
      title: 'Custom HTML',
      subtitle: html ? html.replace(/\s+/g, ' ').slice(0, 60) + (html.length > 60 ? '…' : '') : '(empty)',
    }),
  },
})
