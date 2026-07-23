import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Overview reseed v2 (2026-07-23). Adinda cleared the overview fields in Studio by accident (the
// section auto-hiding was correct behaviour, not a bug) — this restores the mock copy AND extends
// the body into a FULL rich-text demo at her ask: H3/H4/H5/H6, marks (bold/italic/underline/
// strike/code), internal + external links, bullet + numbered lists, quote, an align annotation,
// image sizes, and a CAPTION on the map (she wants to see caption rendering). Text colour is NOT
// demoed because the schema deliberately excludes it ("not resolved yet" — see richTextFull.ts).
//
// ⚠️ .set(), not setIfMissing — the fields are empty and the point is to restore them. The demo
// copy below the map is CLAUDE-DRAFTED review material (flagged in _internal/CONTENT-STATUS.md), themed on
// real charter facts so it reads plausibly, but it is NOT approved copy.

const MAP_REF = 'image-b5bedbfcb3eaaa9769f2292656ae4a9dee0c9c98-2000x1414-png'
const SUNSET_REF = 'image-2dfd2994fe6b2256cc9a3b2a20f7e6ce7cc6dbfc-1448x1086-png'

const block = (key: string, text: string, style = 'normal', extra: object = {}) => ({
  _type: 'block',
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}-s1`, marks: [], text }],
  ...extra,
})

async function run() {
  await client
    .patch('privateCharters')
    .set({
      overviewEyebrow: 'Indonesia Private Charter Overview',
      overviewHeading: 'Traditional phinisi liveaboard for serious divers',
      overviewBody: [
        block(
          'ov-p1',
          "A private charter on Mari means the boat runs entirely for your group. You choose the destinations, set the departure date, and decide when to dive, when to surface, and when to sit on the sun deck and watch Indonesia pass. There are no shared briefings, no strangers at the breakfast table, and no one else's schedule to work around.",
        ),
        {
          _type: 'image',
          _key: 'ov-map',
          asset: { _type: 'reference', _ref: MAP_REF },
          alt: 'Map of Indonesia showing Mari Liveaboard charter destinations and their airports — Komodo, Raja Ampat, Banda Sea, Triton Bay and Halmahera',
          caption: 'Mari’s charter regions and their gateway airports — international hubs in dark, domestic connections in light.',
          size: 'full',
          alignment: 'center',
        },
        block(
          'ov-p2',
          'Mari sails to Raja Ampat, Komodo, Triton Bay, the Banda Sea, Halmahera and beyond — all on a single private charter liveaboard built for serious divers. Fourteen guests, fourteen crew, seven sea-view ensuite cabins, and three outdoor decks. The whole boat is yours for the duration.',
        ),

        // ---- Extended demo content (collapses behind Read More on desktop) ----
        block('ov-h3', 'How a private charter works', 'h3'),
        {
          _type: 'block',
          _key: 'ov-marks',
          style: 'normal',
          markDefs: [
            { _type: 'link', _key: 'lnk-komodo', href: '/destinations/komodo' },
            { _type: 'link', _key: 'lnk-ext', href: 'https://www.indonesia.travel' },
          ],
          children: [
            { _type: 'span', _key: 'm1', marks: [], text: 'You charter the ' },
            { _type: 'span', _key: 'm2', marks: ['strong'], text: 'entire boat' },
            { _type: 'span', _key: 'm3', marks: [], text: ', not a cabin — every departure is built around ' },
            { _type: 'span', _key: 'm4', marks: ['em'], text: 'your group alone' },
            { _type: 'span', _key: 'm5', marks: [], text: '. Popular first-time routes start from ' },
            { _type: 'span', _key: 'm6', marks: ['lnk-komodo'], text: 'Komodo National Park' },
            { _type: 'span', _key: 'm7', marks: [], text: ', with longer expeditions reaching the far east of ' },
            { _type: 'span', _key: 'm8', marks: ['lnk-ext'], text: 'Indonesia' },
            { _type: 'span', _key: 'm9', marks: [], text: '. Rates are ' },
            { _type: 'span', _key: 'm10', marks: ['underline'], text: 'all-inclusive on board' },
            { _type: 'span', _key: 'm11', marks: [], text: ' — no per-dive surcharges, no ' },
            { _type: 'span', _key: 'm12', marks: ['strike-through'], text: 'hidden extras' },
            { _type: 'span', _key: 'm13', marks: [], text: '. Your booking reference will look like ' },
            { _type: 'span', _key: 'm14', marks: ['code'], text: 'MARI-PC-2026' },
            { _type: 'span', _key: 'm15', marks: [], text: '.' },
          ],
        },
        block('ov-ul-1', 'Up to 14 guests in 7 sea-view ensuite cabins', 'normal', { listItem: 'bullet', level: 1 }),
        block('ov-ul-2', 'Full dive crew, tenders and equipment included', 'normal', { listItem: 'bullet', level: 1 }),
        block('ov-ul-3', 'Chef-prepared meals around your dive schedule', 'normal', { listItem: 'bullet', level: 1 }),
        block('ov-h4', 'Choosing your route', 'h4'),
        block('ov-ol-1', 'Tell us your group size, dates and diving experience.', 'normal', { listItem: 'number', level: 1 }),
        block('ov-ol-2', 'We propose a route matched to the season and your interests.', 'normal', { listItem: 'number', level: 1 }),
        block('ov-ol-3', 'Confirm with a deposit — the boat is yours.', 'normal', { listItem: 'number', level: 1 }),
        block(
          'ov-quote',
          '“We had the boat to ourselves for nine days in Raja Ampat. The crew adjusted everything around our group — it never felt like a schedule, it felt like our trip.”',
          'blockquote',
        ),
        block('ov-h5', 'Seasons at a glance', 'h5'),
        block('ov-h6', 'A note on weather windows', 'h6'),
        {
          _type: 'block',
          _key: 'ov-align',
          style: 'normal',
          markDefs: [{ _type: 'align', _key: 'aln-c', align: 'center' }],
          children: [
            {
              _type: 'span',
              _key: 'ov-align-s1',
              marks: ['aln-c'],
              text: 'Komodo sails April to September; Raja Ampat and the eastern seas take over from October to April.',
            },
          ],
        },
        {
          _type: 'image',
          _key: 'ov-img2',
          asset: { _type: 'reference', _ref: SUNSET_REF },
          alt: 'Guests and crew sharing sunset drinks on the deck of Mari Liveaboard during a private charter',
          caption: 'A medium-width inline image with a caption — sizing and alignment are editor choices per image.',
          size: 'medium',
          alignment: 'center',
        },
      ],
    })
    .commit()
  console.log('privateCharters: overview restored + extended rich-text demo seeded')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
