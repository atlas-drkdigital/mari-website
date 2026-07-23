// Throwaway migration script (underscore-prefixed, not committed as real project code) — run via
// `npx sanity exec _internal/scripts/rename-boatpage-to-boat.ts --with-user-token`.
//
// Migrates the one real `boatPage` document to the renamed `boat` document type (2026-07-16 —
// see MANAGER.md for why: the "Page" suffix wasn't an actual convention, scheduleRates/blogPost
// don't have it either). `_type` is immutable in Sanity, so this creates a new document under the
// new type + id, repoints any documents that reference it, then deletes the old one. Also creates
// two stub `page` documents (About, Private Charters) with fixed IDs so structure.ts can pin them
// in the sidebar.
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const old = await client.getDocument('boatPage-mari')
  if (!old) {
    console.log('boatPage-mari not found — nothing to migrate, skipping boat rename.')
  } else {
    const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = old as Record<string, unknown>
    void _id
    void _type
    void _rev
    void _createdAt
    void _updatedAt

    await client.createIfNotExists({ _id: 'boat-mari', _type: 'boat', ...rest })
    console.log('Created boat-mari from boatPage-mari.')

    const referencing = await client.fetch<Array<{ _id: string; boat?: { _ref: string } }>>(
      `*[references("boatPage-mari")]{_id, boat}`
    )
    for (const doc of referencing) {
      if (doc.boat?._ref === 'boatPage-mari') {
        await client.patch(doc._id).set({ boat: { _type: 'reference', _ref: 'boat-mari' } }).commit()
        console.log(`Repointed ${doc._id}'s boat reference to boat-mari.`)
      } else {
        console.warn(`${doc._id} references boatPage-mari via an unexpected field — check manually.`)
      }
    }

    await client.delete('boatPage-mari')
    console.log('Deleted old boatPage-mari.')
  }

  await client.createIfNotExists({
    _id: 'page-about',
    _type: 'page',
    title: 'About',
    slug: { _type: 'slug', current: 'about' },
  })
  console.log('Ensured page-about stub exists.')

  await client.createIfNotExists({
    _id: 'page-private-charters',
    _type: 'page',
    title: 'Private Charters',
    // Placeholder slug — real slug still unconfirmed (tentatively
    // "private-liveaboard-charter-indonesia", see MANAGER.md). Update once Adinda confirms.
    slug: { _type: 'slug', current: 'private-charters-slug-tbc' },
  })
  console.log('Ensured page-private-charters stub exists.')
}

run()
  .then(() => console.log('Done.'))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
