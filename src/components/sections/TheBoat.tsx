import Image from 'next/image'

import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { HomePageData } from '@/sanity/queries'

// Ported from ../v1-static-homepage/sections/the-boat.html. Figma Home/Section/The Boat
// 218:1327 — homepage teaser linking out to the full boat page (not built yet, href="#").
// Pure hover effect (CSS scale), no interactivity — Server Component.
export function TheBoat({ home }: { home: HomePageData | null }) {
  const eyebrow = home?.theBoatEyebrow ?? ''
  const heading = home?.theBoatHeading ?? ''
  const linkText = home?.theBoatLinkText ?? ''
  return (
    <section id="the-boat" aria-labelledby="the-boat-heading" className="flex w-full items-center bg-bg-page py-96 lg:py-80 min-h-[min(100dvh,1080px)]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-48 page-gutter-x lg:flex-row lg:gap-64">
        <a
          href="#"
          aria-label="Learn more about the Mari phinisi"
          data-reveal
          className="group/boat relative block aspect-[529/794] w-full overflow-hidden lg:w-[48%] lg:shrink-0"
        >
          <Image
            {...sanityImageProps(home?.theBoatImage, '/assets/the-boat.webp')}
            alt={home?.theBoatImage?.alt ?? ''}
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/boat:scale-105"
          />
        </a>

        <div className="flex flex-1 flex-col gap-24" data-reveal="left">
          <div className="flex flex-col gap-24">
            <p className="text-eyebrow uppercase text-text-eyebrow">{eyebrow}</p>
            <h2 id="the-boat-heading" className="text-display-h2 text-text-primary">{heading}</h2>
          </div>
          <div className="flex flex-col gap-16 text-body-large text-text-primary">
            {home?.theBoatBody?.length ? <RichText value={home.theBoatBody} /> : null}
          </div>
          <a href="#" className="group inline-flex w-fit items-center gap-4 border-b border-action-primary py-4 text-button-small uppercase text-action-primary transition-colors duration-300 ease-in-out hover:border-accent-muted hover:text-accent-muted">
            {linkText}
            <span aria-hidden="true" className="block size-[16px] shrink-0 bg-action-primary transition-[background-color,transform] duration-300 ease-in-out group-hover:translate-x-[2px] group-hover:bg-accent-muted [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
          </a>
        </div>
      </div>
    </section>
  )
}
