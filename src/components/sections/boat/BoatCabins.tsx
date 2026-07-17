'use client'

import { useState } from 'react'
import Image from 'next/image'

import { RichText } from '@/components/RichText'
import { sanityImageProps } from '@/sanity/lib/image'
import type { BoatData, CabinTypeData } from '@/sanity/queries'

// Figma Section/Cabins = 778:8762. The tabs (778:8771-8772) are `cabinType` documents, not a fixed
// list — Figma shows two (Deluxe/Superior) because that's what this boat has, not because two is
// the design. Any number of cabin types renders.
//
// The spec rows below the copy are the cabinType's own fields (bed / deck / window / bathroom /
// air conditioning). A row with no value doesn't render — an editor leaving "window" blank should
// produce one less row, not an empty one.
export function BoatCabins({
  boat,
  cabinTypes,
  eyebrow,
  heading,
}: {
  boat: BoatData
  cabinTypes: CabinTypeData[]
  eyebrow?: string
  heading?: string
}) {
  const [activeId, setActiveId] = useState(cabinTypes[0]?._id)

  if (!cabinTypes.length) return null

  const active = cabinTypes.find((c) => c._id === activeId) ?? cabinTypes[0]
  const specRows = [
    active.bedConfiguration,
    active.deckLocation,
    active.window,
    active.bathroom,
    active.airConditioning,
  ].filter(Boolean) as string[]

  return (
    <section id="cabins" aria-labelledby="boat-cabins-heading" className="w-full bg-bg-page py-120">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-48 page-gutter-x">
        <div className="mx-auto flex max-w-[720px] flex-col gap-24 text-center">
          {eyebrow ? <p className="text-eyebrow uppercase text-text-eyebrow">{eyebrow}</p> : null}
          {heading ? (
            <h2 id="boat-cabins-heading" className="text-display-h2 text-text-primary">
              {heading}
            </h2>
          ) : null}
          {boat.cabinsIntro?.length ? (
            <div className="flex flex-col gap-16 text-body-large text-text-primary">
              <RichText value={boat.cabinsIntro} />
            </div>
          ) : null}
        </div>

        <div role="tablist" aria-label="Cabin types" className="flex justify-center gap-16">
          {cabinTypes.map((cabin) => {
            const selected = cabin._id === active._id
            return (
              <button
                key={cabin._id}
                role="tab"
                type="button"
                id={`cabin-tab-${cabin._id}`}
                aria-selected={selected}
                aria-controls={`cabin-panel-${cabin._id}`}
                onClick={() => setActiveId(cabin._id)}
                className={`border-b py-4 text-button-small uppercase transition-colors duration-300 ease-in-out ${
                  selected
                    ? 'border-action-primary text-action-primary'
                    : 'border-transparent text-text-secondary hover:text-action-primary'
                }`}
              >
                {cabin.name}
              </button>
            )
          })}
        </div>

        <div
          role="tabpanel"
          id={`cabin-panel-${active._id}`}
          aria-labelledby={`cabin-tab-${active._id}`}
          className="flex flex-col gap-48 lg:flex-row lg:gap-64"
        >
          <div className="relative aspect-[708/532] w-full overflow-hidden lg:w-[708px] lg:shrink-0">
            <Image
              {...sanityImageProps(active.images?.[0], '/assets/placeholder-photo.svg')}
              alt={active.images?.[0]?.alt ?? ''}
              fill
              sizes="(min-width: 1024px) 708px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-24">
            <div className="flex flex-col gap-8">
              <h3 className="text-display-h3 text-text-primary">{active.name}</h3>
              {/* "3 Cabins · Max. 2 Guests" (778:8788) — assembled from the two numeric fields
                  rather than a typed string, so it can't drift from the real counts. */}
              {active.count || active.maxGuests ? (
                <p className="text-body-small text-text-secondary">
                  {[
                    active.count ? `${active.count} Cabins` : null,
                    active.maxGuests ? `Max. ${active.maxGuests} Guests` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              ) : null}
            </div>

            {active.description?.length ? (
              <div className="flex flex-col gap-16 text-body-large text-text-primary">
                <RichText value={active.description} />
              </div>
            ) : null}

            {specRows.length ? (
              <ul className="flex flex-col">
                {specRows.map((row) => (
                  <li key={row} className="border-t border-beige-200 py-16 text-body-base text-text-primary">
                    {row}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
