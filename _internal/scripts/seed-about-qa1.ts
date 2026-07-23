import { createReadStream } from 'node:fs'

import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// About QA round 1 (Adinda, 2026-07-23):
// 1. Hero heading split: intro (small) = "The Story of Mari: Built from tradition." /
//    main (display) = "Guided by purpose."
// 2. Headings to SENTENCE CASE (the editorial convention — H2s AND body h3s; Codex's draft was
//    title case).
// 3. The sail-up crew photo inserted INSIDE the overview body after the first paragraph
//    (full-res upload, no pre-compression — the locked pipeline rule).
// 4. FOUR placeholder crew members with Pexels stock portraits so the grid + bio modal are
//    QA-able (replaces the single text-only placeholder). 🔴 Fake people, stock photos —
//    replace with the real crew before launch (_internal/CONTENT-STATUS.md).
// set() on purpose (not setIfMissing) — this REVISES the earlier seed per her QA.
// NOTE: her copy edit to _internal/content/about-page.md is pending; the body text here matches the
// currently-seeded text and gets re-seeded (with this same image block) when she's done.

const SAIL_FILE = 'G:/My Drive/##MARI/02. IMAGES/crew/mari-liveaboard-crew-002-sail-up.png'
const SCRATCH =
  'C:/Users/adind/AppData/Local/Temp/claude/c--Users-adind-OneDrive-Desktop-mari-mari-website/8f8c668b-16d8-403a-8267-853d5520798b/scratchpad/crew'

const CREW: { id: string; file: string; name: string; position: string; bio: string; photoAlt: string }[] = [
  {
    id: 'crewMember-placeholder-1',
    file: `${SCRATCH}/pexels-220453.jpg`,
    name: 'Putra Wijaya',
    position: 'Cruise Director',
    bio: 'Placeholder bio. Putra connects the shore team with life on board, hosting briefings and making sure every guest knows what the day holds — from the first dive to the last sunset on deck.',
    photoAlt: 'Placeholder portrait of a smiling crew member',
  },
  {
    id: 'crewMember-placeholder-2',
    file: `${SCRATCH}/pexels-774909.jpg`,
    name: 'Dewi Anggraini',
    position: 'Reservations Manager',
    bio: 'Placeholder bio. Dewi is the first voice guests hear — she manages every inquiry and booking from shore, and stays reachable from first contact to the day the group steps aboard.',
    photoAlt: 'Placeholder portrait of a smiling crew member',
  },
  {
    id: 'crewMember-placeholder-3',
    file: `${SCRATCH}/pexels-733872.jpg`,
    name: 'Maya Sari',
    position: 'Lead Dive Guide',
    bio: 'Placeholder bio. Maya has logged thousands of dives across the archipelago and leads the briefings, currents and critters of every itinerary Mari sails.',
    photoAlt: 'Placeholder portrait of a crew member outdoors',
  },
  {
    id: 'crewMember-placeholder-4',
    file: `${SCRATCH}/pexels-415829.jpg`,
    name: 'Rina Putri',
    position: 'Chef',
    bio: 'Placeholder bio. Rina runs the galley — Indonesian classics and fresh catches timed around the dive schedule, with long lunches when the crossing allows.',
    photoAlt: 'Placeholder portrait of a crew member',
  },
]

let keyN = 100
const k = (p: string) => `${p}-${++keyN}`
const block = (text: string, style: 'normal' | 'h3' = 'normal') => ({
  _type: 'block',
  _key: k('ab'),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: k('abs'), marks: [], text }],
})

async function uploadOnce(filePath: string, filename: string): Promise<string> {
  const existing = await client.fetch(`*[_type == "sanity.imageAsset" && originalFilename == $fn][0]._id`, {
    fn: filename,
  })
  if (existing) return existing
  const asset = await client.assets.upload('image', createReadStream(filePath), { filename })
  return asset._id
}

async function run() {
  // Sail-up photo, full-res PNG as-is.
  const sailId = await uploadOnce(SAIL_FILE, 'mari-liveaboard-crew-002-sail-up.png')
  console.log(`sail-up asset: ${sailId}`)

  // Crew placeholders.
  const refs = []
  for (const m of CREW) {
    const photoId = await uploadOnce(m.file, `crew-placeholder-${m.file.split('/').pop()}`)
    await client.createOrReplace({
      _id: m.id,
      _type: 'crewMember',
      name: m.name,
      position: m.position,
      bio: m.bio,
      photo: { _type: 'imageWithAlt', asset: { _type: 'reference', _ref: photoId }, alt: m.photoAlt },
    })
    refs.push({ _type: 'reference', _key: k('cm'), _ref: m.id })
    console.log(`crew doc: ${m.id} (${m.name} — ${m.position})`)
  }

  // Body text = Adinda's 2026-07-23 edit of _internal/content/about-page.md VERBATIM (management-names
  // section removed by her — private info), with the h3s sentence-cased per her convention call
  // and the sail-up image inserted after the first paragraph (her placement call).
  const OVERVIEW_BODY = [
    block('Where Mari’s story began', 'h3'),
    block(
      'Built in 2008 by the Phinisi boat builders of South Sulawesi, Mari represents generations of knowledge, carried through timber, proportion and craft. Constructed from ironwood and teak, she belongs to a living Indonesian maritime tradition shaped by long passages through the archipelago.',
    ),
    {
      _type: 'image',
      _key: k('abimg'),
      asset: { _type: 'reference', _ref: sailId },
      alt: 'Mari Liveaboard under full sail in Indonesian waters',
      caption: 'Mari with her sails up',
      size: 'full',
      alignment: 'center',
    },
    block(
      'Her history gives Mari character, but it does not define the experience alone. Today, that traditional foundation supports a clear purpose: to take serious divers into Indonesia’s remarkable waters with capable operations, personal service and the freedom of a small vessel.',
    ),
    block('Why Mari Liveaboard exists', 'h3'),
    block(
      'Mari liveaboard was shaped around a simple idea. A premium diving journey should invest in what matters on the water, without unnecessary spectacle.',
    ),
    block(
      'That means an experienced dive team, a maximum of 14 guests and a crew large enough to keep service attentive throughout the voyage. It means space to prepare properly, recover between dives and watch the islands pass at the pace of the boat. Everything has a role, from the way the dive operation moves to the quiet rhythm of life on deck.',
    ),
    block(
      'The result is not an attempt to be an ultra-luxury resort at sea. It is something more focused: a traditional Phinisi liveaboard for serious divers, offering premium comfort and exceptional value.',
    ),
    block('Looking ahead', 'h3'),
    block(
      'Mari’s next chapter is grounded in the same qualities that have carried her this far: Indonesian craftsmanship, capable seamen and dive staff, and a respect for the waters she travels through.',
    ),
    block(
      'The aim is measured rather than grand. To run thoughtful voyages, care for the boat and give divers the time, support and space to experience Indonesia properly.',
    ),
  ]

  const patch = {
    heroHeadingIntro: 'The Story of Mari: Built from Tradition.',
    heroHeadingMain: 'Guided by purpose.',
    overviewHeading: 'A traditional Indonesian Phinisi with diving at its heart',
    overviewBody: OVERVIEW_BODY,
    crewHeading: 'One team, from shore to sea',
    crewMembers: refs,
  }
  for (const id of ['aboutPage', 'drafts.aboutPage']) {
    const exists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: not present, skipped`)
      continue
    }
    await client.patch(id).set(patch).commit()
    console.log(`${id}: QA-1 revisions applied`)
  }

  // The old single text-only placeholder is now unreferenced — remove it.
  try {
    await client.delete('crewMember-placeholder')
    console.log('old crewMember-placeholder deleted')
  } catch {
    console.log('old crewMember-placeholder not deletable (referenced or absent) — left in place')
  }

  const check = await client.fetch(
    `*[_id == "aboutPage"][0]{ heroHeadingIntro, heroHeadingMain, overviewHeading, crewHeading, "crew": count(crewMembers), "bodyBlocks": count(overviewBody), "hasBodyImage": count(overviewBody[_type == "image"]) }`,
  )
  console.log('verify:', JSON.stringify(check))
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
