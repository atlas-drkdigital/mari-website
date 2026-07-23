import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Inspect: which destination docs exist, their ids/slugs/filled fields, and whether the
// destinationDefaults singleton exists yet (destination page slice, 2026-07-22).

async function run() {
  const komodo = await client.fetch(
    `*[_id == 'destination-komodo'][0]{
      stats, overviewHeading,
      "overviewBodyBlocks": count(overviewBody),
      "highlightCount": count(highlights),
      "galleryCount": count(gallery),
      faqSections[]{ title, "qCount": count(questions) },
      seo,
      "coverAlt": coverImage.alt
    }`,
  )
  console.log(JSON.stringify(komodo, null, 2))
  const drafts = await client.fetch(`*[_id in ['drafts.destination-komodo', 'drafts.destinationDefaults']]._id`)
  console.log('drafts present:', JSON.stringify(drafts))
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
