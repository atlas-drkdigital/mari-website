# MANAGER.md — Mari Liveaboard website (Next.js + Sanity)

Running log for this repo's build. Companion to `CLAUDE.md` (prose rules/active decisions) and
`COMPONENTS.md` (not yet created — see CLAUDE.md's doc-split note). Keep entries terse + dated, per the
static-build repo's own size-discipline convention (archive past ~1,900 lines).

The static-build repo (`../v1-static-homepage/MANAGER.md`) holds the full pre-2026-07-14 history: sprint
planning, brand-dump decisions, page inventory, contracted deliverables. Don't re-read it cross-repo going
forward — this file is now the live one.

---

## SESSION CHECKPOINT — 2026-07-16 (later), skills-update round + session-bookend protocol (READ THIS FIRST — supersedes all below)

### What this session was
Not a build session — a process/skills-infrastructure session. Two things: (1) locked a new standing
**session-bookend protocol**, (2) ran the first real **chat-side skills-update round** off the accumulated
`_handoff/*.md` backlog.

### New standing protocol — locked into CLAUDE.md ("Session bookend protocol")
Runs at BOTH session start (recap/"good morning") AND session end, every time. Order: (1) **skills-backlog
check FIRST** — check `_handoff/*.md`, if there's a backlog ask "update skills now in chat?", hand off ONE
skill at a time (paste-prompt + full content), remind to drop the re-export in Downloads, install, then
clean the handoff docs; (2) **state the current model**; (3) every task proposal carries **plan + est.
hours + recommended model/effort** (no Haiku/Fable; Sonnet-high default; Sonnet-medium menial; Opus
architecture-tier); (4) **ask available work-blocks**, adapt, flag sprint impact; (5) after agreement,
**granular subtask breakdown with per-task hours**. Generalized version ported to `drk-website`'s
`workflow.md` this same session.

### Key mechanism learned — payloads must INLINE local-only content
The chat-side skill session **cannot see the local installed skill copy** (`.claude/skills/...`). Several
drk-website handoff items said "landed in LOCAL copy" — that drafted text is invisible to chat. So a
skills-update handoff must **lift and inline** any local-only reference content, not just point at it. Built
self-contained payload files for this: `_handoff/_drk-website-chat-payload.md` (done) and
`_handoff/_atlas-website-chat-payload.md` (ready). Each = every pending item + all local drafted content,
generalized, organized by target reference file, with a matching paste-prompt.

### drk-website — UPDATED + INSTALLED + ARCHIVED + reconciled
Adinda updated it in chat from the payload, re-exported, Claude installed from Downloads. Verified against
the freshly-installed files (not the changelog): new `troubleshooting.md` + `image-editing.md` exist;
`workflow.md`/`sanity-cms.md`/`components.md`/`stack.md`/`pre-launch.md`/`claude-code.md` all grew. Archived
to `OneDrive/Desktop/claude/drk-skills/` (canonical + dated snapshot), Downloads copy deleted.
`_handoff/drk-website.md` reconciled — everything moved to a dated Done section; only the named-component
catalog stays open (needs Mari's `COMPONENTS.md`, which doesn't exist as a file yet). Minor: ~13
illustrative "Mari" mentions remain in the skill (acceptable, incident references).

### Two corrections caught BEFORE install (would have regressed the skill)
1. **Alt is `recommended-not-required`, never `Rule.required()`** — the old local `components.md` draft
   still had the wrong required version.
2. **Vanity filenames use a fallback chain**, decided this session, replacing the old "slugify from alt"
   default (alt is a full sentence, poor filename): `seoImageName` (optional editor field) → `originalFilename`
   (if descriptive, skip `IMG_`/`DSC_` junk) → `alt` → omit. Applied to Mari's CLAUDE.md AND skill-wide.
   The `urlFor()` helper that implements it is still unbuilt (no components consume Sanity images yet).

### Round COMPLETE — all 4 skills done (2026-07-16)
All four skills ported chat-side, re-exported, installed, verified against the freshly-installed files,
archived (canonical + dated snapshot in `OneDrive/Desktop/claude/drk-skills/`), Downloads cleaned, and
handoffs reconciled to Done:
- **drk-website** v0.10 — the big one (workflow/session conventions, gallery, image-alt correction, Next 16
  stack, QA patterns, new troubleshooting + image-editing reference files). Two corrections caught pre-install.
- **atlas-website** v0.6 — Testimonials hub (new file) + destination/boat/blog/faq/contact updates; homepage
  as compare-and-flag; held items correctly not built.
- **mari-website** v1.5 — announcement bar final spec, FAQ destination taxonomy, footer newsletter copy.
- **mari-project** — status/sprint/skills-infra refreshed; scope items folded; contract set to Aug 10.

**`is_featured` — DROPPED for v1** (Adinda confirmed 2026-07-16). Stopgap-edited into the installed
`mari-website` faq.md; queued in `_handoff/mari-website.md` to persist chat-side next round.

**All 5 `_handoff/*.md` files reconciled** (drk-website, atlas-website, mari-website, mari-project to Done;
figma.md untouched — it's Figma-file syncs, a separate track, still Pending).

### Destination schema pass — done 2026-07-16 (against the real mockup)
Adinda gave the actual Figma frame — **`778:8608` (`Page/Destination`)**, newer + more detailed than the
`675-2363` the docs referenced. Built the `destination` type out from a shell against it (tsc ✓, eslint ✓,
`sanity schema validate` 0 errors/0 warnings). What the mockup resolved + added:
- **CTA confirmed shared** (generic two-card, no destination urgency line) → no CTA override field. **Booking
  widget confirmed one global embed** ("scheduling partner", lists all routes with its own filters) → no
  per-destination embed field.
- **Added:** an "Upcoming Trips" section group (eyebrow/heading/intro; the widget itself is the global
  embed, frontend-rendered); a "Section Headings" group with editable eyebrow+heading for the three
  auto-content sections (FAQ, About the Boats, Latest Articles); an itineraries eyebrow toggle.
- **Still 🟡 draft** — needs Adinda's Studio review (reload Studio, open a Destination doc, walk the form).
- **Flag (not fixed — belongs to the FAQ pass):** the mockup's destination FAQ categories are
  **Diving / Traveling / General Information**, but `faq.ts` lists the 3rd as `"The Liveaboard"`. The proper
  general-vs-destination category split is still pending (atlas-website). Fix during the FAQ pass, not now.
- **Flag (Figma drift, queued in `_handoff/figma.md`):** hero breadcrumb reads "Boats" not "Destinations";
  destination node refs in the skills should update `675-2363` → `778:8608`.

### Next session (not this one)
- **Tier 4 shell review** — still the real build-side priority; every shell is 🟡 unreviewed (see the
  Tier 4 checkpoint below). This skills round was infrastructure, not build progress.
- Open slugs/URL confirms (Private Charters, Schedule & Rates, `/boats/mari`), `author.bio`, required-field
  markers — all still open from the Tier 4 session.
- `_handoff/figma.md` drift-syncs (Figma-file edits) whenever a Figma session happens.

---

## SESSION CHECKPOINT — 2026-07-16, Tier 4 shell pass (superseded by the checkpoint above)

### State of the repo right now
Clean and verified: `tsc`, `eslint`, fresh dev server restart (all node processes killed first, `.next`
cleared), Studio 200, homepage 200, zero `SchemaError` in the fresh log (one harmless "Building schema
for synchronization took >1s" info line, and an unrelated `cz-shortcut-listen` hydration warning from a
browser extension, not our code). Migration verified via GROQ query-back, not just script exit code.

### The big move: Tier 4 document-type shells, built in one pass
Per Adinda's explicit ask ("I need the stubs, even if empty, so I have something to review tomorrow") —
every remaining Tier 4 type now exists and is registered/placed in Studio. **All of it is 🟡 Draft,
same-day, unreviewed — `boat` is the ONLY type with a real multi-session review pass behind it.** New
types: `destination`, `itinerary` (stub), `faq` (built with real depth — question/answer/category/scope +
conditional destination-or-boat reference), `testimonial`, `blogPost`, `blogCategory`, `author`,
`homePage` (singleton, deliberately shallow — homepage content is still 100% hardcoded), `whyUsItem` (own
document type, referenced from `homePage.whyUsItems` with `Rule.min(2).max(4)`). Full field-by-field spec
in `_SCHEMA-SPECS.md`'s new "Tier 4 shells" section.

### Rename: `boatPage`/`destinationPage` → `boat`/`destination`, 2026-07-16
Adinda asked why the "Page" suffix existed. Real answer: it wasn't an actual convention — `scheduleRates`
and `blogPost` don't have it either, so it was just how the first two types happened to get named, not a
deliberate rule. Renamed both. `destination` was free (zero content existed). `boat` needed a real
migration since `boatPage-mari` had real content: wrote `_scripts/rename-boatpage-to-boat.ts` (`_type` is
immutable in Sanity, so this creates `boat-mari` fresh, repoints `cabinType-mari-deluxe.boat` to it, then
deletes the old document) — ran via `npx sanity exec ... --with-user-token`, verified via GROQ: `boat-mari`
exists with correct data, `cabinType-mari-deluxe`'s reference correctly repointed, zero `boatPage`
documents remain. Every schema-file reference (`cabinType`, `cabin`, `link`, `faq`, `itinerary`, comments)
updated to match. Queued for `drk-website` handoff: check for a REAL naming pattern before assuming a
suffix is deliberate, before copying it into new types.

### Studio sidebar reorganized into 3 sections, per Adinda's explicit spec (several corrections mid-session)
1. **Main Page Content**: Homepage, Destinations, Boats (nested), Private Charters, About,
   Schedule & Rates, Itineraries, then generic **Pages LAST** (catch-all for T&C, Onboard Prices, etc.).
2. **Blog** (its own section, not lumped into #3 — Adinda's correction): Blog Posts, Blog Categories,
   Blog Authors.
3. **Shared/cross-page components** (repeatable, reusable across pages/page types): Announcements,
   Why Us Items, FAQ, Testimonials. (Why Us Items moved here from Main Page Content mid-session —
   Adinda's correction: it's a repeatable component that may appear on a different page, not homepage-only.)
Then Settings / SEO Tools / Languages, unchanged. Private Charters and About are pinned `page` documents
by fixed ID (`page-private-charters`, `page-about`), not a new schema type — generic `page` per the
already-stated default assumption, just given a fixed sidebar slot the same way `singleton()` pins
Site Settings/Navigation. **Private Charters' slug is still a placeholder** (`private-charters-slug-tbc`)
— real slug unconfirmed, see the open item further down this file.

### Site Settings — `headScripts` field added, 2026-07-16
Adinda's ask: a place for Google Tag Manager / Search Console verification / other `<head>` tracking
snippets, without a code deploy. Added under a new "Tracking & Verification" fieldset in the SEO tab.
Not wired to actual `<head>` rendering yet (same status as everything waiting on the Sanity-wiring pass).
robots.txt/llms.txt are separate static Next.js route files, not Sanity content — nothing to add there.

### Open items from this session, not yet resolved
- **`author.bio`** — built from Adinda's "author name and value," where "value" wasn't clearly specified.
  Interpreted as a short bio field; flag/confirm before treating as final.
- **Required/optional field markers** — Adinda wants a clear upfront visual marker (asterisk or similar)
  on required fields, site-wide, seen before filling the form, not discovered later via an error. Not yet
  actioned — needs verifying whether Sanity Studio already does this by default before assuming custom
  work is needed. Queued as one full pass, applied everywhere, not per-field ad hoc.
- **Private Charters slug + schema-type decision** — still open (see the 2026-07-15 entries below).
- Everything in the Tier 4 shells list above needs an actual review pass — Adinda was explicit she
  couldn't review all of it in this session; treat as the next session's real priority, not "done."

### Daily recap template — locked into CLAUDE.md this session
Adinda wants a consistent recap structure every time she asks ("today/tomorrow/sprint status"), so it
isn't reinvented per ask. Full spec now in CLAUDE.md's "Daily recap template" section; generalized version
queued for `drk-website`'s `references/workflow.md` via `_handoff/drk-website.md`.

---

## SESSION CHECKPOINT — 2026-07-15, LATE second session, saved as Adinda heads to a workout (superseded by the checkpoint above)

### State of the repo right now
Clean and verified — `tsc`, `eslint`, fresh dev server (cache cleared, `Ready in ~2.4s`), Studio 200,
zero `SchemaError` in the fresh log, all confirmed as the last actions. Nothing half-done in the
committable sense. Dev server IS running. Sanity has one real `boatPage-mari` document with mostly-real
content (see _CONTENT-STATUS.md for the real-vs-placeholder breakdown).

### What Adinda should REVIEW first, in Studio (the human-eyes part I can't do)
1. **Hard-reload Studio first** (`Ctrl+Shift+R`, or an incognito tab on `localhost:3000/studio`). Your
   earlier stale-tab errors were pure browser cache — live data was always correct. If a normal browser
   still shows stale state: DevTools → Application → Clear site data for localhost.
2. **Open the Mari boat document** and look at the whole form with real content in it — this is the
   actual test of whether the schema feels right to *use*, not just whether the field list looks right.
3. **Test the gallery bulk upload for real:** add a gallery group (set a category), then **drag several
   image files at once** onto its images array. Confirm one item per file appears. That's the
   experimental bet we need to validate (see "gallery" note below).

### What changed this session (the big arc)
- **Boat page schema** fully built + refined against the real Figma mock: Basic Info (short name / full
  title / slug in that order), Overview (full rich text body, "Read more" truncate — NOT a CTA link,
  that field was removed), Cabins (own group), Gallery (see below), Specifications (8 fixed categories,
  one rich-text body each, matching the mock exactly), SEO.
- **Two shared rich-text types locked:** `richTextBasic` (tier 2 — paragraph + bold/italic/link +
  bullets) and `richTextFull` ("Full Rich Text Block", tier 3 — H1-H6, marks, alignment, image, HTML
  embed, NO text color for now). `page.body` and `boatPage.overviewBody` both use `richTextFull` — one
  source of truth, update once.
- **Gallery reworked to array-on-the-page, grouped by category (EXPERIMENTAL)** — for native multi-file
  bulk upload. Deleted the old galleryImage/galleryCategory document types + their 6 test docs. See the
  dedicated entry below and CLAUDE.md's "Galleries" section for the full why.
- **Image alt rule CORRECTED** (this was a real mistake I made): alt is **editable-not-required** on
  every image, never `Rule.required()`. The DRK hard rule = every image HAS an editable alt field, not
  that alt must be filled. Removed all `Rule.required()` from alt. `galleryImage` now has **title + alt
  + caption**, all optional. Saved as a memory + corrected in CLAUDE.md + handoff.
- **Gallery images now carry an upload recommendation** in the field description: landscape 4:3, ≥
  1600×1200px (retina-ready, bigger than it displays), web-optimized JPEG/WebP under ~500KB.
- **New tracking docs created this session:** `_SCHEMA-SPECS.md` (per-field approval checklist),
  `_CONTENT-STATUS.md` (real-vs-placeholder content), `_QA-CHECKLIST.md` (external-reviewer open
  decisions). All part of the doc-split, all listed in CLAUDE.md.

### What Adinda needs to DECIDE / DO next (prioritized)
1. **Gallery upload button — a real decision, needs your call.** Researched 2026-07-15: dragging many
   files at once works natively (good). BUT a click-to-browse **multi-select "Upload" button** (distinct
   from "Add item", which only picks one file at a time) does **NOT** exist natively in v6.4 — it needs a
   **custom array-input component** (real build work). Decide: build the custom upload button, or accept
   drag-and-drop-only for now. (Open Sanity feature requests confirm it's a known gap: GH #1547, #4483.)
2. **Validate the experimental gallery** — the drag-many test above. If it feels right, we promote it out
   of EXPERIMENTAL; if the category-per-batch grouping is awkward with real content, we adjust.
3. **Eyebrow toggle: global vs. per-section** — still pending Serge's input (in _QA-CHECKLIST.md).
4. **Social image alt** — `seo.ts`'s ogImage/twitterImage are bare images with no alt field, a technical
   exception to the alt rule. Decide whether to add alt there (in _QA-CHECKLIST.md).

### Gallery FLATTENED — drag-drop was failing on the grouped structure (fixed 2026-07-15, same session)
Adinda hard-refreshed and tried to drag 4 jpegs into the gallery → *"no known conversion from content
types to array item."* Diagnosed: NOT a drag-drop bug — she dropped onto the **outer** array, which held
category-group *objects*, not images (Studio can't convert a file into a group object). The grouping made
the obvious drop target dead. **Fixed by flattening:** `boatPage.gallery` is now a FLAT array of
`galleryImage` (the array members ARE images), so multi-file drop lands directly on it. Category moved to
a per-image `categories` tag field. Per-category heading/body descriptions dropped in the flatten
(deferred — flagged in SCHEMA-SPECS). Per-batch category tagging is recoverable later via the custom
upload button. Verified `tsc`/`eslint` clean, dev server restarted fresh, Studio 200, no SchemaError.
**Still needs Adinda's real-file test** to confirm the flat array accepts multi-drop (should, but she
should verify — that's the remaining validation).

### Gallery categories — fixed list now, better options to raise next session (2026-07-15)
Adinda: doesn't like categories being a **plain free-text field** — they should be chosen from a known
set, not typed. **Done now (interim):** `galleryImage.categories` is a fixed multi-select list matching
the Figma gallery mockup tabs — **The Boat, Dining, Diving, Relaxation, Others** (hardcoded in
`objects/galleryImage.ts`). No more free text.
**Options to bring up NEXT SESSION (Adinda's explicit ask to surface these as possible add-ons):**
1. A centrally-managed, editor-editable **Gallery Categories** set — its own small document/list type —
   so the client can add/rename categories without a code change, and images reference from that set.
2. Or the same idea but housed **inside site settings** (a categories field there), if a full document
   type feels heavier than needed.
Both replace the hardcoded list with something the site owner controls. Interim hardcoded list is fine to
start with (matches the mockup exactly); pick the managed approach when categories need to vary per client
or the owner wants to edit them.

### Custom multi-select "Upload" button — schedulable to-do, researched 2026-07-15
Native drag-drop of many files works (once flattened). A click-to-browse **multi-select** Upload button
(distinct from "Add item," which only picks one file) does NOT exist natively in v6.4 — needs a custom
array-input component. **Assessed: small-to-moderate build, ~60-120 lines, ~2-4 focused hours.** Approach:
`components.input` on the gallery array that calls `props.renderDefault(props)` (keeps all native array UI
incl. drag-drop) and adds a styled `<input type="file" multiple>` button that uploads each file via
`props.client.assets.upload('image', file)` and inserts an array item per asset via `set`/`insert` on
`onChange`. No drop-in plugin exists for this exact thing (it's a long-standing open Sanity feature
request, GH #1547/#4483) — build from documented primitives. **Reusable across all DRK galleries.**
Not launch-blocking (drag works). Adinda's call on whether/when to build; slotted as schedulable.

### What CLAUDE should DO next session (in order)
1. **T&C page content** — import the real, final 16-section content from `mari-website` skill's
   `references/pages/tc.md` into an actual `page` document, using the new `richTextFull` editor. This was
   deliberately held to avoid rushing a 16-section import at end-of-session. Clear #1.
2. **Specifications content** — the live doc has all 8 category labels; verify/reload the bodies during
   the content pass (Adinda's call to do it then, not now — see _CONTENT-STATUS.md).
3. **Destination page + Private Charters** Figma passes — links already shared, never got started (this
   whole session was boat-page + gallery). These are the next real page-schema builds.
4. If Adinda greenlights it: the custom multi-select gallery upload button component.
5. Research whether Sanity's Portable Text editor supports a smaller default height (Adinda asked; the
   editor box renders tall by default — may need a custom input, not yet investigated).

### Models / effort (confirmed logic, one open mechanism question)
Locked logic: no Haiku, no Fable. **Sonnet high = default** for this build (higher-risk dynamic
Next+Sanity site). Sonnet medium for menial tasks. **Opus for architecture-tier decisions.** Adinda
switched to **Opus 4.8** partway through this late session (the gallery rework, alt-rule correction, and
rich-text-type extraction were genuinely architecture-tier, so that fit). Still open/honest: the exact
mechanism to set *this session's* reasoning-effort level (vs. sub-agent effort) isn't something I've
confirmed — worth checking `/config` or asking directly before treating that part as fully actionable.

### Contract timeline — RESOLVED 2026-07-15, do not re-raise as a concern
Earlier notes (this file and `_handoff/mari-project.md`) flagged an apparent conflict: "contract end
~Jul 24" vs. the internally-planned Jul 28–Aug 1 launch window. **Corrected directly by Adinda: that was
wrong.** Contract signed ~May 10, 12-week term, real target is **Aug 10**. We're on schedule. The Type A
brochure (~1 week) was extra work Adinda chose to take on, outside contracted scope — that's what created
the earlier appearance of time pressure, not an actual scheduling conflict. **Stop mentioning the
contract-vs-launch-window concern in future sessions** — it was never a real problem. Corrected in
`_handoff/mari-project.md` too (marked resolved there).

### Tracking docs renamed with underscore prefix — 2026-07-15, so they auto-gitignore going forward
`SCHEMA-SPECS.md` → `_SCHEMA-SPECS.md`, `CONTENT-STATUS.md` → `_CONTENT-STATUS.md`, `QA-CHECKLIST.md` →
`_QA-CHECKLIST.md` — Adinda didn't want these build-process tracking docs committed to git, and didn't
want to have to remember to gitignore each new one individually. Applied the convention already locked
in this repo (`CLAUDE.md`'s "Local-only files" section, `.gitignore` line 47: `/_*`) rather than invent a
new mechanism — any root-level file/folder starting with `_` is automatically excluded, no per-file
gitignore entry ever needed. All three were untracked (`??` in git status) before the rename, so this was
a clean rename with nothing to purge from git history. `CLAUDE.md`/`MANAGER.md` were NOT touched — they're
already tracked and are the intentionally-committed doc-split pair, not scratch. Every cross-reference to
the old filenames (in CLAUDE.md, MANAGER.md, and a code comment in `boatPage.ts`) updated to match.

---

## SESSION CHECKPOINT — 2026-07-15, END of second session (superseded by the checkpoint above; kept for history)

### Where things actually stand
Repo is in a clean, verified-working state — `tsc`, `eslint`, and a live Studio reload all confirmed
clean as the very last action before this checkpoint was written (not assumed). `boatPage-mari` has
real content loaded and correct per the latest schema shape. Nothing is mid-edit or half-done.

**One real bug hit and fixed this session, worth knowing about if it recurs:** after a burst of rapid
schema-file edits, the dev server threw a persistent `SchemaError` in Next.js/Turbopack even though
`npx sanity schemas validate` (Sanity's own independent validator) found zero errors — confirming it
was stale Turbopack/dev-server state, not a real schema problem, same class of issue as the earlier
"Jest worker" crash-loop from a long-running process. Fix: kill the dev server, clear `.next/cache`,
restart. If Studio ever throws `SchemaError` again after heavy schema editing, this is the first thing
to try, not a code investigation.

### What changed this round (chronological, both messages)
1. **Vessel & Accommodation was WRONG the first time** — I pulled it out as its own separate
   `vesselAccommodationDetails` rich-text field, reasoning it "reads better as prose." Adinda: "not
   what I mean at all." Then she sent the actual Figma screenshot of the Specifications accordion,
   which resolved it cleanly: **8 fixed categories total, ALL the same shape** — a single
   `richTextBasic` body per category, not label/value pairs, not one category singled out. Final
   list: Vessel & Accommodation, Crew, Diving Equipment, Tenders, Machinery & Power, Navigation &
   Communication, Safety Equipment, **Amenities & Others** (one combined category, confirmed by the
   screenshot — not "Amenities" and "Others" split into two, which is what her dictated list had
   genuinely read as ambiguous before the image arrived). Reverted the separate field, restored one
   unified `specifications` array with 8 categories, each `{category, body: richTextBasic}`,
   `initialValue` seeding all 8 on every new boatPage. Real mari-core content loaded into all 8,
   formatted as flat lines (no bullets) matching the mockup's actual visual style exactly — see
   `_scripts/smoke-test-fix-specs.ts`, verified via GROQ query-back (categories list confirmed).
2. **`overviewCta` field deleted — was a modeling mistake, not a refinement.** Adinda: there's no
   separate CTA/link here at all. `overviewBody`'s "Read More" is a truncate-and-expand on the SAME
   text (identical pattern to the homepage Testimonials cards), not navigation anywhere. Removed the
   `link`-type field entirely; the truncate/expand behavior is a frontend requirement, not yet built
   (no boat page component exists), flagged in-file and in _SCHEMA-SPECS.md.
3. **`overviewBody` upgraded from tier-2 (`richTextBasic`) to tier-3** — same editor as the T&C page.
4. **New shared type: `objects/richTextFull.ts`, named "Full Rich Text Block" per Adinda's explicit
   naming request.** Extracted from `page.ts`'s previously-inline body config. Spec: H1 through H6
   (page.ts only had H1-H4 before — H5/H6 added per Adinda), bold/italic/underline/strike/code,
   alignment, inline image, raw HTML embed. **Text color annotation removed** — Adinda: "not allowed
   for now... not resolved yet," explicit removal, not an oversight. `page.body` and
   `boatPage.overviewBody` both now use this ONE shared type — update it once, both update together,
   matches the same "shared type = single source of truth" pattern already used for `richTextBasic`.
5. **`richTextBasic` (tier 2) gained bullet-list support** — was `lists: []` (none), Adinda wanted
   bold/italic/bullets/links for the specifications rich text. CLAUDE.md's content-model section
   updated to match (tier 2 is now "paragraph + bold/italic/link + bullets", not "basic marks only").
6. **Field descriptions rewritten site-wide** to be evergreen/tight — no names, dates, or
   instance-specific examples ("e.g. Mari") in anything Studio-visible; that reasoning now lives only
   in code comments and this file. Verified Sanity has no built-in tooltip/info-icon alternative to
   always-visible inline description text (would need a custom field component — not worth building).
7. **Cabins moved to its own Studio group**, out of Overview. `cabinsHeading` confirmed + seeded as
   literally "Cabins."
8. **Gallery**: fields now sit inside a `fieldset` with a `description` ("images/categories live in
   the shared Gallery section, not here") — fieldset descriptions render before their fields, verified
   live with no schema error; group-level descriptions don't have this property, which is why a
   fieldset was needed specifically.
9. **Slug repositioned to Basic Info, ordered short name → title → slug** (WordPress-style), applied
   to `boatPage` AND retrofitted `page.ts`/`scheduleRates.ts` (their `settings` groups removed
   entirely, `slug` now lives next to `title`) — "for every page type," per Adinda's explicit ask, not
   boatPage-only.
10. **New `_QA-CHECKLIST.md`** — for an external human reviewer, distinct from _SCHEMA-SPECS.md (field
    approval) and _CONTENT-STATUS.md (content-placeholder tracking). One item so far: whether the
    eyebrow-toggle should be global or per-section (currently per-section) — explicitly left open,
    Adinda is checking with Serge.

### Explained, not changed (Adinda asked, no code action needed)
- **Red warning icons on Studio tab names** = Sanity's own built-in validation-error indicator,
  appears on a tab when a `Rule.required()` field inside it is empty on an unsaved/incomplete
  document. Not a bug — will clear once required fields are filled in.
- **"If a specification category is empty, hide that accordion item entirely"** — understood and
  agreed, this is a frontend rendering requirement (check if `body` has content before rendering that
  accordion row), not a schema change. Not buildable yet, no boat page component exists. Flagged in
  the `specifications` field's code comment.
- **Rich text editor "a little bit smaller by default"** — Adinda wants the Portable Text editor box
  shown smaller than the tall default in her screenshot. **NOT implemented — genuinely unsure whether
  Sanity's block editor supports a configurable default height** (it auto-grows with content by
  design; a fixed/smaller default might need a custom input component). Needs research before
  building, flagged rather than guessed at.
- **Documentation embedded inside Studio itself** — Adinda agreed with the earlier recommendation
  (keep external for now). Logged as an explicit **post-launch backlog item**: a custom Studio tool
  hosting docs, "looks more professional," possibly paired with an intro Loom video — a bonus, not
  pre-launch scope.
- **SEO auto-population tracking** — confirmed it IS tracked (_SCHEMA-SPECS.md's `boatPage` SEO row:
  "real frontend `generateMetadata` work, not schema, not built yet") — same bucket as the JSON-LD
  auto-generation, both blocked on the eventual Sanity-wiring pass, not lost or forgotten.
- **T&C page "is gone"** — real gap, not a bug: the `page` document TYPE exists but no actual T&C
  `page` document was ever created in Sanity. Real content already exists and is ported/final in
  `mari-website` skill's `references/pages/tc.md` (16 sections). **Deliberately NOT done this
  session** — a 16-section content import right as Adinda was stepping away risked rushing it; this
  is the clear top item for the next session instead of a discussion topic.

### Models/effort — confirmed, not yet fully resolved
Adinda confirmed reasoning-effort levels (low/medium/high) are a real concept and accepted the
proposed logic: no Haiku, no Fable, Sonnet at medium effort for menial tasks, **Sonnet at high effort
as the default** (this build is the higher-risk dynamic Next.js+Sanity site, not the old static one),
Opus reserved for architecture-tier decisions. She noted correctly that a lot of *this specific
session's* work (gallery redesign, content-model changes, cross-cutting renames) really was
architecture-tier, not just skeleton-building. **Confirmed directly: current model for this whole
session has been Sonnet 5, not Opus** (per her own `/model` check earlier in the session). **Still
open, flagged honestly both times it came up:** the exact mechanism for adjusting *this session's*
reasoning effort (not sub-agent effort, which is a separate, already-real parameter) isn't something
I have confirmed knowledge of — worth Adinda checking `/config` or asking directly before we treat the
effort-level part of this logic as fully actionable, not just agreed in principle.

### Top of the list for next session
1. **T&C page** — import the real, already-final 16-section content from `mari-website`'s
   `references/pages/tc.md` into an actual `page` document using the new `richTextFull` editor.
2. Research whether Sanity's Portable Text editor supports a smaller default height, before touching
   `richTextBasic`/`richTextFull`'s presentation.
3. Resolve eyebrow-toggle placement (global vs. per-section) once Serge weighs in.
4. Destination page + Private Charters Figma passes — queued, links already shared, not yet started
   (this whole final stretch of the session was boat-page refinement, destination/PC never got to).

---

## SESSION CHECKPOINT — 2026-07-15, second session same day — full page inventory + Tier 4 scope locked (superseded by the checkpoint above for "current state," kept for its own history below)

Late-night session, Adinda explicitly low-energy/ADHD, budgeted ~2.5-3h. No code risk taken — this session
is primarily a locking/decision pass, not a build pass, plus one small content edit (Testimonials, below).

### Full page inventory — locked this session, replaces the incomplete 7-type Tier 4 list below
Cross-checked against the real `Nav.tsx` (not assumption) before asking Adinda to mark it up.

| Page | Slug | SEO-first? | Schema approach | Notes |
|---|---|---|---|---|
| Homepage | `/` | Yes | `homePage` (not built) | |
| The Boat | — | — | — | **STILL OPEN — Adinda did not answer this one.** Currently a homepage anchor only (`#the-boat`). Ask directly next session: standalone `/boat` page too, or is the homepage section enough for launch? |
| Destinations | one per destination | Yes | `destinationPage` (not built) | Template-based, one doc per destination. Will also host that destination's own destination-specific FAQ items (see FAQ below). |
| Private Charters | **tentatively** `/private-liveaboard-charter-indonesia` — **unconfirmed, transcription was garbled, needs a one-line confirm from Adinda** | Yes | Own page — schema type (dedicated vs. generic `page`) not yet specified, default assumption is generic `page` unless Adinda says otherwise | |
| About | `/about` | No (Adinda's explicit call) | Generic `page` type | Also hosts the Testimonials component (see below) |
| Schedule & Rates | **tentatively** `/booking` — **unconfirmed, Adinda said "I think," needs a one-line confirm** | Yes | Already built: `scheduleRates` schema (singleton, has `embedCode` field for INSEANQ) | No new schema decision needed, just the slug |
| Blog | `/blog` | No | **New — `blogPost` doc type + listing page, NOT previously in Tier 4 scope, Adinda caught the gap** | Needs categories. Marine Life Guide folds into Blog as a category rather than its own page — Adinda wants a few dummy/placeholder posts to demo what it looks like, not real content yet |
| Terms & Conditions | — | No | Generic `page` type (confirmed) | Content already sourced, 16 sections, mechanical port |
| Onboard Prices | — | No | Generic `page` type (confirmed) | Adinda has the content already from the current live MVP site |
| FAQ | `/faq` | No | **New — needs an `faq` (or `faqItem`) doc type**, fields: question, answer, `category` (topic grouping for hub-page tabs), `type` (`general` \| `destinationSpecific`), and if destination-specific, a reference to which `destinationPage` | Hub page shows only `general`-type items, tabbed by category. Does NOT list destination-specific FAQs — instead the hub page includes a "browse by destination" slider (reuse the homepage Destinations component) that routes users to the relevant destination page, where that destination's specific FAQ items live |
| Contact | — | — | No standalone page — confirmed | Contact stays as sections distributed across pages (homepage already has one) |
| Itinerary pages | list only, not clickable | Secondary | `itinerary` stub (not built) | Unchanged from already-locked scope |
| Testimonials | — | — | **New — `testimonial` doc type (not built)** | **Correction from Adinda: NOT homepage-only** — also appears on the About page, same component. Needs an optional `tripAdvisorEmbedCode` field: if present, the card's "Read more" button becomes "View on TripAdvisor" and links out directly instead of expanding inline; if absent, current inline-expand behavior applies. No TripAdvisor integration exists yet (contingent on Stefan signing the social add-on, per `mari-project` skill) — build the field now so it's ready, don't wire the actual integration |

**Confirmed OUT of scope, not building:** Gallery, standalone Marine Life Guide page (folded into Blog instead), Booking flow (INSEANQ widget replaces this).

**Revised Tier 4 type list** (supersedes the 7-type list in the 2026-07-14 checkpoint below): `homePage`,
`destinationPage`, `boatPage` *(pending The Boat decision above — may not be needed)*, `itinerary` (stub),
`testimonial` (+ TripAdvisor embed field), `faq` (+ category/type/destination-reference fields), page-builder
block shell, **`blogPost`** (new). `page` (generic), `scheduleRates` already exist from the 2026-07-14 pass
and cover About, T&C, Onboard Prices, and (pending confirm) Private Charters.

### Testimonials — content added this session (code only, no schema yet)
Adinda: the old `TEST_ONLY_REVIEWS` (4 generic "Placeholder review text..." cards) weren't good enough to
show Stefan ahead of launch. Replaced with `DRAFT_REVIEWS_REMOVE_BEFORE_LAUNCH` in `Testimonials.tsx` — 4
AI-drafted, realistic-reading reviews (Mara J, Tomas B, Priya N, Julian F), each with a `[DRAFT]` prefix on
its headline (the `title` field, not the person's `name`) as the tracking marker. **Explicit decision:**
these ARE meant to be visible now (pre-launch, for Stefan's review) — Adinda's call, not a draft/unpublished
staging pattern — but **must be deleted or replaced with real guest reviews before public launch**. Flagged
in-file and here so it isn't lost. `tsc --noEmit` clean after the edit.

### Still open from this session — resolve before locking Tier 4 fully
- [ ] **The Boat** — standalone page or homepage-section-only? Not answered yet.
- [ ] **Private Charters slug** — confirm exact spelling (`private-liveaboard-charter-indonesia`?).
- [ ] **Schedule & Rates slug** — confirm `/booking` is actually what Adinda wants.
- [ ] **Private Charters schema approach** — dedicated type or generic `page`? Not specified.

### Boat page schema — built this session, from the actual Figma mock (node 778:8702), not guessed
Three new document types: `boatPage` (repeatable, NOT singleton — see below), `cabinType` (Deluxe/
Superior etc., references `boat`), `cabin` (individual physical cabin, references both `boat` and
`cabinType`, options-filtered so only cabin types belonging to the already-picked boat are
selectable). New shared object `richTextBasic` — the first real implementation of the locked tier-2
content-model (paragraph + basic marks only); `page.body` remains the only tier-3 field until a
second one is actually needed. `link.ts`'s referenceable-page list now includes `boatPage`.
Registered in `schemaTypes/index.ts` and given a "Boats" nested entry in `structure.ts` (Boats /
Cabin Types / Cabins) — cabinType/cabin deliberately not top-level, matches the "editor-organization
deferred to last" convention. `tsc`, `eslint`, and a live Studio reload all verified clean.

**Real Figma finding that resolved the multi-boat URL question:** the Hero's breadcrumb component
(node 718:5417, inside `MARI Website 1.0`) literally renders `Home / Boats / Mari` — plural
collection, singular boat — while the top nav still shows singular "The Boat" with no dropdown
chevron. Not a Figma inconsistency: this is exactly the two-state nav behavior Adinda described
(single boat today → direct link; multiple boats later → mega-menu dropdown), already built into
the design. **This overrides url-structure.md's currently-locked `/boat`** — recommend `/boats/mari`
(collection pattern, matches `/destinations/[slug]` already in this codebase) instead, avoiding a
redirect/SEO-equity cost if a second boat is ever added post-launch. **Not yet confirmed by Adinda —
flag before treating `/boats/mari` as locked.**

**Hero stats strip — corrected mid-build.** Figma's 3-slot stats strip shows literal Komodo
destination copy (Season/Duration/Minimum Skill Level) — a known placeholder issue already flagged
in mari-website's boat.md open item #7. First pass dropped the strip entirely (doesn't make sense
at boat level). **Adinda corrected this, not dropped:** boat-level stats belong here, just different
content — number of cabins, number of guests, boat size, number of crew. Built as `heroStats`, a
flexible label/value array (not 4 fixed fields), seeded with those 4 as initial values.

**Not built — deliberately deferred, needs a decision first:** boat-level FAQ. The Layout&Specs
section's FAQ tab in Figma likely reuses the same shared `faq` document pattern already planned for
destination-specific FAQs (see the earlier page-inventory lock) — extending `faq`'s reference field
to optionally point at a `boatPage` as well as a `destinationPage` once `faq` itself gets built,
rather than bolting on a separate parallel mechanism now. Also not built: `destinationPage`,
`private-charters` schema approach — next in line per Adinda, Figma links pending for those.

### Gallery reworked to array-on-page for native bulk upload — 2026-07-15, EXPERIMENTAL, decided after Perplexity + docs verification
**Driver:** Adinda's hard requirement — non-technical editors must be able to **bulk-upload gallery
image files** (drag/select many at once), because one-by-one is too slow. She explicitly does NOT need
bulk *alt* editing — alt/caption/title edited per image after upload is fine.

**Research done properly, not guessed:** wrote a Perplexity prompt, then independently verified its two
load-bearing claims against the actual Sanity v6.4 docs via WebFetch (Perplexity's own citations were
mostly fake — they pointed at `localhost:3000/studio`, i.e. Adinda's own Studio URL, not sources; flagged
this to her). Confirmed verbatim from the image-type docs: *"Arrays of images accept batches of files to
be dropped on them."* And from presenting-images: alt lives on the image field (`image.alt`), not the
asset — so alt isn't globally reusable, it's per-usage. The one thing the docs DON'T promise: batch drop
for an array member that's an *object wrapping* an image. **Key insight that resolved everything: we don't
need the wrapper** — use a bare `image` type WITH extra fields, which is both "an array of images" (batch
drop works) and the documented way to attach per-image alt.

**What changed:**
- `boatPage.gallery` is now an **array on the page**, grouped by category: each entry =
  `{ category (required), heading, body, images[] }`. The inner `images` array member is the new shared
  `galleryImage` **object** (`objects/galleryImage.ts`, `type: 'image'` + required `alt` + `caption`).
  Native multi-file batch drop lands on that inner images array. Category set once per group/batch.
- **Deleted both document types** `documents/galleryImage.ts` and `documents/galleryCategory.ts`, their
  schema-index + structure.ts entries, and the "Gallery" Studio sidebar section. Deleted the 6 test
  documents from the dataset (3 galleryImage + 3 galleryCategory — galleryImages first since they
  referenced the categories; verified 0 remain). `boatPage-mari.gallery` is now empty, ready for real
  content in the content pass.
- Three-level description model preserved: page-level `galleryDescription` (level 1) → group
  `heading`/`body` (level 2) → image `caption` (level 3).
- Reverses the galleryImage/galleryCategory-as-documents decision logged earlier this session — a real
  reversal, but driven by a genuine new requirement (not nitpicking), cheap now (only test data), and
  expensive post-launch, so the right time to change.
- **Locked into CLAUDE.md** (new "Galleries" section, with the full reasoning + the load-bearing "must be
  `image` type not a wrapper object" gotcha, per Adinda's ask to document the why) and **queued for the
  `drk-website` skill** (`_handoff/drk-website.md`) as a reusable DRK-wide pattern.
- **Status EXPERIMENTAL** — the category-per-batch grouping is an untested UX bet; _SCHEMA-SPECS.md has an
  explicit "verify with real multi-file drop in Studio" checkbox. Adinda: "we're still trying this out."

Verified: `tsc`, `eslint` clean; dev server restarted fresh (cache cleared), Studio 200, zero
`SchemaError` in the fresh dev log.

### Post-smoke-test schema cleanup round — 2026-07-15, same day
Adinda reviewed the live Studio form directly (per last message's suggestion) and found real issues
a field-list review alone couldn't have caught:
- **Field descriptions had internal/dated/instance-specific language leaking into Studio-visible
  text** ("Adinda's ask", "locked 2026-07-15", "e.g. Mari") — real problem, not nitpicking:
  descriptions are what an actual editor reads, and none of that context is useful or evergreen to
  them. Rewrote every description across `boatPage`/`cabinType`/`cabin`/`galleryImage`/
  `galleryCategory` to be short and generic; decision history stays in code comments and
  MANAGER.md/_SCHEMA-SPECS.md only. Verified: Sanity's `description` renders as always-visible
  inline text by default (confirmed via search — no built-in tooltip/info-icon, would need a custom
  field component, not worth building for this) — tight text is the actual fix, not a UI feature.
- **Cabins moved to its own Studio group**, out of Overview — confirmed `cabinsHeading` should
  literally read "Cabins" (now seeded as its `initialValue`).
- **Gallery**: added a `fieldset` with a `description` wrapping its fields — fieldset descriptions
  render before their fields (verified live, no schema error), group-level ones don't have this
  property, which is why a fieldset was needed specifically here.
- **Vessel & Accommodation pulled out of the `specifications` array into its own
  `vesselAccommodationDetails` rich-text field** — reads as prose, not a spec sheet, unlike the
  other 6 categories. Required upgrading `richTextBasic` (tier 2 of the locked content model) to
  support bullet lists, which it didn't have before — CLAUDE.md's content-model section updated to
  match. `specifications`'s fixed category list dropped to 6 or the remaining categories; now seeded
  via `initialValue` on every new boatPage doc (same pattern as `stats`), not built from empty.
  Real mari-core data loaded for all 6 remaining categories + the new prose field via
  `_scripts/smoke-test-update-specs.ts`, verified via GROQ query-back.
- **Slug repositioning, locked as a convention for every page type, not just boatPage:** short
  name → full title → slug, WordPress-style, always together near the top of the main content
  group — not buried in a separate Settings tab. Applied to `boatPage` (new Basic Info order) AND
  retrofitted `page.ts`/`scheduleRates.ts` (slug moved out of their now-removed `settings` groups,
  next to `title`). Caught and fixed one transient `SchemaError` mid-edit (a field still pointed at
  the deleted `settings` group between the two edits) — confirmed clean afterward, not just assumed.
- **Deferred, not decided:** whether the eyebrow-toggle should be one global toggle or per-section
  (currently per-section) — Adinda is checking with Serge, left as an explicit open question, not
  quietly picked one way.

Verified throughout: `tsc`, `eslint` clean, Studio confirmed loading with no schema errors after
every file change (checked the dev log directly for `SchemaError`, not just HTTP 200).

### Smoke test executed — real documents populated in Sanity, 2026-07-15
Ran `_scripts/smoke-test-content.ts` via `npx sanity exec ... --with-user-token` (underscore-prefix
throwaway script, not a real project file). Created: 1 `boatPage` (Mari), 1 `cabinType` (Deluxe
only), 3 `galleryCategory`, 3 `galleryImage`. Images: 3 uploaded from Figma's own embedded assets
(hero, key features, one gallery photo — all still-valid short-lived Figma asset URLs fetched
earlier this session), 3 from Picsum (stock, standing in for "Pexels or whatever," explicit
PLACEHOLDER alt text on each). Verified via GROQ query-back, not just "script exited 0" — confirmed
`coverImage`'s `_type` correctly resolved to `imageWithAlt` (not the base `image` type), and
`galleryImage.categories[]->name` correctly dereferenced multi-category assignment (one image
tagged to both Relaxation and The Boat). `tsc`/`eslint`/Studio all still clean afterward.
`_CONTENT-STATUS.md` filled in field-by-field with what's real vs. Figma-sourced vs. Claude-authored
placeholder — see that file for the honest per-field breakdown, including a few Claude-authored
stand-ins (cabinsHeading, galleryDescription, 2 of 3 gallery category blurbs) that aren't Figma text
and shouldn't be mistaken for it.

### Field-list review round — boatPage revised again, gallery category model resolved, 2026-07-15
Adinda reviewed the full field list (asked for it explicitly after not having seen it laid out).
Changes: `hero` group renamed `basicInfo` (fields aren't hero-only — `coverImage`/`tagline`/`stats`
also feed a future Boats-listing card component); `heroImage`→`coverImage`, `heroSubheading`→
`tagline`, `heroStats`→`stats`. Reviewed mari-core's `boat.md` for additional at-a-glance stats per
Adinda's ask — nothing essential enough to force into the seed list beyond her original 4
(Cabins/Guests/Boat Size/Crew), noted 1:1 crew ratio and "Built 2008" as optional additions given
the array is already flexible. Added toggle-to-reveal booleans (`showXEyebrow`) on all 4 eyebrow
fields, reusing the exact `hidden: ({parent}) => !parent?.x` pattern the SEO object's `jsonLd`
override already used — genuinely cheap given that precedent, not deferred. `keyFeatures`
description corrected — always was unlimited, wording just implied a cap.

**Gallery category model resolved** — Adinda's own "how do we separate these" question. New
`galleryCategory` document type: `belongsTo` (reference), `name`, `heading`, `body` — one per
category (e.g. "Dining"), giving each its own description distinct from both the whole-gallery
`galleryDescription` and each photo's own `caption`. `galleryImage.tags` (free string array)
changed to `galleryImage.categories` (reference array to `galleryCategory`) — same multi-select
behavior, no typo-driven drift between an image's tag and a category's actual content.

**SEO JSON-LD — already built, not new work.** Checked `seo.ts` directly before assuming anything
needed building: `overrideJsonLd` (boolean) + `jsonLd` (hidden unless toggled) already exists,
exactly matching "auto-populated by default, overridable if wanted" from the 2026-07-14 pass.

Verified throughout: `tsc`, `eslint` clean; Studio hit one transient HMR error right after
`galleryCategory.ts` was added (`module factory is not available` — stale chunk from a brand-new
file, self-healed on the next compile, confirmed via a second curl after the auto-reload). Not a
real bug.

### `_SCHEMA-SPECS.md` created — new root doc, checkbox spec per Sanity page type, 2026-07-15
Adinda: wants the boat page's Sanity field spec documented somewhere durable, checkable per field
("this is approved, this is approved"), distinct from MANAGER.md's dated log — and eventually
promoted to `atlas-website` as a reusable pattern once validated, not before (Mari is explicitly the
pilot). New file, 4th in the CLAUDE.md-documented doc split. 🟡 Draft status on every field right
now — Adinda hasn't approved anything yet, this session just gave her something to approve *against*.
Promotion path staged in `_handoff/atlas-website.md` (new "Sanity schema patterns" reference category
that skill doesn't have yet) — not promoted now, correctly held for validated-at-scale status.

### Gallery, layout diagrams, alt text — reworked same session, before the URL question got answered
New shared `imageWithAlt` object (required `alt` field) — replaces bare `type: 'image'` everywhere
across `boatPage`/`cabinType`. New `galleryImage` document type: ONE shared type for boat AND
future destination galleries (not two types merged later) — each image is its own doc with
`belongsTo` (reference, `boatPage` only for now), `tags` (free-text multi-select, `layout: 'tags'`,
one image can carry several), and `caption`. `boatPage` keeps only `galleryTitle`/
`galleryDescription` — no reference-array field back to the images, since Studio's built-in
"Referenced by" panel already shows that per-document; a hand-maintained array would just be a
second, driftable source of truth. `layoutDiagram` (single image) upgraded to `layoutDiagrams`
(array of {heading, body, images — 1+ `imageWithAlt`, stackable}) per Adinda's actual ask — Figma
only showed one static diagram, not this structure. Verified: `tsc`, `eslint`, live Studio reload
(1.68s schema sync, no errors).

**Image SEO — verified against Sanity's actual docs, not assumed.** Sanity CDN URLs are hash-based
and can't be made descriptive at upload time, but Sanity does support "vanity filenames" — a
descriptive name appended to the URL after the hash (`.../​{hash}-{w}x{h}.{ext}/​{seo-name}.{ext}`),
which still works with all transform params. That's a `src/sanity/lib/image.ts` / `urlFor()`
helper change (slugify from `alt`), not a schema field — not built yet, no components consume
Sanity images yet. What the schema pass CAN and does guarantee now: every image has a required
`alt`, so that helper has something real to slugify once it's built. Source: [Sanity Answers —
preserving image filenames for SEO](https://www.sanity.io/answers/preserving-image-filenames-in-sanity-cdn-urls-for-seo-visibility).

### `/boats/mari` vs `/boat` — SEO analysis, still needs Adinda's final word
Asked directly: is repeating "mari" (domain already `mari-liveaboard.com`) redundant? Answer: no —
URL slugs are a very minor, near-negligible direct Google ranking factor (title tag, H1, body
content, and site authority all matter far more); repeating a brand term in a URL isn't penalized
and is extremely common on real sites. The actual tradeoff is structural, not keyword-density:
`/boats/mari` (collection pattern, matches the Figma breadcrumb and the existing
`/destinations/[slug]` precedent) costs nothing today and avoids a 301 redirect + temporary
crawl/indexing lag if a second boat is ever added later; `/boat` (singular) is marginally shorter
today but would need that migration later if the multi-boat future actually happens. Recommendation
unchanged: `/boats/mari`. **Real reassurance, not just politeness: this costs nothing to change
right now** — zero real content/backlinks exist yet, so a slug rename pre-launch is free; the
"costly to change" scenario only kicks in post-launch with real traffic/backlinks pointing at the
old URL. Still flagged as pending Adinda's actual confirm, not silently locked.

### Alt text + SEO filenames — escalated to a hard, site-wide AND skill-wide rule, locked 2026-07-15
Adinda: bake this in so she never has to repeat it, for this project or future DRK ones. Written into
CLAUDE.md as a standing rule (new "Images" section) and staged in `_handoff/drk-website.md` tagged
`[DRK]` for the skill itself. Retrofitted the two pre-existing image fields that predated `imageWithAlt`
(`page.body`'s inline image — added required validation to its existing `alt` field; `siteSettings.logo`/
`favicon` — switched to `imageWithAlt`). `tsc`/`eslint` clean after the retrofit.

### URL alias / redirect readiness — confirmed prepared, asked directly 2026-07-15
Adinda asked "worst case, are we prepared for a URL alias" before green-lighting `/boats/mari`. Checked
`redirect.ts` directly rather than assume: the Sanity document type already exists and is fully
editor-manageable (`source`, `destination`, `permanent` fields, no code deploy needed to add one). **Not
yet true:** the actual Next.js handler that reads those documents and executes the redirects (`proxy.ts`,
per CLAUDE.md's Next 16 convention note) hasn't been built — data layer ready, wiring not done, same
"queued, not wired" status as several other pieces this build. Answered honestly rather than overstating
readiness: worst case is a small, already-scoped task when needed, not a novel problem — good enough for
Adinda to proceed with `/boats/mari` now.

### FAQ scope field — Adinda's build method for this locked 2026-07-15, not the field itself
Not resolving the general/booking/destination-specific taxonomy question now (still explicitly open, see
above) — instead: build FAQ scope on one real page first, test it, refine, then carry the refined pattern
into the next page's FAQ build, documenting each round. Matches this project's existing skeleton-first /
don't-speculate discipline (e.g. the dropped `is_featured` field) rather than introducing a new process.

### FAQ "scope" field — noted for whenever `faq` gets built, not built now
Adinda: the shared `faq` type needs a way to say what a given FAQ item is *for* — this session,
just "for a boat" as one valid value. Bigger open question (general/booking/payment vs.
boat-specific vs. destination-specific sub-taxonomies e.g. diving/travel/general) explicitly NOT
resolved — Adinda flagged it as something to keep revisiting as the FAQ pass actually happens, not
a today decision. Don't build `faq` speculatively ahead of that pass; just don't lose this
requirement when it does happen.

### Editability + section headings — locked 2026-07-15, boatPage revised accordingly
Adinda's rule, worked through out loud then landed on the definitive version: every heading and
every eyebrow is editable (SEO reason — stated explicitly), full stop, with a short, closed
exception list — everything else on the page is also editable text. Not editable: the Layout &
Specs section's 7 category labels (Vessel & Accommodation, Crew, Diving Equipment, Tenders,
Machinery & Power, Navigation & Communication, Safety Equipment — "standard categories... with
specifications", now a fixed `options.list` on `specifications[].category` instead of free text);
CTA/Contact/Footer (shared components, not boat-specific fields at all); the breadcrumb
(auto-generated from `name`, never a field). Everything else — every section's eyebrow, heading,
body, `keyFeatures` bullets — stays free text, confirmed no exceptions beyond that list.

Gap found applying this: **Cabins and Specifications sections had no eyebrow/heading fields at
all** — `cabinsIntro` and `layoutDiagrams`/`specifications` existed but nothing above them. Added
`cabinsEyebrow`/`cabinsHeading` and `specificationsEyebrow`/`specificationsHeading`. Also added
`overviewEyebrow` and `galleryEyebrow` (headings for those two already existed, eyebrows didn't).

**Short name vs. full title, explicitly split:** `name` ("Mari" — breadcrumb, Studio document
title, internal references) vs. new `pageTitle` ("Mari Liveaboard" — the actual hero heading).
Renamed from the old `heroHeading` for clarity, not just relabeled — Adinda wanted these
distinguishable, they weren't clearly two different things before.

**Cabin type feature list, restructured from a free array to 5 named fields** (`bedConfiguration`,
`deckLocation`, `window`, `bathroom`, `airConditioning`) replacing the old generic
`features: array of string`. Icons are fixed per field in frontend code, not editor-uploadable —
"maybe easiest no" was Adinda's explicit call on custom icons. `bedConfiguration`/`deckLocation`
already existed and already matched her "bed type"/"location" asks — no rename needed there, just
kept as-is and added the 3 new ones alongside.

Verified throughout: `tsc`, `eslint`, live Studio reload, no errors.

### Session time — 2026-07-15, second session (Adinda's own tracked estimate)
~1h clock time, but ~30 min of that was a personal call — net working time roughly 1h to 1h40m.
Append to the Session Time Log table below once this session closes out.

### Favicon — wired this session
`src/app/favicon.ico` was still the stale Next.js/`create-next-app` default (confirmed via checksum
mismatch against the real Mari favicon already sitting unused in `public/assets/favico/` since the
2026-07-14 asset port) — replaced with the real file. Also wired the fuller icon set that was sitting in
that same folder but never referenced anywhere: `layout.tsx`'s `metadata.icons`/`metadata.manifest` now
point to `favicon-16x16.png`, `favicon-32x32.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`,
`apple-touch-icon.png`, and `site.webmanifest` (manifest's icon paths were already correct, no edit needed
there). Verified via a live curl against the running dev server, not just source-reading: all `<link
rel="icon"/manifest"/apple-touch-icon">` tags render with the right paths, and every file 200s with the
correct content-type and byte size matching its source file.

**`siteSettings`'s `favicon` upload field already existed** (added in the 2026-07-14 schema pass, `type:
'image'`) — nothing to add there. Worth flagging though: that field isn't wired to anything yet — the
favicon serving today is 100% the static files above, same as every other still-hardcoded piece of the
site. The Sanity field will only actually control the live favicon once metadata generation is wired to
Sanity (`CLAUDE.md`'s roadmap step 3, "wire the homepage to Sanity"), not before.

---

## SESSION CHECKPOINT — end of 2026-07-15 session (READ THIS FIRST — supersedes the 2026-07-14 checkpoint below)

### Where things stand
**Full homepage QA pass is complete and the site is in a known-good, verified-clean state.** Every
section reviewed on both desktop and mobile, ~10 real bugs found and fixed this session (Nav, Hero,
Destinations, Why Us, Testimonials — see the dated entries below for each). `tsc --noEmit` and `eslint`
both clean as of the last edit. Nothing is mid-flight or half-done in the committable sense — the working
tree is safe to leave as-is overnight.

### One thing NOT finished — a real bug found and reverted, not silently left broken
Adinda asked for smooth open/close animation on Nav's mega menus, the mobile menu overlay, and Hero's
mobile search takeover (currently instant `hidden`/`flex` toggles — flagged as a known gap earlier in the
session, see "No instant expand/collapse" in `components.md`/`claude-code.md`). Built a
`useDelayedUnmount` hook (`src/lib/useDelayedUnmount.ts` — **file still exists, currently unused/not
wired into anything**) meant to keep an overlay mounted through its exit fade. It has a real, unexplained
bug: the opacity/pointer-events half of the fade worked correctly (confirmed via direct DOM inspection),
but the hook's own "should this still be rendered" state got stuck at `false` even when the panel should
have been open — meaning the panel never actually became visible (`hidden` class never left) despite the
rest of the state being correct. Root cause not found before time ran out — tried the React-documented
"adjust state during render" pattern (`if (isOpen !== prevIsOpen) { setPrevIsOpen(isOpen); if (isOpen)
setRendered(true) }`) instead of calling `setState` directly in a `useEffect` (which an eslint rule,
`react-hooks/set-state-in-effect`, correctly flagged as an anti-pattern) — confirmed via the actual
compiled Turbopack bundle that the deployed logic matched the source exactly, so it's a genuine logic bug
in the render-phase-adjustment approach itself, not a stale build or a wrong-button-clicked test artifact.

**Reverted cleanly** rather than leave the site broken: Nav.tsx's 3 overlay toggles (Destinations mega,
Resources mega, mobile menu) and Hero.tsx's mobile search takeover are all back to their original,
confirmed-working instant `hidden`/`flex` toggles. Confirmed via direct DOM check post-revert: mega menu
opens correctly again (`hidden` → `flex` on click). This means: **the smooth-transition work for these 4
overlays specifically is NOT done** — Testimonials and Nav's mobile accordions (the two other transition
fixes from this session) ARE done and working, just not these 4.

**For next session:** either debug `useDelayedUnmount` properly with a clear head (start by adding
temporary `console.log`s inside the hook to see the actual `isOpen`/`prevIsOpen`/`rendered` sequence
across renders — that's the next diagnostic step, not yet done), or consider a different technique
entirely (e.g. the newer native CSS `@starting-style` + `transition-behavior: allow-discrete` approach,
not attempted this session, would avoid JS-managed mount-lag state entirely — worth evaluating browser
support before committing to it).

### What's next after that (unchanged from before today)
Tier 4 schema skeleton pass — explicitly **scheduled for a future/afternoon session, not next thing to
open**. See "What's next, in order" in the 2026-07-14 checkpoint below (item 2) for the full scope; that
plan is still accurate, just superseded in ordering by today's QA work being done first as planned.

### Session time
Logged mid-session at **~2h** (Adinda's own estimate, see Session Time Log table below) — that figure
does NOT include the Testimonials refinement round or the transitions work done after that (including
this reverted attempt). Actual total is longer; ask Adinda for an updated figure next session rather than
guessing one now.

---

## SESSION CHECKPOINT — end of 2026-07-14 session (superseded by the 2026-07-15 checkpoint above — kept for history, "Done"/schema-pass detail below is still accurate)

### Done, committed, verified (typecheck + lint + Studio/homepage smoke-tested clean throughout)
- Sanity project `kb8eim50` ("Mari Liveaboard") created, Studio embedded at `/studio`, fully isolated from
  the live MVP project (`sjkpkyaw`) — see `SANITY-SETUP.md`.
- Full schema skeleton: `page` (generic, rich text matched to the live MVP's proven spec — colors via
  `@sanity/color-input`, sized/aligned images, HTML embed, no link annotation), `scheduleRates`,
  `announcementBar` (multi-doc, exclusive-active warning validation, Normal/Medium/High urgency),
  `navigation` (shared `link` object, Destinations-mega-menu placeholder field), `siteSettings` (tabs +
  fieldsets, contact arrays, social platform enum), `redirect`, `language`, plus shared objects (`seo`
  with full Yoast-parity checklist + live char-count, `linkItem`, `socialLink`, `contactEmail`/`Phone`,
  `htmlEmbed`).
- Custom Studio structure (grouped sidebar: Pages, Announcements, Settings, SEO Tools, Languages), singleton
  locks on Site Settings/Navigation, auto-slug component.
- Studio branding: copper/amber/navy colors + Bricolage Grotesque font + "Mari Studio" title, via
  `buildLegacyTheme` (values sourced from `theme.css`, not invented).
- **`theme.css` fully ported into this repo** as Tailwind v4 `@theme` (`globals.css`) — full color/spacing/
  radius/shadow/type-scale token layer, adapted for Next.js (font via `next/font`, texture URLs public-
  absolute). Static asset library (images/icons/per-section JS) copied to `public/assets/`
  (`pre-webp-originals/` deliberately excluded — confirmed unreferenced dev-only files first).
- Documentation: `drk-website` skill's `sanity-cms.md` has all reusable patterns from this session (Structure
  grouping, singleton lock, slug/char-count components, shared `link` object, exclusive-active validation,
  SEO checklist, Studio branding boundaries — what's realistic vs. not); its `workflow.md` now has the
  session-time-tracking convention. CLAUDE.md has the handoff-doc-reading instruction + Destinations
  mega-menu reminder. `_handoff/mari-website.md`'s announcement-bar conflict is reconciled.

### Homepage markup port — DONE this session too (was the top "what's next" item, now complete)
All 11 static sections (Nav, Hero, The Boat, Why Us, Destinations, Latest Articles, FAQ, Testimonials, CTA,
Contact, Footer) ported from `../v1-static-homepage` into real Next.js components at `src/components/` +
`src/components/sections/`, assembled in `src/app/page.tsx`. Content is still hardcoded (matches the static
build verbatim) — no Sanity wiring yet, that's blocked on the `homePage` schema type (Tier 4). Verified:
`tsc --noEmit`, `eslint`, and `next build` all clean; `/` and `/studio` both smoke-tested.

**Two deliberate simplifications vs. the source** (noted in-file, not oversights):
- Destinations' drag-swipe no longer live-previews the incoming photo sliding in mid-gesture — swaps on
  release instead, same crossfade as the tab/arrow navigation. Real visual-polish item to revisit.
- Testimonials dropped 4 explicit test-only placeholder reviews from the original (they were only ever
  there to verify carousel overflow behavior, never real content) — ported only the 4 genuine reviews.

### What's next, in order
1. **Finish visual/functional QA of the homepage port** — in progress, see checklist below (Why Us already
   reviewed and fixed, see next section). Needs Adinda's eyes in a real browser; I can't visually confirm
   hover states, animation feel, or real-device touch/drag behavior myself.
2. **Tier 4 schema types**: `homePage`, `destinationPage`, `boatPage`, `itinerary` (stub), `testimonial`,
   `faq`, page-builder block shell — now genuinely informed by the real ported component structure (the
   reason this was sequenced after the port, not before). **Method locked 2026-07-15: skeleton-first,
   same as the original schema pass** — scaffold all 7 types with core fields only, get them showing in
   Studio's sidebar/structure first, so the actual organization is visible rather than reasoned about
   abstractly, THEN fill in field-level depth per type once the shape is real. Also carries the
   Resources-copy-Sanity-editable and nav-default-link-with-override decisions logged above into this
   pass. **Scheduled for a future session (Adinda: "the afternoon session, but not now") — not part of
   today's remaining work**, despite being the next item in this list.
3. **Wire the homepage to Sanity** once `homePage` schema exists — replace the hardcoded content in each
   section with real GROQ-fetched data.
4. Once `destinationPage` exists: wire the Destinations mega-menu (`navItem`'s `menuStyle` placeholder is
   already there — see CLAUDE.md's Navigation section for the exact to-do).

### QA in progress — bug found + fixed this session (2026-07-14, same day)
Adinda reviewed **Why Us** first and caught a real bug via screenshots (not-expanded state showed 2 of 4
cards blank/washed-out; any card interaction "fixed" it). Diagnosed by reading the actual rendered HTML
(not guessed from source review alone) — two real, separate causes, both fixed in `WhyUs.tsx`:
- `next/image`'s `fill` prop forces `width:100%;height:100%` as an inline style, which no Tailwind class can
  override — the ported "55vw-wide, shifted-to-center" framing classes were dead on 3 of 4 cards. Fixed by
  moving those classes to a wrapping div and letting the Image fill *that* instead.
- All 4 images had `loading="lazy"` + a large fallback size — genuine load-timing flash on a section sitting
  just below the fold, read as broken in a screenshot taken during that window. Switched to eager loading.
Both confirmed via `curl`-diffing the actual rendered HTML before/after, not just re-reading source. Verified
clean: `tsc --noEmit`, `eslint`, `next build`. Committed (`bc1aaa7`).

**Given this exact bug pattern (framing classes silently dead under `next/image`'s `fill`), spot-check the
other sections using the same `fill` + non-trivial-positioning-classes combo** when reviewing them — Nav's
mega-menu destination images and Destinations' background crossfade layers use `fill` too, though their
positioning is simpler (`object-cover` only, no extra shift/width classes), so they're lower-risk than Why
Us was, but worth a deliberate glance rather than assuming they're fine by analogy.

### Why Us — second pass + The Boat, reviewed 2026-07-15 (page-order correction)
QA was reviewing out of page order (jumped to Nav/Hero/Destinations, skipping The Boat and a second Why Us
look entirely) — corrected: actual homepage order is Nav → Hero → **The Boat** → **Why Us** → Destinations →
.... Both reviewed now, page-order-correct, before moving to Destinations.
- [x] **The Boat** — Adinda: no code issues, nothing to fix.
- [x] **Why Us** — Adinda: everything else looks great on both desktop and mobile. Two notes, both
  logged as open backlog, not fixed now (explicitly not urgent):
  - [ ] **Missing hover-zoom effect on card images.** The Boat's image has a subtle hover zoom
    (`group-hover/boat:scale-105`, 1100ms ease-in-out) that Why Us's 4 cards don't have at all —
    confirmed by reading both components directly. Add the same effect to Why Us's `<Image>` elements
    for visual consistency between the two sections, when this gets picked up.
  - [ ] **Card image cropping needs manual re-work — content task, not a code fix.** Adinda's own
    to-do, especially the "Premium Comfort" card (`why-us-dining.webp`, the dining-table image) — the
    current crop isn't right. No code change needed; this is an asset-replacement task on her end.
  - [x] **Hover-zoom fixed same session** (Adinda asked for it explicitly right after logging it as
    backlog) — added the identical `group-hover/boat:scale-105`-style pattern from The Boat to Why
    Us's card `<Image>`s: `transition-transform duration-[1100ms] ease-in-out group-hover/card:scale-105`
    (the cards already had a `group/card` class from their existing expand-on-hover behavior, so this
    layers on top of that, not a new interaction). Verified clean: `tsc --noEmit`, `eslint`.

### Destinations QA — reviewed 2026-07-15, 2 real bugs found + fixed
Adinda checked both desktop and mobile herself. Everything else confirmed good; two real bugs, both fixed:
- **Active tab could scroll out of view with no way back into view.** Clicking a tab near the end of the
  list (e.g. North Sulawesi) made it active but the tabs row never scrolled — Adinda's screenshot showed
  it cut off mid-word at the container's right edge. Fixed: a `useEffect` on `index` change calls
  `scrollIntoView({inline: 'start', block: 'nearest'})` on the active tab, aligning it to the start of the
  visible track. For tabs near the end (not enough remaining items to fill the width), the browser
  naturally clamps this to the max scroll position instead — verified directly: clicking North Sulawesi
  now brings it fully into view with Halmahera (the only tab after it) visible too, exactly matching
  Adinda's requested fallback behavior.
- **Drag-to-scroll on the tabs row worked on mobile (native touch) but not desktop (mouse).** The row
  only had `overflow-x-auto` — enough for native touch scroll, not for a click-and-drag gesture with a
  mouse. Fixed by wiring up the project's existing `useDragScroll` hook (same one `WhyUs.tsx` already
  uses for its mobile card track) — mouse-only by design, leaves touch alone since that already works
  natively. Verified via a simulated real mouse press→move→release: `scrollLeft` moved 0 → 175.
Both fixes in `Destinations.tsx`. Verified clean: `tsc --noEmit`, `eslint`.

### Regression from the fix above, same session: page auto-scrolled to Destinations on every load
Adinda caught it immediately after the tab-scroll fix landed: every page refresh jumped straight to Why
Us on desktop, and to the Footer on mobile — with zero interaction. Traced by instrumenting
`scrollIntoView`/`scrollTo` directly (monkey-patched both, captured a real stack trace on the actual
call) rather than guessing from source, since grepping for likely culprits (`autoFocus`, `.focus()`,
other scroll calls) turned up nothing — the trace pointed straight at `Destinations.tsx`'s own new
`useEffect`.

**Root cause:** `useEffect(() => { tabRefs.current[index]?.scrollIntoView(...) }, [index])` fires on
**mount**, not just on real index changes — `index` starts at `0`, so the effect runs immediately on
every page load. `block: 'nearest'` scrolls the whole PAGE vertically (not just the tabs track
horizontally) if the target element isn't yet in the viewport, which it never is on load since the user
starts at the top of the page. Landing at Why Us vs. Footer on desktop vs. mobile was just which position
the browser computed as "nearest" given each layout's very different total height — same one root cause
either way, not two different bugs.

**Fix:** added a `skipFirstScrollIntoView` ref, set true initially, checked and cleared at the top of the
effect before any scroll call — skips exactly the mount-triggered run, fires normally on every real index
change after that. Verified two ways: (1) re-ran the instrumented fresh-load test — 0 scroll calls
captured, `scrollY` stays `0`; (2) re-confirmed clicking a tab still auto-scrolls it into view correctly
(North Sulawesi test from the original fix, unchanged result). Verified clean: `tsc --noEmit`, `eslint`.

**General rule, not just this component** — logged in `references/components.md` (local `drk-website`
skill copy) and queued in `_handoff/drk-website.md` for the real skill: any `useEffect` that calls
`scrollIntoView`/`scrollTo` and is keyed on a piece of state must explicitly guard against firing on the
initial mount, unless a mount-time scroll is actually the intended behavior. `useEffect` always runs at
least once after first render — an effect keyed on a value that starts at its "default active" state
(index `0`, first item, etc.) will otherwise fire unconditionally on every load.

### QA in progress — mobile bug found + fixed this session (2026-07-15)
Adinda reported "barely any content" on real iPhone (both Safari and Chrome — same WebKit engine).
**Chromium mobile emulation and desktop Playwright WebKit both rendered the page correctly**, so the bug was
only reproducible via real-device screenshots, which Adinda provided section-by-section. Those showed a clean
pattern: every section rendered its background/texture but not its actual content, **except Hero and
Destinations** — the two sections not gated behind the scroll-reveal system (`ScrollReveal.tsx`,
`[data-reveal]`/`[data-revealed]`, IntersectionObserver-driven). Hero is exempt in practice because it's in
the first viewport (reveals instantly on load); Destinations is the only section that doesn't use
`data-reveal` at all. Root cause: the observer was not reliably firing `isIntersecting` for below-the-fold
elements on real WebKit-iOS (suspected: Safari's dynamic toolbar changing the actual viewport height
mid-scroll, interacting badly with the percentage-based `rootMargin`) — content stayed permanently at
`opacity: 0`. Exact WebKit mechanism not fully nailed down (no real-device dev tools access this session),
but the fix doesn't depend on knowing it precisely.

**Fix, `ScrollReveal.tsx`:** added a manual scroll/resize-driven backup check alongside the existing
IntersectionObserver — independently re-checks each not-yet-revealed element's real position and reveals it
once genuinely near the viewport (same trigger condition as the observer's `rootMargin`, just computed
manually). Deliberately NOT a blind timeout-after-mount — an earlier draft of this fix did that and would
have force-revealed all below-the-fold content ~1.5s after page load regardless of scroll position, killing
the reveal-on-scroll effect entirely even on working browsers. Verified clean: `tsc --noEmit`, `eslint`.

**CORRECTION, same session — this WebKit theory was superseded by the real root cause.** Adinda reported the
exact same symptom reproduces on her own *desktop* browser too, purely by which hostname is used: broken via
her LAN IP (`192.168.0.101:3000`), fine via `localhost:3000`, on both desktop and phone. That's not a WebKit
bug — it's Next.js 16's dev-only cross-origin protection: `next dev` blocks requests to dev resources
(HMR websocket, the `__nextjs_font` dev font-serving endpoint, etc.) from any origin other than `localhost`
unless explicitly allowlisted. Confirmed directly in `.next/dev/logs/next-development.log`:
`⚠ Blocked cross-origin request to Next.js dev resource /_next/webpack-hmr from "192.168.0.101"` (and the
same for `/__nextjs_font/geist-latin.woff2`). This single cause explains every observation without needing a
device-specific theory at all — the phone could only ever reach the server via the LAN IP, never `localhost`.
**Real fix:** added `allowedDevOrigins: ["192.168.0.101"]` to `next.config.ts` (Next's own documented
solution for this exact scenario) and restarted the dev server. Confirmed via a fresh CDP-driven browser hit
against `http://192.168.0.101:3000/` post-restart: no blocking warnings in the log, The Boat section (and by
extension everything gated behind `ScrollReveal`) renders correctly. **The `ScrollReveal.tsx` hardening above
is being kept anyway** — it's a legitimate defensive improvement regardless of root cause, just wasn't the
actual fix. **Still needs Adinda's real-device re-test** to close this out — dev-only issue, will not exist
in production (no `allowedDevOrigins`/HMR/dev-font machinery outside `next dev`), but should be confirmed
fixed for the remainder of this QA pass to not be a recurring distraction. If Adinda's Wi-Fi IP changes later
(DHCP), `next.config.ts`'s `allowedDevOrigins` value needs updating to match.

### Homepage port QA checklist — for Adinda, remaining sections
Run `npm run dev`, open `http://localhost:3000/`, and check. **Each section gets a desktop pass AND a
mobile pass, explicitly separate — not one generic look** (2026-07-15: a mobile-only false alarm on this
same homepage turned out to be a testing-artifact, not a real bug, but the near-miss is the reason this
checklist now splits every item by viewport rather than leaving mobile implicit). For mobile, use a real
phone if you have one; a resized desktop browser window is the second-best option — just don't rely on
Claude Code's own automated mobile checks alone without a human look, since even a correct-looking
automated pass can miss real-device quirks (Safari/iOS in particular).
- [x] **Why Us** — reviewed, bug found + fixed (see above).
- [x] **Nav** — reviewed 2026-07-15, both desktop and mobile. 4 real bugs found + fixed, 1 flagged as
  content (not code), 1 needs clarification. See "Nav QA — desktop findings" below for detail.
- [x] **Hero** — reviewed 2026-07-15 alongside Nav (mobile confirmed good; desktop search dropdown had
  the same North-Sulawesi-wrap bug as one of the Nav fixes, same fix applied, confirmed by Adinda).
- [x] **Destinations** — reviewed 2026-07-15, both desktop and mobile. 2 real bugs found + fixed (tab
  auto-scroll, desktop drag-scroll) — see "Destinations QA" above. Everything else confirmed good.
- [x] **Latest Articles ("Blog")** — reviewed 2026-07-15, desktop + mobile. Adinda: nothing alarming,
  may flag specific items later if anything comes up. Not in the original checklist (same oversight as
  The Boat) — added retroactively for an accurate record.
- [x] **FAQ** — reviewed 2026-07-15, desktop + mobile. Adinda: looks good, no issues.
- [x] **Testimonials** — reviewed 2026-07-15. Adinda asked for 4 TEST-ONLY dummy cards to be added
  (`TEST_ONLY_REVIEWS` in `Testimonials.tsx`, clearly marked, not real content) specifically to verify
  carousel overflow/arrow behavior with more than 4 cards — confirmed working (8 cards total, arrows
  appear and scroll through correctly, verified via screenshot). **Remove `TEST_ONLY_REVIEWS` before
  launch** — flagged in-file and here so it isn't forgotten.
- [x] **CTA** — reviewed 2026-07-15 (also not in the original checklist, added retroactively). Adinda:
  looks good including the stats/facts.
- [x] **Contact** — reviewed 2026-07-15, desktop + mobile. Adinda: looks good, no issues.
- [x] **Footer** — reviewed 2026-07-15, desktop + mobile. One content addition requested and made: a
  newsletter subscribe blurb ("Subscribe to receive the latest news, itinerary updates, and exclusive
  specials straight to your inbox.") added above the email field, same styling as the "Also known as
  Mari Dive Cruise" line (`text-body-medium text-text-ondark-secondary`) per Adinda's ask. Hardcoded
  placeholder like the rest of the homepage — flagged in-file to become a Sanity `siteSettings`/footer
  field once that schema exists (Tier 4), not meant to stay hardcoded permanently.
- [x] General cross-check (spacing/hover timing/colors vs. the static build): covered implicitly across
  all the above section-by-section reviews, not run as one separate final pass — Adinda's session went
  section-by-section in page order instead, catching the same class of issues along the way.

**Full homepage QA pass now complete** — every section reviewed on both desktop and mobile, 2026-07-15.

### Testimonials refinements, requested after the QA pass closed out (2026-07-15)
Three real requests, all in `Testimonials.tsx`:
- **"Read more" was stretching every card, not just the one clicked.** Root cause: the track's flex
  container had no `align-items` override, so the default `stretch` made every card in the row match the
  tallest sibling's height whenever one expanded. Fixed with `items-start` on the track.
- **Cards should be a uniform height by default, with text truncated (ellipsis) — not each card sized to
  its own natural content length.** Restructured the data model: `excerpt`/`more` were two separate
  strings rendered as two stacked paragraphs — merged into one continuous `text` field per review (this
  was Adinda's explicit correction: "Read more" reveals the *same* paragraph in full, it doesn't append a
  second one). Truncation now via CSS `line-clamp-3` (native multi-line ellipsis, removed the old manual
  "..." endings from the copy) on that single paragraph; `line-clamp-2` added to the title too. Verified:
  card heights uniform at 277px across 7 of 8 cards (one title wraps to a 2nd line, 303px — flagged to
  Adinda as a residual minor non-uniformity, not yet resolved, see below). Confirmed expanding one card
  only grows that card (541px) while every sibling stays at its original height.
- **Wanted the carousel to loop — right arrow at the end goes back to the start, and vice versa.** Not a
  seamless clone-based infinite scroll (cards don't visually continue past the real last/first) — a
  discrete wrap on arrow click, matching what was actually described. First implementation attempt was
  wrong and shipped-then-caught-by-self-verification, not by Adinda: `goTo` originally detected position
  via "which card is closest to the track's left edge," which works fine mid-list but never actually
  reaches "last card" at max scroll once more than one card is visible per row (4 on desktop) — the wrap
  branch never triggered. Rewrote to check `scrollLeft` against the real `scrollWidth - clientWidth` max
  directly, independent of how many cards are visible at once. Verified both directions explicitly:
  clicking "next" at true max scroll (1249) returns to 0; clicking "prev" at 0 goes to true max (1249).
- Bonus (asked in the same request): arrow-click navigation changed from `behavior: 'instant'` to
  `'smooth'` — was the actual cause of the "snappy" feel Adinda flagged.
Verified clean throughout: `tsc --noEmit`, `eslint`.

**CORRECTED AGAIN, same session.** The `min-h` reservation "fix" above created a new, different bug:
Adinda caught it via screenshot — 1-line-title cards now had visible dead space between the title and
body (the reserved-but-unused half of the 2-line box). Two wrong approaches in a row before landing on the
real one — worth being explicit about the actual requirement this time: **no reserved/padded space
anywhere, ever; instead the body's truncation length dynamically compensates for however many lines the
title actually rendered**, so title+body always total the same number of lines (a 1-line title pairs with
a 3-line body, a 2-line title pairs with a 2-line body — both total 4).

This isn't achievable in pure CSS (no way to make one element's `line-clamp` depend on a sibling's
rendered line count without JS). Implemented via real measurement: each title gets a ref; a
`useLayoutEffect` (not `useEffect` — must resolve before paint, or there'd be a visible flash of the wrong
clamp count on load) measures each title's actual rendered height ÷ its computed line-height to get 1 or
2, stores it in state, and the body paragraph's `line-clamp` reads that value (`line-clamp-3` for a
1-line title, `line-clamp-2` for a 2-line one). A `ResizeObserver` on each title re-measures automatically
on any layout change (window resize, breakpoint shift) rather than only once on mount. Title itself is
never clamped or height-reserved — always shows in full, however many lines it needs.

Verified via direct height measurement (not just visual inspection): all 8 cards now exactly 277px, title
and body flush with normal spacing, no gap. Confirmed clean: `tsc --noEmit`, `eslint`.

### No instant expand/collapse — site-wide fix, requested + applied 2026-07-15
Adinda: every transition, including expand/collapse, should be smooth/eased, consistently across the
site — not just wherever it happened to already be built that way. Asked directly whether the earlier
pixel-measurement approach was good practice generally; answered directly (measured-at-runtime via
`getBoundingClientRect()`/`scrollHeight` is fine, hardcoded-in-source like the abandoned `min-h-[3.3rem]`
is not — the failure mode is the hardcoding, not the unit).

**Fixed:**
- **Testimonials "Read more"** — was an instant `-webkit-line-clamp` snap (genuinely can't be
  CSS-transitioned in any browser). Wrapped the paragraph in a container, animating that container's
  `max-height` between the measured clamped/full pixel heights instead — `overflow-hidden` clips the
  instant underlying clamp toggle to whatever height is currently mid-transition, so it reads as smooth.
  Verified via mid-transition sampling (not just before/after): 79px → 130px (mid) → 343px, confirming
  real animation, not a jump.
- **Nav mobile accordions** (Destinations, Resources) — were a plain `hidden` class toggle, no transition
  at all. Fixed with the grid-rows 0fr/1fr trick already proven in `Faq.tsx` (`overflow-hidden` on the
  inner `<ul>`, not the grid wrapper, so its own padding collapses too). Verified via mid-transition
  sampling: 79px mid-point on the way to 701px.
Both verified clean: `tsc --noEmit`, `eslint`.

**NOT yet fixed, flagged rather than silently skipped:** Nav's desktop mega menus (Destinations,
Resources), the mobile menu overlay, and Hero's mobile search takeover all still use an instant
`hidden`/`flex` toggle. These are full show/hide overlays, not simple accordions — fixing them needs real
enter/exit animation state (can't just add a transition class to a `display` toggle), and carries real
regression risk against the outside-click/Escape/focus handling already carefully built and tested this
session. Held for Adinda's explicit go-ahead rather than changed opportunistically alongside the two
lower-risk fixes above. Logged as a new "No instant expand/collapse" rule in `components.md` either way,
so this doesn't get reintroduced on new components even before the overlay cases are addressed.

### Nav QA — desktop findings (2026-07-15)
Confirmed working, no action: scroll-flip timing, all hover states (nav items, "Find a trip", mega-menu
triggers), Destinations mega menu's open/close/crossfade/images, close buttons on both mega menus, Hero
(scroll/zoom checked separately, fine).

**Fixed:**
- **Destinations mega menu "Scroll for more" / "Scroll to top" hints were decorative only**
  (`pointer-events-none`, not real buttons) — real wheel-scroll on the list itself worked fine
  (verified via a dispatched wheel event: `scrollTop` moved 0 → 203 correctly), but the visible
  hint text wasn't clickable, which read as broken. Converted both into real `<button>`s that scroll
  the list to bottom/top respectively — `Nav.tsx`.
- **Nav logo/wordmark didn't visibly do anything when clicked.** Not actually broken — Next.js's
  `<Link>` only resets scroll on an actual route change, and right now `/` is the only route that
  exists, so clicking "home" while already on it was a real no-op. Added an explicit
  scroll-to-top on click to all 4 home links (desktop icon + wordmark, mobile bar, mobile menu
  overlay) so it behaves like "home" regardless — harmless once other routes exist too — `Nav.tsx`.
- **"North Sulawesi" wrapped to 2 lines — two separate instances, both in `Hero.tsx`, not Nav.**
  Mobile instance found first (Hero's mobile destination-search takeover list) — traced via a real
  390px-viewport screenshot before touching code, since the visual pattern in Adinda's first
  screenshot didn't match Nav's own mobile accordion (which stacks name/tagline vertically and
  doesn't wrap). Fixed: destination name now `whitespace-nowrap` (never wraps), tagline gets
  `truncate` (ellipsis) if too long. Adinda then caught the **same bug's desktop twin** — Hero's
  desktop search dropdown (a separate JSX block, same dark-background/horizontal-layout pattern) —
  initially misdiagnosed as the Nav mega menu until Adinda corrected it; confirmed via the actual
  DOM/computed styles before fixing (not just re-reading source), then applied the identical
  `whitespace-nowrap`/`truncate` fix. Confirmed fixed by Adinda on both mobile and desktop.

Verified clean after all fixes: `tsc --noEmit`, `eslint`.

**Flagged, not a code fix:** Resources mega menu copy needs a real pass — Adinda flagged the current
placeholder text as wrong/uncertain, will edit herself. **Needs clarification, not yet actioned:**
Adinda mentioned Resources menu "needs something [inaudible/unclear] for managing" — possibly wanting
it to be CMS/Sanity-editable rather than hardcoded (which the Nav-as-editable-document pattern already
covers as planned Tier-4 work per `mari-project` skill), but asked her to confirm rather than guessing.

### Still open / needs Adinda's action — not blocking, don't lose track of these
- [x] **"English" `Language` document — created 2026-07-15, confirmed visible in Studio by Adinda.**
  Created via `sanity documents create` (CLI already authenticated locally). Doc ID `language-en`,
  `{name: "English", tag: "en", default: true}`.
- [ ] **Follow-up, explicitly deferred to a future session (after the Tier 4 pass, not blocking it):**
  Adinda doesn't yet understand what this document is *for* / what it actually changes on the site — fair,
  since multilingual itself is deferred/future-paid-add-on scope, so this only exists as a baseline entry
  the localization *scaffold* expects, with no visible effect yet. **Confirmed not blocking Tier 4** — it's
  unrelated to the schema types Tier 4 will build. Also flagged: a Studio "information icon" (likely a
  field-description tooltip) doesn't work — not investigated yet, deferred to the same future session.
- [x] **AI-crawler policy — resolved 2026-07-15, no action needed.** Adinda: wants AI crawlers (GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended) allowed, not blocked. Checked `robots.ts` directly: the block
  rules for all 4 are already commented out, and the active `userAgent: '*'` rule already allows `/`
  (only `/api/` and `/studio/` disallowed) — meaning all of them are already allowed today, by default.
  Nothing to change. Still needs the hardcoded `sitemap` URL updated once the production domain is
  confirmed (unrelated to the crawler-policy question).
- [ ] Verify Sanity Studio v6.4's bulk-edit/multi-select capability — asked, not yet researched.
- [ ] Decide whether to ship `llms.txt` (parked until real page URLs exist to list).
- [ ] CORS: add the production Vercel URL once deployed (currently only `localhost:3000` allowlisted).
- [ ] Sanity Studio UI localization (e.g. German for Stefan) — discussed as genuinely possible
  (`@sanity/locale-de-de`), not yet requested to build.
- [ ] Full icon-level accent-color customization (every icon branded, not just hover/active states) —
  discussed, flagged as bigger than a "simple pass," not yet requested.
- [ ] Destinations drag-swipe live-preview polish (see simplification note above).
- [ ] **Why Us card image re-cropping** (especially "Premium Comfort" / `why-us-dining.webp`) — Adinda's
  own task, explicitly deferred to a future **content pass**, not part of the current build-phase to-do
  flow. Don't raise it again until that phase.
- [ ] **Testimonials `TEST_ONLY_REVIEWS` dummy cards** — Adinda has NOT yet confirmed removal (explicitly:
  "I need to still confirm... I have not"). Leave in place until she says otherwise — don't remove
  proactively.
- [ ] **Resources mega menu — scope clarified 2026-07-15, not yet built:** it's not just the menu items
  list (`RESOURCE_LINKS`) that needs to be Sanity-editable — the descriptive copy panel next to it
  (currently hardcoded in `Nav.tsx`: eyebrow "Before You Set Sail", heading "Plan your voyage with
  confidence.", body paragraph) needs its own Sanity fields too. Copy itself stays as-is content-wise for
  now — just needs to become schema-backed instead of hardcoded, as part of the Tier 4 navigation/
  siteSettings schema work.
- [ ] **Nav link default-with-override principle, locked 2026-07-15:** nav items that conceptually
  correspond to a real page (The Boat, Private Charters, About, Schedule & Rates, Resources sub-items,
  etc.) should default-link to that page's real URL once its page type exists (e.g. `boatPage`), without
  an editor needing to manually pick it — the existing `link` object field (`objects/link.ts`, already
  supports internal-reference-or-external-URL) becomes the *override* for when an editor wants something
  different, not the only way to set the link. Not yet implemented — carry into the Tier 4 schema pass,
  needs the corresponding singleton page types to exist first.

### Reviews — in progress (Why Us done, rest of checklist still open); schema/Studio already reviewed
Schema was reviewed live in-browser by Adinda throughout, iterated on directly. Studio branding was
implemented per her direct requests. Homepage port review started 2026-07-14 (same day as the build) — Why
Us is reviewed and its bug fixed (see above); Nav, Hero, Destinations, FAQ, Testimonials, Contact, and
Footer still need an actual look in a browser — code-level checks (typecheck/lint/build) don't substitute
for that, especially for animation feel and touch/drag behavior on a real device.

---

## Session Time Log (for DRK sprint/hour-estimation calibration — see `drk-website` skill's `workflow.md`)

Adinda's own tracked estimate, not independently measured. Append future sessions here, don't recompute past
ones.

| Date | Session focus | Duration | Notes |
|---|---|---|---|
| 2026-07-14 | Sanity schema pass + Studio branding + theme.css port | ~2h15–2h30 | First full backend session on this build — established schema/Studio/branding conventions from scratch. Expect meaningfully faster on similar future sessions now that the patterns exist. |
| 2026-07-15 | Full homepage QA pass (every section, desktop + mobile) + fixes | **~2h** (Adinda's own tracked estimate, rounded up from ~1h48m measured mid-session) | **~1h of this was a false-alarm chase** (see below), not real QA/bug-fixing time. Once resolved, the actual QA pass covered all 11 sections (Nav, Hero, The Boat, Why Us, Destinations, Latest Articles, FAQ, Testimonials, CTA, Contact, Footer) and turned up ~10 real bugs total, all fixed same session. **Calibration takeaway, revises the 2026-07-14 row's own assumption:** that earlier entry expected future sessions to be "meaningfully faster... now that the patterns exist" — true for *coding* patterns, but a full QA pass has its own largely-fixed cost regardless of how established the code conventions are, because QA time is dominated by *discovering* each section's specific bugs, not by applying known patterns. Budget a full single-homepage QA pass at **~2h** even on a well-patterned codebase, not scaled down just because earlier sessions established good conventions. Sub-note: a "barely any content on mobile" report that looked like a WebKit/iOS bug turned out to be `allowedDevOrigins` (dev server blocking LAN-IP requests), unrelated to any browser engine — see `references/troubleshooting.md`'s localhost-vs-LAN-IP check, which exists specifically to prevent this cost recurring. |
| 2026-07-15 (later, same day) | Boat page full schema build + gallery redesign (3 iterations) + content-model changes (Full Rich Text Block extraction, alt-rule correction) + new tracking docs (`_SCHEMA-SPECS.md`/`_CONTENT-STATUS.md`/`_QA-CHECKLIST.md`) | **~4h30m elapsed, but Adinda estimates only ~70% (~3h10m) was active desk time** — ~30% was her doing other things (learning Japanese, cooking) while background tasks (dev server restarts, Sanity scripts) ran, not actively reviewing/responding. | **New calibration point, distinct from the 2026-07-14 row's caution:** elapsed time and active time diverge meaningfully when a session has real background-task latency (dev server restarts, `sanity exec` scripts, Perplexity/web research) — Adinda could step away during those. **Track both going forward**, not just one figure — elapsed matters for calendar/deadline planning, active time matters for comparing actual effort across sessions. This session's scope was large (full boat schema + 3 gallery redesign iterations + several corrected mistakes), so the ~3h10m active figure is the more honest "how much work was this" number. |
| 2026-07-16 | Session-bookend protocol locked into CLAUDE.md + first full chat-side skills-update round: all 4 skills (drk-website, atlas-website, mari-website, mari-project) ported, installed, verified, archived, handoffs reconciled | **~1h elapsed (Adinda's estimate); active time notably lower** — she finished her kanji reviews in between, so this is an elapsed figure, not active. | **Calibration for skills-update rounds specifically:** a full 4-skill update round is heavily parallelizable with the user's other tasks. The heavy lifting was Claude-side (assembling self-contained payloads, verification greps, install/archive/reconcile), so Adinda's active involvement was mostly the chat-side paste + re-export + Downloads steps — she could step away during payload prep and Claude-side install/verify. Good template for future rounds: elapsed ≈ 1h for 4 skills, active user time a fraction of that. Distinct from the build-session rows above (those need active review/response). |

---

## End-of-session retrospective — 2026-07-15

Requested by Adinda as a standing close-out practice (now also codified as a workflow — see
`drk-website` skill's `references/workflow.md`, "End-of-session retrospective"). This covers *process*
learnings from the session as a whole — the specific bugs/fixes are already logged inline above and in
the shared skill's `components.md`/`troubleshooting.md`; this section is for what doesn't fit as a single
bug-fix entry.

**New learnings, not yet captured elsewhere this session:**

- **Build QA task lists in actual page/DOM order, not whatever order a checklist happens to already be
  in.** This session's original QA checklist (written before today) omitted The Boat and CTA entirely and
  didn't match the real section order — caused real confusion mid-session (skipped The Boat, had to
  correct course into Destinations before Nav/Hero were even confirmed page-order-correct). Before
  starting any future QA pass, verify the task list against `page.tsx`'s actual render order first.
- **When a bug report names a UI pattern that exists in more than one place on the site (e.g.
  "destinations list" — exists in Nav's mega menu AND Hero's search dropdown, both showing name+tagline),
  don't assume which instance from the report alone.** The North Sulawesi desktop-wrap bug was initially
  misdiagnosed as the Nav mega menu; it was actually Hero's search dropdown, a separate component with a
  similar look. Confirm the exact component via the user's actual evidence (screenshot, DOM inspection)
  before fixing anything — this is a *diagnosis* discipline, distinct from the already-documented
  "grep all siblings before calling a fix done" rule, which is about making a fix *complete* once you
  already know what's broken.
- **Any fix that adds a new scroll/focus/animation-triggering effect needs a cold-load re-test, not just
  a re-test of the specific interaction the original bug was about.** The Destinations tab-scroll fix
  (a real, correct fix for its own bug) immediately regressed into a *new* bug — an unconditional scroll
  on page load — because it was only tested against the "click a tab" path, not a fresh page load. Add
  "reload the page cold and confirm nothing moves unexpectedly" as a standing step after any interactive
  fix involving `scrollIntoView`/`scrollTo`/`.focus()`.
- **CDP (Chrome DevTools Protocol) driven via Python + `websockets`, with real device-metrics emulation
  and API monkey-patching, is a proven, fast, reliable diagnostic toolkit for this kind of work** — used
  successfully this session for real mobile-viewport testing, wheel/drag-event simulation, and capturing
  an exact stack trace for an otherwise-invisible scroll bug. Worth reaching for early once a bug survives
  one round of source-reading, rather than continuing to read/theorize (see
  `troubleshooting.md`'s "Unexplained scroll jumps" for the concrete technique). This supersedes the
  iframe-harness approach as the default automated-testing method for anything beyond a static screenshot.
- **For future page builds (Tier 4 onward): treat `components.md`'s "Bake in from the start" section as a
  pre-build checklist, not just a QA reference.** Every pattern in it was found reactively during QA this
  session; building new pages against that checklist *while writing* the component, not after, is the
  actual lever for the "fewer bugs, faster" outcome Adinda asked about — QA existing to catch these has a
  real, roughly fixed cost per pass (see the time-log row above), so preventing them at build time is
  cheaper than catching them later.
- **Consider QA-ing each section shortly after building it, rather than batching all sections into one
  large QA pass at the end**, for Tier 4 pages onward. This session's single ~2h pass across 11 sections
  found bugs that would have been cheaper to catch and fix individually, closer to when each section was
  built — a recommendation for how to sequence future page-building work, not a retroactive complaint
  about this session.

---

## 2026-07-14 — Repo scaffolded, stack verified, 3 open questions resolved

Full detail lives in `CLAUDE.md` (stack table, Next 16 convention deltas, resolved findings) — not
duplicated here. Summary: Next.js 16.2.10 + Sanity v6.4.0 confirmed correct (not the 15/v5 the `drk-website`
skill still says); `cacheComponents` decided OFF for launch; embedded Studio confirmed to need no custom
auth (Sanity's own SSO+CORS); localization plugin compatibility only partially verified, smoke-test before
relying on it. All queued for the next `drk-website` skill-update round in
`_handoff/drk-website.md` (moved here from the old repo 2026-07-14 — this is now the single live copy).

## Today's work session — 3pm–6pm (3h), schema-pass day

**T&C + Schedule & Rates: ≤1h combined.** Content already sourced/verbatim for T&C (16 sections, mechanical
port). Schedule & Rates simplified same session: INSEANQ is a copy-paste embed, not a real integration —
schema just needs one `embedCode` field (raw string). The "Calico Jack sidebar" layout question is
explicitly deprioritized — ship the simple layout, revisit only if time allows later, not blocking.
Adinda still needs to email INSEANQ about filtering (separate, non-blocking, her own to-do).

**Full Sanity schema pass: skeleton only, ~1.5–2h.**
- In scope: `sanity init` + Studio booting at `/studio/[[...tool]]`; all ~15 planned types defined with
  *core* fields only, registered in the schema index; the reusable SEO object; the page-builder array shell
  with 1–2 stub block types (not the full catalog); site-wide singletons (`navigation`, `siteSettings`,
  `announcementBar`); a generic `redirect` type; default (uncustomized) Portable Text wherever rich text is
  needed; smoke test that Studio opens clean and every type is creatable.
- Explicitly deferred (all non-destructive to add later): field-level validation beyond the bare minimum,
  custom Studio previews/input widgets, the minimum-content-guard pattern, the full page-builder block
  catalog, Portable Text heading/alignment customization (see below), localization plugin install, any
  actual GA/GSC/JSON-LD wiring logic (that's Next.js component work, not schema).

**Portable Text heading/alignment customization: explicitly NOT today.** Pair with whichever day first
needs genuinely rich formatted content — Blog is the most rich-text-heavy page in the inventory, the
natural candidate.

**Localization plugins: NOT installed today.** `sanity-plugin-internationalized-array` +
`@sanity/document-internationalization` compatibility is still only partially verified (see CLAUDE.md).
Multilingual itself is deferred/future-paid-add-on scope anyway — no reason to build on an unconfirmed
dependency now. Structure fields so localization *can* be added later; don't wire the plugins.

## Content-model rule: three-tier rich text (locked 2026-07-14, Adinda's framing)

Not one global Portable Text config — three distinct tiers, decide which applies by field, not per-page:
1. **Plain string** — headings, labels, CTA text, eyebrows. No rich text at all.
2. **Constrained rich text** (most body copy — card descriptions, FAQ answers) — Portable Text, paragraph +
   basic marks (bold/italic/link) only. No heading styles, no alignment override — layout/CSS already
   governs presentation, and overriding it per-entry would fight the design system.
3. **Full rich text (headings + alignment)** — reserved for genuinely long-form, structurally flexible
   content: T&C body, Blog post body, and the page-builder's dedicated "Rich Text" block for overview-style
   sections (Private Charters, possibly About's story text).
Practically: every rich-text field uses default Portable Text today (tier-2 behavior). Only tier-3 fields
get the heading/alignment customization layered on later — same field type, enhanced config, nothing gets
rebuilt.

## Pre-launch to-dos surfaced during schema-review session (2026-07-14)

- [ ] **Verify Sanity Studio v6.4's actual bulk-edit / multi-select capability** — Adinda asked; not yet
  researched (didn't find it documented in the skills checked so far). Look up before answering, don't guess.
- [x] `app/robots.ts` created (Next.js dynamic Metadata Files API, default allow-all + `/api/`/`/studio/`
  disallowed). **Still open:** [ ] decide the AI-crawler policy (GPTBot / ClaudeBot / PerplexityBot /
  Google-Extended — allow increases AI-citation chances, block prevents AI-training use) — the block rules
  are stubbed out commented in the file, ready to uncomment once decided. See `drk-seo` skill's
  `aeo-considerations.md`. Also update the hardcoded `sitemap` URL once the production domain is confirmed.
- [ ] **Decide whether to ship an `llms.txt`** file at launch (emerging AEO practice, static root file like
  `robots.txt`) — needs real page URLs to be worth building, so parked until more page types exist.
- [x] **`page` type's rich text body upgraded** — resolved by pulling the actual spec directly from the
  live MVP repo (`atlas-drkdigital/mari-website-mvp`) instead of waiting on a paste: H1-H4/Quote styles,
  underline/strike/code marks, align + text-color annotations, sized/aligned images, HTML embed block.

## Tier 4 backlog additions from schema-review session (2026-07-14)

Captured while reviewing the schema locally, not built yet (Tier 4 is deferred — Adinda will resequence
later):
- **Destination page** and **Itinerary page**: each needs an optional INSEANQ `embedCode` field (same
  pattern as `scheduleRates`), so availability can be shown/filtered in context, not just on the dedicated
  Schedule & Rates page.
- **Private Charters page**: needs its own INSEANQ `embedCode` field too (filtered sync).
- **New page type: "Specials"** — an Atlas-website page candidate, essentially a filtered INSEANQ sync view.
  Cheap to add ("just a matter of filtering and sync") — flagged as a likely near-free addition once
  Destination/Itinerary embed wiring exists. Not in the original page inventory — add to `atlas-website`
  skill's page checklist when Tier 4 resumes.
- INSEANQ filtering email sent to Andrew (Adinda's own to-do, non-blocking) — placeholder `embedCode`
  content is fine until his response arrives.

## Sanity project created, Studio embedded (2026-07-14)

New Sanity project **`kb8eim50`** ("Mari Liveaboard"), dataset `production`, fully separate from the live
MVP's project (`sjkpkyaw`) — Adinda's call: full isolation, new repo + new Sanity project (+ new Vercel
project later at deploy time), zero shared state with the currently-live site. Studio embedded at
`/studio/[[...tool]]`, smoke-tested (200 response, boots clean, zero schema types yet). Upgraded off the
CLI's default `sanity@5`/`@sanity/vision@5` to the verified `6.4.0` per CLAUDE.md's stack table. Full
connection details + redo steps: see `SANITY-SETUP.md` (new file, root of repo).

## Studio editor-organization — deferred to last, confirmed safe (2026-07-14)

Field `title`/`description`/tab-grouping and the Structure Builder (sidebar navigation) are presentational
metadata only — changing them later costs no migration. What must be reasonably right from today: the
actual field `name` keys and document type `name`s, since renaming those after real content exists needs a
migration script. Today's skeleton pass already handles this; labeling/grouping polish is legitimately a
finalize-last task — better done last anyway, once the full type list is visible.
