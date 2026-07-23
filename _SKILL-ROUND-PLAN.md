# _SKILL-ROUND-PLAN.md — paste-and-go skill-update round (prepped 2026-07-20)

This is **STEP 2** of the plan in `_RESUME.md`: the full skill-update round that merges the whole
`_AUDIT-2026-07-20.md` backlog into the skills. It is a **prep deliverable** — Adinda runs each block below
in a chat-side skill-update session when she's back. Nothing here edits a skill; this file only stages the
prompts.

## How to run this
- **One skill at a time**, in the order below (build-affecting first, per the session-bookend protocol).
  Finish one skill fully — update in chat → export to Downloads → install locally → confirm — before
  starting the next.
- Each block has: **(A)** a ready-to-paste chat prompt (the code block), and **(B)** the exact
  `_handoff` / `_payload` source file(s) to paste alongside it (the chat session has NO access to this repo,
  so the prose content must be pasted in too — the prompt is the checklist, the handoff files are the body).
- After the last skill: drop the updated skill packages into Downloads; Claude installs them; then
  **strip the merged items out of `_handoff/*.md`** so the backlog doesn't re-accumulate (verify what
  actually landed first).

## ⚠️ Overlap with the 3 URGENT fixes already in `_RESUME.md`
`_RESUME.md` STEP 1 stages three urgent, build-affecting fixes Adinda may already have run in chat. This
round is the *superset*. Where a block re-covers an already-run urgent fix, it says so explicitly at the top
("if you already ran the urgent … fix, SKIP part N"). The three urgent fixes are:
- **① drk-website** — replace the weak Figma-precedence rule (→ this round's Part 1) + delete the
  compress-before-upload clause (→ Part 2).
- **② mari-website** — boat URL `/boat`→`/boats/mari` + boat.md node/open-item update (→ Parts 1–2).
- **③ atlas-website** — remove the retired `faq` document-type note from `pages.md` (→ Part 1).

## Run order (build-affecting first)
1. **drk-website** — foundation; carries the smoking-gun Figma rule + ~16-item backlog. Highest build impact.
2. **atlas-website** — retired-`faq`-type note actively misleads a build; + FAQ layout-variant gap.
3. **mari-website** — `/boat` URL + stale boat.md nodes build against a deleted design.
4. **drk-work-tracker** — NEW skill; author from payload. Enforcement already live in Mari CLAUDE.md.
5. **mari-core** — content facts, **mostly Serge-blocked**; stage/hold, do not force-merge. Last for a reason.

> **Not in this round:** `mari-project` was **uninstalled** this session (clashed with MANAGER.md as a second
> tracker) — no prompt for it. `drk-seo` / `drk-seo-writer` / `mari-itineraries` / `atlas-destinations` are
> under a separate audit lane — see the placeholder at the bottom.

---

# 1 — drk-website  🔴 build-affecting, run first

**Source files to paste alongside the prompt:**
- `_handoff/_payload/drk-website.md` → **PART E** (Figma-supersede) and **PART F** (stepped-vs-fluid).
- `_handoff/drk-website.md` → the entire **## Pending** section (the ~16 items — full prose bodies, target
  files, and reasoning are all there; the prompt below is only the index/checklist).

**Overlap with urgent fix ①:** Part 1 (Figma rule) = PART E, Part 2 (delete pre-compress) is also inside
Part 6 (Sanity pipeline). **If you already ran urgent drk-website fix ①, SKIP Parts 1 and 2 below** and do
Parts 3–18. If you did NOT, do everything.

```
This is the drk-website skill-update round from the Mari 2026-07-20 audit. Merge ALL of the following. I'm
pasting the two source docs after this message: (a) PART E + PART F from the drk-website payload, and (b) the
full "Pending" section of the drk-website handoff — those carry the full prose, reasoning, and target files.
This list is the checklist to reconcile against; use the pasted bodies for exact wording. Port the GENERALIZED
pattern only — leave Mari's exact px values, copy, and brand specifics out. For every correction-class item,
verify BOTH halves after: new text present AND old text gone (or struck-through + marked superseded, which is
acceptable and often better). Re-scan Pending after merging (a round takes hours; something may have been
added mid-round) before closing.

PART 1 — 🔴 SMOKING GUN. references/figma-conventions.md: REPLACE the weak Figma-precedence rule (the "would
this change a static screenshot?" test — "Yes → real Figma drift, fix toward Figma") with PART E's stronger
rule: "ESTABLISHED CONVENTIONS ALWAYS SUPERSEDE FIGMA, every time, even when it changes what a static
screenshot looks like." Figma = authoritative for structure/intent; codebase = authoritative for expression
(type ramp, spacing scale, colour tokens, gutters, responsive behaviour). Keep the "do we already have a name
for this?" test, the "always pull the node anyway" guardrail, and the "comment naming BOTH values on override"
rule. Verify the old weak rule is GONE. [If you already ran the urgent drk-website fix, this is done — SKIP.]

PART 2 — 🔴 references/workflow.md: DELETE the "compress/resize images BEFORE upload" clause. Correct rule:
upload full-resolution masters, let the Sanity CDN compress on delivery (quota bills SERVED bytes not stored;
pre-compressing destroys the archival master). Keep only the "rename to descriptive kebab-case before upload"
half. [If you already ran the urgent drk-website fix, this is done — SKIP. But still do PART 6, which is the
full measured pipeline, not just the clause deletion.]

PART 3 — NEW. Responsive spacing/sizing STEPPED vs FLUID (payload PART F) → references/workflow.md or the
components family. Decide ONCE per project, ASK at project start, NEVER mix. Default to stepped. "Flat" (no
responsiveness) is the only genuinely-bad state; stepped is not "un-best-practice". Include the trade-off
table and "preserving the desktop look ≠ hardcoding a desktop pixel."

PART 4 — 🔴 references/troubleshooting.md: Real-device bugs → PRIVATE/INCOGNITO TAB FIRST, ahead of the
localhost-vs-LAN check (which now becomes the SECOND move). Add the TWO-allowlists lesson: the framework's
dev-origin allowlist (Next allowedDevOrigins) AND the CMS's own project CORS allowlist (Sanity manage.sanity.io)
are different lists with the same class of symptom; both need the LAN IP; both re-added on IP change; both land
in the dev log, never the browser — read the dev log before theorizing.

PART 5 — 🔴 references/workflow.md (per-slice family): Post-slice SEO pass — AUTHORING in-slice ≠ VERIFYING.
A slice is done only after a drk-seo pass runs against the RENDERED page and findings are fixed/logged.
In-slice = AUTHOR (fill seo field, emit JSON-LD, alt, rename images); post-slice = VERIFY (one H1, no skipped
levels, semantic tags, alt present, the metadata function ACTUALLY consuming the seo field, JSON-LD valid,
canonical set, internal links resolving). Cite the two existing rules it proves ("a ritual that can't fail
isn't a check"; "a schema field nothing renders is a promise").

PART 6 — 🔴 references/performance.md + images/CMS family: Sanity image pipeline — upload full-res, NEVER
pre-compress, and MEASURE don't read. Full measured settings: q=75 not 80 (choose against the COLD WebP
path); always .auto('format') (only route to AVIF; fm=avif 400s by design); always fit('max') on width-capped
variants (it upscales past source without complaint); sizes mandatory off-100vw; use the framework's Sanity
loader not bare next/image (double re-encode otherwise); AVIF is async per-URL so design for the cold path and
never benchmark cold; never upload WebP (quality, not support — lossy→lossy master); the docs-vs-reality gaps
(JPEG default is 80 not 75; bare URL re-encodes JPEG/WebP; PNG+width without auto=format INFLATES; no lossless
path). Two meta-lessons: newer Sanity doc page wins on conflict; for CDN behaviour MEASURE, a doc read isn't a
verification. Debunk the invented "Google recommends ~200KB/image".

PART 7 — 🔴 references/performance.md (or images family): Image size targets come from the COMPONENT — read
the component's `sizes` attribute + aspect box, not the design file or a remark. Counter-intuitive rule: in a
cover-cropped grid, PORTRAITS are width-bound (a fixed-aspect object-cover slot crops a portrait to landscape,
so width must clear the target). "Is this image big enough" has no single answer, only a per-slot one.

PART 8 — 🔴 images/asset-pipeline reference: The filename LIES — view the image AND read the ORIGINAL
filename (neither alone suffices; hand-renames aren't evidence; the photographer's originals carry location
facts renames destroy). Reusable trick: name the descriptor after WHAT IS IN THE FRAME, never a location
claim, so naming never blocks on an unsettled taxonomy question.

PART 9 — 🔴 asset-pipeline / tooling reference: (1) A rename is a copy — preserve the source extension;
.png→.jpg is a lossy re-encode, not a rename; conventions end ".{whatever the source already is}". (2) Google
Drive "Shared with me" is NOT synced — needs Add-shortcut-to-Drive to mount locally; the Drive MCP connector
is for FINDING/DECIDING (base64-into-context + no pixel dimensions in metadata), a synced path is for READING.

PART 10 — 🔴 components/figma-conventions: A design system's class names must be VERIFIED, not
pattern-matched — Tailwind emits NOTHING for an unknown class (no warn/error/build-fail; invisible to
typecheck/lint/200). Two traps: primitives vs semantic tokens (primitive layer usually not exposed; use the
*-ondark-*/*-onimage-* family over photos); the spacing scale has gaps (write off-scale steps as arbitrary
values, never round). Corollaries: a wrong-looking page can be the design file on a dark canvas (tell is
content not colour); compiled output disagreeing with source can mean the build is BEHIND (re-check after
recompile).

PART 11 — 🔴 references/workflow.md + figma-conventions: Build a section from the DESIGN NODE, never from its
NAME. Pull the real node spec (get_design_context) — a node NAME/ID-from-a-doc/list-position produces wrong
guesses (a "HighlightCard" that isn't a card; a bullet that's a text character with no SVG). Pair with naming
a reviewed section as the project's canonical reference implementation.

PART 12 — 🔴 components: Two heading ramps are not interchangeable — display-* (anchors a section, set by a
component) vs editorial-* (headings WITHIN body copy). Any heading an editor types into rich text is editorial
by definition. Watch the ramp's lower end (small headings colliding with body size is a token decision for the
designer — flag, don't silently patch).

PART 13 — 🔴 sanity-studio.md / workflow.md: A schema field NOTHING renders is a PROMISE, not a feature (a
field with no consumer is unverified by construction). When a slice first renders a field, verify its
BEHAVIOUR not that text appears; seed content that EXERCISES the behaviour; when a rich-text schema gains a
style/mark/member, add it to the renderer in the SAME pass (the two files are a contract, only one fails
loudly). {token} resolver, rich-text block styles/marks, and image hotspot were the three identical-shape bugs.

PART 14 — 🔴 components: Only show a "read more" when there IS more — and MEASURE it. Fixed line-clamp is a
guess; cap with max(floor, 60dvh) using dvh; beware a px ceiling silently defeating the % (clamp(240,60dvh,404)
caps at 404); there's no CSS "am I clipped?" — measure scrollHeight>clientHeight on ResizeObserver AND
document.fonts.ready; don't re-measure while expanded; the button is absent from SSR by design (can't verify
via curl); animate height needs a measured px target both ends; fade the cut edge with mask-image not an
overlay div; pick the duration from the interaction's CLASS (reveal ~700ms, not a 300ms hover default).

PART 15 — 🟡 references/claude-code.md or components: JSX — a {/* */} comment is only valid in CHILDREN
position; placing one between `cond ? (` and its element is a parse error → 500. Put it above the conditional
or inside the element.

PART 16 — 🔴 CORRECTION to references/session-conventions.md "Commit cadence": the verified-clean
precondition gates what the MESSAGE CLAIMS, not whether to commit. Default to committing (an uncommitted tree
is the only genuinely lossy state; a local commit is a private reversible checkpoint). A breaking bug is fine
to commit if the message says so; the forbidden thing is a broken state that LOOKS finished in the log. This
reinterprets (does not delete) the "never commit a known-broken state" line — it was always about committing
broken work SILENTLY. ADD the parallel-sessions rule: don't commit another session's in-flight work (only the
authoring session knows what the message should honestly say); name the files, say they look like another
session's, leave them; never "shall I commit?". Include the meta-lesson (three rules shipped 07-17 that one
day's use disproved — name a standing rule's load-bearing premise and ask what it costs to test it).

PART 17 — 🔴 STRENGTHEN references/sanity-studio.md (was sanity-cms.md, PART Q) + troubleshooting.md:
draft/published — verifying against the side you WROTE to is not verifying. _id discipline fixes WHICH doc you
address but not that a doc is TWO documents. Rules: a mutation must STATE which side it targets (published /
draft / both) as a deliberate choice; for editor-visible content patch BOTH; verify BOTH sides always. Meta:
knowing about a trap doesn't stop you hitting it from the opposite direction — the rule must name the MECHANICAL
check ("query both sides").

PART 18 — 🔴 references/session-conventions.md: A REMINDER is a claim about the present — verify before
delivering it (the Figma-screenshots reminder outlived its subject). Applies to our OWN notes/MANAGER
reminders/handoff items, not just recalled memories. When writing a reminder, write its EXPIRY (the
invalidation condition, not just the trigger).

PART 19 — 🟡 content-modeling reference: Name a field for the SECTION IT RENDERS, not the shape of its data
(Mari's Amenities section is driven by a field called `gallery` because the data was "a pile of images" —
prevention item, not a fix; do not repeat on the next project). Corollary: the field's code comment outlived
the name's accuracy (more evidence for "reasoning lives in code comments, not Studio-visible text").

PART 20 — 🟡 references/redirects.md or URL conventions: Don't make the collection URL segment editable —
make the slug editable (it already is in Studio). One field that can re-URL the whole site is expensive
machinery for a cheap-later problem (a typo 404s every indexed page; sitemap/canonical/breadcrumbs all derive
from it; doing it later = rename a folder + one redirect doc). General principle: *editable* and *correct* are
different goals — a knob adds a way to get it wrong.

STILL-OPEN (do NOT try to fill this round): the COMPONENTS.md catalog port — references/components.md still
has essentially no named-component catalog, but Mari's COMPONENTS.md file doesn't exist yet as a source to
port from. Leave it open; note it's still the gap.
```

---

# 2 — atlas-website  🔴 build-affecting

**Source files to paste alongside the prompt:**
- `_handoff/atlas-website.md` → note the **Pending** items are all HELD-for-Adinda's-decision (do NOT
  resolve them). The two real changes this round are described in the prompt directly.
- Reference: `_AUDIT-2026-07-20.md` → atlas-website lane (C1/S1 and U1).

**Overlap with urgent fix ③:** Part 1 (remove retired `faq`-type note) IS urgent fix ③. **If you already ran
urgent atlas-website fix ③, SKIP Part 1** and do only Part 2.

```
This is the atlas-website skill-update round from the Mari 2026-07-20 audit. Two changes only. Do NOT touch
the three items still flagged OPEN in the skill (schema-patterns folder, /destinations index page, homepage
section-order) — those are waiting on Adinda's decision, not a merge; leave them flagged open.

PART 1 — references/pages.md, the FAQ row: REMOVE the note that the FAQ "Requires the `faq` Sanity document
type." That document type was RETIRED 2026-07-17 (see page-structure/faq.md, which is already correct) and
replaced by an inline `faqSection` object composed at render, not a stored taxonomy. The stale line would
mislead a future build into recreating the dead type. Repoint the row at the inline faqSection model. Verify
no other pages.md line still implies the `faq` document type exists. [If you already ran the urgent
atlas-website fix ③, this is done — SKIP.]

PART 2 — NEW GAP (in CLAUDE.md but not yet in the skill OR the handoff): add the FAQ section LAYOUT VARIANTS
to page-structure/faq.md. The FAQ section is ONE component with a `layout` field, two values named for what
the variant DOES (not its geometry): `default` (accordion, full width — e.g. a homepage FAQ) and
`categorized` (category list down the left with an active left-border bar, Q&A accordion on the right; on
mobile the categories become horizontally-draggable chips like the Destinations pattern — e.g. a boat-page
FAQ). Note this is a schema field `name` (expensive-to-change bucket), which is why it was decided before the
field was written. Still-open sub-question to record (don't resolve): whether the editor picks the variant
per-section or it's fixed per page type.
```

---

# 3 — mari-website  🔴 build-affecting

**Source files to paste alongside the prompt:**
- `_handoff/mari-website.md` → the **Pending** section (the SEO-pointer item, the private-charters deck-name
  item, the boat.md image/gallery facts, the `/boat`→`/boats` URL item, the boat.md node/open-item item).
- Reference: `_AUDIT-2026-07-20.md` → mari-website lane.

**Overlap with urgent fix ②:** urgent fix ② already did the boat URL (`url-structure.md` + `pages/boat.md`)
AND the boat.md Figma-node/open-item update (#5/#7/#8/#9). **If you already ran urgent mari-website fix ②,
SKIP Parts 1 and 2** and do Parts 3–5.

```
This is the mari-website skill-update round from the Mari 2026-07-20 audit. mari-website owns
copy/SEO/URLs/build-status only. Merge the following.

PART 1 — 🔴 references/url-structure.md: boat URL is WRONG. Change Boat `/boat` → `/boats/mari` (individual)
and ADD a `/boats` listing route (the file currently has no `/boats/[slug]` pattern — it assumed one fixed
boat page). Live code route is src/app/boats/[slug]/page.tsx. Record the REJECTED shapes so they aren't
re-proposed: `/boats` listing + `/boat/mari` child (mismatched segments); and a dynamically-configurable
collection segment (declined — expensive machinery; per-document slugs are already editable in Studio, which
is the part that matters). [If you already ran urgent mari-website fix ②, this is done — SKIP.]

PART 2 — 🔴 references/pages/boat.md: the Figma node table (715-series, Amenities 718:5516) is DEAD. Update
to the current authoritative frame `Page/Boat = 778:8702` and its real sections: Hero 778:8706 (sub-nav
Block/SubNav 778:8712) · Overview 778:8747 · Cabins 778:8762 · Amenities 778:8845 · LayoutAndSpecs 778:8878 ·
FAQ 778:8902 · CTA 778:8903 · ContactUs 778:8904 · Footer 778:8905. Note there is NO Gallery section — the
schema's `gallery` field IS the Amenities section (naming mismatch, kept deliberately for Mari). CLOSE these
open items: #5 amenities tabs = The Boat / Dining / Diving / Relaxation / Others (Figma-derived, in schema);
#7 hero stats = the BOAT stats (Cabins / Guests / Boat Size / Crew), NOT Komodo's Season/Duration/Skill;
#8 H1 = "Mari Liveaboard"; #9 "excellent value" → confirmed real conflict, mari-core mandates "exceptional
value". [If you already ran urgent mari-website fix ②, this is done — SKIP.]

PART 3 — 🔴 SEO authority pointer. mari-core/brand/copywriting/seo.md now exists and is the brand-layer
authority for SEO-copywriting rules, heading-hierarchy philosophy, and entity precision. Wherever mari-website
currently RESTATES any of those, REPLACE with a pointer to mari-core/brand/copywriting/seo.md (restating is
what lets them drift). The three-way split: mari-core/brand/copywriting/seo.md owns the rules + heading
philosophy + entity precision; mari-website owns per-page keyword targets + approved per-page heading maps +
page-level metadata (title/description); drk-seo owns implementation (schema/sitemaps/hreflang).

PART 4 — 🟡 references/pages/boat.md: record the settled image/gallery facts. Gallery categories are FIXED
and hardcoded (one source of truth: galleryCategories.ts): The Boat / Dining / Diving / Relaxation / Others,
from Figma Amenities node 778:8845 — deliberately NOT editor-managed. The gallery's TWO reads: each tab's
carousel shows only that category's images; the LIGHTBOX shows ALL images ignoring the tab (looks like a bug,
isn't). Image naming convention: mari-liveaboard-{category}-{nn}-{2-3 words}.{source ext}, categories
boat/dining/diving/relaxation/photo (`photo` replaces "Others" — SEO-dead in a public CDN URL); descriptors
name what's IN THE FRAME, never a deck. Known ceiling: sources are ~1535px web exports, no masters; thumbnails
fine, lightbox caps ~1500 not 1920.

PART 5 — 🟡 dead-path cleanup: mari-core/brand/voice.md NO LONGER EXISTS — replaced by brand/copy-rules.md +
brand/copywriting/{general,seo,eyebrows-and-headings,channel-adaptation}.md. Repoint any brand/voice.md path
in mari-website (e.g. the "exceptional value" citation) to brand/copywriting/seo.md (or copy-rules.md as
appropriate).

UNBLOCKED 2026-07-21 (Adinda confirmed mari-core's locked facts correct — 3 spaces, sky-deck naming):
fix references/pages/private-charters.md L71/L96 "sun deck" → "sky deck" (straight replace is now safe),
and flip the "unverified" flags on oxygen / first aid / camera rinse tank to confirmed, matching
mari-core's ✅. DO NOT MERGE THIS ROUND (not skill edits): Testimonials real-content (a build/content
task) and the footer phone-number conflict (leave it flagged, blocked on Serge).
```

---

# 4 — drk-work-tracker  🆕 author a NEW skill

**Source file to paste alongside the prompt:** `_handoff/_payload/drk-work-tracker.md` — it is the canonical,
complete spec (frontmatter, three modes, data model, recap format, enforcement, generalisation note). Paste
the WHOLE payload.

**Note:** the host-side enforcement is ALREADY live in Mari's CLAUDE.md (session-bookend protocol) — this
round only authors the chat-side skill itself. No overlap with the three urgent fixes.

```
Author a NEW DRK skill called `drk-work-tracker` from the payload I'm pasting after this message. The payload
is the canonical, complete source — build the skill directly from it. Key points to preserve exactly:

- Frontmatter name/description AS GIVEN — the `description` IS the trigger surface and must fire on: session
  bookends (recap / "good morning" / "wrapping up"), "how long did X take", "am I on estimate", "weekly
  recap", "log this session", "where did my time go", productivity breakdown.
- It is ONE skill with three MODES, not three skills: `log` (session close — the enforced core flow),
  `start` (session open — carry-forward of blockers + unfinished planned items + estimate-accuracy trend),
  `recap`/`week` (on-demand analysis). Bare invocation infers the mode from context.
- Mode `log` steps: derive ELAPSED from git commit timestamps (don't ask); ask the ONE thing only the user
  knows = ACTIVE desk time; reconcile Planned → Actual → Unplanned (the unplanned column is the real
  productivity signal); note/carry blockers; write the row to the per-repo Session Time Log + update day-plan
  actuals; log estimate accuracy.
- Data model: the per-repo Session Time Log row (Date, Session focus, Elapsed [git-derived], Active [user,
  1 question], Planned est / Actual, Unplanned, Blockers). Honest-data boundary: session start is derivable,
  active desk time stays a one-question self-report — never fabricate active time from commit gaps.
- Recap output format (6 sections in order): TLDR; daily breakdown table (flag no-active-data days
  explicitly); planned-but-not-done (knowingly-accepted slippage vs real miss); done-but-not-planned
  (aggregated time-sinks); blockers with owners; estimate accuracy.
- It's project-agnostic (only Mari-specific binding = which file is the running log, MANAGER.md here). Note
  that the host-project enforcement rule ("run drk-work-tracker log at close / start at open" as a
  non-skippable session-bookend step) is queued separately for drk-website's references/workflow.md and
  should POINT at this skill, not duplicate it.

Export the finished skill to Downloads when done so it can be installed locally.
```

---

# 5 — mari-core  ✅ RETIRED 2026-07-21 — no round needed, ever

Adinda confirmed 2026-07-21 that mari-core is CORRECT on every item this block used to queue (the
3-outdoor-space inventory, the sky-deck naming, the equipment ✅s; hull colour dropped as a non-issue).
`_handoff/mari-core.md` was deleted — there is nothing to merge. The only follow-through lives in the
mari-website round above: fix its two stale "sun deck" lines (now a safe straight replace) and flip its
🔴 "unverified" equipment flags to match mari-core.

---

# drk-seo (audit-completion lane reported 2026-07-20 — placeholder now filled)

**Run-order:** slot after **mari-website** (build-relevant, SEO structure). The other 3 deferred skills
(`drk-seo-writer`, `mari-itineraries`, `atlas-destinations`) came back **CLEAN — no round needed** (only
self-flagged content gaps, e.g. `sumbawa.md` pending Serge).

**Paste alongside:** `_handoff/drk-seo.md` (the image-SEO conventions are fully drafted there).

```
In the drk-seo skill:

1) [HIGH] Add image SEO — it's entirely absent, yet drk-website's vanity-filename chain assumes drk-seo
backs it. Create references/image-seo.md from _handoff/drk-seo.md: "filenames are for ORGANISATION, alt
text is for SEO"; frame-descriptive filenames; never hardcode the extension; the vanity-filename fallback
chain (seoImageName -> originalFilename -> slugified alt -> omit). Also kill two myths (the invented
"~200KB/image" rule; the debunked "high-DPR tolerates lower quality") and record the Lighthouse 12->13
bits/px tightening.

2) [MED] references/technical-seo.md — replace the static public/robots.txt example with the Next 16
app/robots.ts MetadataRoute.Robots form (the repo uses app/robots.ts, which also carries the ClaudeBot
AI-crawler policy).

3) [MED] references/technical-seo.md — redirects: the next.config.ts redirects() example diverges from the
DRK standard. Add a one-line cross-ref: "DRK default = proxy.ts + a Sanity redirect document type (see
drk-website)."

4) [LOW] references/technical-seo.md — the first generateMetadata example destructures params without
await; Next 16 dynamic APIs are async-only. Make it `await params`, matching the hreflang example below it.
```

---

## After the round — cleanup checklist (session-bookend protocol)
- [ ] Each updated skill exported to Downloads and installed locally; Adinda confirms.
- [ ] For every merged item: verify it actually LANDED in the installed reference file (not just the skill
      changelog) — the "verify against installed files, not the Done ledger" standing rule.
- [ ] Strip merged items out of `_handoff/*.md` (and any MANAGER.md staging) so the backlog doesn't
      re-accumulate — verify what landed before cutting.
- [ ] Leave the atlas/mari open-decision items IN the handoffs (they weren't merged). (mari-core no
      longer applies — its handoff was retired 2026-07-21; Adinda confirmed the skill correct.)
- [ ] Then proceed to `_RESUME.md` STEP 3 (second audit) and STEP 4 (slim CLAUDE.md).
