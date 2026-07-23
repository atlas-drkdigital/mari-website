import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Find reusable image assets for the two Komodo blog-post covers (2026-07-22): the retired aerial
// Komodo cover + any diving/manta shots already uploaded.

async function run() {
  const assets = await client.fetch(
    `*[_type == 'sanity.imageAsset']{ _id, originalFilename, "w": metadata.dimensions.width, "h": metadata.dimensions.height } | order(originalFilename asc)`,
  )
  for (const a of assets) console.log(`${a.originalFilename}  (${a.w}x${a.h})  ${a._id}`)
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
