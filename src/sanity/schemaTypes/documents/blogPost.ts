import { defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'

// Shell only — blog is explicitly "a few dummy/placeholder posts to demo what it looks like".
// `category` and `author` are references to their own managed document types. `tags` explicitly
// NOT built yet. Groups mirrored by titled fieldsets (site-wide convention).
export const blogPostType = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fieldsets: [
    { name: 'contentFs', title: 'Content' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content', fieldset: 'contentFs', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      components: { input: AutoSlugInput },
      group: 'content',
      fieldset: 'contentFs',
      description: 'URL path for this post.',
    }),
    defineField({ name: 'category', type: 'reference', to: [{ type: 'blogCategory' }], group: 'content', fieldset: 'contentFs' }),
    defineField({ name: 'coverImage', type: 'imageWithAlt', group: 'content', fieldset: 'contentFs' }),
    defineField({ name: 'excerpt', type: 'text', rows: 3, group: 'content', fieldset: 'contentFs' }),
    defineField({ name: 'body', type: 'richTextFull', group: 'content', fieldset: 'contentFs' }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }], group: 'content', fieldset: 'contentFs' }),
    defineField({
      name: 'relatedDestination',
      title: 'Related destination',
      type: 'reference',
      to: [{ type: 'destination' }],
      group: 'content',
      fieldset: 'contentFs',
      description: 'Optional. Links this post to a destination page, if relevant.',
    }),
    defineField({ name: 'postDate', type: 'datetime', group: 'content', fieldset: 'contentFs' }),
    defineField({ name: 'lastUpdatedAt', title: 'Last updated', type: 'datetime', group: 'content', fieldset: 'contentFs' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category.name', media: 'coverImage' },
  },
})
