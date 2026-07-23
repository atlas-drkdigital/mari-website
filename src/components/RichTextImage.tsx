'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'

import type { LightboxSlide } from '@/components/SiteLightbox'
import { sanityImageProps, urlForImage, type SanityImageWithMeta } from '@/sanity/lib/image'

// Rich-text inline image, now CLICK-TO-ZOOM (Adinda, 2026-07-23 — asked for the destinations map:
// "make it clickable so people can zoom in... it's kind of important"). Renders the figure exactly
// as RichText.tsx used to, wrapped in a button that opens the site lightbox with this one image.
// Split into its own client component so RichText itself stays server-renderable.
//
// Same conventions as every other zoomable image: cursor-zoom-in + the slow hover zoom
// (scale-105 / 1100ms), lightbox via the dynamic-import boundary (never import SiteLightbox
// statically — see its header), slide URL built with fit('max') so it never upscales.

const SiteLightbox = dynamic(() => import('@/components/SiteLightbox').then((m) => m.SiteLightbox), {
  ssr: false,
})

const IMAGE_SIZE: Record<string, string> = {
  full: 'w-full',
  large: 'w-full lg:w-3/4',
  medium: 'w-full lg:w-1/2',
  small: 'w-full lg:w-1/3',
}

const IMAGE_ALIGN: Record<string, string> = {
  center: 'mx-auto',
  left: 'mr-auto',
  right: 'ml-auto',
}

// The caption follows the IMAGE's own Alignment control (Adinda, 2026-07-23: captions centred by
// default + modifiable) — the block's alignment defaults to 'center', so captions centre by
// default, and one Studio radio governs both. No separate caption-alignment field.
const CAPTION_ALIGN: Record<string, string> = {
  center: 'text-center',
  left: 'text-left',
  right: 'text-right',
}

export type RichTextImageValue = SanityImageWithMeta & {
  caption?: string
  size?: string
  alignment?: string
}

export function RichTextImage({ value }: { value: RichTextImageValue }) {
  const [open, setOpen] = useState(false)
  if (!value?.asset?._ref) return null

  const width = IMAGE_SIZE[value.size ?? 'full'] ?? IMAGE_SIZE.full
  const align = IMAGE_ALIGN[value.alignment ?? 'center'] ?? IMAGE_ALIGN.center
  const slides: LightboxSlide[] = [
    {
      src: urlForImage(value).width(1920).fit('max').quality(75).auto('format').url(),
      alt: value.alt,
      caption: value.caption || value.alt || undefined,
    },
  ]

  return (
    <>
      <figure className={`flex flex-col gap-8 ${width} ${align}`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={value.alt ? `View larger: ${value.alt}` : 'View larger image'}
          className="group/rtimage relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden"
        >
          <Image
            {...sanityImageProps(value, '/assets/placeholder-photo.svg')}
            alt={value.alt ?? ''}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/rtimage:scale-105"
          />
        </button>
        {value.caption ? (
          <figcaption
            className={`text-caption-label text-text-secondary ${
              CAPTION_ALIGN[value.alignment ?? 'center'] ?? CAPTION_ALIGN.center
            }`}
          >
            {value.caption}
          </figcaption>
        ) : null}
      </figure>
      <SiteLightbox open={open} index={0} slides={slides} onClose={() => setOpen(false)} ariaLabel="Image" />
    </>
  )
}
