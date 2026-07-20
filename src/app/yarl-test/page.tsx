import { groq } from 'next-sanity'

import { urlFor } from '@/sanity/lib/image'
import { sanityFetch } from '@/sanity/lib/live'

import { YarlTestClient, type TestSlide } from './YarlTestClient'

// THROWAWAY evaluation route (2026-07-20) — see YarlTestClient.tsx. Delete once the YARL call is
// made. noindex so it can never be crawled if it outlives its usefulness.
export const metadata = { robots: { index: false, follow: false } }

const QUERY = groq`{
  "gallery": *[_id == "boat-mari"][0].gallery[]{
    _key, title, alt, caption, asset, hotspot, crop
  },
  "cabins": *[_type == "cabinType"] | order(order asc, name asc){
    name,
    images[]{ alt, asset, hotspot, crop }
  }
}`

type GalleryRow = { _key: string; title?: string; alt?: string; caption?: string }
type CabinRow = { name?: string; images?: { alt?: string }[] }

// fit('max') so the lightbox never upscales past the master — mandatory per CLAUDE.md's image rules.
// auto('format') is the ONLY path to AVIF. q75 is the measured choice (q80 busts the byte budget on
// the cold WebP path, which is what most first-time visitors actually get).
const full = (img: unknown) => urlFor(img as never).width(1920).fit('max').quality(75).auto('format').url()
const thumb = (img: unknown) => urlFor(img as never).width(600).height(400).fit('crop').quality(75).auto('format').url()

export default async function YarlTestPage() {
  const { data } = await sanityFetch({ query: QUERY })
  const { gallery = [], cabins = [] } = (data ?? {}) as {
    gallery?: GalleryRow[]
    cabins?: CabinRow[]
  }

  const gallerySlides: TestSlide[] = gallery.map((img) => ({
    src: full(img),
    thumb: thumb(img),
    title: img.title,
    description: img.caption,
  }))

  // The point of the test: flatten every cabin type into ONE list, but stamp each slide with the
  // cabin it came from. Derived from `cabin.name`, never hand-typed.
  const cabinSlides: TestSlide[] = cabins.flatMap((cabin) =>
    (cabin.images ?? []).map((img, i) => ({
      src: full(img),
      thumb: thumb(img),
      title: cabin.name,
      description: img.alt || `${cabin.name} — photo ${i + 1}`,
    })),
  )

  return <YarlTestClient gallery={gallerySlides} cabins={cabinSlides} />
}
