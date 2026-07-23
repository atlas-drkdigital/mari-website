import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Sub-nav labels onto the destinationDefaults singleton (2026-07-22, destination page slice).
// setIfMissing so any edits Adinda has made are never clobbered. Mirrors seed-subnav-labels.ts
// (the boatDefaults version).

async function run() {
  await client
    .patch('destinationDefaults')
    .setIfMissing({
      subnavOverviewLabel: 'Overview',
      subnavGalleryLabel: 'Gallery',
      subnavItinerariesLabel: 'Itineraries',
      subnavFaqLabel: 'FAQ',
      subnavTripsLabel: 'Upcoming Trips',
    })
    .commit()
  console.log('destinationDefaults: sub-nav labels seeded')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
