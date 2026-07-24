import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Seeds siteSettings.defaultShareImage — the LAST tier of the social-image chain in src/lib/seo.ts
// (seo.ogImage → the page's own hero/cover → this). Added 2026-07-24 because page shapes with no
// hero (the generic `page` type — /terms, Onboard Prices) served NO og:image at all.
//
// Adinda's call: default it to the HOMEPAGE HERO. This REUSES that asset's existing reference — it
// does not upload anything, so there is no second copy and no re-encode. 🟡 A purpose-made 1200×630
// share image is the eventual want; tracked in _internal/CONTENT-STATUS.md.
//
// Run: npx sanity exec _internal/scripts/seed-default-share-image.ts --with-user-token

const FALLBACK_ALT = 'Mari Liveaboard, a traditional Indonesian Phinisi, at anchor in Indonesian waters'

async function run() {
  const hero = await client.fetch<{ ref?: string; alt?: string; filename?: string } | null>(
    `*[_id == "homePage"][0].heroImage{ "ref": asset._ref, alt, "filename": asset->originalFilename }`,
  )

  if (!hero?.ref) {
    console.error('STOP: homePage has no heroImage — nothing to reuse. Not inventing a source.')
    process.exit(1)
  }

  const alt = hero.alt?.trim() || FALLBACK_ALT
  console.log(`source: homePage.heroImage → ${hero.ref} (${hero.filename ?? 'no filename'})`)
  console.log(`alt: ${alt}${hero.alt?.trim() ? ' (reused from hero)' : ' (fallback)'}`)

  // Patch the published doc AND its draft if one exists — the seed LAW. Patching only the published
  // doc leaves a stale draft that overwrites the seed the next time an editor hits Publish.
  for (const id of ['siteSettings', 'drafts.siteSettings']) {
    const exists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) {
      console.log(`${id}: not present, skipped`)
      continue
    }
    await client
      .patch(id)
      .set({
        defaultShareImage: { _type: 'imageWithAlt', asset: { _type: 'reference', _ref: hero.ref }, alt },
      })
      .commit()
    console.log(`${id}: defaultShareImage set`)
  }

  const check = await client.fetch(
    `*[_id == "siteSettings"][0]{
      "asset": defaultShareImage.asset->_id,
      "alt": defaultShareImage.alt,
      "dims": defaultShareImage.asset->metadata.dimensions{width,height},
      "sameAsHomeHero": defaultShareImage.asset._ref == *[_id == "homePage"][0].heroImage.asset._ref
    }`,
  )
  console.log('verify:', JSON.stringify(check))
}

run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
