import { defineArrayMember, defineField, defineType } from 'sanity'

// One FAQ category: a title plus the questions inside it. Shared by the General FAQ singleton, each
// destination, and each boat, so all three edit FAQs the same way — an inline array the editor can
// see, drag-reorder, and edit in place, rather than a pile of reference documents opened one at a
// time (see CLAUDE.md "the CMS/admin experience is a product surface").
//
// `isFeatured` drives the homepage's FAQ section, which pulls featured questions from the General FAQ
// and from boats. Destinations don't feed the homepage, so the toggle is hidden there rather than
// shown-but-inert — a control that silently does nothing is worse than no control at all.
export const faqSectionType = defineType({
  name: 'faqSection',
  title: 'FAQ Category',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Category title',
      type: 'string',
      description: 'Shown as the heading for this group of questions.',
      validation: (Rule) => Rule.required(),
    }),
    // Which General FAQ categories are composed onto every boat page. A visible toggle, NOT a
    // title match (replaced 2026-07-21, Adinda): matching on the title meant renaming a category
    // silently dropped it from boat pages — the toggle survives renames and the editor can SEE
    // what's shared where. Only meaningful on the General FAQ (boats/destinations don't compose
    // into each other), so it's hidden elsewhere — same reasoning as `isFeatured` below.
    defineField({
      name: 'showOnBoatPages',
      title: 'Show on every boat page',
      type: 'boolean',
      description: 'Include this category in the FAQ section of every boat page.',
      initialValue: false,
      hidden: ({ document }) => document?._type !== 'faqGeneral',
    }),
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      description: 'Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          title: 'Question',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'richTextBasic',
              description: 'Lead with a direct answer in the first sentence or two, then add detail.',
            }),
            defineField({
              name: 'isFeatured',
              title: 'Feature on homepage',
              type: 'boolean',
              description: 'Show this question in the homepage FAQ section.',
              initialValue: false,
              hidden: ({ document }) => document?._type === 'destination',
            }),
          ],
          preview: {
            select: { title: 'question', isFeatured: 'isFeatured' },
            prepare({ title, isFeatured }) {
              return {
                title: title || 'Untitled question',
                subtitle: isFeatured ? 'Featured on homepage' : undefined,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', questions: 'questions' },
    prepare({ title, questions }) {
      const n = Array.isArray(questions) ? questions.length : 0
      return {
        title: title || 'Untitled category',
        subtitle: `${n} question${n === 1 ? '' : 's'}`,
      }
    },
  },
})
