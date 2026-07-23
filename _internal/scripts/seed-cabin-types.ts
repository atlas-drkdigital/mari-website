import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Seeds boat-mari's TWO cabin types (Deluxe + Superior) — schema, copy AND photos — 2026-07-17.
//
// WHY THIS EXISTS: only `cabinType-mari-deluxe` existed, with 1 image and no description. There was
// no Superior document AT ALL, so the Cabins section could only ever render one tab. The component
// was correct; the content simply wasn't there.
//
// SOURCING — every string below is VERBATIM from a skill, not written here:
//   - Descriptions: mari-website/references/pages/boat.md §3, both types, quoted exactly.
//   - Counts (3 Deluxe / 4 Superior = 7) + "main deck, sea view, ensuite, A/C, hot water":
//     mari-core/core/boat.md, Adinda-confirmed rows.
//   - Bed configs: mari-core/core/boat.md.
// Voice rule (brand/voice.md): NO single dash in copy — that's why it's "Bed + Extra Bed", not a dash.
//
// 🔴 ONE UNSOURCED VALUE: Deluxe `maxGuests: 2` is FIGMA'S number, not mari-core's. mari-core gives
// Deluxe an EXTRA BED and says it suits "couples, families, or small groups" — implying 3. The
// arithmetic backs Figma (3x2 + 4x2 = 14 = the confirmed max; at 3 you'd get 17), but mari-core states
// no Deluxe per-cabin max at all. Flagged for Serge. Tracked in _internal/CONTENT-STATUS.md.
//
// Patches BOTH published and draft — a doc with a draft has two sides, and writing one silently
// diverges them (the exact bug that cost the gallery a day). Same discipline as seed-gallery-tabs.ts.

let k = 0
const key = () => `ct${k++}`
const block = (text: string) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text }],
})
const pt = (...paras: string[]) => paras.map(block)

// Photos come from `G:\My Drive\##MARI\02. IMAGES\cabins` — Adinda's call 2026-07-17. The
// `_website-ready/boat-page/cabins-*` folders are EMPTY, so this is the only real source.
// Upload FULL-RES, do NOT pre-compress (CLAUDE.md, measured 2026-07-17): the CDN sizes and
// compresses on delivery, and pre-compressing only destroys the master.
const CABIN_DIR = 'G:\\My Drive\\##MARI\\02. IMAGES\\cabins'

async function uploadImage(filename: string) {
  const buffer = readFileSync(join(CABIN_DIR, filename))
  const asset = await client.assets.upload('image', buffer, { filename })
  return asset._id
}
const img = (assetId: string, alt: string) => ({
  _type: 'imageWithAlt',
  _key: key(),
  asset: { _type: 'reference', _ref: assetId },
  alt,
})

// Slot is a FIXED 708px (Figma 778:8775) => 1416px @2x target.
// 🔴 superior-bathroom-001 is 1025x1534 — a PORTRAIT, and in a cover-cropped slot a portrait is
// WIDTH-bound, so orientation buys it nothing. It fails by 1.38x. Adinda asked for the upscale note
// to live in a caption, but `imageWithAlt` has NO caption field (alt only) — so it is tracked in
// _internal/CONTENT-STATUS.md instead. Do NOT stuff the note into `alt`: alt is read aloud to screen readers
// and is the source of the CDN vanity filename.
const DELUXE_PHOTOS: [string, string][] = [
  ['mari-liveaboard-cabin-deluxe-001-double-bed.jpg', 'Deluxe cabin on Mari with a double bed made up in white linen, teak floor and turquoise panelled walls'],
  ['mari-liveaboard-cabin-deluxe-001-double-bed-002.jpg', 'Second view of a Mari Deluxe cabin showing the double bed, mirror and shelving'],
  ['mari-liveaboard-cabin-deluxe-002-twin-bed.jpg', 'Mari Deluxe cabin in its twin bed configuration with two single beds'],
  ['mari-liveaboard-cabin-deluxe-bathroom-001.jpg', 'En-suite bathroom in a Mari Deluxe cabin with a hot water shower and basin'],
]
const SUPERIOR_PHOTOS: [string, string][] = [
  ['mari-liveaboard-cabin-superior-001.jpg', 'Superior cabin on Mari with bunk beds made up in white linen and a sea view window'],
  ['mari-liveaboard-cabin-superior-002.jpg', 'Second view of a Mari Superior cabin showing the bunk beds and storage'],
  ['mari-liveaboard-cabin-superior-bathroom-001.jpg', 'En-suite bathroom in a Mari Superior cabin with a hot water shower and basin'],
]

async function run() {
  console.log('Uploading cabin photos from', CABIN_DIR)
  const [deluxeAssets, superiorAssets] = await Promise.all([
    Promise.all(DELUXE_PHOTOS.map(([f]) => uploadImage(f))),
    Promise.all(SUPERIOR_PHOTOS.map(([f]) => uploadImage(f))),
  ])
  console.log(`  ✓ ${deluxeAssets.length} Deluxe, ${superiorAssets.length} Superior uploaded`)

  const docs = [
    {
      _id: 'cabinType-mari-deluxe',
      _type: 'cabinType',
      boat: { _type: 'reference', _ref: 'boat-mari' },
      name: 'Deluxe Cabin',
      count: 3,
      maxGuests: 2, // 🔴 Figma's number, unsourced in mari-core. See header.
      description: pt(
        "With a convertible double or twin bed layout plus an extra bed, Mari's Deluxe cabins suit couples, families or small groups traveling together. Every one sits on the main deck with a sea view, natural light, private air conditioning and an ensuite bathroom with hot water.",
      ),
      bedConfiguration: 'Convertible Double or Twin Bed + Extra Bed',
      deckLocation: 'Main Deck',
      window: 'Sea View & Natural Light',
      bathroom: 'En-Suite Bathroom (Hot Water)',
      airConditioning: 'Air Conditioning',
      images: DELUXE_PHOTOS.map(([, alt], i) => img(deluxeAssets[i], alt)),
    },
    {
      _id: 'cabinType-mari-superior',
      _type: 'cabinType',
      boat: { _type: 'reference', _ref: 'boat-mari' },
      name: 'Superior Cabin',
      count: 4,
      maxGuests: 2, // Sourced: mari-core "Bunk-bed configuration, up to 2 guests each".
      description: pt(
        "Superior cabins use a bunk-bed setup for up to 2 guests each, a natural fit for solo travelers and dive buddies sharing a room. Like every cabin on Mari, they're on the main deck with a sea view, private air conditioning and an ensuite bathroom with hot water.",
      ),
      bedConfiguration: 'Bunk Beds + Up to 2 Guests',
      deckLocation: 'Main Deck',
      // mari-core says SUPERIOR is the type with explicit "windows"; Deluxe never names an aperture.
      // That's the opposite of the porthole/window split you might assume. "Porthole" appears nowhere.
      window: 'Sea View & Natural Light',
      bathroom: 'En-Suite Bathroom (Hot Water)',
      airConditioning: 'Air Conditioning',
      images: SUPERIOR_PHOTOS.map(([, alt], i) => img(superiorAssets[i], alt)),
    },
  ]

  const tx = client.transaction()
  for (const doc of docs) {
    // createOrReplace the published doc, and mirror onto any existing draft so the two can't diverge.
    tx.createOrReplace(doc)
    const draftId = `drafts.${doc._id}`
    const draftExists = await client.fetch<boolean>('defined(*[_id == $id][0]._id)', { id: draftId })
    if (draftExists) tx.createOrReplace({ ...doc, _id: draftId })
  }
  await tx.commit()

  console.log('✓ Seeded cabinType-mari-deluxe (3 cabins, 4 photos)')
  console.log('✓ Seeded cabinType-mari-superior (4 cabins, 3 photos)')
  console.log('\n🔴 Still open: Deluxe maxGuests=2 is Figma-sourced, not confirmed by mari-core.')
  console.log('🔴 superior-bathroom-001 is 1025w, needs 1416w for the 708px carousel slot.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
