import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Private Charters shared-sections seed (2026-07-23): boats/availability/FAQ chrome + the page's
// own "Private Charters" FAQ category (copy from mari-website's private-charters.md reference) +
// the shared-category toggles on faqGeneral ("Booking Terms" + "What's Included" — NOTE the mock
// calls the first "Payment & Booking"; the rename question is flagged to Adinda, not decided
// here). The INSEANQ embed is copied from Komodo's (no scheduleRates doc exists yet — the embed
// lives on this page doc until that page is built).
//
// Availability intro is Adinda-specced marketing copy (how the 14-guest filter + "Book Charter"
// button work) — drafted, flagged 🟡 for her review.

const block = (key: string, spans: { text: string; mark?: string }[], markDefs: object[] = []) => ({
  _type: 'block' as const,
  _key: key,
  style: 'normal',
  markDefs,
  children: spans.map((s, i) => ({
    _type: 'span' as const,
    _key: `${key}-s${i}`,
    marks: s.mark ? [s.mark] : [],
    text: s.text,
  })),
})

const qa = (key: string, question: string, answer: ReturnType<typeof block>[]) => ({
  _type: 'faqItem',
  _key: key,
  question,
  answer,
  isFeatured: false,
})

const MAILTO = 'mailto:info@mari-liveaboard.com'

async function run() {
  // 1. Shared-category toggles on faqGeneral, keyed by _key (never by title).
  const cats: { _key: string; title: string }[] = await client.fetch(
    `*[_id == "faqGeneral"][0].categories[]{_key, title}`,
  )
  for (const cat of cats ?? []) {
    if (cat.title === 'Booking Terms' || cat.title === "What's Included") {
      await client
        .patch('faqGeneral')
        .set({ [`categories[_key=="${cat._key}"].showOnPrivateChartersPage`]: true })
        .commit()
      console.log(`faqGeneral: "${cat.title}" → shown on Private Charters page`)
    }
  }

  // 2. Embed copied from Komodo (same INSEANQ widget).
  const embedHtml: string | null = await client.fetch(
    `*[_id == "destination-komodo"][0].upcomingTripsEmbed.html`,
  )
  if (!embedHtml) console.warn('No Komodo embed found — availability section will stay hidden')

  await client
    .patch('privateCharters')
    .setIfMissing({
      boatsEyebrow: 'Sail Indonesia in comfort',
      boatsHeading: 'About the boats',
      boatsHeadingSingular: 'About the boat',
      boatsCtaText: 'More about the boat',

      availabilityEyebrow: 'Check Availability',
      availabilityHeading: 'Available dates for private charters',
      availabilityIntro:
        'Enter your group size — up to 14 guests — to reveal every departure available for private charter. Charter-only trips show their pricing directly; on other departures, select "Book Charter" to view the full-boat rate. If a trip has no "Book Charter" button, those dates aren\'t available to charter — contact us and we\'ll help you find the right window for your group.',
      availabilityCtaText: 'View All Trips',
      ...(embedHtml ? { availabilityEmbed: { _type: 'htmlEmbed', html: embedHtml } } : {}),

      faqEyebrow: 'Good to Know',
      faqHeading: 'FAQ & Booking Terms',
      faqLinkText: 'Read All FAQ',
      faqSections: [
        {
          _type: 'faqSection',
          _key: 'pc-faq',
          title: 'Private Charters',
          questions: [
            qa('pc-q1', 'Can I charter half the boat?', [
              block(
                'pc-a1',
                [
                  { text: 'Yes. We offer both half and full boat charters. ' },
                  { text: 'Contact us', mark: 'pc-a1-l' },
                  { text: ' to discuss the options that work for your group size and dates.' },
                ],
                [{ _type: 'link', _key: 'pc-a1-l', href: MAILTO }],
              ),
            ]),
            qa('pc-q2', 'What group discounts are available?', [
              block(
                'pc-a2',
                [
                  { text: 'We do offer group discounts depending on charter type and availability. ' },
                  { text: 'Get in touch', mark: 'pc-a2-l' },
                  { text: " and we'll put together the right option for your group." },
                ],
                [{ _type: 'link', _key: 'pc-a2-l', href: MAILTO }],
              ),
            ]),
            qa('pc-q3', 'Can non-divers join a private charter?', [
              block('pc-a3', [
                {
                  text: "Yes. One of Mari's 3 tenders is dedicated to snorkeling and shore excursions throughout the trip. Non-divers participate fully in the journey. The boat, the destinations, the meals and the outdoor spaces are shared by everyone on board.",
                },
              ]),
            ]),
            qa('pc-q4', 'What is the minimum charter duration?', [
              block(
                'pc-a4',
                [
                  { text: 'Minimum duration depends on the destination and our current schedule. ' },
                  { text: 'Contact us', mark: 'pc-a4-l' },
                  { text: ' for the latest availability.' },
                ],
                [{ _type: 'link', _key: 'pc-a4-l', href: MAILTO }],
              ),
            ]),
            qa('pc-q5', 'Can you design a custom itinerary for our group?', [
              block('pc-a5', [
                {
                  text: "Yes. Tell us your preferred destinations, trip duration and interests and we will build a route from there. Our cruise director can make recommendations based on the season and your group's experience levels.",
                },
              ]),
            ]),
            qa('pc-q6', 'How do I get a quote?', [
              block('pc-a6', [
                {
                  text: 'Send us your preferred dates, group size (divers and non-divers separately), destination preferences and dive certification levels. We will come back to you with availability and a charter rate.',
                },
              ]),
            ]),
          ],
        },
      ],
    })
    .commit()
  console.log('privateCharters: boats/availability/FAQ chrome + Private Charters category seeded')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
