'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { DESTINATIONS } from '@/lib/destinations'

// Ported from ../v1-static-homepage/sections/nav.html + assets/nav.js + assets/mega-menu.js.
// Figma Block/Navbar 218:1231. DESKTOP (>=lg/1024px) = exact Figma overlay. MOBILE (<lg) =
// compact bar (wordmark + hamburger) opening a full-screen menu overlay — no mobile Figma
// frame exists for nav yet, this is a placeholder convention (see CLAUDE.md/MANAGER.md).
//
// data-nav on <header> drives a 3-state theme ("top" | "mega" | "light") so the scroll-flip
// and mega-menu header-darkening cooperate through one value instead of fighting over
// bg/text classes directly — mirrors the original nav.js/mega-menu.js contract exactly.
type NavTheme = 'top' | 'mega' | 'light'
type MegaKey = 'destinations' | 'resources' | null

const RESOURCE_LINKS = ['Blog', 'Terms & Conditions', 'Onboard Prices', 'FAQ']

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState<MegaKey>(null)
  const [activeDestination, setActiveDestination] = useState(DESTINATIONS[0].id)
  const [destListRevealed, setDestListRevealed] = useState(false)
  const [scrollHint, setScrollHint] = useState<'more' | 'top' | 'none'>('none')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileAccordion, setMobileAccordion] = useState({ destinations: false, resources: false })

  const navRef = useRef<HTMLElement>(null)
  const destListRef = useRef<HTMLUListElement>(null)

  const navTheme: NavTheme = megaOpen ? 'mega' : scrolled ? 'light' : 'top'

  // Scroll-based theme flip — fixed distance, not tied to hero height (see nav.js's own comment
  // on why: waiting for the full hero to clear read as unresponsive on a near-full-viewport hero).
  useEffect(() => {
    const recompute = () => {
      const isMobile = window.innerWidth < 1024
      setScrolled(window.scrollY > (isMobile ? 40 : 80))
    }
    recompute()
    window.addEventListener('scroll', recompute, { passive: true })
    window.addEventListener('resize', recompute)
    return () => {
      window.removeEventListener('scroll', recompute)
      window.removeEventListener('resize', recompute)
    }
  }, [])

  // Mobile menu: lock background scroll while open, close on Escape.
  useEffect(() => {
    document.documentElement.classList.toggle('overflow-hidden', mobileMenuOpen)
    if (!mobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileMenuOpen])

  // Desktop mega menus: replay the destination list's slide-in on open. Closing (whichever
  // path triggers it) always goes through closeMega, which resets the reveal state directly
  // in the event handler rather than reacting to megaOpen here.
  useEffect(() => {
    if (megaOpen !== 'destinations') return
    const raf = requestAnimationFrame(() => setDestListRevealed(true))
    return () => cancelAnimationFrame(raf)
  }, [megaOpen])

  const closeMega = useCallback(() => {
    setMegaOpen(null)
    setDestListRevealed(false)
  }, [])

  useEffect(() => {
    if (!megaOpen) return
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeMega()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMega()
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [megaOpen, closeMega])

  // Destination list scroll-for-more / scroll-to-top hint — see nav.html's original comment
  // above these two divs for the full rationale.
  const updateScrollHint = useCallback(() => {
    const list = destListRef.current
    if (!list) return
    const hasOverflow = list.scrollHeight > list.clientHeight + 1
    if (!hasOverflow) {
      setScrollHint('none')
      return
    }
    const atBottom = list.scrollTop >= list.scrollHeight - list.clientHeight - 1
    setScrollHint(atBottom ? 'top' : 'more')
  }, [])

  useEffect(() => {
    if (megaOpen !== 'destinations') return
    const raf = requestAnimationFrame(updateScrollHint)
    window.addEventListener('resize', updateScrollHint)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', updateScrollHint)
    }
  }, [megaOpen, updateScrollHint])

  const toggleMobileAccordion = (key: 'destinations' | 'resources') =>
    setMobileAccordion((prev) => ({ ...prev, [key]: !prev[key] }))

  const toggleMega = (key: 'destinations' | 'resources') => {
    if (megaOpen === key) {
      closeMega()
      return
    }
    if (key === 'destinations') setActiveDestination(DESTINATIONS[0].id)
    setMegaOpen(key)
  }

  // Next.js's <Link> only resets scroll on an actual route change — clicking "home" while
  // already on "/" (the only route that exists so far) is a no-op with no visible effect,
  // which reads as "the home link doesn't work." Force scroll-to-top explicitly so it always
  // behaves like "home" regardless of current route; harmless once other pages exist too.
  const goHome = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <header
      ref={navRef}
      data-nav={navTheme}
      className="group/nav fixed inset-x-0 top-0 z-50 w-full text-accent-ondark-onprimary data-[nav=light]:bg-bg-page data-[nav=light]:text-text-primary data-[nav=light]:shadow-[0_1px_0_0_rgb(0_0_0/0.06)] data-[nav=mega]:bg-background-ondark-muted"
    >
      {/* MOBILE bar (<lg): wordmark + hamburger */}
      <div className="flex items-center justify-between page-gutter-x py-8 lg:hidden">
        <Link href="/" onClick={goHome} aria-label="MariLiveaboard — home" className="text-caption-label uppercase tracking-[0.238em]">
          <span className="font-bold">Mari</span>
          <span className="font-medium">Liveaboard</span>
        </Link>
        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
          className="flex size-[40px] items-center justify-end"
        >
          <svg viewBox="2 5 20 14" fill="none" className="size-[17px]" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* DESKTOP (>=lg): exact Figma two-row nav */}
      <div className="hidden lg:block">
        <div className="flex items-center border-b-[0.25px] border-accent-ondark-onprimary page-gutter-x py-16 group-data-[nav=light]/nav:border-border-default">
          <div className="flex w-[480px] items-center">
            <Link
              href="/"
              onClick={goHome}
              aria-label="MariLiveaboard — home"
              className="inline-flex items-center opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100"
            >
              <span
                aria-hidden="true"
                className="block h-[15px] w-[17px] shrink-0 bg-accent-ondark-onprimary group-data-[nav=light]/nav:bg-text-primary [mask-image:url('/assets/icon-lang.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
              />
            </Link>
          </div>

          <Link href="/" onClick={goHome} aria-label="MariLiveaboard — home" className="flex-1 text-center text-caption-label uppercase tracking-[0.238em]">
            <span className="font-bold">Mari</span>
            <span className="font-medium">Liveaboard</span>
          </Link>

          <div className="flex w-[480px] items-center justify-end gap-20">
            <a href="mailto:hello@mariliveaboard.com" aria-label="Email us" className="inline-flex opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">
              <span aria-hidden="true" className="block size-[16px] shrink-0 bg-accent-ondark-onprimary group-data-[nav=light]/nav:bg-text-primary [mask-image:url('/assets/icon-email.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </a>
            <a href="#" aria-label="Chat on WhatsApp" className="inline-flex opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">
              <span aria-hidden="true" className="block size-[15px] shrink-0 bg-accent-ondark-onprimary group-data-[nav=light]/nav:bg-text-primary [mask-image:url('/assets/icon-whatsapp.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </a>
            <a href="#" className="group inline-flex items-center gap-4 border border-accent-ondark-onprimary px-20 py-8 text-button-small uppercase hover:bg-accent-ondark-onprimary/10 group-data-[nav=light]/nav:border-text-primary group-data-[nav=light]/nav:hover:bg-text-primary/5">
              Find a trip
              <span aria-hidden="true" className="block size-[13px] shrink-0 bg-accent-ondark-onprimary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] group-data-[nav=light]/nav:bg-text-primary [mask-image:url('/assets/icon-arrow.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </a>
          </div>
        </div>

        <nav aria-label="Primary" className="flex items-center justify-center gap-32 border-b-[0.25px] border-transparent page-gutter-x py-12 group-data-[nav=mega]/nav:border-accent-ondark-onprimary">
          <button
            type="button"
            aria-expanded={megaOpen === 'destinations'}
            aria-controls="mega-menu-destinations"
            onClick={() => toggleMega('destinations')}
            className="group/mt inline-flex items-center gap-4 pb-4 opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100"
          >
            <span className="text-nav uppercase text-accent-ondark-onprimary group-data-[nav=light]/nav:text-text-primary group-aria-expanded/mt:text-accent-ondark-muted">Destinations</span>
            <span
              aria-hidden="true"
              className="block h-[6px] w-[7px] shrink-0 bg-accent-ondark-onprimary transition-transform duration-300 ease-in-out group-data-[nav=light]/nav:bg-text-primary group-aria-expanded/mt:bg-accent-ondark-muted group-aria-expanded/mt:rotate-180 [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
            />
          </button>
          <Link href="/boats/mari" className="pb-4 text-nav uppercase opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">The Boat</Link>
          <a href="#" className="pb-4 text-nav uppercase opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">Private Charters</a>
          <a href="#" className="pb-4 text-nav uppercase opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">About</a>
          <button
            type="button"
            aria-expanded={megaOpen === 'resources'}
            aria-controls="mega-menu-resources"
            onClick={() => toggleMega('resources')}
            className="group/mt inline-flex items-center gap-4 pb-4 opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100"
          >
            <span className="text-nav uppercase text-accent-ondark-onprimary group-data-[nav=light]/nav:text-text-primary group-aria-expanded/mt:text-accent-ondark-muted">Resources</span>
            <span
              aria-hidden="true"
              className="block h-[6px] w-[7px] shrink-0 bg-accent-ondark-onprimary transition-transform duration-300 ease-in-out group-data-[nav=light]/nav:bg-text-primary group-aria-expanded/mt:bg-accent-ondark-muted group-aria-expanded/mt:rotate-180 [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
            />
          </button>
          <a href="#" className="pb-4 text-nav uppercase opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">Schedule &amp; Rates</a>
        </nav>

        {/* Destinations mega menu — Figma Section/Nav/MegaMenu 326:3777 */}
        <div
          id="mega-menu-destinations"
          className={`fixed inset-x-0 top-[110px] bottom-0 ${megaOpen === 'destinations' ? 'flex' : 'hidden'} bg-background-ondark-muted`}
        >
          <div className="flex h-full w-full">
            <div className="relative h-full w-[440px] shrink-0 page-gutter-l pr-64 pb-48 pt-64">
              <ul
                ref={destListRef}
                onScroll={updateScrollHint}
                aria-label="Destinations"
                data-reveal="left"
                {...(destListRevealed ? { 'data-revealed': '' } : {})}
                className="flex h-full flex-col overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {DESTINATIONS.map((dest, i) => {
                  const active = dest.id === activeDestination
                  return (
                    <li key={dest.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveDestination(dest.id)}
                        onFocus={() => setActiveDestination(dest.id)}
                        className="flex w-full flex-col gap-2 py-12 text-left"
                      >
                        <span className={`text-nav-large transition-colors duration-300 ease-in-out ${active ? 'text-accent-ondark-muted' : 'text-text-ondark-primary'}`}>{dest.name}</span>
                        <span className={`text-caption-label transition-colors duration-300 ease-in-out ${active ? 'text-text-ondark-primary' : 'text-text-ondark-primary/40'}`}>{dest.tagline}</span>
                      </button>
                      {i < DESTINATIONS.length - 1 && <div className="h-[0.5px] w-full bg-accent-ondark-onprimary/15" />}
                    </li>
                  )
                })}
              </ul>

              <button
                type="button"
                aria-label="Scroll to see more destinations"
                tabIndex={scrollHint === 'more' ? 0 : -1}
                onClick={() => destListRef.current?.scrollTo({ top: destListRef.current.scrollHeight, behavior: 'smooth' })}
                className={`absolute inset-x-0 bottom-0 flex h-96 items-end justify-center bg-gradient-to-t from-background-ondark-muted to-background-ondark-muted/0 pb-16 transition-opacity duration-300 ease-in-out ${scrollHint === 'more' ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              >
                <span className="flex items-center gap-4 text-caption-label uppercase tracking-[1.5px] text-text-ondark-primary">
                  Scroll for more
                  <span aria-hidden="true" className="block size-[10px] shrink-0 bg-text-ondark-primary [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
                </span>
              </button>
              <button
                type="button"
                aria-label="Scroll back to top of destinations"
                tabIndex={scrollHint === 'top' ? 0 : -1}
                onClick={() => destListRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`absolute inset-x-0 top-0 flex h-96 items-start justify-center bg-gradient-to-b from-background-ondark-muted to-background-ondark-muted/0 pt-16 transition-opacity duration-300 ease-in-out ${scrollHint === 'top' ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              >
                <span className="flex items-center gap-4 text-caption-label uppercase tracking-[1.5px] text-text-ondark-primary">
                  Scroll to top
                  <span aria-hidden="true" className="block size-[10px] shrink-0 rotate-180 bg-text-ondark-primary [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
                </span>
              </button>
            </div>

            <div className="h-full shrink-0 py-48">
              <div className="h-full w-[0.5px] bg-accent-ondark-onprimary/[0.07]" />
            </div>

            <div className="relative h-full flex-1 overflow-hidden">
              {DESTINATIONS.map((dest) => (
                <Image
                  key={dest.id}
                  src={dest.image}
                  alt={dest.alt}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className={`object-cover [transition:opacity_700ms_ease-in-out,transform_1100ms_ease-in-out_150ms] ${dest.id === activeDestination ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}

              <div className="absolute inset-x-0 bottom-0 h-[160px] bg-gradient-to-t from-background-ondark-muted/90 to-transparent" />

              {DESTINATIONS.map((dest) => (
                <div
                  key={dest.id}
                  className={`absolute bottom-32 page-gutter-inset-r flex flex-col items-end gap-4 text-right transition-opacity duration-300 ease-in-out ${dest.id === activeDestination ? 'opacity-100' : 'opacity-0'}`}
                >
                  <span className="text-nav-xl text-text-ondark-primary">{dest.name}</span>
                  <span className="text-caption-label text-text-ondark-primary/55">{dest.seasonNights}</span>
                </div>
              ))}

              <button
                type="button"
                aria-label="Close destinations menu"
                onClick={() => closeMega()}
                className="absolute page-gutter-inset-r top-24 inline-flex items-center gap-4 rounded-full bg-background-ondark-muted/70 px-16 py-8 text-caption-label uppercase tracking-[1.5px] text-text-ondark-primary transition-colors duration-300 ease-in-out hover:bg-background-ondark-muted/90"
              >
                Close
                <Image src="/assets/icon-close.svg" alt="" aria-hidden="true" width={14} height={14} className="size-[14px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Resources mega menu — no Figma spec, "consistent but creative" no-image variant */}
        <div
          id="mega-menu-resources"
          className={`fixed inset-x-0 top-[110px] bottom-0 ${megaOpen === 'resources' ? 'flex' : 'hidden'} bg-background-ondark-muted`}
        >
          <div className="flex h-full w-full items-center">
            <div className="w-[440px] shrink-0 page-gutter-l pr-64">
              <ul aria-label="Resources" data-reveal="left" data-revealed="" className="flex flex-col">
                {RESOURCE_LINKS.map((label, i) => (
                  <li key={label}>
                    <button type="button" className="flex w-full py-24 text-left">
                      <span className="text-nav-large text-text-ondark-primary transition-colors duration-300 ease-in-out hover:text-accent-ondark-muted">{label}</span>
                    </button>
                    {i < RESOURCE_LINKS.length - 1 && <div className="h-[0.5px] w-full bg-accent-ondark-onprimary/15" />}
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-full shrink-0 py-48">
              <div className="h-full w-[0.5px] bg-accent-ondark-onprimary/[0.07]" />
            </div>

            <div className="relative flex h-full flex-1 items-center overflow-hidden px-64">
              <div className="flex max-w-[520px] flex-col gap-16">
                <p className="text-eyebrow uppercase text-accent-ondark-muted">Before You Set Sail</p>
                <h3 className="text-editorial-h1 text-text-ondark-primary">Plan your voyage with confidence.</h3>
                <p className="text-body-large text-text-ondark-primary/55">Pricing, policies, and everything else you need to know before you set sail — all in one place.</p>
              </div>

              <button
                type="button"
                aria-label="Close resources menu"
                onClick={() => closeMega()}
                className="absolute page-gutter-inset-r top-24 inline-flex items-center gap-4 rounded-full bg-background-ondark-muted/70 px-16 py-8 text-caption-label uppercase tracking-[1.5px] text-text-ondark-primary transition-colors duration-300 ease-in-out hover:bg-background-ondark-muted/90"
              >
                Close
                <Image src="/assets/icon-close.svg" alt="" aria-hidden="true" width={14} height={14} className="size-[14px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE menu overlay (<lg) */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[60] ${mobileMenuOpen ? 'flex' : 'hidden'} flex-col overflow-y-auto bg-background-ondark-muted text-accent-ondark-onprimary lg:hidden`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between border-b-[0.25px] border-accent-ondark-onprimary page-gutter-x py-8">
          <Link
            href="/"
            onClick={() => {
              goHome()
              setMobileMenuOpen(false)
            }}
            aria-label="MariLiveaboard — home"
            className="text-caption-label uppercase tracking-[0.238em]"
          >
            <span className="font-bold">Mari</span>
            <span className="font-medium">Liveaboard</span>
          </Link>
          <button type="button" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="flex size-[40px] items-center justify-end">
            <svg viewBox="5 5 14 14" fill="none" className="size-[10px]" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav aria-label="Primary" className="flex flex-col page-gutter-x">
          <div className="border-b-[0.25px] border-accent-ondark-onprimary/15">
            <button
              type="button"
              aria-expanded={mobileAccordion.destinations}
              aria-controls="mobile-mega-destinations"
              onClick={() => toggleMobileAccordion('destinations')}
              className="flex w-full items-center justify-between py-16 text-left"
            >
              <span className={`text-nav uppercase transition-colors duration-300 ease-in-out ${mobileAccordion.destinations ? 'text-accent-ondark-muted' : 'text-text-ondark-primary'}`}>Destinations</span>
              <span
                aria-hidden="true"
                className={`block h-[8px] w-[10px] shrink-0 transition-[background-color,transform] duration-300 ease-in-out [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${mobileAccordion.destinations ? 'rotate-180 bg-accent-ondark-muted' : 'bg-text-ondark-primary'}`}
              />
            </button>
            {/* Same grid-rows 0fr/1fr animated-height pattern as FAQ.tsx — overflow-hidden lives on
                the inner content (not this grid wrapper), so its own bottom padding collapses away
                too when the row animates to 0fr, matching the established, proven approach. */}
            <div className={`grid [transition:grid-template-rows_500ms_cubic-bezier(0.65,0,0.35,1)] ${mobileAccordion.destinations ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <ul id="mobile-mega-destinations" aria-label="Destinations" className="flex flex-col divide-y divide-accent-ondark-onprimary/10 overflow-hidden pb-16">
                {DESTINATIONS.map((dest) => (
                  <li key={dest.id}>
                    <button type="button" className="flex w-full flex-col gap-2 py-12 text-left">
                      <span className="text-nav-large text-text-ondark-primary">{dest.name}</span>
                      <span className="text-caption-label text-text-ondark-primary/40">{dest.tagline}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link href="/boats/mari" onClick={() => setMobileMenuOpen(false)} className="border-b-[0.25px] border-accent-ondark-onprimary/15 py-16 text-nav uppercase text-text-ondark-primary opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">The Boat</Link>
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="border-b-[0.25px] border-accent-ondark-onprimary/15 py-16 text-nav uppercase text-text-ondark-primary opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">Private Charters</a>
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="border-b-[0.25px] border-accent-ondark-onprimary/15 py-16 text-nav uppercase text-text-ondark-primary opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">About</a>

          <div className="border-b-[0.25px] border-accent-ondark-onprimary/15">
            <button
              type="button"
              aria-expanded={mobileAccordion.resources}
              aria-controls="mobile-mega-resources"
              onClick={() => toggleMobileAccordion('resources')}
              className="flex w-full items-center justify-between py-16 text-left"
            >
              <span className={`text-nav uppercase transition-colors duration-300 ease-in-out ${mobileAccordion.resources ? 'text-accent-ondark-muted' : 'text-text-ondark-primary'}`}>Resources</span>
              <span
                aria-hidden="true"
                className={`block h-[8px] w-[10px] shrink-0 transition-[background-color,transform] duration-300 ease-in-out [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${mobileAccordion.resources ? 'rotate-180 bg-accent-ondark-muted' : 'bg-text-ondark-primary'}`}
              />
            </button>
            <div className={`grid [transition:grid-template-rows_500ms_cubic-bezier(0.65,0,0.35,1)] ${mobileAccordion.resources ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <ul id="mobile-mega-resources" aria-label="Resources" className="flex flex-col divide-y divide-accent-ondark-onprimary/10 overflow-hidden pb-16">
                {RESOURCE_LINKS.map((label) => (
                  <li key={label}>
                    <button type="button" className="flex w-full py-12 text-left">
                      <span className="text-nav-large text-text-ondark-primary">{label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a href="#" onClick={() => setMobileMenuOpen(false)} className="py-16 text-nav uppercase text-text-ondark-primary opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">Schedule &amp; Rates</a>
        </nav>

        <div className="flex flex-wrap items-center gap-16 border-t-[0.25px] border-accent-ondark-onprimary page-gutter-x py-24">
          <div className="flex items-center gap-20">
            <button type="button" aria-label="Select language" className="inline-flex items-center opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">
              <span aria-hidden="true" className="block h-[15px] w-[17px] shrink-0 bg-accent-ondark-primary [mask-image:url('/assets/icon-lang.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </button>
            <a href="mailto:hello@mariliveaboard.com" aria-label="Email us" className="inline-flex opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">
              <span aria-hidden="true" className="block size-[16px] shrink-0 bg-accent-ondark-primary [mask-image:url('/assets/icon-email.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </a>
            <a href="#" aria-label="Chat on WhatsApp" className="inline-flex opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">
              <span aria-hidden="true" className="block size-[15px] shrink-0 bg-accent-ondark-primary [mask-image:url('/assets/icon-whatsapp.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </a>
          </div>
          <a href="#" className="group flex h-48 w-full items-center justify-center gap-4 border border-accent-ondark-primary px-20 py-8 text-button-small uppercase text-accent-ondark-primary transition-colors duration-300 ease-in-out hover:bg-accent-ondark-primary/10">
            <span>Find a trip</span>
            <span aria-hidden="true" className="block size-[13px] shrink-0 bg-accent-ondark-primary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] [mask-image:url('/assets/icon-arrow.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
          </a>
        </div>
      </div>
    </header>
  )
}
