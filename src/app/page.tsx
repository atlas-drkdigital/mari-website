import type { Metadata } from 'next'

import { Nav } from '@/components/Nav'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Contact } from '@/components/sections/Contact'
import { Cta } from '@/components/sections/Cta'
import { Destinations } from '@/components/sections/Destinations'
import { Faq } from '@/components/sections/Faq'
import { Footer } from '@/components/sections/Footer'
import { Hero } from '@/components/sections/Hero'
import { LatestArticles } from '@/components/sections/LatestArticles'
import { Testimonials } from '@/components/sections/Testimonials'
import { TheBoat } from '@/components/sections/TheBoat'
import { WhyUs } from '@/components/sections/WhyUs'
import { toPlainText } from '@/lib/portableText'
import { buildSeoMetadata, resolveJsonLd } from '@/lib/seo'
import { sanityFetch } from '@/sanity/lib/live'
import { HOMEPAGE_QUERY, type HomePageQueryResult } from '@/sanity/queries'

// Homepage — ported from ../v1-static-homepage and now FULLY wired to Sanity (homepage vertical
// slice, 2026-07-16). Async Server Component: one query fetches the homePage singleton + shared CTA
// + latest posts + all destination docs + siteSettings contact copy, and passes the data down to
// each section. No hardcoded content fallbacks — every section reads from Sanity (the content is
// seeded, so nothing renders blank; sections degrade gracefully to empty, never throw). Locked
// section order: Nav → Hero → The Boat → Why Us → Destinations → Latest Articles → FAQ →
// Testimonials → CTA → Contact → Footer. Footer/Nav are global chrome, wired in a separate slice.
// Mirrors the boat page's generateMetadata. Until 2026-07-20 this did not exist at all: the homePage
// singleton had an `seo` field an editor could fill in, and the served page took its title/description
// from layout.tsx's hardcoded root metadata instead — so typing a meta title into Studio did nothing.
// Falls back to the root metadata (by returning an empty field) rather than to hardcoded copy.
export async function generateMetadata(): Promise<Metadata> {
  // stega: false is REQUIRED on any fetch feeding metadata. Stega encodes edit-links as invisible
  // Unicode inside every string; harmless in rendered copy, but in a <title> or og: tag it ships
  // junk to Google. Visual Editing is off today so this is currently a no-op — it is here so that
  // turning it on later cannot silently corrupt metadata. Per drk-seo/references/technical-seo.md.
  const { data } = await sanityFetch({ query: HOMEPAGE_QUERY, stega: false })
  const { home, settings } = (data ?? {}) as HomePageQueryResult

  // Every seo field with a rendering target resolves in buildSeoMetadata — social overrides, OG /
  // Twitter images, the canonical override, and noIndex/noFollow as independent directives. With no
  // title/description set it returns neither key, so layout.tsx's root metadata still applies.
  return buildSeoMetadata({ seo: home?.seo, fallbackImage: home?.heroImage, path: '/', siteName: settings?.siteTitle })
}

export default async function Home() {
  const { data } = await sanityFetch({ query: HOMEPAGE_QUERY })
  const { home, cta, latestPosts, curatedDestinations, destinations, settings, faq } = (data ?? {}) as HomePageQueryResult
  const dests = destinations ?? []
  // The CAROUSEL takes the destinationsSection singleton's drag-curated list (2026-07-23);
  // an unseeded/empty singleton degrades to the all-list so the section never silently vanishes.
  // Hero search + Contact keep the all-list — those must never hide a destination.
  // .filter(Boolean): a reference whose target isn't published dereferences to null (the same
  // null-member class that 500'd the homepage FAQ, commit 8ded5ec — and again here on first seed).
  const curated = (curatedDestinations ?? []).filter(Boolean)
  const carouselDests = curated.length ? curated : dests

  // FAQPage JSON-LD for the homepage's FAQ block (the boat page already emits its own). Same reason
  // as the boat page: answer engines, not Google rich results. The Organization block is emitted
  // site-wide in layout.tsx. `resolveJsonLd` lets an editor's `overrideJsonLd` replace this.
  const homeFaqQuestions = (faq?.questions ?? []).filter((q) => q?.question)
  const homeFaqJsonLd = homeFaqQuestions.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: homeFaqQuestions.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: toPlainText(q.answer) },
        })),
      }
    : null
  const homeJsonLd = resolveJsonLd(home?.seo, homeFaqJsonLd)

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero home={home} destinations={dests} />
        <TheBoat home={home} />
        <WhyUs home={home} />
        <Destinations destinations={carouselDests} />
        <LatestArticles
          eyebrow={home?.latestArticlesEyebrow}
          heading={home?.latestArticlesHeading}
          linkText={home?.latestArticlesLinkText}
          posts={latestPosts}
        />
        <Faq home={home} faq={faq} />
        <Testimonials home={home} />
        <Cta cta={cta} />
        <Contact settings={settings} destinations={dests} />
      </main>
      <Footer />
      <ScrollReveal />
      {homeJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
        />
      ) : null}
    </>
  )
}
