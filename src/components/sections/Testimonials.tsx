'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useDragScroll } from '@/lib/useDragScroll'

// Ported from ../v1-static-homepage/sections/testimonials.html + assets/testimonials.js.
// Figma Section/Testimonials 401:1852. Infinite/wrapping carousel (2026-07-15, at Adinda's
// request — originally linear/clamped): arrows hide entirely if the track has no overflow,
// otherwise always active and wrap at both ends via goTo's modulo (next past the last card
// goes to the first, and vice versa) rather than disabling. Not a seamless clone-based
// infinite scroll (cards don't visually continue past the real last/first) — a discrete wrap
// on arrow click, which is what was actually asked for.
// Only the 4 real reviews are ported — the original had 4 additional explicit TEST-ONLY
// placeholder cards (added solely to verify scroll-overflow behavior with more cards),
// deliberately not carried into this build since they were never real content.
// `text` is ONE continuous review — not a separate "excerpt" + "more" pair. The card shows it
// truncated (CSS line-clamp, 3 lines + ellipsis) by default; "Read more" removes the clamp to
// reveal the same paragraph in full, it does not append a second block of text below it.
const REVIEWS = [
  { name: 'Bruce H', date: '28 Jan, 2026', title: 'Top value for money', text: "We took an 11 day trip to Misool and Dampier. The crew and dive guides led by Ungke were very friendly and absolutely went out of their way to find the best sites for our group's interests, from mantas to muck diving. Food was fantastic, cabins were comfortable, and the whole trip felt like incredible value for what we experienced. Would book with Mari again in a heartbeat." },
  { name: 'Kerstin W', date: '28 May, 2024', title: 'Best crew ever for an amazing dive adventure', text: 'Very knowledgeable dive guides for all the different dive sites, with time for photo enthusiasts to get the shots they wanted without holding up the group. Briefings were thorough and the whole crew felt like family by the end of the trip. Highly recommend for anyone serious about their diving.' },
  { name: 'aline W', date: '02 Oct, 2019', title: 'Superb Komodo Cruise', text: "The dives were all more incredible than the last. The boat is in very good condition; nothing is missing. The crew is really attentive and clearly passionate about diving themselves, which made every briefing exciting. Meals were varied and delicious, and the itinerary hit all the highlights Komodo is famous for. Can't wait to sail with them again." },
  { name: 'Doralysa N', date: '07 Oct, 2023', title: 'Everything was just perfect', text: 'The staff was amazing—very professional and concerned about diving safety. The boat has all the dive amenities you could ask for, and the cabins were spotless and comfortable after long dive days. Every detail felt thought through, from the dive briefings to the food. This trip exceeded all my expectations.' },
]

// TEST-ONLY — added 2026-07-15 at Adinda's request, solely to verify carousel scroll/arrow
// behavior with more cards than fit in one view (same reason the static build once had 4 of
// these). NOT real content. Remove before launch / once real reviews fill this out — see
// MANAGER.md's QA log for this session.
const TEST_ONLY_REVIEWS: typeof REVIEWS = [
  { name: 'TEST — Card 5', date: '01 Jan, 2026', title: 'Scroll-overflow test card', text: 'Placeholder review text for testing carousel overflow and arrow behavior with more than four cards. Not real content — remove before launch.' },
  { name: 'TEST — Card 6', date: '01 Jan, 2026', title: 'Scroll-overflow test card', text: 'Placeholder review text for testing carousel overflow and arrow behavior with more than four cards. Not real content — remove before launch.' },
  { name: 'TEST — Card 7', date: '01 Jan, 2026', title: 'Scroll-overflow test card', text: 'Placeholder review text for testing carousel overflow and arrow behavior with more than four cards. Not real content — remove before launch.' },
  { name: 'TEST — Card 8', date: '01 Jan, 2026', title: 'Scroll-overflow test card', text: 'Placeholder review text for testing carousel overflow and arrow behavior with more than four cards. Not real content — remove before launch.' },
]

function StarRating() {
  return (
    <div className="mt-16 flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true" className="block size-[16px] shrink-0 bg-accent-ondark-primary [mask-image:url('/assets/icon-star.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
      ))}
    </div>
  )
}

export function Testimonials() {
  const trackRef = useDragScroll<HTMLDivElement>()
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [arrowsVisible, setArrowsVisible] = useState(false)
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const bodyRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const [titleLines, setTitleLines] = useState<Record<number, number>>({})
  const [bodyHeights, setBodyHeights] = useState<Record<number, { collapsed: number; full: number }>>({})

  // No reserved/fixed height anywhere — title and body sit flush with normal spacing. Instead,
  // the body's line-clamp count is chosen per card to compensate for however many lines the
  // title actually rendered (measured, not guessed), so every card's TOTAL title+body line count
  // — and therefore height — stays constant without ever padding empty space under a short title.
  //
  // Also measures both the clamped and full pixel height of the body text itself, so the wrapping
  // div's max-height can animate smoothly between them — -webkit-line-clamp itself still can't be
  // CSS-transitioned in any browser, so the clamp stays instant, but it's applied on a paragraph
  // sitting inside a max-height-animated wrapper: overflow-hidden clips whatever the paragraph is
  // instantly showing/hiding to the wrapper's currently-animating height, so what the user actually
  // SEES is a smooth reveal/collapse even though the underlying clamp change itself is instant.
  // These are pixel values because that's all getBoundingClientRect()/scrollHeight can return, but
  // they're measured fresh from the real rendered DOM every time this runs, not hardcoded — the
  // failure mode from the earlier min-h-[3.3rem] attempt (a number baked into source, disconnected
  // from whatever's actually rendered) doesn't apply to a value read live off the DOM itself.
  //
  // useLayoutEffect (not useEffect) so this resolves before the browser paints, avoiding a flash of
  // the wrong clamp/height; ResizeObserver re-measures automatically on any layout change (window
  // resize, breakpoint shift) rather than only once on mount.
  useLayoutEffect(() => {
    const measure = () => {
      const nextTitleLines: Record<number, number> = {}
      const nextBodyHeights: Record<number, { collapsed: number; full: number }> = {}
      titleRefs.current.forEach((el, i) => {
        if (!el) return
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || el.getBoundingClientRect().height
        nextTitleLines[i] = Math.max(1, Math.round(el.getBoundingClientRect().height / lineHeight))
      })
      bodyRefs.current.forEach((el, i) => {
        if (!el) return
        const clampLines = (nextTitleLines[i] ?? 1) >= 2 ? 2 : 3
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 0
        nextBodyHeights[i] = { collapsed: clampLines * lineHeight, full: el.scrollHeight }
      })
      setTitleLines(nextTitleLines)
      setBodyHeights(nextBodyHeights)
    }
    measure()
    const ro = new ResizeObserver(measure)
    titleRefs.current.forEach((el) => el && ro.observe(el))
    bodyRefs.current.forEach((el) => el && ro.observe(el))
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    // Arrows wrap at both ends (see goTo) rather than disabling, so all that's tracked here is
    // whether there's any overflow to scroll through at all.
    const update = () => setArrowsVisible(track.scrollWidth > track.clientWidth + 1)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goTo = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return

    // Check true scroll-boundary state directly first, not by comparing card positions — with
    // multiple cards visible per row (e.g. 4 on desktop), whichever card sits closest to the
    // track's left edge at max scroll is NOT the last card, so a "closest card index === last
    // index" check never actually triggers. Real scrollLeft-vs-max is reliable regardless of
    // how many cards fit in view.
    const maxScroll = track.scrollWidth - track.clientWidth
    if (dir === 1 && track.scrollLeft >= maxScroll - 1) {
      track.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }
    if (dir === -1 && track.scrollLeft <= 1) {
      track.scrollTo({ left: maxScroll, behavior: 'smooth' })
      return
    }

    const cards = Array.from(track.querySelectorAll('article'))
    const trackLeft = track.getBoundingClientRect().left
    let closest = 0
    let closestDist = Infinity
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - trackLeft)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    const next = Math.min(cards.length - 1, Math.max(0, closest + dir))
    cards[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="relative isolate w-full bg-bg-page pt-80 pb-80 lg:pt-160 lg:pb-[200px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--texture-light)] [background-size:720px_auto] bg-repeat opacity-20" />
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-[36px] page-gutter-x lg:gap-64">
        <div data-reveal="left" className="flex flex-col gap-24 lg:gap-32">
          <p className="text-eyebrow uppercase text-action-primary">Testimonials</p>
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:gap-48">
            <h2 id="testimonials-heading" className="mr-[40px] max-w-[640px] text-display-h2 text-text-primary lg:mr-0">What our guests think</h2>
            <a href="#" className="group inline-flex h-48 w-fit shrink-0 items-center gap-4 border border-action-primary px-20 py-8 text-button-small uppercase text-action-primary transition-colors duration-300 ease-in-out hover:bg-action-primary/10 lg:ml-auto">
              Read More
              <span aria-hidden="true" className="block size-[12px] shrink-0 bg-action-primary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] [mask-image:url('/assets/icon-arrow.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </a>
          </div>
        </div>

        <div className="relative">
          <div ref={trackRef} data-reveal className="flex w-full cursor-grab snap-x snap-mandatory items-start gap-16 overflow-x-auto pb-16 select-none [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden lg:gap-24">
            {[...REVIEWS, ...TEST_ONLY_REVIEWS].map((review, i) => (
              <article key={review.name} className="group/card w-[84%] shrink-0 snap-center bg-bg-surface p-24 shadow-[0px_4px_10px_rgba(44,37,34,0.2)] md:w-[calc(50%-8px)] md:snap-start lg:w-[calc(25%-18px)]">
                <div className="flex items-center gap-8">
                  <Image src="/assets/testimonial-avatar-placeholder.jpg" alt="" aria-hidden="true" width={49} height={49} className="size-[49px] shrink-0 rounded-full object-cover" />
                  <div className="flex flex-col text-text-primary">
                    <p className="text-body-large">{review.name}</p>
                    <p className="text-caption-label text-text-secondary">{review.date}</p>
                  </div>
                </div>
                <StarRating />
                {/* No height reservation — never clamped, title always shows in full, however many
                    lines it needs. The body paragraph below compensates by clamping to fewer lines
                    when this wraps to 2, so total height stays constant with no gap. */}
                <h3 ref={(el) => { titleRefs.current[i] = el }} className="mt-8 text-body-large font-bold text-text-primary">
                  {review.title}
                </h3>
                {/* -webkit-line-clamp itself still can't be CSS-transitioned, but this wrapper's
                    max-height can — animates between the measured clamped/full pixel heights (see
                    the useLayoutEffect above), and overflow-hidden clips the paragraph's instant
                    clamp change to whatever height is currently animating, so the reveal/collapse
                    reads as smooth even though the underlying clamp toggle itself is instant. Clamp
                    count compensates for however many lines the title measured to (2-line title →
                    2-line body, 1-line title → 3-line body), keeping total height constant. */}
                <div
                  className="mt-4 overflow-hidden [transition:max-height_500ms_cubic-bezier(0.65,0,0.35,1)]"
                  style={{ maxHeight: (expanded[i] ? bodyHeights[i]?.full : bodyHeights[i]?.collapsed) ?? 999 }}
                >
                  <p
                    ref={(el) => { bodyRefs.current[i] = el }}
                    className={`text-body-medium lg:text-body-large text-text-primary ${
                      expanded[i] ? '' : (titleLines[i] ?? 1) >= 2 ? 'line-clamp-2' : 'line-clamp-3'
                    }`}
                  >
                    {review.text}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))}
                  className="mt-4 inline-block text-body-medium lg:text-body-large font-bold text-text-secondary transition-colors duration-300 ease-in-out hover:text-text-primary"
                >
                  {expanded[i] ? 'Read less' : 'Read more'}
                </button>
              </article>
            ))}
          </div>

          {arrowsVisible && (
            <>
              <button
                type="button"
                onClick={() => goTo(-1)}
                aria-label="Previous testimonial"
                className="group absolute left-0 top-1/2 z-10 grid size-[36px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-bg-surface shadow-[0px_4px_10px_rgba(44,37,34,0.2)] transition-opacity duration-300 ease-in-out hover:opacity-85 lg:size-[52px]"
              >
                <span aria-hidden="true" className="block size-[16px] rotate-180 bg-text-primary transition-transform duration-300 ease-in-out group-hover:scale-105 [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
              </button>
              <button
                type="button"
                onClick={() => goTo(1)}
                aria-label="Next testimonial"
                className="group absolute right-0 top-1/2 z-10 grid size-[36px] -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-bg-surface shadow-[0px_4px_10px_rgba(44,37,34,0.2)] transition-opacity duration-300 ease-in-out hover:opacity-85 lg:size-[52px]"
              >
                <span aria-hidden="true" className="block size-[16px] bg-text-primary transition-transform duration-300 ease-in-out group-hover:scale-105 [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
