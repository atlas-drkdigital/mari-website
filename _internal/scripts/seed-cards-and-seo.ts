import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// 2026-07-22, destination slice (Adinda's Studio review):
// 1. seasonNights REMOVED from the schema — the card line now derives from the hero stats
//    (Season + Duration). Before unsetting it, parse each doc's old value into stats so no
//    destination loses its card line (komodo already has real stats and is skipped).
// 2. Preload seo.title + seo.description SITE-WIDE (destinations, homePage, boat) — Adinda's
//    standing rule: SEO fields must never sit empty. Komodo gets the real draft from
//    mari-website's destination-komodo.md; everything else gets formula drafts, tagged
//    placeholder in _internal/CONTENT-STATUS.md. og:image needs no preload — it falls back to the
//    cover image in buildSeoMetadata.
// setIfMissing throughout: never clobber an editor's value.

const KOMODO_SEO = {
  title: 'Komodo Liveaboard | Mari Liveaboard Indonesia',
  description:
    'Dive Komodo National Park with Mari, a premium Komodo liveaboard exploring manta cleaning stations, current-driven pinnacles and Komodo dragons.',
}

const SINGLETON_SEO: Record<string, { title: string; description: string }> = {
  homePage: {
    title: 'Mari Liveaboard | Premium Dive Liveaboard Indonesia',
    description:
      'Dive Indonesia’s best destinations aboard Mari, a traditional Phinisi liveaboard sailing Komodo, Raja Ampat and beyond. Premium diving at exceptional value.',
  },
  'boat-mari': {
    title: 'The Boat | Mari Liveaboard Indonesia',
    description:
      'Mari is a 30m traditional Phinisi with 7 sea-view ensuite cabins for 14 guests. Premium diving across Indonesia at exceptional value.',
  },
}

async function seedSeo(id: string, seo: { title: string; description: string }) {
  const existing = await client.fetch(`*[_id == $id][0].seo`, { id })
  if (!existing) {
    await client.patch(id).setIfMissing({ seo: { _type: 'seo', ...seo } }).commit()
    console.log(`${id}: seo object created`)
  } else {
    await client
      .patch(id)
      .setIfMissing({ 'seo.title': seo.title, 'seo.description': seo.description })
      .commit()
    console.log(`${id}: seo title/description filled where missing`)
  }
}

async function run() {
  const destinations = await client.fetch(
    `*[_type == "destination"]{ _id, name, tagline, seasonNights, "hasStats": count(stats) > 0 }`,
  )

  for (const d of destinations) {
    // 1. Derive stats from the old card line (only when the doc has none).
    if (!d.hasStats && d.seasonNights) {
      const [season, duration] = String(d.seasonNights).split('·').map((s: string) => s.trim())
      await client
        .patch(d._id)
        .setIfMissing({
          stats: [
            { _key: 's1', _type: 'stat', label: 'Season', value: season || '' },
            { _key: 's2', _type: 'stat', label: 'Duration', value: duration || '' },
            { _key: 's3', _type: 'stat', label: 'Minimum Skill Level', value: '' },
          ],
        })
        .commit()
      console.log(`${d._id}: stats created from "${d.seasonNights}"`)
    }

    // 2. Drop the orphaned field (schema no longer has it).
    await client.patch(d._id).unset(['seasonNights']).commit()

    // 3. SEO preload.
    const isKomodo = d._id === 'destination-komodo'
    await seedSeo(
      d._id,
      isKomodo
        ? KOMODO_SEO
        : {
            title: `${d.name} Liveaboard | Mari Liveaboard Indonesia`,
            description: `Dive ${d.name} with Mari, a premium Indonesian dive liveaboard. ${d.tagline ?? ''}`.trim(),
          },
    )
  }

  for (const [id, seo] of Object.entries(SINGLETON_SEO)) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) { console.log(`${id}: does not exist, skipping`); continue }
    await seedSeo(id, seo)
  }

  // Draft sides, if any exist, get the same unset so published/draft can't diverge.
  const draftIds: string[] = await client.fetch(`*[_type == "destination" && _id in path("drafts.**")]._id`)
  for (const id of draftIds) {
    await client.patch(id).unset(['seasonNights']).commit()
    console.log(`${id}: seasonNights unset (draft)`)
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
