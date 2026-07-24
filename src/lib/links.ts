// Resolves a Sanity `link` object (schemaTypes/objects/link.ts) to an href + new-tab flag. One place
// so CTA buttons, nav items, and any future link field build URLs identically. Internal links point
// at a referenced document; the route is derived from the document `_type` using the same map the
// App Router uses. Returns null when the link is empty/unset, so a caller renders a non-link instead
// of a dead `href="#"`.
export type LinkQuery = {
  linkType?: string
  /** `internalLink->_type` from the query projection. */
  internalType?: string
  /** `internalLink->slug.current` from the query projection. */
  internalSlug?: string
  externalUrl?: string
  openInNewTab?: boolean
}

export type ResolvedLink = { href: string; newTab: boolean }

// Route prefixes per document type — mirrors the App Router structure. A referenced type with no
// entry here resolves to null (no bad URL) rather than guessing a path.
const ROUTE_PREFIX: Record<string, string> = {
  boat: '/boats/',
  destination: '/destinations/',
  blogPost: '/blog/',
  page: '/',
}

export function resolveLink(link?: LinkQuery | null): ResolvedLink | null {
  if (!link) return null
  if (link.linkType === 'external') {
    return link.externalUrl ? { href: link.externalUrl, newTab: Boolean(link.openInNewTab) } : null
  }
  if (!link.internalType || !link.internalSlug) return null
  const prefix = ROUTE_PREFIX[link.internalType]
  if (prefix === undefined) return null
  return { href: `${prefix}${link.internalSlug}`, newTab: false }
}
