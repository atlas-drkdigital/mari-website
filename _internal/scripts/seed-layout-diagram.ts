import { readFileSync } from 'node:fs'

import { getCliClient } from 'sanity/cli'

// Seeds the deck plan into boat.layoutDiagrams so the "Layout" tab has content (2026-07-20). Run:
//   npx sanity exec _internal/scripts/seed-layout-diagram.ts --with-user-token
//
// Until now `layoutDiagrams` was EMPTY, so the Layout tab correctly hid itself and BoatSpecs showed
// a single lone "Specifications" tab. This is the content that makes the tab appear — the component
// needed no change.
//
// SOURCE: G:\My Drive\##MARI\02. IMAGES\deck-plan\mari-deck-plan.png (1.26MB).
// Uploaded AS PNG, full resolution, NOT pre-compressed and NOT converted to JPEG:
//   - CLAUDE.md's measured rule is upload the highest-res master and let the CDN size it. Sanity's
//     own docs agree; pre-compressing destroys the archival master and saves nothing, because the
//     bandwidth quota counts SERVED bytes.
//   - A deck plan is line art with flat colour and text. JPEG would ring the edges and blur the
//     labels; PNG is the correct format for it, and "renaming" .png -> .jpg is a lossy re-encode,
//     not a rename.
//   - ⚠️ PNG + a width param WITHOUT auto=format INFLATES the file (measured: 2.5MB -> 3.2MB).
//     Whatever renders this must pair the width with auto('format'). sanityImageProps handles it.
//
// The filename is already descriptive kebab-case, so it feeds the CDN vanity URL as-is.
const client = getCliClient({ apiVersion: '2024-01-01' })

const SOURCE = 'G:/My Drive/##MARI/02. IMAGES/deck-plan/mari-deck-plan.png'
const BOAT_ID = 'boat-mari'

async function run() {
  const existing = await client.fetch<{ n: number } | null>(
    '*[_id == $id][0]{ "n": count(layoutDiagrams) }',
    { id: BOAT_ID },
  )
  if (existing?.n) {
    console.log(`  ⚠️  boat already has ${existing.n} layout diagram(s) — not overwriting. Exiting.`)
    return
  }

  console.log('  Uploading deck plan…')
  const asset = await client.assets.upload('image', readFileSync(SOURCE), {
    filename: 'mari-deck-plan.png',
  })
  console.log(`  asset: ${asset._id} (${asset.metadata?.dimensions?.width}x${asset.metadata?.dimensions?.height})`)

  const diagram = {
    _key: 'layout-deck-plan',
    _type: 'object',
    heading: 'Deck plan',
    // Copy is deliberately factual and drawn only from figures already approved in _internal/content-scratch/_boat.md
    // (30m, 7 main-deck cabins, 3 Deluxe / 4 Superior, 14 guests). No new claims are invented here —
    // the "Verification Required" list in that file is still open.
    body: [
      {
        _type: 'block',
        _key: 'layout-b1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'layout-s1',
            text: 'All seven cabins sit on the main deck — three Deluxe and four Superior — with the dive deck running the full width of the hull aft. Above, the open decks step up to the al fresco dining area and the sundeck.',
          },
        ],
      },
    ],
    images: [
      {
        _key: 'layout-img-1',
        _type: 'imageWithAlt',
        asset: { _type: 'reference', _ref: asset._id },
        alt: 'Deck plan of Mari Liveaboard showing the main deck cabins, dive deck and upper deck areas',
      },
    ],
  }

  // Patch BOTH ids — Studio shows the draft, and a published-only write means the editor's next
  // Publish silently reverts it. That bug cost a round earlier today.
  for (const id of [BOAT_ID, `drafts.${BOAT_ID}`]) {
    const doc = await client.fetch<{ _id: string } | null>('*[_id == $id][0]{_id}', { id })
    if (!doc) {
      console.log(`  –  ${id}: does not exist, skipped`)
      continue
    }
    await client.patch(id).setIfMissing({ layoutDiagrams: [] }).append('layoutDiagrams', [diagram]).commit()
    console.log(`  ✅ ${id}`)
  }
}

run().then(
  () => console.log('\nDone. The Layout tab should now appear alongside Specifications.'),
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
