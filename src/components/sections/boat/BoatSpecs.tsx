import Image from 'next/image'

import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { BoatData } from '@/sanity/queries'

// Figma Section/LayoutAndSpecs = 778:8878.
//
// Native <details>/<summary>, so this stays a Server Component with zero JS: the accordion works
// before hydration, is keyboard-accessible for free, and its content is crawlable while collapsed.
// Per drk-seo: do NOT stack ARIA on native <details> — the element already carries the semantics.
//
// A spec category with an empty body doesn't render its row at all (locked 2026-07-17) — the 8
// categories are a fixed list, so an unfilled one is normal, not an error.
export function BoatSpecs({
  boat,
  eyebrow,
  heading,
}: {
  boat: BoatData
  eyebrow?: string
  heading?: string
}) {
  const specs = (boat.specifications ?? []).filter((s) => s.body?.length)
  const diagrams = boat.layoutDiagrams ?? []

  if (!specs.length && !diagrams.length) return null

  // Vertical padding GATED (audit 2026-07-20): desktop = Figma (120); mobile 64 to match the homepage
  // + BoatOverview rhythm. Was flat `py-[120px]` — desktop-sized padding on phones.
  return (
    <section id="layout-and-specs" aria-labelledby="boat-specs-heading" className="w-full bg-bg-page py-64 lg:py-[120px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-48 page-gutter-x lg:flex-row lg:gap-64">
        <div className="flex flex-1 flex-col gap-32">
          <div className="flex flex-col gap-24">
            {eyebrow ? <p className="text-eyebrow uppercase text-text-eyebrow">{eyebrow}</p> : null}
            {heading ? (
              <h2 id="boat-specs-heading" className="text-display-h2 text-text-primary">
                {heading}
              </h2>
            ) : null}
          </div>

          {specs.length ? (
            <div className="flex flex-col">
              {specs.map((spec) => (
                <details key={spec._key} className="group border-b-[0.75px] border-accent-subtle">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-16 py-24 text-body-large text-text-primary marker:hidden">
                    {spec.category}
                    <span
                      aria-hidden="true"
                      className="text-text-secondary transition-transform duration-300 ease-in-out group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="flex flex-col gap-16 pb-24 text-body-base text-text-primary">
                    <RichText value={spec.body!} />
                  </div>
                </details>
              ))}
            </div>
          ) : null}
        </div>

        {diagrams.length ? (
          <div className="flex w-full flex-col gap-32 lg:w-[560px] lg:shrink-0">
            {diagrams.map((diagram) => (
              <div key={diagram._key} className="flex flex-col gap-16">
                {diagram.heading ? (
                  <h3 className="text-display-h3 text-text-primary">{diagram.heading}</h3>
                ) : null}
                {diagram.body?.length ? (
                  <div className="flex flex-col gap-16 text-body-base text-text-primary">
                    <RichText value={diagram.body} />
                  </div>
                ) : null}
                {diagram.images?.map((img, i) => (
                  <div key={i} className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      {...sanityImageProps(img, '/assets/placeholder-photo.svg')}
                      alt={img.alt ?? ''}
                      fill
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
