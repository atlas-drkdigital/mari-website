import { createReadStream } from 'node:fs'
import { basename } from 'node:path'

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Seed destination-komodo's gallery (2026-07-22) with the 8 images from the Figma Grid Gallery
// section (778:8677), pulled as Figma's original fills and saved to _content/komodo/gallery/
// (the MCP asset URLs expire in 7 days — the local copies are the keepers).
//
// UPLOADED AS-IS, FULL RESOLUTION, source extensions preserved (one is a PNG-encoded photo — it
// stays PNG per the renaming-never-re-encodes rule). Filenames carry the SEO vanity segment.
// Alt is seeded descriptive; captions left for the editor. No categories — the destination
// gallery is a flat grid, not tabbed.
//
// Patches BOTH published and draft sides if a draft exists, so they can't diverge.

const DIR = '_content/komodo/gallery'
const IMAGES: { file: string; alt: string }[] = [
  {
    file: 'komodo-gallery-01-komodo-dragon-forest.jpg',
    alt: 'Komodo dragon raising its head among trees and fallen branches',
  },
  {
    file: 'komodo-gallery-02-green-hills-twin-bays.jpg',
    alt: 'Green hills above two curved bays at sunset in Komodo National Park',
  },
  {
    file: 'komodo-gallery-03-manta-rays-reef.jpg',
    alt: 'Group of manta rays swimming over a reef in clear blue water',
  },
  {
    file: 'komodo-gallery-04-coral-reef-shallows.png',
    alt: 'Colourful hard coral garden just below the surface in shallow water',
  },
  {
    file: 'komodo-gallery-05-snorkeler-turquoise-lagoon.jpg',
    alt: 'Snorkeler floating between coral heads in a turquoise lagoon',
  },
  {
    file: 'komodo-gallery-06-aerial-beach-forest.jpg',
    alt: 'Aerial view of a white sand beach between forest and deep blue sea',
  },
  {
    file: 'komodo-gallery-07-swimmers-circle-clear-water.jpg',
    alt: 'Swimmers holding hands in a circle in clear shallow water over pink sand',
  },
  {
    file: 'komodo-gallery-08-pink-sand-beach.jpg',
    alt: 'Pink sand beach with clear shallow water and islands on the horizon',
  },
]

async function run() {
  const gallery = []
  for (const { file, alt } of IMAGES) {
    const path = `${DIR}/${file}`
    const asset = await client.assets.upload('image', createReadStream(path), {
      filename: basename(path),
    })
    console.log(
      `uploaded ${file}: ${asset._id} (${asset.metadata?.dimensions?.width}x${asset.metadata?.dimensions?.height})`,
    )
    gallery.push({
      _type: 'galleryImage',
      _key: file.replace(/\.[a-z]+$/i, ''),
      asset: { _type: 'reference', _ref: asset._id },
      alt,
    })
  }

  for (const id of ['destination-komodo', 'drafts.destination-komodo']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: does not exist, skipping`)
      continue
    }
    await client.patch(id).set({ gallery }).commit()
    console.log(`${id}: gallery set (${gallery.length} images)`)
  }
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
