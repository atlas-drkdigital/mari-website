'use client'

import Image from 'next/image'

import { useDragScroll } from '@/lib/useDragScroll'
import { sanityImageProps } from '@/sanity/lib/image'
import type { HomePageData, LatestPostData } from '@/sanity/queries'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// Deterministic (UTC) so server and client render identical markup — no hydration mismatch.
function formatDate(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

// Ported from ../v1-static-homepage/sections/latest-articles.html + assets/latest-articles.js.
// Figma Section/LatestArticles 400:733. The three most recent blog posts are pulled from Sanity
// (full-wire slice, 2026-07-16) — no hardcoded fallback.
export function LatestArticles({ home, posts }: { home: HomePageData | null; posts: LatestPostData[] }) {
  const eyebrow = home?.latestArticlesEyebrow ?? ''
  const heading = home?.latestArticlesHeading ?? ''
  const linkText = home?.latestArticlesLinkText ?? ''
  const articles = (posts ?? []).map((p) => ({
    key: p._id,
    imageProps: sanityImageProps(p.coverImage, '/assets/blog-raja-ampat-guide.webp'),
    alt: p.coverImage?.alt ?? '',
    category: p.category ?? '',
    date: formatDate(p.postDate),
    title: p.title ?? '',
  }))

  const trackRef = useDragScroll<HTMLDivElement>()

  // No published posts means no section — hide it rather than render a heading over an empty track
  // (graceful degradation; seeded content means this shouldn't happen in practice). Must sit below
  // the hook above — an early return before it would change hook order between renders.
  if (articles.length === 0) return null

  return (
    <section id="latest-articles" aria-labelledby="latest-articles-heading" className="w-full bg-bg-page pt-80 pb-80 lg:pt-160 lg:pb-160">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-[36px] page-gutter-x lg:gap-64">
        <div data-reveal="left" className="flex flex-col gap-24 lg:gap-32">
          <p className="text-eyebrow uppercase text-action-primary">{eyebrow}</p>
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:gap-48">
            <h2 id="latest-articles-heading" className="mr-[40px] max-w-[640px] text-display-h2 text-text-primary lg:mr-0">{heading}</h2>
            <a href="#" className="group inline-flex h-48 w-fit shrink-0 items-center gap-4 border border-action-primary px-20 py-8 text-button-small uppercase text-action-primary transition-colors duration-300 ease-in-out hover:bg-action-primary/10 lg:ml-auto">
              {linkText}
              <span aria-hidden="true" className="block size-[12px] shrink-0 bg-action-primary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] [mask-image:url('/assets/icon-arrow.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </a>
          </div>
        </div>

        <div
          ref={trackRef}
          data-reveal
          className="flex w-full cursor-grab snap-x snap-mandatory gap-16 overflow-x-auto pb-4 select-none [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden lg:cursor-auto lg:select-auto lg:gap-32 lg:overflow-visible lg:pb-0"
        >
          {articles.map((article) => (
            <article key={article.key} className="group/card w-[84%] shrink-0 snap-center lg:w-auto lg:flex-1">
              <a href="#" className="flex flex-col gap-32">
                <div className="relative aspect-[348/362] w-full overflow-hidden">
                  <Image {...article.imageProps} alt={article.alt} fill sizes="(min-width: 1024px) 33vw, 84vw" className="object-cover transition-transform duration-700 ease-in-out group-hover/card:scale-105" />
                </div>
                <div className="flex flex-col gap-12">
                  <div className="flex items-center gap-4 text-caption-label text-action-primary">
                    <span className="flex items-center gap-2"><span aria-hidden="true">&#10022;</span>{article.category}</span>
                    <span className="ml-auto">{article.date}</span>
                  </div>
                  <h3 className="text-display-h4 text-text-primary">{article.title}</h3>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
