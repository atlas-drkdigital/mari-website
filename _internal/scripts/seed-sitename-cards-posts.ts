import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// 2026-07-22, Adinda's review round 2:
// 1. siteSettings.siteTitle seeded — it backs the new {siteName} token in SEO titles.
// 2. Destination SEO titles switch their hardcoded "| Mari Liveaboard Indonesia" suffix to
//    "| {siteName}" — ONLY where the title still exactly matches yesterday's formula seed, so an
//    editor-changed title is never touched.
// 3. drafts.destination-komodo seo REPAIRED: the earlier seed matched komodo by published id only,
//    so the draft got the generic formula (164-char description → the Studio warning Adinda saw).
//    Both sides now carry the real mari-website draft copy.
// 4. useCoverAsCardImage set to true where unset — the frontend already treated unset as ON; this
//    makes Studio's toggle SHOW that instead of rendering blank.
// 5. Two seed blog posts linked to Komodo (covers reuse existing assets — the retired aerial
//    Komodo cover + the dive-deck wetsuits shot). Placeholder content, tagged in _internal/CONTENT-STATUS.md.

const SITE_NAME = 'Mari Liveaboard Indonesia'

const KOMODO_DESC =
  'Dive Komodo National Park with Mari, a premium Komodo liveaboard exploring manta cleaning stations, current-driven pinnacles and Komodo dragons.'

async function run() {
  // 1. Site title.
  await client.patch('siteSettings').setIfMissing({ siteTitle: SITE_NAME }).commit()
  console.log(`siteSettings.siteTitle -> "${SITE_NAME}" (if missing)`)

  // 2. Tokenise destination titles seeded yesterday.
  const dests = await client.fetch(`*[_type == "destination"]{ _id, name, "t": seo.title }`)
  for (const d of dests) {
    const formula = `${d.name} Liveaboard | ${SITE_NAME}`
    if (d.t === formula) {
      await client.patch(d._id).set({ 'seo.title': `${d.name} Liveaboard | {siteName}` }).commit()
      console.log(`${d._id}: title -> "{siteName}" token`)
    } else {
      console.log(`${d._id}: title edited or non-formula ("${d.t}") — left alone`)
    }
  }

  // 3. Repair the komodo draft's seo.
  const draftId = 'drafts.destination-komodo'
  if (await client.fetch(`defined(*[_id==$id][0]._id)`, { id: draftId })) {
    await client
      .patch(draftId)
      .set({ 'seo.title': 'Komodo Liveaboard | {siteName}', 'seo.description': KOMODO_DESC })
      .commit()
    console.log(`${draftId}: seo repaired (144-char description, tokenised title)`)
  }

  // 4. Card toggle explicit ON.
  const cardDocs = await client.fetch(
    `*[_type in ["destination", "boat"] && !defined(useCoverAsCardImage)]._id`,
  )
  for (const id of cardDocs) {
    await client.patch(id).setIfMissing({ useCoverAsCardImage: true }).commit()
    console.log(`${id}: useCoverAsCardImage -> true`)
  }

  // 5. Two Komodo blog posts.
  const posts = [
    {
      _id: 'blogPost-komodo-diving-guide',
      title: 'Complete Guide to Diving in Komodo',
      slug: 'complete-guide-to-diving-in-komodo',
      excerpt:
        'Currents, mantas and three very different diving zones. What to expect from Komodo National Park, and how a liveaboard unlocks the sites day boats never reach.',
      coverRef: 'image-ee2cc7f0d7436935b8a6d12074295ef980f44cb5-1600x1067-webp',
      coverAlt: 'Aerial view of small sandy islands separated by narrow channels of turquoise water in Komodo National Park',
      postDate: '2026-06-15T09:00:00Z',
    },
    {
      _id: 'blogPost-komodo-packing-list',
      title: 'Komodo Liveaboard Packing List: What to Bring',
      slug: 'komodo-liveaboard-packing-list',
      excerpt:
        'From a 5mm wetsuit for the cool southern sites to the reef hook you will want at Castle Rock. Everything worth packing for a week of diving in Komodo.',
      coverRef: 'image-ad386ac9d4b2b2b4c48660a5a5489776c61679b4-1535x1024-png',
      coverAlt: 'Wetsuits and dive gear hanging ready on the dive deck of a liveaboard',
      postDate: '2026-07-02T09:00:00Z',
    },
  ]
  for (const p of posts) {
    await client.createIfNotExists({
      _id: p._id,
      _type: 'blogPost',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      category: { _type: 'reference', _ref: 'blogCategory-travel-guide' },
      coverImage: {
        _type: 'imageWithAlt',
        asset: { _type: 'reference', _ref: p.coverRef },
        alt: p.coverAlt,
      },
      excerpt: p.excerpt,
      relatedDestination: { _type: 'reference', _ref: 'destination-komodo' },
      postDate: p.postDate,
    })
    console.log(`${p._id}: created (if not existing)`)
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
