import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Homepage SEO title + meta description — 🟡 DRAFT copy by Claude (Adinda, 2026-07-24: seed real
// values so the latent generateMetadata fix finally gets its browser-tab test). Review the wording
// against drk-seo before launch; the WIRING test is what this unblocks.

const patch = {
  'seo.title': 'Mari Liveaboard — Phinisi Diving Liveaboard in Indonesia',
  'seo.description':
    'Dive Komodo, Raja Ampat and beyond aboard Mari — a traditional Phinisi liveaboard with premium comfort for just 14 guests. Explore itineraries and book your trip.',
}

async function run() {
  for (const id of ['homePage', 'drafts.homePage']) {
    const exists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: not present, skipped`)
      continue
    }
    await client.patch(id).set(patch).commit()
    console.log(`${id}: seo title + description set`)
  }
  const check = await client.fetch(`*[_id == "homePage"][0].seo{ title, description }`)
  console.log('verify:', JSON.stringify(check))
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
