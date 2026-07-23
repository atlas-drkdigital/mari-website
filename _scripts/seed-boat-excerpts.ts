import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// boat.excerpt (Card summary) seed, 2026-07-22 — the destination boats card was rendering the
// FULL overviewBody (Adinda: wrong, needs its own short copy, "we need to fill that in already").
// Mari's copy is the Figma node's own card text (778:8697) — Figma-sourced 🟡 per the sourcing
// policy. Nusa is the test boat, placeholder text.

function block(text: string) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 10), text, marks: [] }],
  }
}

const EXCERPTS: Record<string, string[]> = {
  'boat-mari': [
    'With 30 meters of length and a 6.5 meter beam, Mari has real room to spread out for up to 14 guests. A 50-square-meter al fresco dining area with 270-degree sea views, an open sky deck and a shaded lounge deck with bean bags give you space to unwind between and after dives.',
    'All her 7 cabins are on the main deck with private air conditioning, ensuite hot water bathrooms, sea views and natural light.',
  ],
  'boat-nusa-test': [
    'Placeholder summary for the Nusa test boat — this card exists only to prove the boats carousel with a second boat.',
    'Delete this document once testing is done.',
  ],
}

async function run() {
  for (const [baseId, paragraphs] of Object.entries(EXCERPTS)) {
    for (const id of [baseId, `drafts.${baseId}`]) {
      const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
      if (!exists) {
        console.log(`${id}: does not exist, skipping`)
        continue
      }
      await client.patch(id).set({ excerpt: paragraphs.map(block) }).commit()
      console.log(`${id}: excerpt set (${paragraphs.length} paragraphs)`)
    }
  }
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
