import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Itineraries QA round 2 (2026-07-22, Adinda):
// 1. destinationDefaults.itinerariesEyebrow — the field existed with NO stored value (why the
//    eyebrow was missing on the page). Seeded with the mock's "Discover the Best".
// 2. FOUR more Komodo itinerary docs so the desktop carousel (arrows appear at 4+) is testable —
//    NOT junk data: these are the four FINALIZED routes from the mari-itineraries skill library
//    (titles/durations/routes/summaries derived from those files). ⚠️ Seasons are placeholder
//    ("May to September") — 🔴 in _internal/CONTENT-STATUS.md, same as the first three.
//    Card images REUSE already-uploaded gallery assets by _ref (no duplicate uploads).
// 3. seo.title/description prefilled on ALL itinerary docs (setIfMissing, the established
//    "| {siteName}" formula) — they were empty, Adinda's catch.

const SEASON_PLACEHOLDER = 'May to September'

const NEW_ITINERARIES = [
  {
    id: 'itinerary-komodo-to-sumbawa-besar',
    title: 'Komodo to Sumbawa Besar',
    duration: '11 nights',
    route: 'Labuan Bajo to Badas',
    order: 4,
    summary:
      'A westbound passage from Komodo’s current-swept reefs toward whale shark encounters, black-sand volcanoes, jungle waterfalls and volcanic island reefs, revealing the full spectrum of the archipelago.',
    highlights: ['Komodo diving', 'Whale sharks', 'Volcanic island reefs'],
    imageRef: 'image-6df3af9979a18d1c6cb47cb5a7d372e463f8c867-1880x1253-jpg',
    imageAlt: 'Snorkeler floating between coral heads in a turquoise lagoon',
  },
  {
    id: 'itinerary-komodo-to-sumbawa-besar-9n',
    title: 'Komodo to Sumbawa Besar (9 Nights)',
    duration: '9 nights',
    route: 'Labuan Bajo to Badas',
    order: 5,
    summary:
      'The westbound crossing distilled to nine nights: Komodo’s pinnacles and manta stations, then whale sharks, waterfalls and volcanic reefs on the passage to Sumbawa Besar.',
    highlights: ['Komodo diving', 'Whale sharks', 'Nine-night crossing'],
    imageRef: 'image-c5c530d07592d0d05ac22b0b824a3c769792ddcb-1024x769-png',
    imageAlt: 'Colourful hard coral garden just below the surface in shallow water',
  },
  {
    id: 'itinerary-sumbawa-besar-to-komodo',
    title: 'Sumbawa Besar to Komodo',
    duration: '11 nights',
    route: 'Badas to Labuan Bajo',
    order: 6,
    summary:
      'An eastbound passage opening with whale shark encounters, jungle waterfalls and volcanic island reefs before building toward the raw, current-swept intensity of Komodo National Park.',
    highlights: ['Whale sharks', 'Volcanic island reefs', 'Komodo diving'],
    imageRef: 'image-4e2edc1958bb9c96954f38e7383c312ac4e2e81a-975x1300-jpg',
    imageAlt: 'Aerial view of a white sand beach between forest and deep blue sea',
  },
  {
    id: 'itinerary-sumbawa-besar-to-maumere',
    title: 'Sumbawa Besar to Maumere',
    duration: '11 nights',
    route: 'Badas to Maumere',
    order: 7,
    summary:
      'An eastbound crossing from whale sharks and volcanic reefs through Komodo’s current-swept heart, concluding among the remote volcanic islands of Flores.',
    highlights: ['Whale sharks', 'Komodo diving', 'Flores volcanic islands'],
    imageRef: 'image-9e751fd6288acb0d454b40e01684ebbac481b907-1040x1300-jpg',
    imageAlt: 'Pink sand beach with clear shallow water and islands on the horizon',
  },
]

async function run() {
  // 1. The missing eyebrow.
  for (const id of ['destinationDefaults', 'drafts.destinationDefaults']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) continue
    await client.patch(id).set({ itinerariesEyebrow: 'Discover the Best' }).commit()
    console.log(`${id}: itinerariesEyebrow seeded`)
  }

  // 2. The four library routes.
  for (const it of NEW_ITINERARIES) {
    await client.createOrReplace({
      _id: it.id,
      _type: 'itinerary',
      title: it.title,
      destination: { _type: 'reference', _ref: 'destination-komodo' },
      season: SEASON_PLACEHOLDER,
      duration: it.duration,
      route: it.route,
      order: it.order,
      summary: it.summary,
      highlights: it.highlights,
      image: {
        _type: 'imageWithAlt',
        asset: { _type: 'reference', _ref: it.imageRef },
        alt: it.imageAlt,
      },
    })
    console.log(`${it.id}: created`)
  }

  // 3. SEO prefill for every itinerary doc (idempotent — setIfMissing only fills gaps).
  const all: { _id: string; title?: string; summary?: string }[] = await client.fetch(
    `*[_type=="itinerary" && !(_id in path("drafts.**"))]{_id, title, summary}`,
  )
  for (const doc of all) {
    const title = `${doc.title} Itinerary | {siteName}`
    const description = (doc.summary ?? '').slice(0, 155)
    const existing = await client.fetch(`*[_id == $id][0].seo`, { id: doc._id })
    if (!existing) {
      await client
        .patch(doc._id)
        .setIfMissing({ seo: { _type: 'seo', title, description } })
        .commit()
    } else {
      await client
        .patch(doc._id)
        .setIfMissing({ 'seo.title': title, 'seo.description': description })
        .commit()
    }
    console.log(`${doc._id}: seo prefilled`)
  }
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
