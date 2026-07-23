import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Full Komodo FAQ content from mari-website's destination-komodo.md draft (2026-07-22).
// REPLACES the sparse 6-question seed from an earlier session — same source document, so this is
// a re-seed, not a content change. Category titles + order follow the Figma mock (778:8696):
// Diving in Komodo / Traveling to Komodo / General Information.
// Skipped (draft says [VERIFY POLICY WITH SERGE], no answer exists): children policy, non-diver
// policy. They join the doc when Serge confirms — tracked in the skill's open items.
// Draft status: content is DRAFT-quality per the skill file (copy retouch + verify pass pending
// before launch) — tagged in _CONTENT-STATUS.md, which is the pre-launch gate for it.

let k = 0
const key = () => `seed${(k++).toString().padStart(3, '0')}`

function answer(...paragraphs: string[]) {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }))
}

function q(question: string, ...paragraphs: string[]) {
  return { _type: 'faqItem', _key: key(), question, answer: answer(...paragraphs) }
}

const FAQ_SECTIONS = [
  {
    _type: 'faqSection',
    _key: 'diving',
    title: 'Diving in Komodo',
    questions: [
      q(
        'What is it like to dive Komodo?',
        'Komodo scuba diving is fast, current-driven and never dull. Expect drift dives over pinnacles thick with fish, manta rays circling cleaning stations and macro life dense enough to rival dedicated muck destinations, often all within a single liveaboard trip.',
      ),
      q(
        'What is the minimum skill level for diving Komodo?',
        'Open Water certification plus 30 logged dives is the minimum, though Advanced Open Water is recommended. Komodo’s currents are strong and variable, so prior drift diving experience is strongly advised even if you meet the minimum on paper.',
      ),
      q(
        'What are the currents like in Komodo?',
        'Strong to very strong at most sites, and the defining feature of Komodo diving. Currents vary with tide and lunar cycle, and downcurrents are possible at steep drop-offs, so an SMB/DSMB is mandatory, not optional. Reef hooks are used at several northern pinnacle sites, and live pickup by tender is standard practice.',
      ),
      q(
        'What marine life can I expect?',
        'Komodo marine life is led by manta rays, both reef and oceanic species, seen year-round with gatherings of up to 50 at peak sites. Beyond mantas, diving in Komodo turns up reef sharks, dogtooth tuna, giant trevally and Napoleon wrasse on the pelagic side, plus pygmy seahorses, frogfish, ornate ghost pipefish and nudibranchs for macro divers. Occasional whale shark sightings happen but are not a primary draw here.',
      ),
      q(
        'What is the best time to dive Komodo?',
        'Komodo’s diving season runs year-round, though the transition months of March to May and September to November give the fullest access to both north and south. Peak liveaboard season is June to September, when most trips run and conditions stay calmest in the north and central park. South Komodo has its own diving season, November to February, when conditions are clearest and Manta Alley is most reliably reached.',
      ),
      q(
        'What is the water temperature in Komodo?',
        'Water temperature varies significantly by zone. North Komodo runs 27°C to 29°C (81°F to 84°F), central Komodo 26°C to 28°C (79°F to 82°F), and south Komodo drops to 22°C to 24°C (72°F to 75°F), falling as low as 21°C (70°F) in July and August. A 3mm wetsuit covers the north, but bring a 5mm minimum, ideally 7mm or two layers, if you’re diving south.',
      ),
      q(
        'What is the visibility like in Komodo?',
        'Visibility also splits sharply by zone. North Komodo typically runs 25 to 40 meters (82 to 131 feet) of clear blue water, central Komodo 20 to 30 meters (66 to 98 feet), and south Komodo drops to 6 to 15 meters (20 to 49 feet). The lower visibility in the south is a trade-off for the nutrient-rich water that drives its exceptional macro life.',
      ),
      q(
        'What is the difference between north, central and south Komodo?',
        'North Komodo is warm, clear and current-intense, built around open-water pinnacles and fish aggregations. Central Komodo is the most topographically varied zone, mixing wide-angle sites like Batu Bolong with Manta Point’s reliable manta encounters. South Komodo is cold, lower-visibility and nutrient-rich, home to macro-dense walls and pinnacles that rival dedicated muck-diving destinations.',
      ),
      q(
        'Can beginners dive in Komodo National Park?',
        'Not really, and it’s worth being direct about that. Most of Komodo’s signature sites carry real difficulty: strong current, negative entries and live pickups that are unsuitable for beginner divers. A handful of sheltered sites exist, mainly in the south, but Komodo as a whole rewards experienced divers far more than first-timers.',
      ),
      q(
        'Can I get my diving certification in Komodo?',
        'Yes, subject to availability and at an additional cost. Contact our team before booking to check course availability and discuss options, since not every itinerary has room in the schedule for training dives.',
      ),
    ],
  },
  {
    _type: 'faqSection',
    _key: 'travel',
    title: 'Traveling to Komodo',
    questions: [
      q(
        'How do I get to Komodo?',
        'Fly into Bali or Jakarta internationally, then take a short domestic flight to your trip’s embarkation point. Labuan Bajo, Bali and Maumere (Flores) all serve as embark or disembark ports depending on your itinerary. Labuan Bajo is Komodo’s own airport, and the domestic flight from Bali takes about an hour.',
      ),
      q(
        'What airport do I fly into?',
        'It depends on where your itinerary starts and ends. Labuan Bajo (LBJ) is Komodo’s airport and the endpoint for most trips, but some itineraries begin or end in Bali or Maumere instead, so check your specific departure and arrival ports before booking flights.',
        'Most guests connect through Bali internationally, though Jakarta also works as a gateway. Domestic flights in Indonesia are prone to delays, so build in buffer time rather than a same-day international-to-domestic connection.',
      ),
      q(
        'What are the park fees?',
        'Park fees vary depending on itinerary duration. See our Schedule & Rates page or click on your chosen itinerary for a full cost breakdown.',
      ),
      q(
        'What should I pack for a Komodo liveaboard?',
        'Pack a 5mm wetsuit at minimum, with a 7mm or a second thin layer if you plan to dive south Komodo, where water drops to 21°C to 24°C (70°F to 75°F). An SMB/DSMB is mandatory at nearly every site, so bring your own, along with a reef hook for the north’s pinnacle currents.',
        'Add reef-safe sunscreen, seasickness medication if you’re prone to it and camera gear. Komodo rewards both wide-angle and macro shooters.',
      ),
      q(
        'Is Komodo a good destination to combine with Bali?',
        'Yes. Labuan Bajo is about an hour from Bali by air, making Komodo one of the easiest liveaboard destinations to pair with a Bali vacation. Many guests spend a few days in Bali before or after their Komodo trip, combining a classic beach and culture stop with a serious diving liveaboard.',
      ),
    ],
  },
  {
    _type: 'faqSection',
    _key: 'general',
    title: 'General Information',
    questions: [
      q(
        'What are some non-diving activities in Komodo?',
        'Komodo offers plenty for non-divers and rest days alike. Guided walks on Komodo and Rinca islands bring you face to face with Komodo dragons, always with a mandatory guide, since these are genuinely dangerous animals. Padar Island’s hike rewards you with one of Indonesia’s most photographed panoramic views, and Pink Beach offers snorkeling and sunset stops on one of the world’s few naturally pink-sand beaches. Village visits round out the topside program.',
      ),
    ],
  },
]

async function run() {
  for (const id of ['destination-komodo', 'drafts.destination-komodo']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) { console.log(`${id}: does not exist, skipping`); continue }
    await client.patch(id).set({ faqSections: FAQ_SECTIONS }).commit()
    console.log(`${id}: faqSections seeded (${FAQ_SECTIONS.map((s) => s.questions.length).join('/')} questions)`)
  }
  await client.patch('destinationDefaults').setIfMissing({ faqLinkText: 'Read All FAQ' }).commit()
  console.log('destinationDefaults: faqLinkText seeded')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
