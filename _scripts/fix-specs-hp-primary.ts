import { getCliClient } from 'sanity/cli'

// Converts engine/outboard specs to HP-primary (2026-07-21). Run:
//   npx sanity exec _scripts/fix-specs-hp-primary.ts --with-user-token
//
// mari-core locked HP-primary as the brand standard on 2026-07-21 ("Nissan RD8/276 HP (280 PS)",
// tenders likewise — see core/boat.md + pending-verification/boat.md, "converted to HP primary per
// brand standard 2026-07-21"). The boat's `specifications` content was seeded from the older
// PS-primary values and still serves them in two categories (Machinery & Power, Tenders).
// Patches published AND draft (if present) so a later publish doesn't revert it.
const client = getCliClient({ apiVersion: '2024-01-01' })

const REPLACEMENTS: [string, string][] = [
  ['Nissan RD8 / 280PS', 'Nissan RD8 / 276 HP (280 PS)'],
  ['6.5m / 40PS Yamaha', '6.5m / 39 HP (40 PS) Yamaha'],
  ['4m / 15PS Yamaha', '4m / 15 HP (15 PS) Yamaha'],
]

type Span = { _type: string; text?: string }
type Block = { _type: string; children?: Span[] }
type SpecItem = { category?: string; body?: Block[] }

function applyReplacements(specs: SpecItem[]): { specs: SpecItem[]; hits: string[] } {
  const hits: string[] = []
  const next = specs.map((item) => ({
    ...item,
    body: item.body?.map((block) => ({
      ...block,
      children: block.children?.map((span) => {
        let text = span.text
        if (typeof text !== 'string') return span
        for (const [from, to] of REPLACEMENTS) {
          if (text.includes(from)) {
            hits.push(`${item.category}: "${from}" -> "${to}"`)
            text = text.replaceAll(from, to)
          }
        }
        return text === span.text ? span : { ...span, text }
      }),
    })),
  }))
  return { specs: next, hits }
}

async function run() {
  for (const id of ['boat-mari', 'drafts.boat-mari']) {
    const doc = await client.fetch<{ specifications?: SpecItem[] } | null>(
      '*[_id == $id][0]{ specifications }',
      { id },
    )
    if (!doc) {
      console.log(`${id}: no document, skipped`)
      continue
    }
    if (!doc.specifications?.length) {
      console.log(`${id}: no specifications array, skipped`)
      continue
    }
    const { specs, hits } = applyReplacements(doc.specifications)
    if (!hits.length) {
      console.log(`${id}: no PS-primary strings found, nothing to do`)
      continue
    }
    await client.patch(id).set({ specifications: specs }).commit()
    console.log(`${id}: patched ${hits.length} value(s)`)
    for (const h of hits) console.log(`  ${h}`)
  }
}

run().then(
  () => console.log('\nDone. Verify on the boat page Specs tabs (Machinery & Power, Tenders).'),
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
