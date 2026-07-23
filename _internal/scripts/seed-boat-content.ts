import { getCliClient } from 'sanity/cli'

// Applies the APPROVED boat-page copy from _internal/content-scratch/_boat.md to Sanity (2026-07-20). Run:
//   npx sanity exec _internal/scripts/seed-boat-content.ts --with-user-token
//
// 🔴 PATCHES BOTH THE PUBLISHED DOC *AND* ITS DRAFT, for every document it touches.
// This is the rule, not a nicety. Sanity keeps `<id>` and `drafts.<id>` separately, and STUDIO SHOWS
// THE DRAFT. Patching published-only means the site updates while Studio still shows old copy — and
// the editor's next Publish silently reverts everything. That exact bug happened earlier today with
// the boat tagline. Any seed that may run against a document with an open draft must do this.
// (Related trap: querying drafts over the PUBLIC api returns nothing with no error — drafts need an
// authenticated request. `npx sanity documents query`, never plain curl.)
//
// Source of truth is _internal/content-scratch/_boat.md, which carries Adinda's approval. Copy is NOT reworded here;
// if something reads wrong, fix the markdown and re-run rather than editing this file.
const client = getCliClient({ apiVersion: '2024-01-01' })

// --- Portable Text helpers (same shape as seed-homepage.ts) ---
let k = 0
const key = () => `bc${k++}`
const block = (text: string) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text }],
})
const pt = (...paras: string[]) => paras.map(block)

// ── BOAT ──────────────────────────────────────────────────────────────────────────────────────
const BOAT = {
  pageTitle: 'Mari Liveaboard',
  tagline: 'A traditional Phinisi liveaboard for serious divers.',

  seo: {
    // NOTE: _boat.md flags the keyword target as PROVISIONAL, pending keyword research. This title
    // is the approved draft, not a final SEO decision.
    title: 'Mari Phinisi | Indonesia Diving Liveaboard',
    description:
      'Step aboard Mari, a 30m Indonesian Phinisi for serious divers, with seven sea-view cabins, 14 crew, onboard Nitrox and space for just 14 guests.',
  },

  overviewHeading: 'Tradition at heart. Diving by design.',
  overviewBody: pt(
    'Built in South Sulawesi from ironwood and teak, Mari is a 30m traditional Indonesian Phinisi shaped for voyages through the archipelago. She carries just 14 guests, preserving the intimacy of a small boat while offering the space and capability demanded by days spent diving far from shore.',
    'Life aboard follows the water. A cruise director and three dive guides lead the operation, supported by three tenders, 29 tanks and Nitrox produced onboard. Entries are efficient, surface intervals unhurried and the next dive is never far from mind.',
    'Above deck, the pace softens. Lunch is served in the open air, framed by 270° sea views. There are shaded corners for the heat of the afternoon and open spaces for watching forested islands recede into blue.',
    'All seven cabins sit on the main deck, each with a sea view, private air conditioning and an ensuite bathroom with hot water. With 14 crew for 14 guests, service remains attentive without becoming theatrical.',
    'Mari is premium where it counts: in the diving, the sense of space and the quiet competence of the people running the journey. Everything necessary for reaching Indonesia’s remarkable waters, with little that distracts from them.',
  ),

  keyFeatures: [
    'A 30m traditional Indonesian Phinisi',
    'Seven main-deck cabins, all with sea views',
    'No more than 14 guests',
    '14 crew, including four dive staff',
    'Three tenders supporting the dive program',
    'Nitrox produced onboard',
    '29 tanks in 12L and 15L sizes',
    '50 sqm al fresco dining area',
    'Bar and 270° views across the water',
  ],

  cabinsIntro: pt(
    'Every cabin aboard Mari is found on the main deck, where sea views and natural light bring the journey inside. Private air conditioning, an ensuite bathroom and hot water make each one a comfortable retreat between dives.',
  ),

  galleryDescription: pt(
    'A liveaboard is experienced in the intervals: the quiet before an early descent, lunch overlooking an empty horizon and the slow return through the islands at dusk. Explore the spaces where those moments unfold aboard Mari.',
  ),
}

// Gallery tabs. Categories are matched to what already exists on the document so the tab order and
// the image-tag values are preserved — only heading and body are replaced.
const GALLERY_TABS: Record<string, { heading: string; body: string }> = {
  'The Boat': {
    heading: 'A Phinisi made for the journey',
    body: 'Built in the boatbuilding tradition of South Sulawesi, Mari brings together ironwood, teak and the unmistakable lines of an Indonesian Phinisi. Her proportions leave room for life to unfold easily, even with a full complement of 14 guests.',
  },
  Dining: {
    heading: 'The best table is open to the sea',
    body: 'Meals are served in Mari’s 50 sqm al fresco dining area, where the bar and 270° views turn even an ordinary breakfast into part of the voyage. The menu moves between Indonesian and Western cooking, with dietary requirements accommodated when arranged in advance.',
  },
  Diving: {
    heading: 'Serious diving, quietly well run',
    body: 'Three tenders, 29 tanks and Nitrox produced onboard keep the operation moving without unnecessary fuss. A cruise director and three dive guides lead each day, allowing the experience to remain personal from the first briefing to the final ascent.',
  },
  Relaxation: {
    heading: 'The luxury of time between dives',
    body: 'There is space aboard Mari to step away from the rhythm of the group. Find some shade, stretch out in the open air or spend the surface interval watching Indonesia’s islands pass at the pace of the boat.',
  },
  Others: {
    heading: 'Comfort, considered',
    body: 'Every cabin has private air conditioning, an ensuite bathroom and hot water. Two reverse-osmosis systems produce up to 10,000L of fresh water each day, quietly supporting longer voyages into remote waters.',
  },
}

// FAQ. _boat.md calls these "Suggested FAQs" — they are approved copy but were never confirmed as
// the final published set, so they go into the existing section rather than replacing it wholesale.
const FAQS = [
  {
    question: 'What kind of boat is Mari?',
    answer:
      'Mari is a 30m traditional Indonesian Phinisi built in South Sulawesi. She operates as a diving liveaboard for a maximum of 14 guests, with seven main-deck cabins, three tenders, onboard Nitrox and a crew of 14.',
  },
  {
    question: 'How many guests can stay aboard Mari?',
    answer:
      'Mari accommodates a maximum of 14 guests across seven sea-view cabins. Three are Deluxe Cabins with flexible bed arrangements, while four are Superior Cabins with bunk beds for up to two guests.',
  },
  {
    question: 'Does Mari offer Nitrox?',
    answer:
      'Yes. Mari produces Nitrox onboard through an NRC membrane system. Nitrox is available to certified Nitrox divers at an additional charge and should be requested as part of the trip arrangements.',
  },
]

// ── BOAT DEFAULTS (shared section chrome) ─────────────────────────────────────────────────────
const DEFAULTS = {
  overviewEyebrow: 'The Boat',
  keyFeaturesHeading: 'The character of Mari',
  cabinsEyebrow: 'Cabins',
  cabinsHeading: 'A private view of the sea',
  galleryEyebrow: 'Life Aboard',
  galleryTitle: 'Between one dive and the next',
}

// ── CABIN TYPES ───────────────────────────────────────────────────────────────────────────────
// ⚠️ _boat.md gives each cabin a HEADING ("Flexible space for travelling together" / "Designed for
// dive companions"). `cabinType` HAS NO FIELD FOR IT — only name + description — and BoatCabins
// renders the name as the h3. Those two headings are therefore NOT written by this script; adding
// them needs a schema field and a render change. Flagged to Adinda rather than silently dropped or
// jammed into the description.
const CABINS: Record<string, { description: ReturnType<typeof pt> }> = {
  'cabinType-mari-deluxe': {
    description: pt(
      'Mari’s three Deluxe Cabins can be arranged as a double or twin, with an additional bed available. Their adaptable layout works well for couples, families and small groups sharing the voyage.',
      'Natural light, a sea view and a private ensuite create an easy place to return to after the day’s diving.',
    ),
  },
  'cabinType-mari-superior': {
    description: pt(
      'The four Superior Cabins use a practical bunk-bed arrangement for up to two guests. They are particularly well suited to solo travellers and dive buddies who prefer to share.',
      'Like every cabin aboard Mari, each is located on the main deck and includes a sea view, private air conditioning and an ensuite bathroom with hot water.',
    ),
  },
}

// Patch a document AND its draft, but only the draft if one actually exists — creating a draft where
// there wasn't one would put the document into an unpublished-changes state the editor never asked
// for.
async function patchBoth(publishedId: string, patch: Record<string, unknown>, label: string) {
  await client.patch(publishedId).set(patch).commit()
  console.log(`  ✅ ${label} (published)`)

  const draftId = `drafts.${publishedId}`
  const draft = await client.fetch<{ _id: string } | null>('*[_id == $id][0]{_id}', { id: draftId })
  if (draft) {
    await client.patch(draftId).set(patch).commit()
    console.log(`  ✅ ${label} (draft)`)
  } else {
    console.log(`  –  ${label}: no draft, skipped`)
  }
}

async function run() {
  // Gallery tabs: rebuild from the EXISTING array so _key and category survive. Never regenerate
  // _key values — Sanity uses them for array identity, and new keys would look like every tab was
  // deleted and recreated (breaking any in-flight edits and the tab order).
  const existingTabs = await client.fetch<{ _key: string; category?: string }[] | null>(
    '*[_id == "boat-mari"][0].galleryTabs[]{_key, category}',
  )
  const galleryTabs = (existingTabs ?? []).map((tab) => {
    const copy = tab.category ? GALLERY_TABS[tab.category] : undefined
    if (!copy) {
      console.log(`  ⚠️  gallery tab "${tab.category}" has no copy in _boat.md — left unchanged`)
      return null
    }
    return { ...tab, heading: copy.heading, body: pt(copy.body) }
  })
  const tabsPatch = galleryTabs.every(Boolean)
    ? { galleryTabs: galleryTabs as unknown[] }
    : {}

  // FAQ: replace the questions of the FIRST section only, preserving its _key and title.
  const faqSections = await client.fetch<{ _key: string; title?: string }[] | null>(
    '*[_id == "boat-mari"][0].faqSections[]{_key, title}',
  )
  const faqPatch =
    faqSections && faqSections.length
      ? {
          faqSections: [
            {
              ...faqSections[0],
              questions: FAQS.map((f) => ({
                _key: key(),
                question: f.question,
                answer: pt(f.answer),
              })),
            },
            ...faqSections.slice(1),
          ],
        }
      : {}

  await patchBoth('boat-mari', { ...BOAT, ...tabsPatch, ...faqPatch }, 'Boat — Mari')
  await patchBoth('boatDefaults', DEFAULTS, 'Boat Defaults')
  for (const [id, data] of Object.entries(CABINS)) {
    await patchBoth(id, data, id.replace('cabinType-mari-', 'Cabin: '))
  }
}

run().then(
  () => {
    console.log('\nDone. Reload Studio.')
    console.log('⚠️  NOT written (no schema field exists): the per-cabin headings from _boat.md —')
    console.log('    "Flexible space for travelling together" / "Designed for dive companions".')
  },
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
