import { defineField, defineType } from 'sanity'

import { CharCountInput } from '../../components/CharCountInput'

// Crew member — shown on the About page. Lives in the Studio sidebar's About folder (moved from
// Shared Components 2026-07-24, Adinda: crew appears nowhere else, topic beats abstraction).
// Sidebar comment updated 2026-07-24; the type itself is unchanged by that move.
export const crewMemberType = defineType({
  name: 'crewMember',
  title: 'Crew Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'position', type: 'string' }),
    defineField({
      name: 'bio',
      title: 'Short bio',
      type: 'text',
      rows: 3,
      description: 'Shown over the photo when the portrait is clicked. Aim for one or two short sentences (up to ~220 characters) so it fits the card.',
      // maxLength is a custom option read by CharCountInput — same counter as the SEO fields.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options: { maxLength: 220 } as any,
      components: { input: CharCountInput },
      // Guidance, not a gate (Adinda, 2026-07-24: never a hard rule) — warning only.
      validation: (Rule) => Rule.max(220).warning('Long bios may not fit the bio card, especially on phones.'),
    }),
    defineField({
      name: 'photo',
      type: 'imageWithAlt',
      description: 'Square photos work best — the site shows this as a square (and a circle in the grid). Use at least 1300×1300 px.',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'position', media: 'photo' },
  },
})
