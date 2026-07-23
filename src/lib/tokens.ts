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

/**
 * resolveTokens over a Portable Text value: maps every span's text through the same replacement
 * (2026-07-23, for the rich embed-section intros — a PT field can carry {destination} just like
 * a string field). Non-block members (images, embeds) pass through untouched.
 */
export function resolvePortableTextTokens<T extends { _type?: string; children?: unknown }[]>(
  blocks: T | undefined | null,
  values: Record<string, string | undefined | null>,
): T | undefined {
  if (!blocks?.length) return blocks ?? undefined
  return blocks.map((block) => {
    const children = (block as { children?: { text?: string }[] }).children
    if (block._type !== 'block' || !Array.isArray(children)) return block
    return {
      ...block,
      children: children.map((c) =>
        typeof c.text === 'string' ? { ...c, text: resolveTokens(c.text, values) ?? c.text } : c,
      ),
    }
  }) as T
}

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
