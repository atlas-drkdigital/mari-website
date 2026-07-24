import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/JsonLd'
import { Nav } from '@/components/Nav'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Contact } from '@/components/sections/Contact'
import { Cta } from '@/components/sections/Cta'
import { Footer } from '@/components/sections/Footer'
import { SimplePageBody } from '@/components/sections/SimplePageBody'
import { SimplePageHero } from '@/components/sections/SimplePageHero'
import { toPlainText } from '@/lib/portableText'
import { buildBreadcrumbJsonLd, buildSeoMetadata, resolveJsonLd, SITE_URL } from '@/lib/seo'
import { sanityFetch } from '@/sanity/lib/live'
import { SIMPLE_PAGE_QUERY, type SimplePageQueryResult } from '@/sanity/queries'

// The generic SIMPLE PAGE route (_PAGE-SPECS.md #5/#8) — one catch-all for every `page` document:
// Terms & Conditions is the first, Onboard Prices is the next. Built 2026-07-24 to Adinda's
// dictated design, modelled on the ORIGINAL booking-page light-band pattern (her reference was the
// live site's own /terms page):
//   light hero band, no image  →  white card OVERLAPPING the band seam holding the full tier-3
//   rich-text body  →  CTA (shared singleton)  →  Contact  →  Footer.
//
// NAV: <Nav lightHero /> — this route is that variant's FIRST REAL CONSUMER. The hero is a light
// band, so the nav needs dark text with NO bar while at the top, flipping to the solid light bar on
// scroll. See Nav.tsx's lightHero comment.
//
// ROUTE COLLISION: none. This is a root-level dynamic segment, so every static route (/about,
// /booking, /private-charters, /boats/…, /destinations/…, /studio) still wins — Next resolves
// static segments before dynamic ones. Note the dataset ALSO holds a `page` doc with slug "about"
// (`page-about`, a leftover from before aboutPage became its own singleton): /about correctly
// renders the aboutPage singleton and that document is simply unreachable. It is filtered out of
// the sitemap by name — see src/app/sitemap.ts — so we never advertise a URL that serves
// different content than the crawler would be told about.

type Params = { slug: string }

async function getPage(slug: string) {
  const { data } = await sanityFetch({ query: SIMPLE_PAGE_QUERY, params: { slug } })
  return (data ?? {}) as SimplePageQueryResult
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  // stega: false — see the note in src/app/page.tsx. Metadata must never carry stega encoding.
  const { data } = await sanityFetch({ query: SIMPLE_PAGE_QUERY, params: { slug }, stega: false })
  const { page, settings } = (data ?? {}) as SimplePageQueryResult
  if (!page) return {}

  return buildSeoMetadata({
    seo: page.seo,
    fallbackTitle: page.title,
    // No hero image on this page shape, so no fallbackImage — the OG image falls through to the
    // editor's seo.ogImage, then to the site-wide default below. Before that default existed
    // (2026-07-24) this shape served NO og:image at all, which is what prompted it.
    siteDefaultImage: settings?.defaultShareImage,
    fallbackDescription: toPlainText(page.body).slice(0, 200),
    path: `/${slug}`,
    siteName: settings?.siteTitle,
  })
}

export default async function SimplePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const { page, cta, destinations, settings } = await getPage(slug)

  if (!page) notFound()

  const title = page.title ?? ''

  // Generic WebPage JSON-LD — this shape carries no richer schema.org type (a T&C page is not an
  // AboutPage/FAQPage/Product). resolveJsonLd honours the editor's override, same as every page.
  const pageJsonLd = resolveJsonLd(page.seo, {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    url: `${SITE_URL}/${slug}`,
    ...(page.body?.length ? { description: toPlainText(page.body).slice(0, 300) } : {}),
  })

  // BreadcrumbList mirrors SimplePageHero's visual trail exactly (Home / {title}), including the
  // breadcrumbTitle override — the hero reads the same two fields in the same order.
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: page.seo?.breadcrumbTitle || title, path: `/${slug}` },
  ])

  return (
    <>
      <Nav lightHero />
      <main className="flex flex-1 flex-col">
        <SimplePageHero title={title} breadcrumbTitle={page.seo?.breadcrumbTitle} headingId="page-hero-heading" />
        <SimplePageBody body={page.body} />
        <Cta cta={cta} />
        {/* Editor toggle on the document — the field defaults to true, so only an explicit false
            hides the section (an undefined value on an older doc must not silently drop it). */}
        {page.showContactSection === false ? null : (
          <Contact settings={settings} destinations={destinations ?? []} />
        )}
      </main>
      <Footer />
      <ScrollReveal />
      <JsonLd data={pageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  )
}
