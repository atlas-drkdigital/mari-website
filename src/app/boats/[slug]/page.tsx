import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/JsonLd'
import { Nav } from '@/components/Nav'
import { ScrollReveal } from '@/components/ScrollReveal'
import { BoatCabins } from '@/components/sections/boat/BoatCabins'
import { BoatGallery } from '@/components/sections/boat/BoatGallery'
import { BoatHero } from '@/components/sections/boat/BoatHero'
import { BoatOverview } from '@/components/sections/boat/BoatOverview'
import { BoatSpecs } from '@/components/sections/boat/BoatSpecs'
import { Contact } from '@/components/sections/Contact'
import { Cta } from '@/components/sections/Cta'
import { FaqCategorized } from '@/components/sections/FaqCategorized'
import { Footer } from '@/components/sections/Footer'
import { SubNav, type SubNavItem } from '@/components/SubNav'
import { toPlainText } from '@/lib/portableText'
import { buildBreadcrumbJsonLd, buildSeoMetadata, resolveJsonLd } from '@/lib/seo'
import { resolveTokens } from '@/lib/tokens'
import { sanityFetch } from '@/sanity/lib/live'
import { BOAT_QUERY, type BoatQueryResult } from '@/sanity/queries'

// Boat page vertical slice, 2026-07-17. Figma Page/Boat = 778:8702.
//
// Route is /boats/[slug] — consistent with /destinations/[slug]. Locked 2026-07-17: NOT /boat, and
// the collection segment stays in code (a dynamic/editable segment was asked for and declined).
//
// Next 16: `params` is async and must be awaited — no sync fallback.
//
// Shared section chrome comes from the `boatDefaults` singleton and may carry a {boat} token, so
// every default is passed through resolveTokens() HERE, once, before it reaches a section. Doing it
// per-section would let the substitution drift.

type Params = { slug: string }

async function getBoat(slug: string) {
  const { data } = await sanityFetch({ query: BOAT_QUERY, params: { slug } })
  return (data ?? {}) as BoatQueryResult
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  // stega: false — see the note in src/app/page.tsx. Metadata must never carry stega encoding.
  const { data } = await sanityFetch({ query: BOAT_QUERY, params: { slug }, stega: false })
  const { boat, settings } = (data ?? {}) as BoatQueryResult
  if (!boat) return {}

  // The page's own title/tagline are the fallbacks when the editor leaves the SEO fields blank;
  // everything below that (social overrides, OG/Twitter images, canonical override, noFollow)
  // resolves in buildSeoMetadata, shared with the homepage so the two cannot drift.
  return buildSeoMetadata({
    seo: boat.seo,
    fallbackTitle: boat.pageTitle || boat.name,
    fallbackDescription: boat.tagline,
    fallbackImage: boat.coverImage,
    siteDefaultImage: settings?.defaultShareImage,
    path: `/boats/${slug}`,
    siteName: settings?.siteTitle,
  })
}

export default async function BoatPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const { boat, defaults, sharedFaqSections, cabinTypes, cta, settings, destinations } = await getBoat(slug)

  if (!boat) notFound()

  // One token map for the whole page. `name` is the boat's SHORT name — the token stands in for
  // the name an editor would otherwise retype per boat, not the full page title.
  const tokens = { boat: boat.name }
  const t = (text?: string) => resolveTokens(text, tokens)

  // FAQ composition (locked model, mari-website faq.md): the boat's own categories first, then the
  // shared General FAQ pulls ("Payment & Booking" / "What's Included" — filtered in BOAT_QUERY).
  // Composed HERE, once, so the rendered section and the JSON-LD below can never disagree about
  // which questions this page carries.
  const faqSections = [...(boat.faqSections ?? []), ...(sharedFaqSections ?? [])].filter(
    (s) => s.questions?.length,
  )

  // FAQPage JSON-LD — emitted for answer engines (AI Overviews / ChatGPT / Perplexity), NOT for
  // Google rich results, which have been gov/health-only since late 2023. See drk-seo's
  // aeo-considerations.md; the reasoning is counterintuitive enough that removing this "because
  // FAQ rich results are dead" would be a mistake. Scoped to THIS page's questions only.
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

  // The editor's `jsonLd` override REPLACES the generated block when `overrideJsonLd` is on — that
  // toggle existed in Studio since the schema pass with nothing reading it. Note this means an
  // override also replaces the FAQPage block, which is what "override" should mean.
  const jsonLd = resolveJsonLd(boat.seo, faqJsonLd)

  // BreadcrumbList mirrors BoatHero's visual trail exactly (Home / Boats / {name}, incl. the
  // breadcrumbTitle override) — per buildBreadcrumbJsonLd's contract.
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Boats', path: '/boats' },
    { name: boat.seo?.breadcrumbTitle || boat.name || '', path: `/boats/${slug}` },
  ])

  // SubNav items — an item exists only when its section will actually render ("hide what's empty":
  // a link to a section that isn't there is worse than no link — the Gallery item appears by itself
  // the moment images are uploaded). Each guard mirrors the section's own empty test. LAYOUT and
  // SPECS deliberately share a target (one combined section, two tabs) with distinct hashes; the
  // section's hashchange listener pre-selects the matching tab (Adinda, 2026-07-21).
  const subNavItems: SubNavItem[] = [
    { href: '#overview', targetId: 'overview', label: t(defaults?.subnavOverviewLabel) ?? '' },
    (cabinTypes ?? []).length && { href: '#cabins', targetId: 'cabins', label: t(defaults?.subnavCabinsLabel) ?? '' },
    (boat.gallery ?? []).length && { href: '#gallery', targetId: 'gallery', label: t(defaults?.subnavGalleryLabel) ?? '' },
    (boat.layoutDiagrams ?? []).length && { href: '#layout', targetId: 'layout-and-specs', label: t(defaults?.subnavLayoutLabel) ?? '' },
    (boat.specifications ?? []).length && { href: '#specs', targetId: 'layout-and-specs', label: t(defaults?.subnavSpecsLabel) ?? '' },
    faqSections.length && { href: '#faq', targetId: 'faq', label: t(defaults?.subnavFaqLabel) ?? '' },
  ]
    .filter((item): item is SubNavItem => Boolean(item && item.label))

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        {/* The SubNav is pinned to the hero's bottom edge — non-floating state (the floating/
            compact scrolled state is a later pass). Composed HERE, not inside BoatHero: the
            component is shared with the destination page, and the hero stays a Server Component
            while the SubNav is a client island. On mobile it is a drag-scrollable TabRail (the
            component owns that behavior) and runs FLUSH to the screen's left edge — no gutter
            below lg (Adinda, 2026-07-21: the gutter read awkward on a scroll rail; edge-to-edge
            is the norm for one). lg+ restores the page gutter, INSIDE the scroll container so the
            start-aligned rail scroll lands items at the gutter (the component reads the computed
            padding, so both states align correctly). z-20 sits it above the hero (z-10). */}
        <div className="relative">
          <BoatHero boat={boat} />
          <SubNav
            items={subNavItems}
            className="absolute inset-x-0 bottom-0 z-20 w-full"
          />
        </div>
        <BoatOverview
          boat={boat}
          eyebrow={t(defaults?.overviewEyebrow)}
          keyFeaturesHeading={t(defaults?.keyFeaturesHeading)}
        />
        <BoatCabins
          boat={boat}
          cabinTypes={cabinTypes ?? []}
          eyebrow={t(defaults?.cabinsEyebrow)}
          heading={t(defaults?.cabinsHeading)}
        />
        <BoatGallery
          boat={boat}
          eyebrow={t(defaults?.galleryEyebrow)}
          heading={t(defaults?.galleryTitle)}
          ctaText={t(defaults?.galleryCtaText)}
        />
        <BoatSpecs
          boat={boat}
          eyebrow={t(defaults?.specificationsEyebrow)}
          heading={t(defaults?.specificationsHeading)}
        />
        {/* FaqCategorized = the extracted BoatFaq (2026-07-22, second consumer arrived). */}
        <FaqCategorized
          sections={faqSections}
          eyebrow={t(defaults?.faqEyebrow)}
          heading={t(defaults?.faqHeading)}
          linkText={t(defaults?.faqLinkText)}
        />
        <Cta cta={cta} />
        <Contact settings={settings} destinations={destinations ?? []} />
      </main>
      <Footer />
      <ScrollReveal />
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  )
}
