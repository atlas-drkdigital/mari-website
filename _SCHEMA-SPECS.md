# _SCHEMA-SPECS.md — Sanity page-type specs, tracked for approval

Companion to `CLAUDE.md` (prose rules) and `MANAGER.md` (dated running log of how each decision was
reached). This file is neither — it's a **flat, checkable spec per Sanity page type**, so Adinda can mark
each field `[x] approved` as it's tested in a real build, without having to re-read MANAGER.md's full
history to find "did we settle this."

**Status model, same for every page type below:**
- 🟡 **Draft** — built from Figma + direct request, not yet exercised in a real page build. Expect changes.
- 🟢 **Approved** — Adinda has explicitly signed off. Still not "locked" in the CLAUDE.md sense (renaming
  is free until real content exists) — approved means "this shape is right," not "never touch again."
- 🔵 **Validated at scale** — proven across more than one real page/boat/destination, ready to promote into
  the `atlas-website` skill as a reusable Atlas-wide pattern (see "Promotion" below).

**Promotion path:** once a page type's fields reach 🔵, the pattern gets written into
`atlas-website/references/schema-patterns/<page-type>.md` (new reference category for that skill — it
currently only holds content checklists, not schema-level field specs) via `_handoff/atlas-website.md`,
same staging mechanism as every other skill update from this repo. Don't promote from 🟡 or 🟢 — Mari is
the pilot, per `atlas-website`'s own `MANAGER.md` to-do ("validate page structure against Mari build").

---

## Schema deltas — 2026-07-16 (FAQ RESTRUCTURE) — 🟡 built + verified, PENDING ADINDA REVIEW
Supersedes the `faqGeneral` entry in the block below. Full brief: `_handoff/_NEXT-SESSION-faq.md`.
Verified: tsc + eslint + `sanity schema validate` (0/0) + GROQ query-back + `/` and `/studio` 200 after a
clean restart, with the homepage confirmed rendering featured questions from BOTH sources.

- **`faqSection`** — NEW shared **object** (`objects/faqSection.ts`): `title` + `questions[]` of
  `{ question, answer (richTextBasic), isFeatured }`. Used inline by `faqGeneral`, `destination`, and
  `boat`, so all three edit FAQs identically. `isFeatured` ("Feature on homepage") is `hidden` when
  `document._type === 'destination'` — destinations don't feed the homepage, and a visible-but-inert
  control is worse than none.
- **`faqGeneral`** — refactored onto `faqSection`; **`seo` field ADDED** (it backs the /faq hub page);
  groups `content` + `seo`; doc title + sidebar label now **"General FAQ"**. Categories seeded via
  `initialValue`: **Payment & Booking / What's Included / Others**. Scope is cross-cutting questions ONLY.
- **`destination`** — ADDED `faqSections` (inline, seeded **Diving / Travel / Others**) + an "About this
  section" signpost note + an `faq` group/fieldset.
- **`boat`** — ADDED `faqSections` (inline, seeded **General Information**) + the same signpost note + an
  `faq` group/fieldset.
- **`faq` document type — RETIRED.** Removed from the schema index, the Structure sidebar, and
  `PLACED_TYPES`; `documents/faq.ts` deleted; all 7 docs (Komodo's 6 + an empty draft) deleted after
  migration. Sidebar now ends with ONE **"General FAQ"** entry.
- **`homePage`** — `whyUsItems` `Rule.min(2)` → `min(1)` (description "(2 to 4)" → "(1 to 4)"). FAQ signpost
  note rewritten (it described the old auto-first-N behavior).
- **SEO double-nesting — FIXED site-wide.** Dropped the single-field `seoFs` fieldset and set an explicit
  `title: 'SEO'` on the `seo` field across blogPost/boat/destination/faqGeneral/homePage/itinerary/page/
  scheduleRates. Leaves ONE clean "SEO" header instead of "SEO" → "Seo" → fields.
  **Convention nuance this establishes:** the "every group gets a matching fieldset" rule exists so section
  headers show in the flat "All Fields" view — it does NOT apply to a group holding a single
  self-describing field, where the fieldset is pure duplication.
- **Homepage query** — `HOMEPAGE_QUERY.faq` now pulls `isFeatured == true` across the General FAQ **and**
  every boat, General first. **Each side is `coalesce(..., [])`**: GROQ's `+` returns null if EITHER operand
  is null, so an absent `faqGeneral` would otherwise silently discard the boats' featured questions too
  (verified against the real dataset, not assumed).

### Open / flagged (not blocking)
- **Komodo's "What is included in a Mari trip?" is a DUPLICATE.** Migrated into Komodo's *Others* per the
  locked brief, but the destination page will *pull* What's Included from the General FAQ, so it will show
  twice once that render exists. Decide in the destination-page slice — deleting it is a one-item edit.
- **Stable identity for cross-page pulls** stays deferred to the destination-page slice (per the brief).
- `Faq.tsx` hardcodes `useState('faq-7')` as the default-open item — fine at 8 featured, opens nothing if
  the featured count drops below 8. Pre-existing, logged in `_POLISH-BACKLOG.md`.

---

## Schema deltas — 2026-07-16 late (homepage full-wire + FAQ remodel) — 🟡 built, PENDING ADINDA REVIEW
All 🟡 (built + committed, not yet reviewed). See MANAGER.md's "homepage FULL-WIRE + FAQ" checkpoint.
- **`destination`** — ADDED `seasonNights` (string, card line), `excerpt` (text, card summary), `order`
  (number, sort). **Interim** — reconcile in the destination-page slice (seasonNights overlaps `stats`;
  `order` may become an orderable-list plugin). `tagline` description clarified.
- **`homePage`** — REMOVED `faqItems` (reference array; homepage now shows general FAQs automatically) and
  the `contact` group/fieldset + `contactHeading`/`contactIntro`/`contactEyebrow` (moved to siteSettings).
  Kept `faqHeading`/`faqLinkText`; the FAQ signpost note now says questions appear automatically.
- **`siteSettings`** — ADDED "Contact Section" fieldset with `contactEyebrow`/`contactHeading`/`contactIntro`
  (global contact-form copy, moved off homePage).
- **`faqGeneral`** — NEW singleton (id `faqGeneral`). Inline-array model: `categories[]` → each
  `{ title, questions[] of { question, answer } }`. Drag-reorder both levels, edit in place. Replaces the
  separate general `faq` documents (deleted). Destination FAQs stay on the `faq` type (relabeled "FAQ
  (Destination-specific)" in Structure) — to be remodeled into inline arrays in the destination slice.
- **Structure** — "FAQ" list split into "FAQ (General)" (faqGeneral singleton) + "FAQ (Destination-specific)".

**Pending review to-do (Adinda, not now):** the whole FAQ remodel (see _QA-CHECKLIST.md).

---

## 📚 DECISION RECORD — FAQ SEO/AEO (researched 2026-07-16, so we never re-research "why")
**Provenance:** Perplexity research pasted by Adinda 2026-07-16 (prioritizing Ahrefs/Semrush + AEO guidance).
Cross-checked concept against `drk-seo` skill. Sources listed at the bottom. **This is WHY we built FAQ the
way we did — read this before re-opening the question.**

**The questions we asked & the answers:**
1. **Is `FAQPage` JSON-LD still worth it in 2026?** YES — for AEO, not for Google rich results. Google
   **restricted FAQ rich results in late 2023** to gov/health sites, so a commercial travel site **won't**
   get the SERP accordion. But structured Q&A still (a) helps Google/Bing *understand* the page and feeds
   AI Overviews, and (b) is **cited by AI answer engines** (ChatGPT, Perplexity, Copilot) — FAQ content is
   "answer-shaped" and chunk-friendly. Low cost → **emit it.**
2. **Semantic HTML:** native `<details>/<summary>` + a heading per question (`<h3>`), minimal ARIA. Only add
   `aria-expanded`/`aria-controls` if using custom buttons. Answer-first: first 1–2 sentences a standalone
   answer.
3. **AEO citability:** answer-first, question phrased as the natural query, concise/scannable, a **stable
   URL + `#anchor` per Q&A**, consistent entity terminology (e.g. "Komodo National Park", "Mari
   liveaboard"), site-wide Organization schema.
4. **Dedicated FAQ page vs embedded:** **HYBRID is best** — embedded FAQ sections on destination/boat pages
   (topical relevance + AEO citability, `FAQPage` JSON-LD scoped per page) PLUS a central `/faq` hub.

**Decision & how it shaped the build (2026-07-16):**
- Our **composition model IS the recommended hybrid** — embedded per-page FAQ (destination/boat inline
  arrays) + a central General FAQ (`faqGeneral` → the `/faq` hub). Validated, not coincidental.
- **Schema now:** `seo` field on `faqGeneral`; re-seed answers **answer-first**.
- **Per page slice (render):** page-scoped `FAQPage` JSON-LD, `<details>/<summary>` + `<h3>`, `#faq-slug`
  anchors. Folded into each slice per CLAUDE.md's "SEO + image pipeline fold INTO each slice" rule.
- Sitewide FAQ SEO/AEO conventions queued for **`drk-seo`** (`_handoff/drk-seo.md`) so it's reusable.

**Sources (2025–2026):** ahrefs.com/blog/faq-pages-seo · allaboutai.com/ai-seo/faq-seo ·
seojuice.com/blog/schema-org-2026-what-google-reads · semrush.com/blog/answer-engine-optimization ·
graygroupintl.com/blog/answer-engine-optimization-aeo-guide-2026 · a11y-collective.com/blog/accessible-accordion ·
theanswerengine.ai/blog/how-to-build-faq-page-ai-cites · cyclewerxmarketing.com/blog/aeo-ai-answer-engines-rewriting-seo-2026 ·
semly.ai/blog/what-will-be-the-trends-in-seo-in-2026 · obapr.com/resources/answer-engine-optimization-for-pr

---

## `boat` — 🟡 Draft, built 2026-07-15, renamed from `boatPage` 2026-07-16 (see MANAGER.md)

Repeatable (multi-boat capable, only Mari exists today, doc id `boat-mari`). Full reasoning in
`MANAGER.md`'s 2026-07-15/16 entries — this table is the current state, not the history. Real content
loaded — see `_CONTENT-STATUS.md`. **This is the one type with a real multi-session review pass behind
it** — every other type below is a same-day shell, not yet reviewed in depth.

### Basic Info
Order locked: short name, full title, slug — same order for every page type (WordPress-style).
- [ ] `name` — short name
- [ ] `pageTitle` — full title
- [ ] `slug` — ⚠ URL pattern (`/boats/[slug]` vs. `/boat`) not yet confirmed
- [ ] `coverImage` — used as hero background AND as this boat's card/thumbnail elsewhere
- [ ] `tagline` — doubles as hero subheading AND the excerpt for a Boats-listing card (⚠ still holds
      placeholder Komodo destination copy, needs real content)
- [ ] `stats` — flexible array, seeded: Cabins / Guests / Boat Size / Crew
- [ ] `brochurePdf` — ⚠ frontend requirement not yet built: hide the download CTA entirely if empty

> **⚠ Shared section chrome MOVED OFF this type 2026-07-17** → the `boatDefaults` singleton (spec below).
> Eight fields left: `overviewEyebrow`, `keyFeaturesHeading`, `cabinsEyebrow`, `cabinsHeading`,
> `galleryEyebrow`, `galleryTitle`, `specificationsEyebrow`, `specificationsHeading`. The four
> `showXEyebrow` toggles were **dropped entirely** in the same pass. Nothing referenced these fields
> (the boat frontend doesn't exist yet), so it was a free move — done before the page slice for exactly
> that reason. Orphaned values were unset from `boat-mari` on **both** published and draft.

### Overview
- [ ] `keyFeaturesImage`, `keyFeatures` (unlimited array)
- [ ] `overviewHeading`, `overviewBody`, `overviewCta`

### Cabins — own group, moved out of Overview 2026-07-15
- [ ] `cabinsIntro`

### Gallery — ⚠️ this IS the page's **Amenities** section (Figma `778:8845`), not a separate gallery
The name is a leftover from when it was modeled as "a pile of images." **Kept deliberately** (Adinda,
2026-07-17): renaming the field costs a migration for zero user impact. Do not "fix" it. The 5 values of
`galleryImage.categories` **are** the 5 Figma tabs. The full amenities *list* is a different thing and
lives under `specifications` ("Amenities & Others").
- [ ] Fields sit inside a fieldset with a visible description ("images/categories live in the shared
      Gallery section") so that note renders before the fields, not after
- [ ] `galleryDescription` (whole-gallery level only — per-image text lives on `galleryImage`)
- [ ] **`galleryTabs[]` — NEW 2026-07-17.** `{category (fixed list), heading, body (richTextBasic)}`,
      `initialValue` seeds all 5 categories. **Per boat, NOT on `boatDefaults`** (Adinda: the copy
      describes *this* boat's spaces, so it isn't shared chrome). Fills the one real gap — each Figma tab
      has its own heading + paragraph and no field existed for it.
      - **Known, ACCEPTED intuitiveness cost:** a tab's copy (here) and its images (`gallery` below) are
        edited in two places. Deliberate — keeping `gallery` a flat array of bare images is what preserves
        native multi-file drag-drop *and* what makes the combined lightbox free. Queued as a
        rethink-next-project item in `_handoff/drk-website.md`, not a mistake to fix here.
- [ ] **Category list is shared via `GALLERY_CATEGORIES`** (`schemaTypes/galleryCategories.ts`) — used by
      BOTH `galleryImage.categories` and `galleryTabs[].category`. They must hold the identical list: the
      frontend matches a tab to its images by string compare, so a one-character drift silently empties a
      tab. Extracted 2026-07-17 (was duplicated).
- [ ] **Stays hardcoded** (Adinda: "fixed for every boat"). Editor-managed categories would need a custom
      input component — Sanity's `options.list` can't read values out of another document. Revisit only if
      it genuinely needs editing.
- 🔴 **FRONTEND — two different reads of ONE array, do not conflate:** each tab's carousel shows **only
      that category's** images (filter on `categories`); the **lightbox shows ALL** images combined (no
      filter). Feeding the carousel the unfiltered array is the plausible-looking bug — verify per tab.
      An image tagged with several categories appears in each of those carousels (multi-select by design).
- [ ] Empty category → that tab doesn't render (same auto-hide pattern as the homepage sections)

### Specifications
- [ ] `layoutDiagrams` — array of {heading, body, images (1+)}
- [ ] `specifications` — array of {category (**fixed list of 8**, not free text), body (rich text)},
      seeded via `initialValue` with all 8 category labels on every new `boat` doc. (An earlier same-day
      attempt pulled Vessel & Accommodation out as its own separate field — reverted, wrong per the real
      Figma mock; all 8 categories are the same shape.)

### Fixed, not editable (confirmed exception list, 2026-07-15)
- [ ] The 8 `specifications[].category` values: Vessel & Accommodation, Crew, Diving Equipment, Tenders,
      Machinery & Power, Navigation & Communication, Safety Equipment, Amenities & Others
- [ ] CTA / Contact / Footer — shared components, not fields on this document at all
- [ ] Breadcrumb — auto-generated from `name`

### SEO
- [ ] `seo` object (shared type, already includes an auto/override JSON-LD pattern — see below).
      Auto-population beyond JSON-LD (meta title/description defaulting from page content) requested
      2026-07-15 — real frontend `generateMetadata` work, not schema, not built yet

---

## `boatDefaults` — 🟡 Built 2026-07-17, PENDING ADINDA REVIEW

Singleton (doc id `boatDefaults`), nested under the **Boats** folder beside Boats / Cabin Types / Cabins.
Mirrors `destinationDefaults` exactly — same shape, same reasoning. Holds the section chrome that is
identical on every boat page, edited once. Use `{boat}` to inject the boat's short name per page.

**Why a singleton, not a "Section Labels" tab on `boat`:** `boat` is a template/collection type (designed
for many boats) — that's the test, not today's count of one. See CLAUDE.md's decluttering rule.

**No `showXEyebrow` toggles, deliberately:** in a shared singleton an empty eyebrow simply doesn't render,
so the toggle stops earning its keep. `destinationDefaults` has none — this reconciles the two types.

### Overview
- [ ] `overviewEyebrow` — seeded `Premium diving at exceptional value` (from mari-core's locked positioning)
- [ ] `keyFeaturesHeading` — seeded "Key features". **Adinda confirmed 2026-07-17: shared, not per-boat** —
      it's a generic label, same class as `cabinsHeading`, not an editorial choice

### Cabins
- [ ] `cabinsEyebrow` — seeded `7 sea-view ensuite cabins` (verbatim from mari-core's selling points)
- [ ] `cabinsHeading` — seeded "Cabins"

### Gallery
- [ ] `galleryEyebrow` — seeded `Life aboard {boat}` ⚠ the one eyebrow with no mari-core anchor
- [ ] `galleryTitle` — seeded "Gallery" (matches the Figma heading)

### Specifications
- [ ] `specificationsEyebrow` — seeded `30m of traditional Phinisi` (both facts confirmed in mari-core)
- [ ] `specificationsHeading` — seeded "Layout and specifications" (this value was already on `boat-mari`,
      so it's sourced, not invented)

### Open / flagged
- ⚠ **The four eyebrows are placeholder pending Adinda's content pass** — Figma has no eyebrow text for
  the boat page. They're seeded so the sections render from Sanity rather than blank (full-wire rule).
  Three are drawn from `mari-core`'s locked positioning; `galleryEyebrow` is the weakest. Per-field
  sourcing in `_CONTENT-STATUS.md`.

---

## `cabinType` — 🟡 Draft

- [ ] `boat` (reference, required)
- [ ] `name`, `count`, `maxGuests`, `description`
- [ ] The 5 icon-labeled feature lines: `bedConfiguration`, `deckLocation`, `window`, `bathroom`,
      `airConditioning` — all short strings, icons fixed in frontend code (not editor-uploadable)
- [ ] `images` (array, alt required on each)

## `cabin` — 🟡 Draft

- [ ] `boat` (reference, required), `cabinType` (reference, filtered to the same boat), `name`
- [ ] Deliberately minimal — no concrete use case yet beyond "tied to a boat," add fields when one shows up

## Gallery — 🟡 Draft, EXPERIMENTAL (reworked 2026-07-15 — was separate documents, now array-on-page)

**Superseded the `galleryImage`-document / `galleryCategory`-document model** (both deleted, incl. their
test documents), THEN flattened again same day: the category-GROUPED array broke drag-drop (dropping
files onto an array of group objects → "no known conversion from content types to array item"). Now a
**FLAT array of images on the page** — the whole reason is native multi-file bulk upload for non-technical
editors (Sanity: "arrays of images accept batches of files to be dropped on them"). See CLAUDE.md's
"Galleries" section for the full reasoning + the load-bearing "flat, must be `image` type not a wrapper
object / not a group object" gotcha.
- [ ] `boat.galleryTitle` + `galleryDescription` — whole-gallery intro (same shape now also on
      `destination.gallery`, minus the description field — see below)
- [ ] `boat.gallery` / `destination.gallery` — FLAT array of `galleryImage` (drop files straight onto it)
- [ ] `galleryImage` — shared **object** (not document): `type: 'image'` + `title` + `alt` + `caption`
      + `categories` (per-image tag array). All optional. Must stay a bare image type for batch drop.
- [ ] **Verify in Studio with real files:** confirm dropping multiple images onto the `gallery` array
      creates one item per file. (Earlier drop attempt failed only because it hit the grouped structure's
      outer object-array — flattening should fix it, but confirm with a real multi-file drop.)
- [ ] Alt/caption/title/categories are per-image manual after upload — no native bulk-alt in v6.4,
      accepted (Adinda only needs bulk *file* upload, not bulk text).
- [ ] **Deferred:** per-category heading/body descriptions (existed in the grouped model, dropped in the
      flatten). Flag if wanted back — would need a separate small structure.

## `seo` (shared object, used by every page type) — 🟢 Approved (built 2026-07-14, in active use since)

- [ ] Standard fields (title, description, canonical, OG/Twitter overrides, noindex/nofollow)
- [ ] `overrideJsonLd` (boolean, off by default) + `jsonLd` (text, hidden unless the toggle is on) — the
      "auto-populated by default, override if you want it" pattern already exists exactly as asked for
      2026-07-15; the *auto-generation* logic itself (per-page-type JSON-LD from real content) is real
      frontend work, not yet built — no components consume Sanity data yet on this build

---

---

## Tier 4 shells — built 2026-07-16, ALL 🟡 Draft, NONE reviewed yet

Built in one pass so the full page/document-type list is visible in Studio for review — per Adinda's
explicit ask ("I need the stubs, even if empty, so I have something to review"). Every type below is a
first-pass shape only. Do not treat field names as settled the way `boat`'s are — these haven't been
through a real content-loading or field-list review round yet.

### `destination` — 🟡 Draft (renamed from `destinationPage` 2026-07-16, zero content, free rename)
Built from the locked spec in `mari-project` skill's `references/website.md` (Komodo pilot, Figma node
675-2363). Basic Info (name/pageTitle/slug/coverImage/tagline), Stats (Season/Duration/Min Skill Level),
Overview (eyebrow toggle/heading/body/highlights array), Gallery (flat array, same pattern as `boat`),
Itineraries (heading/intro only — cards come from `itinerary` docs referencing this destination), SEO.
Deliberately NOT modeled: Boats-on-this-route (auto), FAQ (separate `faq` docs), CTA/Contact/Footer
(shared components).

### `itinerary` — 🟡 Draft, stub only (by design — not a real page at launch)
`title`, `destination` (reference), `duration`, `route`, `highlights` (array), `summary`. List-only per
locked scope; individual itinerary pages are a future paid add-on, not clickable at launch.

### `faq` — 🟡 Draft — the one shell built with real depth per Adinda's explicit ask, but the taxonomy
itself is still NOT locked (MANAGER.md: "build FAQ scope on one real page first, test it, refine")
`question`, `answer`, `category` (Traveling / Diving / The Liveaboard — reused from the Destination Page
spec, not invented), `scope` (general / destination / boat), conditional `destination` or `boat`
reference depending on scope.

### `testimonial` — 🟡 Draft
`name`, `date`, `title` (headline), `text`, `rating`, `photo` (optional), `tripAdvisorEmbedCode`
(optional — presence swaps "Read more" for "View on TripAdvisor" per the locked spec). Mirrors the shape
already hardcoded in `Testimonials.tsx` so real reviews can migrate in as-is later.

### `blogPost` — 🟡 Draft
`title`, `slug`, `category` (reference → `blogCategory`), `coverImage`, `excerpt`, `body` (richTextFull),
`author` (reference → `author`), `relatedDestination` (reference → `destination`, optional), `postDate`,
`lastUpdatedAt`. `tags` explicitly floated, NOT built — Adinda unsure it's needed, don't add speculatively.

### `blogCategory` — 🟡 Draft
`name`, `slug`. Editor-managed (not a hardcoded options list) per Adinda's explicit ask 2026-07-16 — same
reasoning as wanting managed gallery categories. "Marine Life Guide" is one category value here, not its
own page.

### `author` — 🟡 Draft
`name`, `photo`, `bio`. ⚠ "bio" is Claude's interpretation of Adinda's "author name and value" — the
"value" field wasn't clearly specified; flag/confirm what she actually meant before treating this as final.

### `homePage` — 🟡 Draft, singleton, deliberately shallow
Homepage content is still 100% hardcoded in components (`src/app/page.tsx`) — this shell exists only so
the page/section list is visible in Studio. Per-section field depth (matching the real hardcoded content)
is NOT built out — that's the future "wire the homepage to Sanity" pass. `whyUsItems` is the one field
built with real depth (see below). Faq/Testimonials sections have no homePage fields at all — they pull
from `faq` (scope: general) / `testimonial` documents directly.

### `whyUsItem` — 🟡 Draft — own document type per Adinda's explicit ask 2026-07-16
`image`, `headline`, `description`. Referenced from `homePage.whyUsItems`, constrained `Rule.min(2).max(4)`
— not an inline array, so cards could be reused elsewhere later without duplicating content.

### Site Settings — `headScripts` field added 2026-07-16
Raw-text field for Google Tag Manager / Search Console verification / other `<head>` tracking snippets,
under a new "Tracking & Verification" fieldset in the SEO tab. Not wired to actual page rendering yet
(same status as everything else waiting on the Sanity-wiring pass). robots.txt/llms.txt are separate,
static Next.js route files, not Sanity content — nothing added for those.

### Studio sidebar structure — reordered 2026-07-16 per Adinda's explicit spec
Three sections now, not two: **Main Page Content** (Homepage, Destinations, Boats, Private Charters,
About, Schedule & Rates, Itineraries, then generic Pages LAST) → **Blog** (its own section — Blog Posts,
Blog Categories, Blog Authors) → **Shared/cross-page components** (Announcements, Why Us Items, FAQ,
Testimonials — all repeatable components reusable across pages/page types, not pages themselves). Private Charters and About are pinned `page` documents by fixed ID (`page-private-charters`,
`page-about`), not a new schema type — same technique as the `singleton()` helper, generalized to a
non-exclusive pinned slot.

---

## `privateCharters` — 🟡 Built 2026-07-23 (hero slice), PENDING ADINDA REVIEW

**Dedicated SINGLETON, superseding the pinned generic `page-private-charters`** (the 2026-07-15
"default assumption is generic page" predates the mockup; the design is a structured section page a
rich-text body can't express). Old `page-private-charters` doc still in the dataset — delete once
Adinda confirms the switch. Groups/fields land per section, same incremental pattern as `destination`.

| Field | Type | Notes |
|---|---|---|
| `name` | string, required | Breadcrumb / reference name |
| `heroHeadingIntro` | string, required | Smaller extralight first line of the H1 |
| `heroHeadingMain` | string, required | Large display-h1 second line |
| `heroSubheading` | text | |
| `heroImage` | imageWithAlt, required | |
| `heroVideo` | heroVideo | Optional, same contract as other heroes |
| `brochurePdf` | file (pdf) | Button hidden when empty, same as `boat` |
| `overviewEyebrow` / `overviewHeading` | string | §2, added 2026-07-23 |
| `overviewBody` | richTextFull | §2 — tier-3; destinations map is an INLINE image in the body (editor controls placement). Inline images are click-to-zoom (lightbox) with captions following the image's Alignment control |
| `benefitsEyebrow` / `benefitsHeading` | string | §3, added 2026-07-23 |
| `benefits` | array of `benefitImage` (bare image + title/caption/alt) | §3 — ONE IMAGE = ONE BENEFIT (title = accordion heading, caption = accordion body + lightbox caption, plain text by Adinda's call). Bare image members keep batch drag-drop. Untitled image renders nowhere. Exactly-one-open accordion synced with the carousel |
| ~~`boats*` ×4~~ | — | **MOVED same day** to the shared `boatsSection` SINGLETON (below) — the brief page-own copy + destinationDefaults' original were the duplication the shared-sections model exists to kill |
| `availability*` (eyebrow/heading/intro/ctaText) + `availabilityEmbed` | string/text + htmlEmbed | §6 — embed lives on the page doc (no scheduleRates doc exists); section + subnav tab hide while embed empty |
| `faqEyebrow`/`faqHeading`/`faqLinkText` + `faqSections` | string ×3 + faqSection[] | §7 — own "Private Charters" category + shared General FAQ categories via the NEW `showOnPrivateChartersPage` toggle on `faqSection` (third of the triplet) |
| `subnav*Label` ×6 | string | Section Nav tab (renamed from "Section Labels" 2026-07-23 — that name means eyebrows on the homepage): Overview / Benefits / Destinations / Boats / FAQ / Check Availability (the sole dates-section tab; a separate "Available Dates" label was cut as redundant, and its amber accent variant was tried + rejected same day) |
| `seo` | seo | |

## `boatsSection` — 🟡 Built 2026-07-23 (Adinda-approved model), first SHARED-SECTION singleton

**The shared-sections model, instance #1:** chrome for a section that repeats across pages, edited
ONCE in Shared Components. Fields: `eyebrow` / `heading` / `headingSingular` / `ctaText` (values
migrated from destinationDefaults; those fields + privateCharters' short-lived copies are removed
and unset). `{destination}` resolves per page — destination pages pass the destination's name, the
charters page passes "Indonesia". Verified live: same doc renders "Sail Komodo…" and "Sail
Indonesia…". Per-page overrides deliberately NOT fields here (they'd un-share the doc); if ever
wanted, they become optional fields on the page's own doc. `destinationsSection` deliberately NOT
built — the carousel has no chrome/curation fields today and ordering already lives on
`destination.order`; an empty settings singleton would be a promise-field.

## Open, cross-cutting (not page-specific)

- [ ] Editability standard: every heading and eyebrow is editable, site-wide, for SEO — the closed
      exception list per page type is the *only* thing that's fixed. Locked 2026-07-15, also queued as a
      DRK-wide standard (see `_handoff/drk-website.md`), not just a Mari rule.
- [ ] Image alt text + SEO vanity filenames: hard requirement, every image field. See CLAUDE.md's
      "Images" section.
- [ ] **Required/optional field markers — flagged 2026-07-16, not yet actioned.** Adinda wants a clear
      upfront visual marker (asterisk or similar) on every required field, site-wide, so an editor sees it
      before filling the form rather than discovering it later via a validation error. Sanity Studio may
      already do this by default for fields with `Rule.required()` — needs verifying live in Studio before
      assuming it needs custom work. Do this as one pass, applied everywhere, not per-field ad hoc.
