import { getCliClient } from 'sanity/cli'

// Read-only. Fetches documents AS THEY WERE at a past timestamp, via Sanity's history API. Run:
//   npx sanity exec _scripts/history-peek.ts --with-user-token
//
// Written because seed-boat-content.ts overwrote the section headings without capturing the previous
// values first, and Adinda then asked to roll most of them back. Lesson: a seed that REPLACES
// existing copy should snapshot what it is replacing before it writes.
const client = getCliClient({ apiVersion: '2024-01-01' })

// Just before seed-boat-content.ts ran (it ran ~05:45Z on 2026-07-20). This is after the tagline and
// seo patches, so those stay as they are.
const AT = '2026-07-20T05:00:00Z'

const TARGETS = ['boatDefaults', 'boat-mari']

async function run() {
  for (const id of TARGETS) {
    const res = await client.request<{ documents: Record<string, unknown>[] }>({
      url: `/data/history/${client.config().dataset}/documents/${id}?time=${AT}`,
      method: 'GET',
    })
    const doc = res.documents?.[0]
    if (!doc) {
      console.log(`\n### ${id}: no revision found at ${AT}`)
      continue
    }
    console.log(`\n### ${id} as of ${AT}`)
    if (id === 'boatDefaults') {
      for (const k of [
        'overviewEyebrow',
        'keyFeaturesHeading',
        'cabinsEyebrow',
        'cabinsHeading',
        'galleryEyebrow',
        'galleryTitle',
        'specificationsEyebrow',
        'specificationsHeading',
      ]) {
        console.log(`  ${k.padEnd(24)} ${JSON.stringify(doc[k])}`)
      }
    } else {
      for (const k of ['pageTitle', 'overviewHeading']) {
        console.log(`  ${k.padEnd(24)} ${JSON.stringify(doc[k])}`)
      }
      const tabs = doc.galleryTabs as { category?: string; heading?: string }[] | undefined
      console.log('  galleryTabs:')
      for (const t of tabs ?? []) console.log(`    ${String(t.category).padEnd(14)} ${JSON.stringify(t.heading)}`)
    }
  }
}

run().catch((err) => {
  console.error(err?.message ?? err)
  process.exit(1)
})
