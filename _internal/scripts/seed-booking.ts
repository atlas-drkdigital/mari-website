import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Seed for the Schedule & Rates (/booking) slice, 2026-07-24. Run with:
//   npx sanity exec _internal/scripts/seed-booking.ts --with-user-token
//
// Full-wire-per-slice: the page renders from Sanity from day one, so every field gets a value —
// real where it exists (the INSEANQ embed is the real widget), honest placeholder where it
// doesn't (description marked [PLACEHOLDER]; seo 🟡 draft). Tracked in _internal/CONTENT-STATUS.md.
// Idempotent: createOrReplace + keyed patches, safe to re-run.
// Patches hit drafts.faqGeneral too when it exists (the seed LAW from MANAGER 2026-07-23).

// The real INSEANQ booking widget (same account as the charters/destination embeds). Kept verbatim.
const SNIPPET = `<div id="insqwdgt-2j4v5DSymU"><script>(function(w,d,s,n,i,k,p){var f=d.getElementsByTagName(s)[0],j=d.createElement(s);w[n]=w[n]||{};j.async=true;j.src='//app.inseanq.com/bookwidget.js?ts='+(new Date().getTime())+'&k='+k+'&p='+p;w[n].k=i;f.parentNode.insertBefore(j,f);})(window,document,'script','NSQWDGT-2j4v5DSymU','2j4v5DSymUk77agGUV7tMYzvcHBd9pWrGEKnyusDq7wCfZgErG2AmuF80fFa', '2j4v5DSymU', '0');</script></div>`

async function run() {
  // Existing docs of the type — REPORT only, never delete (the fixed-id singleton is the only
  // one this seed owns; any stray-id doc is a human's to deal with).
  const existing: { _id: string; title?: string }[] = await client.fetch(
    `*[_type == "scheduleRates"]{_id, title}`,
  )
  if (existing.length) {
    console.log(`pre-existing scheduleRates docs (${existing.length}):`, JSON.stringify(existing))
  } else {
    console.log('pre-existing scheduleRates docs: none')
  }

  await client.createOrReplace({
    _id: 'scheduleRates',
    _type: 'scheduleRates',
    title: 'Schedule & Rates',
    slug: { _type: 'slug', current: 'booking' },
    // [PLACEHOLDER] one honest paragraph — real page copy to follow (CONTENT-STATUS 🔴 row).
    description: [
      {
        _type: 'block',
        _key: 'bkdesc1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'bkdesc1a',
            marks: [],
            text: '[PLACEHOLDER] Browse every scheduled Mari Liveaboard departure below — live availability, routes and rates in one place. Real page copy to follow.',
          },
        ],
      },
    ],
    embedCode: { _type: 'htmlEmbed', html: SNIPPET },
    // FAQ chrome — tone matched to the charters register (queried 2026-07-24: "Good to Know" /
    // "Private Charter FAQ & Booking Terms" / "Read all FAQs").
    faqEyebrow: 'Good to Know',
    faqHeading: 'Booking FAQ & Payment Terms',
    faqLinkText: 'Read all FAQs',
    // 🟡 draft SEO — starter values, review in the post-slice drk-seo pass.
    seo: {
      title: 'Schedule & Rates — Liveaboard Trips & Prices | {siteName}',
      description:
        'See all upcoming Mari Liveaboard departures with live availability and rates. Compare dates, routes and cabin prices, and book your Indonesia liveaboard trip online.',
    },
  })
  console.log('scheduleRates: created/replaced (_id "scheduleRates")')

  // showOnBookingPage = true on EVERY General FAQ category — patched by category _key, on BOTH
  // the published doc and its draft when one exists (the seed LAW).
  for (const docId of ['faqGeneral', 'drafts.faqGeneral']) {
    const doc = await client.fetch(`*[_id == $id][0]{ _id, "keys": categories[]._key }`, { id: docId })
    if (!doc) {
      console.log(`${docId}: not present, skipped`)
      continue
    }
    const keys: string[] = (doc.keys ?? []).filter(Boolean)
    if (!keys.length) {
      console.log(`${docId}: no categories, skipped`)
      continue
    }
    const sets = Object.fromEntries(keys.map((k) => [`categories[_key=="${k}"].showOnBookingPage`, true]))
    await client.patch(docId).set(sets).commit()
    console.log(`${docId}: showOnBookingPage=true on ${keys.length} categories`)
  }

  const check = await client.fetch(
    `{
      "schedule": *[_id == "scheduleRates"][0]{ title, "slug": slug.current, "hasDescription": defined(description), "embedChars": length(embedCode.html), faqEyebrow, faqHeading, faqLinkText, "seoTitle": seo.title },
      "bookingCats": *[_id == "faqGeneral"][0].categories[showOnBookingPage == true]{ title, "questions": count(questions) }
    }`,
  )
  console.log('verify:', JSON.stringify(check, null, 2))
}
run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
