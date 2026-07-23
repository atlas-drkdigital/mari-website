import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Turn on "Show on every boat page" for the two categories the locked composition model shares
// onto boat pages (mari-website faq.md). Title match happens ONCE, here at seed time — from now
// on the toggle (rename-proof) is what the query reads, so renames are safe.

const SHARE = ['Payment & Booking', "What's Included"]

async function run() {
  const cats: { _key: string; title?: string }[] =
    (await client.fetch(`*[_id == "faqGeneral"][0].categories[]{ _key, title }`)) ?? []
  const patch = client.patch('faqGeneral')
  let hits = 0
  for (const c of cats) {
    if (c.title && SHARE.includes(c.title)) {
      patch.set({ [`categories[_key=="${c._key}"].showOnBoatPages`]: true })
      hits++
    }
  }
  if (!hits) throw new Error('no matching categories found — check titles in the dataset')
  await patch.commit()
  console.log(`faqGeneral: showOnBoatPages set on ${hits} categories`)
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
