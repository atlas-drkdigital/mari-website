import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Two seeds in one (2026-07-22):
//
// 1. DRAG-ORDER SWITCH: destination-komodo.itineraries becomes the drag-ordered reference list
//    that now drives the section (replaces auto-pull + the numeric `order`, removed from the
//    schema the same day it was added). Stored `order` values are unset so no orphaned data
//    lingers. Initial order mirrors what was on the page already.
//
// 2. TEST BOAT "Nusa" — Adinda's ask, TESTING ONLY: proves the boats stepper/arrows with 2
//    boats. Cloned from boat-mari (same cover asset, tweaked stats, simple 2-paragraph
//    overview). 🔴 DELETE before launch — tracked in _internal/CONTENT-STATUS.md.

const ITINERARY_ORDER = [
  'itinerary-komodo-full-park',
  'itinerary-komodo-bali-whale-sharks',
  'itinerary-flores-komodo-bali-whale-sharks',
  'itinerary-komodo-to-sumbawa-besar',
  'itinerary-komodo-to-sumbawa-besar-9n',
  'itinerary-sumbawa-besar-to-komodo',
  'itinerary-sumbawa-besar-to-maumere',
]

function block(text: string) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 10), text, marks: [] }],
  }
}

async function run() {
  // 1a. The reference array, in the order the page already showed.
  const refs = ITINERARY_ORDER.map((id) => ({
    _type: 'reference',
    _key: id.replace('itinerary-', ''),
    _ref: id,
  }))
  for (const id of ['destination-komodo', 'drafts.destination-komodo']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: does not exist, skipping`)
      continue
    }
    await client.patch(id).set({ itineraries: refs }).commit()
    console.log(`${id}: itineraries array set (${refs.length})`)
  }

  // 1b. Strip the dead `order` values.
  for (const id of ITINERARY_ORDER) {
    await client.patch(id).unset(['order']).commit()
  }
  console.log('order values unset on all itinerary docs')

  // 2. Test boat.
  const mari = await client.fetch(
    `*[_id=="boat-mari"][0]{ "cover": coverImage.asset._ref, "coverAlt": coverImage.alt }`,
  )
  if (!mari?.cover) throw new Error('boat-mari coverImage not found')
  await client.createOrReplace({
    _id: 'boat-nusa-test',
    _type: 'boat',
    name: 'Nusa',
    pageTitle: 'Nusa Liveaboard',
    slug: { _type: 'slug', current: 'nusa' },
    tagline: 'Test boat — delete before launch',
    coverImage: {
      _type: 'imageWithAlt',
      asset: { _type: 'reference', _ref: mari.cover },
      alt: mari.coverAlt ?? 'Liveaboard at anchor in calm blue water',
    },
    stats: [
      { _key: 'size', label: 'Boat Size', value: '28m' },
      { _key: 'cabins', label: 'Cabins', value: '6' },
      { _key: 'guests', label: 'Guests', value: '12' },
      { _key: 'crew', label: 'Crew', value: '10' },
    ],
    overviewBody: [
      block(
        'Placeholder test boat for the destination page carousel. Nusa exists only to prove the boat stepper works with more than one boat.',
      ),
      block('Delete this document once a real second boat exists, or once testing is done.'),
    ],
  })
  console.log('boat-nusa-test: created (slug /boats/nusa)')
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
