import { defineField, defineType } from 'sanity'

export const redirectType = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  fields: [
    defineField({ name: 'source', title: 'From path', type: 'string' }),
    defineField({ name: 'destination', title: 'To path or URL', type: 'string' }),
    defineField({ name: 'permanent', title: 'Permanent (301)', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { source: 'source', destination: 'destination' },
    prepare: ({ source, destination }) => ({
      title: source,
      subtitle: `→ ${destination}`,
    }),
  },
})
