import { getCliClient } from 'sanity/cli'

// Carries today's published-only fixes onto the boat DRAFT (2026-07-20). Run:
//   npx sanity exec _scripts/sync-draft-fields.ts --with-user-token
//
// ⚠️ THE BUG THIS FIXES IS A PROCESS BUG, NOT A DATA BUG — read this before writing another seed.
// seed-seo.ts and fix-boat-tagline.ts both patched `boat-mari` (the PUBLISHED document) only. Sanity
// keeps a separate `drafts.<id>` document, and STUDIO ALWAYS SHOWS THE DRAFT. So the fixes were live
// on the website while Studio still displayed the old values — which looks exactly like a caching
// bug and is not one. Worse: hitting Publish would have pushed the stale draft OVER the fixes,
// silently reverting both.
//
// 🔴 Compounding trap: querying `drafts.*` over the PUBLIC api returns NOTHING, with no error —
// drafts require an authenticated request. An unauthenticated "no draft exists" result is not
// evidence that no draft exists. Use `npx sanity documents query` (CLI auth), not plain curl.
//
// RULE FOR FUTURE SEEDS: if a document may have an open draft, patch BOTH ids or the editor's next
// Publish undoes your work.
//
// Deliberately narrow: sets ONLY `tagline` and `seo`. The draft also differs from published on one
// sentence of `overviewBody` ("designed to get you in the water" vs "arranged around getting you in
// the water") — that is an unpublished human edit from 2026-07-17 and is Adinda's call, so it is
// left exactly as-is.
const client = getCliClient({ apiVersion: '2024-01-01' })

const PUBLISHED_ID = 'boat-mari'
const DRAFT_ID = 'drafts.boat-mari'

async function run() {
  const published = await client.fetch<{ tagline?: string; seo?: unknown } | null>(
    '*[_id == $id][0]{ tagline, seo }',
    { id: PUBLISHED_ID },
  )
  if (!published) throw new Error(`No published document "${PUBLISHED_ID}"`)

  const draft = await client.fetch<{ _id: string } | null>('*[_id == $id][0]{ _id }', {
    id: DRAFT_ID,
  })
  if (!draft) {
    console.log('  No draft exists — nothing to sync.')
    return
  }

  await client
    .patch(DRAFT_ID)
    .set({ tagline: published.tagline, seo: published.seo })
    .commit()

  console.log('  ✅ Draft synced with the published tagline + seo.')
  console.log(`     tagline: ${published.tagline}`)
  console.log('     overviewBody deliberately NOT touched — the draft keeps its own wording.')
}

run().then(
  () => console.log('\nReload Studio. Publishing is now safe either way.'),
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
