import { defineField, defineType } from 'sanity'

export const contactEmailType = defineType({
  name: 'contactEmail',
  title: 'Email',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      description: 'Optional — only shown on the site if there’s more than one email listed (e.g. "Reservations", "Charters").',
    }),
    defineField({ name: 'email', type: 'string' }),
  ],
  preview: {
    select: { label: 'label', email: 'email' },
    prepare: ({ label, email }) => ({ title: email, subtitle: label }),
  },
})
