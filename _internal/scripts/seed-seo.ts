import { getCliClient } from 'sanity/cli'

// SEO metadata seed (2026-07-20). Fills the `seo` object on the homePage singleton and the Mari boat
// document — both were literally `null` in the dataset, which is why the generateMetadata wiring
// fixed in cf9d42e had no visible effect. Run:
//   npx sanity exec _internal/scripts/seed-seo.ts --with-user-token
//
// Copy is DRAFTED, not looked up: mari-website's references/pages/homepage.md and boat.md both list
// meta title / meta description as "⚠️ TBD". Facts are verified against mari-core, not invented —
// Komodo / Raja Ampat / Banda Sea are all ✅ Active in core/destinations.md, and the boat figures
// (30m, 7 sea-view ensuite cabins, Nitrox, 3 tenders, 14 crew for 14 guests) come from
// core/boat.md + brand/positioning.md.
//
// Language follows the LOCKED positioning rules in brand/positioning.md: use "premium" and
// "exceptional value" — never "luxury", never "affordable". Do not swap these for synonyms.
//
// Lengths are held to drk-seo's targets (title 50-60, description 150-160) and asserted below, so a
// future edit that busts the budget fails loudly instead of silently shipping a truncated snippet.
//
// Only `title` and `description` are set. The other seo.ts fields (ogTitle, twitterTitle,
// canonicalUrl, jsonLd, ...) still have NO consumer in the frontend — seeding them would recreate
// the exact "schema field nothing renders is a promise" trap this session was spent unpicking.
const client = getCliClient({ apiVersion: '2024-01-01' })

type SeoSeed = {
  id: string
  label: string
  title: string
  description: string
}

const SEEDS: SeoSeed[] = [
  {
    id: 'homePage',
    label: 'Homepage',
    title: 'Premium Indonesia Liveaboard Diving | Mari Liveaboard',
    description:
      'Dive Komodo, Raja Ampat and the Banda Sea aboard Mari, a traditional Phinisi liveaboard for serious divers. Premium comfort at exceptional value.',
  },
  {
    id: 'boat-mari',
    label: 'Boat — Mari',
    title: 'Mari Liveaboard | 30m Phinisi Dive Boat, Indonesia',
    description:
      'Step aboard Mari, a 30m traditional Phinisi with 7 sea-view ensuite cabins, a spacious dive deck, Nitrox and 3 tenders. 14 crew for 14 guests.',
  },
]

// drk-seo/references/technical-seo.md: titles 50-60 chars, descriptions 150-160.
// Warn rather than throw on the low side — a short title is a judgement call, an over-long one is a
// truncated search result.
function checkLengths({ label, title, description }: SeoSeed) {
  if (title.length > 60) throw new Error(`${label}: title is ${title.length} chars, max 60`)
  if (description.length > 160)
    throw new Error(`${label}: description is ${description.length} chars, max 160`)
  if (title.length < 50) console.warn(`  ⚠️  ${label}: title is ${title.length} chars (target 50-60)`)
  if (description.length < 150)
    console.warn(`  ⚠️  ${label}: description is ${description.length} chars (target 150-160)`)
}

async function run() {
  for (const seed of SEEDS) {
    checkLengths(seed)

    const existing = await client.fetch<{ _id: string; seo?: Record<string, unknown> } | null>(
      '*[_id == $id][0]{ _id, seo }',
      { id: seed.id },
    )

    if (!existing) {
      console.error(`  ❌ ${seed.label}: no document with _id "${seed.id}" — skipped`)
      continue
    }

    // patch(), not createOrReplace(): these documents are full of real content and this script owns
    // only two fields. createOrReplace would silently wipe everything else on the document.
    await client
      .patch(seed.id)
      .set({ 'seo.title': seed.title, 'seo.description': seed.description })
      .commit()

    console.log(`  ✅ ${seed.label} (${seed.id})`)
    console.log(`     title       ${seed.title.length} chars — ${seed.title}`)
    console.log(`     description ${seed.description.length} chars`)
  }
}

run().then(
  () => console.log('\nDone. Verify with: curl -s localhost:3000 | grep -o "<title>[^<]*</title>"'),
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
