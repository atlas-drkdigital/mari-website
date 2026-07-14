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

// Homepage — ported from ../v1-static-homepage (frozen static build) per CLAUDE.md's
// migration plan. Locked section order: Nav → Hero → The Boat → Why Us → Destinations →
// Latest Articles → FAQ → Testimonials → CTA → Contact → Footer. Content is still the
// static build's hardcoded copy (no Sanity wiring yet) — homePage schema doesn't exist as
// a document type until Tier 4; this pass proves the design system in Next.js first.
export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <TheBoat />
        <WhyUs />
        <Destinations />
        <LatestArticles />
        <Faq />
        <Testimonials />
        <Cta />
        <Contact />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  )
}
