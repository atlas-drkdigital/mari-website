import { createReadStream } from 'node:fs'

import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Private Charters §3 Benefits seed (2026-07-23). Titles/copy from the mari-website reference's
// "Four Highlights" block, with Adinda's two same-day calls applied: benefit #2 titled per the
// MOCKUP ("Customized Itinerary, ..."), and #1's body per the mock's wording ("charter in
// Indonesia" — the reference's "at its class" variant is noted in _CONTENT-STATUS.md).
//
// Images: #1 is the mock's own dining-deck photo (Figma-served JPEG 1573×1000, extension corrected
// to .jpg — a rename, not a re-encode). #4 reuses the sunset-drinks charter photo (fits "the whole
// boat is yours"). #2/#3 are PLACEHOLDERS pulled from the Komodo gallery — flagged 🟡, replace at
// the image pass. setIfMissing so re-runs / Adinda's edits are safe.

const DINING_FILE =
  'C:/Users/adind/AppData/Local/Temp/claude/c--Users-adind-OneDrive-Desktop-mari-mari-website/09c9be1a-0a3c-4a89-b25c-b8fc6ef17679/scratchpad/mari-liveaboard-dining-deck-evening-table.jpg'
const SUNSET_REF = 'image-2dfd2994fe6b2256cc9a3b2a20f7e6ce7cc6dbfc-1448x1086-png'

async function run() {
  const existing = await client.fetch(`*[_id == "privateCharters"][0]{ "has": defined(benefits) }`)
  if (existing?.has) {
    console.log('benefits already set — leaving content untouched')
    return
  }

  const komodo = await client.fetch(
    `*[_id == "destination-komodo"][0].gallery[0...2]{ "ref": asset._ref }`,
  )
  const ph1 = komodo?.[0]?.ref
  const ph2 = komodo?.[1]?.ref

  const dining = await client.assets.upload('image', createReadStream(DINING_FILE), {
    filename: 'mari-liveaboard-dining-deck-evening-table.jpg',
  })
  console.log(`dining-deck uploaded: ${dining._id}`)

  const benefit = (key: string, ref: string, title: string, caption: string, alt: string) => ({
    _type: 'benefitImage',
    _key: key,
    asset: { _type: 'reference', _ref: ref },
    title,
    caption,
    alt,
  })

  await client
    .patch('privateCharters')
    .setIfMissing({
      benefitsEyebrow: 'Benefits',
      benefitsHeading: 'Why book a private charter with us',
      benefits: [
        benefit(
          'bn-value',
          dining._id,
          'Exceptional Value',
          'The best value traditional Phinisi liveaboard charter in Indonesia. Affordable rates with premium amenities: sea-view ensuite cabins, a 50 sqm al fresco dining deck with bar, and three outdoor spaces on a beautifully built ironwood and teak Phinisi. Groups also benefit from significant savings compared to booking individual cabins on a scheduled departure.',
          'Al fresco dining deck of Mari Liveaboard set for dinner at dusk, with candles and sea views',
        ),
        ...(ph1
          ? [
              benefit(
                'bn-itinerary',
                ph1,
                'Customized Itinerary, Built for Your Group',
                'You choose the destinations and the pace. One point of contact and one agreement with our experienced in-house travel advisor makes organizing a group trip straightforward.',
                'Komodo landscape seen on a Mari Liveaboard private charter itinerary',
              ),
            ]
          : []),
        ...(ph2
          ? [
              benefit(
                'bn-crew',
                ph2,
                '14 Crew for 14 Guests',
                "A 1:1 ratio of experienced local crew to guests, including dedicated dive and snorkeling guides who tailor every experience to your group's certification levels and interests.",
                'Mari Liveaboard crew guiding guests during a dive excursion',
              ),
            ]
          : []),
        benefit(
          'bn-boat',
          SUNSET_REF,
          'The Whole Boat Is Yours',
          'Charter the Mari for an intimate experience with your friends, your family or your dive group. Every cabin, every deck and every meal is reserved for your group. Your schedule, your pace, your plan.',
          'Guests and crew sharing sunset drinks on the deck of Mari Liveaboard during a private charter',
        ),
      ],
    })
    .commit()
  console.log('privateCharters: benefits seeded (4 items; #2/#3 images are Komodo placeholders)')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
