import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Testimonials chrome + curated list: homePage → the testimonialsSection SINGLETON (2026-07-23,
// Adinda's About-build spec — "edited once, shown everywhere"). Values are MOVED, not copied:
// after seeding the singleton, the old homePage fields are unset (published AND draft — the
// seed-vs-open-draft clobber lesson) so no orphaned data hides behind the schema's new note.
// setIfMissing on the singleton keeps this idempotent/re-runnable.

async function run() {
  const home = await client.fetch(
    `*[_id == "homePage"][0]{ testimonialsEyebrow, testimonialsHeading, testimonialsLinkText, testimonialItems }`,
  )
  if (!home) throw new Error('homePage not found')

  await client.createIfNotExists({ _id: 'testimonialsSection', _type: 'testimonialsSection' })
  await client
    .patch('testimonialsSection')
    .setIfMissing({
      ...(home.testimonialsEyebrow ? { eyebrow: home.testimonialsEyebrow } : {}),
      ...(home.testimonialsHeading ? { heading: home.testimonialsHeading } : {}),
      ...(home.testimonialsLinkText ? { linkText: home.testimonialsLinkText } : {}),
      ...(home.testimonialItems?.length ? { testimonialItems: home.testimonialItems } : {}),
    })
    .commit()
  console.log(
    `testimonialsSection seeded: eyebrow="${home.testimonialsEyebrow}", heading="${home.testimonialsHeading}", ${home.testimonialItems?.length ?? 0} items`,
  )

  for (const id of ['homePage', 'drafts.homePage']) {
    const exists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: not present, skip unset`)
      continue
    }
    await client
      .patch(id)
      .unset(['testimonialsEyebrow', 'testimonialsHeading', 'testimonialsLinkText', 'testimonialItems'])
      .commit()
    console.log(`${id}: old testimonials fields unset`)
  }

  const check = await client.fetch(`*[_id == "testimonialsSection"][0]{ heading, "n": count(testimonialItems) }`)
  console.log('verify:', JSON.stringify(check))
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
