import type { MetadataRoute } from 'next'
import { groq } from 'next-sanity'

import { SITE_URL } from '@/lib/seo'
import { sanityFetch } from '@/sanity/lib/live'

// robots.ts advertises /sitemap.xml — this is what serves it. Only routes that ACTUALLY EXIST are
// listed: today the homepage, /private-charters, each boat page (/boats/[slug]) and each destination
// page (/destinations/[slug]). Blog / other routes are added here as their pages are built, so the
// sitemap never points crawlers at a 404 — adding the new route here is a named step of every page
// slice (two slices in a row missed it before this was made explicit, 2026-07-23). Documents flagged
// noIndex are excluded. lastModified comes from the document's own _updatedAt.
const SITEMAP_QUERY = groq`{
  "boats": *[_type == "boat" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "destinations": *[_type == "destination" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "privateCharters": *[_type == "privateCharters" && seo.noIndex != true][0]{ _updatedAt },
  "about": *[_type == "aboutPage" && seo.noIndex != true][0]{ _updatedAt }
}`

type SitemapRow = { slug: string; _updatedAt?: string }
type SitemapData = {
  boats?: SitemapRow[]
  destinations?: SitemapRow[]
  privateCharters?: { _updatedAt?: string } | null
  about?: { _updatedAt?: string } | null
}

// A singleton page's entry: present only when its document exists and isn't noIndex.
function singletonEntry(path: string, doc: { _updatedAt?: string } | null | undefined) {
  if (!doc) return []
  return [
    {
      url: `${SITE_URL}${path}`,
      lastModified: doc._updatedAt ? new Date(doc._updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await sanityFetch({ query: SITEMAP_QUERY, stega: false })
  const { boats = [], destinations = [], privateCharters, about } = (data ?? {}) as SitemapData

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...singletonEntry('/private-charters', privateCharters),
    ...singletonEntry('/about', about),
    ...boats.map((b) => ({
      url: `${SITE_URL}/boats/${b.slug}`,
      lastModified: b._updatedAt ? new Date(b._updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...destinations.map((d) => ({
      url: `${SITE_URL}/destinations/${d.slug}`,
      lastModified: d._updatedAt ? new Date(d._updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
