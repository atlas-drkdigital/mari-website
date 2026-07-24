import { createReadStream } from 'node:fs'

import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Booking (/booking, Schedule & Rates) QA round 1 (Adinda, 2026-07-24): the hero became a PHOTO
// hero — upload the Raja Ampat aerial and set scheduleRates.heroImage.
// Full-res JPEG AS-IS (no conversion, no resizing — the locked pipeline rule; the CDN serves
// compressed variants). uploadOnce-by-originalFilename pattern from seed-about-qa1.ts.
// Run: npx sanity exec _internal/scripts/seed-booking-qa1.ts --with-user-token

const HERO_FILE =
  'G:/My Drive/##MARI/02. IMAGES/destinations/raja-ampat/mari-liveaboard-raja-ampat-landscape-001.jpg'
const HERO_FILENAME = 'mari-liveaboard-raja-ampat-landscape-001.jpg'
const HERO_ALT = 'Aerial view of Raja Ampat islands and turquoise reef lagoons'

async function uploadOnce(filePath: string, filename: string): Promise<string> {
  const existing = await client.fetch(`*[_type == "sanity.imageAsset" && originalFilename == $fn][0]._id`, {
    fn: filename,
  })
  if (existing) return existing
  const asset = await client.assets.upload('image', createReadStream(filePath), { filename })
  return asset._id
}

async function run() {
  const heroId = await uploadOnce(HERO_FILE, HERO_FILENAME)
  const dims = await client.fetch(`*[_id == $id][0].metadata.dimensions`, { id: heroId })
  console.log(`hero asset: ${heroId} (${dims?.width}x${dims?.height})`)

  const heroImage = {
    _type: 'imageWithAlt',
    asset: { _type: 'reference', _ref: heroId },
    alt: HERO_ALT,
  }

  // Seed LAW: patch the published doc AND the draft if one exists — otherwise the editor's open
  // draft silently shadows the seed.
  for (const id of ['scheduleRates', 'drafts.scheduleRates']) {
    const exists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: not present, skipped`)
      continue
    }
    await client.patch(id).set({ heroImage }).commit()
    console.log(`${id}: heroImage set`)
  }

  const check = await client.fetch(
    `*[_id == "scheduleRates"][0]{ "hasHero": defined(heroImage.asset), "alt": heroImage.alt }`,
  )
  console.log('verify:', JSON.stringify(check))
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
