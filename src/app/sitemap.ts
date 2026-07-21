import type { MetadataRoute } from 'next'
import { groq } from 'next-sanity'

import { SITE_URL } from '@/lib/seo'
import { sanityFetch } from '@/sanity/lib/live'

// robots.ts advertises /sitemap.xml — this is what serves it. Only routes that ACTUALLY EXIST are
// listed: today the homepage and each boat page (/boats/[slug]). Destination / blog / other routes
// are added here as their pages are built, so the sitemap never points crawlers at a 404. Documents
// flagged noIndex are excluded. lastModified comes from the document's own _updatedAt.
const SITEMAP_QUERY = groq`{
  "boats": *[_type == "boat" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt }
}`

type SitemapData = { boats?: { slug: string; _updatedAt?: string }[] }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await sanityFetch({ query: SITEMAP_QUERY, stega: false })
  const { boats = [] } = (data ?? {}) as SitemapData

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...boats.map((b) => ({
      url: `${SITE_URL}/boats/${b.slug}`,
      lastModified: b._updatedAt ? new Date(b._updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
