import { defineField } from 'sanity'

// ONE link annotation, shared by BOTH rich-text tiers (richTextBasic + richTextFull).
//
// ⚠️ WHY THIS FILE EXISTS — the bug it fixes (Adinda spotted it, 2026-07-17).
// `richTextFull` had NO link option at all: an editor could not put a URL in the T&C body, a blog
// post, or the boat overview. Tier 3 — the *fuller* tier — was missing a capability tier 2 had.
//
// The cause is a Sanity footgun worth knowing: **the `block` type ships a `link` annotation by
// DEFAULT, and declaring `marks.annotations` REPLACES that default array rather than merging into
// it.** richTextFull declared `annotations: [alignAnnotation]` to add alignment, and silently
// deleted link in the same stroke. Nothing errored; the button just wasn't in the toolbar.
// So: once you declare `annotations`, you own the WHOLE list — every default you still want has to
// be re-declared explicitly. Same trap applies to `styles`, `lists`, and `decorators`.
//
// Extracted to one shared module rather than copy-pasted into each tier, for the same reason
// GALLERY_CATEGORIES was: two copies drift, and drift here silently changes what editors can do on
// some fields but not others — which is exactly the bug above, one level up.
//
// The field is `href` to match the link data richTextBasic has ALREADY produced — renaming it would
// need a migration for zero gain. RichText.tsx's existing `link` mark renderer consumes this as-is.
export const linkAnnotation = {
  name: 'link',
  type: 'object' as const,
  title: 'Link',
  fields: [
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      description: 'External (https://…), internal (/boats/mari), email (mailto:…) or phone (tel:…).',
      // `type: 'url'`'s DEFAULT validation allows http/https ONLY — it rejects both relative paths
      // and mailto/tel. That default is why an internal link was impossible to enter, even though
      // RichText.tsx has always branched on `external = /^https?:/` and rendered non-http hrefs as
      // same-tab internal links. That branch was unreachable: the frontend was ready for a value
      // the schema refused to accept.
      // allowRelative widens this to a strict superset — every URL that validated before still
      // does — so it needs no migration and nothing existing changes.
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
  ],
}
