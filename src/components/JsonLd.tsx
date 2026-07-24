// The ONE way JSON-LD reaches the page (site-wide SEO pass, 2026-07-23). Every ld+json script —
// layout's Organization block, the pages' FAQPage/BreadcrumbList blocks — renders through this
// component, never through a hand-rolled JSON.stringify + dangerouslySetInnerHTML.
//
// Why: JSON.stringify does NOT escape `<`, so a string field containing `</script>` (an editor
// pasting markup into a question, or the seo.jsonLd override) would terminate the script tag and
// inject the rest of the payload as live HTML. Escaping `<` as the unicode escape (backslash
// u003c) is the standard fix — it's what Next's own JSON embedding does — and is invisible to
// JSON-LD consumers, since a JSON parser reads it back as a plain `<`. Centralized here so the
// escape can't be forgotten at the next call site.
export function JsonLd({ data }: { data: unknown }) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
