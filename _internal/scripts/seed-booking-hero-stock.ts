import { createReadStream } from 'node:fs'

import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Booking hero image swap (Adinda, QA round 2, 2026-07-24): the Drive Raja Ampat landscape was
// only 1448px wide — soft on retina at 100vw. Replaced with a STOCK aerial of Pink Beach, Komodo:
// Pexels #2499777 by Stijn Dijkstra (free license, no attribution required), fetched at 3200px
// wide from Pexels' own CDN (her "compress to meet the size, but not smaller" — 3200 clears the
// 2880 retina target; no local re-encode beyond Pexels' own delivery). 🟡 STOCK — swap for a real
// Mari photo if a suitable high-res one ever lands; tracked in _internal/CONTENT-STATUS.md.
// Source file was downloaded to the session scratchpad — path below is historical; re-download
// from Pexels if this script ever needs a re-run on another machine.

const FILE =
  'C:/Users/adind/AppData/Local/Temp/claude/C--Users-adind-OneDrive-Desktop-mari-mari-website/10200680-2d78-49bb-bf5b-5f113281b367/scratchpad/stock-pexels-pink-beach-komodo-aerial-2499777.jpg'
const FILENAME = 'stock-pexels-pink-beach-komodo-aerial-2499777.jpg'
const ALT = 'Aerial view of a pink sand beach and turquoise reef in Komodo National Park'

async function run() {
  const existing = await client.fetch(`*[_type == "sanity.imageAsset" && originalFilename == $fn][0]._id`, {
    fn: FILENAME,
  })
  const assetId =
    existing ?? (await client.assets.upload('image', createReadStream(FILE), { filename: FILENAME }))._id
  console.log(`asset: ${assetId}${existing ? ' (reused)' : ' (uploaded)'}`)

  for (const id of ['scheduleRates', 'drafts.scheduleRates']) {
    const exists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: not present, skipped`)
      continue
    }
    await client
      .patch(id)
      .set({ heroImage: { _type: 'imageWithAlt', asset: { _type: 'reference', _ref: assetId }, alt: ALT } })
      .commit()
    console.log(`${id}: heroImage swapped`)
  }

  const check = await client.fetch(
    `*[_id == "scheduleRates"][0]{ "asset": heroImage.asset->_id, "alt": heroImage.alt, "dims": heroImage.asset->metadata.dimensions{width,height} }`,
  )
  console.log('verify:', JSON.stringify(check))
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
