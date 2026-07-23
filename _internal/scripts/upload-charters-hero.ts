import { createReadStream } from 'node:fs'

import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Private Charters hero image (Adinda, 2026-07-23: use the mock's actual photo, not the reused
// boat cover). The Figma-served asset is BYTE-IDENTICAL to the library's "Sunset drink on the Sky
// deck.png" master (2,529,858 B, 1448×1086 PNG) — so this IS the full-res original, renamed per
// the pipeline (descriptive kebab-case, frame-content descriptor, extension preserved: a PNG
// stays a PNG, rename-never-re-encode).

const FILE =
  'C:/Users/adind/AppData/Local/Temp/claude/c--Users-adind-OneDrive-Desktop-mari-mari-website/09c9be1a-0a3c-4a89-b25c-b8fc6ef17679/scratchpad/mari-liveaboard-guests-sunset-drinks-on-deck.png'

async function run() {
  const asset = await client.assets.upload('image', createReadStream(FILE), {
    filename: 'mari-liveaboard-guests-sunset-drinks-on-deck.png',
  })
  console.log(`uploaded: ${asset._id} (${asset.originalFilename})`)
  await client
    .patch('privateCharters')
    .set({
      heroImage: {
        _type: 'imageWithAlt',
        asset: { _type: 'reference', _ref: asset._id },
        alt: 'Guests and crew sharing sunset drinks on the deck of Mari Liveaboard during a private charter',
      },
    })
    .commit()
  console.log('privateCharters.heroImage → the mock\'s sunset-drinks photo')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
