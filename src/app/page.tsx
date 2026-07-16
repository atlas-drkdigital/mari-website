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
