import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Private Charters singleton seed (2026-07-23, hero slice). Copy is the mockup's own (778:8911) —
// content pass tracks it in _internal/CONTENT-STATUS.md. setIfMissing throughout so Adinda's edits are
// never clobbered.
//
// heroImage + brochure reuse the BOAT's existing assets by reference (no new upload): the real
// charter deck photo isn't renamed/uploaded yet, and an asset reference is the cheapest way to
// make the section render fully from Sanity (full-wire rule) with a REAL image behind it.

async function run() {
  const boat = await client.fetch(
    `*[_type == "boat"][0]{ "imageRef": coverImage.asset._ref, "brochureRef": brochurePdf.asset._ref, "crew": stats[label == "Crew"][0].value }`,
  )
  if (!boat?.imageRef) console.warn('No boat cover image found — heroImage will stay unset')
  console.log(`Boat "Crew" stat (cross-check the hero subheading's crew count): ${boat?.crew ?? '—'}`)

  await client.createIfNotExists({ _id: 'privateCharters', _type: 'privateCharters' })
  await client
    .patch('privateCharters')
    .setIfMissing({
      name: 'Private Charters',
      heroHeadingIntro: 'Private Diving & Snorkeling Liveaboard Charters in',
      heroHeadingMain: 'Indonesia',
      // 14 crew, NOT the mock's "ten" (Adinda, 2026-07-23 — matches boat-mari's Crew stat and the
      // mock's own "14 Crew for 14 Guests" benefit row; the mock's hero line contradicted itself).
      heroSubheading: 'The whole boat is yours. Fourteen guests, fourteen crew, your itinerary.',
      ...(boat?.imageRef
        ? {
            heroImage: {
              _type: 'imageWithAlt',
              asset: { _type: 'reference', _ref: boat.imageRef },
              alt: 'Guests sharing sunset drinks on the deck of Mari Liveaboard on a private charter',
            },
          }
        : {}),
      ...(boat?.brochureRef
        ? { brochurePdf: { _type: 'file', asset: { _type: 'reference', _ref: boat.brochureRef } } }
        : {}),
      subnavOverviewLabel: 'Overview',
      subnavBenefitsLabel: 'Benefits',
      subnavDestinationsLabel: 'Destinations',
      subnavBoatsLabel: 'Boats',
      subnavFaqLabel: 'FAQ',
      subnavCheckAvailabilityLabel: 'Check Availability',
    })
    .commit()
  console.log('privateCharters: hero + sub-nav labels seeded')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
