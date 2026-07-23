import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

const MOVED = [
  'overviewEyebrow', 'keyFeaturesHeading', 'cabinsEyebrow', 'cabinsHeading',
  'galleryEyebrow', 'galleryTitle', 'specificationsEyebrow', 'specificationsHeading',
]
const TOGGLES = ['showOverviewEyebrow', 'showCabinsEyebrow', 'showGalleryEyebrow', 'showSpecificationsEyebrow']

// Removing a field from the schema does NOT remove its data. Anything below is now orphaned
// on the document -- invisible in Studio, still in the dataset.
async function run() {
  for (const id of ['boat-mari', 'drafts.boat-mari']) {
    const doc = await client.fetch(`*[_id==$id][0]`, { id })
    if (!doc) { console.log(`${id}: DOES NOT EXIST`); continue }
    console.log(`\n=== ${id}`)
    for (const f of [...MOVED, ...TOGGLES]) {
      if (f in doc) console.log(`  ORPHANED ${f} = ${JSON.stringify(doc[f])}`)
    }
  }
  const bd = await client.fetch(`*[_type=="boatDefaults"]{_id}`)
  console.log(`\nboatDefaults docs: ${JSON.stringify(bd)}`)
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
