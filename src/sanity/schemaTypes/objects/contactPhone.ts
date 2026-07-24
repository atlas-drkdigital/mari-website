import { defineField, defineType } from 'sanity'

export const contactPhoneType = defineType({
  name: 'contactPhone',
  title: 'Phone',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'Landline / non-WhatsApp', value: 'landline' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'label',
      type: 'string',
      description: 'Optional — only shown on the site if there’s more than one number of this type.',
    }),
    defineField({ name: 'number', type: 'string' }),
  ],
  preview: {
    select: { type: 'type', label: 'label', number: 'number' },
    prepare: ({ type, label, number }) => ({ title: number, subtitle: label || type }),
  },
})
