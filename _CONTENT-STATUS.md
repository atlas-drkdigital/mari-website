# _CONTENT-STATUS.md — real vs. placeholder content tracker

## NEW BOAT CONTENT (TO INTEGRATE)
Refined editorial direction
Hero
H1:
Mari Liveaboard
Subheading:
A traditional Phinisi liveaboard for serious divers.
The locked tagline works well here precisely because it is restrained. The imagery can supply the romance.
Overview
Eyebrow:
A different way to dive Indonesia
Heading:
Tradition at heart. Diving by design.
Body:
Built in South Sulawesi from ironwood and teak, Mari is a 30m traditional Indonesian Phinisi shaped for voyages through the archipelago. She carries just 14 guests, preserving the intimacy of a small boat while offering the space and capability demanded by days spent diving far from shore.
Life aboard follows the water. A cruise director and three dive guides lead the operation, supported by three tenders, 29 tanks and Nitrox produced onboard. Entries are efficient, surface intervals unhurried and the next dive is never far from mind.
Above deck, the pace softens. Lunch is served in the open air, framed by 270° sea views. There are shaded corners for the heat of the afternoon and open spaces for watching forested islands recede into blue.
All seven cabins sit on the main deck, each with a sea view, private air conditioning and an ensuite bathroom with hot water. With 14 crew for 14 guests, service remains attentive without becoming theatrical.
Mari is premium where it counts: in the diving, the sense of space and the quiet competence of the people running the journey. Everything necessary for reaching Indonesia’s remarkable waters, with little that distracts from them.
Key features
Heading:
The character of Mari
A 30m traditional Indonesian Phinisi
Seven main-deck cabins, all with sea views
No more than 14 guests
14 crew, including four dive staff
Three tenders supporting the dive program
Nitrox produced onboard
29 tanks in 12L and 15L sizes
50 sqm al fresco dining area
Bar and 270° views across the water
Cabins
Eyebrow:
Seven cabins. Fourteen guests.
Heading:
A private view of the sea
Introduction:
Every cabin aboard Mari is found on the main deck, where sea views and natural light bring the journey inside. Private air conditioning, an ensuite bathroom and hot water make each one a comfortable retreat between dives.
Deluxe Cabin
Heading:
Flexible space for travelling together
Mari’s three Deluxe Cabins can be arranged with a double or twin beds, with an additional bed available. Their adaptable layout works well for couples, families and small groups sharing the voyage.
Natural light, a sea view and a private ensuite create an easy place to return to after the day’s diving.
Superior Cabin
Heading:
Designed for dive companions
The four Superior Cabins use a practical bunk-bed arrangement for up to two guests. They are particularly well suited to solo travellers and dive buddies who prefer to share.
Like every cabin aboard Mari, each is located on the main deck and includes a sea view, private air conditioning and an ensuite bathroom with hot water.
Gallery
Eyebrow:
Life aboard Mari
Heading:
Between one dive and the next
Introduction:
A liveaboard is experienced in the intervals: the quiet before an early descent, lunch overlooking an empty horizon and the slow return through the islands at dusk. Explore the spaces where those moments unfold aboard Mari.
Gallery tabs
The Boat
Heading:
A Phinisi made for the journey
Built in the boatbuilding tradition of South Sulawesi, Mari brings together ironwood, teak and the unmistakable lines of an Indonesian Phinisi. Her proportions leave room for life to unfold easily, even with a full complement of 14 guests.
Dining
Heading:
The best table is open to the sea
Meals are served in Mari’s 50 sqm al fresco dining area, where the bar and 270° views turn even an ordinary breakfast into part of the voyage. The menu moves between Indonesian and Western cooking, with dietary requirements accommodated when arranged in advance.
Diving
Heading:
Serious diving, quietly well run
Three tenders, 29 tanks and Nitrox produced onboard keep the operation moving without unnecessary fuss. A cruise director and three dive guides lead each day, allowing the experience to remain personal from the first briefing to the final ascent.
Relaxation
Heading:
The luxury of time between dives
There is space aboard Mari to step away from the rhythm of the group. Find some shade, stretch out in the open air or spend the surface interval watching Indonesia’s islands pass at the pace of the boat.
Here, “luxury” describes time and space rather than making a product-tier claim, so it feels editorial without repositioning Mari as an ultra-luxury vessel.
Others
Heading:
Comfort, considered
Every cabin has private air conditioning, an ensuite bathroom and hot water. Two reverse-osmosis systems produce up to 10,000L of fresh water each day, quietly supporting longer voyages into remote waters.
SEO description
Meta title:
Mari Phinisi | Indonesia Diving Liveaboard
Meta description:
Step aboard Mari, a 30m Indonesian Phinisi for serious divers, with seven sea-view cabins, 14 crew, onboard Nitrox and space for just 14 guests.
This is the tonal middle ground I would recommend: the headings and transitions deliver the magazine quality, while the factual sentences establish trust and search relevance. The prose invites desire without pretending every practical feature is “world-class,” “unforgettable” or “unparalleled.”

--STOP HERE

Companion to `_SCHEMA-SPECS.md` (tracks whether a *field* exists and is approved) — this tracks whether
the *value* currently sitting in that field is real, Figma-sourced-but-unconfirmed, or outright
placeholder standing in for a smoke test. Different axis, same "don't lose track of it" purpose.

**Why this exists:** smoke-testing a schema means filling real documents with a mix of real and
stand-in content before actual content exists — genuinely useful (see MANAGER.md, 2026-07-15), but
only safe if every stand-in value is tracked somewhere, or a stock photo or filler line risks shipping
to production by accident. This file is that tracker.

**Status legend:**
- ✅ **Real** — final or confirmed-accurate content, safe to ship as-is
- 🟡 **Figma-sourced, unconfirmed** — copy pulled directly from the Figma mock; likely real (Adinda/
  Serge wrote it during design), but not explicitly signed off as final launch copy
- 🔴 **Placeholder** — stock photo or clearly-filler text standing in just to exercise the schema.
  **MUST be replaced before launch — this is the whole point of the tracker.**
- ⬜ **Not yet populated**

**Pre-launch gate:** zero 🔴 rows remaining anywhere in this file. Add this as a standard check
alongside the other pre-launch items already tracked in CLAUDE.md / `drk-website`'s `pre-launch.md`.

---

## `homePage` — Homepage singleton (doc id `homePage`) — seeded 2026-07-16 (homepage vertical slice)

All copy lifted verbatim from the already-built, QA-passed homepage components (`src/components/sections/*`),
which were themselves built from the Figma design — so this is design-sourced content, real enough to
review and likely launch copy, but not a fresh sign-off. Images are the built homepage's own `/assets/*`
photography, uploaded to Sanity. Referenced docs (`whyUsItem`, general `faq`, `testimonial`) seeded in the
same pass, same provenance.

| Field / group | Status | Source | Notes |
|---|---|---|---|
| Hero (heading accent/main, subheading, eyebrow, search placeholder) | 🟡 | built homepage | Verbatim from Hero.tsx |
| heroImage | 🟡 | built homepage | `hero.webp` uploaded to Sanity |
| The Boat (heading, body ×2 paras, link text, eyebrow) | 🟡 | built homepage | Verbatim from TheBoat.tsx |
| theBoatImage | 🟡 | built homepage | `the-boat.webp` uploaded |
| Why Us (heading, eyebrow) + 4 `whyUsItem` docs (headline/description/image) | 🟡 | built homepage | Verbatim from WhyUs.tsx; images `why-us-*.webp` uploaded |
| Latest Articles (heading, link text, eyebrow) | 🟡 | built homepage | Section chrome; cards auto-pull latest 3 blog posts (3 covers uploaded) |
| FAQ (heading, link text, eyebrow) | 🟡 | built homepage | Section chrome on homePage; the questions shown are the ones toggled "Feature on homepage" on `faqGeneral` + `boat` |
| **`faqGeneral`** — 11 cross-cutting Qs in 3 categories (Payment & Booking, What's Included, Others) | 🟡 | mari-core `core/commercial.md` | Re-seeded answer-first in the 2026-07-16 FAQ restructure. **⚠️ See the commercial-figures warning below — several of these carry money/policy numbers.** |
| **`boat-mari.faqSections`** — 7 Qs (General Information) | 🟡 | mari-core `core/boat.md` | Re-seeded answer-first 2026-07-16. Boat facts (crew 1:1, Nitrox, OW+30, dive schedule) are ✅-marked in mari-core; kept 🟡 only pending Adinda's read-through |
| **`destination-komodo.faqSections`** — 6 Qs (Diving 4 / Travel 1 / Others 1) | 🟡 | migrated from the retired `faq` docs | Content preserved from the old docs, em dashes removed per brand rule. **"What is included in a Mari trip?" (Others) is a duplicate** of the What's Included the destination page will pull from General FAQ — decide in the destination slice |
| **`faqGeneral.seo`** | ⬜ | — | New field, not yet filled. Needed when the `/faq` page is built |
| Testimonials (heading, link text, eyebrow) | 🟡 | built homepage | Section chrome; reviews below |
| 4 REAL `testimonial` docs | 🟡 | live-site reviews | Real guest reviews; one em dash removed per brand rule |
| 4 DRAFT `testimonial` docs (`testimonial-draft-*`) | 🔴 | AI-drafted demo | Titles keep "[DRAFT]"; realistic demo reviews for the 8-card carousel — MUST delete or replace with real reviews before launch |
| CTA | 🟡 | built homepage | Content in the shared `cta` singleton; 2 card images uploaded |
| Contact section copy (eyebrow, heading, intro) — **now in `siteSettings`** | 🟡 | built homepage | Moved off homePage → siteSettings "Contact Section" 2026-07-16; form has no backend yet (Resend later) |
| seo | ⬜ | — | Not populated |
| **heroVideo** (optional cover video) | 🔴 low-pri | — | Empty. Wired + browser-verified 2026-07-21 (a CDN video URL in the field autoplays over the poster on desktop). No real asset yet — see the **Hero background video** block below for specs + hosting. Boat + destination share the same field (`boat.coverVideo` / `destination.coverVideo`). |
| Footer / Nav | — | — | NOT modeled on homePage — global chrome, deferred to a siteSettings/navigation slice; still hardcoded |
| **Destinations** — 9 `destination` docs (name, tagline, seasonNights, coverImage) | 🟡 | built carousel | Wired to real docs 2026-07-16; carousel + Hero search + Contact picker all read these |
| ↳ `excerpt` for raja-ampat, komodo, banda-sea, triton-bay, sumbawa | 🟡 | built carousel / mari-core | Real descriptive copy |
| ↳ `excerpt` for flores, bali, north-sulawesi, halmahera | 🔴 | placeholder | "Itinerary details still being finalized — check back soon." — real copy needed before launch |

### ⚠️ COMMERCIAL FIGURES IN THE FAQ ANSWERS — verify before launch (flagged 2026-07-16)
The General FAQ answers seeded in the FAQ restructure contain **guest-facing money and policy numbers**,
taken from `mari-core`'s `core/commercial.md` — a file that **marks itself non-evergreen** ("sourced from
the live website and may change at any time"), last verified **2026-06-09**. Wrong cancellation terms or
fees on a public page are a real commercial problem, not a copy nitpick. **Verify each against the live
T&C / on-board-pricing pages (or with Serge) before launch:**
- Deposit 30% within 7 days; balance 70% by 90 days before departure; <90 days payable in full
- Cancellation 91+ days = 25%, 90–61 = 50%, ≤60 = 100%; guest substitution up to 5 days before
- Single supplement 50% of base per-person rate
- Park & port fees 140 EUR (≤11 nights) / 200 EUR (12+); fuel surcharge 150 EUR / 250 EUR
- Onboard cash currencies (EUR, USD, CHF, IDR); boarding 6:30am–noon; transfers included
- Contact details quoted in "How do I book a trip?" (info@mari-liveaboard.com, +62 812 9748 3740)

Not marked 🔴 (they are not filler — they are our best current record), but they are **not signed off**
either. Treat this block as its own pre-launch check alongside the zero-🔴 gate.

### Hero background video — specs + hosting (parked 2026-07-21, LOW PRIORITY, content-pass item)
The `heroVideo` feature is built and verified on all wired pages (home + boat; destination inherits it when
that page is built). What's missing is a real asset. **This is optional and low-priority — the poster image
is a complete hero on its own.** When real Mari footage exists, here's the target:

**Video spec:** MP4 (H.264 codec) · 1920×1080 (720p acceptable — it sits under a dark scrim) · **6–12s
seamless loop** (first/last frame match) · **2–4 MB, hard cap ~5 MB** · 24–30 fps · **audio track stripped**
(autoplays muted) · slow calm motion (drone over the boat, gliding reef) · keep the key subject off the LEFT
third (copy + scrim sit there; it's `object-cover` cropped). Encode in HandBrake: H.264, RF ~24–28, audio =
None, Web Optimized ✓.

**Hosting — NOT in Sanity** (10GB/mo bandwidth cap) and NOT in `/public` (bills Vercel bandwidth). Host on a
video CDN and paste the public URL into the Studio field. **🅿️ TO TEST: Cloudflare R2** — free 10GB storage +
**zero egress fees**, the best long-term free option and reusable across DRK sites (slight setup: bucket +
public access/custom domain). Quick free alternative: **jsDelivr + a public GitHub repo** (commit the MP4,
serve via `cdn.jsdelivr.net/gh/...`; only caveat = public repo). Cloudinary free tier also works but its
credits can run out with traffic. **Workflow once hosted:** copy public URL → paste into `heroVideo` "Video
URL" in Studio → toggle "Play on mobile?" only if wanted (default keeps the poster on phones).

---

## `boat` — Mari (doc id `boat-mari`, migrated from `boatPage-mari` 2026-07-16 — see MANAGER.md. All field
values below carried over unchanged; only `_id`/`_type` changed.)

| Field | Status | Source | Notes |
|---|---|---|---|
| name, pageTitle | ✅ | mari-core | "Mari" / "Mari Liveaboard", confirmed facts |
| **slug** (`mari`) | 🟡 | recovered 2026-07-17 | **Did not exist on `boat-mari` until 2026-07-17.** The 2026-07-16 type rename migrated only the *published* doc; the slug lived solely in the unpublished draft and was recovered from it. Value is whatever was typed pre-rename — **confirm `/boat/mari` is the URL you actually want before the route ships**, it has never been a deliberate decision |
| **gallery** (empty) | 🔴 | **cleared 2026-07-17 — needs real curated photos** | **Adinda's call: empty on BOTH sides, re-add real images as the boat page is built.** Done 2026-07-17 and verified on published AND draft (`count(gallery)` = 0 on each). Backup of the removed asset refs: `_scripts/_gallery-backup-boat-mari.json`. **What was removed was smoke-test residue, not content:** `mari-hero-smoketest.jpg` (719KB, literally a smoke-test upload), `mari-liveaboard-exterior-001.jpeg` + `-001-edited.jpeg` (same shot twice), `...-ext-002-vertical-fave.jpg`; all four had empty alt/title/caption. **Why it mattered:** published held the 4 while the draft had 0 (the 2026-07-17 salvage patched published only), so a Publish click would have silently restored junk no editor could see. **Still owed: real curated photos through the image pipeline (descriptive kebab-case rename + compress BEFORE upload).** |
| coverImage | 🟡 | Figma | Figma's own hero image asset (node 778:8708) — likely real Mari photography, not explicitly confirmed |
| tagline | 🔴 | Figma | The known-wrong Komodo placeholder, kept deliberately (not silently fixed) so this row exists to prove the tracker catches it — see boat.md open item #7 |
| stats | ✅ | mari-core | Cabins 7 / Guests 14 / Boat Size 30m / Crew 14, all confirmed facts |
| brochurePdf | ⬜ | — | No real PDF exists yet, not forced |
| keyFeatures + keyFeaturesImage | 🟡 | Figma | Both the 6 bullets and the image pulled directly from Figma's HighlightCard (node 778:8748) |
| overviewHeading, overviewBody | 🟡 | Figma | Pulled verbatim from the Overview section (node 778:8747) |
| cabinsIntro | 🟡 | Figma | Pulled verbatim (node 778:8763's intro text) |
| galleryDescription | 🔴 | Claude | Written as a placeholder summary — Figma has no separate whole-gallery description slot (only per-tab content), so this was authored, not sourced |
| **galleryTabs** — 5 tabs (added 2026-07-17) | 🟡 | Figma (1 tab) + mari-core (4 tabs) | Per-tab copy for the **Amenities** section. **Only "The Boat" has Figma copy** (node `778:8858`/`778:8860`), used near-verbatim; the other 4 are drafted from `mari-core/core/boat.md`'s confirmed facts under `brand/voice.md`'s rules, not invented. All 5 are **placeholder pending Adinda's content pass**. Per-tab detail below |
| ↳ The Boat — "Plenty of space for everyone" | 🟡 | **Figma verbatim, ONE edit** | ⚠️ **Figma says "sundeck"; `mari-core` LOCKS the deck naming as sky / upper / main / lower deck.** Seeded as **"sky deck"** — the locked convention wins over Figma's older copy. **Figma should be updated to match** (same class as the "excellent value for money" fix already owed). Also dropped "delectable" (voice: no empty enthusiasm) |
| ↳ Dining — "Meals with 270° sea views" | 🟡 | mari-core `core/boat.md` | Every fact confirmed: 50 sqm ✅, bar ✅, 270° ✅, Indonesian/Western mix ✅, all meals included ✅, dietary on advance notice ✅ |
| ↳ Diving — "Built for serious divers" | 🟡 | mari-core `core/boat.md` + `brand/positioning.md` | Facts confirmed: 29 tanks 12L/15L, Nitrox via NRC membrane, 3 tenders, 3 camera charging stations, rinse tank. "Serious divers" is the locked target descriptor |
| ↳ Relaxation — "Space to unwind between dives" | 🟡 | mari-core `core/boat.md` | Sky deck + loungers ✅, shaded lounge deck + bean bags ✅, kayaks ✅ |
| ↳ Others — "Good to know" | 🔴 | mari-core, but ⚠️ | Desalinators (2× RO, 10,000L/day) and hot water are confirmed. **The Wi-Fi line is the risk:** boat.md open item #6 flags a possible Starlink upgrade, so "free when in range of a mobile network" may undersell or oversell. **Confirm current state with Serge before launch.** "Others" is also the weakest tab concept — a catch-all with no Figma design behind it |
| specifications | ⚠️ verify in content pass | mari-core | All 8 category *labels* are present in the live doc (per GROQ query). Adinda reported the *content* not showing in Studio after reload — bodies to verify/reload during the content pass (Adinda's call: don't fix now, load in content pass). Category list is correct: Vessel & Accommodation, Crew, Diving Equipment, Tenders, Machinery & Power, Navigation & Communication, Safety Equipment, Amenities & Others |
| overviewCta | — | — | Field removed entirely — was a modeling mistake (there's no separate CTA, it's a truncate/"Read more" on `overviewBody` itself) |
| layoutDiagrams | ⬜ | — | Not populated |
| eyebrows + section headings | — | — | **Moved off this doc 2026-07-17** → the `boatDefaults` singleton (tracked in its own section below). The four `showXEyebrow` toggles were dropped entirely. |

## `boatDefaults` — singleton (doc id `boatDefaults`), seeded 2026-07-17

Shared section chrome for every boat page, edited once. `{boat}` injects the boat's short name.

| Field | Status | Source | Notes |
|---|---|---|---|
| keyFeaturesHeading | 🟡 | carried from `boat-mari` | "Key features". **Adinda confirmed 2026-07-17 this is shared chrome, not per-boat** |
| cabinsHeading | 🔴 | Claude | "Cabins" is a reasonable guess, not literal Figma text — Figma didn't show a distinct section heading here, only the intro paragraph |
| galleryTitle | 🟡 | Figma | "Gallery" matches the Figma heading text directly |
| specificationsHeading | ✅ | Figma | "Layout and specifications" matches Figma exactly (node 778:8882), and the value was already on `boat-mari` |
| **overviewEyebrow** (`Premium diving at exceptional value`) | 🟡 | mari-core `brand/positioning.md` | Figma has **no eyebrow copy** for the boat page, so this is drawn from the locked positioning statement ("premium... at exceptional value") rather than invented. Uses both locked phrasings ("premium", "exceptional value"). **Placeholder pending Adinda's content pass** |
| **cabinsEyebrow** (`7 sea-view ensuite cabins`) | 🟡 | mari-core `brand/positioning.md` | Verbatim from the locked selling points / alternate highlights. Numeral per the voice rule (specs take numerals). **Placeholder pending content pass** |
| **galleryEyebrow** (`Life aboard {boat}`) | 🔴 | Claude | The one eyebrow with **no mari-core anchor** — a gallery kicker has no positioning fact behind it. Closest to invented of the four. **Placeholder pending content pass** |
| **specificationsEyebrow** (`30m of traditional Phinisi`) | 🟡 | mari-core `brand/positioning.md` + `core/boat.md` | Both facts confirmed (30m length; Phinisi heritage is a "genuine selling point — lead with it"). Metric-first per the voice rule. **Placeholder pending content pass** |

**Eyebrow sourcing note (Adinda, 2026-07-17):** inventing copy is fine since a content pass follows — but
**pull from `mari-core` / `mari-itineraries` / related skills first** when Figma has no copy or looks like a
wrong copy-paste, rather than authoring from nothing. The first pass at these four was generic
tourist-board filler ("Discover Mari", "Every detail") — exactly what `brand/voice.md` bans — and was
redone against the locked positioning. Standing habit, not a one-off.

## `cabinType` — Deluxe Cabin only (doc id `cabinType-mari-deluxe`)

| Field | Status | Source | Notes |
|---|---|---|---|
| name, count, maxGuests, description, bedConfiguration, deckLocation, window, bathroom, airConditioning | ✅ | Figma + mari-core (cross-confirmed by both) | Pulled verbatim from Figma's Cabins section, matches mari-core's boat.md independently |
| images | 🔴 | Picsum (stock) | Generic stock photo, explicitly NOT a real cabin — alt text says PLACEHOLDER |

Superior Cabin: not created — one cabin type is enough to exercise the form for this smoke test.

## Gallery — reset 2026-07-15 (schema reworked to array-on-page)

The 3 test `galleryImage` documents and 3 `galleryCategory` documents from the earlier smoke test were
**deleted** when the gallery moved from separate documents to an array on `boatPage` (see MANAGER.md).
`boatPage.gallery` is currently empty (⬜) — real gallery content (category groups + bulk-uploaded
images + per-image alt/caption) loads fresh in the content pass, and is the natural moment to actually
test the native multi-file bulk upload with real files.

---

## Komodo destination page — gallery + itineraries content, seeded 2026-07-22

| Field | Status | Source | Note |
|---|---|---|---|
| `destination-komodo.gallery` (8 images + alt) | 🟡 | Figma | The mock's own Grid Gallery fills (778:8677), full-res originals, descriptive alt seeded |
| gallery captions (8) | 🟡 | Claude draft | General Komodo facts only, written for lightbox QA — Adinda to review/rewrite wording |
| `itinerary-*` `season` (3 docs) | 🔴 | Figma | The mock's "May to June" / "June to August" — NOT verified against real Mari scheduling; confirm before launch |
| `itinerary-*` `image` (3 docs) | 🟡 | Figma | The mock's card fills (dragon / manta / hills — dragon + hills dedupe to the gallery assets) |
| `destinationDefaults.galleryCtaText` / `itinerariesCardCtaText` | 🟡 | Adinda | "View All Images" / "View Full {destination} Schedule" — her wording, pending final copy pass |
| `itinerary-komodo-to-*` / `itinerary-sumbawa-*` (4 docs) | 🟡 | mari-itineraries skill | Real finalized routes (titles/durations/routes/summaries derived from library files); seasons 🔴 placeholder "May to September" |
| `boat-nusa-test` ("Nusa") | 🔴 | TEST ONLY | Fake second boat proving the destination boats stepper — **DELETE before launch** (reuses Mari's cover asset) |
| itinerary `seo.title`/`seo.description` (all 7) | 🟡 | formula | "{title} Itinerary \| {siteName}" + summary-derived descriptions, setIfMissing |

## Private Charters page (`privateCharters` singleton) — hero seeded 2026-07-23

| Field | Status | Source | Note |
|---|---|---|---|
| `heroHeadingIntro` / `heroHeadingMain` | 🟡 | Figma | The mock's own copy ("Private Diving & Snorkeling Liveaboard Charters in" / "Indonesia") |
| `heroSubheading` | 🟢 | Adinda | **Resolved 2026-07-23: 14 crew** ("Fourteen guests, fourteen crew, your itinerary.") — the mock's "ten crew" contradicted its own Benefits row and the boat's Crew stat |
| `heroImage` | 🟡 | reuse | References the BOAT's cover asset (no charter deck photo uploaded yet) — replace with the mock's sunset-deck photo (renamed first, per the image pipeline) |
| `brochurePdf` | 🟡 | reuse | References the boat's placeholder brochure asset |
| sub-nav labels (7) | 🟢 | Adinda | Her corrected list 2026-07-23 (the mock's tabs were a stale copy-paste of the boat page's) |
| route path `/private-charters` | 🟡 | mari-website skill | Matches url-structure.md's recorded slug (checked 2026-07-23); the long 2026-07-15 tentative was a transcription artifact. Open: `/private-charters` vs `/charters` confirm with Serge (in the skill's own open list) |
| `heroImage` (updated) | 🟢 | Figma/master | Now the mock's actual photo — byte-identical to the library's "Sunset drink on the Sky deck.png" master (1448×1086 PNG), uploaded as `mari-liveaboard-guests-sunset-drinks-on-deck.png` |
| `overviewEyebrow` / `overviewHeading` / `overviewBody` | 🟡 | Figma + Claude demo | The mock's §2 copy (2 paragraphs + inline map w/ caption) PLUS an extended **rich-text rendering demo** below it (H3–H6, all marks, internal+external links, both list types, quote, align annotation, medium-size second image) — seeded 2026-07-23 at Adinda's ask to review every editor control. **Demo copy is Claude-drafted, not approved** — replace at the content pass. (Also: she accidentally cleared these fields in Studio same day; the section vanishing was the auto-hide guard working, reseeded.) |
| destinations map (inline in `overviewBody`) | 🟢 | Figma | Figma-authored graphic (2000×1414 PNG) — Figma IS the master; uploaded as `mari-liveaboard-destinations-map-indonesia.png` |
| `seo.title` / `seo.description` | 🟡 | Claude draft | Drafted 2026-07-23 against the reference's primary keyword ("private charter liveaboard Indonesia"); the reference itself said "write once close to launch". **Adinda to review wording** |
| `benefits` (4 items, titles + captions) | 🟡 | mari-website skill | The reference's "Four Highlights" copy; #2 title per the MOCK ("Customized Itinerary…", Adinda's pick); #1 body uses the mock's "charter in Indonesia" (reference variant says "at its class"). Reference hero-subhead still says "ten crew" — stale, flag at skill round |
| `benefits` images #1/#4 | 🟡 | Figma/reuse | #1 = the mock's dining-deck photo (1573×1000 JPEG, `mari-liveaboard-dining-deck-evening-table.jpg`); #4 = sunset-drinks reuse. Both fit their benefit |
| `benefits` images #2/#3 | 🔴 | PLACEHOLDER | Komodo gallery images standing in — neither depicts its benefit (itinerary planning / crew). Replace at the image pass |
| boats chrome (`boatsEyebrow` etc.) | 🟡 | adapted | "Sail Indonesia in comfort" — destinationDefaults' line with the {destination} token resolved by hand; rest matches the destination page verbatim |
| `availabilityIntro` | 🟡 | Claude draft (Adinda's spec) | The 14-guests / "Book Charter" explainer — she specced the content, wording is drafted for her review |
| `availabilityEyebrow` | 🟡 | guess | "Check Availability" — the mock's eyebrow was unreadable at screenshot resolution; confirm wording |
| `availabilityEmbed` | 🟡 | copied | Komodo's INSEANQ embed verbatim — no scheduleRates doc exists yet; revisit the source of truth at the Schedule & Rates build |
| FAQ: `faqSections` ("Private Charters", 6 Q&A) | 🟢 | mari-website skill | Reference copy verbatim (incl. mailto links); chrome (Good to Know / FAQ & Booking Terms / Read All FAQ) from the mock |
| FAQ shared categories | 🟢 | toggle | "Booking Terms" + "What's Included" toggled onto this page — ⚠️ naming vs the mock's "Payment & Booking" flagged in _QA-CHECKLIST |

## Tier 4 shells — 2026-07-16

All new types (`destination`, `itinerary`, `faq`, `testimonial`, `blogPost`, `blogCategory`, `author`,
`homePage`, `whyUsItem`) are ⬜ **not yet populated** — schema shells only, built for Adinda's structural
review, no content loaded. Two stub `page` documents exist (`page-about`, `page-private-charters`) with
placeholder title/slug only — `private-charters-slug-tbc` is a clearly-marked placeholder slug, not real,
pending Adinda's slug confirmation (see MANAGER.md's open items).

## Sourcing policy (locked 2026-07-15)

1. **Text: prefer Figma first.** The Figma mock's copy (Overview paragraph, cabin descriptions, gallery
   tab blurbs, etc.) reads as genuinely authored, not lorem ipsum — pull it in as 🟡, not 🔴, unless a
   field is already known-wrong (like the tagline above).
2. **Images: prefer Figma's own embedded assets where they look like real Mari photography.** Fall back
   to stock (Pexels) only where Figma doesn't have enough distinct images for what the field needs (e.g.
   a gallery category needing several photos where Figma only shows one). Stock always lands as 🔴.
3. Every 🔴 gets a one-line note on *why* it's a placeholder and what real content should replace it —
   not just the tag alone, so nobody has to re-diagnose it later.

---

## 🔴 PHOTO SHOT LIST — boat page (`/boats/mari`), added 2026-07-17

**Why this list exists:** Adinda is sourcing photos in a parallel session and asked for the need to be
scoped rather than discovered later. Everything below currently renders a labelled **"PHOTO NEEDED"**
placeholder (`/assets/placeholder-photo.svg`) — deliberately labelled, not neutral grey, so a gap is
obvious on sight instead of passing as a design choice.

**Before upload (image pipeline folds into the slice, not an end-pass):** rename to descriptive
kebab-case — the Sanity CDN vanity URL derives from the filename — then compress/resize. Both matter for
the 10GB/mo free-tier bandwidth cap.

| # | Where it lands | Sanity field | Need | Status |
|---|---|---|---|---|
| 1 | Hero background, full-bleed | `boat.coverImage` | 1 landscape hero of Mari under sail or at anchor. Wide crop; copy sits left over a dark scrim, so keep the left third uncluttered. **MIN 2560px wide, ideally 3840px** — see the grain note below. | 🔴 |
| 2 | Overview key-features card | `boat.keyFeaturesImage` | 1 portrait/tall image behind the Key Features list. Dark scrim over it, so mid-tones beat a blown-out sky. | 🔴 |
| 3 | Cabins tab — Deluxe | `cabinType.images[]` | 2–3 of a Deluxe cabin. First is the tab's main shot. | 🔴 |
| 4 | Cabins tab — Superior | `cabinType.images[]` | 2–3 of a Superior cabin. ⚠️ Only ONE cabinType appears seeded — Superior may not exist as a document yet. | 🔴 |
| 5 | **Gallery — "The Boat"** | `boat.gallery[]` (tag `The Boat`) | 3–5: exterior, decks, sky deck, hull. | 🔴 |
| 6 | **Gallery — "Dining"** | `boat.gallery[]` (tag `Dining`) | 3–5: dining area, food, bar/cocktails. | 🔴 |
| 7 | **Gallery — "Diving"** | `boat.gallery[]` (tag `Diving`) | 3–5: dive deck, tanks/compressor, tenders, guests kitting up. | 🔴 |
| 8 | **Gallery — "Relaxation"** | `boat.gallery[]` (tag `Relaxation`) | 3–5: lounges, sky deck, cabins-as-retreat. | 🔴 |
| 9 | **Gallery — "Others"** | `boat.gallery[]` (tag `Others`) | 2–3: crew, excursions, anything uncategorised. | 🔴 |
| 10 | Layout & Specs | `boat.layoutDiagrams[].images[]` | Deck-plan diagram(s) — a drawing, not a photo. May exist in the Type A brochure (Canva `DAHL9g9qsrM`). | 🔴 |

**⚠️ Each gallery image MUST be tagged with its category** — the tab carousels filter on
`galleryImage.categories`. An untagged image is invisible in every tab (it still appears in the
combined lightbox, which makes the mistake genuinely hard to spot). This is the single most likely
content-entry error on this page.

**Not blocking the build.** The page is fully wired and renders now; photos drop in without code changes.

### 🔴 The gallery carousel/lightbox split is UNVERIFIED until photos exist
The locked rule: each tab's carousel shows ONLY that category's images; the lightbox shows ALL combined.
The gallery is deliberately empty, so **this has never run against real images.** It is the known
plausible-looking bug — tab one often renders correctly by accident. **Verify on a LATER tab** (Diving or
Relaxation), not the first, the moment real photos land.

### 🔴 The hero image is GRAINY — it's the source asset, not a compression setting (diagnosed 2026-07-17)
Reported by Adinda as "some issue with the hero image, is there an export quality / compression issue?"
**No.** The asset currently in `boat.coverImage` is **`mari-hero-smoketest`, 1448×1086** — a smoke-test
placeholder, same species as the gallery smoke-test residue cleared earlier. A full-bleed hero at 100vw
spans ~2000 CSS px on Adinda's display and wants ~4000 device px on a retina screen, so 1448px is being
upscaled roughly 3× and then cropped from 4:3 to full-viewport-height, which zooms it further. **No quality
setting can fix an upscale — the pixels do not exist.**

**Real fix:** a hero photo **≥2560px wide, ideally 3840px**, in a wide/landscape crop (not 4:3).

**Done meanwhile (a real fix, just not this one):** the hero `<Image>` now passes `quality={80}`.
`next.config.ts` has allowed `qualities: [75, 80]` all along, but **nothing ever requested 80** — every
image on the site rendered at the default `q=75`, making that config inert. Worth checking whether the
homepage's photographic heroes should request 80 too; the static build's perf pass used ~80 for those.

### 🔴 The Sanity HOTSPOT is set-able in Studio but SILENTLY IGNORED on the page (found 2026-07-17)
Adinda on the boat hero: *"the cropping feels strange... is it autocropped to center? I'd rather fix the
source image than mess it up for when we create other boat pages."* Correct instinct, and it surfaced a
real site-wide bug.

**What's happening now:** `object-cover` with no `object-position` = cropped to **dead center** (the CSS
default, `50% 50%`). Nothing is tuned.

**The bug:** `options: { hotspot: true }` IS enabled on `imageWithAlt` and `galleryImage`, so an editor can
drag a focal point on any image — **and it does nothing.** `urlForImage(image).url()` is called with no
width/height, and Sanity only applies hotspot/crop when asked for a specific aspect ratio; with no
dimensions it returns the full image. CSS then centre-crops. So the hotspot is a control that appears to
work and doesn't — the worst kind. Affects EVERY image on the site, not just this hero.

**Do NOT fix with a hardcoded `object-position`.** That's what the homepage hero does
(`object-[65%_42%]`) — a magic number tuned to one photo, which breaks for the next boat's differently
framed image. Adinda explicitly rejected this class of fix.

**The fix (not built — needs care, touches a shared helper):** derive `object-position` from the image's
`hotspot.x`/`hotspot.y` and return it from `sanityImageProps` as a plain `style` object (a style object
crosses the RSC boundary fine; a `loader` function does not — see image.ts's note on why there's no custom
loader). Then the focal point is per-image, editor-controlled, and correct for every boat automatically.
⚠️ **Homepage risk:** `Hero.tsx` sets `object-[65%_42%]` by hand and would fight a hotspot-derived value —
reconcile the two in the same pass, don't bolt one on top of the other. Query already returns `hotspot`
(the `...` in the IMAGE projection keeps it), so no GROQ change is needed.

### 🔴 `boat.overviewBody` is TEST CONTENT, not copy (seeded 2026-07-17)
Seeded long via `_scripts/seed-overview-body-long.ts` so the Overview's "Read more" could actually be
exercised — the real body (~2 short paragraphs) correctly does not overflow, so the button never rendered
and the behaviour was untestable. The text mixes h3/h4 headings, bold, italic, a bulleted list and plain
paragraphs on purpose: the collapse is a max-height cap precisely because it must adapt to content whose
line heights differ, and a body of uniform paragraphs would not test that.
**It is placeholder to exercise a UI behaviour. It does not follow mari-core's voice rules and is not
approved copy. Replace it in the content pass.** Both `boat-mari` and `drafts.boat-mari` were patched and
verified independently.

**Surfaced a known-but-unexercised gap:** the body's headings render as **bare `<h3>`/`<h4>` with no
classes**. That is CLAUDE.md's Portable Text tiering working as documented, not a bug — `overviewBody` is
tier-3 (`richTextFull`), and tier-3 heading/alignment styling is explicitly deferred until that work is
scheduled. This is simply the first field to actually put a heading on the page. Decide when tier-3 styling
lands; until then any rich-text heading anywhere on the site will look unstyled.
