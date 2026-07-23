import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Gallery CTA label onto boatDefaults (2026-07-21). setIfMissing — never clobbers edits.
async function run() {
  await client.patch('boatDefaults').setIfMissing({ galleryCtaText: 'Open Gallery' }).commit()
  console.log('boatDefaults: galleryCtaText seeded')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
