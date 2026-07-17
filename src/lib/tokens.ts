// Token interpolation for the "Defaults singleton" pattern (CLAUDE.md, "Decluttering the editing
// form"): shared section chrome lives once on a `*Defaults` singleton and carries a {token} where
// the per-instance name goes, so an editor writes "Life aboard {boat}" ONCE instead of retyping the
// heading for every boat.
//
// The schemas have promised this since 2026-07-16 ("the frontend swaps it in per page") but nothing
// ever implemented it — no page rendered a Defaults field until the boat slice, so the gap was
// invisible. An unresolved token renders literally, braces and all.
//
// Scope is deliberate, not an oversight: {boat} only means something on a page that HAS a boat, so
// it resolves only against a boatDefaults field rendered on a boat page (same for {destination}).
// There is nothing to resolve on a per-instance field — an editor would just type the name — and
// nothing to resolve in siteSettings/cta, which render on pages with no boat at all.
//
// Unknown tokens are left ALONE rather than blanked: a stray "{foo}" surviving to the page is a
// visible bug an editor can report, whereas silently deleting it hides the mistake.

/** Replaces every `{key}` with its value. Unknown tokens are left untouched, by design. */
export function resolveTokens(
  text: string | undefined | null,
  values: Record<string, string | undefined | null>,
): string | undefined {
  if (!text) return undefined
  return text.replace(/\{(\w+)\}/g, (whole, key: string) => {
    const value = values[key]
    return value ? value : whole
  })
}
