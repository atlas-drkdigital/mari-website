import { getCliClient } from 'sanity/cli'

// Fixes wrong content on boat-mari.tagline (2026-07-20). Run:
//   npx sanity exec _internal/scripts/fix-boat-tagline.ts --with-user-token
//
// The boat's tagline held a KOMODO DESTINATION blurb — "World-class scuba diving meets the legendary
// Komodo dragon in this UNESCO World Heritage national park." It was written by seed-content-pass.ts
// (line 73), where the same string is correctly used for the Komodo destination doc; it landed on the
// boat document too.
//
// This is not cosmetic: BoatHero.tsx:107 renders `boat.tagline` directly under the H1, so the boat
// page has been telling visitors about Komodo dragons since the slice shipped. It survived Adinda's
// review, and only surfaced on 2026-07-20 because generateMetadata falls back to `tagline` and it
// showed up in the page's <meta name="description">.
//
// Replacement is mari-core's LOCKED brand tagline (brand/positioning.md) — do not reword it, and do
// not swap in an alternate: "Do not invent alternate taglines without Adinda's approval."
const client = getCliClient({ apiVersion: '2024-01-01' })

const BOAT_ID = 'boat-mari'
const TAGLINE = 'A traditional Phinisi liveaboard for serious divers.'

async function run() {
  const before = await client.fetch<{ tagline?: string } | null>(
    '*[_id == $id][0]{ tagline }',
    { id: BOAT_ID },
  )

  if (!before) throw new Error(`No document with _id "${BOAT_ID}"`)

  console.log(`  before: ${before.tagline ?? '(empty)'}`)
  await client.patch(BOAT_ID).set({ tagline: TAGLINE }).commit()
  console.log(`  after:  ${TAGLINE}`)
}

run().then(
  () => console.log('\nDone. Check the boat hero, under the H1.'),
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
