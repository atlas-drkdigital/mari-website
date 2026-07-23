import type { Metadata } from 'next'

import { resolveTokens } from '@/lib/tokens'
import { urlForImage, type SanityImageWithMeta } from '@/sanity/lib/image'
import type { SeoData } from '@/sanity/queries'

// Shared resolver for the `seo` object (src/sanity/schemaTypes/objects/seo.ts) → Next `Metadata`.
//
// Why this exists: until 2026-07-20 each page's generateMetadata hand-rolled its own subset of the
// seo object, and only `title` / `description` / `noIndex` were ever read. Every other field an
// editor could fill in — the social overrides, the images, the canonical override, noFollow, the
// JSON-LD override — was a control wired to nothing. That is the "a schema field that nothing
// renders is a promise, not a feature" failure mode in CLAUDE.md, so the fix is one resolver both
// pages call rather than two hand-rolled copies that can drift apart again.
//
// The fallback chains below mirror the field DESCRIPTIONS shown to the editor in Studio verbatim
// ("Leave blank to reuse the SEO title above", etc.). If a description changes, change the chain.

// Absolute origin. Needed for `metadataBase` (without it Next emits relative og:image/canonical
// URLs, which crawlers and social scrapers cannot resolve). Matches the domain already hardcoded in
// robots.ts — both become real at launch when the production domain is confirmed.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mari-liveaboard.com'

// 1200x630 is the Open Graph / Twitter summary_large_image standard (drk-seo technical-seo.md).
// fit('crop') honours the editor's hotspot; auto('format') is the ONLY path to AVIF on Sanity's CDN.
const OG_W = 1200
const OG_H = 630

function ogImageUrl(image: SanityImageWithMeta | undefined): string | undefined {
  if (!image?.asset?._ref) return undefined
  return urlForImage(image).width(OG_W).height(OG_H).fit('crop').auto('format').url()
}

export function buildSeoMetadata({
  seo,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  path,
  siteName,
}: {
  seo: SeoData | undefined
  fallbackTitle?: string
  fallbackDescription?: string
  /**
   * The page's own hero / cover IMAGE — used as the default social image when the editor hasn't set
   * `seo.ogImage`. Standing rule (Adinda, 2026-07-21): social metadata is never left empty; a page
   * with a hero image gets it as the default OG/Twitter image. Pass the poster/cover image, NOT a
   * hero video — a video can never be an og:image.
   */
  fallbackImage?: SanityImageWithMeta
  /** Site-relative path for the default canonical, e.g. `/boats/mari`. */
  path: string
  /**
   * Value for the {siteName} token in SEO titles/descriptions (Adinda, 2026-07-22: the site's name
   * must never be hardcoded per document). Pass `settings.siteTitle` — every page query selects it.
   * Left unset, an unresolved {siteName} renders literally, which is the visible-bug-over-silent-
   * blank behaviour resolveTokens locks in.
   */
  siteName?: string
}): Metadata {
  // {siteName} resolves in every editor-facing text field, mirroring the {boat}/{destination}
  // pattern — resolved here, once, so no caller can forget a field.
  const tokens = { siteName }
  const r = (text?: string) => resolveTokens(text, tokens)

  const title = r(seo?.title || fallbackTitle)
  const description = r(seo?.description || fallbackDescription)

  const ogTitle = r(seo?.ogTitle) || title
  const ogDescription = r(seo?.ogDescription) || description
  // Social image is NEVER left empty (Adinda, 2026-07-21 — now a standing rule): the editor's
  // ogImage wins, else the page's own hero/cover image is the default. A hero VIDEO can never be an
  // og:image, so callers pass the poster/cover image and this keys off that, not the video.
  const ogImageSource = seo?.ogImage?.asset?._ref ? seo.ogImage : fallbackImage
  const ogImage = ogImageUrl(ogImageSource)
  // og:image:alt — social scrapers read this, not the image's own alt attribute. Derived down a
  // chain so it is never blank when there is an image (this is also why seo.ogImage carries no alt
  // FIELD — the alt is generated here, per the documented social-image carve-out).
  const ogImageAlt = ogImageSource?.alt || ogTitle || title

  const twitterTitle = r(seo?.twitterTitle) || ogTitle
  const twitterDescription = r(seo?.twitterDescription) || ogDescription
  // Falls back to the OG image, per the field's own "Leave blank to reuse the social share image".
  const twitterImageSource = seo?.twitterImage?.asset?._ref ? seo.twitterImage : ogImageSource
  const twitterImage = ogImageUrl(twitterImageSource)
  const twitterImageAlt = twitterImageSource?.alt || twitterTitle || title

  // canonicalUrl is an absolute `url` field in the schema; it wins over the page's own path when an
  // editor has set it (that is the entire point of the field — pointing a duplicate at its master).
  const canonical = seo?.canonicalUrl || path

  // noIndex and noFollow are INDEPENDENT booleans in the schema and must combine independently.
  // The previous inline version collapsed them: `noIndex ? {index:false, follow:false}` also killed
  // link-following, and noFollow on its own did nothing at all.
  const noIndex = seo?.noIndex === true
  const noFollow = seo?.noFollow === true

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical },
    ...(noIndex || noFollow ? { robots: { index: !noIndex, follow: !noFollow } } : {}),
    openGraph: {
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
      type: 'website',
      url: canonical,
      ...(ogImage
        ? { images: [{ url: ogImage, width: OG_W, height: OG_H, ...(ogImageAlt ? { alt: ogImageAlt } : {}) }] }
        : {}),
    },
    twitter: {
      // summary_large_image only when there IS an image — the large card renders as a broken
      // placeholder on X when the tag is present but no image resolves.
      card: twitterImage ? 'summary_large_image' : 'summary',
      ...(twitterTitle ? { title: twitterTitle } : {}),
      ...(twitterDescription ? { description: twitterDescription } : {}),
      ...(twitterImage ? { images: [{ url: twitterImage, ...(twitterImageAlt ? { alt: twitterImageAlt } : {}) }] } : {}),
    },
  }
}

/**
 * schema.org BreadcrumbList for a page's breadcrumb trail (site-wide SEO pass, 2026-07-23).
 *
 * The crumbs MUST mirror the page's VISUAL breadcrumb exactly (the hero `<nav aria-label=
 * "Breadcrumb">` trail, including the seo.breadcrumbTitle override on the last item) — Google
 * cross-checks structured data against visible content, and a trail that disagrees with the page
 * is worse than none. Emitted as its own ld+json script alongside the page's other JSON-LD via
 * `<JsonLd>`; positions are 1-based per schema.org, URLs absolute via SITE_URL.
 */
export function buildBreadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      // Home is SITE_URL itself (no trailing slash — matches layout.tsx's Organization `url`).
      item: crumb.path === '/' ? SITE_URL : `${SITE_URL}${crumb.path}`,
    })),
  }
}

/**
 * Returns what should actually be emitted as JSON-LD for a page.
 *
 * When the editor has flipped `overrideJsonLd` on AND `jsonLd` holds parseable JSON, their block
 * replaces the auto-generated one — which is what the Studio copy promises ("structured data is
 * auto-generated… only enable if you know what you're doing"). Invalid JSON falls back to the
 * generated block rather than emitting a broken `<script>`: a malformed ld+json makes a validator
 * discard the page's structured data entirely, so silently keeping the good block is strictly
 * safer than honouring a typo.
 */
export function resolveJsonLd(seo: SeoData | undefined, generated: unknown): unknown {
  if (seo?.overrideJsonLd && seo.jsonLd?.trim()) {
    try {
      return JSON.parse(seo.jsonLd)
    } catch {
      // Intentionally swallowed — see the doc comment. Studio-side validation is the right place
      // to surface this to the editor, logged in _POLISH-BACKLOG.md.
    }
  }
  return generated
}
