import { defineField, defineType } from 'sanity'

// Crew member — shown on the About page. A shared, repeatable component (like whyUsItem /
// testimonial), so it lives in the Shared Components sidebar section, not on the About page doc.
// Adinda's ask 2026-07-16. First-pass fields; extend if the About build needs more.
export const crewMemberType = defineType({
  name: 'crewMember',
  title: 'Crew Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'position', type: 'string' }),
    defineField({ name: 'bio', title: 'Short bio', type: 'text', rows: 3 }),
    defineField({ name: 'photo', type: 'imageWithAlt' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'position', media: 'photo' },
  },
})
