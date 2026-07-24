import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/JsonLd'
import { Nav } from '@/components/Nav'
import { ScrollReveal } from '@/components/ScrollReveal'
import { AboutCrew } from '@/components/sections/about/AboutCrew'
import { AboutHero } from '@/components/sections/about/AboutHero'
import { Contact } from '@/components/sections/Contact'
import { Cta } from '@/components/sections/Cta'
import { Footer } from '@/components/sections/Footer'
import { PageOverview } from '@/components/sections/PageOverview'
import { Testimonials } from '@/components/sections/Testimonials'
import { WhyUs } from '@/components/sections/WhyUs'
import { toPlainText } from '@/lib/portableText'
import { buildBreadcrumbJsonLd, buildSeoMetadata, resolveJsonLd, SITE_URL } from '@/lib/seo'
import { sanityFetch } from '@/sanity/lib/live'
import { ABOUT_QUERY, type AboutQueryResult } from '@/sanity/queries'

// About page vertical slice, 2026-07-23. NO mockup exists — built from Adinda's dictated spec
// (_PAGE-SPECS.md #1): PC-style hero (no brochure, NO SubNav — her explicit call), PC-style
// overview (PageOverview), the homepage's Why Us verbatim (chrome + items stay on the homePage
// doc — "same as homepage" IS the spec, so there is deliberately no second editing surface),
// crew (NEW), CTA, Testimonials (now the shared testimonialsSection singleton — this page is why
// it exists), Contact, Footer. Singleton page — the route path itself is the URL.

async function getAbout() {
  const { data } = await sanityFetch({ query: ABOUT_QUERY })
  return (data ?? {}) as AboutQueryResult
}

export async function generateMetadata(): Promise<Metadata> {
  // stega: false — see the note in src/app/page.tsx. Metadata must never carry stega encoding.
  const { data } = await sanityFetch({ query: ABOUT_QUERY, stega: false })
  const { about, settings } = (data ?? {}) as AboutQueryResult
  if (!about) return {}

  return buildSeoMetadata({
    seo: about.seo,
    fallbackTitle: [about.heroHeadingIntro, about.heroHeadingMain].filter(Boolean).join(' ') || about.name,
    fallbackDescription: about.heroSubheading,
    fallbackImage: about.heroImage,
    path: '/about',
    siteName: settings?.siteTitle,
  })
}

export default async function AboutPage() {
  const { about, whyUs, testimonialsSection, cta, destinations, settings } = await getAbout()

  if (!about) notFound()

  // AboutPage JSON-LD (schema.org type of the same name — the page ABOUT the organization; the
  // Organization block itself is site-wide in layout.tsx). resolveJsonLd honours the editor's
  // override, same as every page.
  const aboutJsonLd = resolveJsonLd(about.seo, {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: [about.heroHeadingIntro, about.heroHeadingMain].filter(Boolean).join(' ') || about.name,
    url: `${SITE_URL}/about`,
    ...(about.heroSubheading ? { description: about.heroSubheading } : {}),
    ...(about.overviewBody?.length ? { mainEntity: { '@type': 'Organization', name: 'Mari Liveaboard', description: toPlainText(about.overviewBody).slice(0, 300) } } : {}),
  })

  // BreadcrumbList mirrors AboutHero's visual trail exactly (Home / {name}).
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: about.seo?.breadcrumbTitle || about.name || 'About', path: '/about' },
  ])

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <AboutHero about={about} />
        <PageOverview
          headingId="about-overview-heading"
          eyebrow={about.overviewEyebrow}
          heading={about.overviewHeading}
          body={about.overviewBody}
        />
        {/* The homepage's Why Us verbatim — same chrome, same items, same doc (see header). */}
        <WhyUs home={whyUs} />
        <AboutCrew about={about} />
        <Cta cta={cta} />
        {/* texture={false} on THIS page only (Adinda, 2026-07-24): Contact sits directly below and
            carries the light texture — two textured bands back to back read as one flat slab.
            Plain bg-page here restores the separation. */}
        <Testimonials section={testimonialsSection} texture={false} />
        <Contact settings={settings} destinations={destinations ?? []} />
      </main>
      <Footer />
      <ScrollReveal />
      <JsonLd data={aboutJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  )
}
