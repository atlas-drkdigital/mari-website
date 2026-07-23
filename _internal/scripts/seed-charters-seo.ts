import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Private Charters SEO title/description drafts (2026-07-23). The mari-website reference
// (references/pages/private-charters.md) marks both "⚠️ TBD — write once page is close to launch"
// — which is now, so these are CLAUDE DRAFTS against its recorded primary keyword
// ("private charter liveaboard Indonesia" + the "private liveaboard charter" strong combo),
// flagged 🟡 in _internal/CONTENT-STATUS.md for Adinda's review. setIfMissing — never clobbers her edits.
// {siteName} resolves via buildSeoMetadata's token map.

async function run() {
  await client
    .patch('privateCharters')
    .setIfMissing({
      seo: {
        title: 'Private Liveaboard Charter in Indonesia | {siteName}',
        description:
          'Private liveaboard charters in Indonesia — the whole boat for your group. Mari sails Komodo, Raja Ampat, the Banda Sea and beyond. 14 guests, 14 crew.',
      },
    })
    .commit()
  console.log('privateCharters: SEO title + description drafts seeded')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
