import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Nav } from '@/components/Nav'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Contact } from '@/components/sections/Contact'
import { Cta } from '@/components/sections/Cta'
import { DestinationBoats } from '@/components/sections/destination/DestinationBoats'
import { DestinationGallery } from '@/components/sections/destination/DestinationGallery'
import { DestinationHero } from '@/components/sections/destination/DestinationHero'
import { DestinationItineraries } from '@/components/sections/destination/DestinationItineraries'
import { DestinationOverview } from '@/components/sections/destination/DestinationOverview'
import { DestinationTrips } from '@/components/sections/destination/DestinationTrips'
import { FaqCategorized } from '@/components/sections/FaqCategorized'
import { Footer } from '@/components/sections/Footer'
import { LatestArticles } from '@/components/sections/LatestArticles'
import { SubNav, type SubNavItem } from '@/components/SubNav'
import { toPlainText } from '@/lib/portableText'
import { buildSeoMetadata, resolveJsonLd } from '@/lib/seo'
import { resolveTokens } from '@/lib/tokens'
import { sanityFetch } from '@/sanity/lib/live'
import { DESTINATION_QUERY, type DestinationQueryResult } from '@/sanity/queries'

// Destination page vertical slice, 2026-07-22. Figma Page/Destination = 778:8608. Komodo is the
// pilot destination — review happens against /destinations/komodo.
//
// Same composition model as /boats/[slug] (read that file's comments first — the reasoning is not
// repeated here): defaults resolved through resolveTokens() ONCE at the page level, SubNav composed
// here (client island) around the Server-Component hero, subnav items guarded by each section's own
// empty test.
//
// 🚧 BUILD IN PROGRESS: sections land one at a time through 2026-07-22's blocks (hero → FAQ/embed/
// CTA/articles/contact → overview → itineraries → gallery/boats). A subnav item whose section
// component hasn't landed yet scrolls nowhere — expected mid-build, resolved as each section ships.

type Params = { slug: string }

async function getDestination(slug: string) {
  const { data } = await sanityFetch({ query: DESTINATION_QUERY, params: { slug } })
  return (data ?? {}) as DestinationQueryResult
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  // stega: false — see the note in src/app/page.tsx. Metadata must never carry stega encoding.
  const { data } = await sanityFetch({ query: DESTINATION_QUERY, params: { slug }, stega: false })
  const { destination, settings } = (data ?? {}) as DestinationQueryResult
  if (!destination) return {}

  return buildSeoMetadata({
    seo: destination.seo,
    fallbackTitle: destination.pageTitle || destination.name,
    fallbackDescription: destination.tagline,
    fallbackImage: destination.coverImage,
    path: `/destinations/${slug}`,
    siteName: settings?.siteTitle,
  })
}

export default async function DestinationPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const { destination, defaults, itineraries, sharedFaqSections, latestPosts, boats, cta, settings, destinations } =
    await getDestination(slug)

  if (!destination) notFound()

  // One token map for the whole page — {destination} stands in for the SHORT name (e.g. "Komodo"),
  // same contract as {boat} on the boat page.
  const tokens = { destination: destination.name }
  const t = (text?: string) => resolveTokens(text, tokens)

  // FAQ composition mirrors the boat page: this destination's own categories first, then shared
  // General FAQ categories (showOnDestinationPages toggle, filtered in DESTINATION_QUERY).
  const faqSections = [...(destination.faqSections ?? []), ...(sharedFaqSections ?? [])].filter(
    (s) => s.questions?.length,
  )

  // FAQPage JSON-LD — same rationale and same composition source as the boat page (see that
  // file's comment): emitted for answer engines, scoped to exactly the questions this page renders.
  const faqQuestions = faqSections.flatMap((s) => s.questions ?? [])
  const faqJsonLd = faqQuestions.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqQuestions
          .filter((q) => q.question)
          .map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: { '@type': 'Answer', text: toPlainText(q.answer) },
          })),
      }
    : null

  const jsonLd = resolveJsonLd(destination.seo, faqJsonLd)

  // Subnav items appear only when their section has content to render ("hide what's empty").
  const hasTripsEmbed = Boolean(destination.upcomingTripsEmbed?.trim())
  const subNavItems: SubNavItem[] = [
    { href: '#overview', targetId: 'overview', label: t(defaults?.subnavOverviewLabel) ?? '' },
    (destination.gallery ?? []).length && { href: '#gallery', targetId: 'gallery', label: t(defaults?.subnavGalleryLabel) ?? '' },
    (itineraries ?? []).length && { href: '#itineraries', targetId: 'itineraries', label: t(defaults?.subnavItinerariesLabel) ?? '' },
    faqSections.length && { href: '#faq', targetId: 'faq', label: t(defaults?.subnavFaqLabel) ?? '' },
    hasTripsEmbed && { href: '#upcoming-trips', targetId: 'upcoming-trips', label: t(defaults?.subnavTripsLabel) ?? '' },
  ]
    .filter((item): item is SubNavItem => Boolean(item && item.label))

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <div className="relative">
          <DestinationHero destination={destination} />
          <SubNav
            items={subNavItems}
            className="absolute inset-x-0 bottom-0 z-20 w-full"
          />
        </div>
        <DestinationOverview destination={destination} eyebrow={t(defaults?.overviewEyebrow)} />
        {/* Mock order (778:8608): Overview → Gallery → Itineraries → Trips → FAQ → Boats.
            Gallery is the full-bleed grid; its subnav item is guarded on the same array above.
            `title` is the sr-only accessible name — deliberately the SAME field as the subnav
            label (no visible heading on this section, and no separate field to orphan). */}
        <DestinationGallery
          images={destination.gallery ?? []}
          title={t(defaults?.subnavGalleryLabel)}
          ctaText={t(defaults?.galleryCtaText)}
        />
        <DestinationItineraries
          itineraries={itineraries ?? []}
          eyebrow={t(defaults?.itinerariesEyebrow)}
          heading={t(defaults?.itinerariesHeading)}
          cardCtaText={t(defaults?.itinerariesCardCtaText)}
          hasTripsTarget={hasTripsEmbed}
        />
        <DestinationTrips
          eyebrow={t(defaults?.upcomingTripsEyebrow)}
          heading={t(defaults?.upcomingTripsHeading)}
          intro={t(defaults?.upcomingTripsIntro)}
          ctaText={t(defaults?.upcomingTripsCtaText)}
          embedHtml={destination.upcomingTripsEmbed}
        />
        <FaqCategorized
          sections={faqSections}
          eyebrow={t(defaults?.faqEyebrow)}
          heading={t(defaults?.faqHeading)}
          linkText={t(defaults?.faqLinkText)}
        />
        {/* Section order per the mock (778:8608): FAQ → About the Boats → CTA → Articles →
            Contact. Articles = the homepage component, Komodo-linked posts only, no button (the
            mock has none — its arrows are deferred; the drag-track convention covers the
            overflow case). */}
        <DestinationBoats
          boats={boats ?? []}
          eyebrow={t(defaults?.boatsEyebrow)}
          heading={t(defaults?.boatsHeading)}
          headingSingular={t(defaults?.boatsHeadingSingular)}
          ctaText={t(defaults?.boatsCtaText)}
        />
        <Cta cta={cta} />
        <LatestArticles
          eyebrow={t(defaults?.articlesEyebrow)}
          heading={t(defaults?.articlesHeading)}
          linkText={t(defaults?.articlesLinkText)}
          linkHref="/blog"
          posts={latestPosts ?? []}
        />
        <Contact settings={settings} destinations={destinations ?? []} />
      </main>
      <Footer />
      <ScrollReveal />
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
    </>
  )
}
