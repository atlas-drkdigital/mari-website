import { defineField, defineType } from 'sanity'

// Individual physical cabin (e.g. "Cabin 1"), distinct from `cabinType` (the category it belongs
// to, e.g. "Deluxe Cabin"). Deliberately minimal — Adinda asked for this to exist so each cabin
// can be tied to a specific boat, but no concrete use case beyond that reference (per-cabin
// booking/inventory, individual photos, etc.) has been named yet. Same discipline as the `faq`
// `is_featured` field that got dropped for lacking a use case (_handoff/mari-website.md) — add
// fields here when a real need shows up, not speculatively.
// Named cabinDocType (not the mechanical cabinType) — that name is already taken by the OTHER
// schema in this pair (cabinType.ts's `cabinTypeType`) and reusing it here would be misleading.
export const cabinDocType = defineType({
  name: 'cabin',
  title: 'Cabin',
  type: 'document',
  fields: [
    defineField({
      name: 'boat',
      type: 'reference',
      to: [{ type: 'boat' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cabinType',
      type: 'reference',
      to: [{ type: 'cabinType' }],
      validation: (Rule) => Rule.required(),
      // Only offer cabin types that belong to the same boat already picked above.
      options: {
        filter: ({ document }) => {
          const boatRef = (document as { boat?: { _ref?: string } })?.boat?._ref
          return boatRef ? { filter: 'boat._ref == $boatRef', params: { boatRef } } : {}
        },
      },
    }),
    defineField({
      name: 'name',
      title: 'Cabin name/number',
      type: 'string',
      description: 'e.g. "Cabin 1" or "Deluxe 1"',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'cabinType.name' },
  },
})
