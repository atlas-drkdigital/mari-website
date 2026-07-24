import { defineArrayMember, defineField, defineType } from 'sanity'

import { alignAnnotation } from '../../alignAnnotation'
import { linkAnnotation } from '../../linkAnnotation'

// Tier 3 of the locked 3-tier content model (CLAUDE.md) — "Full Rich Text Block," named and
// extracted as a shared type 2026-07-15 so every tier-3 field (T&C body, boat overview body,
// any future one) stays identical by construction — update this file once, every field using it
// updates together, no per-field drift.
//
// Spec locked 2026-07-15: H1-H6 + Normal + Quote, bold/italic/underline/strike/code, alignment,
// inline image, raw HTML embed. Text color explicitly NOT included for now ("not resolved yet") —
// was on page.ts's original inline config, dropped here on purpose, not an oversight.
//
// H1 REMOVED from the style list (Adinda, 2026-07-23, site-wide SEO pass): every page's H1 is its
// hero title, so an editor picking "H1" in body copy would create a second page H1 — an SEO defect
// no other control can prevent. Amends the 2026-07-15 "H1-H6" spec line above. Existing content is
// unaffected (no body uses h1); if one ever did, RichText.tsx would still render the style — this
// only removes the MENU option.
//
// TABLE added 2026-07-24 (Adinda) via the `@sanity/table` plugin (registered in sanity.config.ts) —
// first consumer is the Onboard Pricing page's four pricing tables. htmlEmbed stays alongside it
// (Adinda confirmed both are wanted, not a replacement).
export const richTextFullType = defineType({
  name: 'richTextFull',
  title: 'Rich Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'H5', value: 'h5' },
        { title: 'H6', value: 'h6' },
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
        // ⚠️ Declaring `annotations` REPLACES Sanity's defaults — it does not merge. `link` is a
        // default, so listing only alignAnnotation here silently removed the link button from every
        // tier-3 field (T&C, blog post, boat/destination overview). Fixed 2026-07-17 (Adinda
        // spotted it). Anything added here must list EVERY annotation the field should have.
        annotations: [alignAnnotation, linkAnnotation],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string', description: 'Strongly recommended, not required.' }),
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
    // `table` — registered by the @sanity/table plugin (sanity.config.ts), added 2026-07-24 for the
    // Onboard Pricing tables (see seed-onboard-pricing.ts's header for why this was deferred out of
    // the original content-only pass). Shape: `{ rows: [{ _type: 'tableRow', cells: string[] }] }`.
    // htmlEmbed STAYS — Adinda confirmed both are wanted (table for real editable data, htmlEmbed for
    // booking widgets/maps). Rendered in RichText.tsx per the "render it in the same pass" rule above.
    defineArrayMember({ type: 'table' }),
  ],
})
