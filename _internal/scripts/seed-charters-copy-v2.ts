import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Private Charters copy v2 — Codex's rewrite (_internal/content/private-charters-copy.md), approved by
// Adinda 2026-07-23 for first-round review ("good enough copy for first-round review, seed it").
// Replaces the seed-test placeholder body (fake booking ref, heading-ladder exercise, fabricated
// quote — all gone). set() on purpose: this REPLACES the old copy, on the published doc AND the
// open draft (the clobber rule). Benefits are IMAGES with title/caption fields — patched per
// index, asset refs untouched (Codex's numbering mirrors the current array 1:1, verified against
// _internal/content/charters-current-copy.md).

let keyN = 500
const k = (p: string) => `${p}-${++keyN}`
const block = (text: string, style: 'normal' | 'h3' = 'normal') => ({
  _type: 'block',
  _key: k('pc'),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: k('pcs'), marks: [], text }],
})

const OVERVIEW_BODY = [
  block(
    'A private charter on Mari begins with a simple distinction: you are not reserving a cabin on a shared departure, but taking the whole boat for your group alone. All seven sea-view ensuite cabins are yours. So are the three outdoor decks, the long lunches between dives, and the quiet shifts in pace that happen when nobody on board needs to compromise with strangers.',
  ),
  block(
    'That changes the character of the trip from the moment Mari leaves the harbor. The days still follow the water, but they do so on your terms. Up to 14 guests are looked after by 14 crew, and the experience remains all-inclusive on board, with accommodation, meals, crew, and the regular cruise program built into the charter.',
  ),
  block('What a private charter on Mari includes', 'h3'),
  block(
    'Mari is a traditional Indonesian Phinisi built for serious diving, but a private charter is about more than taking over the inventory of the boat. It is about having the space aboard feel coherent. Your group settles into its own rhythm. Coffee appears before the first briefing. Meals stretch a little longer. The deck is yours after the last dive, when the light drops and the horizon empties out.',
  ),
  block('How chartering works', 'h3'),
  block(
    'The practical side stays clear. You begin with dates, group size, destination interests, and the diving experience of the group. From there, the team proposes a route that suits both the season and the kind of trip you want to make, whether that means Komodo, Raja Ampat, Triton Bay, Banda Sea, or a longer eastern Indonesia combination. Once the plan is agreed, the charter is secured with a deposit and the details move forward from there.',
  ),
  block('Who private charters suit best', 'h3'),
  block(
    'Private charters suit guests who already know the value of traveling together. A dive club can keep the trip focused. A family can share the boat without losing privacy. A group of experienced friends can spend less time adapting to other people’s plans and more time enjoying the rare ease of a boat that feels entirely their own.',
  ),
  block('Seasons at a glance', 'h3'),
  block(
    'Komodo generally runs from April to September. Raja Ampat and the eastern seas generally take over from October to April, with shoulder periods between regions. If your dates are fixed, the route should follow the season. If the destination matters most, the right window usually reveals itself quickly.',
  ),
]

// Availability intro with the [contact us](#contact) link as a real annotation.
const contactKey = k('pclink')
const AVAILABILITY_INTRO = [
  {
    _type: 'block',
    _key: k('pc'),
    style: 'normal',
    markDefs: [{ _type: 'link', _key: contactKey, href: '#contact' }],
    children: [
      {
        _type: 'span',
        _key: k('pcs'),
        marks: [],
        text: 'Enter your group size, up to 14 guests, to see which departures can be booked as a private charter. Charter-only trips show pricing directly, while shared departures reveal the full-boat rate when you select "Book Charter." If a departure has no "Book Charter" button, it is not available to charter, so ',
      },
      { _type: 'span', _key: k('pcs'), marks: [contactKey], text: 'contact us' },
      { _type: 'span', _key: k('pcs'), marks: [], text: ' and we will help you find the right fit.' },
    ],
  },
]

const BENEFITS: { title: string; caption: string }[] = [
  {
    title: 'Exceptional Value',
    caption:
      'Mari brings together premium comfort, diver-focused operations, and personal service at exceptional value. For the right group, taking the whole boat can be a more compelling choice than assembling separate cabins on a scheduled trip.',
  },
  {
    title: 'Shaped Around Your Group',
    caption:
      'The route proposal begins with your dates, interests, and group makeup. From there, the trip takes on its own character, without the compromises that come with a shared departure.',
  },
  {
    title: '14 Crew for 14 Guests',
    caption:
      'Mari carries 14 crew for a maximum of 14 guests. The effect is not showiness, but ease: attentive service, smooth dive days, and a trip that never feels overrun.',
  },
  {
    title: 'The Whole Boat Is Yours',
    caption:
      'Every cabin, every deck, and every meal belongs to your group for the duration of the trip. It is a full-boat charter, all-inclusive on board, with the privacy that comes from having Mari entirely to yourselves.',
  },
]

async function run() {
  const flat = {
    heroHeadingIntro: 'Private Liveaboard Charter in',
    heroHeadingMain: 'Indonesia',
    heroSubheading:
      'The whole boat, shaped around your group. Up to 14 guests, 14 crew, seven sea-view ensuite cabins, and time to move through Indonesia at your own pace.',
    overviewEyebrow: 'Private Charter Overview',
    overviewHeading: 'Private liveaboard charter in Indonesia, with the boat entirely your own',
    overviewBody: OVERVIEW_BODY,
    benefitsEyebrow: 'Why Charter Mari',
    benefitsHeading: 'Private charter, with capable operations and a more personal pace',
    availabilityEyebrow: 'Check Availability',
    availabilityHeading: 'Available dates for private charters',
    availabilityIntro: AVAILABILITY_INTRO,
    availabilityCtaText: 'View Charter Availability',
    faqEyebrow: 'Good to Know',
    faqHeading: 'Private Charter FAQ & Booking Terms',
    faqLinkText: 'Read all FAQs',
    'seo.title': 'Private Liveaboard Charter in Indonesia | {siteName}',
    'seo.description':
      'Private liveaboard charter Indonesia aboard Mari. Full-boat trips for up to 14 guests, with 14 crew, seven sea-view ensuite cabins and all-inclusive stays.',
  }

  for (const id of ['privateCharters', 'drafts.privateCharters']) {
    const doc = await client.fetch(`*[_id == $id][0]{ _id, "n": count(benefits) }`, { id })
    if (!doc) {
      console.log(`${id}: not present, skipped`)
      continue
    }
    const benefitPaths: Record<string, string> = {}
    for (let i = 0; i < Math.min(BENEFITS.length, doc.n ?? 0); i++) {
      benefitPaths[`benefits[${i}].title`] = BENEFITS[i].title
      benefitPaths[`benefits[${i}].caption`] = BENEFITS[i].caption
    }
    await client.patch(id).set({ ...flat, ...benefitPaths }).commit()
    console.log(`${id}: copy v2 applied (${Object.keys(benefitPaths).length / 2} benefit titles/captions)`)
  }

  const check = await client.fetch(
    `*[_id == "privateCharters"][0]{ heroHeadingIntro, overviewHeading, "bodyBlocks": count(overviewBody), "b1": benefits[0].title, "b2": benefits[1].title, availabilityCtaText, "seoTitle": seo.title }`,
  )
  console.log('verify:', JSON.stringify(check))
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
