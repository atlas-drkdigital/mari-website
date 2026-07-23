import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// siteSettings.siteTitle "Mari Liveaboard Indonesia" → "Mari Liveaboard" (Adinda, 2026-07-23,
// site-wide SEO pass): the long tail pushed resolved SEO titles past the ~60-char SERP cut
// (charters resolved to 67). siteTitle feeds ONLY the {siteName} token in SEO titles/descriptions
// (verified by grep before this ran), so nothing else shifts. Patches the DRAFT too when present —
// the seed-vs-open-draft clobber lesson.

const NEW_TITLE = 'Mari Liveaboard'

async function run() {
  for (const id of ['siteSettings', 'drafts.siteSettings']) {
    const exists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: not present, skipped`)
      continue
    }
    const before = await client.fetch(`*[_id == $id][0].siteTitle`, { id })
    await client.patch(id).set({ siteTitle: NEW_TITLE }).commit()
    console.log(`${id}: "${before}" -> "${NEW_TITLE}"`)
  }
  const check = await client.fetch(`*[_id == "siteSettings"][0].siteTitle`)
  if (check !== NEW_TITLE) throw new Error(`verify failed: published siteTitle is "${check}"`)
  console.log('verified: published siteTitle =', check)
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
