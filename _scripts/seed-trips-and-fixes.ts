import { createReadStream } from 'node:fs'
import { basename } from 'node:path'

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// 2026-07-22, review round 3 (Adinda):
// 1. Placeholder booking embed on Komodo (both sides) — renders the Upcoming Trips shell until the
//    real INSEANQ code is pasted in. Deliberately simple per Adinda ("can even be a gray placeholder").
// 2. destinationDefaults: articlesLinkText + upcomingTripsCtaText (initialValues don't reach an
//    existing singleton).
// 3. homePage + boat titles converted to the {siteName} token — Adinda: "fix that now, likely to be
//    forgotten". Values reshaped to fit under 60 chars once resolved; still placeholder drafts
//    pending the real SEO pass (tracked in _CONTENT-STATUS.md).
// 4. Packing-list post gets a beautiful cover: the freediver-over-reef source image pulled from the
//    Figma destination mock (the wetsuit-rack photo read as dull — Adinda).

const EMBED_PLACEHOLDER = `<div style="min-height:420px;display:flex;align-items:center;justify-content:center;text-align:center;background:#f6f1e7;border:1px solid #e3dac9;color:#8f8a7c;font-family:inherit;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;padding:24px;">Booking widget placeholder — the INSEANQ embed for this destination goes here</div>`

const COVER_FILE = '_content/komodo/figma-raws/raw15.jpeg'
const COVER_NAME = 'mari-liveaboard-komodo-02-freediver-pink-fins-reef.jpg'
const COVER_ALT = 'Freediver with pink fins swimming over a dense coral reef'

async function run() {
  for (const id of ['destination-komodo', 'drafts.destination-komodo']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) { console.log(`${id}: does not exist, skipping`); continue }
    await client
      .patch(id)
      .setIfMissing({ upcomingTripsEmbed: { _type: 'htmlEmbed', html: EMBED_PLACEHOLDER } })
      .commit()
    console.log(`${id}: placeholder booking embed seeded`)
  }

  await client
    .patch('destinationDefaults')
    .setIfMissing({ articlesLinkText: 'More blog posts', upcomingTripsCtaText: 'View all trips' })
    .commit()
  console.log('destinationDefaults: articlesLinkText + upcomingTripsCtaText seeded')

  // Tokenised titles — set only if the title still matches what the audit showed, so a
  // parallel edit is never clobbered.
  const retitle: Array<[string, string, string]> = [
    ['homePage', 'Premium Indonesia Liveaboard Diving | Mari Liveaboard', 'Premium Liveaboard Diving | {siteName}'],
    ['boat-mari', 'Mari Phinisi | Indonesia Diving Liveaboard', 'Mari Phinisi | {siteName}'],
  ]
  for (const [id, expected, next] of retitle) {
    const current = await client.fetch(`*[_id == $id][0].seo.title`, { id })
    if (current === expected) {
      await client.patch(id).set({ 'seo.title': next }).commit()
      console.log(`${id}: title -> "${next}"`)
    } else {
      console.log(`${id}: title changed since audit ("${current}") — left alone, flag to Adinda`)
    }
  }

  const asset = await client.assets.upload('image', createReadStream(COVER_FILE), { filename: COVER_NAME })
  console.log(`uploaded: ${asset._id}`)
  await client
    .patch('blogPost-komodo-packing-list')
    .set({
      coverImage: {
        _type: 'imageWithAlt',
        asset: { _type: 'reference', _ref: asset._id },
        alt: COVER_ALT,
      },
    })
    .commit()
  console.log('blogPost-komodo-packing-list: cover replaced')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
