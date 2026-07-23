import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Backfill the two new boats-section defaults onto the EXISTING destinationDefaults doc
// (2026-07-22): `initialValue` only applies when a document is first created in Studio — an
// already-existing singleton never picks new fields up on its own, which is why the boats CTA
// and singular heading rendered empty on first wire. setIfMissing so editor edits survive.

async function run() {
  for (const id of ['destinationDefaults', 'drafts.destinationDefaults']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: does not exist, skipping`)
      continue
    }
    await client
      .patch(id)
      .setIfMissing({
        boatsHeadingSingular: 'About the boat',
        boatsCtaText: 'More about the boat',
      })
      .commit()
    console.log(`${id}: boatsHeadingSingular + boatsCtaText backfilled`)
  }
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
