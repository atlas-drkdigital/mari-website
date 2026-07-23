import { getCliClient } from 'sanity/cli'

// Content-pass seed (2026-07-16) — populates the mocked-up pages + reference docs so the schema is
// reviewable with real content, per the "load content into every schema" rule (CLAUDE.md).
// Idempotent: createOrReplace with fixed IDs, safe to re-run. Placeholder/Figma-sourced content —
// tracked in _CONTENT-STATUS.md. Run: npx sanity exec _scripts/seed-content-pass.ts --with-user-token
const client = getCliClient({ apiVersion: '2024-01-01' })

// Portable Text helpers
let k = 0
const key = () => `k${k++}`
const block = (text: string) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text }],
})
const pt = (...paras: string[]) => paras.map(block)
const ref = (id: string) => ({ _type: 'reference', _ref: id })

const docs: Array<Record<string, unknown>> = [
  // --- Shared singletons ---
  {
    _id: 'destinationDefaults',
    _type: 'destinationDefaults',
    overviewEyebrow: '{destination} Liveaboard Indonesia Overview',
    galleryEyebrow: 'Discover the best',
    galleryTitle: 'Gallery',
    itinerariesHeading: '{destination} liveaboard itineraries',
    upcomingTripsEyebrow: 'Availability',
    upcomingTripsHeading: 'Upcoming {destination} liveaboard trips',
    upcomingTripsIntro:
      'Book directly through our scheduling partner to view real-time availability and reserve your cabin.',
    faqEyebrow: 'Good to know',
    faqHeading: '{destination} FAQ',
    boatsEyebrow: 'Sail {destination} in comfort',
    boatsHeading: 'About the boats',
    articlesEyebrow: 'Our journal',
    articlesHeading: '{destination} articles & news',
  },
  {
    _id: 'cta',
    _type: 'cta',
    cards: [
      {
        _key: 'privateCharter',
        _type: 'ctaCard',
        heading: 'Book a private charter',
        description:
          'Charter the entire boat for a private liveaboard adventure in Indonesia. Full itinerary flexibility, exclusive use, up to 14 guests.',
        buttonText: 'Find out more',
      },
      {
        _key: 'sharedTrip',
        _type: 'ctaCard',
        heading: 'Join a shared diving trip',
        description:
          "Join a scheduled dive cruise departure and dive Indonesia's best waters alongside fellow divers.",
        buttonText: 'Find a trip',
      },
    ],
  },

  // --- Komodo destination (referenced by blogPosts, itineraries, faqs — create first) ---
  {
    _id: 'destination-komodo',
    _type: 'destination',
    name: 'Komodo',
    pageTitle: 'Komodo Liveaboard',
    slug: { _type: 'slug', current: 'komodo' },
    tagline:
      'World-class scuba diving meets the legendary Komodo dragon in this UNESCO World Heritage national park.',
    stats: [
      { _key: 's1', _type: 'stat', label: 'Season', value: 'May to September' },
      { _key: 's2', _type: 'stat', label: 'Duration', value: '7 to 11 nights' },
      { _key: 's3', _type: 'stat', label: 'Minimum Skill Level', value: 'Open Water + 30 logged dives' },
    ],
    overviewHeading: 'Dry volcanic islands above, a living coral triangle below',
    overviewBody: pt(
      "As one of Indonesia's prime liveaboard diving destinations, Komodo is where many divers begin their first Indonesian liveaboard experience, thanks to its easy accessibility from Bali. The park sits in East Nusa Tenggara, about an hour by air from Bali. It holds UNESCO World Heritage status as a marine protected area within the Coral Triangle, the global center of marine biodiversity.",
      "Above water, Komodo is known for its namesake dragon: the world's largest lizard, found nowhere else on Earth. Below water, it delivers some of Indonesia's best scuba diving, a combination that makes Komodo a rare destination built for serious divers and non-divers alike.",
    ),
    highlights: [
      {
        _key: 'h1',
        _type: 'highlight',
        title: 'Swim with manta rays',
        body: pt('Manta cleaning stations and feeding aggregations, seen year-round at Komodo’s premier sites.'),
      },
      {
        _key: 'h2',
        _type: 'highlight',
        title: 'Meet the Komodo dragon',
        body: pt("A guided land excursion to see the world's largest lizard in its only wild habitat."),
      },
      {
        _key: 'h3',
        _type: 'highlight',
        title: 'Drift the pinnacles',
        body: pt("Nutrient-rich currents fuel some of Indonesia's most electric reef and pelagic action."),
      },
    ],
  },

  // --- Blog supporting docs ---
  {
    _id: 'author-mari',
    _type: 'author',
    name: 'Mari Liveaboard',
    bio: 'Trip reports, dive guides and destination know-how from the Mari Liveaboard team.',
  },
  { _id: 'blogCategory-travel-guide', _type: 'blogCategory', name: 'Travel Guide', slug: { _type: 'slug', current: 'travel-guide' } },
  { _id: 'blogCategory-specials', _type: 'blogCategory', name: 'Specials', slug: { _type: 'slug', current: 'specials' } },

  // --- Blog posts (placeholder — titles from the homepage mockup, bodies made up from mari-core) ---
  {
    _id: 'blogPost-raja-ampat-guide',
    _type: 'blogPost',
    title: 'Complete Guide to Diving in Raja Ampat',
    slug: { _type: 'slug', current: 'complete-guide-to-diving-in-raja-ampat' },
    category: ref('blogCategory-travel-guide'),
    author: ref('author-mari'),
    excerpt:
      'Everything you need to plan a Raja Ampat liveaboard trip: when to go, what you’ll see, and how to get there.',
    body: pt(
      'Raja Ampat sits at the heart of the Coral Triangle and holds the highest recorded marine biodiversity on Earth. For divers, that means walls, reefs and seamounts alive with soft corals, schooling fish and both reef and oceanic mantas.',
      'A liveaboard is the natural way to dive Raja Ampat, reaching the remote northern and southern sites that day boats can’t. This guide covers seasons, skill requirements and what a typical week aboard looks like.',
    ),
    postDate: '2026-01-08T09:00:00Z',
  },
  {
    _id: 'blogPost-bali-komodo-specials',
    _type: 'blogPost',
    title: 'Summer Specials: Bali & Komodo',
    slug: { _type: 'slug', current: 'summer-specials-bali-and-komodo' },
    category: ref('blogCategory-specials'),
    author: ref('author-mari'),
    relatedDestination: ref('destination-komodo'),
    excerpt: 'Limited summer departures combining Bali crossings with Komodo’s best diving.',
    body: pt(
      'Our summer season brings a handful of special departures that pair a Bali crossing with a full Komodo itinerary — manta season at its peak, dry-season conditions, and the chance to add a whale shark leg.',
      'Spaces on these dates are limited and tend to fill early. Reach out for current availability and pricing.',
    ),
    postDate: '2026-01-08T09:00:00Z',
  },
  {
    _id: 'blogPost-raja-ampat-beyond-diving',
    _type: 'blogPost',
    title: 'Best Things to Do in Raja Ampat: Beyond Diving',
    slug: { _type: 'slug', current: 'best-things-to-do-in-raja-ampat-beyond-diving' },
    category: ref('blogCategory-travel-guide'),
    author: ref('author-mari'),
    excerpt: 'Above the water, Raja Ampat is just as extraordinary — here’s what not to miss topside.',
    body: pt(
      'Between dives, Raja Ampat rewards you above the surface: the Wayag and Piaynemo viewpoints, hidden lagoons, birds of paradise at dawn, and quiet village visits.',
      'This guide covers the topside highlights worth building into a liveaboard week, and when to fit them around the diving.',
    ),
    postDate: '2026-01-08T09:00:00Z',
  },

  // --- Itineraries (from the mockup cards, referencing Komodo) ---
  {
    _id: 'itinerary-komodo-full-park',
    _type: 'itinerary',
    title: 'Komodo Full Park',
    destination: ref('destination-komodo'),
    duration: '7 nights',
    route: 'Bali to Labuan Bajo',
    highlights: ['Pinnacle drifts', 'Manta cleaning stations', 'Guided dragon encounter'],
    summary:
      'The complete Komodo liveaboard diving experience distilled into one efficient week: pinnacle drifts, manta cleaning stations and a guided dragon encounter, all without a single day lost to transit.',
  },
  {
    _id: 'itinerary-komodo-bali-whale-sharks',
    _type: 'itinerary',
    title: 'Komodo, Bali & Whale Sharks',
    destination: ref('destination-komodo'),
    duration: '11 nights',
    route: 'Bali to Labuan Bajo',
    highlights: ['Whale sharks at Saleh Bay', 'Komodo’s premier dive sites', 'Bali crossing'],
    summary:
      'A longer crossing that pairs Komodo’s best diving with a whale shark encounter and the scenic Bali-to-Labuan-Bajo route.',
  },
  {
    _id: 'itinerary-flores-komodo-bali-whale-sharks',
    _type: 'itinerary',
    title: 'Flores, Komodo, Bali & Whale Sharks',
    destination: ref('destination-komodo'),
    duration: '11 nights',
    route: 'Bali to Maumere',
    highlights: ['Whale sharks', 'Komodo diving', 'Flores coastline'],
    summary:
      'The full east-to-west route, adding the Flores coastline to Komodo and a whale shark leg on an eleven-night crossing.',
  },

  // --- Komodo FAQ items (scope: destination) ---
  {
    _id: 'faq-komodo-best-time',
    _type: 'faq',
    scope: 'destination',
    destination: ref('destination-komodo'),
    destinationCategory: 'Diving',
    question: 'When is the best time to dive Komodo?',
    answer: pt(
      'Komodo dives year-round, with the prime liveaboard season running May to September when conditions are driest and manta activity peaks in the south.',
    ),
  },
  {
    _id: 'faq-komodo-skill-level',
    _type: 'faq',
    scope: 'destination',
    destination: ref('destination-komodo'),
    destinationCategory: 'Diving',
    question: 'What is the minimum skill level to dive Komodo?',
    answer: pt(
      "Open Water certification with a minimum of 30 logged dives — Komodo's currents make it unsuitable for brand-new divers.",
    ),
  },
  {
    _id: 'faq-komodo-currents',
    _type: 'faq',
    scope: 'destination',
    destination: ref('destination-komodo'),
    destinationCategory: 'Diving',
    question: 'What are the currents like in Komodo?',
    answer: pt(
      'Komodo is known for strong, nutrient-rich currents that draw big marine life. Dives are guided and planned around the tides, and drift diving is part of the experience.',
    ),
  },
  {
    _id: 'faq-komodo-marine-life',
    _type: 'faq',
    scope: 'destination',
    destination: ref('destination-komodo'),
    destinationCategory: 'Diving',
    question: 'What marine life can I expect to see in Komodo?',
    answer: pt(
      'Komodo marine life is led by manta rays, both reef and oceanic species, seen year-round with gatherings of up to 50 at peak sites. Beyond mantas, diving in Komodo turns up reef sharks, dogtooth tuna, giant trevally and Napoleon wrasse on the pelagic side, plus pygmy seahorses, frogfish, ornate ghost pipefish and nudibranchs for macro divers. Occasional whale shark sightings happen but are not a primary draw here.',
    ),
  },
  {
    _id: 'faq-komodo-getting-there',
    _type: 'faq',
    scope: 'destination',
    destination: ref('destination-komodo'),
    destinationCategory: 'Traveling',
    question: 'How do I get to Komodo?',
    answer: pt(
      'Most guests fly into Labuan Bajo (Komodo Airport), about an hour from Bali, where the boat departs. Bali-to-Komodo crossings are also available on select itineraries.',
    ),
  },
  {
    _id: 'faq-komodo-whats-included',
    _type: 'faq',
    scope: 'destination',
    destination: ref('destination-komodo'),
    destinationCategory: 'General Information',
    question: 'What is included in a Mari trip?',
    answer: pt(
      'Your cabin, all meals, coffee, tea and drinking water, guided diving with tanks and weights, and onboard activities. Nitrox, alcohol, other beverages and equipment rental are additional.',
    ),
  },
]

async function run() {
  const tx = docs.reduce((t, doc) => t.createOrReplace(doc as never), client.transaction())
  await tx.commit()
  console.log(`Seeded ${docs.length} documents.`)
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
