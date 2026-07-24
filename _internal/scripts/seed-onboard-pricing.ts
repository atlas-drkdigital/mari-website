import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Seeds the Onboard Pricing page (`page` document, _id `page-onboard-pricing`, slug
// `on-board-pricing`) for the /on-board-pricing slice, 2026-07-24.
//
// 🟢 THE TEXT IS REAL CLIENT COPY, fetched VERBATIM from the live site
// (https://www.mari-liveaboard.com/on-board-pricing) on 2026-07-24, via the page's own Next.js
// RSC payload (the WebFetch tool could not see the four pricing tables — they render from a
// server component the summarizer never executed — so the payload's embedded HTML strings were
// read directly instead). It is NOT placeholder and is NOT to be rewritten or "improved".
//
// 🔴 TABLES ARE DELIBERATELY NOT SEEDED HERE — Adinda's explicit revised instruction, 2026-07-24.
// richTextFull has no `table` block type and RichText.tsx has no table renderer, so a real table
// needs schema + component work this task is NOT scoped to do (content-only brief). Building one
// anyway (either flattening into headings/lists, or smuggling raw HTML through the `htmlEmbed`
// array member that richTextFull DOES already allow — the live site itself renders these exact
// four tables that way, via a `dangerouslySetInnerHTML` embed) would have pre-empted a decision
// that's actually Adinda's to make (plugin vs custom object vs reusing htmlEmbed). Each table's
// spot in the reading order is held by a literal placeholder paragraph instead. The full verbatim
// table content (headers + every row) is preserved in this file's header comment below AND in the
// seed script's own console output, so nothing has to be re-fetched when table support ships.
//
// ---------------------------------------------------------------------------------------------
// VERBATIM TABLE CONTENT — held here so it survives even if the placeholder text in Studio is
// ever edited. Currency is € throughout (source used HTML `&euro;`).
//
// ## Diving Equipment Rental Fees (to be paid in advance or onboard in cash)
// | Item                          | Price Per Day |
// |--------------------------------|--------------:|
// | Regulator with octopus and gauge | €7 |
// | BCD                            | €7 |
// | DIN Adapter                    | €2 |
// | Wet Suit                       | €5 |
// | Fins                           | €2 |
// | Boots                          | €2 |
// | Torch                          | €5 |
// | Reef Hook                      | €2 |
// | Computer                       | €10 |
// | 15L Dive Tank                  | €16 |
// | Nitrox                         | €16 |
// | Full Dive Gear (no computer)   | €21 |
//
// ## Park & Port Fees (to be paid onboard in cash)
// | Cruise Duration                          | Park & Port Fees (Per Person) |
// |-------------------------------------------|-------------------------------:|
// | Cruises up to 11 nights                    | €140 |
// | Cruises of 12 nights & more                | €200 |
// | Local Diving Fee (Saumlaki & Kaimana)      | €50 |
//
// ## Fuel Surcharge (to be paid onboard in cash)
// | Cruise Duration               | Fuel Surcharge (Per Person) |
// |---------------------------------|------------------------------:|
// | Cruises up to 11 nights          | €150 |
// | Cruises of 12 nights & more      | €250 |
//
// ## Beverages (to be paid onboard in cash)
// | Item                        | Price |
// |-------------------------------|--------:|
// | Beer 33 cl                    | €4 |
// | Soft Drinks                   | €2 |
// | Bottle of Imported Wine       | €50 |
// | Imported Prosecco             | €60 |
// | Imported Gin 0.7 L            | €65 |
// ---------------------------------------------------------------------------------------------
//
// Run: npx sanity exec _internal/scripts/seed-onboard-pricing.ts --with-user-token

const TABLE_PLACEHOLDER = '[TABLE PLACEHOLDER - pricing table to be seeded once table support ships]'

// ---------------------------------------------------------------------------------------------
// Source text. Same tiny markdown subset as seed-terms.ts: `### ` → h3, `_..._` → italic,
// `**...**` → bold. The live page's headings are the section labels only (H1 is the page hero
// title, handled by the `title` field, same convention as Terms & Conditions).
// ---------------------------------------------------------------------------------------------
const MD = `
### Diving Equipment Rental Fees

_To be paid in advance or onboard in cash_

${TABLE_PLACEHOLDER}

### Park & Port Fees

_To be paid onboard in cash_

${TABLE_PLACEHOLDER}

### Fuel Surcharge

_To be paid onboard in cash_

${TABLE_PLACEHOLDER}

### Beverages

_To be paid onboard in cash_

${TABLE_PLACEHOLDER}
`

// ---------------------------------------------------------------------------------------------
// Markdown subset → Portable Text. Keys are deterministic (`t0`, `t1`, …) — re-running the seed
// produces byte-identical blocks so a re-run is a no-op diff. Extends seed-terms.ts's parser with
// `_italic_` (needed here for the "to be paid..." notes; terms had no italics).
// ---------------------------------------------------------------------------------------------
type Span = { _type: 'span'; _key: string; text: string; marks: string[] }
type Block = {
  _type: 'block'
  _key: string
  style: string
  markDefs: never[]
  children: Span[]
  listItem?: 'bullet' | 'number'
  level?: number
}

let seq = 0
const key = () => `t${seq++}`

function inlineSpans(text: string): Span[] {
  const spans = text
    .split(/(\*\*[^*]+\*\*|_[^_]+_)/g)
    .filter(Boolean)
    .map((part) => {
      const bold = part.startsWith('**') && part.endsWith('**')
      const italic = !bold && part.startsWith('_') && part.endsWith('_')
      const raw = bold ? part.slice(2, -2) : italic ? part.slice(1, -1) : part
      const marks = bold ? ['strong'] : italic ? ['em'] : []
      return { _type: 'span' as const, _key: key(), text: raw, marks }
    })
  return spans.length ? spans : [{ _type: 'span', _key: key(), text: '', marks: [] }]
}

function toPortableText(md: string): Block[] {
  const blocks: Block[] = []
  for (const raw of md.split('\n')) {
    const line = raw.trim()
    if (!line) continue

    let style = 'normal'
    let text = line

    if (line.startsWith('### ')) {
      style = 'h3'
      text = line.slice(4)
    }

    blocks.push({
      _type: 'block',
      _key: key(),
      style,
      markDefs: [],
      children: inlineSpans(text),
    })
  }
  return blocks
}

const ID = 'page-onboard-pricing'

// 🟡 SEO is a DRAFT — same convention as seed-terms.ts. {siteName} is the site-wide token resolved
// in buildSeoMetadata.
const SEO = {
  _type: 'seo',
  title: 'Onboard Pricing | {siteName}',
  description:
    'Onboard pricing for Mari Liveaboard cruises in Indonesia — dive equipment rental, park & port fees, fuel surcharge, and beverage prices payable in cash on board.',
  breadcrumbTitle: 'Onboard Pricing',
}

async function run() {
  // Report the lay of the land BEFORE writing anything.
  const existing = await client.fetch(
    `*[_type == "page" && (_id == $id || slug.current == "on-board-pricing")]{_id, title, "slug": slug.current}`,
    { id: ID },
  )
  console.log('existing matching `page` documents:', JSON.stringify(existing))

  const body = toPortableText(MD)
  const headings = body.filter((b) => b.style === 'h3').length
  console.log(`parsed body: ${body.length} blocks (${headings} h3)`)
  console.log('VERBATIM TABLE CONTENT for later seeding — see this script\'s header comment.')

  const doc = {
    _id: ID,
    _type: 'page',
    title: 'On Board Pricing',
    slug: { _type: 'slug', current: 'on-board-pricing' },
    body,
    showContactSection: true,
    seo: SEO,
  }

  await client.createOrReplace(doc)
  console.log(`${ID}: created/replaced`)

  // Seed LAW: a published-only patch leaves a stale draft shadowing it in Studio, so any existing
  // draft gets the same content. Never CREATE a draft that isn't already there.
  const draftId = `drafts.${ID}`
  const draftExists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id: draftId })
  if (draftExists) {
    await client
      .patch(draftId)
      .set({ title: doc.title, slug: doc.slug, body, showContactSection: true, seo: SEO })
      .commit()
    console.log(`${draftId}: patched`)
  } else {
    console.log(`${draftId}: not present, skipped`)
  }

  const check = await client.fetch(
    `*[_id == $id][0]{ title, "slug": slug.current, "blocks": count(body), "firstText": body[0].children[0].text, "seoTitle": seo.title }`,
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
