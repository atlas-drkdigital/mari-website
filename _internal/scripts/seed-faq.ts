import { getCliClient } from 'sanity/cli'

// FAQ restructure seed (2026-07-16). Rebuilds the General FAQ onto the new category set, gives the
// boat and Komodo their own inline faqSections, and deletes the retired `faq` documents.
// Idempotent: createOrReplace / patch with fixed IDs, safe to re-run.
// Run: npx sanity exec _internal/scripts/seed-faq.ts --with-user-token
//
// Content sourced from the mari-core skill (core/boat.md, core/commercial.md) and the existing
// Komodo faq docs. Voice rules applied: no em dashes, no exclamation marks, "premium" not "luxury",
// metric first. Every answer is ANSWER-FIRST (a direct answer in the first sentence or two, then
// detail) per the FAQ SEO/AEO decision record in _internal/SCHEMA-SPECS.md.
const client = getCliClient({ apiVersion: '2024-01-01' })

let k = 0
const key = () => `f${k++}`
const block = (text: string) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text }],
})
const pt = (...paras: string[]) => paras.map(block)

type Q = { q: string; a: string[]; featured?: boolean }
const section = (title: string, questions: Q[]) => ({
  _type: 'faqSection',
  _key: key(),
  title,
  questions: questions.map((item) => ({
    _type: 'faqItem',
    _key: key(),
    question: item.q,
    answer: pt(...item.a),
    ...(item.featured ? { isFeatured: true } : {}),
  })),
})

// ---------- General FAQ: cross-cutting only (true regardless of trip or boat) ----------
const faqGeneral = {
  _id: 'faqGeneral',
  _type: 'faqGeneral',
  categories: [
    section('Payment & Booking', [
      {
        q: 'How do I book a trip?',
        a: [
          'You can book by email, through the contact form on this site, or through a travel agent. Write to info@mari-liveaboard.com or message us on WhatsApp at +62 812 9748 3740.',
          'We hold your cabin once the deposit is received.',
        ],
      },
      {
        q: 'What deposit is required, and when is the balance due?',
        a: [
          'A deposit of 30% per person is due within 7 days of booking, and the remaining 70% is due no later than 90 days before departure.',
          'Bookings made less than 90 days before departure are payable in full at the time of booking.',
        ],
        featured: true,
      },
      {
        q: 'What is the cancellation policy?',
        a: [
          'Cancelling 91 days or more before departure costs 25% of the cruise rate per person. Cancelling 90 to 61 days before costs 50%, and 60 days or less costs 100%.',
          'You can substitute another guest in your place up to 5 days before departure to avoid the penalty.',
        ],
      },
      {
        q: 'Is there a single supplement for solo travelers?',
        a: [
          'Yes. A guest occupying a cabin alone pays a single supplement of 50% of the base per person cabin rate.',
          'Superior cabins are a bunk configuration suited to solo travelers and dive buddies, so sharing is also an option if you would rather not pay the supplement.',
        ],
      },
    ]),
    section("What's Included", [
      {
        q: 'What is included in the cruise rate?',
        a: [
          'Your cabin, all meals, drinking water, coffee and tea, every guided dive in the regular cruise program, tanks and weights, and the land excursions described in your itinerary.',
          'Airport or hotel transfers at the city of embarkation and disembarkation are included, and the vessel is fully crewed throughout.',
        ],
        featured: true,
      },
      {
        q: 'What is not included in the cruise rate?',
        a: [
          'Flights, visas and airport taxes, national park and port fees, the fuel surcharge, Nitrox fills, equipment rental, dive courses, insurance and crew gratuities are all additional.',
          'Alcohol, soft drinks and other beverages are payable separately, in cash on board.',
        ],
        featured: true,
      },
      {
        q: 'Are drinks included?',
        a: [
          'Drinking water, coffee and tea are included with your cruise. Alcohol, soft drinks and all other beverages are payable in cash on board.',
        ],
        featured: true,
      },
      {
        q: 'Are national park and port fees included?',
        a: [
          'No. Park and port fees are paid in cash on board and depend on the length of your cruise: 140 EUR per person for cruises up to 11 nights, and 200 EUR per person for cruises of 12 nights or more.',
          'A fuel surcharge is also collected on board, at 150 EUR per person up to 11 nights and 250 EUR per person for 12 nights or more.',
        ],
      },
    ]),
    section('Others', [
      {
        q: 'Do I need dive insurance?',
        a: [
          'Yes. Diving insurance that covers medical evacuation is mandatory for every diving guest, and you will be asked for proof of it when you board.',
          'Travel insurance is strongly recommended but not required. Bring your certification card as well.',
        ],
      },
      {
        q: 'What time do I board, and are transfers included?',
        a: [
          'Boarding runs from 6:30am to noon on the day of departure, and all guests need to be on board by midday. Disembarkation is by midday on the final day.',
          'Transfers between the airport or your hotel and the boat are included at both ends of the cruise.',
        ],
      },
      {
        q: 'How do I pay for things on board?',
        a: [
          'Onboard expenses and crew gratuities are settled in cash at the end of the cruise. Euros, US dollars, Swiss francs and Indonesian rupiah are all accepted.',
          'There are no card facilities on board, so bring enough cash for rentals, beverages, park fees and tips.',
        ],
      },
    ]),
  ],
}

// ---------- Boat: Mari's own questions ----------
const boatFaqSections = [
  section('General Information', [
    {
      q: 'Who is Mari suitable for?',
      a: [
        'Mari is built for serious divers who want a premium liveaboard at exceptional value. It carries a maximum of 14 guests, so the boat stays uncrowded and the diving stays the focus.',
        'It suits certified divers who would rather spend their time in the water than on a large, busy vessel. Non-diving partners are welcome, though the program is built around the dive schedule.',
      ],
      featured: true,
    },
    {
      q: 'Is Nitrox available on board?',
      a: [
        'Yes. Nitrox is produced on board with an NRC membrane system and is available to certified Nitrox divers at additional cost.',
        'Bring your Nitrox certification card. Fills are charged per day and can be paid in cash on board.',
      ],
      featured: true,
    },
    {
      q: 'What is the minimum diving experience required?',
      a: [
        'Open Water certification with at least 30 logged dives is required on every Mari cruise.',
        'Many of the sites we visit carry real current, so this baseline applies regardless of destination. Proof of certification is checked before your first dive.',
      ],
      featured: true,
    },
    {
      q: 'What is the crew-to-guest ratio?',
      a: [
        'Mari carries 14 crew for a maximum of 14 guests, a ratio of 1:1.',
        'Four of them are dive staff: a cruise director and three dive guides. That works out to up to four divers per guide in the water.',
      ],
      featured: true,
    },
    {
      q: 'Is dive equipment available to rent?',
      a: [
        'Yes. Regulators, BCDs, wetsuits, fins, boots, computers, torches and reef hooks are all available to rent on board, charged per day.',
        'Rental gear must be requested in advance so we can confirm sizes and availability before you travel.',
      ],
    },
    {
      q: 'Is there Wi-Fi on board?',
      a: [
        'Wi-Fi is free on board and works whenever the boat is within range of a mobile network.',
        'Many of the best dive sites are remote, so expect stretches of the cruise with no signal at all.',
      ],
    },
    {
      q: 'How many dives are there per day?',
      a: [
        'Up to four dives a day: typically at 7:00am, 10:00am and 2:00pm, plus a night dive at 6:30pm when one is scheduled.',
        'An 11-night cruise runs up to 33 dives in total. Maximum dive time is 70 minutes and maximum depth is 40m (131ft).',
      ],
    },
  ]),
]

// ---------- Komodo: migrated from the retired `faq` documents ----------
// NOTE: "What is included in a Mari trip?" lands in Others per the locked brief, but it duplicates
// the General FAQ's What's Included category that the destination page will pull in. Flagged for a
// decision in the destination-page slice (see _internal/QA-CHECKLIST.md) — deleting it there is a one-item edit.
const komodoFaqSections = [
  section('Diving', [
    {
      q: 'When is the best time to dive Komodo?',
      a: [
        'Komodo dives year-round, with the prime liveaboard season running May to September when conditions are driest and manta activity peaks in the south.',
      ],
    },
    {
      q: 'What is the minimum skill level to dive Komodo?',
      a: [
        'Open Water certification with a minimum of 30 logged dives. Komodo currents make it unsuitable for brand-new divers.',
      ],
    },
    {
      q: 'What are the currents like in Komodo?',
      a: [
        'Komodo is known for strong, nutrient-rich currents that draw big marine life. Dives are guided and planned around the tides, and drift diving is part of the experience.',
      ],
    },
    {
      q: 'What marine life can I expect to see in Komodo?',
      a: [
        'Komodo marine life is led by manta rays, both reef and oceanic species, seen year-round with gatherings of up to 50 at peak sites.',
        'Beyond mantas, diving in Komodo turns up reef sharks, dogtooth tuna, giant trevally and Napoleon wrasse on the pelagic side, plus pygmy seahorses, frogfish, ornate ghost pipefish and nudibranchs for macro divers. Occasional whale shark sightings happen but are not a primary draw here.',
      ],
    },
  ]),
  section('Travel', [
    {
      q: 'How do I get to Komodo?',
      a: [
        'Most guests fly into Labuan Bajo (Komodo Airport), about an hour from Bali, where the boat departs. Bali to Komodo crossings are also available on select itineraries.',
      ],
    },
  ]),
  section('Others', [
    {
      q: 'What is included in a Mari trip?',
      a: [
        'Your cabin, all meals, coffee, tea and drinking water, guided diving with tanks and weights, and onboard activities. Nitrox, alcohol, other beverages and equipment rental are additional.',
      ],
    },
  ]),
]

async function run() {
  await client.createOrReplace(faqGeneral)
  console.log('seeded faqGeneral:', faqGeneral.categories.length, 'categories')

  await client.patch('boat-mari').set({ faqSections: boatFaqSections }).commit()
  console.log('patched boat-mari:', boatFaqSections[0].questions.length, 'questions')

  await client.patch('destination-komodo').set({ faqSections: komodoFaqSections }).commit()
  console.log('patched destination-komodo:', komodoFaqSections.reduce((n, s) => n + s.questions.length, 0), 'questions')

  // Retire the `faq` document type: delete every remaining doc, drafts included.
  const stale = await client.fetch<string[]>(`*[_type=="faq"]._id`)
  for (const id of stale) {
    await client.delete(id)
    await client.delete(`drafts.${id}`).catch(() => {})
  }
  console.log('deleted faq docs:', stale.length)
}

run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  }
)
