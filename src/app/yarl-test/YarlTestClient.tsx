'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

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
        plugins={[Captions, Thumbnails, Zoom]}
        captions={{ showToggle: false, descriptionTextAlign: 'center' }}
        thumbnails={{ width: 96, height: 64, border: 0, gap: 8 }}
        zoom={{ maxZoomPixelRatio: 3 }}
        // Matches the hand-rolled overlay: scrim token at 95% + the same blur. YARL themes via CSS
        // custom properties, so this is the supported hook, not an override hack.
        styles={{
          container: {
            backgroundColor: 'color-mix(in srgb, var(--color-background-lightbox-scrim) 95%, transparent)',
            backdropFilter: 'blur(12px)',
          },
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  )
}
