# → mari-website skill

Items that need a manual chat-side edit to `mari-website` (no live bridge — same mechanism as
`drk-website`/`atlas-website`/`mari-project`, see `_handoff/drk-website.md` for the full explanation).
Paste this file's Pending section into a session scoped to `mari-website` when ready.

Scope check before adding to this file: `mari-website` owns copy/SEO/URLs/build-status — NOT project
management, contracts, or design decisions (those are `mari-project`'s job — see `_handoff/mari-project.md`
instead, which is intentionally NOT being touched right now per Adinda's 2026-07-13 instruction).

---

## Pending

### 🔴 [SKILL EDIT, NEW 2026-07-17 eve, ADINDA'S OWN WORDING] Point at `mari-core`'s new SEO authority — don't restate it

**`mari-core/brand/copywriting/seo.md` now exists** (shipped in the `mari-core` package Adinda updated
2026-07-17, installed same day). It is the **brand-layer authority for SEO copywriting rules, heading
hierarchy philosophy, and entity precision.**

**`mari-website` must REFERENCE it, not restate those rules.** Where `mari-website` currently spells out
any SEO-copywriting rule, heading-hierarchy reasoning, or entity-precision guidance, replace it with a
pointer to `mari-core/brand/copywriting/seo.md`. Restating is what lets the two drift.

**The three-way split, so nothing lands in the wrong skill:**
| Layer | Owns |
|---|---|
| `mari-core/brand/copywriting/seo.md` | SEO copywriting **rules**, heading-hierarchy **philosophy**, entity precision |
| **`mari-website`** | **Per-page keyword targets · specific approved heading maps per page · page-level SEO metadata (title, meta description)** |
| `drk-seo` | **Implementation** — schema, sitemaps, hreflang (unchanged) |

⚠️ **Related cleanup while doing this edit: `mari-core/brand/voice.md` NO LONGER EXISTS.** The updated
package replaces it with `brand/copy-rules.md` + `brand/copywriting/{general,seo,eyebrows-and-headings,
channel-adaptation}.md`. Any `brand/voice.md` path in `mari-website` is now dead and must be repointed.
**This repo also still has 5 stale `voice.md` references** — `MANAGER.md` (L303, L340),
`_CONTENT-STATUS.md` (L177, L206), `_handoff/mari-website.md` (L81). Low-stakes but actively misleading:
they cite a file a future session cannot open. Fix opportunistically, same pattern as the colour-token
rule in CLAUDE.md.

---

> ⚠️ **The two items directly below ARE real skill edits, queued 2026-07-17 PM** — the "skip both" note that
> follows applies only to the two *older* items after them (Testimonials content + the Serge phone number).

### 🔴 [SKILL EDIT, NEW 2026-07-17 eve] `pages/private-charters.md` — 2 instances of the STALE deck name
`mari-core/core/boat.md` L81 locks the deck naming (**"sky deck, upper deck, main deck, lower deck ✅"**)
and `mari-core/MANAGER.md` L56 records the correction *"corrected outdoor deck naming — sky deck (was
'sun deck')"*. These two post-date that lock:
- `references/pages/private-charters.md` **L71** — *"sit on the sun deck"*
- `references/pages/private-charters.md` **L96** — *"a sun deck with loungers"*

`references/pages/boat.md` **L64 is correct** (*"an open sky deck"*), so this is drift, not a decision.
Two more live in `mari-core/brand/positioning.md` (L34, L56) — fix those in the same round if convenient;
`_handoff/mari-core.md` was retired 2026-07-21 and this is the only surviving pointer to them.

✅ **UNBLOCKED 2026-07-21 (Adinda): mari-core's locked facts are confirmed correct** — the three-space
inventory and the sky-deck naming both stand, so these instances are plain drift. A straight replace
"sun deck"/"sundeck" → "sky deck" is now safe; the old Serge gate (the 3-vs-4 photo question) is closed.

### 🟡 [SKILL EDIT, NEW 2026-07-21] Flip the 🔴 "unverified" equipment flags — mari-core's ✅ is correct
Adinda confirmed 2026-07-21: oxygen, first aid kit, and camera rinse tank are correct as `mari-core`
records them (✅). `mari-website` still marks the first two *"unverified — sourced from old
liveaboard.com listing"* and the rinse tank unconfirmed — flip those to confirmed (pointing at
mari-core as the source) so a future copy pass doesn't refuse to publish settled facts.

### 🟡 [SKILL EDIT, NEW 2026-07-17 eve] `pages/boat.md` — record the settled image/gallery facts
Small additions, all settled this session and currently living only in this repo:
- **Gallery categories are FIXED and hardcoded** (`src/sanity/schemaTypes/galleryCategories.ts`, one
  source of truth): **The Boat · Dining · Diving · Relaxation · Others**. Sourced from the Figma
  Amenities section (node 778:8845). Not editor-managed, deliberately.
- **The gallery's two reads** — each tab's carousel shows only that category's images; the **lightbox
  shows ALL images, ignoring the tab.** Worth recording because it looks like a bug and isn't.
- **Image naming convention** (locked 2026-07-17): `mari-liveaboard-{category}-{nn}-{2-3 words}.{source
  ext}`, categories `boat / dining / diving / relaxation / photo` (**`photo` replaces `Others`** — "others"
  is SEO-dead and would ship into a public CDN URL). Descriptors name **what is in the frame**, never a
  deck — so naming never blocks on the open deck question.
- **Photo source of truth:** `G:\My Drive\##MARI\02. IMAGES\_website-ready\boat-page\` (25 gallery images,
  renamed + sorted 2026-07-17). Originals untouched in the sibling folders.
- **Known ceiling:** every source is ~1535px (already a web export, not a master). Thumbnails are fine;
  the lightbox caps ~1500 instead of 1920. Ayu's shared folder is byte-identical — it IS the source, and
  there are no masters in Drive.

### 🔴 [SKILL EDIT] `references/url-structure.md` — the boat URL is WRONG. `/boat` → `/boats/[slug]`
The file records **Boat | `/boat`**. **Locked 2026-07-17 (Adinda): `/boats` (listing) + `/boats/mari`
(individual).** Reason: her own consistency principle — boat and destination should name the same way, and
destinations are already `/destinations` + `/destinations/komodo`. Same collection segment for the listing
and its children.
- Add the **individual** row too — the file currently has no `/boats/[slug]` pattern at all, only the single
  `/boat` page, because it assumed one fixed boat page.
- **Rejected shape, worth recording so it isn't re-proposed:** `/boats` listing + `/boat/mari` child (two
  different segments for one collection).
- **Also record the DECLINED ask:** a *dynamically configurable* collection segment (editable in Sanity, so
  `/boats` could become `/liveaboard-diving` later). Technically possible; declined as expensive machinery
  for a cheap-later problem (a typo would re-URL the whole site; sitemap/canonical/breadcrumbs all derive
  from it; doing it later = rename a folder + one `redirect` doc). **Per-document slugs are already editable
  in Studio — that's the part that actually matters, and it already exists.**

### 🔴 [SKILL EDIT] `references/pages/boat.md` — Figma node IDs are STALE + several open items now closed
The file's node table (`715:xxxx`, Amenities `718:5516`) is dead. **Authoritative frame: `Page/Boat` =
`778:8702`** — same drift the destination page had (`675-2363` → `778:8608`, already recorded in
`_handoff/figma.md`). Real sections: Hero `778:8706` (sub-nav `Block/SubNav` `778:8712` already in it) ·
Overview `778:8747` · Cabins `778:8762` · **Amenities `778:8845`** · LayoutAndSpecs `778:8878` · FAQ
`778:8902` · CTA `778:8903` · ContactUs `778:8904` · Footer `778:8905`. **No Gallery section exists** — the
schema's `gallery` field IS the Amenities section (naming mismatch, kept deliberately for Mari).
- **CLOSE open item #5 ("Amenities tab labels (5 tabs) unconfirmed — confirm with Serge").** The labels are
  Figma-derived and already in the schema: **The Boat / Dining / Diving / Relaxation / Others.**
- **CLOSE open item #7 (hero DestinationStats strip).** Adinda 2026-07-17: **use the boat stats** (Cabins /
  Guests / Boat Size / Crew). The Season / Duration / Minimum Skill Level values in Figma are Komodo's, a
  copy-paste from the destination page.
- **Open item #8 (H1) is partly answered by Figma:** the hero H1 reads **"Mari Liveaboard"**.
- **Open item #9 is confirmed real:** the Overview copy in Figma still says *"excellent value for money"* —
  `mari-core/brand/voice.md` mandates **"exceptional value"**. Verified in the live node (`778:8755`).

---

_Neither item below is a chat-side skill edit — they are parked here as reminders, not as merge work. A
skill-update round should SKIP both. All actual skill edits queued for `mari-website` were merged and verified
on 2026-07-17 (see Done)._

### [CONTENT, not a skill edit] Testimonials hub — real Mari content when the page is built
The Testimonials hub **structure/schema** is now specced (in `atlas-website`), but it needs **actual Mari
guest reviews**, uploaded one-by-one for now (no import pipeline). The current pre-launch draft reviews are
AI-drafted placeholders that MUST be replaced with real guest reviews before public launch. Tracked under
the launch content gate — this is a build/content task, not a chat-side skill edit.

### [BLOCKED on Serge] Footer phone number conflict
Two conflicting numbers on file, already in the skill's "Open items blocked on Serge" table. No change
needed — just don't resolve it silently. Raise at the next Serge conversation.

---


---

## Done — reconciled 2026-07-17 against the installed mari-website skill

Adinda updated the chat-side skill from `_payload/mari-website.md`, re-exported, and Claude installed it.
**Every item verified against the extracted package before install and spot-checked after** — for the FAQ
replacement, verified both that the new model is present AND that the old one is gone.

- [x] **FAQ model REPLACED** → `references/pages/faq.md` now describes the locked inline-array model:
      `faqGeneral` singleton ("General FAQ") with an inline `faqSection` array (Payment & Booking / What's
      Included / Others, seeded via `initialValue`, editor-renameable); destination FAQs inline on the
      destination doc (Diving / Travel / Others); boat FAQs inline on the boat doc (General Information);
      pages compose local + shared at render; the `faq` document type is retired. *Verified:* the old
      reference-document model survives only inside the reasoning sentence ("beats a pile of reference
      documents opened one at a time"), and the old *"is_featured dropped for v1 / do not add to schema"*
      text is **gone**. `isFeatured` recorded as driving the homepage set, hidden on destinations, cap-as-
      safety-net.
- [x] **The `atlas-website` pointer is NO LONGER hedged.** The staged payload (written 2026-07-16, when
      `atlas-website` was not being updated) instructed marking it *"pending / known stale"*. That hedge was
      removed before this pass ran, because `atlas-website` landed earlier in the same round. *Verified:* no
      "pending" / "stale" hedge appears in `faq.md`.
- [x] **Homepage wiring detail** → `homepage.md`: fully wired to Sanity (commit `7825576`), contact-section
      copy lives in `siteSettings` → "Contact Section" not `homePage`, Nav + Footer still hardcoded pending
      their own slice, and the 4 `[DRAFT]` AI-drafted testimonials flagged as a hard pre-launch gate.
- [x] **SEO + image pipeline per-slice** → `content-rules.md` ("SEO + image pipeline — per slice, not a late
      pass"), with the universal convention pointed at `drk-website` rather than duplicated.
- [x] **FAQ SEO/AEO — Mari's application only** → `faq.md`: `FAQPage` JSON-LD per page, answer-first copy,
      hybrid embedded + `/faq` hub, with the research itself pointed at `drk-seo`.
- [x] **Testimonials page row** → `site-status.md`: not built / no mockup / copy not written / SEO not
      authored, `testimonialsPage` singleton, `testimonial` docs stay Shared Components, structural rationale
      pointed at `atlas-website`.
- [x] **Destination Figma node** `675-2363` → `778:8608` → `destination.md` + `site-status.md`. *Verified:*
      old node survives only in the supersession sentence.
- [x] **Footer phone conflict left UNTOUCHED as instructed** — *Verified:* "Open items blocked on Serge" still
      carries *"Footer phone number (two conflicting numbers on file) | Footer (global)"*, unresolved.
## Done — reconciled 2026-07-16 against the installed mari-website skill

Adinda updated the chat-side skill from `_mari-website-chat-payload.md`, re-exported, and Claude installed
it. Verified against the freshly-installed files:

- [x] **Announcement bar — final spec landed** (`references/site-status.md`, "Site-wide components" row):
      Sanity-managed, **non-singleton** document type (multiple exist, one `active` at a time via warning
      validation), `urgencyLevel` **normal / medium / high** (not the old info/warning/critical `severity`),
      `active` global, **dismissible**, **no scheduling** for v1, message localization NOT wired (holding on
      localization plugins). The old "Decision needed: Sanity-managed vs hardcoded" open question is resolved
      and removed.
- [x] **FAQ destination-specific taxonomy** — separate 3-category set (Diving / Traveling / General
      Information) added alongside the intact 5-category hub set → `references/pages/faq.md`. Mirrors the
      atlas-website change from the same round.
- [x] **Footer newsletter copy** — real benefit-led copy ("Be the first to know of our latest deals and
      news.") replacing the placeholder label → `references/pages/homepage.md`.

---

## Done — reconciled 2026-07-13 against mari-website skill v1.4

- [x] T&C content ported from the live site (16 sections) — new `references/pages/tc.md`, marked content-final.
- [x] FAQ page adopts `atlas-website`'s taxonomy as-is, no Mari override — new `references/pages/faq.md`
      (correctly stubbed: structure locked, actual Q&A copy not yet authored — not a launch blocker).

---

## Done — reconciled 2026-07-13 against mari-website skill v1.2

- [x] New repo note (Next.js + Sanity build in a new sibling repo, `v1-static-homepage` archived/reference
      only) — `references/site-status.md`, new "Repo note" section.
- [x] Destination template + Komodo confirmed as one row/one build task, not separate work —
      `references/site-status.md` page table.
- [x] Private Charters status nuanced to "🎨 Mostly mocked" with the two undesigned tabs called out —
      `references/site-status.md` page table.
- [x] Build column updated to reflect the Week 1 / Week 2 split — `references/site-status.md` page table.
- [x] Launch content gate added as its own section — `references/site-status.md`.
- [x] Announcement/pop-up bar added as a new "Site-wide components" tracking table (correctly kept separate
      from the page table since it isn't a page) — `references/site-status.md`, includes an open question
      on Sanity-managed vs. hardcoded toggle worth answering during the schema pass.
- [x] `references/url-structure.md` status header updated — draft URLs in active use, Serge confirmation
      logged as non-blocking.

One extra item landed that wasn't in the original ask: a **footer phone number conflict** (two numbers on
file) surfaced in the "Open items blocked on Serge" table — not something this session flagged, must have
come from elsewhere in the mari-website skill's own context. Worth a heads-up next Serge conversation.
