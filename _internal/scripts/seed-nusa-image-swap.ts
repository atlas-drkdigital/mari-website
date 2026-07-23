import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Give the Nusa TEST boat a visibly different cover than Mari's (Adinda, 2026-07-22 — identical
// images made the stepper unreviewable). Reuses the already-uploaded manta asset; obviously not
// a boat, which suits a delete-before-launch test doc.

async function run() {
  for (const id of ['boat-nusa-test', 'drafts.boat-nusa-test']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: does not exist, skipping`)
      continue
    }
    await client
      .patch(id)
      .set({
        coverImage: {
          _type: 'imageWithAlt',
          asset: {
            _type: 'reference',
            _ref: 'image-8f7a280282fc7546c557b3ff973f78542caff693-1880x1272-jpg',
          },
          alt: 'Manta ray gliding above a reef in open blue water',
        },
      })
      .commit()
    console.log(`${id}: coverImage swapped to the manta asset`)
  }
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
