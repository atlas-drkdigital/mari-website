'use client'

import { useState } from 'react'

import { toPlainText } from '@/components/RichText'
import type { FaqItemData, HomePageData } from '@/sanity/queries'

// The homepage shows the first N general FAQs (in the order set on the FAQ document); the "Read More"
// link goes to the full FAQ page for the rest. Kept simple per the "don't over-engineer" guidance —
// no inline expand; the existing link is the "more" affordance.
const HOMEPAGE_FAQ_LIMIT = 10

// Ported from ../v1-static-homepage/sections/faq.html + assets/faq.js. Figma Section/FAQ
// 401:1774. Only one item open at a time; clicking the open item closes it. Two STABLE
// HTML columns (not CSS `columns-2`) — a multi-column layout re-balances items by height on
// every reflow, which would visibly shift OTHER items when one expands (a real bug Adinda
// caught in the original build, not just a style preference). Questions come from the referenced
// general `faq` docs (full-wire slice, 2026-07-16) — no hardcoded fallback.
type FaqItem = { q: string; a: string }

function FaqColumn({ items, openId, onToggle, columnOffset }: { items: FaqItem[]; openId: string | null; onToggle: (id: string) => void; columnOffset: number }) {
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

export function Faq({ home, faq }: { home: HomePageData | null; faq: { questions?: FaqItemData[] } | null }) {
  const eyebrow = home?.faqEyebrow ?? ''
  const heading = home?.faqHeading ?? ''
  const linkText = home?.faqLinkText ?? ''
  const allItems: FaqItem[] = (faq?.questions ?? [])
    .slice(0, HOMEPAGE_FAQ_LIMIT)
    .map((f) => ({ q: f.question ?? '', a: toPlainText(f.answer) }))
  const splitAt = Math.ceil(allItems.length / 2)
  const col1 = allItems.slice(0, splitAt)
  const col2 = allItems.slice(splitAt)

  const [openId, setOpenId] = useState<string | null>('faq-7')
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <section id="faq" aria-labelledby="faq-heading" className="relative isolate w-full pt-80 pb-80 lg:min-h-[600px] lg:pt-[144px] lg:pb-160">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--texture-dark)] bg-cover bg-center" />
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-[36px] page-gutter-x lg:gap-64">
        <div data-reveal="left" className="flex flex-col gap-24 lg:gap-32">
          <p className="text-eyebrow uppercase text-accent-ondark-primary">{eyebrow}</p>
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:gap-48">
            <h2 id="faq-heading" className="mr-[40px] max-w-[640px] text-display-h2 text-text-ondark-primary lg:mr-0">{heading}</h2>
            <a href="#" className="group inline-flex h-48 w-fit shrink-0 items-center gap-4 border border-border-onimage-primary px-20 py-8 text-button-small uppercase text-text-ondark-primary transition-colors duration-300 ease-in-out hover:bg-text-ondark-primary/10 lg:ml-auto">
              {linkText}
              <span aria-hidden="true" className="block size-[12px] shrink-0 bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] [mask-image:url('/assets/icon-arrow.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </a>
          </div>
        </div>

        <div data-reveal className="flex flex-col gap-8 lg:flex-row lg:gap-80">
          <FaqColumn items={col1} openId={openId} onToggle={toggle} columnOffset={0} />
          <FaqColumn items={col2} openId={openId} onToggle={toggle} columnOffset={col1.length} />
        </div>
      </div>
    </section>
  )
}
