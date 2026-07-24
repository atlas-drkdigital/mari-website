import { defineField, defineType } from 'sanity'

// Every image on the site uses this instead of bare `type: 'image'`, so an editable `alt` field is
// ALWAYS present. That's the DRK-wide hard requirement: every image must HAVE an editable alt
// field — NOT that alt is required-to-fill (an editor can upload without it). Alt is also the SEO
// lever: Sanity's CDN URLs are hash-based, and the frontend's urlFor() helper will slugify this
// alt into a "vanity filename" appended to the URL once images get wired to Sanity (not built yet).
export const imageWithAltType = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describes the image for screen readers and search engines. Strongly recommended, not required.',
    }),
  ],
})
