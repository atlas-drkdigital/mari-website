import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/JsonLd'
import { Nav } from '@/components/Nav'
import { ScrollReveal } from '@/components/ScrollReveal'
import { BookingHero } from '@/components/sections/booking/BookingHero'
import { BookingSchedule } from '@/components/sections/booking/BookingSchedule'
import { Contact } from '@/components/sections/Contact'
import { FaqCategorized } from '@/components/sections/FaqCategorized'
import { Footer } from '@/components/sections/Footer'
import { toPlainText } from '@/lib/portableText'
import { buildBreadcrumbJsonLd, buildSeoMetadata, resolveJsonLd } from '@/lib/seo'
import { sanityFetch } from '@/sanity/lib/live'
import { BOOKING_QUERY, type BookingQueryResult } from '@/sanity/queries'

// Schedule & Rates vertical slice, 2026-07-24. Singleton page — no [slug] segment; the route path
// itself is the URL.
//
// ROUTE PATH: '/booking' — LOCKED by Adinda 2026-07-24 (supersedes the earlier /schedule-rates
// placeholder path the Footer/Trips CTA carried while the page didn't exist).
//
// No Figma mockup — built to Adinda's dictated design (revised at QA round 1, 2026-07-24): PHOTO
// hero band (H1 + description over a full-bleed image, centered, breadcrumbs — was a
// light-texture band for one day) → beige-100 band where the INSEANQ widget sits in a white
// shadowed card OVERLAPPING the hero's bottom edge → categorized FAQ (General FAQ categories
// toggled on via showOnBookingPage) → Contact → Footer. No SubNav, no CTA after the embed. The
// main nav is the standard dark-over-photo <Nav /> again — lightHero was consumed here for one
// day and released back (see Nav.tsx's lightHero comment).

async function getData() {
  const { data } = await sanityFetch({ query: BOOKING_QUERY })
  return (data ?? {}) as BookingQueryResult
}

export async function generateMetadata(): Promise<Metadata> {
  // stega: false — see the note in src/app/page.tsx. Metadata must never carry stega encoding.
  const { data } = await sanityFetch({ query: BOOKING_QUERY, stega: false })
  const { schedule, settings } = (data ?? {}) as BookingQueryResult
  if (!schedule) return {}

  const plainDescription = toPlainText(schedule.description)
  return buildSeoMetadata({
    seo: schedule.seo,
    fallbackTitle: schedule.title,
    fallbackImage: schedule.heroImage,
    fallbackDescription: plainDescription
      ? plainDescription.length > 160
        ? `${plainDescription.slice(0, 157).trimEnd()}…`
        : plainDescription
      : undefined,
    path: '/booking',
    siteName: settings?.siteTitle,
  })
}

export default async function BookingPage() {
  const { schedule, sharedFaqSections, destinations, settings } = await getData()

  if (!schedule) notFound()

  // FAQ composition: this page has no categories of its own — only the shared General FAQ
  // categories an editor toggled onto it (showOnBookingPage, filtered in the query).
  const faqSections = (sharedFaqSections ?? []).filter((s) => s.questions?.length)

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

  const jsonLd = resolveJsonLd(schedule.seo, faqJsonLd)

  // BreadcrumbList mirrors BookingHero's visual trail exactly (Home / {title}) — including the
  // breadcrumbTitle override — per buildBreadcrumbJsonLd's contract.
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: schedule.seo?.breadcrumbTitle || schedule.title || 'Schedule & Rates', path: '/booking' },
  ])

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <BookingHero schedule={schedule} />
        <BookingSchedule embedCode={schedule.embedCode} />
        <FaqCategorized
          sections={faqSections}
          eyebrow={schedule.faqEyebrow}
          heading={schedule.faqHeading}
          linkText={schedule.faqLinkText}
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
