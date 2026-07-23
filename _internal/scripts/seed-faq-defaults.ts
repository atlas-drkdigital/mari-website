import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Add the FAQ section chrome to the boatDefaults singleton (2026-07-21, categorized FAQ build).
// A patch with setIfMissing, NOT createOrReplace — the singleton already exists and may carry
// Adinda's edits to the other section fields; this must never clobber them.

async function run() {
  await client
    .patch('boatDefaults')
    .setIfMissing({
      faqEyebrow: 'Good to Know',
      faqHeading: '{boat} FAQ',
      faqLinkText: 'Read All FAQ',
    })
    .commit()
  console.log('boatDefaults: FAQ chrome seeded')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
