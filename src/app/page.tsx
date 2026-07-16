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

// Homepage — ported from ../v1-static-homepage and now wired to Sanity (homepage vertical slice,
// 2026-07-16). Async Server Component: fetches the homePage singleton + shared CTA + latest posts
// in one query and passes the data down to each section. Sections fall back to their original
// hardcoded copy when a field is empty, so the page never renders blank. Locked section order:
// Nav → Hero → The Boat → Why Us → Destinations → Latest Articles → FAQ → Testimonials → CTA →
// Contact → Footer. Destinations still uses @/lib/destinations this slice (migrates to Sanity
// destination docs in the destination slice); Footer/Nav are global chrome, wired separately.
export default async function Home() {
  const { data } = await sanityFetch({ query: HOMEPAGE_QUERY })
  const { home, cta, latestPosts } = (data ?? {}) as HomePageQueryResult

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero home={home} />
        <TheBoat home={home} />
        <WhyUs home={home} />
        <Destinations />
        <LatestArticles home={home} posts={latestPosts} />
        <Faq home={home} />
        <Testimonials home={home} />
        <Cta cta={cta} />
        <Contact home={home} />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  )
}
