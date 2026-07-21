import { defineField, defineType } from 'sanity'

// Shown under every section header in this form. Evergreen + generic per CLAUDE.md's
// field-description discipline: no boat names, no dates, no instance-specific examples.
const TOKEN_HINT = 'Type {boat} in any field here to insert the boat’s name automatically.'

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
    'Type {boat} in any field below to drop in the boat’s name automatically.',
  // The {boat} hint repeats on EVERY fieldset, not just the document description (Adinda,
  // 2026-07-17: "we need to mention it somewhere that I know where it is... because it is
  // confusing"). A token nobody knows about is a token nobody uses, and the document-level
  // description scrolls out of view as soon as an editor is working in a section. Fieldset
  // descriptions render under each section header, so the hint is wherever the editor is looking.
  // Same treatment on `destinationDefaults` — the two types mirror each other.
  fieldsets: [
    { name: 'overview', title: 'Overview', description: TOKEN_HINT },
    { name: 'cabins', title: 'Cabins', description: TOKEN_HINT },
    { name: 'gallery', title: 'Gallery', description: TOKEN_HINT },
    { name: 'specifications', title: 'Specifications', description: TOKEN_HINT },
    { name: 'faq', title: 'FAQ', description: TOKEN_HINT },
    {
      name: 'subnav',
      title: 'Section navigation',
      description: 'Labels in the strip of section links on the boat page hero.',
    },
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
    // The header button that opens the full image lightbox (Adinda, 2026-07-21 — replaces the
    // desktop category arrows). destinationDefaults gets its twin when the destination page builds.
    defineField({
      name: 'galleryCtaText',
      title: 'Gallery CTA label',
      type: 'string',
      fieldset: 'gallery',
      description: 'Label on the button that opens the full image gallery.',
      initialValue: 'Open Gallery',
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
    // FAQ section chrome (added 2026-07-21 with the categorized FAQ build). The questions
    // themselves stay on each boat (`faqSections`) plus the shared General FAQ pull — only the
    // header strings live here, same split as every other section.
    defineField({
      name: 'faqEyebrow',
      title: 'FAQ eyebrow',
      type: 'string',
      fieldset: 'faq',
      initialValue: 'Good to Know',
    }),
    defineField({
      name: 'faqHeading',
      title: 'FAQ heading',
      type: 'string',
      fieldset: 'faq',
      initialValue: '{boat} FAQ',
    }),
    defineField({
      name: 'faqLinkText',
      title: 'FAQ link label',
      type: 'string',
      fieldset: 'faq',
      description: 'Label on the button linking to the full FAQ page.',
      initialValue: 'Read All FAQ',
    }),
    // Sub-nav labels live HERE rather than hardcoded (Adinda, 2026-07-21) so they ride the
    // singleton's field-level localization when i18n lands — same translate-once story as every
    // other label in this document. The ITEMS (which sections exist, their order, their anchors)
    // are structural and stay in code; only the visible words are editable.
    defineField({
      name: 'subnavOverviewLabel',
      title: 'Overview label',
      type: 'string',
      fieldset: 'subnav',
      initialValue: 'Overview',
    }),
    defineField({
      name: 'subnavCabinsLabel',
      title: 'Cabins label',
      type: 'string',
      fieldset: 'subnav',
      initialValue: 'Cabins',
    }),
    defineField({
      name: 'subnavGalleryLabel',
      title: 'Gallery label',
      type: 'string',
      fieldset: 'subnav',
      initialValue: 'Gallery',
    }),
    defineField({
      name: 'subnavLayoutLabel',
      title: 'Layout label',
      type: 'string',
      fieldset: 'subnav',
      initialValue: 'Layout',
    }),
    defineField({
      name: 'subnavSpecsLabel',
      title: 'Specs label',
      type: 'string',
      fieldset: 'subnav',
      initialValue: 'Specs',
    }),
    defineField({
      name: 'subnavFaqLabel',
      title: 'FAQ label',
      type: 'string',
      fieldset: 'subnav',
      initialValue: 'FAQ',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Boat Defaults' }),
  },
})
