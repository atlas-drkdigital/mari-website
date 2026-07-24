import { defineField, defineType } from 'sanity'

// Known platforms render their icon from the frontend's existing icon set
// (already built for the static homepage) — no icon upload needed for those.
// "Other" is the escape hatch for anything not in the list.
export const socialLinkType = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      type: 'string',
      options: {
        list: [
          { title: 'Instagram', value: 'instagram' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'X (Twitter)', value: 'x' },
          { title: 'TripAdvisor', value: 'tripadvisor' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'customPlatformName',
      title: 'Platform name',
      type: 'string',
      hidden: ({ parent }) => parent?.platform !== 'other',
    }),
    defineField({
      name: 'customIcon',
      title: 'Icon',
      type: 'image',
      hidden: ({ parent }) => parent?.platform !== 'other',
    }),
    defineField({ name: 'url', type: 'url' }),
  ],
  preview: {
    select: { platform: 'platform', customPlatformName: 'customPlatformName', url: 'url' },
    prepare: ({ platform, customPlatformName, url }) => ({
      title: platform === 'other' ? customPlatformName || 'Other' : platform,
      subtitle: url,
    }),
  },
})
