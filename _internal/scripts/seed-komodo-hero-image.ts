import { createReadStream } from 'node:fs'
import { basename } from 'node:path'

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Replace destination-komodo's coverImage with the real Figma hero fill (2026-07-22): the Padar
// Island viewpoint JPEG, pulled as the ORIGINAL source image via the Figma MCP's download_assets
// (1880x1253 — the largest master Figma holds for this fill).
//
// UPLOADED AS-IS, FULL RESOLUTION — no pre-compression, per CLAUDE.md's measured image-pipeline rule.
// The CDN sizes/compresses on serve; the filename carries the SEO vanity segment.
//
// NOTE: coverImage doubles as the homepage-carousel card image (by schema design), so the homepage
// Komodo card changes with this too — flagged to Adinda in-session.
//
// Patches BOTH published and draft sides if a draft exists, so they can't diverge.

const FILE = '_internal/content-scratch/komodo/mari-liveaboard-komodo-01-padar-island-viewpoint.jpg'
const ALT =
  'View from the Padar Island summit trail over three crescent-shaped bays in Komodo National Park'

async function run() {
  const asset = await client.assets.upload('image', createReadStream(FILE), {
    filename: basename(FILE),
  })
  console.log(`uploaded: ${asset._id} (${asset.metadata?.dimensions?.width}x${asset.metadata?.dimensions?.height})`)

  const coverImage = {
    _type: 'imageWithAlt',
    asset: { _type: 'reference', _ref: asset._id },
    alt: ALT,
  }

  for (const id of ['destination-komodo', 'drafts.destination-komodo']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) { console.log(`${id}: does not exist, skipping`); continue }
    await client.patch(id).set({ coverImage }).commit()
    console.log(`${id}: coverImage replaced`)
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
