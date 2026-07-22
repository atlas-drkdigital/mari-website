import type { PortableTextBlock } from 'sanity'
import { groq } from 'next-sanity'

import type { SanityImageWithMeta } from './lib/image'

// Image projection used everywhere an image is rendered: keep `asset` as a REFERENCE (do NOT
// dereference with `asset->` — the URL builder needs `asset._ref`), and pull the asset's
// `originalFilename` + `metadata.lqip`/`dimensions` up as SIBLINGS. Matches SanityImageWithMeta /
// urlForImage (see src/sanity/lib/image.ts). `...` keeps alt, hotspot, crop, and seoImageName
// (when that field exists) for the vanity-filename chain.
const IMAGE = `{
    ...,
    "originalFilename": asset->originalFilename,
    "lqip": asset->metadata.lqip,
    "dimensions": asset->metadata.dimensions
  }`

// One fetch for the whole homepage: the homePage singleton, the shared CTA singleton, and the
// three most recent blog posts (auto — the homepage doesn't curate these).
export const HOMEPAGE_QUERY = groq`{
  "home": *[_id == "homePage"][0]{
    heroEyebrow, heroHeadingAccent, heroHeadingMain, heroSubheading, heroSearchPlaceholder,
    heroImage${IMAGE},
    heroVideo{ url, playOnMobile },
    theBoatEyebrow, theBoatHeading, theBoatBody, theBoatLinkText,
    theBoatImage${IMAGE},
    whyUsEyebrow, whyUsHeading,
    whyUsItems[]->{ _id, headline, description, image${IMAGE} },
    latestArticlesEyebrow, latestArticlesHeading, latestArticlesLinkText,
    faqEyebrow, faqHeading, faqLinkText,
    testimonialsEyebrow, testimonialsHeading, testimonialsLinkText,
    testimonialItems[]->{ _id, name, date, title, text, rating },
    seo
  },
  "cta": *[_id == "cta"][0]{
    cards[]{
      _key, heading, description, buttonText,
      buttonLink{ linkType, "internalType": internalLink->_type, "internalSlug": internalLink->slug.current, externalUrl, openInNewTab },
      image${IMAGE}
    }
  },
  // Homepage FAQ = the questions an editor marked "Feature on homepage", pulled from the General FAQ
  // and from every boat (destinations deliberately don't feed the homepage — see faqSection.ts).
  // General first, then boats, so the cross-cutting questions lead.
  // Each side is coalesced to []: GROQ's `+` yields null if EITHER operand is null, so an absent
  // faqGeneral would otherwise silently discard the boats' featured questions too (verified against
  // the real dataset, not assumed).
  "faq": {
    "questions": coalesce(*[_id == "faqGeneral"][0].categories[].questions[isFeatured == true]{ question, answer }, [])
      + coalesce(*[_type == "boat"].faqSections[].questions[isFeatured == true]{ question, answer }, [])
  },
  "latestPosts": *[_type == "blogPost" && defined(postDate) && defined(slug.current)] | order(postDate desc)[0...3]{
    _id, title, "slug": slug.current, excerpt, postDate,
    "category": category->name,
    coverImage${IMAGE}
  },
  // Card season/duration derive from the hero stats (one source of truth — the separate
  // seasonNights field was removed 2026-07-22, Adinda). Matched by the seeded stat LABELS: if an
  // editor renames "Season"/"Duration" on a destination, that part of its card line disappears —
  // accepted; the labels are seeded and there's no rename-proof key on a freeform stats array.
  "destinations": *[_type == "destination" && defined(slug.current)] | order(order asc, name asc){
    _id, name, tagline, excerpt, "slug": slug.current,
    "cardSeason": stats[label == "Season"][0].value,
    "cardDuration": stats[label == "Duration"][0].value,
    useCoverAsCardImage,
    cardImage${IMAGE},
    coverImage${IMAGE}
  },
  "settings": *[_id == "siteSettings"][0]{
    siteTitle, contactEyebrow, contactHeading, contactIntro
  }
}`

// One fetch for a boat page: the boat itself, the boatDefaults singleton (shared section chrome —
// eyebrows/headings edited once for every boat, carrying a {boat} token the frontend resolves), the
// cabin types pointing AT this boat, plus the shared CTA + contact chrome.
//
// `defaults` is fetched separately rather than joined: it's a singleton, not a per-boat reference,
// so there is nothing on the boat document to dereference.
//
// Cabin types are queried by their `boat` reference rather than being an inline array — keeps the
// boat/cabinType hierarchy independently queryable (see cabinType.ts).
export const BOAT_QUERY = groq`{
  "boat": *[_type == "boat" && slug.current == $slug][0]{
    _id, name, pageTitle, tagline,
    "slug": slug.current,
    coverImage${IMAGE},
    coverVideo{ url, playOnMobile },
    stats[]{ _key, label, value },
    "brochureUrl": brochurePdf.asset->url,
    keyFeatures,
    keyFeaturesImage${IMAGE},
    overviewHeading, overviewBody,
    cabinsIntro,
    galleryDescription,
    galleryTabs[]{ _key, category, heading, body },
    gallery[]${IMAGE},
    layoutDiagrams[]{ _key, heading, body, images[]${IMAGE} },
    specifications[]{ _key, category, body },
    faqSections[]{ _key, title, questions[]{ question, answer } },
    seo
  },
  "defaults": *[_id == "boatDefaults"][0]{
    overviewEyebrow, keyFeaturesHeading,
    cabinsEyebrow, cabinsHeading,
    galleryEyebrow, galleryTitle, galleryCtaText,
    specificationsEyebrow, specificationsHeading,
    faqEyebrow, faqHeading, faqLinkText,
    subnavOverviewLabel, subnavCabinsLabel, subnavGalleryLabel,
    subnavLayoutLabel, subnavSpecsLabel, subnavFaqLabel
  },
  // Shared FAQ categories composed onto the boat page (composition model locked 2026-07-16, see
  // mari-website's faq.md: boat pages show the boat's own sections plus shared General FAQ ones).
  // Selected by the editor-visible "Show on every boat page" toggle — NOT by title (replaced
  // 2026-07-21, Adinda): a title match silently dropped a category from boat pages the moment an
  // editor renamed it. The toggle is rename-proof and shows the editor exactly what is shared.
  "sharedFaqSections": *[_id == "faqGeneral"][0].categories[showOnBoatPages == true]{
    _key, title, questions[]{ question, answer }
  },
  "cabinTypes": *[_type == "cabinType" && boat->slug.current == $slug] | order(order asc, name asc){
    _id, name, count, maxGuests, description,
    bedConfiguration, deckLocation, window, bathroom, airConditioning,
    images[]${IMAGE}
  },
  "cta": *[_id == "cta"][0]{
    cards[]{
      _key, heading, description, buttonText,
      buttonLink{ linkType, "internalType": internalLink->_type, "internalSlug": internalLink->slug.current, externalUrl, openInNewTab },
      image${IMAGE}
    }
  },
  "settings": *[_id == "siteSettings"][0]{
    siteTitle, contactEyebrow, contactHeading, contactIntro
  },
  "destinations": *[_type == "destination" && defined(slug.current)] | order(order asc, name asc){
    _id, name, "slug": slug.current
  }
}`

// One fetch for a destination page — same composition model as BOAT_QUERY: the destination itself,
// the destinationDefaults singleton (shared chrome with a {destination} token), plus the auto-queried
// satellites: itineraries referencing this destination, shared General FAQ categories (via the
// showOnDestinationPages toggle — the destination twin of showOnBoatPages), the three latest posts
// (Articles section), every boat (About the Boats section — Mari today, future-proof for more), and
// the shared CTA/contact chrome.
//
// Itineraries are ordered by title for now — the itinerary doc has no `order` field yet; add one at
// the Itineraries-section build if the title order reads wrong (7-nights-first is the mockup's order).
export const DESTINATION_QUERY = groq`{
  "destination": *[_type == "destination" && slug.current == $slug][0]{
    _id, name, pageTitle, tagline,
    "slug": slug.current,
    coverImage${IMAGE},
    coverVideo{ url, playOnMobile },
    stats[]{ _key, label, value },
    overviewHeading, overviewBody,
    highlights[]{ _key, title, body, image${IMAGE} },
    gallery[]${IMAGE},
    "upcomingTripsEmbed": upcomingTripsEmbed.html,
    faqSections[]{ _key, title, questions[]{ question, answer } },
    seo
  },
  "defaults": *[_id == "destinationDefaults"][0]{
    overviewEyebrow,
    galleryCtaText,
    itinerariesEyebrow, itinerariesHeading,
    upcomingTripsEyebrow, upcomingTripsHeading, upcomingTripsIntro, upcomingTripsCtaText,
    faqEyebrow, faqHeading, faqLinkText,
    boatsEyebrow, boatsHeading,
    articlesEyebrow, articlesHeading, articlesLinkText,
    subnavOverviewLabel, subnavGalleryLabel, subnavItinerariesLabel,
    subnavFaqLabel, subnavTripsLabel
  },
  "itineraries": *[_type == "itinerary" && destination->slug.current == $slug] | order(title asc){
    _id, title, duration, route, highlights, summary
  },
  "sharedFaqSections": *[_id == "faqGeneral"][0].categories[showOnDestinationPages == true]{
    _key, title, questions[]{ question, answer }
  },
  // Unlike the homepage's latest-3, the destination Articles section shows only posts LINKED to
  // this destination via blogPost.relatedDestination (Adinda, 2026-07-22: "articles & news — but
  // Komodo only").
  "latestPosts": *[_type == "blogPost" && relatedDestination->slug.current == $slug && defined(postDate) && defined(slug.current)] | order(postDate desc)[0...3]{
    _id, title, "slug": slug.current, excerpt, postDate,
    "category": category->name,
    coverImage${IMAGE}
  },
  "boats": *[_type == "boat" && defined(slug.current)] | order(name asc){
    _id, name, pageTitle, tagline,
    "slug": slug.current,
    coverImage${IMAGE},
    stats[]{ _key, label, value }
  },
  "cta": *[_id == "cta"][0]{
    cards[]{
      _key, heading, description, buttonText,
      buttonLink{ linkType, "internalType": internalLink->_type, "internalSlug": internalLink->slug.current, externalUrl, openInNewTab },
      image${IMAGE}
    }
  },
  "settings": *[_id == "siteSettings"][0]{
    siteTitle, contactEyebrow, contactHeading, contactIntro
  },
  "destinations": *[_type == "destination" && defined(slug.current)] | order(order asc, name asc){
    _id, name, "slug": slug.current
  }
}`

// The /boats listing. Separate from BOAT_QUERY so the listing doesn't drag every boat's full
// gallery + specs over the wire for a card it renders four fields of.
export const BOATS_INDEX_QUERY = groq`{
  "boats": *[_type == "boat" && defined(slug.current)] | order(name asc){
    _id, name, pageTitle, tagline,
    "slug": slug.current,
    coverImage${IMAGE},
    stats[]{ _key, label, value }
  }
}`

// ----- Result types (manual — TypeGen not set up on this project yet) -----
export type WhyUsItemData = {
  _id: string
  headline?: string
  description?: PortableTextBlock[]
  image?: SanityImageWithMeta
}

export type FaqItemData = {
  question?: string
  answer?: PortableTextBlock[]
}

export type TestimonialData = {
  _id: string
  name?: string
  date?: string
  title?: string
  text?: string
  rating?: number
}

export type CtaCardData = {
  buttonLink?: import('@/lib/links').LinkQuery
  _key: string
  heading?: string
  description?: string
  buttonText?: string
  image?: SanityImageWithMeta
}

export type LatestPostData = {
  _id: string
  title?: string
  slug?: string
  excerpt?: string
  postDate?: string
  category?: string
  coverImage?: SanityImageWithMeta
}

export type DestinationCardData = {
  _id: string
  name?: string
  tagline?: string
  cardSeason?: string
  cardDuration?: string
  excerpt?: string
  slug?: string
  useCoverAsCardImage?: boolean
  cardImage?: SanityImageWithMeta
  coverImage?: SanityImageWithMeta
}

export type SiteSettingsContact = {
  /** Brand name for the {siteName} token in SEO titles (buildSeoMetadata). */
  siteTitle?: string
  contactEyebrow?: string
  contactHeading?: string
  contactIntro?: string
}

// Hero background video (objects/heroVideo.ts) — a CDN URL, not a Sanity asset. Rendered by
// HeroVideo.tsx over the hero's poster image. boat.coverVideo / homePage.heroVideo / destination.coverVideo.
export type HeroVideoData = {
  url?: string
  playOnMobile?: boolean
}

export type HomePageData = {
  heroEyebrow?: string
  heroHeadingAccent?: string
  heroHeadingMain?: string
  heroSubheading?: string
  heroSearchPlaceholder?: string
  heroImage?: SanityImageWithMeta
  heroVideo?: HeroVideoData
  theBoatEyebrow?: string
  theBoatHeading?: string
  theBoatBody?: PortableTextBlock[]
  theBoatLinkText?: string
  theBoatImage?: SanityImageWithMeta
  whyUsEyebrow?: string
  whyUsHeading?: string
  whyUsItems?: WhyUsItemData[]
  latestArticlesEyebrow?: string
  latestArticlesHeading?: string
  latestArticlesLinkText?: string
  faqEyebrow?: string
  faqHeading?: string
  faqLinkText?: string
  testimonialsEyebrow?: string
  testimonialsHeading?: string
  testimonialsLinkText?: string
  testimonialItems?: TestimonialData[]
  seo?: SeoData
}

// ----- Boat page -----
export type BoatStat = { _key: string; label?: string; value?: string }

export type GalleryImageData = SanityImageWithMeta & {
  _key: string
  title?: string
  caption?: string
  categories?: string[]
}

export type GalleryTabData = {
  _key: string
  category?: string
  heading?: string
  body?: PortableTextBlock[]
}

export type LayoutDiagramData = {
  _key: string
  heading?: string
  body?: PortableTextBlock[]
  images?: SanityImageWithMeta[]
}

export type SpecCategoryData = {
  _key: string
  category?: string
  body?: PortableTextBlock[]
}

export type FaqSectionData = {
  _key: string
  title?: string
  questions?: FaqItemData[]
}

export type CabinTypeData = {
  _id: string
  name?: string
  count?: number
  maxGuests?: number
  description?: PortableTextBlock[]
  bedConfiguration?: string
  deckLocation?: string
  window?: string
  bathroom?: string
  airConditioning?: string
  images?: SanityImageWithMeta[]
}

// Field names MUST match objects/seo.ts exactly. They are `title`/`description` there — an earlier
// version of this type declared `metaTitle`/`metaDescription`, which no schema field ever emitted, so
// every read silently resolved to undefined and fell through to the fallback. `tsc` could not catch
// it: query results are cast (`as BoatQueryResult`), so a wrong name here type-checks against nothing.
// Corrected 2026-07-20. If you rename a field in seo.ts, rename it here in the same commit.
// Both HOMEPAGE_QUERY and BOAT_QUERY select `seo` WHOLESALE (a bare `seo`, no projection), so every
// field below arrives without a query change. Extended 2026-07-20 from the title/description/noIndex
// subset — the rest were schema fields nothing rendered. Consumed by buildSeoMetadata in lib/seo.ts.
// `focusKeyword` stays absent (editorial-only, no render target). `breadcrumbTitle` IS consumed now
// (BoatHero's breadcrumb uses it, falling back to the boat name) — wired 2026-07-21, so it's queried
// (via the wholesale `seo` select) and typed here.
export type SeoData = {
  title?: string
  description?: string
  breadcrumbTitle?: string
  canonicalUrl?: string
  noIndex?: boolean
  noFollow?: boolean
  ogTitle?: string
  ogDescription?: string
  ogImage?: SanityImageWithMeta
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: SanityImageWithMeta
  overrideJsonLd?: boolean
  jsonLd?: string
}

export type BoatData = {
  _id: string
  name?: string
  pageTitle?: string
  tagline?: string
  slug?: string
  coverImage?: SanityImageWithMeta
  coverVideo?: HeroVideoData
  stats?: BoatStat[]
  brochureUrl?: string
  keyFeatures?: string[]
  keyFeaturesImage?: SanityImageWithMeta
  overviewHeading?: string
  overviewBody?: PortableTextBlock[]
  cabinsIntro?: PortableTextBlock[]
  galleryDescription?: PortableTextBlock[]
  galleryTabs?: GalleryTabData[]
  gallery?: GalleryImageData[]
  layoutDiagrams?: LayoutDiagramData[]
  specifications?: SpecCategoryData[]
  faqSections?: FaqSectionData[]
  seo?: SeoData
}

// Shared section chrome from the boatDefaults singleton. Every string here may contain a {boat}
// token — resolve with resolveTokens() before rendering, never pass straight through.
export type BoatDefaultsData = {
  overviewEyebrow?: string
  keyFeaturesHeading?: string
  cabinsEyebrow?: string
  cabinsHeading?: string
  galleryEyebrow?: string
  galleryTitle?: string
  galleryCtaText?: string
  specificationsEyebrow?: string
  specificationsHeading?: string
  faqEyebrow?: string
  faqHeading?: string
  faqLinkText?: string
  subnavOverviewLabel?: string
  subnavCabinsLabel?: string
  subnavGalleryLabel?: string
  subnavLayoutLabel?: string
  subnavSpecsLabel?: string
  subnavFaqLabel?: string
}

export type BoatQueryResult = {
  boat: BoatData | null
  defaults: BoatDefaultsData | null
  sharedFaqSections: FaqSectionData[] | null
  cabinTypes: CabinTypeData[]
  cta: { cards?: CtaCardData[] } | null
  settings: SiteSettingsContact | null
  destinations: { _id: string; name?: string; slug?: string }[]
}

// ----- Destination page -----
export type DestinationHighlightData = {
  _key: string
  title?: string
  body?: PortableTextBlock[]
  image?: SanityImageWithMeta
}

export type DestinationData = {
  _id: string
  name?: string
  pageTitle?: string
  tagline?: string
  slug?: string
  coverImage?: SanityImageWithMeta
  coverVideo?: HeroVideoData
  stats?: BoatStat[]
  overviewHeading?: string
  overviewBody?: PortableTextBlock[]
  highlights?: DestinationHighlightData[]
  gallery?: GalleryImageData[]
  /** Raw embed HTML (htmlEmbed.html) — the section hides when absent. */
  upcomingTripsEmbed?: string
  faqSections?: FaqSectionData[]
  seo?: SeoData
}

// Shared section chrome from the destinationDefaults singleton. Every string here may carry a
// {destination} token — resolve with resolveTokens() before rendering, never pass straight through.
export type DestinationDefaultsData = {
  overviewEyebrow?: string
  galleryCtaText?: string
  itinerariesEyebrow?: string
  itinerariesHeading?: string
  upcomingTripsEyebrow?: string
  upcomingTripsHeading?: string
  upcomingTripsIntro?: string
  upcomingTripsCtaText?: string
  faqEyebrow?: string
  faqHeading?: string
  faqLinkText?: string
  boatsEyebrow?: string
  boatsHeading?: string
  articlesEyebrow?: string
  articlesHeading?: string
  articlesLinkText?: string
  subnavOverviewLabel?: string
  subnavGalleryLabel?: string
  subnavItinerariesLabel?: string
  subnavFaqLabel?: string
  subnavTripsLabel?: string
}

export type ItineraryCardData = {
  _id: string
  title?: string
  duration?: string
  route?: string
  highlights?: string[]
  summary?: string
}

export type DestinationQueryResult = {
  destination: DestinationData | null
  defaults: DestinationDefaultsData | null
  itineraries: ItineraryCardData[]
  sharedFaqSections: FaqSectionData[] | null
  latestPosts: LatestPostData[]
  boats: BoatCardData[]
  cta: { cards?: CtaCardData[] } | null
  settings: SiteSettingsContact | null
  destinations: { _id: string; name?: string; slug?: string }[]
}

export type BoatCardData = {
  _id: string
  name?: string
  pageTitle?: string
  tagline?: string
  slug?: string
  coverImage?: SanityImageWithMeta
  stats?: BoatStat[]
}

export type BoatsIndexQueryResult = {
  boats: BoatCardData[]
}

export type HomePageQueryResult = {
  home: HomePageData | null
  cta: { cards?: CtaCardData[] } | null
  latestPosts: LatestPostData[]
  destinations: DestinationCardData[]
  settings: SiteSettingsContact | null
  faq: { questions?: FaqItemData[] } | null
}
