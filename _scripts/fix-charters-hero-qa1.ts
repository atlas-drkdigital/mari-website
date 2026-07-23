import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Private Charters hero QA round 1 (Adinda, 2026-07-23):
//   - crew count is 14, not the mock's "ten" (matches boat-mari's Crew stat and the mock's own
//     Benefits row) — .set(), deliberately overwriting the earlier seed's mock copy.
//   - unset subnavDatesLabel: the field was removed same-day ("Available Dates" + "Check
//     Availability" were redundant; the accent tab alone leads to the dates section).

async function run() {
  await client
    .patch('privateCharters')
    .set({ heroSubheading: 'The whole boat is yours. Fourteen guests, fourteen crew, your itinerary.' })
    .unset(['subnavDatesLabel'])
    .commit()
  console.log('privateCharters: crew count fixed (14), subnavDatesLabel removed')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
