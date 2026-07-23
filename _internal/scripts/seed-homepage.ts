import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { getCliClient } from 'sanity/cli'

// Homepage vertical-slice seed (2026-07-16) — populates the homePage singleton + the shared docs
// it references (Why Us items, general FAQs, testimonials) with the REAL copy lifted from the
// built components (src/components/sections/*), and UPLOADS the local /assets images so the page
// renders fully from Sanity (validates urlForImage + the next/image loader end-to-end). Placeholder
// content is tracked in _internal/CONTENT-STATUS.md. Idempotent: createOrReplace with fixed IDs + asset
// uploads keyed by originalFilename dedupe. Run:
//   npx sanity exec _internal/scripts/seed-homepage.ts --with-user-token
const client = getCliClient({ apiVersion: '2024-01-01' })

// --- Portable Text helpers ---
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

// --- Image upload (idempotent-ish: Sanity dedupes identical asset bytes automatically) ---
async function uploadImage(filename: string) {
  const buffer = readFileSync(join(process.cwd(), 'public', 'assets', filename))
  const asset = await client.assets.upload('image', buffer, { filename })
  return asset._id
}
const img = (assetId: string, alt: string) => ({
  _type: 'imageWithAlt',
  asset: { _type: 'reference', _ref: assetId },
  alt,
})

async function run() {
  // 1. Upload every image the homepage renders, in parallel.
  const files: Record<string, string> = {
    hero: 'hero.webp',
    theBoat: 'the-boat.webp',
    whyDivers: 'why-us-divers.webp',
    whyDining: 'why-us-dining.webp',
    whyCabin: 'why-us-cabin.webp',
    whyCrew: 'why-us-crew.webp',
    ctaPrivate: 'cta-private-charter.webp',
    ctaShared: 'cta-shared-trip.webp',
    blogRajaGuide: 'blog-raja-ampat-guide.webp',
    blogBaliKomodo: 'blog-bali-komodo-specials.webp',
    blogRajaBeyond: 'blog-raja-ampat-beyond-diving.webp',
    // Destination carousel cover images (full-wire slice — the homepage carousel reads real
    // destination docs now, not the hardcoded list).
    destRajaAmpat: 'destination-raja-ampat.webp',
    destKomodo: 'destination-komodo.webp',
    destBandaSea: 'destination-banda-sea.webp',
    destTritonBay: 'destination-triton-bay.webp',
    destSumbawa: 'destination-sumbawa.webp',
    destFlores: 'destination-flores.webp',
    destBali: 'destination-bali.webp',
    destNorthSulawesi: 'destination-north-sulawesi.webp',
    destHalmahera: 'destination-halmahera.webp',
  }
  const ids = Object.fromEntries(
    await Promise.all(Object.entries(files).map(async ([k2, f]) => [k2, await uploadImage(f)] as const)),
  ) as Record<keyof typeof files, string>
  console.log(`Uploaded ${Object.keys(ids).length} images.`)

  const docs: Array<Record<string, unknown>> = [
    // --- Why Us items (referenced by homePage.whyUsItems) ---
    {
      _id: 'whyUsItem-divers',
      _type: 'whyUsItem',
      headline: 'Built for Divers',
      description: pt('Spacious dive deck, Nitrox, 3 dedicated tenders, and experienced local dive guides.'),
      image: img(ids.whyDivers, 'Aerial view of divers in wetsuits preparing their gear on the dive deck of the Mari phinisi'),
    },
    {
      _id: 'whyUsItem-comfort',
      _type: 'whyUsItem',
      headline: 'Premium Comfort',
      description: pt('7 sea-view ensuite cabins, 50 sqm al fresco dining with bar and 270° sea views, sundeck, and shaded lounge deck.'),
      image: img(ids.whyDining, "Long communal dining table set with fresh fruit and drinks in the boat's al fresco saloon"),
    },
    {
      _id: 'whyUsItem-value',
      _type: 'whyUsItem',
      headline: 'Exceptional Value',
      description: pt('Premium amenities and personal service at a fraction of comparable liveaboard rates.'),
      image: img(ids.whyCabin, 'Guest cabin with a made bed beside a curtained window'),
    },
    {
      _id: 'whyUsItem-crew',
      _type: 'whyUsItem',
      headline: '1:1 Crew to Guest Ratio',
      description: pt('14 crew for 14 guests, including a 4:1 diver-to-guide ratio, ensuring attentive service throughout.'),
      image: img(ids.whyCrew, 'Mari crew standing on the bowsprit of the phinisi under a clear blue sky'),
    },

    // --- General FAQ (INLINE-ARRAY model) — ONE faqGeneral document, categories → questions, replacing
    // the old separate general `faq` docs (deleted below). Homepage shows the first N of these
    // automatically; the FAQ page renders one section per category. Copy lifted from Faq.tsx (the
    // "Yes -- full-boat" double dash was restructured to a period per the no-dash brand rule).
    {
      _id: 'faqGeneral',
      _type: 'faqGeneral',
      categories: [
        {
          _key: key(),
          _type: 'faqCategory',
          title: 'Boat & Diving',
          questions: [
            { _key: key(), _type: 'faqItem', question: 'Who is Mari suitable for?', answer: pt('Mari welcomes certified divers with an Open Water certification and at least 30 logged dives, as well as non-diving guests joining for the scenery and onboard experience. All diving guests must carry valid dive insurance including medical evacuation cover.') },
            { _key: key(), _type: 'faqItem', question: 'Is there Nitrox on board?', answer: pt('Yes, via an onboard NRC membrane system, available to certified Nitrox divers at an additional cost.') },
            { _key: key(), _type: 'faqItem', question: "What's the minimum diving experience required?", answer: pt('An Open Water certification plus at least 30 logged dives is required for all cruises.') },
            { _key: key(), _type: 'faqItem', question: "What's the crew-to-guest ratio?", answer: pt('14 crew for 14 guests, a full 1:1 ratio, including 4 dedicated dive staff for up to a 4:1 diver-to-guide ratio.') },
          ],
        },
        {
          _key: key(),
          _type: 'faqCategory',
          title: "What's Included",
          questions: [
            { _key: key(), _type: 'faqItem', question: "What's included in the price?", answer: pt('Airport or hotel transfers, cabin accommodation with ensuite bathroom and A/C, a fully crewed vessel, all meals, drinking water and hot drinks, all guided dives in the regular program, tank and weight rental, and land excursions as described in the itinerary.') },
            { _key: key(), _type: 'faqItem', question: "What's not included?", answer: pt('Flights, visas, and airport taxes; national park, conservation, and port fees; fuel surcharge; alcohol and soft drinks; Nitrox fills; dive courses and certifications; dive gear rental; diving and travel insurance; and crew gratuities.') },
          ],
        },
        {
          _key: key(),
          _type: 'faqCategory',
          title: 'Booking & Payment',
          questions: [
            { _key: key(), _type: 'faqItem', question: 'Is there a discount for group or full-boat bookings?', answer: pt('Yes. Full-boat charters and larger group bookings receive preferential rates. Get in touch for a custom quote.') },
            { _key: key(), _type: 'faqItem', question: "How do I pay, and what's the cancellation policy?", answer: pt('A 30% deposit is due within 7 days of booking, with the balance due 90 days before departure. Cancellations 91+ days out incur a 25% penalty, 90 to 61 days out 50%, and 60 days or less 100% of the cruise rate.') },
          ],
        },
      ],
    },

    // --- Testimonials (the 4 real reviews from Testimonials.tsx; drafts excluded).
    // "amazing—very professional" had an em dash; changed to a comma per the no-em-dash brand rule.
    {
      _id: 'testimonial-bruce-h',
      _type: 'testimonial',
      name: 'Bruce H',
      date: '2026-01-28',
      title: 'Top value for money',
      rating: 5,
      text: "We took an 11 day trip to Misool and Dampier. The crew and dive guides led by Ungke were very friendly and absolutely went out of their way to find the best sites for our group's interests, from mantas to muck diving. Food was fantastic, cabins were comfortable, and the whole trip felt like incredible value for what we experienced. Would book with Mari again in a heartbeat.",
    },
    {
      _id: 'testimonial-kerstin-w',
      _type: 'testimonial',
      name: 'Kerstin W',
      date: '2024-05-28',
      title: 'Best crew ever for an amazing dive adventure',
      rating: 5,
      text: 'Very knowledgeable dive guides for all the different dive sites, with time for photo enthusiasts to get the shots they wanted without holding up the group. Briefings were thorough and the whole crew felt like family by the end of the trip. Highly recommend for anyone serious about their diving.',
    },
    {
      _id: 'testimonial-aline-w',
      _type: 'testimonial',
      name: 'aline W',
      date: '2019-10-02',
      title: 'Superb Komodo Cruise',
      rating: 5,
      text: "The dives were all more incredible than the last. The boat is in very good condition; nothing is missing. The crew is really attentive and clearly passionate about diving themselves, which made every briefing exciting. Meals were varied and delicious, and the itinerary hit all the highlights Komodo is famous for. Can't wait to sail with them again.",
    },
    {
      _id: 'testimonial-doralysa-n',
      _type: 'testimonial',
      name: 'Doralysa N',
      date: '2023-10-07',
      title: 'Everything was just perfect',
      rating: 5,
      text: 'The staff was amazing, very professional and concerned about diving safety. The boat has all the dive amenities you could ask for, and the cabins were spotless and comfortable after long dive days. Every detail felt thought through, from the dive briefings to the food. This trip exceeded all my expectations.',
    },

    // --- DRAFT testimonials — AI-drafted demo reviews (NOT real guest submissions), the 4 that
    // used to be hardcoded in Testimonials.tsx. The "[DRAFT]" title prefix is the tracking marker:
    // MUST be removed or replaced with real reviews before launch (see _internal/CONTENT-STATUS.md). Seeded
    // as real docs so the carousel still demonstrates 8 cards without any hardcoded content.
    {
      _id: 'testimonial-draft-mara-j',
      _type: 'testimonial',
      name: 'Mara J',
      date: '2026-02-14',
      title: '[DRAFT] Incredible dive planning, spotless cabin',
      rating: 5,
      text: 'The crew read every dive site perfectly, from the strong current at Castle Rock to the calmer muck dives near Rinca. The cabin was spotless, the food never repeated itself over eleven nights, and the Cruise Director briefed each site in enough detail that we always knew what to expect underwater.',
    },
    {
      _id: 'testimonial-draft-tomas-b',
      _type: 'testimonial',
      name: 'Tomas B',
      date: '2026-03-02',
      title: '[DRAFT] Manta encounters we will not forget',
      rating: 5,
      text: 'The manta encounters at Manta Sandy were the highlight, but what stayed with me was how organized everything was above water too. Nitrox fills were fast, rinse stations were always ready, and the dive guides split the group so nobody felt rushed.',
    },
    {
      _id: 'testimonial-draft-priya-n',
      _type: 'testimonial',
      name: 'Priya N',
      date: '2026-04-19',
      title: '[DRAFT] Personal service on an intimate boat',
      rating: 5,
      text: 'Seven cabins meant the boat never felt crowded, and the deck layout gave everyone space to log dives or just watch the water. The crew learned our names and preferences within a day, which made the trip feel personal rather than like a standard charter.',
    },
    {
      _id: 'testimonial-draft-julian-f',
      _type: 'testimonial',
      name: 'Julian F',
      date: '2026-05-30',
      title: '[DRAFT] Banda Sea route worth every night',
      rating: 5,
      text: 'Twelve nights is a serious commitment and Mari earned it. The route covered sites we could not have reached any other way, the boat handled the long crossings smoothly, and the galley kept up a standard I did not expect this far from anywhere.',
    },

    // --- CTA singleton (re-seeded WITH images) ---
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
          image: img(ids.ctaPrivate, 'Guests aboard a private charter on the Mari phinisi'),
        },
        {
          _key: 'sharedTrip',
          _type: 'ctaCard',
          heading: 'Join a shared diving trip',
          description:
            "Join a scheduled dive cruise departure and dive Indonesia's best waters alongside fellow divers.",
          buttonText: 'Find a trip',
          image: img(ids.ctaShared, 'Divers on a shared Mari liveaboard dive trip'),
        },
      ],
    },

    // --- Homepage singleton ---
    {
      _id: 'homePage',
      _type: 'homePage',
      // Hero
      heroHeadingAccent: 'Mari Liveaboard',
      heroHeadingMain: 'Indonesia',
      heroSubheading: "Premium Phinisi liveaboard sailing Indonesia's best dive destinations.",
      heroImage: img(ids.hero, 'Mari phinisi liveaboard sailing in Indonesia'),
      // The Boat
      theBoatHeading: 'Traditional phinisi liveaboard for serious divers',
      theBoatBody: pt(
        "Explore Indonesia's most renowned dive destinations, from Komodo and Flores to the Banda Sea, Raja Ampat, and beyond aboard a premium 30-meter ironwood Phinisi.",
        "With experienced dive guides, tons of spaces to share, comfortable cabins, delicious hearty food, and a professional crew of 14 to cater to your needs, you're guaranteed an excellent dive liveaboard experience in Indonesia's top destinations aboard the Mari.",
      ),
      theBoatImage: img(ids.theBoat, 'The Mari phinisi under sail against a clear blue sky'),
      theBoatLinkText: 'More about the boat',
      // Why Us
      whyUsHeading: 'Why choose Mari',
      whyUsItems: [
        { _key: 'wu1', ...ref('whyUsItem-divers') },
        { _key: 'wu2', ...ref('whyUsItem-comfort') },
        { _key: 'wu3', ...ref('whyUsItem-value') },
        { _key: 'wu4', ...ref('whyUsItem-crew') },
      ],
      // Latest Articles
      latestArticlesHeading: 'Latest news & deals',
      latestArticlesLinkText: 'Read More',
      // FAQ — questions are NOT referenced here anymore; the homepage automatically shows the general
      // FAQs from the `faqGeneral` document (first N). Only the heading + link text live on homePage.
      faqHeading: 'Frequently asked questions',
      faqLinkText: 'Read More',
      // Testimonials
      testimonialsHeading: 'What our guests think',
      testimonialsLinkText: 'Read More',
      testimonialItems: [
        { _key: 't1', ...ref('testimonial-bruce-h') },
        { _key: 't2', ...ref('testimonial-kerstin-w') },
        { _key: 't3', ...ref('testimonial-aline-w') },
        { _key: 't4', ...ref('testimonial-doralysa-n') },
        { _key: 't5', ...ref('testimonial-draft-mara-j') },
        { _key: 't6', ...ref('testimonial-draft-tomas-b') },
        { _key: 't7', ...ref('testimonial-draft-priya-n') },
        { _key: 't8', ...ref('testimonial-draft-julian-f') },
      ],
      // Contact section copy now lives in siteSettings (patched below), not on homePage.
      // Section Labels (eyebrows)
      heroEyebrow: 'Liveaboard Diving Expeditions · Indonesia',
      heroSearchPlaceholder: 'Where would you like to dive?',
      theBoatEyebrow: 'The Boat',
      whyUsEyebrow: 'About Us',
      latestArticlesEyebrow: 'Our Journal',
      faqEyebrow: 'Good to Know',
      testimonialsEyebrow: 'Testimonials',
    },
  ]

  // --- Destination carousel docs (full-wire slice). Komodo already exists with full copy from
  // seed-content-pass.ts, so it is PATCHED below (not replaced) with just the card fields; the
  // other 8 are created here. Card data mirrors the built homepage carousel: name, short tagline,
  // season·nights line, and a card summary. flores/bali/north-sulawesi/halmahera summaries are
  // placeholders ("still being finalized") — tracked in _internal/CONTENT-STATUS.md.
  const destCards: Array<{
    id: string; name: string; tagline: string; seasonNights: string; excerpt: string; order: number; imgKey: keyof typeof files; alt: string
  }> = [
    { id: 'raja-ampat', name: 'Raja Ampat', tagline: 'Indonesia’s Holy Grail of Diving', seasonNights: 'Year-Round · 7–12 Nights', order: 1, imgKey: 'destRajaAmpat', alt: 'Aerial view of forested limestone islands and turquoise lagoons in Raja Ampat, Indonesia', excerpt: 'Raja Ampat sits at the apex of the Coral Triangle, with more documented reef fish and coral species than anywhere else on Earth. Expect year-round manta encounters, endemic species found nowhere else, and karst islands rising from turquoise lagoons above the surface.' },
    { id: 'komodo', name: 'Komodo', tagline: 'Dragons & World-Class Drift Dives', seasonNights: 'May–September · Itinerary Details TBC', order: 2, imgKey: 'destKomodo', alt: 'Aerial view of small sandy islands separated by narrow channels of turquoise water', excerpt: 'Komodo National Park spans three major islands at the meeting point of the Indian Ocean and the Flores Sea, part of the Coral Triangle’s global epicentre of marine biodiversity. Thrilling drift dives and year-round manta encounters sit alongside a topside landscape of volcanic hills and the Komodo dragon, found nowhere else on Earth.' },
    { id: 'banda-sea', name: 'Banda Sea', tagline: 'Remote Spice Islands & Big Pelagics', seasonNights: 'September–November · 12 Nights', order: 3, imgKey: 'destBandaSea', alt: 'Aerial view of a forested volcanic island with a sheltered lagoon and fringing reef', excerpt: 'One of the deepest seas in Southeast Asia, the Banda Sea’s extreme depth and seasonal upwellings create rare conditions for schooling hammerhead sharks. Exclusively reachable by liveaboard, it takes in the historic Spice Islands and remote atolls far from the usual routes.' },
    { id: 'triton-bay', name: 'Triton Bay', tagline: 'Remote Reefs & Whale Sharks', seasonNights: 'Season TBC · 12 Nights (Combined)', order: 4, imgKey: 'destTritonBay', alt: 'A whale shark swimming near the surface with a snorkeler in the background', excerpt: 'Triton Bay shares the Bird’s Head Seascape’s exceptional biodiversity with Raja Ampat, but in a nutrient-rich, plankton-dense bay with some of the most developed soft coral growth in Indonesia. It’s also one of the most reliable places in the country to dive with whale sharks, drawn in by traditional fishing platforms.' },
    { id: 'sumbawa', name: 'Sumbawa', tagline: 'Untouched Reefs & Empty Seas', seasonNights: 'Year-Round · Combined with Komodo', order: 5, imgKey: 'destSumbawa', alt: 'Aerial view of a secluded sandy beach beneath tall cliffs with palm trees in the foreground', excerpt: 'Positioned on the liveaboard corridor between Komodo and Bali, Sumbawa offers healthy reefs and dramatic volcanic scenery with far fewer visitors than its famous neighbours. Highlights include Moyo Island’s reef and wall diving and Teluk Saleh’s seasonal whale shark encounters, among the most reliable in Indonesia.' },
    { id: 'flores', name: 'Flores', tagline: 'Volcanic Peaks & Colourful Reefs', seasonNights: 'Season TBC · Itinerary Details TBC', order: 6, imgKey: 'destFlores', alt: 'Aerial view of a rocky coastline meeting turquoise water beside dense forest', excerpt: 'Itinerary details for this destination are still being finalized — check back soon.' },
    { id: 'bali', name: 'Bali', tagline: 'Wrecks, Reefs & Legendary Night Dives', seasonNights: 'Season TBC · Itinerary Details TBC', order: 7, imgKey: 'destBali', alt: 'Two scuba divers with underwater torches exploring a sunlit cavern', excerpt: 'Itinerary details for this destination are still being finalized — check back soon.' },
    { id: 'north-sulawesi', name: 'North Sulawesi', tagline: 'Lembeh Strait & World-Class Macro Diving', seasonNights: 'Season TBC · Itinerary Details TBC', order: 8, imgKey: 'destNorthSulawesi', alt: 'Macro close-up of a brain coral illuminated in blue light', excerpt: 'Itinerary details for this destination are still being finalized — check back soon.' },
    { id: 'halmahera', name: 'Halmahera', tagline: 'Remote Reefs of the Northern Moluccas', seasonNights: 'Season TBC · Itinerary Details TBC', order: 9, imgKey: 'destHalmahera', alt: 'Aerial view of two small palm-covered islands surrounded by coral reef and turquoise water', excerpt: 'Itinerary details for this destination are still being finalized — check back soon.' },
  ]
  for (const d of destCards) {
    if (d.id === 'komodo') continue // patched below to preserve its full content
    docs.push({
      _id: `destination-${d.id}`,
      _type: 'destination',
      name: d.name,
      pageTitle: `${d.name} Liveaboard`,
      slug: { _type: 'slug', current: d.id },
      tagline: d.tagline,
      seasonNights: d.seasonNights,
      excerpt: d.excerpt,
      order: d.order,
      coverImage: img(ids[d.imgKey], d.alt),
    })
  }
  const komodoCard = destCards.find((d) => d.id === 'komodo')!

  const tx = docs.reduce((t, doc) => t.createOrReplace(doc as never), client.transaction())
  // Add cover images to the 3 existing blog posts (patch, so their bodies are untouched).
  // Add cover images to the 3 existing blog posts (patch, so their bodies are untouched).
  tx.patch('blogPost-raja-ampat-guide', (p) =>
    p.set({ coverImage: img(ids.blogRajaGuide, 'Aerial view of turquoise lagoons and forested limestone islands in Raja Ampat') }),
  )
  tx.patch('blogPost-bali-komodo-specials', (p) =>
    p.set({ coverImage: img(ids.blogBaliKomodo, 'Traditional outrigger boat moored beside a Balinese water temple at sunrise') }),
  )
  tx.patch('blogPost-raja-ampat-beyond-diving', (p) =>
    p.set({ coverImage: img(ids.blogRajaBeyond, 'Monochrome view of palm trees along a coastline at dusk') }),
  )
  // Komodo destination already has full copy (seed-content-pass.ts) — only add the carousel card
  // fields + a cover image, without touching its overview/highlights/etc.
  tx.patch('destination-komodo', (p) =>
    p.set({
      seasonNights: komodoCard.seasonNights,
      excerpt: komodoCard.excerpt,
      order: komodoCard.order,
      coverImage: img(ids.destKomodo, komodoCard.alt),
    }),
  )
  // Contact section copy — moved off homePage to siteSettings (global). createIfNotExists so we
  // don't clobber any existing siteSettings content; then set just the contact-section fields.
  tx.createIfNotExists({ _id: 'siteSettings', _type: 'siteSettings' } as never)
  tx.patch('siteSettings', (p) =>
    p.set({
      contactEyebrow: 'Contact Us',
      contactHeading: 'Talk to us',
      contactIntro: 'Questions about routes, availability, or dive requirements? Send us a message.',
    }),
  )
  await tx.commit()
  console.log(`Seeded ${docs.length} documents + blog covers + komodo card fields + siteSettings contact.`)

  // Clean up: drop any stale empty homePage draft, the known stray empty blog draft, AND the now-
  // obsolete separate general `faq` documents (replaced by the faqGeneral inline-array doc above).
  // Best-effort — ignore "not found". Destination-scoped `faq` docs (Komodo) are intentionally kept.
  const obsoleteGeneralFaqs = [
    'faq-general-suitable', 'faq-general-nitrox', 'faq-general-included', 'faq-general-not-included',
    'faq-general-min-experience', 'faq-general-discount', 'faq-general-crew-ratio', 'faq-general-payment',
  ]
  for (const id of [
    'drafts.homePage',
    'drafts.ddb635eb-2431-421e-8716-7155ad620666',
    ...obsoleteGeneralFaqs,
    ...obsoleteGeneralFaqs.map((id2) => `drafts.${id2}`),
  ]) {
    try {
      await client.delete(id)
      console.log(`Deleted ${id}`)
    } catch {
      /* not present — fine */
    }
  }
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
