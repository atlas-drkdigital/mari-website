import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Second pass on the Onboard Pricing page (`page`, _id `page-onboard-pricing`) — replaces the four
// `[TABLE PLACEHOLDER …]` paragraphs left by seed-onboard-pricing.ts with real `table` blocks, now
// that richTextFull supports one (@sanity/table plugin, added 2026-07-24 — see richTextFull.ts and
// RichText.tsx). Does NOT touch the surrounding H3 headings or italic payment notes — those are
// left exactly where seed-onboard-pricing.ts put them; this script only swaps each placeholder
// block for a table block AT THE SAME POSITION.
//
// Table content is VERBATIM from seed-onboard-pricing.ts's header comment (fetched from the live
// site 2026-07-24) — not re-derived, not "improved". First row of each table is the header row,
// consumed by RichText.tsx's `table` renderer.
//
// Run: npx sanity exec _internal/scripts/seed-onboard-tables.ts --with-user-token

const ID = 'page-onboard-pricing'
const TABLE_PLACEHOLDER = '[TABLE PLACEHOLDER - pricing table to be seeded once table support ships]'

// ---------------------------------------------------------------------------------------------
// The four tables, in reading order, each [header, ...rows].
// ---------------------------------------------------------------------------------------------
const TABLES: string[][][] = [
  // Diving Equipment Rental Fees
  [
    ['Item', 'Price Per Day'],
    ['Regulator with octopus and gauge', '€7'],
    ['BCD', '€7'],
    ['DIN Adapter', '€2'],
    ['Wet Suit', '€5'],
    ['Fins', '€2'],
    ['Boots', '€2'],
    ['Torch', '€5'],
    ['Reef Hook', '€2'],
    ['Computer', '€10'],
    ['15L Dive Tank', '€16'],
    ['Nitrox', '€16'],
    ['Full Dive Gear (no computer)', '€21'],
  ],
  // Park & Port Fees
  [
    ['Cruise Duration', 'Park & Port Fees (Per Person)'],
    ['Cruises up to 11 nights', '€140'],
    ['Cruises of 12 nights & more', '€200'],
    ['Local Diving Fee (Saumlaki & Kaimana)', '€50'],
  ],
  // Fuel Surcharge
  [
    ['Cruise Duration', 'Fuel Surcharge (Per Person)'],
    ['Cruises up to 11 nights', '€150'],
    ['Cruises of 12 nights & more', '€250'],
  ],
  // Beverages
  [
    ['Item', 'Price'],
    ['Beer 33 cl', '€4'],
    ['Soft Drinks', '€2'],
    ['Bottle of Imported Wine', '€50'],
    ['Imported Prosecco', '€60'],
    ['Imported Gin 0.7 L', '€65'],
  ],
]

// ---------------------------------------------------------------------------------------------
// @sanity/table's own shape (verified against node_modules/@sanity/table/dist/index.js's
// `definePlugin` body 2026-07-24 — NOT guessed): the array member is `_type: 'table'` holding
// `rows: [{ _type: 'tableRow', _key, cells: string[] }]`. `tableRow` is the plugin's default
// `rowType` name (no override passed to `table()` in sanity.config.ts, so it stays default).
// ---------------------------------------------------------------------------------------------
type Span = { _type: 'span'; _key: string; text: string; marks: string[] }
type TextBlock = { _type: 'block'; _key: string; style: string; markDefs: never[]; children: Span[] }
type TableRow = { _type: 'tableRow'; _key: string; cells: string[] }
type TableBlock = { _type: 'table'; _key: string; rows: TableRow[] }
type BodyBlock = TextBlock | TableBlock

let seq = 0
const key = () => `tt${seq++}`

function toTableBlock(rows: string[][]): TableBlock {
  return {
    _type: 'table',
    _key: key(),
    rows: rows.map((cells) => ({ _type: 'tableRow', _key: key(), cells })),
  }
}

function isPlaceholder(block: unknown): boolean {
  const b = block as { _type?: string; children?: { text?: string }[] } | undefined
  if (!b || b._type !== 'block') return false
  const text = (b.children ?? []).map((c) => c.text ?? '').join('')
  return text.trim() === TABLE_PLACEHOLDER
}

async function patchDoc(id: string, existingBody: BodyBlock[]): Promise<{ blocks: number; tablesInserted: number }> {
  let tableIndex = 0
  const newBody: BodyBlock[] = existingBody.map((block) => {
    if (isPlaceholder(block)) {
      const table = TABLES[tableIndex]
      tableIndex += 1
      if (!table) throw new Error(`more placeholders than tables in ${id} — found placeholder #${tableIndex}`)
      return toTableBlock(table)
    }
    return block
  })
  if (tableIndex !== TABLES.length) {
    throw new Error(`${id}: expected ${TABLES.length} placeholders, replaced ${tableIndex}`)
  }
  await client.patch(id).set({ body: newBody }).commit()
  return { blocks: newBody.length, tablesInserted: tableIndex }
}

async function run() {
  const published = await client.fetch<{ _id: string; body: BodyBlock[] } | null>(
    `*[_id == $id][0]{_id, body}`,
    { id: ID },
  )
  if (!published) throw new Error(`${ID}: not found — run seed-onboard-pricing.ts first`)

  const publishedResult = await patchDoc(ID, published.body)
  console.log(`${ID}: patched — ${publishedResult.tablesInserted} tables inserted, ${publishedResult.blocks} total body blocks`)

  // Seed LAW: a published-only patch leaves a stale draft shadowing it in Studio, so any existing
  // draft gets the same treatment. Never CREATE a draft that isn't already there.
  const draftId = `drafts.${ID}`
  const draft = await client.fetch<{ _id: string; body: BodyBlock[] } | null>(
    `*[_id == $id][0]{_id, body}`,
    { id: draftId },
  )
  if (draft) {
    const draftResult = await patchDoc(draftId, draft.body)
    console.log(`${draftId}: patched — ${draftResult.tablesInserted} tables inserted, ${draftResult.blocks} total body blocks`)
  } else {
    console.log(`${draftId}: not present, skipped`)
  }

  const check = await client.fetch(
    `*[_id == $id][0]{
      "tableCount": count(body[_type == "table"]),
      "firstTableRows": body[_type == "table"][0].rows[].cells,
      "placeholdersRemaining": count(body[_type == "block" && children[0].text match "*TABLE PLACEHOLDER*"])
    }`,
    { id: ID },
  )
  console.log('verify:', JSON.stringify(check))
}

run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
