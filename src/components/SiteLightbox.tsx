'use client'

import { useMemo } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

// THE approved YARL configuration (settled 2026-07-20 with Adinda over many rounds on the
// /yarl-test harness). It lives in ONE file on purpose: BoatGallery and BoatCabins both open a
// lightbox, and two copies of an 80-line config drift the first time either is touched — the same
// reasoning that made CarouselChevron reuse a single icon asset instead of a second "matching" one.
//
// ⚠️ THIS MODULE IS THE DYNAMIC-IMPORT BOUNDARY. It is loaded via `next/dynamic` with `ssr: false`
// from every consumer, so YARL's JS *and* the three CSS files above only download once a visitor
// actually opens a lightbox. That was an explicit condition of adopting YARL. Do NOT import this
// module statically from a section — that silently puts ~40KB back into the page's first load.
//
// The reference implementation this was copied from is `src/app/yarl-test/YarlTestClient.tsx`.
// Every value below was reviewed; do not "improve" one without a fresh round of review.

// Our icons, masked so they inherit currentColor — same technique as the section arrows, so the
// lightbox chrome matches the rest of the site instead of using YARL's heavier Material defaults.
function MaskIcon({ src, className = '' }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block size-[20px] bg-current ${className}`}
      style={{
        maskImage: `url('${src}')`,
        maskPosition: 'center',
        maskRepeat: 'no-repeat',
        maskSize: 'contain',
      }}
    />
  )
}

export type LightboxSlide = {
  /** Full-size CDN URL — build it with `.width(1920).fit('max').quality(75).auto('format')`. */
  src: string
  /** Used for the slide's alt/aria text only, never rendered as the caption. */
  alt?: string
  /** Optional bold prefix before the caption, e.g. a cabin name. Rendered as `<label>:`. */
  label?: string
  /** The caption sentence itself. */
  caption?: string
}

export function SiteLightbox({
  open,
  index,
  slides,
  onClose,
  ariaLabel,
}: {
  open: boolean
  index: number
  slides: LightboxSlide[]
  onClose: () => void
  ariaLabel?: string
}) {
  // ONE caption line at the BOTTOM — no top title bar (Adinda, 2026-07-20).
  //   Gallery:  "21 / 23  <caption>"
  //   Cabins :  "3 / 7  Deluxe Cabin: <caption>"   (cabin name bold, then a colon)
  //
  // Built as `description` (which the Captions plugin renders at the BOTTOM) rather than `title`
  // (which it renders at the top). The count is baked into the slide it belongs to, so there is no
  // "current index" to read wrong while adjacent slides render mid-swipe. It is deliberately NOT
  // the Counter plugin — Counter mounts its own absolutely-positioned node, which is what made it
  // land on top of the title. YARL types `title`/`description` as React.ReactNode, so a node is a
  // supported value and the count and caption can never collide because they are one element.
  const yarlSlides = useMemo(
    () =>
      slides.map((s, i) => ({
        src: s.src,
        alt: s.alt,
        description: (
          <span className="flex flex-wrap items-baseline justify-center gap-x-8 gap-y-4">
            <span className="shrink-0 font-light opacity-60">{`${i + 1} / ${slides.length}`}</span>
            {s.label ? <span className="font-semibold">{`${s.label}:`}</span> : null}
            {s.caption ? <span>{s.caption}</span> : null}
          </span>
        ),
      })),
    [slides],
  )

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={yarlSlides}
      labels={ariaLabel ? { Close: `Close ${ariaLabel}` } : undefined}
      // Fullscreen added 2026-07-21 (Adinda) — the official plugin, so every lightbox on the site
      // gets the toolbar button from this one config. ⚠️ iPhones don't expose the element
      // fullscreen API at all, so the plugin correctly shows NO button there — that's the
      // platform, not a bug; iPad/Android/desktop all get it.
      plugins={[Captions, Fullscreen, Thumbnails, Zoom]}
      // descriptionMaxLines was 3 — the plugin implements it as `-webkit-line-clamp`, so a longer
      // caption TRUNCATED with an ellipsis instead of wrapping. Worst on mobile, where 3 lines is
      // reached almost immediately. Raised high and the clamp is fully removed in the style below;
      // the maxWidth is what controls line length now, not a line count.
      captions={{ descriptionTextAlign: 'center', descriptionMaxLines: 99 }}
      thumbnails={{ width: 96, height: 64, border: 0, gap: 8 }}
      zoom={{ maxZoomPixelRatio: 3 }}
      // ── TRANSITION ────────────────────────────────────────────────────────────────────────
      // Adinda: too snappy, "same ease in as the entire site, can be slightly snappier but not
      // too much". The site uses `ease-in-out` essentially everywhere (99 uses, no custom curve),
      // which is cubic-bezier(0.4, 0, 0.2, 1) — used verbatim here.
      // YARL defaults are fade 250 / swipe 500. NOTE `navigation` (arrow clicks + keyboard) falls
      // back to `swipe` when unset, so setting swipe alone would leave arrow clicks at the old
      // speed — they have to be set together.
      animation={{
        fade: 300,
        swipe: 600,
        navigation: 600,
        easing: {
          fade: 'cubic-bezier(0.4, 0, 0.2, 1)',
          swipe: 'cubic-bezier(0.4, 0, 0.2, 1)',
          navigation: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }}
      // ── ICONS ─────────────────────────────────────────────────────────────────────────────
      // YARL's defaults are filled Material glyphs — much heavier than anything else on the site.
      // Prev/next reuse icon-arrow-forward.svg (the SAME file the section arrows use, rotated), so
      // all arrows on the site stay one weight.
      render={{
        iconPrev: () => <MaskIcon src="/assets/icon-arrow-forward.svg" className="rotate-180" />,
        iconNext: () => <MaskIcon src="/assets/icon-arrow-forward.svg" />,
        iconClose: () => <MaskIcon src="/assets/icon-close.svg" />,
        iconZoomIn: () => <MaskIcon src="/assets/icon-zoom-in.svg" />,
        iconZoomOut: () => <MaskIcon src="/assets/icon-zoom-out.svg" />,
        iconEnterFullscreen: () => <MaskIcon src="/assets/icon-fullscreen.svg" />,
        iconExitFullscreen: () => <MaskIcon src="/assets/icon-fullscreen-exit.svg" />,
      }}
      // Scrim at 92% (was 95%, Adinda) + the same blur as the hand-rolled overlay. YARL themes via
      // CSS custom properties and per-slot style objects, so this is the supported hook, not an
      // override hack. The four `captions*` slots are the plugin's own documented slots.
      styles={{
        container: {
          backgroundColor:
            'color-mix(in srgb, var(--color-background-lightbox-scrim) 92%, transparent)',
          backdropFilter: 'blur(12px)',
        },
        // Gradient overlay that sits ON the image and resolves INTO the scrim (Adinda, 2026-07-20).
        // Bottom stop is the scrim colour at full opacity, so the band has no visible bottom edge —
        // it blends into the background rather than ending on a line. The top stop is the same
        // colour at 0 alpha, NOT `transparent`: in most engines `transparent` is rgba(0,0,0,0), so
        // interpolating to it drags the midpoint toward grey and produces a dirty fade.
        captionsDescriptionContainer: {
          background:
            'linear-gradient(to top, rgba(10,17,31,1) 0%, rgba(10,17,31,0.85) 45%, rgba(10,17,31,0) 100%)',
          padding: '64px 24px 20px',
        },
        // beige-50 (#fdfcfa) via text-ondark-PRIMARY — "almost white", Adinda's words.
        // maxWidth on the TEXT, not the container — the gradient band stays full-bleed while the
        // caption wraps.
        captionsDescription: {
          fontSize: 'var(--text-body-medium)',
          lineHeight: 'var(--text-body-medium--line-height)',
          color: 'var(--color-text-ondark-primary)',
          textAlign: 'center',
          maxWidth: '720px',
          marginInline: 'auto',
          // Kills the clamp outright: the plugin's css sets `display:-webkit-box` +
          // `-webkit-line-clamp`, which is what truncates. `display:block` removes the mechanism
          // entirely, so the caption always wraps regardless of length.
          display: 'block',
          WebkitLineClamp: 'unset',
          overflow: 'visible',
        },
      }}
      controller={{ closeOnBackdropClick: true }}
    />
  )
}
