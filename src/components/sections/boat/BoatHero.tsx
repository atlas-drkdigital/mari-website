import Image from 'next/image'
import Link from 'next/link'

import { HeroVideo } from '@/components/HeroVideo'
import { sanityImageProps } from '@/sanity/lib/image'
import type { BoatData } from '@/sanity/queries'

// Figma Page/Boat hero = 778:8706. Server Component — no interactivity.
//
// ⚠️ REBUILT 2026-07-17 after the first pass rendered wrong. The cause is worth keeping: the first
// version used INVENTED utility names (`text-beige-50`, `bg-navy-950/45`, `gap-x-40`, `py-120`).
// None of them exist in this theme, and Tailwind emits nothing for a class it doesn't know — so
// the text silently inherited dark navy on a bright photo, and the stats strip lost every gap and
// ran together as "CabinsGuestsBoat SizeCrew". Nothing errored; it just looked broken.
//   - Colours come from the SEMANTIC layer only (globals.css `@theme`). There is no `beige-*` or
//     `navy-*` utility. For text over a photo the family is `*-ondark-*` / `*-onimage-*`.
//   - The spacing scale is 0,2,4,8,12,16,20,24,32,48,64,80,96,128,160. There is NO 40 and NO 120.
// Read globals.css before adding a class here; don't pattern-match a name that "looks like" the
// palette.
//
// The meta strip renders `boat.stats` (Cabins / Guests / Boat Size / Crew), NOT Figma's
// Season / Duration / Minimum Skill Level: those are the DESTINATION page's fields, left in this
// frame by a copy-paste. Locked 2026-07-17 — the mockup's labels are wrong, the styling is right.
//
// The SubNav (778:8712) sits at the hero's bottom edge in Figma. It's step 3 and shared with the
// destination page, so it is NOT rendered here — the page composes it once it exists.
export function BoatHero({ boat }: { boat: BoatData }) {
  const stats = boat.stats ?? []

  return (
    <section
      id="boat-hero"
      aria-labelledby="boat-hero-heading"
      // MOBILE: justify-center — the homepage hero's model, which Adinda confirmed reads correctly
      // ("see how we position texts on mobile for the homepage's hero, we nailed that").
      // DESKTOP: justify-end — this hero is bottom-anchored by design; the SubNav lands at its
      // bottom edge in Figma.
      //
      // The previous attempt (justify-end everywhere + bigger pb) moved the content DOWN, not up:
      // once pt + content + pb exceeds min-h-dvh, justify-end has no free space left to distribute,
      // the section grows past the viewport, and the extra padding just pushes content further
      // down. Padding cannot lift content in a container that has already overflowed.
      className="relative isolate z-10 flex min-h-dvh w-full flex-col justify-center lg:justify-end"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          {...sanityImageProps(boat.coverImage, '/assets/placeholder-photo.svg')}
          alt={boat.coverImage?.alt ?? ''}
          fill
          priority
          // 80, not the default 75 — matches the static build's photographic-hero pass.
          // next.config.ts already allows [75, 80], but a quality Next isn't told to use is never
          // used: every image on the site currently renders q=75, which made that config inert.
          // This only helps a source image with pixels to spare; it cannot rescue an upscale.
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        {/* Optional hero video over the cover image (the image stays as poster + LCP + fallback).
            Behaviour/guards (mobile, reduced-motion, fade-in) all live in HeroVideo. */}
        <HeroVideo url={boat.coverVideo?.url} playOnMobile={boat.coverVideo?.playOnMobile} />
        {/* Same scrim recipe as the homepage hero: a left-to-right gradient, not a flat overlay.
            The copy sits left, so the photo stays readable on the right where it's uncovered. */}
        <div className="absolute inset-0 bg-linear-to-r from-background-ondark-page/78 via-background-ondark-page/40 to-transparent lg:from-background-ondark-page/70 lg:via-background-ondark-page/25" />
        {/* Bottom scrim band (Adinda, 2026-07-21): the left-to-right scrim fades out toward the
            right, leaving the SubNav's right-side items on bare photo. Same recipe as the nav
            mega-menu's bottom fade (Nav.tsx) — a fixed-height bottom-up gradient in the hero's
            own navy, under the SubNav across its full width. */}
        <div className="absolute inset-x-0 bottom-0 h-[160px] bg-gradient-to-t from-background-ondark-page/70 to-transparent" />
      </div>

      {/* data-reveal="left" — fade + slide in from the left, same as the homepage hero's content
          block. ScrollReveal (rendered by the page) adds [data-revealed]; the animation itself is
          pure CSS in globals.css, and is skipped entirely under prefers-reduced-motion. */}
      {/* Mobile padding mirrors the homepage hero (py-32) — with justify-center doing the work,
          the padding is only a safety inset, not the positioning mechanism. Desktop keeps the
          bottom-anchored spacing.

          translate-y-[40px] on MOBILE ONLY (Adinda, 2026-07-17: justify-center put the content too
          far up; bring it back down ~40px). A transform, NOT padding: with justify-center the
          content is centred in the free space, so adding pt-40 would move it down only ~20px (the
          padding shrinks the content box, and centring re-splits what's left) — and once padding +
          content exceeds min-h-dvh it stops moving anything at all. A transform shifts the painted
          result by exactly 40px regardless of the free-space maths, and costs no layout.
          40 is NOT on the spacing scale (0,2,4,8,12,16,20,24,32,48,64,80,96,128,160), so it must be
          written as an arbitrary [40px] — `translate-y-40` would emit nothing. */}
      <div
        data-reveal="left"
        className="flex w-full translate-y-[40px] flex-col gap-32 page-gutter-x py-32 lg:translate-y-0 lg:gap-48 lg:pb-128 lg:pt-128"
      >
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-8 text-caption-label uppercase text-text-ondark-muted">
            <li>
              <Link href="/" className="transition-colors duration-300 ease-in-out hover:text-text-ondark-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/boats" className="transition-colors duration-300 ease-in-out hover:text-text-ondark-primary">
                Boats
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            {/* Current page — a link to itself is noise, so it's plain text. */}
            <li className="text-accent-ondark-primary" aria-current="page">
              {boat.name}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-24 lg:gap-32">
          <h1 id="boat-hero-heading" className="max-w-[480px] text-display-h1 text-text-ondark-primary">
            {boat.pageTitle || boat.name}
          </h1>
          {boat.tagline ? (
            <p className="max-w-[560px] text-body-medium text-text-ondark-muted lg:text-body-large">
              {boat.tagline}
            </p>
          ) : null}
        </div>

        {/* Stats strip: on MOBILE, scroll sideways instead of wrapping (Adinda, 2026-07-20). Her
            husband's phone with an enlarged system font made the four items wrap into a ragged block.
            flex-nowrap + overflow-x-auto keeps them on one line and lets the row scroll — the same
            mobile behaviour as the Gallery / Destinations tab strips. Gap is reduced to 24 on mobile
            (was 48) so more fits before it needs to scroll. Desktop keeps the wrapping layout with
            the full 48/24 gaps (there is always room there, so it never wraps oddly).
            CSS-only on purpose: this keeps BoatHero a Server Component (it holds the LCP image). Mouse
            drag-scroll would need the client hook — native touch swipe covers the phone case, which is
            the one that broke. shrink-0 on each item so they keep their width in the scroll row. */}
        {/* Stats + brochure share ONE box at gap-24 (Figma 778:8723, Adinda 2026-07-21 — both
            breakpoints): they're a unit, closer to each other than the container's 32/48 rhythm
            spaces the other hero children. */}
        <div className="flex flex-col gap-24">
        {stats.length ? (
          <dl className="flex max-w-full flex-nowrap gap-24 overflow-x-auto scrollbar-hidden lg:flex-wrap lg:gap-x-48 lg:gap-y-24 lg:overflow-visible">
            {stats.map((stat) => (
              <div key={stat._key} className="flex shrink-0 flex-col gap-8">
                <dt className="text-caption-label uppercase text-accent-ondark-primary">{stat.label}</dt>
                <dd className="text-body-medium text-text-ondark-primary">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {/* Figma 778:8741 `download-cta` — REBUILT to the node 2026-07-21 (Adinda caught the first
            pass diverging): a 38px circle holding the picture_as_pdf icon (14px) — NOT an arrow —
            then gap-8 (was 16) to the label, 14px BOLD at 1.8 leading in accent-onimage-muted,
            with a 16px arrow_forward AFTER the text. Hover lifts the whole group to full white
            (no hover in the node; this matches the on-image link convention).
            target=_blank (Adinda): the CDN is cross-origin so `download` is ignored by browsers —
            the PDF opens as a page, and it must not swap out the site. rel per the external-link
            convention. Hidden entirely when no PDF is uploaded — a download button with nothing
            behind it is worse than no button. */}
        {boat.brochureUrl ? (
          <a
            href={boat.brochureUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex w-fit items-center gap-8 text-accent-onimage-muted transition-colors duration-300 ease-in-out hover:text-text-ondark-primary"
          >
            <span className="grid size-[38px] shrink-0 place-items-center rounded-full border border-current">
              <span
                aria-hidden="true"
                className="block size-[14px] bg-current [mask-image:url('/assets/icon-pdf.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
              />
            </span>
            <span className="flex items-center gap-4 py-4 text-body-medium font-bold">
              Download Brochure
              {/* Download glyph (arrow onto a tray line), NOT the node's arrow_forward — Adinda's
                  explicit override 2026-07-21: a sideways arrow says nothing about downloading;
                  this is the industry-standard icon for it. Nudges DOWN on hover, matching the
                  direction it points. */}
              <span
                aria-hidden="true"
                className="block size-[16px] shrink-0 bg-current transition-transform duration-300 ease-in-out group-hover:translate-y-[2px] [mask-image:url('/assets/icon-download.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
              />
            </span>
          </a>
        ) : null}
        </div>
      </div>
    </section>
  )
}
