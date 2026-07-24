'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { DESTINATIONS } from '@/lib/destinations'
import { DESKTOP_MIN_WIDTH, NAV_FLIP_SCROLL_Y, navChrome } from '@/lib/navScroll'

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

// lightHero (2026-07-24): for pages whose
// hero is a LIGHT band (no photo), the nav at the top of the page uses the LIGHT theme's colors
// (dark text) but a TRANSPARENT background, flipping to the normal solid light bar on scroll.
// Implemented as a second data attribute (data-navbg = clear|solid) CHAINED with data-nav=light
// on the bg/shadow classes — chained data variants, NOT class-order overrides (order in the class
// attribute does not control the cascade). Without the prop, navbg is always 'solid', so every
// existing page behaves byte-identically.
// FIRST REAL CONSUMER: the generic simple-page route `src/app/[slug]/page.tsx` — /terms today,
// Onboard Prices next. Its SimplePageHero is a flat light band with no photo, which is exactly the
// case this variant was built for.
// HISTORY: /booking (Schedule & Rates) consumed this for exactly one day — built 2026-07-24 with
// a light-texture hero, moved to a photo hero at QA the same day and back to the standard
// dark-over-photo <Nav />. The infrastructure was kept unused for a few hours until /terms landed.
export function Nav({ lightHero = false }: { lightHero?: boolean } = {}) {
  // Current route, for the aria-current active state on menu links (Adinda, 2026-07-21).
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState<MegaKey>(null)
  const [activeDestination, setActiveDestination] = useState(DESTINATIONS[0].id)
  const [destListRevealed, setDestListRevealed] = useState(false)
  const [scrollHint, setScrollHint] = useState<'more' | 'top' | 'none'>('none')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileAccordion, setMobileAccordion] = useState({ destinations: false, resources: false })
  // Auto-hide (Adinda, 2026-07-21, revised same day): NO scroll-direction logic. On desktop, the
  // nav is simply hidden the whole time a SubNav is floating (that bar carries brand + sections +
  // Find a Trip, so nothing essential is lost) and returns when the visitor is back near the top.
  // The earlier scroll-up-reveal variant produced a 3-row stack Adinda rejected — don't rebuild it.
  const [isDesktop, setIsDesktop] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const destListRef = useRef<HTMLUListElement>(null)

  // COMPACT mode (Adinda, 2026-07-21 — the two-row floating chrome): while a SubNav is floating
  // on this page (desktop), the nav's two rows collapse into ONE — Mari wordmark · the same menu
  // items · Find a Trip (no email/WhatsApp icons) — and the floating SubNav row sits beneath it.
  // An open mega temporarily restores the full nav (the mega panels are laid out against it);
  // subNavFloating turns itself off near the top of the page and on pages without a SubNav, which
  // is what brings the full nav back. No scroll-direction logic — deliberately (a scroll-up
  // reveal variant produced a 3-row stack and was rejected).
  // COMPACT triggers at the ordinary FLIP THRESHOLD, not at the rail hand-off (Adinda,
  // 2026-07-21 final revision): on a sub-nav page the nav goes STRAIGHT from its transparent
  // dark form to the compact light row as soon as you scroll — a transparent full nav overlaying
  // scrolled hero content was a mess, and flipping to the full light nav first was the dizzying
  // extra costume. The floating SubNav row joins later, once the hero's static rail passes out
  // of view (SubNav's own boundary) — so the section anchors always live in exactly ONE place.
  const { subNavPresent } = useSyncExternalStore(navChrome.subscribe, navChrome.get, navChrome.getServer)
  const navCompact = isDesktop && subNavPresent && scrolled && !megaOpen && !mobileMenuOpen

  // Theme: compact = the natural LIGHT bar (a navy first row made the main nav the loudest thing
  // on screen — backwards; the navy lives on the SubNav row). Pages without a SubNav, and mobile,
  // keep the ordinary scrolled flip.
  const navTheme: NavTheme =
    megaOpen ? 'mega'
    : navCompact ? 'light'
    : scrolled && !(isDesktop && subNavPresent) ? 'light'
    : lightHero ? 'light'
    : 'top'

  // Transparent-over-light-hero state (see the lightHero comment above): dark text with no bar
  // ONLY while sitting at the top of a lightHero page with nothing open; every other state keeps
  // the solid light bar. Mobile included — dark text over the texture at the top, same flip.
  const navBg: 'clear' | 'solid' =
    lightHero && !scrolled && !megaOpen && !mobileMenuOpen ? 'clear' : 'solid'

  // Scroll-based theme flip — fixed distance, not tied to hero height (see nav.js's own comment
  // on why: waiting for the full hero to clear read as unresponsive on a near-full-viewport hero).
  useEffect(() => {
    const recompute = () => {
      const isMobile = window.innerWidth < DESKTOP_MIN_WIDTH
      setScrolled(window.scrollY > (isMobile ? NAV_FLIP_SCROLL_Y.mobile : NAV_FLIP_SCROLL_Y.desktop))
      setIsDesktop(!isMobile)
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

  // The six primary menu items + the Find a Trip CTA — defined ONCE, rendered by BOTH the full
  // two-row nav and the compact single row (Adinda, 2026-07-21), so the two states can never
  // drift. Every colour variant keys off the header's data-nav group, so the same markup adapts
  // in either container.
  const findATripCta = (
    <a href="#" className="group inline-flex shrink-0 items-center gap-4 border border-accent-ondark-onprimary px-20 py-8 text-button-small uppercase hover:bg-accent-ondark-onprimary/10 group-data-[nav=light]/nav:border-text-primary group-data-[nav=light]/nav:hover:bg-text-primary/5">
      Find a trip
      <span aria-hidden="true" className="block size-[13px] shrink-0 bg-accent-ondark-onprimary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] group-data-[nav=light]/nav:bg-text-primary [mask-image:url('/assets/icon-arrow.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
    </a>
  )
  const menuItems = (
    <>
      <button
        type="button"
        aria-expanded={megaOpen === 'destinations'}
        aria-controls="mega-menu-destinations"
        onClick={() => toggleMega('destinations')}
        className="group/mt inline-flex items-center gap-4 pb-4 opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100"
      >
        {/* Hover accent needs the stacked light-mode variant twice over: the span carries an
            EXPLICIT light-mode colour, and the light-mode hover token differs (chocolate
            action-primary, not amber — see the menu-link comment). */}
        <span className="text-nav uppercase text-accent-ondark-onprimary transition-colors duration-300 ease-in-out group-hover/mt:text-accent-ondark-primary group-data-[nav=light]/nav:text-text-primary group-data-[nav=light]/nav:group-hover/mt:text-action-primary group-aria-expanded/mt:text-accent-ondark-muted">Destinations</span>
        <span
          aria-hidden="true"
          className="block h-[6px] w-[7px] shrink-0 bg-accent-ondark-onprimary transition-[transform,background-color] duration-300 ease-in-out group-hover/mt:bg-accent-ondark-primary group-data-[nav=light]/nav:bg-text-primary group-data-[nav=light]/nav:group-hover/mt:bg-action-primary group-aria-expanded/mt:bg-accent-ondark-muted group-aria-expanded/mt:rotate-180 [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
        />
      </button>
      {/* Menu-link hover + active-page accent (Adinda, 2026-07-21 — the old opacity 85→100
          shift was too subtle to read as a hover at all). TWO tokens by nav state, per the
          palette's own split: dark nav → accent-ondark-primary (amber gold); light/floated
          nav → action-primary (chocolate — the established light-background interactive
          accent, same as the Specs tabs). Amber was wrong on the light bar — Adinda's catch.
          The light-mode compound variants out-specify the base hover classes, so they win. */}
      <Link
        href="/boats/mari"
        aria-current={pathname?.startsWith('/boats') ? 'page' : undefined}
        className="pb-4 text-nav uppercase opacity-85 transition-[color,opacity] duration-300 ease-in-out hover:text-accent-ondark-primary hover:opacity-100 aria-[current=page]:text-accent-ondark-primary aria-[current=page]:opacity-100 group-data-[nav=light]/nav:hover:text-action-primary group-data-[nav=light]/nav:aria-[current=page]:text-action-primary"
      >
        The Boat
      </Link>
      {/* Real route since the Private Charters slice (2026-07-23) — path pending Adinda's slug
          confirm, see src/app/private-charters/page.tsx. */}
      <a href="/private-charters" className="pb-4 text-nav uppercase opacity-85 transition-[color,opacity] duration-300 ease-in-out hover:text-accent-ondark-primary hover:opacity-100 group-data-[nav=light]/nav:hover:text-action-primary">Private Charters</a>
      <a href="/about" className="pb-4 text-nav uppercase opacity-85 transition-[color,opacity] duration-300 ease-in-out hover:text-accent-ondark-primary hover:opacity-100 group-data-[nav=light]/nav:hover:text-action-primary">About</a>
      <button
        type="button"
        aria-expanded={megaOpen === 'resources'}
        aria-controls="mega-menu-resources"
        onClick={() => toggleMega('resources')}
        className="group/mt inline-flex items-center gap-4 pb-4 opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100"
      >
        <span className="text-nav uppercase text-accent-ondark-onprimary transition-colors duration-300 ease-in-out group-hover/mt:text-accent-ondark-primary group-data-[nav=light]/nav:text-text-primary group-data-[nav=light]/nav:group-hover/mt:text-action-primary group-aria-expanded/mt:text-accent-ondark-muted">Resources</span>
        <span
          aria-hidden="true"
          className="block h-[6px] w-[7px] shrink-0 bg-accent-ondark-onprimary transition-[transform,background-color] duration-300 ease-in-out group-hover/mt:bg-accent-ondark-primary group-data-[nav=light]/nav:bg-text-primary group-data-[nav=light]/nav:group-hover/mt:bg-action-primary group-aria-expanded/mt:bg-accent-ondark-muted group-aria-expanded/mt:rotate-180 [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
        />
      </button>
      {/* Real route since the booking slice (2026-07-24) — /booking locked by Adinda. */}
      <a href="/booking" className="pb-4 text-nav uppercase opacity-85 transition-[color,opacity] duration-300 ease-in-out hover:text-accent-ondark-primary hover:opacity-100 group-data-[nav=light]/nav:hover:text-action-primary">Schedule &amp; Rates</a>
    </>
  )

  return (
    <header
      ref={navRef}
      data-nav={navTheme}
      data-navbg={navBg}
      /* bg + shadow are CHAINED on navbg=solid so the lightHero 'clear' state keeps the light
         theme's dark text without painting the bar (see the lightHero comment above). */
      className="group/nav fixed inset-x-0 top-0 z-50 w-full text-accent-ondark-onprimary data-[nav=light]:text-text-primary data-[nav=light]:data-[navbg=solid]:bg-bg-page data-[nav=light]:data-[navbg=solid]:shadow-[0_1px_0_0_rgb(0_0_0/0.06)] data-[nav=mega]:bg-background-ondark-muted"
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

      {/* DESKTOP (>=lg): the full two-row nav, OR — while a SubNav floats on this page — the
          COMPACT single row (Mari · menu items · Find a Trip; no email/WhatsApp icons), with the
          floating SubNav row directly beneath it (Adinda, 2026-07-21: two rows max, both
          designed). The mega panels below are shared by both forms; opening one restores the full
          nav while it's open (navCompact excludes megaOpen). */}
      <div className="hidden lg:block">
        {navCompact ? (
          /* h-48 (not padding-derived) so this row and the SubNav row below match exactly —
             Adinda's equal-heights call. No own bg: the header's light theme paints it. */
          <div className="flex h-48 items-center justify-between gap-32 page-gutter-x">
            <Link href="/" onClick={goHome} aria-label="MariLiveaboard — home" className="shrink-0 font-bold text-caption-label uppercase tracking-[0.238em]">
              Mari
            </Link>
            <nav aria-label="Primary" className="flex min-w-0 items-center gap-32">
              {menuItems}
            </nav>
            {findATripCta}
          </div>
        ) : (
          <>
        {/* Light-mode row separator: a shadow hairline IDENTICAL to the header's own bottom line
            (0_1px_0_0 black/6%), not border-border-default — the beige border read as a different
            colour than the greyish bottom hairline (Adinda, 2026-07-24: both lines one colour). */}
        {/* The row hairline is also chained on navbg=solid — in the lightHero 'clear' state a
            floating hairline over the hero texture would read as leftover chrome. */}
        <div className="flex items-center border-b-[0.25px] border-accent-ondark-onprimary page-gutter-x py-16 group-data-[nav=light]/nav:border-transparent group-data-[nav=light]/nav:group-data-[navbg=solid]/nav:shadow-[0_1px_0_0_rgb(0_0_0/0.06)]">
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
            <a href="mailto:hello@mari-liveaboard.com" aria-label="Email us" className="inline-flex opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">
              <span aria-hidden="true" className="block size-[16px] shrink-0 bg-accent-ondark-onprimary group-data-[nav=light]/nav:bg-text-primary [mask-image:url('/assets/icon-email.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </a>
            <a href="#" aria-label="Chat on WhatsApp" className="inline-flex opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">
              <span aria-hidden="true" className="block size-[15px] shrink-0 bg-accent-ondark-onprimary group-data-[nav=light]/nav:bg-text-primary [mask-image:url('/assets/icon-whatsapp.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </a>
            {findATripCta}
          </div>
        </div>

        <nav aria-label="Primary" className="flex items-center justify-center gap-32 border-b-[0.25px] border-transparent page-gutter-x py-12 group-data-[nav=mega]/nav:border-accent-ondark-onprimary">
          {menuItems}
        </nav>
          </>
        )}

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
                className="flex h-full flex-col overflow-y-auto scrollbar-hidden"
              >
                {DESTINATIONS.map((dest, i) => {
                  const active = dest.id === activeDestination
                  return (
                    <li key={dest.id}>
                      {/* Was a hover-only <button> — a Link since the destination page shipped
                          (2026-07-22, per the incremental link-wiring rule). Hover/focus still
                          drive the preview; click now actually navigates and closes the menu. */}
                      <Link
                        href={`/destinations/${dest.id}`}
                        onMouseEnter={() => setActiveDestination(dest.id)}
                        onFocus={() => setActiveDestination(dest.id)}
                        onClick={() => closeMega()}
                        className="flex w-full flex-col gap-2 py-12 text-left"
                      >
                        <span className={`text-nav-large transition-colors duration-300 ease-in-out ${active ? 'text-accent-ondark-muted' : 'text-text-ondark-primary'}`}>{dest.name}</span>
                        <span className={`text-caption-label transition-colors duration-300 ease-in-out ${active ? 'text-text-ondark-primary' : 'text-text-ondark-primary/40'}`}>{dest.tagline}</span>
                      </Link>
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
                {/* A promo tagline, not an outline node — a <p>, not a heading. As an <h3> it landed
                    before the page <h1> in DOM order, making the document's first heading an
                    out-of-order H3 on every page. Styling unchanged. */}
                <p className="text-editorial-h1 text-text-ondark-primary">Plan your voyage with confidence.</p>
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
            {/* Same grid-rows 0fr/1fr animated-height pattern as FAQ.tsx — with one structural rule
                learned the hard way (Android Chrome + large system font, 2026-07-21): the DIRECT
                grid item must carry `min-h-0 overflow-hidden` and NO padding — padding on the item
                joins its minimum size, so the 0fr row can't fully collapse and the closed accordion
                rows render taller than the plain links (scaled fonts make the leak visible).
                Padding lives one level deeper, where the collapse clips it. The FAQ never hit this
                because its collapsed child uses a margin, which doesn't join the minimum. */}
            <div className={`grid [transition:grid-template-rows_500ms_cubic-bezier(0.65,0,0.35,1)] ${mobileAccordion.destinations ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="min-h-0 overflow-hidden">
                <ul id="mobile-mega-destinations" aria-label="Destinations" className="flex flex-col divide-y divide-accent-ondark-onprimary/10 pb-16">
                {DESTINATIONS.map((dest) => (
                  <li key={dest.id}>
                    <Link href={`/destinations/${dest.id}`} onClick={() => setMobileMenuOpen(false)} className="flex w-full flex-col gap-2 py-12 text-left">
                      <span className="text-nav-large text-text-ondark-primary">{dest.name}</span>
                      <span className="text-caption-label text-text-ondark-primary/40">{dest.tagline}</span>
                    </Link>
                  </li>
                ))}
                </ul>
              </div>
            </div>
          </div>

          <Link href="/boats/mari" onClick={() => setMobileMenuOpen(false)} className="border-b-[0.25px] border-accent-ondark-onprimary/15 py-16 text-nav uppercase text-text-ondark-primary opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">The Boat</Link>
          <a href="/private-charters" onClick={() => setMobileMenuOpen(false)} className="border-b-[0.25px] border-accent-ondark-onprimary/15 py-16 text-nav uppercase text-text-ondark-primary opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">Private Charters</a>
          <a href="/about" onClick={() => setMobileMenuOpen(false)} className="border-b-[0.25px] border-accent-ondark-onprimary/15 py-16 text-nav uppercase text-text-ondark-primary opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">About</a>

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
            {/* min-h-0 + padding-one-level-deeper — same Android large-font collapse fix as the
                Destinations accordion above. */}
            <div className={`grid [transition:grid-template-rows_500ms_cubic-bezier(0.65,0,0.35,1)] ${mobileAccordion.resources ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="min-h-0 overflow-hidden">
                <ul id="mobile-mega-resources" aria-label="Resources" className="flex flex-col divide-y divide-accent-ondark-onprimary/10 pb-16">
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
          </div>

          <a href="/booking" onClick={() => setMobileMenuOpen(false)} className="py-16 text-nav uppercase text-text-ondark-primary opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">Schedule &amp; Rates</a>
        </nav>

        <div className="flex flex-wrap items-center gap-16 border-t-[0.25px] border-accent-ondark-onprimary page-gutter-x py-24">
          <div className="flex items-center gap-20">
            <button type="button" aria-label="Select language" className="inline-flex items-center opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">
              <span aria-hidden="true" className="block h-[15px] w-[17px] shrink-0 bg-accent-ondark-primary [mask-image:url('/assets/icon-lang.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </button>
            <a href="mailto:hello@mari-liveaboard.com" aria-label="Email us" className="inline-flex opacity-85 transition-opacity duration-300 ease-in-out hover:opacity-100">
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
