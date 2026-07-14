import { defineArrayMember, defineField, defineType } from 'sanity'

import { AutoSlugInput } from '../../components/AutoSlugInput'
import { alignAnnotation } from '../../alignAnnotation'

// Generic simple page — title, slug, rich text body. Terms & Conditions is one
// entry of this type, not its own schema. Body spec ported directly from the
// live MVP repo (mari-website-mvp/sanity/schemas/documents/page.ts) 2026-07-14
// — this is what's actually live/proven, not a fresh design. No link
// annotation (matches Adinda's "we'll figure out links later" call this
// session) — align + text color only, plus image and raw HTML embed members.
export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content' }),
    defineField({
      name: 'body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              alignAnnotation,
              {
                name: 'textColor',
                type: 'object',
                title: 'Text Color',
                fields: [defineField({ name: 'color', type: 'color', title: 'Color' })],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  { title: 'Full width', value: 'full' },
                  { title: 'Large (75%)', value: 'large' },
                  { title: 'Medium (50%)', value: 'medium' },
                  { title: 'Small (33%)', value: 'small' },
                ],
                layout: 'radio',
              },
              initialValue: 'full',
            }),
            defineField({
              name: 'alignment',
              title: 'Alignment',
              type: 'string',
              options: {
                list: [
                  { title: 'Center', value: 'center' },
                  { title: 'Left', value: 'left' },
                  { title: 'Right', value: 'right' },
                ],
                layout: 'radio',
              },
              initialValue: 'center',
            }),
          ],
        }),
        defineArrayMember({ type: 'htmlEmbed' }),
      ],
    }),
    defineField({
      name: 'showContactSection',
      title: 'Show "Talk to Us" section at bottom',
      type: 'boolean',
      initialValue: true,
      group: 'content',
    }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      components: { input: AutoSlugInput },
      group: 'settings',
    }),
    // Localization prep — inert until the document-internationalization plugin is installed.
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true, group: 'settings' }),
  ],
})
