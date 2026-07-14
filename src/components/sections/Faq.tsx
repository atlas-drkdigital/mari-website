'use client'

import { useState } from 'react'

// Ported from ../v1-static-homepage/sections/faq.html + assets/faq.js. Figma Section/FAQ
// 401:1774. Only one item open at a time; clicking the open item closes it. Two STABLE
// HTML columns (not CSS `columns-2`) — a multi-column layout re-balances items by height on
// every reflow, which would visibly shift OTHER items when one expands (a real bug Adinda
// caught in the original build, not just a style preference). Content sourced from mari-core
// (boat.md, commercial.md) — dive requirements, inclusions/exclusions, Nitrox pricing, crew
// ratio, payment/cancellation terms.
const COLUMN_1 = [
  { q: 'Who is Mari suitable for?', a: 'Mari welcomes certified divers with an Open Water certification and at least 30 logged dives, as well as non-diving guests joining for the scenery and onboard experience. All diving guests must carry valid dive insurance including medical evacuation cover.' },
  { q: 'Is there Nitrox on board?', a: 'Yes, via an onboard NRC membrane system, available to certified Nitrox divers at an additional cost.' },
  { q: "What's included in the price?", a: 'Airport or hotel transfers, cabin accommodation with ensuite bathroom and A/C, a fully crewed vessel, all meals, drinking water and hot drinks, all guided dives in the regular program, tank and weight rental, and land excursions as described in the itinerary.' },
  { q: "What's not included?", a: 'Flights, visas, and airport taxes; national park, conservation, and port fees; fuel surcharge; alcohol and soft drinks; Nitrox fills; dive courses and certifications; dive gear rental; diving and travel insurance; and crew gratuities.' },
]

const COLUMN_2 = [
  { q: "What's the minimum diving experience required?", a: 'An Open Water certification plus at least 30 logged dives is required for all cruises.' },
  { q: 'Is there a discount for group or full-boat bookings?', a: 'Yes -- full-boat charters and larger group bookings receive preferential rates. Get in touch for a custom quote.' },
  { q: "What's the crew-to-guest ratio?", a: '14 crew for 14 guests, a full 1:1 ratio, including 4 dedicated dive staff for up to a 4:1 diver-to-guide ratio.' },
  { q: "How do I pay, and what's the cancellation policy?", a: 'A 30% deposit is due within 7 days of booking, with the balance due 90 days before departure. Cancellations 91+ days out incur a 25% penalty, 90-61 days out 50%, and 60 days or less 100% of the cruise rate.' },
]

function FaqColumn({ items, openId, onToggle, columnOffset }: { items: typeof COLUMN_1; openId: string | null; onToggle: (id: string) => void; columnOffset: number }) {
  return (
    <div className="flex flex-1 flex-col">
      {items.map((item, i) => {
        const id = `faq-${columnOffset + i}`
        const active = openId === id
        return (
          <div
            key={id}
            className={`mb-8 flex flex-col border-b-[0.75px] py-12 [transition:opacity_500ms_cubic-bezier(0.65,0,0.35,1),border-color_500ms_cubic-bezier(0.65,0,0.35,1)] ${
              active ? 'border-border-onimage-primary' : 'border-accent-ondark-subtle opacity-80'
            }`}
          >
            <h3>
              <button type="button" aria-expanded={active} onClick={() => onToggle(id)} className="flex w-full items-center justify-between gap-8 text-left">
                <span className={`flex-1 text-text-ondark-primary [transition:color_500ms_cubic-bezier(0.65,0,0.35,1)] ${active ? 'text-editorial-h5' : 'text-body-large'}`}>{item.q}</span>
                <span aria-hidden="true" className="flex size-[20px] shrink-0 items-center justify-center">
                  <span className={`block size-[10px] bg-text-ondark-primary [transition:transform_500ms_cubic-bezier(0.65,0,0.35,1)] [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${active ? 'rotate-180' : ''}`} />
                </span>
              </button>
            </h3>
            <div className={`grid [transition:grid-template-rows_500ms_cubic-bezier(0.65,0,0.35,1)] ${active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <p className="mt-12 overflow-hidden text-body-medium lg:text-body-large text-text-ondark-primary">{item.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Faq() {
  const [openId, setOpenId] = useState<string | null>('faq-7')
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <section id="faq" aria-labelledby="faq-heading" className="relative isolate w-full pt-80 pb-80 lg:min-h-[600px] lg:pt-[144px] lg:pb-160">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--texture-dark)] bg-cover bg-center" />
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-[36px] page-gutter-x lg:gap-64">
        <div data-reveal="left" className="flex flex-col gap-24 lg:gap-32">
          <p className="text-eyebrow uppercase text-accent-ondark-primary">Good to Know</p>
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:gap-48">
            <h2 id="faq-heading" className="mr-[40px] max-w-[640px] text-display-h2 text-text-ondark-primary lg:mr-0">Frequently asked questions</h2>
            <a href="#" className="group inline-flex h-48 w-fit shrink-0 items-center gap-4 border border-border-onimage-primary px-20 py-8 text-button-small uppercase text-text-ondark-primary transition-colors duration-300 ease-in-out hover:bg-text-ondark-primary/10 lg:ml-auto">
              Read More
              <span aria-hidden="true" className="block size-[12px] shrink-0 bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] [mask-image:url('/assets/icon-arrow.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </a>
          </div>
        </div>

        <div data-reveal className="flex flex-col gap-8 lg:flex-row lg:gap-80">
          <FaqColumn items={COLUMN_1} openId={openId} onToggle={toggle} columnOffset={0} />
          <FaqColumn items={COLUMN_2} openId={openId} onToggle={toggle} columnOffset={4} />
        </div>
      </div>
    </section>
  )
}
