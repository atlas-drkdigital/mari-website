import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Slug change on/board-pricing -> onboard-pricing (Adinda, 2026-07-24: match the footer label
// "Onboard Prices"). Safe now — no real traffic yet, so no redirect doc needed.
async function run() {
  for (const id of ['page-onboard-pricing', 'drafts.page-onboard-pricing']) {
    const exists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) continue
    await client.patch(id).set({ slug: { _type: 'slug', current: 'onboard-pricing' } }).commit()
    console.log(`${id}: slug -> onboard-pricing`)
  }
  console.log('verify:', JSON.stringify(await client.fetch(`*[_id=="page-onboard-pricing"][0]{ "slug": slug.current }`)))
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
