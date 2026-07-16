import { HelpCircleIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// General FAQ (singleton, id "faqGeneral"). INLINE-ARRAY model, chosen 2026-07-16 over separate `faq`
// reference documents: for a non-technical editor, an inline array they can SEE, drag-reorder, and edit
// in place is far more intuitive than a pile of referenced documents opened one at a time (see CLAUDE.md
// "Guiding principle — the CMS/admin experience is a product surface"). One array per category, each
// rendered as a section on the FAQ page; the homepage shows these general questions automatically (first
// N + Read More), no hand-picking. Destination-specific FAQs are SEPARATE — they live on each Destination
// page (the `faq` document type / destination slice), NOT here; the field description says so, so editors
// never wonder where a question belongs. Categories are dynamic (add/reorder them yourself) — kept simple
// for the first pass; richer category management (icons, descriptions) can come later if it earns its keep.
export const faqGeneralType = defineType({
  name: 'faqGeneral',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'categories',
      title: 'FAQ categories',
      type: 'array',
      description:
        'Each category is one section on the FAQ page. Drag to reorder the categories and the questions inside them. These general FAQs also appear on the homepage (the first several). Destination-specific FAQs are managed on each Destination page, not here.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqCategory',
          title: 'Category',
          fields: [
            defineField({
              name: 'title',
              title: 'Category title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'questions',
              title: 'Questions',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'faqItem',
                  title: 'Question',
                  fields: [
                    defineField({
                      name: 'question',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({ name: 'answer', type: 'richTextBasic' }),
                  ],
                  preview: { select: { title: 'question' } },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: 'title', questions: 'questions' },
            prepare({ title, questions }) {
              const n = Array.isArray(questions) ? questions.length : 0
              return { title: title || 'Untitled category', subtitle: `${n} question${n === 1 ? '' : 's'}` }
            },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'FAQ' }) },
})
