import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Nav } from '@/components/Nav'
import { ScrollReveal } from '@/components/ScrollReveal'
import { BoatCabins } from '@/components/sections/boat/BoatCabins'
import { BoatFaq } from '@/components/sections/boat/BoatFaq'
import { BoatGallery } from '@/components/sections/boat/BoatGallery'
import { BoatHero } from '@/components/sections/boat/BoatHero'
import { BoatOverview } from '@/components/sections/boat/BoatOverview'
import { BoatSpecs } from '@/components/sections/boat/BoatSpecs'
import { Contact } from '@/components/sections/Contact'
import { Cta } from '@/components/sections/Cta'
import { Footer } from '@/components/sections/Footer'
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
  const { boat } = (data ?? {}) as BoatQueryResult
  if (!boat) return {}

  const title = boat.seo?.title || boat.pageTitle || boat.name
  const description = boat.seo?.description || boat.tagline

  return {
    title,
    description,
    alternates: { canonical: `/boats/${slug}` },
    robots: boat.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: { title: title ?? undefined, description: description ?? undefined, type: 'website' },
  }
}

export default async function BoatPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const { boat, defaults, cabinTypes, cta, settings, destinations } = await getBoat(slug)

  if (!boat) notFound()

  // One token map for the whole page. `name` is the boat's SHORT name — the token stands in for
  // the name an editor would otherwise retype per boat, not the full page title.
  const tokens = { boat: boat.name }
  const t = (text?: string) => resolveTokens(text, tokens)

  // FAQPage JSON-LD — emitted for answer engines (AI Overviews / ChatGPT / Perplexity), NOT for
  // Google rich results, which have been gov/health-only since late 2023. See drk-seo's
  // aeo-considerations.md; the reasoning is counterintuitive enough that removing this "because
  // FAQ rich results are dead" would be a mistake. Scoped to THIS page's questions only.
  const faqQuestions = (boat.faqSections ?? []).flatMap((s) => s.questions ?? [])
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

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <BoatHero boat={boat} />
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
        />
        <BoatSpecs
          boat={boat}
          eyebrow={t(defaults?.specificationsEyebrow)}
          heading={t(defaults?.specificationsHeading)}
        />
        <BoatFaq boat={boat} />
        <Cta cta={cta} />
        <Contact settings={settings} destinations={destinations ?? []} />
      </main>
      <Footer />
      <ScrollReveal />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
    </>
  )
}

// Portable Text → plain string, for JSON-LD only (schema.org answers are plain text, not markup).
function toPlainText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map((b) =>
      b && typeof b === 'object' && 'children' in b && Array.isArray((b as { children: unknown[] }).children)
        ? (b as { children: { text?: string }[] }).children.map((c) => c.text ?? '').join('')
        : '',
    )
    .join('\n\n')
    .trim()
}
