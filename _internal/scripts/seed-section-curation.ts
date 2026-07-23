import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Curation additions (2026-07-23, Adinda's post-review round): boatsSection.boats drag array
// (destinationsSection twin) + destinationsSection.ctaText (replaces the hardcoded
// "Explore {name}"). Published ids only (the raw-perspective lesson from the same day) and
// drafts patched too when present (the open-draft clobber lesson).

async function run() {
  const boats: { _id: string }[] = await client.fetch(
    `*[_type == "boat" && defined(slug.current) && !(_id in path("drafts.**"))] | order(name asc){_id}`,
  )
  for (const id of ['boatsSection', 'drafts.boatsSection']) {
    try {
      await client
        .patch(id)
        .setIfMissing({ boats: boats.map((b) => ({ _type: 'reference', _ref: b._id, _key: `bs-${b._id}` })) })
        .commit()
      console.log(`${id}: boats array seeded (${boats.length})`)
    } catch { console.log(`${id}: no such document (fine)`) }
  }
  for (const id of ['destinationsSection', 'drafts.destinationsSection']) {
    try {
      await client.patch(id).setIfMissing({ ctaText: 'Explore {destination}' }).commit()
      console.log(`${id}: ctaText seeded`)
    } catch { console.log(`${id}: no such document (fine)`) }
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
