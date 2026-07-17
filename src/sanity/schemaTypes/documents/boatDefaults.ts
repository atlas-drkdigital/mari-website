import { defineField, defineType } from 'sanity'

// Singleton (one document, id "boatDefaults") — pinned in Structure, nested under the "Boats"
// folder in the sidebar. Holds the section eyebrows + headings that are the SAME across every
// boat page, edited ONCE here instead of retyped on each boat (locked 2026-07-17, Adinda). Use
// the token {boat} anywhere the boat's short name should appear — the frontend swaps it in per
// page. Per-boat UNIQUE content (the Overview heading/body, cabins intro, gallery description,
// tagline, stats, key features, specifications) stays on each `boat` document; only shared
// chrome lives here.
//
// Mirrors `destinationDefaults` deliberately — same shape, same reasoning, same conventions.
//
// Why a singleton and not a "Section Labels" tab on `boat`: `boat` is a template/collection type
// (designed to hold many boats) even though only one exists today. That's the test, not the
// current count — see CLAUDE.md's decluttering rule.
//
// `keyFeaturesHeading` lives here per Adinda's confirmation 2026-07-17: it's a generic section
// label, same class as cabinsHeading/specificationsHeading, not an editorial per-boat choice.
//
// No `showXEyebrow` toggles: in a shared singleton an empty eyebrow simply doesn't render, so
// the toggle stops earning its keep. `destinationDefaults` has none either — this reconciles the
// two types. (The four toggles were dropped off `boat` in the same pass.)
//
// Eyebrows are rendered as <p>/<span>, never a heading tag (SEO/a11y — see CLAUDE.md); they carry
// little direct SEO weight, so they're plain editable text, not headings.
//
// Eyebrow copy: Figma has no eyebrow text for the boat page, so these are drawn from `mari-core`'s
// locked positioning/selling points rather than invented — the positioning statement ("premium ...
// at exceptional value"), "7 sea-view ensuite cabins", and the 30m Phinisi heritage. Voice rules
// applied: specific/vivid over generic, "premium" + "exceptional value" as the locked phrasings,
// numerals for specs. Placeholder until Adinda's content pass — tracked in _CONTENT-STATUS.md.
//
// Fieldsets (not tabs) give each section a visible header — it's a settings singleton, a single
// scroll reads better than 4 tabs.
export const boatDefaultsType = defineType({
  name: 'boatDefaults',
  title: 'Boat Defaults',
  type: 'document',
  description:
    'Shared eyebrows and section headings used on every boat page — edit once here. ' +
    'Use {boat} to drop in a page’s boat name automatically.',
  fieldsets: [
    { name: 'overview', title: 'Overview' },
    { name: 'cabins', title: 'Cabins' },
    { name: 'gallery', title: 'Gallery' },
    { name: 'specifications', title: 'Specifications' },
  ],
  fields: [
    defineField({
      name: 'overviewEyebrow',
      title: 'Overview eyebrow',
      type: 'string',
      fieldset: 'overview',
      description: 'Kicker above the Overview heading. The Overview heading itself is written per boat.',
      initialValue: 'Premium diving at exceptional value',
    }),
    defineField({
      name: 'keyFeaturesHeading',
      title: 'Key features heading',
      type: 'string',
      fieldset: 'overview',
      description: 'Heading above the key features list. The features themselves are written per boat.',
      initialValue: 'Key features',
    }),
    defineField({
      name: 'cabinsEyebrow',
      title: 'Cabins eyebrow',
      type: 'string',
      fieldset: 'cabins',
      initialValue: '7 sea-view ensuite cabins',
    }),
    defineField({
      name: 'cabinsHeading',
      title: 'Cabins heading',
      type: 'string',
      fieldset: 'cabins',
      initialValue: 'Cabins',
    }),
    defineField({
      name: 'galleryEyebrow',
      title: 'Gallery eyebrow',
      type: 'string',
      fieldset: 'gallery',
      initialValue: 'Life aboard {boat}',
    }),
    defineField({
      name: 'galleryTitle',
      title: 'Gallery heading',
      type: 'string',
      fieldset: 'gallery',
      initialValue: 'Gallery',
    }),
    defineField({
      name: 'specificationsEyebrow',
      title: 'Specifications eyebrow',
      type: 'string',
      fieldset: 'specifications',
      initialValue: '30m of traditional Phinisi',
    }),
    defineField({
      name: 'specificationsHeading',
      title: 'Specifications heading',
      type: 'string',
      fieldset: 'specifications',
      initialValue: 'Layout and specifications',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Boat Defaults' }),
  },
})
