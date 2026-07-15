import { defineField, defineType } from 'sanity'

export const navItemType = defineType({
  name: 'navItem',
  title: 'Nav item',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'link', type: 'link' }),
    defineField({
      name: 'menuStyle',
      title: 'Dropdown style',
      type: 'string',
      options: {
        list: [
          { title: 'Simple list (manual children below)', value: 'simple' },
          { title: 'Destinations grid (auto-populated — not wired yet)', value: 'destinationsGrid' },
        ],
        layout: 'radio',
      },
      initialValue: 'simple',
      description:
        '"Destinations grid" is a placeholder — the actual auto-population from Destination pages ' +
        'isn’t wired yet. See CLAUDE.md’s Navigation section for the to-do to wire this. Until then ' +
        'this item still uses the manual children list below regardless of this setting.',
    }),
    defineField({
      name: 'children',
      title: 'Manual children',
      type: 'array',
      of: [{ type: 'linkItem' }],
      hidden: ({ parent }) => parent?.menuStyle === 'destinationsGrid',
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
})
