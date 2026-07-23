import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Seeds a LONG boat.overviewBody so the Overview's "Read more" can actually be exercised
// (Adinda, 2026-07-17). The real seeded body is ~2 short paragraphs, which correctly does NOT
// overflow — so the button never renders and the expand/collapse behaviour is untestable.
//
// Deliberately mixes block types, because the collapse is a max-height cap and the whole point of
// choosing that over a line-clamp was that it adapts to content whose line heights differ:
// h3 + h4 headings, bold, italic, a bulleted list, and plain paragraphs.
//
// ⚠️ THIS IS TEST CONTENT, NOT COPY. It is placeholder to exercise a UI behaviour and must be
// replaced in the content pass — tracked in _internal/CONTENT-STATUS.md. It deliberately does NOT follow
// mari-core's voice rules; do not treat it as approved copy.
//
// ⚠️ DRAFTS: this dataset has them, and `*[_type=="boat"][0]` resolves to drafts.boat-mari, not
// the published doc. Patch BOTH ids explicitly and verify BOTH — a check that only queries the
// side you wrote to is not a check. (This cost a day on the gallery.)

const key = (n: string) => ({ _key: `seedlong-${n}` })

const span = (n: string, text: string, marks: string[] = []) => ({
  _type: 'span',
  ...key(`s-${n}`),
  text,
  marks,
})

const para = (n: string, children: ReturnType<typeof span>[]) => ({
  _type: 'block',
  ...key(`b-${n}`),
  style: 'normal',
  markDefs: [],
  children,
})

const heading = (n: string, style: 'h3' | 'h4', text: string) => ({
  _type: 'block',
  ...key(`b-${n}`),
  style,
  markDefs: [],
  children: [span(n, text)],
})

const bullet = (n: string, text: string) => ({
  _type: 'block',
  ...key(`b-${n}`),
  style: 'normal',
  listItem: 'bullet',
  level: 1,
  markDefs: [],
  children: [span(n, text)],
})

const LONG_BODY = [
  para('1', [
    span('1a', 'Explore Indonesia’s most renowned dive destinations, from Raja Ampat, Komodo, and Flores to the Banda Sea, and beyond. Mari Liveaboard is a 30 m traditional Indonesian ironwood Phinisi built for serious divers who value comfort, space, and exceptional value.'),
  ]),
  heading('2', 'h3', 'Built around the diving'),
  para('3', [
    span('3a', 'Every part of the boat is arranged around getting you in the water quickly and comfortably. The '),
    span('3b', 'dive deck runs the full width of the hull', ['strong']),
    span('3c', ', with a dedicated station per guest, room to kit up without queuing, and direct access to the tenders. Nitrox is available via an onboard membrane system, and rental equipment is serviced between every trip.'),
  ]),
  bullet('4', 'Three tenders, including one dedicated to snorkelers and excursions'),
  bullet('5', 'Twenty-nine tanks in 12L and 15L, with two high-output compressors'),
  bullet('6', 'A cruise director plus three dive guides, at a 1:1 crew-to-guest ratio'),
  heading('7', 'h4', 'Space to actually rest'),
  para('8', [
    span('8a', 'With a maximum of fourteen guests across seven cabins, the boat never feels crowded. '),
    span('8b', 'All seven cabins sit on the main deck', ['em']),
    span('8c', ', each with an ensuite bathroom, hot water, air conditioning, and a sea view — so nobody is billeted below the waterline. Between dives there is a shaded outdoor dining area, an indoor lounge, and a sky deck.'),
  ]),
  para('9', [
    span('9a', 'The crew of fourteen has run these routes for years. That matters most when conditions change: the itinerary flexes around the diving rather than the diving flexing around a printed schedule.'),
  ]),
  heading('10', 'h4', 'Where the boat sails'),
  para('11', [
    span('11a', 'Komodo and Sumbawa run through the middle of the year, with whale sharks in Saleh Bay from May to September. Raja Ampat runs year-round, though the southern sites close between June and September. The Banda Sea and Triton Bay are longer crossings and are always combined into twelve-night itineraries.'),
  ]),
  para('12', [
    span('12a', 'Trips run eleven or twelve nights depending on the route, and a minimum of Open Water plus thirty logged dives applies in Komodo. If you are unsure whether a route suits your experience, talk to us before booking rather than after.'),
  ]),
]

async function run() {
  const ids = ['boat-mari', 'drafts.boat-mari']

  for (const id of ids) {
    const doc = await client.fetch(`*[_id==$id][0]{_id}`, { id })
    if (!doc) {
      console.log(`${id}: DOES NOT EXIST — skipped`)
      continue
    }
    await client.patch(id).set({ overviewBody: LONG_BODY }).commit()
    console.log(`${id}: patched`)
  }

  // Verify BOTH sides independently — not just the one we happen to read back.
  console.log('\n=== verify ===')
  for (const id of ids) {
    const back = await client.fetch(
      `*[_id==$id][0]{ "blocks": count(overviewBody), "styles": array::unique(overviewBody[].style) }`,
      { id },
    )
    console.log(`${id}: ${JSON.stringify(back)}`)
  }
}

run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
