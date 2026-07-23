import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// destinationDefaults gallery chrome swap (2026-07-22, Adinda): the destination gallery has NO
// visible heading (mock 778:8677), so galleryEyebrow + galleryTitle were removed from the schema
// — this strips their stored values too, so no orphaned data lingers. galleryCtaText is the new
// single field: the "View All Images" pill floating on the grid.
//
// Patches BOTH published and draft sides if a draft exists, so they can't diverge.

async function run() {
  for (const id of ['destinationDefaults', 'drafts.destinationDefaults']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: does not exist, skipping`)
      continue
    }
    await client
      .patch(id)
      .set({ galleryCtaText: 'View All Images' })
      .unset(['galleryEyebrow', 'galleryTitle'])
      .commit()
    console.log(`${id}: galleryCtaText set, galleryEyebrow/galleryTitle removed`)
  }
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
