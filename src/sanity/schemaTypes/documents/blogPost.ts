import { defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'

// Shell only — blog is explicitly "a few dummy/placeholder posts to demo what it looks like, not
// real content yet" (mari-project page inventory, 2026-07-15). `category` and `author` are
// references to their own managed document types (blogCategory, author), not free text/enums —
// Adinda wants both editor-manageable without a code change (2026-07-16). `tags` explicitly NOT
// built yet — floated as a maybe, not a confirmed need; add if/when a real use case shows up,
// same discipline as other deferred fields in this project.
export const blogPostType = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      components: { input: AutoSlugInput },
      group: 'content',
      description: 'URL path for this post.',
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'blogCategory' }],
      group: 'content',
    }),
    defineField({ name: 'coverImage', type: 'imageWithAlt', group: 'content' }),
    defineField({ name: 'excerpt', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'body', type: 'richTextFull', group: 'content' }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'content',
    }),
    defineField({
      name: 'relatedDestination',
      title: 'Related destination',
      type: 'reference',
      to: [{ type: 'destination' }],
      group: 'content',
      description: 'Optional. Links this post to a destination page, if relevant.',
    }),
    defineField({ name: 'postDate', type: 'datetime', group: 'content' }),
    defineField({ name: 'lastUpdatedAt', title: 'Last updated', type: 'datetime', group: 'content' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category.name', media: 'coverImage' },
  },
})
