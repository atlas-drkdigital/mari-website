import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// destinationsSection singleton seed (2026-07-23) + boatsSection.eyebrowGeneric backfill.
// The carousel array is seeded in the CURRENT display order (order asc, name asc) so the reorg
// changes nothing visually until an editor curates. Patches drafts too (the seed-vs-open-draft
// clobber lesson).

async function run() {
  // ⚠️ PUBLISHED ids only — the CLI client's default perspective is RAW, so an unfiltered query
  // returns drafts.* ids too; a reference to a draft dereferences to NULL on the site (500'd the
  // homepage on first seed, 2026-07-23 — same null-member class as commit 8ded5ec).
  const dests: { _id: string }[] = await client.fetch(
    `*[_type == "destination" && defined(slug.current) && !(_id in path("drafts.**"))] | order(order asc, name asc){_id}`,
  )
  await client.createIfNotExists({ _id: 'destinationsSection', _type: 'destinationsSection' })
  await client
    .patch('destinationsSection')
    // .set, not setIfMissing — the first seed wrote draft refs and must be overwritten.
    .set({
      destinations: dests.map((d) => ({ _type: 'reference', _ref: d._id, _key: `ds-${d._id}` })),
    })
    .commit()
  console.log(`destinationsSection: seeded with ${dests.length} PUBLISHED destination(s) in current order`)

  for (const id of ['boatsSection', 'drafts.boatsSection']) {
    try {
      await client.patch(id).setIfMissing({ eyebrowGeneric: 'Sail Indonesia in comfort' }).commit()
      console.log(`${id}: eyebrowGeneric seeded`)
    } catch {
      console.log(`${id}: no such document (fine)`)
    }
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
