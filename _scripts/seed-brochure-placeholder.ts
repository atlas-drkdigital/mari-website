import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Placeholder brochure PDF (Adinda, 2026-07-21) — the Download Brochure button has never been
// QA'd because no PDF was ever uploaded (the button hides without one). Generates a minimal
// one-page PDF labelled as a placeholder, uploads it, and points boat-mari.brochurePdf at it.
// Replace with the real brochure by uploading over this field in Studio.

function buildPdf(): Buffer {
  const lines = [
    'BT /F1 24 Tf 72 700 Td (Mari Liveaboard) Tj ET',
    'BT /F1 14 Tf 72 670 Td (Brochure placeholder - QA file, 2026-07-21) Tj ET',
    'BT /F1 12 Tf 72 640 Td (Replace with the real brochure in Sanity Studio.) Tj ET',
  ].join('\n')
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${lines.length} >>\nstream\n${lines}\nendstream`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objects.forEach((body, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
  })
  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const off of offsets) pdf += `${String(off).padStart(10, '0')} 00000 n \n`
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  return Buffer.from(pdf, 'latin1')
}

async function run() {
  const asset = await client.assets.upload('file', buildPdf(), {
    filename: 'mari-liveaboard-brochure-placeholder.pdf',
    contentType: 'application/pdf',
  })
  console.log('uploaded asset:', asset._id)
  for (const id of ['boat-mari', 'drafts.boat-mari']) {
    const exists = await client.fetch(`defined(*[_id==$id][0]._id)`, { id })
    if (!exists) { console.log(`${id}: does not exist, skipping`); continue }
    await client
      .patch(id)
      .set({ brochurePdf: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } } })
      .commit()
    console.log(`${id}: brochurePdf set`)
  }
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
