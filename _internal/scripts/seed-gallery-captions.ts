import { getCliClient } from 'sanity/cli'

// Seeds PLACEHOLDER captions onto the boat gallery images (2026-07-20). Run:
//   npx sanity exec _internal/scripts/seed-gallery-captions.ts --with-user-token
//
// 🔴 THIS IS PLACEHOLDER COPY, NOT REAL CONTENT. Adinda asked for captions purely so she can judge
// how they LOOK in the lightbox. Every gallery `caption` was null and there is no caption source —
// `alt` and `title` are identical short descriptors ("Side deck golden hour"), so there was nothing
// to derive real copy from.
//
// Deliberately makes NO factual claim about the boat. Inventing plausible-sounding detail about a
// real photo is how unverified claims end up shipping — the copy below only restates the image's own
// title and adds neutral filler. Track in _internal/CONTENT-STATUS.md and replace before launch.
//
// Lengths cycle short / medium / long ON PURPOSE, so the review covers the one-line case, the
// wrapping case, and the near-overflow case rather than 23 identical strings.
const client = getCliClient({ apiVersion: '2024-01-01' })

const SHAPES = [
  (t: string) => `${t}. Placeholder caption for layout review.`,
  (t: string) =>
    `${t}. Placeholder caption used to check how a longer line wraps across two lines in the lightbox.`,
  (t: string) =>
    `${t}. Placeholder caption, deliberately long, so the review covers the case where the text runs to three lines and starts competing with the image for attention below it.`,
]

type Row = { _key: string; title?: string }

async function run() {
  const gallery = await client.fetch<Row[] | null>(
    '*[_id == "boat-mari"][0].gallery[]{_key, title}',
  )
  if (!gallery?.length) throw new Error('No gallery images found on boat-mari')

  // Patch each array member BY _key. Never rebuild the array wholesale — regenerated _key values
  // read to Sanity as "every image deleted and recreated", which breaks in-flight edits and ordering.
  let patch = client.patch('boat-mari')
  gallery.forEach((img, i) => {
    const caption = SHAPES[i % SHAPES.length](img.title ?? 'Untitled')
    patch = patch.set({ [`gallery[_key=="${img._key}"].caption`]: caption })
  })
  await patch.commit()
  console.log(`  ✅ ${gallery.length} captions written (published)`)

  const draft = await client.fetch<{ _id: string } | null>(
    '*[_id == "drafts.boat-mari"][0]{_id}',
  )
  if (draft) {
    let dpatch = client.patch('drafts.boat-mari')
    gallery.forEach((img, i) => {
      const caption = SHAPES[i % SHAPES.length](img.title ?? 'Untitled')
      dpatch = dpatch.set({ [`gallery[_key=="${img._key}"].caption`]: caption })
    })
    await dpatch.commit()
    console.log(`  ✅ ${gallery.length} captions written (draft)`)
  }
}

run().then(
  () => console.log('\n⚠️  PLACEHOLDER copy — replace before launch. Reload /yarl-test.'),
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
