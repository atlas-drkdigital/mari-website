import { defineField, defineType } from 'sanity'

export const linkItemType = defineType({
  name: 'linkItem',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'link', type: 'link' }),
  ],
  preview: {
    select: { title: 'title' },
  },
})
