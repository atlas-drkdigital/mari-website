import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// 1. Create the boatDefaults singleton with the shared chrome (2026-07-17).
// 2. Strip the now-orphaned fields off boat-mari -- they moved to the singleton, so the values
//    left on the boat document are invisible in Studio but still in the dataset. Both sides.
//
// Headings below are the ones the boat document already carried. Figma has no eyebrow copy for
// the boat page, so the eyebrows are drawn from mari-core's locked positioning/selling points
// (not invented) -- still placeholder pending Adinda's content pass, tagged in _internal/CONTENT-STATUS.md.

const ORPHANED = [
  'overviewEyebrow', 'keyFeaturesHeading', 'cabinsEyebrow', 'cabinsHeading',
  'galleryEyebrow', 'galleryTitle', 'specificationsEyebrow', 'specificationsHeading',
  'showOverviewEyebrow', 'showCabinsEyebrow', 'showGalleryEyebrow', 'showSpecificationsEyebrow',
]

async function run() {
  await client.createOrReplace({
    _id: 'boatDefaults',
    _type: 'boatDefaults',
    overviewEyebrow: 'Premium diving at exceptional value',
    keyFeaturesHeading: 'Key features',
    cabinsEyebrow: '7 sea-view ensuite cabins',
    cabinsHeading: 'Cabins',
    galleryEyebrow: 'Life aboard {boat}',
    galleryTitle: 'Gallery',
    specificationsEyebrow: '30m of traditional Phinisi',
    specificationsHeading: 'Layout and specifications',
  })
  console.log('boatDefaults singleton created')

  for (const id of ['boat-mari', 'drafts.boat-mari']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) { console.log(`${id}: does not exist, skipping`); continue }
    await client.patch(id).unset(ORPHANED).commit()
    console.log(`${id}: orphaned chrome fields unset`)
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
