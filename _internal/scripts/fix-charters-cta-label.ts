import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Adinda 2026-07-23: Codex's "View Charter Availability" is WRONG — the button links to Schedule
// & Rates, which lists ALL trips, not only charters. Back to "View All Trips" (accuracy beats
// keyword). Published + draft, per the clobber rule.
async function run() {
  for (const id of ['privateCharters', 'drafts.privateCharters']) {
    const exists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) continue
    await client.patch(id).set({ availabilityCtaText: 'View All Trips' }).commit()
    console.log(`${id}: availabilityCtaText -> "View All Trips"`)
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
