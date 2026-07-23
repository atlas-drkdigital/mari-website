# ▶ STEP 2 — READY TO PASTE (skill-update round)

**How to use this file:** work top to bottom. For each block, do the **ATTACH THIS** step first (drag the
named file into the chat), then copy everything between the ⬇️ START and ⬆️ END markers and paste it. One
block at a time. Wait for the chat to finish a block before pasting the next.

**Do the skills in this order.** Finish a whole skill (all its blocks → export to Downloads → install →
confirm) before starting the next one.

1. **drk-website** — 3 blocks
2. **mari-website** — 2 blocks
3. **drk-seo** — 1 block
4. **drk-work-tracker** — 1 block (brand-new skill)
5. **mari-core** — DEFERRED, no action (see note at the bottom)
6. *(optional)* **atlas-website** — 1 small block, flagged at the bottom

**Already done 2026-07-20 — do NOT redo:** the drk-website Figma-supersede rule + the "compress before
upload" deletion · the mari-website boat URL (`/boats/mari`) + the main Page/Boat node (`778:8702`) · the
atlas-website retired-`faq`-type row. Those are marked **✅ DONE — SKIP** inline wherever they'd come up.

---
---

# 1 ▪ drk-website  (3 blocks — same chat, paste one at a time)

> **ATTACH THIS (before Block 1, and keep it attached for all 3 blocks):**
> `_internal/handoff/_payload/drk-website.md`  **and**  `_internal/handoff/drk-website.md`
> (The chat has no access to this repo. These two files carry the full prose/reasoning; the prompts below
> are just the checklist. `_internal/handoff/drk-website.md` is large — that's expected.)

---

## drk-website — BLOCK 1 of 3  ·  "the rules that would have prevented the boat page"

⬇️⬇️⬇️ START COPYING HERE ⬇️⬇️⬇️

This is the drk-website skill-update round from the Mari 2026-07-20 audit — part 1 of 3. I've attached two
source docs: PART E + PART F of the drk-website payload, and the full "Pending" section of the drk-website
handoff. Those carry the full wording and reasoning; this message is the checklist to reconcile against.
Ground rules for the whole round: port the GENERALIZED pattern only — leave Mari's exact pixel values, copy,
and brand specifics out. For every correction, verify BOTH halves after: the new text is present AND the old
text is gone (or struck through and marked superseded, which is fine and often better).

Note: the Figma-supersede rule and the "compress before upload" deletion were already handled in an urgent
fix — SKIP both of those, they're done. This round is everything else.

Merge these — this first batch is the cluster whose absence let the boat page get built too literally:

1) Build a section from the DESIGN NODE, never from its NAME. Pull the real node spec (get_design_context) —
a node name, or an ID copied from a doc, or a section's position in a list, produces wrong guesses (a
"HighlightCard" that turned out not to be a card; a bullet that was really a text character with no SVG).
Pair this with naming a reviewed section as the project's canonical reference implementation.

2) A design system's class names must be VERIFIED, not pattern-matched. Tailwind emits NOTHING for a class
it doesn't recognise — no warning, no error, no failed build — so an invented utility is invisible to
typecheck, lint, and a 200 response, and shows up only as a broken-looking page. Two traps to spell out:
primitive vs semantic tokens (the primitive layer is usually not exposed — use the *-ondark-* / *-onimage-*
family for text over photos), and gaps in the spacing scale (write off-scale steps as arbitrary values,
never round to the nearest step). Corollaries: a wrong-looking page can actually be the design file on a
dark canvas (the tell is the CONTENT, not the colour); and compiled output disagreeing with source can mean
the build is simply BEHIND — re-check after a recompile before "fixing" it.

3) Two heading ramps are NOT interchangeable: display-* (anchors a section, always set by a component) vs
editorial-* (a heading WITHIN body copy). Any heading an editor types into a rich-text field is editorial by
definition. Watch the low end of the ramp — small headings colliding with body size is a token decision for
the designer to make, so flag it rather than silently patching.

4) Responsive spacing/sizing — STEPPED vs FLUID (this is payload PART F). Decide ONCE per project, ASK at
project start, and NEVER mix the two approaches. Default to stepped. The only genuinely-bad state is "flat"
(no responsiveness at all); stepped is NOT "un-best-practice". Include the trade-off table from the payload,
and the line "preserving the desktop look ≠ hardcoding a desktop pixel."

5) A schema field that NOTHING renders is a PROMISE, not a feature — a field with no consumer is unverified
by construction. When a slice first renders a field, verify its BEHAVIOUR, not just that some text appears;
seed content that actually EXERCISES the behaviour. And when a rich-text schema gains a style/mark/member,
add it to the renderer in the SAME pass — the schema and the renderer are a contract where only one side
fails loudly. (The {token} resolver, rich-text block styles/marks, and image hotspot were three bugs of this
identical shape.)

6) Only show a "read more" when there IS more — and MEASURE it, don't guess with a fixed line-clamp. Cap with
max(floor, 60dvh) using dvh units; beware a pixel ceiling silently defeating the percentage; there is no CSS
"am I clipped?" test, so measure scrollHeight > clientHeight on a ResizeObserver AND on document.fonts.ready;
don't re-measure while expanded; the button is legitimately absent from SSR (so you can't verify it via
curl); animating height needs a measured pixel target at both ends; fade the cut edge with mask-image, not an
overlay div; and pick the animation duration from the interaction's CLASS (a reveal is ~700ms, not the 300ms
hover default).

⬆️⬆️⬆️ END COPYING HERE ⬆️⬆️⬆️

---

## drk-website — BLOCK 2 of 3  ·  images & assets

⬇️⬇️⬇️ START COPYING HERE ⬇️⬇️⬇️

drk-website round, part 2 of 3 — the image & asset pipeline. Same ground rules: generalized pattern only,
verify both halves. Full measured detail is in the attached handoff.

7) Sanity image pipeline — upload full-res, NEVER pre-compress, and MEASURE, don't read the docs. (The
"compress before upload" clause deletion was the urgent fix — but this item is the full measured pipeline,
which is more than just deleting that clause, so still do it.) Settings: q=75, not 80 (choose quality
against the COLD WebP path, not the warm AVIF one); always .auto('format') (the only route to AVIF —
fm=avif returns 400 by design); always fit('max') on width-capped variants (it will upscale past the source
without complaint otherwise); sizes is mandatory on anything not at 100vw; use the framework's Sanity image
loader, not bare next/image (bare next/image double-re-encodes); AVIF is generated async per-URL, so design
for the cold path and never benchmark cold; never upload WebP as a source (a quality issue, not a support
one — a lossy master makes every variant lossy→lossy). Record the docs-vs-reality gaps too: JPEG default is
80 not 75; a bare asset URL still re-encodes JPEG/WebP; PNG + width without auto=format INFLATES the file;
there is no lossless path. Two meta-lessons: on a doc conflict the NEWER Sanity page wins; and for CDN
behaviour you MEASURE — reading a doc is not a verification. Also debunk the invented "Google recommends
~200KB per image" rule.

8) Image size targets come from the COMPONENT — read the component's own `sizes` attribute and aspect box,
not the design file and not a remark someone made. Counter-intuitive rule to include: in a cover-cropped
grid, PORTRAITS are width-bound — a fixed-aspect object-cover slot crops a portrait to landscape, so its
width is what must clear the target. "Is this image big enough?" has no single answer, only a per-slot one.

9) The filename LIES — view the image AND read the ORIGINAL filename; neither alone is enough. Hand-renames
aren't evidence, and the photographer's original filenames carry location facts that renames destroy.
Reusable trick: name the descriptor after WHAT IS IN THE FRAME, never after a location claim, so naming
never blocks on an unsettled taxonomy question.

10) Two asset-handling rules: (a) A rename is a copy — preserve the source extension. .png → .jpg is a lossy
re-encode, not a rename; the naming convention ends with ".{whatever the source already is}". (b) Google
Drive "Shared with me" is NOT synced — it needs Add-shortcut-to-Drive to mount locally; and the Drive MCP
connector is for FINDING and DECIDING only (it returns base64 into context and has no pixel dimensions in
metadata), whereas a synced local path is for READING.

⬆️⬆️⬆️ END COPYING HERE ⬆️⬆️⬆️

---

## drk-website — BLOCK 3 of 3  ·  workflow & session discipline

⬇️⬇️⬇️ START COPYING HERE ⬇️⬇️⬇️

drk-website round, part 3 of 3 — workflow and session discipline. Same ground rules. After this batch,
re-scan the handoff's Pending section once more before closing the skill — a round takes hours and something
may have been added mid-round.

11) Real-device bugs → PRIVATE / INCOGNITO TAB FIRST, ahead of the localhost-vs-LAN check (which becomes the
SECOND move). Add the two-allowlists lesson: the framework's dev-origin allowlist (Next allowedDevOrigins)
AND the CMS's own project CORS allowlist (Sanity, at manage.sanity.io) are different lists with the same
class of symptom — both need the LAN IP, both must be re-added when the IP changes, and both surface in the
dev log, never the browser. Read the dev log before theorizing. (→ references/troubleshooting.md)

12) Post-slice SEO pass — AUTHORING in-slice is NOT the same job as VERIFYING. A slice is done only after an
SEO pass runs against the RENDERED page and findings are fixed or logged. In-slice = AUTHOR (fill the seo
field, emit JSON-LD, write alt, rename images); post-slice = VERIFY (exactly one H1, no skipped levels,
semantic tags, alt present, the metadata function ACTUALLY consuming the seo field, JSON-LD valid, canonical
set, internal links resolving). Cite the two rules it proves: "a ritual that can't fail isn't a check" and
"a schema field nothing renders is a promise." (→ references/workflow.md)

13) CORRECTION to the "Commit cadence" rule (references/session-conventions.md): the verified-clean
precondition gates what the MESSAGE is allowed to CLAIM, not whether to commit. Default to committing — an
uncommitted tree is the only genuinely lossy state, and a local commit is a private, reversible checkpoint. A
breaking bug is fine to commit if the message says so; the forbidden thing is a broken state that LOOKS
finished in the log. This reinterprets (does not delete) the "never commit a known-broken state" line — that
was always about committing broken work SILENTLY. ADD the parallel-sessions rule: don't commit another
session's in-flight work (only the authoring session knows what the message should honestly say) — name the
files, say they look like another session's, and leave them; never phrase it as "shall I commit?". Include
the meta-lesson: three rules shipped 07-17 that one day's use disproved — name a standing rule's load-bearing
premise and ask what it costs to test it.

14) STRENGTHEN the draft/published guidance (references/sanity-studio.md + troubleshooting.md): verifying
against the side you WROTE to is not verifying. _id discipline fixes WHICH document you address but not the
fact that a document is TWO documents. Rules: a mutation must STATE which side it targets (published / draft /
both) as a deliberate choice; for editor-visible content, patch BOTH; always verify BOTH sides. Meta-lesson:
knowing about a trap doesn't stop you hitting it from the opposite direction — the rule must name the
MECHANICAL check ("query both sides").

15) A REMINDER is a claim about the present — verify it before delivering it (the Figma-screenshots reminder
outlived its own subject). This applies to our OWN notes, MANAGER reminders, and handoff items, not just
recalled memories. When you write a reminder, also write its EXPIRY — the condition that invalidates it, not
just the trigger that fires it. (→ references/session-conventions.md)

16) JSX gotcha (small): a {/* */} comment is only valid in CHILDREN position — placing one between `cond ? (`
and its element is a parse error and a 500. Put the comment above the conditional or inside the element.

17) Name a field for the SECTION IT RENDERS, not the shape of its data (Mari's Amenities section is driven by
a field literally called `gallery` because the data was "a pile of images"). This is a prevention item, not a
fix — don't repeat it on the next project. Corollary: the field's code comment outlived the name's accuracy —
more evidence that reasoning belongs in code comments, not Studio-visible text.

18) Don't make the collection URL segment editable — make the SLUG editable (it already is in Studio). One
field that can re-URL the whole site is expensive machinery for a cheap-later problem: a typo 404s every
indexed page, and sitemap/canonical/breadcrumbs all derive from it, whereas doing it later is just renaming a
folder plus one redirect doc. General principle: *editable* and *correct* are different goals — every knob
adds a new way to get it wrong.

STILL-OPEN — do NOT try to fill this round: the components catalog (references/components.md) still has
essentially no named-component catalog, but Mari's own COMPONENTS.md doesn't exist yet as a source to port
from. Leave it open and note it's still the gap.

⬆️⬆️⬆️ END COPYING HERE ⬆️⬆️⬆️

---
---

# 2 ▪ mari-website  (2 blocks — same chat, paste one at a time)

> **ATTACH THIS (before Block 1, keep it attached for both blocks):** `_internal/handoff/mari-website.md`
> (its Pending section carries the full bodies).

**✅ DONE — SKIP:** the boat URL (`/boat` → `/boats/mari` + the `/boats` listing route) and the main
Page/Boat Figma node (`778:8702`) plus open items #5/#7/#8/#9 were done in the urgent fix. What's LEFT is the
residual sub-node cleanup + three unmerged content items below.

---

## mari-website — BLOCK 1 of 2  ·  finish the boat.md node cleanup + settle the gallery facts

⬇️⬇️⬇️ START COPYING HERE ⬇️⬇️⬇️

This is the mari-website skill-update round from the Mari 2026-07-20 audit — part 1 of 2. mari-website owns
copy / SEO / URLs / build-status only. The boat URL and the MAIN Figma node (778:8702) and open items
#5/#7/#8/#9 were already fixed in an urgent pass — SKIP those. Two things remain in references/pages/boat.md:

1) RESIDUAL NODE CLEANUP. The main node was updated to 778:8702, but SIX old 715-series sub-node references
are still scattered through boat.md (and any Amenities 718:5516 reference). Those point at a DELETED design —
sweep them all out and replace with the real current sub-section nodes:
Hero 778:8706 (its sub-nav is Block/SubNav 778:8712) · Overview 778:8747 · Cabins 778:8762 ·
Amenities 778:8845 · LayoutAndSpecs 778:8878 · FAQ 778:8902 · CTA 778:8903 · ContactUs 778:8904 ·
Footer 778:8905. After editing, grep the file to confirm ZERO "715" and no "718:5516" remain.

2) Record the deliberate naming fact: there is NO separate Gallery section — the schema's `gallery` field IS
the Amenities section (a naming mismatch kept on purpose for Mari). And record the settled image/gallery
facts: gallery categories are FIXED and hardcoded with one source of truth (galleryCategories.ts) — The Boat
/ Dining / Diving / Relaxation / Others, derived from the Figma Amenities node 778:8845, deliberately NOT
editor-managed. The gallery has TWO reads: each tab's carousel shows only that category's images, while the
LIGHTBOX shows ALL images ignoring the active tab (looks like a bug, isn't). Image naming convention:
mari-liveaboard-{category}-{nn}-{2-3 words}.{source ext}, with categories boat / dining / diving / relaxation
/ photo (`photo` replaces "Others" — it's SEO-dead in a public CDN URL), and descriptors that name what's IN
THE FRAME, never a deck. Known ceiling: sources are ~1535px web exports with no masters, so thumbnails are
fine but the lightbox caps at ~1500px, not 1920.

⬆️⬆️⬆️ END COPYING HERE ⬆️⬆️⬆️

---

## mari-website — BLOCK 2 of 2  ·  SEO authority pointer + dead-path cleanup

⬇️⬇️⬇️ START COPYING HERE ⬇️⬇️⬇️

mari-website round, part 2 of 2 — two pointer fixes so facts stop being restated in two places (restating is
what lets them drift).

3) SEO authority pointer. mari-core/brand/copywriting/seo.md now exists and is the brand-layer authority for
SEO-copywriting rules, heading-hierarchy philosophy, and entity precision. Wherever mari-website currently
RESTATES any of those, REPLACE the restatement with a pointer to mari-core/brand/copywriting/seo.md. The
three-way split to record: mari-core/brand/copywriting/seo.md owns the rules + heading philosophy + entity
precision; mari-website owns per-page keyword targets + approved per-page heading maps + page-level metadata
(title/description); drk-seo owns implementation (schema / sitemaps / hreflang).

4) Dead-path cleanup. mari-core/brand/voice.md NO LONGER EXISTS — it was replaced by brand/copy-rules.md plus
brand/copywriting/{general,seo,eyebrows-and-headings,channel-adaptation}.md. Repoint any brand/voice.md path
in mari-website (e.g. the "exceptional value" citation) to brand/copywriting/seo.md, or to copy-rules.md
where that's the better fit.

5) UNBLOCKED 2026-07-21 (Adinda confirmed mari-core's locked facts are correct — 3 spaces, sky-deck
naming): fix references/pages/private-charters.md L71 ("sit on the sun deck") and L96 ("a sun deck with
loungers") to "sky deck" — a straight replace is now safe. Also flip the "unverified" flags on oxygen /
first aid / camera rinse tank to confirmed; mari-core's ✅ is right and mari-website should agree.

DO NOT MERGE THIS ROUND (not skill edits): the Testimonials real-content task (that's a build task) and
the footer phone-number conflict (blocked on Serge).

⬆️⬆️⬆️ END COPYING HERE ⬆️⬆️⬆️

---
---

# 3 ▪ drk-seo  (1 block)

> **ATTACH THIS:** `_internal/handoff/drk-seo.md`  (the image-SEO conventions are fully drafted there).

⬇️⬇️⬇️ START COPYING HERE ⬇️⬇️⬇️

This is the drk-seo skill-update round from the Mari 2026-07-20 audit. Four changes:

1) [HIGH] Add image SEO — it's entirely absent today, yet drk-website's vanity-filename chain assumes drk-seo
backs it. Create references/image-seo.md from the attached _internal/handoff/drk-seo.md: "filenames are for
ORGANISATION, alt text is for SEO"; frame-descriptive filenames; never hardcode the extension; and the
vanity-filename fallback chain (seoImageName → originalFilename → slugified alt → omit). Also kill two myths
(the invented "~200KB/image" rule; the debunked "high-DPR tolerates lower quality") and record the
Lighthouse 12→13 bits/px tightening.

2) [MED] references/technical-seo.md — replace the static public/robots.txt example with the Next 16
app/robots.ts MetadataRoute.Robots form (the repo uses app/robots.ts, which also carries the ClaudeBot
AI-crawler policy).

3) [MED] references/technical-seo.md — redirects: the next.config.ts redirects() example diverges from the
DRK standard. Add a one-line cross-ref: "DRK default = proxy.ts + a Sanity redirect document type (see
drk-website)."

4) [LOW] references/technical-seo.md — the first generateMetadata example destructures params without await;
Next 16 dynamic APIs are async-only. Make it `await params`, matching the hreflang example below it.

⬆️⬆️⬆️ END COPYING HERE ⬆️⬆️⬆️

---
---

# 4 ▪ drk-work-tracker  (1 block — brand-new skill)

> **ATTACH THIS:** `_internal/handoff/_payload/drk-work-tracker.md`  (the complete spec — paste/attach the WHOLE
> file; it IS the source of truth for the skill).

⬇️⬇️⬇️ START COPYING HERE ⬇️⬇️⬇️

Author a NEW DRK skill called `drk-work-tracker` from the payload I've attached. The payload is the complete,
canonical source — build the skill directly from it. Preserve these points exactly:

- Frontmatter name/description AS GIVEN — the `description` IS the trigger surface and must fire on: session
bookends (recap / "good morning" / "wrapping up"), "how long did X take", "am I on estimate", "weekly
recap", "log this session", "where did my time go", productivity breakdown.

- It is ONE skill with three MODES, not three skills: `log` (session close — the enforced core flow),
`start` (session open — carry-forward of blockers + unfinished planned items + estimate-accuracy trend), and
`recap`/`week` (on-demand analysis). A bare invocation infers the mode from context.

- Mode `log` steps: derive ELAPSED from git commit timestamps (don't ask); ask the ONE thing only the user
knows = ACTIVE desk time; reconcile Planned → Actual → Unplanned (the unplanned column is the real
productivity signal); note and carry blockers; write the row to the per-repo Session Time Log and update the
day-plan actuals; log estimate accuracy.

- Data model: the per-repo Session Time Log row (Date, Session focus, Elapsed [git-derived], Active [user,
1 question], Planned est / Actual, Unplanned, Blockers). Honest-data boundary: session start is derivable,
but active desk time stays a one-question self-report — never fabricate active time from commit gaps.

- Recap output format (6 sections in order): TLDR; daily breakdown table (flag no-active-data days
explicitly); planned-but-not-done (knowingly-accepted slippage vs a real miss); done-but-not-planned
(aggregated time-sinks); blockers with owners; estimate accuracy.

- It's project-agnostic (the only Mari-specific binding is which file is the running log — MANAGER.md here).
Note that the host-project enforcement rule ("run drk-work-tracker log at close / start at open" as a
non-skippable session-bookend step) is queued separately for drk-website's references/workflow.md and should
POINT at this skill, not duplicate it.

Export the finished skill to Downloads when done so it can be installed locally.

⬆️⬆️⬆️ END COPYING HERE ⬆️⬆️⬆️

---
---

# 5 ▪ mari-core  —  ✅ RETIRED 2026-07-21, no round needed ever

Adinda confirmed 2026-07-21 that mari-core is CORRECT on every item that was queued here (3-space
inventory, sky-deck naming, equipment ✅s; hull colour dropped as a non-issue). `_internal/handoff/mari-core.md`
was deleted — there is nothing to merge, now or later. The only follow-through is folded into the
mari-website block above (its new item 5: fix the two stale "sun deck" lines + flip the equipment flags).

---
---

# 6 ▪ atlas-website  —  ⚠ OPTIONAL, one small gap (flagging, your call)

The task's core run order didn't include atlas-website — its urgent fix (the retired-`faq`-type row) is
already **✅ DONE**. But the audit did find **one** genuine unmerged gap in atlas-website that isn't covered
anywhere else: the FAQ layout variants. It's cheap and cheap-to-defer. Run this block if you'd like atlas
fully current, or skip it — your call.

> **ATTACH THIS (if you run it):** none strictly required; the content is in the prompt. Optional reference:
> `_internal/handoff/atlas-website.md`.

⬇️⬇️⬇️ START COPYING HERE ⬇️⬇️⬇️

Small atlas-website addition from the Mari 2026-07-20 audit. The retired-`faq`-type fix is already done —
this is a different, still-open gap. Add the FAQ section LAYOUT VARIANTS to page-structure/faq.md:

The FAQ section is ONE component with a `layout` field, and TWO values named for what the variant DOES (not
its geometry): `default` (accordion, full width — e.g. a homepage FAQ) and `categorized` (a category list
down the left with an active left-border bar, Q&A accordion on the right; on mobile the categories become
horizontally-draggable chips, like the Destinations pattern — e.g. a boat-page FAQ). Note that this is a
schema field `name` (the expensive-to-change bucket), which is why it was decided before the field was
written. Record one still-open sub-question WITHOUT resolving it: whether the editor picks the variant
per-section, or it's fixed per page type.

Do NOT touch the three items still flagged OPEN in the skill (schema-patterns folder, /destinations index
page, homepage section-order) — those are waiting on Adinda's decision, not a merge.

⬆️⬆️⬆️ END COPYING HERE ⬆️⬆️⬆️

---
---

## After every skill is done — cleanup (don't skip)

- [ ] Each updated/new skill exported to Downloads, installed locally, and confirmed.
- [ ] For every merged item, verify it actually LANDED in the installed reference file (not just the skill's
      changelog) — the "verify against installed files" rule.
- [ ] Strip the merged items out of `_internal/handoff/*.md` so the backlog doesn't re-accumulate (verify what landed
      first). Leave the Serge-blocked mari-core items and the open-decision items IN the handoffs.
- [ ] Then go to `_internal/RESUME.md` STEP 3 (second audit) and STEP 4 (slim CLAUDE.md).
