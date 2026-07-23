import { createReadStream } from 'node:fs'

import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Private Charters §2 Overview seed (2026-07-23). Copy is the mock's own (778:8938) — tracked in
// _CONTENT-STATUS.md. The destinations map is a Figma-AUTHORED graphic (2000×1414 PNG), so Figma
// IS the master here — no higher-res source exists to hunt for. Uploaded renamed per the pipeline.
//
// setIfMissing on the fields so re-runs / Adinda's edits are safe; the body is seeded only if
// absent for the same reason.

const MAP_FILE =
  'C:/Users/adind/AppData/Local/Temp/claude/c--Users-adind-OneDrive-Desktop-mari-mari-website/09c9be1a-0a3c-4a89-b25c-b8fc6ef17679/scratchpad/mari-liveaboard-destinations-map-indonesia.png'

async function run() {
  const existing = await client.fetch(`*[_id == "privateCharters"][0]{ "hasBody": defined(overviewBody) }`)
  if (existing?.hasBody) {
    console.log('overviewBody already set — leaving content untouched')
    return
  }

  const asset = await client.assets.upload('image', createReadStream(MAP_FILE), {
    filename: 'mari-liveaboard-destinations-map-indonesia.png',
  })
  console.log(`map uploaded: ${asset._id}`)

  await client
    .patch('privateCharters')
    .setIfMissing({
      overviewEyebrow: 'Indonesia Private Charter Overview',
      overviewHeading: 'Traditional phinisi liveaboard for serious divers',
      overviewBody: [
        {
          _type: 'block',
          _key: 'ov-p1',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'ov-p1-s1',
              marks: [],
              text: "A private charter on Mari means the boat runs entirely for your group. You choose the destinations, set the departure date, and decide when to dive, when to surface, and when to sit on the sun deck and watch Indonesia pass. There are no shared briefings, no strangers at the breakfast table, and no one else's schedule to work around.",
            },
          ],
        },
        {
          _type: 'image',
          _key: 'ov-map',
          asset: { _type: 'reference', _ref: asset._id },
          alt: 'Map of Indonesia showing Mari Liveaboard charter destinations and their airports — Komodo, Raja Ampat, Banda Sea, Triton Bay and Halmahera',
          size: 'full',
          alignment: 'center',
        },
        {
          _type: 'block',
          _key: 'ov-p2',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'ov-p2-s1',
              marks: [],
              text: 'Mari sails to Raja Ampat, Komodo, Triton Bay, the Banda Sea, Halmahera and beyond — all on a single private charter liveaboard built for serious divers. Fourteen guests, fourteen crew, seven sea-view ensuite cabins, and three outdoor decks. The whole boat is yours for the duration.',
            },
          ],
        },
      ],
    })
    .commit()
  console.log('privateCharters: overview seeded (eyebrow + heading + body with inline map)')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
