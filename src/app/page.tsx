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
  const { data } = await sanityFetch({ query: HOMEPAGE_QUERY })
  const { home } = (data ?? {}) as HomePageQueryResult

  const title = home?.seo?.title
  const description = home?.seo?.description

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: '/' },
    robots: home?.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: { title, description, type: 'website' },
  }
}

export default async function Home() {
  const { data } = await sanityFetch({ query: HOMEPAGE_QUERY })
  const { home, cta, latestPosts, destinations, settings, faq } = (data ?? {}) as HomePageQueryResult
  const dests = destinations ?? []

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero home={home} destinations={dests} />
        <TheBoat home={home} />
        <WhyUs home={home} />
        <Destinations destinations={dests} />
        <LatestArticles home={home} posts={latestPosts} />
        <Faq home={home} faq={faq} />
        <Testimonials home={home} />
        <Cta cta={cta} />
        <Contact settings={settings} destinations={dests} />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  )
}
