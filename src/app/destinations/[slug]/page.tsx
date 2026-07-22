import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Nav } from '@/components/Nav'
import { ScrollReveal } from '@/components/ScrollReveal'
import { DestinationHero } from '@/components/sections/destination/DestinationHero'
import { FaqCategorized } from '@/components/sections/FaqCategorized'
import { Footer } from '@/components/sections/Footer'
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
  const { destination } = (data ?? {}) as DestinationQueryResult
  if (!destination) return {}

  return buildSeoMetadata({
    seo: destination.seo,
    fallbackTitle: destination.pageTitle || destination.name,
    fallbackDescription: destination.tagline,
    fallbackImage: destination.coverImage,
    path: `/destinations/${slug}`,
  })
}

export default async function DestinationPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const { destination, defaults, itineraries, sharedFaqSections } = await getDestination(slug)

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
  // Upcoming Trips is absent until the booking-embed field exists (embed section, later today).
  const subNavItems: SubNavItem[] = [
    { href: '#overview', targetId: 'overview', label: t(defaults?.subnavOverviewLabel) ?? '' },
    (destination.gallery ?? []).length && { href: '#gallery', targetId: 'gallery', label: t(defaults?.subnavGalleryLabel) ?? '' },
    (itineraries ?? []).length && { href: '#itineraries', targetId: 'itineraries', label: t(defaults?.subnavItinerariesLabel) ?? '' },
    faqSections.length && { href: '#faq', targetId: 'faq', label: t(defaults?.subnavFaqLabel) ?? '' },
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
        <FaqCategorized
          sections={faqSections}
          eyebrow={t(defaults?.faqEyebrow)}
          heading={t(defaults?.faqHeading)}
          linkText={t(defaults?.faqLinkText)}
        />
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
