import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Embed-section intros: plain text → richTextBasic (2026-07-23, Adinda — links/bold/
// multi-paragraph, site-wide for embed-holding sections). Converts the existing STRING values to
// Portable Text blocks; the charters intro gets "contact us" linked to the #contact (Talk to Us)
// section. ALSO swaps the charters INSEANQ embed to the charter-specific widget Adinda supplied
// (it had been a copy of Komodo's scheduled-trips widget).
// Drafts patched too when present; .set() on purpose — this is a type migration, not a seed.

const CHARTER_EMBED =
  '<div id="insqwdgt-KdMsxuPlqC"><script>(function(w,d,s,n,i,k,p){var f=d.getElementsByTagName(s)[0],j=d.createElement(s);w[n]=w[n]||{};j.async=true;j.src=\'//app.inseanq.com/bookwidget.js?ts=\'+(new Date().getTime())+\'&k=\'+k+\'&p=\'+p;w[n].k=i;f.parentNode.insertBefore(j,f);})(window,document,\'script\',\'NSQWDGT-KdMsxuPlqC\',\'KdMsxuPlqChgFTABXxXLFGassfrkKa5QbfREnZGJ45TwDZzCGglSVIaAcdIU\', \'KdMsxuPlqC\', \'0\');</script></div>'

async function patchBoth(baseId: string, fields: Record<string, unknown>) {
  for (const id of [baseId, `drafts.${baseId}`]) {
    try {
      await client.patch(id).set(fields).commit()
      console.log(`${id}: patched`)
    } catch {
      console.log(`${id}: no such document (fine)`)
    }
  }
}

async function run() {
  await patchBoth('destinationDefaults', {
    upcomingTripsIntro: [
      {
        _type: 'block',
        _key: 'uti-p1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'uti-p1-s1',
            marks: [],
            text: 'Book directly through our scheduling partner to view real-time availability and reserve your cabin.',
          },
        ],
      },
    ],
  })

  await patchBoth('privateCharters', {
    availabilityIntro: [
      {
        _type: 'block',
        _key: 'ai-p1',
        style: 'normal',
        markDefs: [{ _type: 'link', _key: 'ai-contact', href: '#contact' }],
        children: [
          {
            _type: 'span',
            _key: 'ai-s1',
            marks: [],
            text: 'Enter your group size — up to 14 guests — to reveal every departure available for private charter. Charter-only trips show their pricing directly; on other departures, select "Book Charter" to view the full-boat rate. If a trip has no "Book Charter" button, those dates aren\'t available to charter — ',
          },
          { _type: 'span', _key: 'ai-s2', marks: ['ai-contact'], text: 'contact us' },
          {
            _type: 'span',
            _key: 'ai-s3',
            marks: [],
            text: " and we'll help you find the right window for your group.",
          },
        ],
      },
    ],
    availabilityEmbed: { _type: 'htmlEmbed', html: CHARTER_EMBED },
  })
  console.log('embed intros migrated to rich text; charter INSEANQ widget installed')
}
run().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
