import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Caption pass on destination-komodo's gallery (2026-07-22, Adinda: "make sure all the images
// have captions so I can review what the captions look like"). DRAFT COPY for lightbox QA —
// visitor-facing one-liners, general Komodo facts only (no site-specific claims that would need
// verification). Review/rewrite in Studio; tracked as placeholder-tier in _internal/CONTENT-STATUS.md.
//
// Matches gallery items by _key (seeded as the filename base in seed-komodo-gallery.ts) and
// patches ONLY the caption, leaving alt and asset untouched.

const CAPTIONS: Record<string, string> = {
  'komodo-gallery-01-komodo-dragon-forest':
    'The Komodo dragon — the world’s largest lizard, found nowhere else on Earth',
  'komodo-gallery-02-green-hills-twin-bays':
    'Golden hour over Komodo National Park’s island ridges and twin bays',
  'komodo-gallery-03-manta-rays-reef':
    'Manta rays gliding in formation over the reef',
  'komodo-gallery-04-coral-reef-shallows':
    'Hard coral gardens thriving in the sunlit shallows',
  'komodo-gallery-05-snorkeler-turquoise-lagoon':
    'Drifting over coral heads in a turquoise lagoon',
  'komodo-gallery-06-aerial-beach-forest':
    'White sand meets forest at the edge of the national park',
  'komodo-gallery-07-swimmers-circle-clear-water':
    'Cooling off between dives in gin-clear shallows',
  'komodo-gallery-08-pink-sand-beach':
    'Komodo’s famous pink sand, tinted by red coral fragments',
}

async function run() {
  for (const id of ['destination-komodo', 'drafts.destination-komodo']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: does not exist, skipping`)
      continue
    }
    let patch = client.patch(id)
    for (const [key, caption] of Object.entries(CAPTIONS)) {
      patch = patch.set({ [`gallery[_key=="${key}"].caption`]: caption })
    }
    await patch.commit()
    const check = await client.fetch(
      `*[_id==$id][0].gallery[]{ "key": _key, "hasCaption": defined(caption) }`,
      { id },
    )
    console.log(`${id}:`, JSON.stringify(check))
  }
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
