'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { useDragScroll } from '@/lib/useDragScroll'

// Ported from ../v1-static-homepage/sections/testimonials.html + assets/testimonials.js.
// Figma Section/Testimonials 401:1852. Linear carousel (not infinite, unlike Destinations) —
// arrows hide entirely if the track has no overflow, otherwise disable+fade at start/end.
// Only the 4 real reviews are ported — the original had 4 additional explicit TEST-ONLY
// placeholder cards (added solely to verify scroll-overflow behavior with more cards),
// deliberately not carried into this build since they were never real content.
const REVIEWS = [
  { name: 'Bruce H', date: '28 Jan, 2026', title: 'Top value for money', excerpt: 'We took an 11 day trip to Misool and Dampier. The crew and dive guides led by Ungke were very friendly and absolutely...', more: "went out of their way to find the best sites for our group's interests, from mantas to muck diving. Food was fantastic, cabins were comfortable, and the whole trip felt like incredible value for what we experienced. Would book with Mari again in a heartbeat." },
  { name: 'Kerstin W', date: '28 May, 2024', title: 'Best crew ever for an amazing dive adventure', excerpt: 'Very knowledgeable dive guides for all the different dive sites, with time for photo...', more: 'enthusiasts to get the shots they wanted without holding up the group. Briefings were thorough and the whole crew felt like family by the end of the trip. Highly recommend for anyone serious about their diving.' },
  { name: 'aline W', date: '02 Oct, 2019', title: 'Superb Komodo Cruise', excerpt: 'The dives were all more incredible than the last. The boat is in very good condition; nothing is missing. The crew is really...', more: "attentive and clearly passionate about diving themselves, which made every briefing exciting. Meals were varied and delicious, and the itinerary hit all the highlights Komodo is famous for. Can't wait to sail with them again." },
  { name: 'Doralysa N', date: '07 Oct, 2023', title: 'Everything was just perfect', excerpt: 'The staff was amazing—very professional and concerned about diving safety. The boat has all the dive amenities you...', more: 'could ask for, and the cabins were spotless and comfortable after long dive days. Every detail felt thought through, from the dive briefings to the food. This trip exceeded all my expectations.' },
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
  const [arrows, setArrows] = useState({ visible: false, atStart: true, atEnd: false })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const update = () => {
      const hasOverflow = track.scrollWidth > track.clientWidth + 1
      setArrows({
        visible: hasOverflow,
        atStart: track.scrollLeft <= 1,
        atEnd: track.scrollLeft >= track.scrollWidth - track.clientWidth - 1,
      })
    }
    update()
    track.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      track.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goTo = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
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
    cards[next]?.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'start' })
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
          <div ref={trackRef} data-reveal className="flex w-full cursor-grab snap-x snap-mandatory gap-16 overflow-x-auto pb-16 select-none [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden lg:gap-24">
            {REVIEWS.map((review, i) => (
              <article key={review.name} className="group/card w-[84%] shrink-0 snap-center bg-bg-surface p-24 shadow-[0px_4px_10px_rgba(44,37,34,0.2)] md:w-[calc(50%-8px)] md:snap-start lg:w-[calc(25%-18px)]">
                <div className="flex items-center gap-8">
                  <Image src="/assets/testimonial-avatar-placeholder.jpg" alt="" aria-hidden="true" width={49} height={49} className="size-[49px] shrink-0 rounded-full object-cover" />
                  <div className="flex flex-col text-text-primary">
                    <p className="text-body-large">{review.name}</p>
                    <p className="text-caption-label text-text-secondary">{review.date}</p>
                  </div>
                </div>
                <StarRating />
                <h3 className="mt-8 text-body-large font-bold text-text-primary">{review.title}</h3>
                <p className="mt-4 text-body-medium lg:text-body-large text-text-primary">{review.excerpt}</p>
                <div className={`grid [transition:grid-template-rows_500ms_cubic-bezier(0.65,0,0.35,1)] ${expanded[i] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <p className="mt-4 overflow-hidden text-body-medium lg:text-body-large text-text-primary">{review.more}</p>
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

          {arrows.visible && (
            <>
              <button
                type="button"
                onClick={() => goTo(-1)}
                disabled={arrows.atStart}
                aria-label="Previous testimonial"
                className="group absolute left-0 top-1/2 z-10 grid size-[36px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-bg-surface shadow-[0px_4px_10px_rgba(44,37,34,0.2)] transition-opacity duration-300 ease-in-out hover:opacity-85 disabled:pointer-events-none disabled:opacity-0 lg:size-[52px]"
              >
                <span aria-hidden="true" className="block size-[16px] rotate-180 bg-text-primary transition-transform duration-300 ease-in-out group-hover:scale-105 [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
              </button>
              <button
                type="button"
                onClick={() => goTo(1)}
                disabled={arrows.atEnd}
                aria-label="Next testimonial"
                className="group absolute right-0 top-1/2 z-10 grid size-[36px] -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-bg-surface shadow-[0px_4px_10px_rgba(44,37,34,0.2)] transition-opacity duration-300 ease-in-out hover:opacity-85 disabled:pointer-events-none disabled:opacity-0 lg:size-[52px]"
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
