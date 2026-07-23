import { createReadStream } from 'node:fs'

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// Komodo Overview seed (2026-07-22, Overview section build).
// - overviewBody: the FULL draft from mari-website's destination-komodo.md §2 — intro paragraphs
//   visible collapsed, the zone sections (with h3 headings, which is what richTextFull's heading
//   support exists for: named dive sites get heading treatment for SEO) behind Read More.
//   REPLACES the 2-block partial seed; same source document.
// - highlights: all 6 from the draft's §3, each with a real image. Four are fresh uploads from the
//   Figma mock's source images (full-res masters, renamed per convention); Padar + Coral Triangle
//   reuse assets already in the dataset (the hero master + the freediver shot).
// Patches BOTH published and draft sides.

let k = 0
const key = () => `sk${(k++).toString().padStart(3, '0')}`

function block(text: string, style: 'normal' | 'h3' = 'normal') {
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }
}

const OVERVIEW_BODY = [
  block(
    'As one of Indonesia’s prime liveaboard diving destinations, Komodo is where many divers begin their first Indonesian liveaboard experience, thanks to its easy accessibility from Bali. The park sits in East Nusa Tenggara, about an hour by air from Bali. It holds UNESCO World Heritage status as a marine protected area within the Coral Triangle, the global center of marine biodiversity.',
  ),
  block(
    'Above water, Komodo is known for its namesake dragon: the world’s largest lizard, found nowhere else on Earth. Below water, it delivers some of Indonesia’s best scuba diving, a combination that makes Komodo a rare destination built for serious divers and non-divers alike.',
  ),
  block('Diving in Komodo', 'h3'),
  block(
    'Komodo diving runs on adrenaline. Tidal currents rip through narrow channels and around volcanic pinnacles, turning a routine drift into fish aggregations thick enough to blot out the sun. Divers descend on Castle Rock in the north for negative entries into that intensity, then drift the current-scoured edges of Batu Bolong, one of the most colorful pinnacles in Indonesia.',
  ),
  block(
    'Central Komodo’s Manta Point offers a gentler introduction to the park’s signature encounter, with reef mantas circling a cleaning station in numbers that can reach 50 at a time. Further south, Manta Alley trades warmth for density: a volcanic amphitheater where mantas queue at a cleaning station in cooler, nutrient-rich water. Day boats reach only a fraction of this. A dive liveaboard follows the tide instead of a schedule, timing each dive around slack water and moving between north, central and south Komodo as conditions allow.',
  ),
  block(
    'That access, more than any single site, is why Komodo rewards a proper dive liveaboard trip over a shore-based one.',
  ),
  block('North Komodo', 'h3'),
  block(
    'North Komodo is warm, current-driven and intense. Water temperature runs 27°C to 29°C (81°F to 84°F), with visibility from 25 to 40 meters (82 to 131 feet) of clear blue water. Pinnacle sites like Castle Rock and Crystal Rock deliver strong currents and negative entries. Expect fish aggregations dense with jacks, whitetip sharks, turtles and Napoleon wrasse.',
  ),
  block(
    'Crystal Rock is also home to Komodo’s "ladybugs," a distinctive local critter found nowhere else in the park. A 3mm wetsuit is adequate for most divers, though a 5mm is worth packing if you run cold or plan multiple days here. This is Komodo’s most demanding diving, both in skill level and difficulty, and the fish aggregations at Castle Rock alone are reason many divers call it their most memorable stretch of a Komodo liveaboard trip.',
  ),
  block('Central Komodo', 'h3'),
  block(
    'Central Komodo is the park’s most topographically varied zone, mixing wide-angle and macro in the same dive. Water sits between 26°C and 28°C (79°F to 82°F), with visibility from 20 to 30 meters (66 to 98 feet). A 3mm to 5mm wetsuit covers most conditions here.',
  ),
  block(
    'Batu Bolong is the standout, a current-scoured pinnacle with some of the densest, most colorful coral cover in Indonesia. Manta Point delivers the park’s most reliable manta encounters, with sightings that can reach 50 individuals at a single cleaning station. At Cauldron, a strong rip current channels trevally, snappers and reef sharks past divers in an exhilarating drift. This zone rewards intermediate to advanced divers above all others.',
  ),
  block('South Komodo', 'h3'),
  block(
    'South Komodo is the coldest and most demanding zone, and it’s worth being honest about that up front. Water temperature drops to 22°C to 24°C (72°F to 75°F), and can fall as low as 21°C (70°F) during peak dry season in July and August. A 5mm wetsuit is the minimum here, with a 7mm or two thinner layers recommended.',
  ),
  block(
    'Visibility is also lower, typically 6 to 15 meters (20 to 49 feet), a trade-off for the nutrient-rich water that makes this the park’s macro capital. Cannibal Rock and the Three Sisters pinnacles are dense with frogfish, sea apples and nudibranchs, the kind of critter density that draws dedicated macro photographers south despite the cold. Manta Alley offers a volcanic amphitheater setting where mantas gather at a cleaning station, and this zone suits divers who prioritize critter density over comfort.',
  ),
]

// Fresh uploads: [local path, upload filename, alt]
const UPLOADS: Array<[string, string, string]> = [
  [
    '_internal/content-scratch/komodo/figma-raws/raw17.jpeg',
    'mari-liveaboard-komodo-03-manta-rays-feeding-formation.jpg',
    'Group of manta rays feeding in formation over a shallow reef',
  ],
  [
    '_internal/content-scratch/komodo/figma-raws/raw01.jpeg',
    'mari-liveaboard-komodo-04-snorkeler-descending-turquoise.jpg',
    'Snorkeler diving down through bubbles in clear turquoise water',
  ],
  [
    '_internal/content-scratch/komodo/figma-raws/raw14.jpeg',
    'mari-liveaboard-komodo-05-komodo-dragon-portrait.jpg',
    'Komodo dragon raising its head against a forest backdrop',
  ],
  [
    '_internal/content-scratch/komodo/figma-raws/raw11.jpeg',
    'mari-liveaboard-komodo-06-pink-beach-turquoise-shallows.jpg',
    'Pink-sand beach curving into turquoise shallows with islands on the horizon',
  ],
]

// Existing assets reused (no re-upload): the Padar hero master + the freediver reef shot.
const PADAR_REF = 'image-199244793f6bf654aa917e03a14a947bcf7d2b86-1880x1253-jpg'
const PADAR_ALT = 'View from the Padar Island summit trail over three crescent-shaped bays in Komodo National Park'
const FREEDIVER_REF = 'image-e139dda0230986067df1e3422af611956c014d6e-1733x1300-jpg'
const FREEDIVER_ALT = 'Freediver with pink fins swimming over a dense coral reef'

function img(ref: string, alt: string) {
  return { _type: 'imageWithAlt', asset: { _type: 'reference', _ref: ref }, alt }
}

async function run() {
  const refs: string[] = []
  for (const [path, filename] of UPLOADS) {
    const asset = await client.assets.upload('image', createReadStream(path), { filename })
    refs.push(asset._id)
    console.log(`uploaded ${filename} -> ${asset._id}`)
  }
  const [mantaRef, snorkelerRef, dragonRef, pinkBeachRef] = refs

  const highlights = [
    {
      _type: 'highlight', _key: 'h1', title: 'Swim with manta rays',
      body: [block('Year-round encounters at cleaning stations, with gatherings of up to 50.')],
      image: img(mantaRef, UPLOADS[0][2]),
    },
    {
      _type: 'highlight', _key: 'h2', title: 'Drift with the current',
      body: [block('Strong tidal currents power pinnacle dives and massive fish aggregations.')],
      image: img(snorkelerRef, UPLOADS[1][2]),
    },
    {
      _type: 'highlight', _key: 'h3', title: 'Meet the Komodo dragon',
      body: [block('The world’s largest lizard, found only here, on guided island walks.')],
      image: img(dragonRef, UPLOADS[2][2]),
    },
    {
      _type: 'highlight', _key: 'h4', title: 'Explore Padar Island',
      body: [block('Panoramic volcanic views rank among Indonesia’s most dramatic landscapes.')],
      image: img(PADAR_REF, PADAR_ALT),
    },
    {
      _type: 'highlight', _key: 'h5', title: 'Dive the Coral Triangle',
      body: [block('World-class reefs and macro life rival dedicated muck destinations.')],
      image: img(FREEDIVER_REF, FREEDIVER_ALT),
    },
    {
      _type: 'highlight', _key: 'h6', title: 'Discover Pink Beach',
      body: [block('Snorkel and watch sunsets on one of the world’s few pink beaches.')],
      image: img(pinkBeachRef, UPLOADS[3][2]),
    },
  ]

  for (const id of ['destination-komodo', 'drafts.destination-komodo']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) { console.log(`${id}: does not exist, skipping`); continue }
    await client.patch(id).set({ overviewBody: OVERVIEW_BODY, highlights }).commit()
    console.log(`${id}: overviewBody (${OVERVIEW_BODY.length} blocks) + ${highlights.length} highlights seeded`)
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
