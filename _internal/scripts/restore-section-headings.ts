import { getCliClient } from 'sanity/cli'

// Rolls the SECTION headings back to their pre-2026-07-20 values (Adinda: "lets roll back the
// section headings to the previous one. except for overview", and "gallery text should remain
// gallery"). Run:
//   npx sanity exec _internal/scripts/restore-section-headings.ts --with-user-token
//
// Values recovered from Sanity's history API at 2026-07-20T05:00:00Z (see _internal/scripts/history-peek.ts),
// NOT retyped from screenshots — `galleryEyebrow` in particular carries a `{boat}` token that a
// screenshot renders as "Life aboard Mari" and would have been silently lost.
//
// ⚠️ Root cause worth not repeating: seed-boat-content.ts REPLACED this copy without snapshotting it
// first. A seed that overwrites existing content should capture the old values before writing.
//
// KEPT AS NEW (the "except for overview" carve-out): overviewEyebrow, overviewHeading, overviewBody.
// NOT TOUCHED, pending Adinda's call: keyFeaturesHeading and the five galleryTabs headings — it is
// genuinely unclear whether those count as "section headings"; guessing either way costs a round.
const client = getCliClient({ apiVersion: '2024-01-01' })

const PREVIOUS = {
  cabinsEyebrow: '7 sea-view ensuite cabins',
  cabinsHeading: 'Cabins',
  galleryEyebrow: 'Life aboard {boat}',
  galleryTitle: 'Gallery',
}

async function patchBoth(publishedId: string, patch: Record<string, unknown>) {
  await client.patch(publishedId).set(patch).commit()
  console.log(`  ✅ ${publishedId} (published)`)

  const draftId = `drafts.${publishedId}`
  const draft = await client.fetch<{ _id: string } | null>('*[_id == $id][0]{_id}', { id: draftId })
  if (draft) {
    await client.patch(draftId).set(patch).commit()
    console.log(`  ✅ ${publishedId} (draft)`)
  } else {
    console.log(`  –  ${publishedId}: no draft, skipped`)
  }
}

async function run() {
  await patchBoth('boatDefaults', PREVIOUS)
  for (const [k, v] of Object.entries(PREVIOUS)) console.log(`     ${k}: ${v}`)
}

run().then(
  () => {
    console.log('\nRestored. Overview copy left as the new approved version.')
    console.log('⚠️  Still on the NEW copy, awaiting a decision:')
    console.log('    keyFeaturesHeading  "Key features" -> "The character of Mari"')
    console.log('    galleryTabs x5      e.g. "Plenty of space for everyone" -> "A Phinisi made for the journey"')
  },
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
