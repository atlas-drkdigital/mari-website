import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Dumps the LIVE Private Charters copy (draft wins over published — that's what an editor sees)
// to stdout as markdown, for the Codex copy-review round (Adinda, 2026-07-23). Read-only.

type Block = { _type?: string; children?: { text?: string }[]; style?: string }
const pt = (blocks?: Block[]) =>
  (blocks ?? [])
    .filter((b) => b._type === 'block')
    .map((b) => {
      const text = (b.children ?? []).map((c) => c.text ?? '').join('')
      const h = b.style?.match(/^h(\d)$/)
      return h ? `${'#'.repeat(Number(h[1]))} ${text}` : text
    })
    .join('\n\n')

async function run() {
  const docs = await client.fetch(`*[_id in ["privateCharters", "drafts.privateCharters"]]`)
  const doc =
    docs.find((d: { _id: string }) => d._id === 'drafts.privateCharters') ??
    docs.find((d: { _id: string }) => d._id === 'privateCharters')
  if (!doc) throw new Error('privateCharters doc not found')

  const lines = [
    `# Private Charters — LIVE copy as of ${new Date().toISOString().slice(0, 10)}`,
    doc._id.startsWith('drafts.') ? '(source: open draft — includes unpublished edits)' : '(source: published doc)',
    '',
    '## Hero',
    `- Heading, intro line: ${doc.heroHeadingIntro ?? '—'}`,
    `- Heading, main line: ${doc.heroHeadingMain ?? '—'}`,
    `- Subheading: ${doc.heroSubheading ?? '—'}`,
    '',
    '## Overview',
    `- Eyebrow: ${doc.overviewEyebrow ?? '—'}`,
    `- Heading: ${doc.overviewHeading ?? '—'}`,
    '- Body:',
    '',
    pt(doc.overviewBody),
    '',
    '## Benefits',
    `- Eyebrow: ${doc.benefitsEyebrow ?? '—'}`,
    `- Heading: ${doc.benefitsHeading ?? '—'}`,
    ...(doc.benefits ?? []).flatMap((b: { title?: string; caption?: string }, i: number) => [
      `- Benefit ${i + 1} title: ${b.title ?? '—'}`,
      `  - Caption: ${b.caption ?? '—'}`,
    ]),
    '',
    '## Availability (Available Dates)',
    `- Eyebrow: ${doc.availabilityEyebrow ?? '—'}`,
    `- Heading: ${doc.availabilityHeading ?? '—'}`,
    `- Intro: ${pt(doc.availabilityIntro)}`,
    `- Button: ${doc.availabilityCtaText ?? '—'}`,
    '',
    '## FAQ chrome (the questions themselves are real content, out of scope)',
    `- Eyebrow: ${doc.faqEyebrow ?? '—'}`,
    `- Heading: ${doc.faqHeading ?? '—'}`,
    `- Link text: ${doc.faqLinkText ?? '—'}`,
    '',
    '## SEO',
    `- Title: ${doc.seo?.title ?? '—'}`,
    `- Description: ${doc.seo?.description ?? '—'}`,
  ]
  console.log(lines.join('\n'))
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
