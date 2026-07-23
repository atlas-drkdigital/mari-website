import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// QA aid (Adinda, 2026-07-24): THREE more placeholder crew members — reusing the Pexels portrait
// assets already uploaded by seed-about-qa1.ts — so the crew section can demonstrate:
//   (a) the mobile View More / View Less collapse (only renders with >4 members), and
//   (b) the bio-modal carousel (more members to step through).
// 🔴 Placeholders (fake people, recycled stock photos) — delete together with placeholder-1..4
// before launch; tracked in _internal/CONTENT-STATUS.md.
// Idempotent: docs are createOrReplace'd, and refs are only appended if absent (safe to re-run).
// Patches hit drafts.aboutPage too when it exists (the seed LAW from MANAGER 2026-07-23).

const EXTRA: { id: string; from: string; name: string; position: string; bio: string }[] = [
  {
    id: 'crewMember-placeholder-5',
    from: 'crewMember-placeholder-1',
    name: 'Agus Pratama',
    position: 'Dive Guide',
    bio: 'Placeholder bio. Agus reads the currents before anyone else is awake and briefs every dive with a hand-drawn site map.',
  },
  {
    id: 'crewMember-placeholder-6',
    from: 'crewMember-placeholder-2',
    name: 'Sari Dewanti',
    position: 'Guest Relations',
    bio: 'Placeholder bio. Sari keeps the days on board running gently — cabins, meals and the small things guests never have to ask for twice.',
  },
  {
    id: 'crewMember-placeholder-7',
    from: 'crewMember-placeholder-3',
    name: 'Budi Santoso',
    position: 'Chief Engineer',
    bio: 'Placeholder bio. Budi keeps Mari’s systems humming below deck, from compressors to generators, on every crossing.',
  },
]

async function run() {
  const ids: string[] = []
  for (const m of EXTRA) {
    const src = await client.fetch(`*[_id == $id][0]{ photo }`, { id: m.from })
    if (!src?.photo) throw new Error(`source photo missing on ${m.from} — run seed-about-qa1.ts first`)
    await client.createOrReplace({
      _id: m.id,
      _type: 'crewMember',
      name: m.name,
      position: m.position,
      bio: m.bio,
      photo: src.photo,
    })
    ids.push(m.id)
    console.log(`crew doc: ${m.id} (${m.name} — ${m.position})`)
  }

  for (const docId of ['aboutPage', 'drafts.aboutPage']) {
    const doc = await client.fetch(`*[_id == $id][0]{ _id, crewMembers }`, { id: docId })
    if (!doc) {
      console.log(`${docId}: not present, skipped`)
      continue
    }
    const have = new Set((doc.crewMembers ?? []).map((r: { _ref: string }) => r._ref))
    const missing = ids.filter((id) => !have.has(id))
    if (missing.length === 0) {
      console.log(`${docId}: already references all extras`)
      continue
    }
    await client
      .patch(docId)
      .setIfMissing({ crewMembers: [] })
      .append(
        'crewMembers',
        missing.map((id) => ({ _type: 'reference', _key: `cmx-${id}`, _ref: id })),
      )
      .commit()
    console.log(`${docId}: appended ${missing.length} refs`)
  }

  const check = await client.fetch(`*[_id == "aboutPage"][0]{ "crew": count(crewMembers) }`)
  console.log('verify:', JSON.stringify(check))
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
