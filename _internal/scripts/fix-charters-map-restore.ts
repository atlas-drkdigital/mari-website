import { createReadStream } from 'node:fs'

import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Adinda 2026-07-23: the copy-v2 body replacement WIPED the inline destinations map from the
// charters overview. Restore it after the SECOND paragraph (her placement). Reuses the existing
// uploaded asset when present, else uploads the master full-res. Idempotent: skips docs whose
// body already holds an image.
const FILE = 'G:/My Drive/##MARI/02. IMAGES/maps/mari-private-charter-indonesia-destinations-map.png'
const NAME = 'mari-private-charter-indonesia-destinations-map.png'

async function run() {
  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $fn][0]._id`, { fn: NAME },
  )
  const assetId = existing ?? (await client.assets.upload('image', createReadStream(FILE), { filename: NAME }))._id
  console.log(`map asset: ${assetId}${existing ? ' (reused)' : ' (uploaded full-res)'}`)

  const imageBlock = {
    _type: 'image',
    _key: `pcmap-${Date.now()}`,
    asset: { _type: 'reference', _ref: assetId },
    alt: "Map of Mari Liveaboard's private charter destinations across Indonesia",
    size: 'full',
    alignment: 'center',
  }

  for (const id of ['privateCharters', 'drafts.privateCharters']) {
    const doc = await client.fetch(
      `*[_id == $id][0]{ _id, "hasImage": count(overviewBody[_type == "image"]) > 0 }`, { id },
    )
    if (!doc) { console.log(`${id}: not present, skipped`); continue }
    if (doc.hasImage) { console.log(`${id}: body already has an image, skipped`); continue }
    await client.patch(id).insert('after', 'overviewBody[1]', [imageBlock]).commit()
    console.log(`${id}: map inserted after paragraph 2`)
  }

  const check = await client.fetch(
    `*[_id == "privateCharters"][0]{ "blocks": overviewBody[0...4]{ _type, style } }`,
  )
  console.log('verify:', JSON.stringify(check))
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
