import { defineField, defineType } from 'sanity'

// "About the Boats" SHARED SECTION singleton (2026-07-23, Adinda's shared-sections model): the
// section's chrome edited ONCE for every page that mounts the component — today the destination
// pages and Private Charters. Replaces the same four fields that previously lived duplicated on
// destinationDefaults AND privateCharters (migrated by _scripts/migrate-boats-section.ts).
//
// The boat CARDS themselves stay auto-queried from the `boat` documents — this doc is chrome
// only. Tokens: {destination} resolves per page (the charters page resolves it as "Indonesia").
// Per-page overrides (different wording on one page) are deliberately NOT fields here — if one is
// ever wanted, it becomes an optional field on that page's own doc, so this stays genuinely
// shared (flagged with Adinda 2026-07-23).
export const boatsSectionType = defineType({
  name: 'boatsSection',
  title: 'Boats Section',
  type: 'document',
  description: 'The "About the Boats" section shown across pages — edited once, changes everywhere. Type {destination} to insert the page\'s destination name.',
  fields: [
    // TWO eyebrows (Adinda, 2026-07-23): destination pages get the {destination}-token one;
    // every other page gets the generic one. This is what killed the page-code's hardcoded
    // "Indonesia" token value — the generic wording is now editor-owned.
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (destination pages)',
      type: 'string',
      description: 'Shown on destination pages. Type {destination} to insert the destination name.',
    }),
    defineField({
      name: 'eyebrowGeneric',
      title: 'Eyebrow (other pages)',
      type: 'string',
      description: 'Shown wherever this section appears outside a destination page.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading (several boats)',
      type: 'string',
      description: 'Used when more than one boat exists.',
    }),
    // Singular/plural = two explicit fields picked by boat count, not automatic pluralization —
    // same reasoning as everywhere else (translations write both forms verbatim).
    defineField({
      name: 'headingSingular',
      title: 'Heading (single boat)',
      type: 'string',
      description: 'Used while exactly one boat exists. The site picks automatically.',
    }),
    defineField({
      name: 'ctaText',
      title: 'Card button text',
      type: 'string',
      description: 'The link on each boat card — goes to that boat\'s own page.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Boats Section', subtitle: 'Shared "About the Boats" chrome' }
    },
  },
})
