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
    theBoatEyebrow, theBoatHeading, theBoatBody, theBoatLinkText,
    theBoatImage${IMAGE},
    whyUsEyebrow, whyUsHeading,
    whyUsItems[]->{ _id, headline, description, image${IMAGE} },
    latestArticlesEyebrow, latestArticlesHeading, latestArticlesLinkText,
    faqEyebrow, faqHeading, faqLinkText,
    testimonialsEyebrow, testimonialsHeading, testimonialsLinkText,
    testimonialItems[]->{ _id, name, date, title, text, rating }
  },
  "cta": *[_id == "cta"][0]{
    cards[]{ _key, heading, description, buttonText, image${IMAGE} }
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
  "destinations": *[_type == "destination" && defined(slug.current)] | order(order asc, name asc){
    _id, name, tagline, seasonNights, excerpt, "slug": slug.current,
    coverImage${IMAGE}
  },
  "settings": *[_id == "siteSettings"][0]{
    contactEyebrow, contactHeading, contactIntro
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
    galleryEyebrow, galleryTitle,
    specificationsEyebrow, specificationsHeading
  },
  "cabinTypes": *[_type == "cabinType" && boat->slug.current == $slug] | order(order asc, name asc){
    _id, name, count, maxGuests, description,
    bedConfiguration, deckLocation, window, bathroom, airConditioning,
    images[]${IMAGE}
  },
  "cta": *[_id == "cta"][0]{
    cards[]{ _key, heading, description, buttonText, image${IMAGE} }
  },
  "settings": *[_id == "siteSettings"][0]{
    contactEyebrow, contactHeading, contactIntro
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
  seasonNights?: string
  excerpt?: string
  slug?: string
  coverImage?: SanityImageWithMeta
}

export type SiteSettingsContact = {
  contactEyebrow?: string
  contactHeading?: string
  contactIntro?: string
}

export type HomePageData = {
  heroEyebrow?: string
  heroHeadingAccent?: string
  heroHeadingMain?: string
  heroSubheading?: string
  heroSearchPlaceholder?: string
  heroImage?: SanityImageWithMeta
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

export type SeoData = {
  metaTitle?: string
  metaDescription?: string
  noIndex?: boolean
}

export type BoatData = {
  _id: string
  name?: string
  pageTitle?: string
  tagline?: string
  slug?: string
  coverImage?: SanityImageWithMeta
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
  specificationsEyebrow?: string
  specificationsHeading?: string
}

export type BoatQueryResult = {
  boat: BoatData | null
  defaults: BoatDefaultsData | null
  cabinTypes: CabinTypeData[]
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
