import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Sub-nav labels onto the boatDefaults singleton (2026-07-21, SubNav build). setIfMissing so any
// edits Adinda has made are never clobbered.

async function run() {
  await client
    .patch('boatDefaults')
    .setIfMissing({
      subnavOverviewLabel: 'Overview',
      subnavCabinsLabel: 'Cabins',
      subnavGalleryLabel: 'Gallery',
      subnavLayoutLabel: 'Layout',
      subnavSpecsLabel: 'Specs',
      subnavFaqLabel: 'FAQ',
    })
    .commit()
  console.log('boatDefaults: sub-nav labels seeded')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
