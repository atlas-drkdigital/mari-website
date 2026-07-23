import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Migration: boats* chrome → the shared `boatsSection` singleton (2026-07-23, Adinda's
// shared-sections model). Values come FROM destinationDefaults (the original source of truth);
// the duplicated copies on destinationDefaults and privateCharters are then unset — their fields
// left the schemas in the same pass, so without the unset they'd linger as "unknown field" noise
// in Studio.
//
// ⚠️ Also unsets on the DRAFTS if any exist — the seed-vs-open-draft clobber lesson from the
// same day's SEO wipe: a patch that skips an open draft gets reverted at the editor's next
// publish.

async function run() {
  const old = await client.fetch(
    `*[_id == "destinationDefaults"][0]{ boatsEyebrow, boatsHeading, boatsHeadingSingular, boatsCtaText }`,
  )

  await client.createIfNotExists({ _id: 'boatsSection', _type: 'boatsSection' })
  await client
    .patch('boatsSection')
    .setIfMissing({
      eyebrow: old?.boatsEyebrow ?? 'Sail {destination} in comfort',
      heading: old?.boatsHeading ?? 'About the boats',
      headingSingular: old?.boatsHeadingSingular ?? 'About the boat',
      ctaText: old?.boatsCtaText ?? 'More about the boat',
    })
    .commit()
  console.log('boatsSection: created + seeded from destinationDefaults values')

  const FIELDS = ['boatsEyebrow', 'boatsHeading', 'boatsHeadingSingular', 'boatsCtaText']
  for (const id of ['destinationDefaults', 'privateCharters', 'drafts.destinationDefaults', 'drafts.privateCharters']) {
    try {
      await client.patch(id).unset(FIELDS).commit()
      console.log(`${id}: old boats* fields unset`)
    } catch {
      console.log(`${id}: no such document (fine)`)
    }
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
