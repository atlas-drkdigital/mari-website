import { defineField } from 'sanity'

// Ported from the MVP repo (mari-website-mvp/sanity/alignAnnotation.tsx) — keep
// in sync with that source of truth for the `page` type's rich text.
// Toolbar icon for the Align annotation button
export const AlignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="1em" height="1em">
    <rect x="1" y="3" width="14" height="2" rx="1" />
    <rect x="3.5" y="7" width="9" height="2" rx="1" />
    <rect x="1" y="11" width="14" height="2" rx="1" />
  </svg>
)

// Annotation: stores alignment in markDefs independently of block style,
// so headings (h1-h4) keep their style AND can be aligned. Edited via the
// native annotation popover — no custom render components (those broke the
// editor: a Fragment-returning annotation component corrupts the PTE DOM).
export const alignAnnotation = {
  name: 'align',
  type: 'object' as const,
  title: 'Alignment',
  icon: AlignIcon,
  fields: [
    defineField({
      name: 'align',
      title: 'Align text',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
          { title: 'Justify', value: 'justify' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
  ],
}
