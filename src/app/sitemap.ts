import type { MetadataRoute } from 'next'
import { groq } from 'next-sanity'

import { SITE_URL } from '@/lib/seo'
import { sanityFetch } from '@/sanity/lib/live'

// robots.ts advertises /sitemap.xml — this is what serves it. Only routes that ACTUALLY EXIST are
// listed: today the homepage, /private-charters, /about, /booking (Schedule & Rates), each boat
// page (/boats/[slug]), each destination page (/destinations/[slug]) and each generic simple page
// at /[slug] (/terms, and Onboard Prices when it lands). Blog / other routes are added here as their pages are built, so the
// sitemap never points crawlers at a 404 — adding the new route here is a named step of every page
// slice (two slices in a row missed it before this was made explicit, 2026-07-23). Documents flagged
// noIndex are excluded. lastModified comes from the document's own _updatedAt.
const SITEMAP_QUERY = groq`{
  "boats": *[_type == "boat" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "destinations": *[_type == "destination" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "privateCharters": *[_type == "privateCharters" && seo.noIndex != true][0]{ _updatedAt },
  "about": *[_type == "aboutPage" && seo.noIndex != true][0]{ _updatedAt },
  "scheduleRates": *[_type == "scheduleRates" && seo.noIndex != true][0]{ _updatedAt },
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt }
}`

// Slugs a `page` document must never claim in the sitemap: a STATIC route of the same name already
// owns that URL, so /[slug] never renders the page doc and listing it would advertise a URL whose
// content is not the document we took lastModified from. Real case, not hypothetical: the dataset
// holds `page-about` (slug "about"), a leftover from before aboutPage became its own singleton —
// /about serves the singleton. Add to this list whenever a new static route is created.
const RESERVED_SLUGS = new Set(['about', 'booking', 'private-charters', 'boats', 'destinations', 'studio'])

type SitemapRow = { slug: string; _updatedAt?: string }
type SitemapData = {
  boats?: SitemapRow[]
  destinations?: SitemapRow[]
  privateCharters?: { _updatedAt?: string } | null
  about?: { _updatedAt?: string } | null
  scheduleRates?: { _updatedAt?: string } | null
  pages?: SitemapRow[]
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
  const { boats = [], destinations = [], privateCharters, about, scheduleRates, pages = [] } = (data ?? {}) as SitemapData

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...singletonEntry('/private-charters', privateCharters),
    ...singletonEntry('/about', about),
    ...singletonEntry('/booking', scheduleRates),
    // Generic simple pages at /[slug] — /terms today, Onboard Prices next. Lower priority than the
    // main marketing pages: these are reference/legal content, not conversion surfaces.
    ...pages
      .filter((p) => p.slug && !RESERVED_SLUGS.has(p.slug))
      .map((p) => ({
        url: `${SITE_URL}/${p.slug}`,
        lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      })),
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
