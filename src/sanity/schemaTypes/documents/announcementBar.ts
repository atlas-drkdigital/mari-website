import { defineField, defineType } from 'sanity'

import { apiVersion } from '../../env'

// Not a singleton — multiple announcements can exist (seasonal promos, storm
// advisories, etc.), but only one should be `active` at a time. Enforced as a
// warning (not a hard block) naming the conflicting one, rather than silently
// disabling another document behind the editor's back.
export const announcementBarType = defineType({
  name: 'announcementBar',
  title: 'Announcement Bar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal name',
      type: 'string',
      description: 'For your reference in the list below — not shown on the site.',
    }),
    defineField({
      name: 'urgencyLevel',
      title: 'Urgency level',
      type: 'string',
      options: {
        list: [
          { title: 'Normal', value: 'normal' },
          { title: 'Medium', value: 'medium' },
          { title: 'High', value: 'high' },
        ],
        layout: 'radio',
      },
      initialValue: 'normal',
      description:
        'Drives the color scheme on the frontend. "High" covers both severe warnings (e.g. weather/storm ' +
        'advisories) and promotions — both render in the same high-urgency color for now, distinguished ' +
        'only by copy. Known limitation, revisit with a separate visual treatment later if needed.',
    }),
    defineField({
      name: 'active',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) =>
        Rule.custom(async (active, context) => {
          if (!active) return true
          const { document, getClient } = context
          if (!document?._id) return true
          const client = getClient({ apiVersion })
          const publishedId = document._id.replace(/^drafts\./, '')
          const draftId = `drafts.${publishedId}`
          const other = await client.fetch(
            `*[_type == "announcementBar" && active == true && !(_id in [$publishedId, $draftId])][0]{title}`,
            { publishedId, draftId }
          )
          if (other?.title) {
            return `"${other.title}" is already active. Only one announcement displays at a time — disable it first, or it's unpredictable which one the frontend shows.`
          }
          return true
        }).warning(),
    }),
    defineField({
      name: 'message',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [{ type: 'link' }],
          },
        },
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Call to action button',
      type: 'object',
      fields: [
        defineField({ name: 'ctaText', title: 'Button text', type: 'string' }),
        defineField({ name: 'link', type: 'link' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', active: 'active', urgencyLevel: 'urgencyLevel' },
    prepare: ({ title, active, urgencyLevel }) => ({
      title: title || 'Untitled announcement',
      subtitle: `${active ? 'Active' : 'Inactive'} · ${urgencyLevel || 'normal'}`,
    }),
  },
})
