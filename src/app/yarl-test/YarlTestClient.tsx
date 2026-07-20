'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

// The Captions and Counter PLUGINS were both dropped (2026-07-20) — see the slideFooter note below.
// Short version: the plugin splits title (top) from description (bottom) and positions the counter
// independently, which is what made the count collide with the title. One custom footer puts all
// three where the old hand-rolled lightbox had them.

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
        slides={active}
        plugins={[Thumbnails, Zoom]}
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
          // ── CAPTION + COUNT, one block, at the BOTTOM ───────────────────────────────────────
          // Replaces the Captions and Counter plugins. Why they had to go:
          //   - Captions renders `title` at the TOP and `description` at the BOTTOM (its own CSS:
          //     title_container{top:0} / description_container{bottom:0}). The old hand-rolled
          //     lightbox put BOTH at the bottom (BoatGallery.tsx:404-413), so the title appeared to
          //     "move" and — because every gallery `caption` is null in Sanity — the bottom looked
          //     empty. Nothing was lost; it was relocated.
          //   - Counter positions itself independently, which is why it landed ON TOP of the title.
          // Index is derived from the slide itself, NOT tracked in state: slideFooter renders for
          // adjacent slides during a swipe, so a single "current index" would print the wrong
          // number on the incoming slide mid-transition.
          slideFooter: ({ slide }) => {
            const s = slide as unknown as TestSlide
            const i = active.findIndex((x) => x.src === s.src)
            if (!s.title && !s.description) return null
            return (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-24 pb-24">
                <div className="flex w-full max-w-[720px] flex-col gap-4 text-center">
                  <p className="text-button-small uppercase text-text-ondark-eyebrow">
                    {/* Count BEFORE the title, same size/style, thinner + slightly transparent.
                        Bricolage Grotesque is loaded as a variable font with no weight subset, so
                        300 is genuinely available (the ramp already uses 200 for display-accent). */}
                    {i >= 0 ? (
                      <span className="font-light opacity-60">{`${i + 1}/${active.length}  `}</span>
                    ) : null}
                    {s.title}
                  </p>
                  {s.description ? (
                    <p className="text-body-medium text-text-ondark-secondary">{s.description}</p>
                  ) : null}
                </div>
              </div>
            )
          },
        }}
        // Scrim at 92% (was 95%, Adinda) + the same blur as the hand-rolled overlay. YARL themes via
        // CSS custom properties, so this is the supported hook, not an override hack.
        styles={{
          container: {
            backgroundColor: 'color-mix(in srgb, var(--color-background-lightbox-scrim) 92%, transparent)',
            backdropFilter: 'blur(12px)',
          },
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  )
}
