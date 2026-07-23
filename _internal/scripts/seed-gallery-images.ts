import { createReadStream, readdirSync, statSync } from 'node:fs'
import { basename, extname, join } from 'node:path'

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Uploads the boat gallery photos and tags each with its tab category, 2026-07-17.
// Source: G:\My Drive\##MARI\02. IMAGES\_website-ready\boat-page (Adinda's curated, already-renamed set).
//
// UPLOADS THE FILE AS-IS, FULL RESOLUTION. Do not add resizing/compression here — CLAUDE.md's
// "Sanity image pipeline" section measured that pre-compressing is actively wrong: the CDN sizes and
// compresses on delivery, the bandwidth quota counts served bytes, and re-encoding a master makes
// every served variant lossy->lossy. Bigger is strictly better at this stage.
//
// Reads from boat-page/ ONLY, never _needs-upscale/ — that folder holds `1600w__`-prefixed export
// REQUESTS for a human, not finished files. Copies at current resolution already sit under boat-page/,
// so the prefixed ones would upload a duplicate at the same (or worse) resolution.
//
// Patches BOTH published and draft: a doc with a draft has two sides, and writing one silently
// diverges them.

const ROOT = 'G:\\My Drive\\##MARI\\02. IMAGES\\_website-ready\\boat-page'

// Folder -> the GALLERY_CATEGORIES value that folder's images are tagged with.
//
// `gallery-photo` -> 'Relaxation', NOT 'Others'. Adinda 2026-07-17: one image doesn't justify its own
// tab, and it's guests having sunset drinks, which is relaxation. This deliberately leaves 'Others'
// with zero images, so BoatGallery hides that tab — which is the intended end state, not an oversight.
const FOLDER_TO_CATEGORY: Record<string, string> = {
  'gallery-boat': 'The Boat',
  'gallery-dining': 'Dining',
  'gallery-diving': 'Diving',
  'gallery-relaxation': 'Relaxation',
  'gallery-photo': 'Relaxation',
}

// "mari-liveaboard-boat-01-side-deck-golden-hour.jpg" -> "Side deck golden hour"
// The descriptor is the trustworthy part of these names: Adinda's rule is that it describes what is
// literally IN THE FRAME, never a claim about which deck it is. Everything before it (brand, category,
// index) is scaffolding.
function humanize(filename: string): string {
  const stem = basename(filename, extname(filename))
  const words = stem
    .split('-')
    .filter((w) => w !== 'mari' && w !== 'liveaboard')
    .filter((w) => !/^\d+$/.test(w))
  const descriptor = words.slice(1).join(' ')
  const text = descriptor || words.join(' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

async function run() {
  const gallery: Record<string, unknown>[] = []

  for (const [folder, category] of Object.entries(FOLDER_TO_CATEGORY)) {
    const dir = join(ROOT, folder)
    let files: string[]
    try {
      files = readdirSync(dir).filter((f) => /\.(jpe?g|png|tiff?)$/i.test(f)).sort()
    } catch {
      console.log(`${folder}: unreadable, skipping`)
      continue
    }

    for (const file of files) {
      const path = join(dir, file)
      const bytes = statSync(path).size
      const asset = await client.assets.upload('image', createReadStream(path), {
        filename: file, // Sanity keeps this as originalFilename -> feeds the SEO vanity URL segment.
      })
      const label = humanize(file)
      gallery.push({
        _type: 'galleryImage',
        _key: basename(file, extname(file)).replace(/[^a-z0-9]/gi, '').slice(0, 40),
        asset: { _type: 'reference', _ref: asset._id },
        title: label,
        // Draft alt, derived from Adinda's in-frame descriptor. Honest but generic — flagged in
        // _internal/CONTENT-STATUS.md as needing a human pass. Never required to be filled (DRK rule).
        alt: label,
        categories: [category],
      })
      console.log(
        `  ${file} -> ${category} (${(bytes / 1024 / 1024).toFixed(2)}MB, ${asset.metadata?.dimensions?.width}x${asset.metadata?.dimensions?.height})`,
      )
    }
  }

  console.log(`\n${gallery.length} images uploaded. Patching boat-mari...`)

  for (const id of ['boat-mari', 'drafts.boat-mari']) {
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
