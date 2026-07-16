import { HelpCircleIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// General FAQ (singleton, id "faqGeneral") — the cross-cutting questions that aren't tied to one
// destination or one boat, and the content behind the /faq hub page. Categories are an inline array
// of the shared `faqSection` object, the same shape destinations and boats use.
//
// Scope rule this type exists to enforce: only put a question here if it's true regardless of which
// trip or boat the guest books. Destination-specific questions live on the destination; boat-specific
// ones live on the boat. Pages compose the two (a destination page also shows What's Included from
// here), so a question written once shows everywhere it's relevant without being duplicated.
//
// The seeded category titles are defaults, not a fixed list — editors can rename, reorder, add, and
// remove them. Seeding via initialValue gives a new document a sensible starting structure without
// locking the taxonomy in code (same approach as boat's `specifications`).
export const faqGeneralType = defineType({
  name: 'faqGeneral',
  title: 'General FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  groups: [
    { name: 'content', title: 'FAQ Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'categories',
      title: 'FAQ categories',
      type: 'array',
      group: 'content',
      description:
        'Each category is one section on the FAQ page. Drag to reorder the categories and the questions inside them. Only add questions here that apply to every trip. Questions about a single destination or a single boat are edited on that destination or boat.',
      of: [defineArrayMember({ type: 'faqSection' })],
      initialValue: [
        { _type: 'faqSection', title: 'Payment & Booking', questions: [] },
        { _type: 'faqSection', title: "What's Included", questions: [] },
        { _type: 'faqSection', title: 'Others', questions: [] },
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'General FAQ' }) },
})
