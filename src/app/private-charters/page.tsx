import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/JsonLd'
import { Nav } from '@/components/Nav'
import { ScrollReveal } from '@/components/ScrollReveal'
import { ChartersBenefits } from '@/components/sections/charters/ChartersBenefits'
import { ChartersHero } from '@/components/sections/charters/ChartersHero'
import { PageOverview } from '@/components/sections/PageOverview'
import { Contact } from '@/components/sections/Contact'
import { DestinationBoats } from '@/components/sections/destination/DestinationBoats'
import { DestinationTrips } from '@/components/sections/destination/DestinationTrips'
import { Destinations } from '@/components/sections/Destinations'
import { FaqCategorized } from '@/components/sections/FaqCategorized'
import { Footer } from '@/components/sections/Footer'
import { SubNav, type SubNavItem } from '@/components/SubNav'
import { toPlainText } from '@/lib/portableText'
import { buildBreadcrumbJsonLd, buildSeoMetadata, resolveJsonLd } from '@/lib/seo'
import { sanityFetch } from '@/sanity/lib/live'
import { PRIVATE_CHARTERS_QUERY, type PrivateChartersQueryResult } from '@/sanity/queries'

// Private Charters vertical slice, 2026-07-23. Figma Page/PrivateCharters = 778:8908.
// Singleton page — no [slug] segment; the route path itself is the URL.
//
// ROUTE PATH: '/private-charters' — matches mari-website's url-structure.md (checked 2026-07-23).
// The 2026-07-15 tentative '/private-liveaboard-charter-indonesia' came from a garbled
// transcription and is NOT the recorded slug; keyword-stuffed slugs also buy nothing (keywords in
// the URL are a weak signal — the title/H1 carry the query). One open confirm remains in that
// reference: '/private-charters' vs '/charters' with Serge — a folder rename + 2 Nav links if it
// ever changes.
//
// Same composition model as /boats/[slug] and /destinations/[slug] (read those files' comments —
// not repeated here). Page order per the mock: Hero → Overview → Benefits → Destinations →
// About the Boats → Available Dates (embed) → FAQ → Contact. Note the subnav lists its FAQ tab
// BEFORE the Check Availability tab (Adinda's item order) while the sections sit dates-then-FAQ —
// the same mismatch the destination page has; SubNav's spy is position-based, so it's fine.
//
// Shared-section chrome (boats/availability/FAQ headings) lives ON this doc, not in a Defaults
// singleton — singleton pages own their chrome (decluttering rule), and destinationDefaults'
// boats eyebrow carries a {destination} token this page can't resolve.

async function getCharters() {
  const { data } = await sanityFetch({ query: PRIVATE_CHARTERS_QUERY })
  return (data ?? {}) as PrivateChartersQueryResult
}

export async function generateMetadata(): Promise<Metadata> {
  // stega: false — see the note in src/app/page.tsx. Metadata must never carry stega encoding.
  const { data } = await sanityFetch({ query: PRIVATE_CHARTERS_QUERY, stega: false })
  const { charters, settings } = (data ?? {}) as PrivateChartersQueryResult
  if (!charters) return {}

  return buildSeoMetadata({
    seo: charters.seo,
    fallbackTitle: [charters.heroHeadingIntro, charters.heroHeadingMain].filter(Boolean).join(' ') || charters.name,
    fallbackDescription: charters.heroSubheading,
    fallbackImage: charters.heroImage,
    siteDefaultImage: settings?.defaultShareImage,
    path: '/private-charters',
    siteName: settings?.siteTitle,
  })
}

export default async function PrivateChartersPage() {
  const { charters, sharedFaqSections, boatsSection, curatedBoats, boats, destinationsSectionCta, curatedDestinations, destinations, settings } =
    await getCharters()

  if (!charters) notFound()

  // Carousel = the destinationsSection singleton's curated list, all-list fallback (see the
  // homepage's identical note, incl. why .filter(Boolean) guards null deref members).
  const curated = (curatedDestinations ?? []).filter(Boolean)
  const carouselDests = curated.length ? curated : (destinations ?? [])
  // Boats: same curated-with-fallback model (boatsSection.boats drag array, 2026-07-23).
  const curatedBoatsList = (curatedBoats ?? []).filter(Boolean)
  const boatsList = curatedBoatsList.length ? curatedBoatsList : (boats ?? [])

  // FAQ composition mirrors the boat/destination pages: this page's own categories first, then
  // shared General FAQ categories (showOnPrivateChartersPage toggle, filtered in the query).
  const faqSections = [...(charters.faqSections ?? []), ...(sharedFaqSections ?? [])].filter(
    (s) => s.questions?.length,
  )

  // FAQPage JSON-LD — same rationale and composition source as the other pages: emitted for
  // answer engines, scoped to exactly the questions this page renders.
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

  const jsonLd = resolveJsonLd(charters.seo, faqJsonLd)

  // BreadcrumbList mirrors ChartersHero's visual trail exactly (Home / {name}) — including the
  // breadcrumbTitle override — per buildBreadcrumbJsonLd's contract.
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: charters.seo?.breadcrumbTitle || charters.name || 'Private Charters', path: '/private-charters' },
  ])

  // Sub-nav items per Adinda 2026-07-23 (the node's own tab labels were a stale copy-paste of the
  // boat page's set). ONE tab for the dates section: "Available Dates" was cut as redundant; the
  // Check Availability tab alone navigates there (plain styling — its amber accent variant was
  // tried and rejected on sight, see SubNav.tsx). Every item guarded by its section's empty test.
  const hasOverview = Boolean(charters.overviewHeading || charters.overviewBody?.length)
  // Mirrors ChartersBenefits' own empty test (title + asset — an untitled image renders nowhere).
  const benefitItems = (charters.benefits ?? []).filter((b) => b.title && b.asset?._ref)
  const hasEmbed = Boolean(charters.availabilityEmbed?.trim())
  const subNavItems: (SubNavItem | false)[] = [
    hasOverview && { href: '#overview', targetId: 'overview', label: charters.subnavOverviewLabel ?? '' },
    benefitItems.length > 0 && { href: '#benefits', targetId: 'benefits', label: charters.subnavBenefitsLabel ?? '' },
    (destinations ?? []).length > 0 && { href: '#destinations', targetId: 'destinations', label: charters.subnavDestinationsLabel ?? '' },
    (boats ?? []).length > 0 && { href: '#boats', targetId: 'boats', label: charters.subnavBoatsLabel ?? '' },
    faqSections.length > 0 && { href: '#faq', targetId: 'faq', label: charters.subnavFaqLabel ?? '' },
    hasEmbed && { href: '#available-dates', targetId: 'available-dates', label: charters.subnavCheckAvailabilityLabel ?? '' },
  ]
  const items = subNavItems.filter((item): item is SubNavItem => Boolean(item && item.label))

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <div className="relative">
          <ChartersHero charters={charters} />
          {/* centerItems: this hero is centered, the rail follows (Adinda, 2026-07-23). */}
          <SubNav items={items} centerItems className="absolute inset-x-0 bottom-0 z-20 w-full" />
        </div>
        {/* PageOverview = the generalized ChartersOverview (2026-07-23, when About became its
            second identical consumer). Same render, generic props. */}
        <PageOverview
          headingId="charters-overview-heading"
          eyebrow={charters.overviewEyebrow}
          heading={charters.overviewHeading}
          body={charters.overviewBody}
        />
        <ChartersBenefits
          eyebrow={charters.benefitsEyebrow}
          heading={charters.benefitsHeading}
          benefits={charters.benefits ?? []}
        />
        {/* Shared sections (Adinda, 2026-07-23): Destinations = the homepage component verbatim;
            Boats = the destination page's component with this page's own chrome fields. */}
        <Destinations destinations={carouselDests} ctaText={destinationsSectionCta ?? undefined} />
        {/* texture={false}: plain page background on THIS page only (Adinda, 2026-07-23) — the
            component itself stays shared, so design edits still propagate everywhere. Chrome from
            the shared boatsSection singleton (same day). */}
        {/* eyebrowGeneric, not the {destination}-token eyebrow — this is a non-destination page,
            and the wording is editor-owned on the boatsSection doc (no hardcoded token values;
            Adinda, 2026-07-23). */}
        <DestinationBoats
          boats={boatsList}
          eyebrow={boatsSection?.eyebrowGeneric}
          heading={boatsSection?.heading}
          headingSingular={boatsSection?.headingSingular}
          ctaText={boatsSection?.ctaText}
          texture={false}
        />
        <DestinationTrips
          id="available-dates"
          eyebrow={charters.availabilityEyebrow}
          heading={charters.availabilityHeading}
          intro={charters.availabilityIntro}
          ctaText={charters.availabilityCtaText}
          embedHtml={charters.availabilityEmbed}
        />
        <FaqCategorized
          sections={faqSections}
          eyebrow={charters.faqEyebrow}
          heading={charters.faqHeading}
          linkText={charters.faqLinkText}
        />
        <Contact settings={settings} destinations={destinations ?? []} />
      </main>
      <Footer />
      <ScrollReveal />
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  )
}
