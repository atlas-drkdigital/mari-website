import { createReadStream } from 'node:fs'
import { basename } from 'node:path'

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Itinerary card fields for the destination-page carousel (2026-07-22, Figma 778:8688): the 3
// Komodo itinerary docs already carried title/duration/route/summary/highlights matching the
// mock — this adds the NEW card fields (season, image, order) and the defaults CTA label.
//
// ⚠️ Season values are the MOCK's copy ("May to June" / "June to August") — placeholder-tier
// until verified against real scheduling; tracked in _CONTENT-STATUS.md.
// Images are the mock's own card fills, pulled from Figma at original resolution, uploaded
// full-res per the pipeline rule.
//
// Patches BOTH published and draft sides where drafts exist.

const DIR = '_content/komodo/itinerary-cards'
const ITINERARIES: {
  id: string
  season: string
  order: number
  file: string
  alt: string
}[] = [
  {
    id: 'itinerary-komodo-full-park',
    season: 'May to June',
    order: 1,
    file: 'komodo-itinerary-card-komodo-dragon.jpg',
    alt: 'Komodo dragon raising its head among trees in Komodo National Park',
  },
  {
    id: 'itinerary-komodo-bali-whale-sharks',
    season: 'June to August',
    order: 2,
    file: 'komodo-itinerary-card-manta-ray.jpg',
    alt: 'Manta ray gliding above a reef in open blue water',
  },
  {
    id: 'itinerary-flores-komodo-bali-whale-sharks',
    season: 'June to August',
    order: 3,
    file: 'komodo-itinerary-card-island-hills-bays.jpg',
    alt: 'Green hills above curved bays at sunset in Komodo National Park',
  },
]

async function run() {
  for (const it of ITINERARIES) {
    const asset = await client.assets.upload('image', createReadStream(`${DIR}/${it.file}`), {
      filename: basename(it.file),
    })
    console.log(`uploaded ${it.file}: ${asset._id}`)
    const image = {
      _type: 'imageWithAlt',
      asset: { _type: 'reference', _ref: asset._id },
      alt: it.alt,
    }
    for (const id of [it.id, `drafts.${it.id}`]) {
      const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
      if (!exists) {
        console.log(`${id}: does not exist, skipping`)
        continue
      }
      await client.patch(id).set({ season: it.season, order: it.order, image }).commit()
      console.log(`${id}: season/order/image set`)
    }
  }

  for (const id of ['destinationDefaults', 'drafts.destinationDefaults']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: does not exist, skipping`)
      continue
    }
    await client
      .patch(id)
      .set({ itinerariesCardCtaText: 'View Full {destination} Schedule' })
      .commit()
    console.log(`${id}: itinerariesCardCtaText set`)
  }
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
