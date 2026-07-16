import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import type { ImageLoader } from 'next/image'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

// Low-level builder — kept for callers that only have a bare asset reference and don't need the
// vanity filename (rare). Most rendering should go through `urlForImage` below.
export const urlFor = (source: SanityImageSource) => builder.image(source)

// The shape a rendered image should be queried into. Note `asset` stays a REFERENCE (keep
// `asset._ref` — do NOT dereference with `asset->`, or the URL builder loses the id); the asset's
// `originalFilename` and `metadata.lqip` are projected as SIBLINGS instead. See the JSDoc on
// `urlForImage` for the exact GROQ projection to use.
export type SanityImageWithMeta = {
  asset?: { _ref?: string }
  alt?: string
  seoImageName?: string
  originalFilename?: string | null
  lqip?: string | null
  dimensions?: { width?: number; height?: number } | null
  hotspot?: unknown
  crop?: unknown
}

// ---------------------------------------------------------------------------------------------
// Vanity filename (SEO)
// ---------------------------------------------------------------------------------------------
// Sanity CDN URLs are hash-based and can't be made descriptive at upload, but Sanity supports a
// descriptive "vanity" segment appended to the URL (`.../{hash}-{w}x{h}.{ext}/{seo-name}.{ext}`),
// applied here via the builder's own `.vanityName()`. We derive that name from a FALLBACK CHAIN
// (locked 2026-07-16, CLAUDE.md "Images"):
//   1. an editor-set `seoImageName` (clean kebab-case control when wanted);
//   2. else the asset's `originalFilename`, IF it looks descriptive (skip camera/junk names);
//   3. else the `alt` text slugified, as a last resort;
//   4. else omit the vanity segment entirely (the image still serves fine, just no SEO name).

// Camera-roll / auto-generated names that carry no descriptive value — matched against the
// extension-stripped base name, case-insensitive. A name counts as junk when it is one of these
// tokens followed by nothing but separators and digits (so `IMG_1234`, `screenshot-2024-01-05`,
// `photo` all match) — but NOT when real words follow (`image-of-komodo-dragon` is kept). A
// bare all-digits name is also junk. Extend as new junk patterns show up.
const JUNK_FILENAME =
  /^(img|dsc|dscf|dscn|pxl|mov|vid|gopr|p|photo|image|picture|pic|screenshot|screen[-_ ]?shot|scan|untitled|export|download|unnamed|capture|final|copy)[\s\-_\d]*$|^\d+$/i

function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics (é -> e)
    .toLowerCase()
    .replace(/['’"`]/g, '') // drop apostrophes so "indonesia's" -> "indonesias", not "indonesia-s"
    .replace(/[^a-z0-9]+/g, '-') // any run of non-alphanumerics -> single hyphen
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
    .slice(0, 96) // keep the URL segment sane
    .replace(/-+$/g, '') // re-trim in case the slice cut mid-hyphen
}

function stripExtension(filename: string): string {
  return filename.replace(/\.[a-z0-9]+$/i, '')
}

function deriveVanityName(image: SanityImageWithMeta): string | undefined {
  // 1. explicit editor SEO name
  const seo = image.seoImageName?.trim()
  if (seo) return slugify(seo) || undefined

  // 2. original filename, if descriptive (not a camera/junk name and has at least one letter)
  const original = image.originalFilename?.trim()
  if (original) {
    const base = stripExtension(original)
    if (!JUNK_FILENAME.test(base.trim())) {
      const slug = slugify(base)
      if (slug && /[a-z]/.test(slug)) return slug
    }
  }

  // 3. alt text, slugified
  const alt = image.alt?.trim()
  if (alt) {
    const slug = slugify(alt)
    if (slug) return slug
  }

  // 4. omit
  return undefined
}

/**
 * Builder for a full queried image object, with the vanity filename applied. Chainable exactly
 * like `urlFor` (`.width()`, `.height()`, `.fit()`, `.url()`, …). Prefer this everywhere an
 * editor-managed image is rendered.
 *
 * Query the image like this so the pieces this needs are present:
 * ```groq
 * image{
 *   ...,                                      // keeps asset._ref, hotspot, crop, alt, seoImageName
 *   "originalFilename": asset->originalFilename,
 *   "lqip": asset->metadata.lqip,
 *   "dimensions": asset->metadata.dimensions
 * }
 * ```
 */
export function urlForImage(image: SanityImageWithMeta) {
  const b = builder.image(image as unknown as SanityImageSource)
  const vanity = deriveVanityName(image)
  return vanity ? b.vanityName(vanity) : b
}

/**
 * `next/image` loader for Sanity-hosted images: lets Sanity's CDN do the per-width resizing and
 * format negotiation instead of Next's optimizer. Pass it ONLY to `<Image>`s whose `src` is a
 * Sanity URL (from `urlForImage(...).url()`); local `/assets/*` images keep the default loader.
 * `auto=format` serves WebP/AVIF when supported; `fit=max` never upscales past the source.
 */
export const sanityImageLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality ?? 80))
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'max')
  return url.toString()
}
