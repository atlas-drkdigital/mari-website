'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { sanityImageProps } from '@/sanity/lib/image'
import type { DestinationCardData, HomePageData } from '@/sanity/queries'

// Ported from ../v1-static-homepage/sections/hero.html + assets/search.js. Figma 218:1901.
// Full-bleed hero (does not use the centered container). MOBILE (<lg): no mobile Figma frame
// exists — full-viewport height, all content centered; destination search opens a full-screen
// takeover instead of the inline dropdown. Desktop (>=lg): CSS :focus-within reveals the
// inline dropdown; typing filters it. The search list is built from real `destination` docs
// (full-wire slice, 2026-07-16).
const MOBILE_QUERY = '(max-width: 1023.98px)'

function filterDestinations(destinations: DestinationCardData[], query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return destinations
  return destinations.filter((d) => (d.name ?? '').toLowerCase().includes(q))
}

export function Hero({ home, destinations }: { home: HomePageData | null; destinations: DestinationCardData[] }) {
  const eyebrow = home?.heroEyebrow ?? ''
  const headingAccent = home?.heroHeadingAccent ?? ''
  const headingMain = home?.heroHeadingMain ?? ''
  const subheading = home?.heroSubheading ?? ''
  const searchPlaceholder = home?.heroSearchPlaceholder ?? ''

  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileQuery, setMobileQuery] = useState('')

  const heroInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('overflow-hidden', mobileOpen)
    if (!mobileOpen) return
    // Focus the MODAL, not the input — focusing a text input immediately triggers the
    // on-screen keyboard before the user has seen the list, which is poor UX (see search.js).
    modalRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const handleHeroInputFocus = () => {
    if (window.matchMedia(MOBILE_QUERY).matches) {
      heroInputRef.current?.blur()
      setMobileQuery(query)
      setMobileOpen(true)
    }
  }

  const selectDestination = (name: string) => {
    setQuery(name)
    heroInputRef.current?.blur()
  }

  const selectMobileDestination = (name: string) => {
    setQuery(name)
    setMobileOpen(false)
  }

  return (
    <>
      <section id="hero" aria-labelledby="hero-heading" className="relative isolate z-10 min-h-dvh w-full">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            {...sanityImageProps(home?.heroImage, '/assets/hero.webp')}
            alt={home?.heroImage?.alt ?? ''}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[65%_42%] lg:object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background-ondark-page/78 via-background-ondark-page/40 to-transparent lg:from-background-ondark-page/55 lg:via-transparent" />
        </div>

        <div className="flex min-h-dvh flex-col justify-center page-gutter-x py-32">
          <div data-reveal="left" className="mx-auto flex w-full max-w-[400px] flex-col items-center gap-24 text-center lg:mx-0 lg:items-start lg:gap-48 lg:text-left">
            <div className="flex flex-col gap-16">
              <p className="text-eyebrow uppercase text-accent-ondark-primary">{eyebrow}</p>
              <h1 id="hero-heading" className="flex flex-col text-text-ondark-primary">
                <span className="text-display-accent">{headingAccent}</span>
                <span className="text-display-h1">{headingMain}</span>
              </h1>
              <p className="max-w-[400px] text-body-medium text-text-ondark-muted lg:text-body-large">
                {subheading}
              </p>
            </div>

            <div className="group relative mx-auto w-full max-w-[304px] lg:mx-0 lg:max-w-[380px]">
              <form
                role="search"
                onSubmit={(e) => e.preventDefault()}
                className="flex w-full items-center gap-12 rounded-full border-2 border-accent-ondark-primary bg-background-ondark-muted/40 px-24 py-12 transition-colors duration-300 ease-in-out group-focus-within:bg-background-ondark-muted lg:bg-background-ondark-page/20 lg:py-16"
              >
                <input
                  ref={heroInputRef}
                  type="search"
                  autoComplete="off"
                  aria-label="Where would you like to dive?"
                  aria-haspopup="dialog"
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={handleHeroInputFocus}
                  className="min-w-0 flex-1 bg-transparent text-[16px] lg:text-body-medium text-text-ondark-primary placeholder:text-text-ondark-secondary focus:outline-none"
                />
                <Image src="/assets/icon-search.svg" alt="" aria-hidden="true" width={15} height={15} className="size-[15px] shrink-0" />
              </form>

              {/* destinations dropdown — desktop only, revealed on focus via CSS focus-within */}
              <div className="absolute inset-x-0 top-full z-20 mt-4 hidden overflow-hidden rounded-md bg-background-ondark-muted shadow-card lg:group-focus-within:block">
                <ul aria-label="Destinations" className="flex flex-col divide-y divide-text-ondark-primary/10 py-8">
                  {filterDestinations(destinations, query).map((dest) => (
                    <li key={dest._id}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectDestination(dest.name ?? '')}
                        className="flex w-full items-baseline gap-8 px-24 py-12 text-left transition-colors duration-300 ease-in-out hover:bg-text-ondark-primary/5"
                      >
                        <span className="shrink-0 whitespace-nowrap text-body-medium text-text-ondark-primary">{dest.name}</span>
                        <span className="min-w-0 truncate text-caption-label text-text-ondark-muted">{dest.tagline}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Scroll to next section"
          onClick={() => {
            const hero = document.getElementById('hero')
            let el = hero?.nextElementSibling
            while (el && el.tagName !== 'SECTION') el = el.nextElementSibling
            if (!el) return
            const nav = document.getElementById('nav')
            const top = el.getBoundingClientRect().top + window.scrollY - (nav?.offsetHeight || 0)
            window.scrollTo({ top, behavior: 'smooth' })
          }}
          className="group absolute bottom-32 left-1/2 grid size-[36px] -translate-x-1/2 place-items-center rounded-full border border-bg-surface text-text-ondark-primary transition-colors duration-300 ease-in-out hover:bg-text-ondark-primary/10 lg:bottom-48 lg:left-80 lg:size-[52px] lg:translate-x-0"
        >
          <span aria-hidden="true" className="block size-[16px] bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover:scale-105 [mask-image:url('/assets/icon-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
        </button>
      </section>

      {/* mobile destinations search — full-screen takeover (<lg). Sibling of #hero, not nested:
          hero has `isolate` (to contain its -z-10 background layer), which creates a new
          stacking context — any z-index inside it can never out-stack the nav's z-50. */}
      <div
        ref={modalRef}
        id="mobile-search"
        className={`fixed inset-x-0 top-0 z-[70] ${mobileOpen ? 'flex' : 'hidden'} h-dvh flex-col bg-bg-page lg:hidden focus:outline-none`}
        role="dialog"
        aria-modal="true"
        aria-label="Search destinations"
        tabIndex={-1}
      >
        <div className="flex shrink-0 items-center gap-12 border-b border-border-default page-gutter-x py-16">
          <form onSubmit={(e) => e.preventDefault()} role="search" className="flex flex-1 items-center gap-12 rounded-full border-2 border-border-input bg-bg-surface px-24 py-12">
            <input
              type="search"
              autoComplete="off"
              aria-label="Where would you like to dive?"
              placeholder={searchPlaceholder}
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-[16px] text-text-primary placeholder:text-text-secondary focus:outline-none"
            />
            <Image src="/assets/icon-search.svg" alt="" aria-hidden="true" width={15} height={15} className="size-[15px] shrink-0" />
          </form>
          <button type="button" onClick={() => setMobileOpen(false)} className="shrink-0 text-button-small uppercase text-text-primary">
            Cancel
          </button>
        </div>

        <ul aria-label="Destinations" className="flex min-h-0 flex-1 flex-col overflow-y-auto divide-y divide-border-default page-gutter-x">
          {filterDestinations(destinations, mobileQuery).map((dest) => (
            <li key={dest._id}>
              <button type="button" onClick={() => selectMobileDestination(dest.name ?? '')} className="flex w-full items-baseline gap-8 py-16 text-left">
                <span className="shrink-0 whitespace-nowrap text-body-medium text-text-primary">{dest.name}</span>
                <span className="min-w-0 truncate text-caption-label text-text-secondary">{dest.tagline}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
