import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Seeds boat-mari's per-tab Amenities copy (boat.galleryTabs), 2026-07-17.
// Patches BOTH published and draft -- a doc with a draft has two sides, and writing one silently
// diverges them (the exact bug that cost the gallery a day).
//
// SOURCING: Figma has copy for ONE tab only ("The Boat"). The other four are drafted from
// mari-core/core/boat.md's confirmed facts + brand/voice.md's rules, not invented. Every tab is
// placeholder pending Adinda's content pass -- tracked per-row in _CONTENT-STATUS.md.

let k = 0
const key = () => `gt${k++}`
const block = (text: string) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text }],
})
const pt = (...paras: string[]) => paras.map(block)

const galleryTabs = [
  {
    _type: 'galleryTab',
    _key: key(),
    category: 'The Boat',
    // Figma verbatim (778:8858 / 778:8860) EXCEPT "sundeck" -> "sky deck": mari-core locks the deck
    // naming as sky/upper/main/lower deck, and Figma's copy predates that lock. Flagged for Figma.
    heading: 'Plenty of space for everyone',
    body: pt(
      'Soak in the sun on our sky deck, enjoy our cuisine and cocktails in our dining area, or simply listen to the sound of crashing waves on one of our outdoor lounges. There is plenty of space for everybody.'
    ),
  },
  {
    _type: 'galleryTab',
    _key: key(),
    category: 'Dining',
    heading: 'Meals with 270° sea views',
    body: pt(
      'The al fresco dining area runs to 50 sqm with a bar and 270° views over open water. Meals are a mix of Indonesian and Western cooking, all included, with dietary requirements accommodated on advance notice.'
    ),
  },
  {
    _type: 'galleryTab',
    _key: key(),
    category: 'Diving',
    heading: 'Built for serious divers',
    body: pt(
      'A spacious dive deck, 29 tanks in 12L and 15L, and Nitrox from an NRC membrane system. 3 tenders keep surface intervals short, and underwater photographers get 3 charging stations and a rinse tank.'
    ),
  },
  {
    _type: 'galleryTab',
    _key: key(),
    category: 'Relaxation',
    heading: 'Space to unwind between dives',
    body: pt(
      'The sky deck sits open to the sun with loungers, and the shaded lounge deck has bean bags for the hours between dives. Kayaks are aboard for calm mornings.'
    ),
  },
  // 'Others' stays seeded even though nothing is tagged to it today: BoatGallery hides any tab with
  // no images, so this row is invisible to visitors until an image is tagged, and visible to the
  // editor in Studio the whole time. Adinda 2026-07-17: "as long as it's empty ... we don't need to
  // show that". Nothing here is special-cased for 'Others'.
  //
  // NOTE the heading below is NOT this tab's for keeps — "Good to know" is going to be the FAQ
  // section's eyebrow (Adinda). Placeholder until the FAQ section is built.
  {
    _type: 'galleryTab',
    _key: key(),
    category: 'Others',
    heading: 'Good to know',
    body: pt(
      'Wi-Fi is free whenever the boat is in range of a mobile network. Fresh water comes from 2 reverse-osmosis desalinators producing 10,000L a day, and every cabin has hot water.'
    ),
  },
]

async function run() {
  for (const id of ['boat-mari', 'drafts.boat-mari']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) { console.log(`${id}: does not exist, skipping`); continue }
    await client.patch(id).set({ galleryTabs }).commit()
    console.log(`${id}: galleryTabs set (${galleryTabs.length} tabs)`)
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
