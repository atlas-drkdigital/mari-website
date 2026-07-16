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
  "faq": *[_id == "faqGeneral"][0]{
    "questions": categories[].questions[]{ question, answer }
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

export type HomePageQueryResult = {
  home: HomePageData | null
  cta: { cards?: CtaCardData[] } | null
  latestPosts: LatestPostData[]
  destinations: DestinationCardData[]
  settings: SiteSettingsContact | null
  faq: { questions?: FaqItemData[] } | null
}
