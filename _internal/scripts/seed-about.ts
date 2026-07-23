import { createReadStream } from 'node:fs'

import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// About page seed (2026-07-23). Copy source: _internal/content/about-page.md — Codex's approved draft
// (Adinda: "you can use About-page.md"), seeded VERBATIM; deviations are wording-neutral block
// splits only. Hero photo: the crew-folder master, uploaded FULL-RES AS-IS (upload-full-res rule;
// 1538×1023 is the library's known ceiling — Adinda accepted the resolution on sight of the
// photo). setIfMissing throughout so re-runs never clobber Studio edits; the placeholder crew
// member is tracked in _internal/CONTENT-STATUS.md as 🔴 replace-before-launch.

const HERO_FILE = 'G:/My Drive/##MARI/02. IMAGES/crew/mari-liveaboard-crew-001-boat-exterior.jpg'
const HERO_ALT =
  "Mari Liveaboard's crew waving from the bowsprit of the traditional Phinisi at anchor in Indonesia"

let keyN = 0
const k = (p: string) => `${p}-${++keyN}`
const block = (text: string, style: 'normal' | 'h3' = 'normal') => ({
  _type: 'block',
  _key: k('ab'),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: k('abs'), marks: [], text }],
})

const OVERVIEW_BODY = [
  block('Where Mari’s Story Began', 'h3'),
  block(
    'Mari was built in 2008 by the Phinisi boat builders of South Sulawesi, where generations of knowledge are carried through timber, proportion and craft. Constructed from ironwood and teak, she belongs to a living Indonesian maritime tradition shaped by long passages through the archipelago.',
  ),
  block(
    'Her history gives Mari character, but it does not define the experience alone. Today, that traditional foundation supports a clear purpose: to take serious divers into Indonesia’s remarkable waters with capable operations, personal service and the freedom of a small vessel.',
  ),
  block('Why Mari Liveaboard Exists', 'h3'),
  block(
    'Mari Liveaboard was shaped around a simple idea. A premium diving journey should invest in what matters on the water, without unnecessary spectacle.',
  ),
  block(
    'That means an experienced dive team, a maximum of 14 guests and a crew large enough to keep service attentive throughout the voyage. It means space to prepare properly, recover between dives and watch the islands pass at the pace of the boat. Everything has a role, from the way the dive operation moves to the quiet rhythm of life on deck.',
  ),
  block(
    'The result is not an attempt to be an ultra-luxury resort at sea. It is something more focused: a traditional Phinisi liveaboard for serious divers, offering premium comfort and exceptional value.',
  ),
  block('A New Chapter Under Dedicated Management', 'h3'),
  block(
    'Mari is owned and operated by PT Wisata Laut Indah, with owner Stefan Meyer responsible for the long-term direction of the business. Director Mila Meyer supports its formal management, while consultant Serge Dahan leads day-to-day operational decisions. Reservations are managed by Ayu Patty, giving guests a direct point of contact from their first inquiry.',
  ),
  block(
    'Behind the business is an Indonesian crew of captains, dive guides, machinists, deck crew and cooks who make each journey possible. Their work is practical, detailed and often quiet. Together with the cruise director, they connect the decisions made on shore with the experience delivered at sea.',
  ),
  block('Looking Ahead', 'h3'),
  block(
    'Mari’s next chapter is grounded in the same qualities that have carried her this far: Indonesian craftsmanship, capable people and a respect for the waters she travels through.',
  ),
  block(
    'The aim is measured rather than grand. To run thoughtful voyages, care for the boat and give divers the time, support and space to experience Indonesia properly.',
  ),
]

const CREW_INTRO = [
  block(
    'Mari Liveaboard is run by people who understand that a successful voyage begins well before departure. Our shore-based management and reservations team works alongside 14 crew aboard Mari, bringing together local knowledge, careful planning and attentive service at sea.',
  ),
]

async function run() {
  // Idempotent upload: reuse the asset if this exact filename was already uploaded.
  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == "mari-liveaboard-crew-001-boat-exterior.jpg"][0]._id`,
  )
  const assetId =
    existing ??
    (await client.assets.upload('image', createReadStream(HERO_FILE), {
      filename: 'mari-liveaboard-crew-001-boat-exterior.jpg',
    }))._id
  console.log(`hero asset: ${assetId}${existing ? ' (reused)' : ' (uploaded full-res)'}`)

  // Placeholder crew member so the Crew section's layout is QA-able (🔴 replace before launch).
  await client.createIfNotExists({
    _id: 'crewMember-placeholder',
    _type: 'crewMember',
    name: 'Placeholder — Replace',
    position: 'Cruise Director',
    bio: 'Placeholder bio. Replace with the crew member’s real story — where they are from, their years at sea, and what guests remember about sailing with them.',
  })

  await client.createIfNotExists({ _id: 'aboutPage', _type: 'aboutPage' })
  const patch = {
    name: 'About',
    heroHeadingIntro: 'The Story of Mari',
    heroHeadingMain: 'Built from tradition. Guided by purpose.',
    heroSubheading:
      'A South Sulawesi Phinisi with a long history at sea, now owned and operated by a team focused on serious diving in Indonesia.',
    heroImage: { _type: 'imageWithAlt', asset: { _type: 'reference', _ref: assetId }, alt: HERO_ALT },
    overviewEyebrow: 'Our Story',
    overviewHeading: 'A Traditional Indonesian Phinisi With Diving at Its Heart',
    overviewBody: OVERVIEW_BODY,
    crewEyebrow: 'The People Behind Mari',
    crewHeading: 'One Team, From Shore to Sea',
    crewIntro: CREW_INTRO,
    crewViewMoreText: 'Meet the Team',
    crewMembers: [{ _type: 'reference', _key: k('cm'), _ref: 'crewMember-placeholder' }],
    seo: {
      title: 'About Us — The Story of Mari | {siteName}',
      description:
        'Mari is a traditional South Sulawesi Phinisi run by a dedicated team for serious divers in Indonesia. Meet the people and the story behind the boat.',
    },
  }
  for (const id of ['aboutPage', 'drafts.aboutPage']) {
    const exists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: not present, skipped`)
      continue
    }
    await client.patch(id).setIfMissing(patch).commit()
    console.log(`${id}: seeded (setIfMissing)`)
  }

  const check = await client.fetch(
    `*[_id == "aboutPage"][0]{ name, heroHeadingMain, "hasHero": defined(heroImage.asset), "bodyBlocks": count(overviewBody), "crew": count(crewMembers), "seoTitle": seo.title }`,
  )
  console.log('verify:', JSON.stringify(check))
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
