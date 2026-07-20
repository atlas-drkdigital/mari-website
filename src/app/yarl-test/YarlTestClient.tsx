'use client'

import { useMemo, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

// CAPTIONS: back to the PLUGIN's default layout (2026-07-20, Adinda: "i like the initial title (big
// upper left, and the image count next to it not overlapping) ... you've created too much"). The
// custom bottom-centred `slideFooter` that briefly replaced it is gone.
//
// The count is NOT the Counter plugin. Counter mounts its own absolutely-positioned node, which is
// exactly what made it land ON TOP of the title. Instead the count is folded INTO the title itself:
// YARL types `title` as React.ReactNode (see plugins/captions/index.d.ts), so a node — not a string
// — is a supported value, and the two can never collide because they are one element.

// Our icons, masked so they inherit currentColor — same technique as the section arrows, so the
// lightbox chrome matches the rest of the site instead of using YARL's heavier Material defaults.
// icon-zoom-in / icon-zoom-out were drawn for this: 15x15 viewBox, stroke-width 1.125, round caps —
// identical to icon-search.svg, so their weight matches the existing set BY CONSTRUCTION.
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

// YARL evaluation harness (2026-07-20) — throwaway, for Adinda to judge the UI before we commit to
// replacing the hand-rolled lightbox in BoatGallery. Delete this route once the call is made.
//
// Two galleries on purpose, because they answer two different questions:
//   1. Gallery  — can YARL reproduce what we already have (title + caption, thumbnail strip)?
//   2. Cabins   — the NEW behaviour: Deluxe + Superior COMBINED into one lightbox, each slide
//                 labelled with its cabin name so you always know what you're looking at. The label
//                 is DERIVED from the cabin type, not typed by an editor, so it can never drift.
//
// Backdrop is set to the same scrim token + blur as the hand-rolled one, so this is a like-for-like
// comparison of behaviour rather than a comparison of two different-looking overlays.

export type TestSlide = {
  src: string
  thumb: string
  title?: string
  description?: string
}

function Grid({ slides, onOpen }: { slides: TestSlide[]; onOpen: (i: number) => void }) {
  return (
    <div className="grid grid-cols-2 gap-16 md:grid-cols-4">
      {slides.map((s, i) => (
        <button
          key={s.src}
          type="button"
          onClick={() => onOpen(i)}
          className="group/thumb relative aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-sm"
        >
          {/* plain <img>: this is a scratch harness, and next/image here would only add noise to
              what we're actually judging. Do NOT copy this into a real section. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.thumb}
            alt={s.title ?? ''}
            className="size-full object-cover transition-transform duration-[1100ms] ease-in-out group-hover/thumb:scale-105"
          />
        </button>
      ))}
    </div>
  )
}

export function YarlTestClient({
  gallery,
  cabins,
}: {
  gallery: TestSlide[]
  cabins: TestSlide[]
}) {
  const [open, setOpen] = useState<null | { set: 'gallery' | 'cabins'; index: number }>(null)

  const active = open?.set === 'cabins' ? cabins : gallery

  // ONE caption line at the BOTTOM — no top title bar (Adinda, 2026-07-20).
  //   Gallery:  "21 / 23  <caption>"
  //   Cabins :  "3 / 7  Deluxe Cabin: <caption>"   (cabin name bold, then a colon)
  // `title` was removed from the galleryImage schema entirely, so there is nothing to show at the
  // top; the count moved down to join the caption.
  //
  // Built as `description` (which the Captions plugin renders at the BOTTOM) rather than `title`
  // (which it renders at the top). The count is baked into the slide it belongs to, so there is no
  // "current index" to read wrong while adjacent slides render mid-swipe.
  //
  // The cabins set is distinguished by `s.title` still carrying the CABIN NAME — on the test page
  // that value is derived from cabinType.name in page.tsx, not from the removed schema field.
  const isCabins = open?.set === 'cabins'
  const slides = useMemo(
    () =>
      active.map((s, i) => ({
        ...s,
        title: undefined,
        description: (
          <span className="flex flex-wrap items-baseline justify-center gap-x-8 gap-y-4">
            <span className="shrink-0 font-light opacity-60">{`${i + 1} / ${active.length}`}</span>
            {isCabins && s.title ? (
              <span className="font-semibold">{`${s.title}:`}</span>
            ) : null}
            {s.description ? <span>{s.description}</span> : null}
          </span>
        ),
      })),
    [active, isCabins],
  )

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-64 px-24 py-96">
      <header className="flex flex-col gap-16">
        <p className="text-eyebrow uppercase text-text-eyebrow">Internal test page</p>
        <h1 className="text-display-h2 text-text-primary">YARL evaluation</h1>
        <p className="text-body-large text-text-primary">
          Click any image. Check: swipe on a phone, pinch-to-zoom, the thumbnail strip, keyboard
          arrows and Esc, and whether the caption reads clearly over a photo.
        </p>
      </header>

      <section className="flex flex-col gap-24">
        <h2 className="text-display-h3 text-text-primary">1 · Gallery ({gallery.length} photos)</h2>
        <p className="text-body-medium text-text-primary">
          Title + caption come from the existing <code>galleryImage</code> fields.
        </p>
        <Grid slides={gallery} onOpen={(i) => setOpen({ set: 'gallery', index: i })} />
      </section>

      <section className="flex flex-col gap-24">
        <h2 className="text-display-h3 text-text-primary">2 · Cabins combined ({cabins.length} photos)</h2>
        <p className="text-body-medium text-text-primary">
          Deluxe and Superior in ONE lightbox. Each caption is derived from the cabin type — no new
          Sanity field, and it cannot go stale if a cabin is renamed.
        </p>
        <Grid slides={cabins} onOpen={(i) => setOpen({ set: 'cabins', index: i })} />
      </section>

      <Lightbox
        open={open !== null}
        close={() => setOpen(null)}
        index={open?.index ?? 0}
        slides={slides}
        plugins={[Captions, Thumbnails, Zoom]}
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
        // Replaced with our own assets. Prev/next reuse icon-arrow-forward.svg (the SAME file the
        // section arrows use, rotated), so all arrows on the site stay one weight.
        render={{
          iconPrev: () => <MaskIcon src="/assets/icon-arrow-forward.svg" className="rotate-180" />,
          iconNext: () => <MaskIcon src="/assets/icon-arrow-forward.svg" />,
          iconClose: () => <MaskIcon src="/assets/icon-close.svg" />,
          iconZoomIn: () => <MaskIcon src="/assets/icon-zoom-in.svg" />,
          iconZoomOut: () => <MaskIcon src="/assets/icon-zoom-out.svg" />,
        }}
        // Scrim at 92% (was 95%, Adinda) + the same blur as the hand-rolled overlay. YARL themes via
        // CSS custom properties and per-slot style objects, so this is the supported hook, not an
        // override hack. The four `captions*` slots are the plugin's own documented slots.
        styles={{
          container: {
            backgroundColor: 'color-mix(in srgb, var(--color-background-lightbox-scrim) 92%, transparent)',
            backdropFilter: 'blur(12px)',
          },
          // Gradient overlay that sits ON the image and resolves INTO the scrim (Adinda, 2026-07-20).
          // Bottom stop is the scrim colour at full opacity, so the band has no visible bottom edge —
          // it blends into the background rather than ending on a line. The top stop is the same
          // colour at 0 alpha, NOT `transparent`: in most engines `transparent` is rgba(0,0,0,0), so
          // interpolating to it drags the midpoint toward grey and produces a dirty fade.
          // Tall (140px) so the fade is gradual enough to read as part of the photo rather than a
          // caption bar; two- and three-line captions still sit inside it.
          captionsDescriptionContainer: {
            background:
              'linear-gradient(to top, rgba(10,17,31,1) 0%, rgba(10,17,31,0.85) 45%, rgba(10,17,31,0) 100%)',
            padding: '64px 24px 20px',
          },
          // beige-50 (#fdfcfa) via text-ondark-PRIMARY — "almost white", Adinda's words. It was on
          // ondark-secondary (beige-300), which reads noticeably duller over a photo.
          // maxWidth on the TEXT, not the container — the gradient band stays full-bleed while the
          // caption wraps. 720 matches the hand-rolled lightbox's existing caption width
          // (BoatGallery), so the two stay consistent when they converge. ~90 characters at
          // body-medium; drop to 640 (~80ch) if it still reads long on a wide monitor.
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
    </div>
  )
}
