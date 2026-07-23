import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Reads BOTH sides of boat-mari. Never trust a single-side read on a doc that has a draft.
async function run() {
  for (const id of ['boat-mari', 'drafts.boat-mari']) {
    const doc = await client.fetch(
      `*[_id==$id][0]{_id, _updatedAt, "galleryCount": count(gallery), "gallery": gallery[]{_key, alt, title, caption, "file": asset->originalFilename, "kb": round(asset->size / 1024)}}`,
      { id }
    )
    if (!doc) {
      console.log(`${id}: DOES NOT EXIST`)
      continue
    }
    console.log(`\n=== ${doc._id}  (updated ${doc._updatedAt})`)
    console.log(`gallery count: ${doc.galleryCount ?? 0}`)
    for (const img of doc.gallery ?? []) {
      console.log(
        `  - ${img.file ?? '(no filename)'} ${img.kb}KB  key=${img._key}  alt=${JSON.stringify(img.alt ?? null)} title=${JSON.stringify(img.title ?? null)}`
      )
    }
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
