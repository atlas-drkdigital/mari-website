import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// "Booking Terms" -> "Payment & Booking" (Adinda, 2026-07-23: the old title was a test value; the
// mock's name is the real one). Rename is SAFE everywhere by design: page composition uses the
// showOn* toggles keyed by _key, never the title.

async function run() {
  const cat = await client.fetch(`*[_id == "faqGeneral"][0].categories[title == "Booking Terms"][0]{_key}`)
  if (!cat?._key) {
    console.log('No "Booking Terms" category found — nothing to rename')
    return
  }
  await client
    .patch('faqGeneral')
    .set({ [`categories[_key=="${cat._key}"].title`]: 'Payment & Booking' })
    .commit()
  console.log('faqGeneral: "Booking Terms" renamed to "Payment & Booking"')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
