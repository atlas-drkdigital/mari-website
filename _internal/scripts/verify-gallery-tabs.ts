import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

async function run() {
  for (const id of ['boat-mari', 'drafts.boat-mari']) {
    const doc = await client.fetch(
      `*[_id==$id][0]{"tabs": galleryTabs[]{category, heading, "bodyChars": length(pt::text(body))}, "galleryCount": count(gallery)}`,
      { id }
    )
    console.log(`\n=== ${id}  (gallery images: ${doc?.galleryCount ?? 0})`)
    for (const t of doc?.tabs ?? []) {
      console.log(`  ${String(t.category).padEnd(12)} | ${String(t.heading).padEnd(32)} | body ${t.bodyChars} chars`)
    }
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
