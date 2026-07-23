import { getCliClient } from 'sanity/cli'
import { writeFileSync } from 'node:fs'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Intended end state (Adinda, 2026-07-17): boat-mari gallery EMPTY ON BOTH SIDES.
// Real curated photos get re-added through the image pipeline as the boat page is built.
// Published held 4 smoke-test images the draft never had -- a Publish click would have
// silently restored junk no editor could see.
async function run() {
  const backup = await client.fetch(`*[_id=="boat-mari"][0]{_id, gallery}`)
  writeFileSync(
    '_scripts/_gallery-backup-boat-mari.json',
    JSON.stringify(backup, null, 2)
  )
  console.log(`backed up ${backup?.gallery?.length ?? 0} gallery entries`)

  for (const id of ['boat-mari', 'drafts.boat-mari']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: does not exist, skipping`)
      continue
    }
    await client.patch(id).unset(['gallery']).commit()
    console.log(`${id}: gallery unset`)
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
