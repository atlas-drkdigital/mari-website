import { getCliClient } from 'sanity/cli'
const client = getCliClient({ apiVersion: '2024-01-01' })

// Seeds the Terms & Conditions page (`page` document, _id `page-terms`, slug `terms`) for the
// /terms slice, 2026-07-24.
//
// 🟢 THE BODY IS REAL CLIENT LEGAL COPY, fetched VERBATIM from the live site
// (https://www.mari-liveaboard.com/terms) on 2026-07-24. It is NOT placeholder and it is NOT to be
// rewritten, shortened, or "improved" — legal wording is the client's, and paraphrasing it changes
// what Mari is contractually committing to. If it needs to change, it changes in Studio by whoever
// owns the legal text, not here.
//
// Two typographic normalisations were applied on transcription, neither of which touches meaning:
// the source's non-breaking hyphens (U+2011, e.g. "multi‑currency") became ordinary hyphens, and
// curly apostrophes became straight ones. Both are artefacts of the old site's CMS and both are
// encoding hazards in a source file.
//
// Run: npx sanity exec _internal/scripts/seed-terms.ts --with-user-token

// ---------------------------------------------------------------------------------------------
// Source text. A deliberately tiny markdown subset so the copy stays READABLE and diffable against
// the live page: `## ` → h2 (the numbered sections), `### ` → h3 (sub-heads), `* ` → bullet,
// `1. ` → numbered item, `**bold**` → strong. richTextFull offers no h1 (the page's H1 is its
// hero title), which is exactly why the document's own "Terms & Conditions" heading is not here.
// ---------------------------------------------------------------------------------------------
const MD = `
**Important Notice:** Reservations for Mari Liveaboard cruises may only be made directly with us or through our officially recognized travel agents and partners. Bookings made through any other channel are not valid and will not be recognized by PT Wisata Laut Indah. If you are unsure whether a booking was made through an authorized channel, please contact us at info@mari-liveaboard.com before making any payment.

By proceeding with your booking, you acknowledge and accept these Terms & Conditions.

## 1. Inclusion

Our cruise rates include:

* Airport or hotel pick-up/drop-off at the city of embarkation/disembarkation
* Accommodation in a cabin with double-bed, twin-bed, or bunk-bed configuration, all with en-suite bathroom and individually controlled air conditioning
* Fully crewed vessel
* All meals during the cruise
* Drinking water, hot drinks
* All guided dives conducted as part of the regular cruise program
* Aluminum 80 CF diving tank, diving weight belt and weights
* Land excursions as described in the itinerary

## 2. Exclusion

Our cruise rates do not include:

* International and domestic flights, visa fees, airport taxes, transit hotels, and excess baggage charges
* National park entrance fees, conservation fees, port fees, and diving fees
* Fuel surcharge
* Soft drinks, beer, wine, and liquor
* Nitrox fills (for certified divers)
* 100 cf tank (15 liters)
* Dive courses, training, and certifications
* Dive gear (dive gear is available on board for rental; please contact us in advance should you wish to rent any)
* Mandatory diving insurance & SMB
* Travel insurance (suggested)
* Laundry service and satellite phone usage
* Crew gratuities

## 3. Reservation and deposit

Reservation may be made:

* By email to info@mari-liveaboard.com
* Through the booking request form on our website
* Via a travel agent

All booking requests must be made by electronic mail and should contain:

* The cruise ID or requested departure
* Preferred cabin type and occupancy
* Full names of all passengers
* Diving level & number of logged dives

Once a booking has been confirmed, guests will be required to complete the passenger information form and provide copies of their passport and dive insurance documentation.

A deposit of 30% of the cruise rate per person must be received to our bank account no later than 7 days after the date of the booking request has been made.

Upon receipt of the deposit within the stated period, we will confirm your reservation. If the deposit is not received within the stated period, we reserve the right to offer the requested cabin(s) to other guests.

## 4. Payment of the Balance

The balance of 70% of the cruise rate per person must be received to our bank account no later than 90 days prior to the departure date.

Should full payment not be received by this time, we reserve the right to cancel the reservation.

For last minute bookings, where the time between the booking and departure date is less than 90 days, payment in full must be made to obtain a confirmed reservation.

## 5. Payment Instructions

Payments must be sent to the following bank account:

* **Account Holder**: PT Wisata Laut Indah
* **Address**: Jl Betaka Gg Anggrek 2 No.15, Desa/Kelurahan Dalung, Kec. Kuta Utara, Kab. Badung, Provinsi Bali, Kode Pos: 80363
* **Bank**: Permata
* **Bank Address**: Pertokoan Istana Regency, Jl. Raya Sesetan Blok B12, Denpasar Selatan 80223
* **Account Number**: 1237829022 (multi-currency EUR, USD)
* **SWIFT Code**: BBBAIDJAXXX

Payments for rental equipment may be made in advance or onboard in cash.

Payments for onboard purchases, additional services, national park fees, fuel surcharges, and other onboard consumption are due onboard unless otherwise specified.

For all bank transfers, the guest must select the charge option 'OUR' so that the full invoiced amount is received. All bank transfer charges (including intermediary-bank fees), online payment fees, and currency conversion costs are the responsibility of the guest.

## 6. Private / Full Boat Charter

Any of our scheduled cruises may be booked as a private / full boat charter.

Within reasonable operational limits, charter guests may request adjustments to the cruise itinerary, number and locations of dives, and land excursions, subject to prior approval.

What may not be changed are the embarkation/disembarkation dates and ports, as well as the number of nights onboard.

To obtain a confirmed reservation for a private / full boat charter, the following non-refundable payments must be made:

* A deposit of EUR 3,000 no later than 7 days after the booking date
* An additional deposit of EUR 6,000 no later than 270 days prior to departure
* Payment up to 50% of the charter value no later than 180 days prior to departure
* Full balance no later than 90 days prior to departure

For bookings made less than 90 days prior to departure, full payment is required immediately.

All charter payments are non-refundable in the event of cancellation by the chartering party.

## 7. Changes to Brochure Description and/or Website, Changes to Rates and Transportation Costs

### 7.1 Changes Before Conclusion of the Contract

Mari Liveaboard reserves the right to make alterations and changes to brochure information, service descriptions, website content, and prices at any time before the time of booking.

Should the necessity arise, Mari Liveaboard will inform the agent or individual client prior to entering the contract. The date the contract is entered is the date that a booking fee is received by Mari Liveaboard.

### 7.2 Changes to Price After the Contract Has Been Entered

In rare circumstances, it is possible that prices must be increased. The circumstances under which this may occur are as follows:

1. Increases in transportation costs (including fuel costs), increases in state taxes and duties (i.e. embarkation/disembarkation fees, sales taxes, etc.), and currency fluctuations.
2. Mari Liveaboard reserves the right to raise the agreed price up to 61 days prior to departure.

### 7.3 Inability to operate by Mari Liveaboard

In the unlikely event that Mari Liveaboard is unable to operate a scheduled departure due to circumstances beyond its reasonable operational control (including events described in the force majeure clause), Mari Liveaboard will use reasonable efforts to source an alternative vessel or operator of a comparable standard as a replacement. If no suitable replacement can be arranged, Mari Liveaboard will offer the agent or individual client, in the following order: (a) to reschedule the booking to a future departure date, subject to availability; (b) a credit note for the amounts paid, to be used against a future booking; or (c) a refund in accordance with these Terms and Conditions. Mari Liveaboard will inform the agent or individual client of such a situation at the earliest possible opportunity, including any effect this may have on the itinerary or pricing.

### 7.4 Itinerary Changes & Adjustment

All itineraries are provisional and may be amended at any time.

Changes may be required due to safety considerations, park or site closures, weather conditions, government regulations, or other external or operational factors beyond our control.

Mari Liveaboard reserves the right to make such changes without prior notice where necessary.

No refunds or compensation will be provided for itinerary changes made for these reasons.

## 8. Cancellations by Guests

All cancellations must be made by e-mail to info@mari-liveaboard.com. The date that Mari Liveaboard receives the cancellation of the booking will be the date used to determine the cancellation penalty.

* 91 days or more prior to the departure date: 25% of the cruise rate per person
* 90-61 days prior to the departure date: 50% of the cruise rate per person
* 60 days or less prior to the departure date: 100% of the cruise rate per person

The applicable cancellation fee will be deducted from the payment received. Any remaining amount may be refunded or credited toward a future booking.

A guest who has booked into a Mari Liveaboard trip, and who wishes to cancel, has the option to substitute another person (not already scheduled on the trip) into his or her space to avoid the cancellation penalty. Passenger substitution will be allowed up to 5 days prior to departure.

### No Show

Mari Liveaboard will not refund any money to guests who fail to show for boarding on the trip departure date, whether this is due to missed airline connections, lack of proper paperwork required to enter the country, or any other reason.

If an airline connection is missed, Mari Liveaboard will make all reasonable efforts to assist the guests in joining the vessel at a later point in the itinerary. However, any related costs (including flights, transfers, speedboat arrangements, accommodations, or any other associated expenses) shall be borne solely by the guests.

### Trip Interruption

If the guest interrupts or cuts short a trip for any reason, Mari Liveaboard is not liable to refund any money to the guest.

In cases of emergency such as personal illness or accident, Mari Liveaboard will assist in making the necessary arrangements for the guest's return travel. However, all related costs shall be borne solely by the guest.

No refunds will be provided for unused services, late arrivals, or early departures.

## 9. Changes and Cancellations by Mari Liveaboard

Mari Liveaboard reserves the right to:

1. Change the itinerary and/or program during a trip if deemed necessary due to weather conditions, sea conditions, harbor closures, safety concerns, or operational reasons.
2. Cancel a reservation if a condition or action on the guest's part gives justifiable cause to do so. In such instances, Mari Liveaboard reserves the right to retain payments already made and shall not be liable for any additional costs incurred by the guest.
3. Change embarkation or disembarkation harbors where necessary due to circumstances beyond reasonable operational control. Mari Liveaboard will provide reasonable logistical assistance but shall not be responsible for any associated costs.
4. Refuse boarding, restrict participation, or remove from the vessel any guest whose behavior is deemed unsafe, disruptive, abusive, intoxicated, illegal, or likely to endanger the safety, comfort, or well-being of the vessel, crew, or other guests. No refund or compensation shall be due in such circumstances, and any resulting costs shall be borne solely by the guest.

## 10. Cancellation Due to Force Majeure

Mari Liveaboard does not offer any refunds in the event of Force Majeure (acts of God such as natural disasters, epidemics, earthquakes, tsunamis, tidal waves, volcanic eruptions, floods, severe storms and other extraordinary natural disasters that could not reasonably be foreseen or prevented) and human-caused events (war, invasion, hostilities, act of foreign enemies, civil war, rebellion, revolution, insurrection, riots, civil commotion, terrorism, sabotage, government actions: embargoes, requisitions, sanctions, changes in law, orders by governmental authorities, strikes, lockouts, large-scale labor disputes that shut down operations). In the event of this happening, Mari Liveaboard will contact the guest as soon as possible to communicate re-scheduling options. Mari Liveaboard may, at its sole discretion, offer rescheduling options or future cruise credits. Refunds are not guaranteed in cases of force majeure. In the event of a cancellation, Mari Liveaboard will not be held responsible for any related costs (i.e. flights, hotels, or any other such costs) the client might have in conjunction with this trip.

Please note that guests are strongly advised to have valid travel, and cancellation insurance.

## 11. Damages Resulting from Personal Injury, Illness or Death

The guest acknowledges that scuba diving, snorkeling, tender transfers, and maritime travel involve inherent risks including serious injury, decompression sickness, permanent disability, or death. By participating in these activities, the guest voluntarily assumes all such risks.

Mari Liveaboard is not responsible for any compensation for any damage that results from illness, personal injuries, or death which may be sustained while on any portion of the trip, whether this is due to the ownership, maintenance, use, operation, or control of any vehicle, vessel, or conveyance used in carrying out these trips.

Mari Liveaboard assumes no liability for any damage whatsoever caused by failure, delay, irregularities, acts, or omissions provided by owners, operators, public carriers, hotels, or third-party providers, even if the service was arranged on behalf of Mari Liveaboard.

Mari Liveaboard shall not be held responsible for any injury to person (whether or not resulting in death) arising out of any act of war, insurrection, revolt, civil unrest, or military action occurring in the countries of origin, destination, or passage.

In the case of a medical problem or injury occurring during the trip, either onboard or ashore, which results in costs for medical care, evacuation, repatriation, or hospitalization, responsibility for payment of these costs belongs solely to the guest.

## 12. Certification & Disabilities

Upon boarding, all divers are required to show proof of dive certification, medical diving insurance such as DAN or equivalent, and a recent medical statement assuring that they are fit for diving for any ongoing medical conditions issued within the past year.

All divers must complete a liability release waiver prior to diving.

Upon payment of the deposit as a diver, the guest certifies that he or she does not have a mental or physical disability that would make participation in the dive program unsafe.

Upon payment of the deposit, the guest also certifies that he or she has the necessary diving experience to participate safely in the dive program and agrees to follow the instructions of the dive guides and crew during the trip.

Mari Liveaboard reserves the right to prohibit further diving participation or restrict a guest's activities where deemed necessary for safety reasons by the captain, cruise director, dive manager, or medical personnel.

In emergency situations, Mari Liveaboard may arrange medical treatment, evacuation, or transportation on behalf of the guest where reasonably necessary. Any related costs, including medical care, evacuation, hospitalization, transportation, or repatriation, shall be borne solely by the guest.

## 13. Loss or Damage to Personal Belongings

Mari Liveaboard is not responsible for any loss or damage to a guest's personal belongings while on any portion of the trip.

## 14. Insurance

While Mari Liveaboard makes every effort to provide a safe and enjoyable cruise experience, all guests are strongly advised to obtain adequate insurance coverage, including:

* Medical insurance
* Travel insurance
* Cancellation insurance
* Baggage and personal belongings insurance

Guests are solely responsible for ensuring that their insurance coverage is appropriate for liveaboard diving activities in Indonesia.

## 15. Photography & Media Release

Mari Liveaboard may take photographs and videos during the cruise for promotional, marketing, or social media purposes. By participating in the trip, the guest grants Mari Liveaboard the right to use such materials in which the guest may appear, without compensation or prior approval.

Guests who do not wish to appear in such materials must notify Mari Liveaboard in writing prior to departure.

## 16. Governing Law & Jurisdiction

These Terms and Conditions, and any agreement entered into between the guest and Mari Liveaboard, shall be governed by and interpreted in accordance with the laws of the Republic of Indonesia.

Any dispute, claim, or matter arising out of or relating to these Terms and Conditions or the guest's participation in a Mari Liveaboard trip shall fall under the exclusive jurisdiction of the competent courts of Denpasar, Bali, Indonesia.
`

// ---------------------------------------------------------------------------------------------
// Markdown subset → Portable Text. Keys are deterministic (`t0`, `t1`, …) on purpose: re-running
// the seed produces byte-identical blocks instead of churning _keys, so a re-run is a no-op diff.
// ---------------------------------------------------------------------------------------------
type Span = { _type: 'span'; _key: string; text: string; marks: string[] }
type Block = {
  _type: 'block'
  _key: string
  style: string
  markDefs: never[]
  children: Span[]
  listItem?: 'bullet' | 'number'
  level?: number
}

let seq = 0
const key = () => `t${seq++}`

function inlineSpans(text: string): Span[] {
  const spans = text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => {
      const bold = part.startsWith('**') && part.endsWith('**')
      return { _type: 'span' as const, _key: key(), text: bold ? part.slice(2, -2) : part, marks: bold ? ['strong'] : [] }
    })
  return spans.length ? spans : [{ _type: 'span', _key: key(), text: '', marks: [] }]
}

function toPortableText(md: string): Block[] {
  const blocks: Block[] = []
  for (const raw of md.split('\n')) {
    const line = raw.trim()
    if (!line) continue

    let style = 'normal'
    let listItem: 'bullet' | 'number' | undefined
    let text = line

    if (line.startsWith('### ')) {
      style = 'h3'
      text = line.slice(4)
    } else if (line.startsWith('## ')) {
      style = 'h2'
      text = line.slice(3)
    } else if (line.startsWith('* ')) {
      listItem = 'bullet'
      text = line.slice(2)
    } else if (/^\d+\.\s/.test(line)) {
      listItem = 'number'
      text = line.replace(/^\d+\.\s/, '')
    }

    blocks.push({
      _type: 'block',
      _key: key(),
      style,
      markDefs: [],
      children: inlineSpans(text),
      ...(listItem ? { listItem, level: 1 } : {}),
    })
  }
  return blocks
}

const ID = 'page-terms'

// 🟡 SEO is a DRAFT — written here so the fields are never empty (a page shipping with no meta
// description gets one written for it by Google). {siteName} is the site-wide token resolved in
// buildSeoMetadata; the site's name is never hardcoded per document.
const SEO = {
  _type: 'seo',
  title: 'Terms & Conditions | {siteName}',
  description:
    'Booking, payment, cancellation and liability terms for Mari Liveaboard cruises in Indonesia — including what is included in the cruise rate, deposit schedules and insurance requirements.',
  breadcrumbTitle: 'Terms & Conditions',
}

async function run() {
  // Report the lay of the land BEFORE writing anything — the dataset is the authority on what
  // already exists, not this script's assumptions.
  const existing = await client.fetch(`*[_type == "page"]{_id, title, "slug": slug.current} | order(_id asc)`)
  console.log('existing `page` documents:', JSON.stringify(existing))

  const body = toPortableText(MD)
  const headings = body.filter((b) => b.style === 'h2').length
  const subHeadings = body.filter((b) => b.style === 'h3').length
  console.log(`parsed body: ${body.length} blocks (${headings} h2, ${subHeadings} h3)`)

  const doc = {
    _id: ID,
    _type: 'page',
    title: 'Terms & Conditions',
    slug: { _type: 'slug', current: 'terms' },
    body,
    showContactSection: true,
    seo: SEO,
  }

  await client.createOrReplace(doc)
  console.log(`${ID}: created/replaced`)

  // Seed LAW: a published-only patch leaves a stale draft shadowing it in Studio, so any existing
  // draft gets the same content. Never CREATE a draft that isn't already there.
  const draftId = `drafts.${ID}`
  const draftExists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id: draftId })
  if (draftExists) {
    await client
      .patch(draftId)
      .set({ title: doc.title, slug: doc.slug, body, showContactSection: true, seo: SEO })
      .commit()
    console.log(`${draftId}: patched`)
  } else {
    console.log(`${draftId}: not present, skipped`)
  }

  const check = await client.fetch(
    `*[_id == $id][0]{ title, "slug": slug.current, "blocks": count(body), "firstText": body[0].children[0].text, "seoTitle": seo.title }`,
    { id: ID },
  )
  console.log('verify:', JSON.stringify(check))
}

run().then(
  () => process.exit(0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
