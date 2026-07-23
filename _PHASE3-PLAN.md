# _PHASE3-PLAN.md — Slim `CLAUDE.md` to a lean root + path-targeted rules files

**Status:** PLAN ONLY, for Adinda's approval. Nothing executed. No files edited except this one.
**Prepared:** 2026-07-20 (Phase 3 of the docs-hygiene project).

## The problem
`CLAUDE.md` is **1084 lines / 14,337 words / 50 `##` sections** — it loads in full every session
and most of it is war-stories, domain-specific detail, and locked-but-narrow decisions that only
matter during specific kinds of work. Best practice: a **lean root (<200 lines)** carrying only what
matters in nearly every session, with detail modularized into path-/topic-targeted rules files that
load where relevant.

**Guiding cut:** root keeps hard do/don'ts, the stack table + commands, the coordination protocols,
the governing principles that are cited across the whole file, and the two site-wide laws (conventions
supersede Figma; the Tailwind class-name must exist). Everything else MOVES — locked decisions are
preserved verbatim in a rules file, never deleted — with a one-line pointer left in the root.

---

## Refinement — PATH-SCOPE the rules, don't just topic-split them (from Anthropic's steering guide, 2026-07-20)
Source: `claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more`. Key line: *"The more
instructions you provide… the less strictly Claude will follow them, particularly if any contradict"* — which
is exactly this audit's root cause. It also says path-scoped rules are **low context cost** — they *"only
load when that subdirectory is touched."* So the upgrade to the 8-file plan below: where a rules file governs
a specific code area, **tie it to that path** (via a `paths:` scope or a subdirectory `CLAUDE.md`) so it
loads ONLY when that code is being worked on — leaner than 8 always-considered topic files.
- **Path-scopeable** (→ scope to the code they govern): `rules/sanity-images.md` (image helper + image
  components), `rules/sanity-cms.md` (`src/sanity/**`), `rules/tailwind.md` (`*.tsx` + `globals.css`).
- **Better as a subdirectory `CLAUDE.md`**: `rules/figma.md` + the build-a-section conventions → drop under
  `src/components/` so they load when building UI, not on every session.
- **Keep as lean root pointers or skills, NOT path-scoped** (they're session-level, not code-area):
  `rules/workflow.md`, `rules/troubleshooting.md`, `rules/seo.md`. Workflow/recap/bookend procedures are a
  natural fit for a **skill** (the article: procedures belong in skills, not CLAUDE.md).

## Deferred — ONE hook, later (NOT now)
The article's other correction: *"every time X, always do Y"* prose rules "fail under pressure" — hooks make
them deterministic. This repo has several "always do X" rules that keep getting skipped (verify-before-commit,
private-tab-first, the work-tracker at session end). **Worth ONE hook — my pick: run `tsc` before commit** —
the single highest-value can't-be-skipped ritual. **Deferred on purpose:** add it AFTER Phase 3, keep it to
exactly one (a pile of hooks is its own overhead/breakage tax), and only if Adinda wants set-and-forget.

---

## 1. Section-by-section verdicts

Legend: **KEEP** = stays in root (often slimmed). **MOVE →** = relocate the body to the named file,
leave a one-line pointer. **ARCHIVE** = resolved/closed; park in `rules/_archive.md`.
"KEEP-core / move detail" = the rule's one-liner stays in root, the war-story/examples move.

| # | Section title (line) | Verdict | Target | Rationale |
|---|---|---|---|---|
| 1 | Working principle — ship fast, document everything (9) | **KEEP** (slim) | root | Governs every decision in the file; cited by name repeatedly. Trim to the 80/20 rule + the surface-nitpicking standing instruction. |
| 2 | Guiding principle — CMS is a product surface (26) | **KEEP** (slim) | root | Foundational decision rule (editor-intuitiveness wins). Trim the FAQ-remodel precedent to one clause. |
| 3 | MANAGER.md's ACTIVE QUEUE overrides the sprint (43) | **KEEP** (slim) | root | Coordination protocol read before planning any session. Trim to the ruling + "queue wins, log deviations." |
| 4 | Skills to load this session (53) | **KEEP** | root | Needed every session; already current (mari-project removal noted). Keep whole. |
| 5 | Stack — verified live (72) | **KEEP** | root | Concise version table, referenced constantly. Keep whole. |
| 6 | Next.js 16 conventions — deltas from drk-website (83) | **MOVE →** | `rules/stack.md` | Applies when writing routes/config, not every session. Pointer in root. |
| 7 | Sanity — embedded Studio (92) | **MOVE →** | `rules/stack.md` | Studio setup/localization-plugin detail; schema-time only. |
| 8 | Navigation — dynamic Destinations mega menu (97) | **MOVE →** | `MANAGER.md` (queue) | A deferred "come back and wire this" task, not a standing rule — belongs in the active/gated queue. |
| 9 | Rendering model — `cacheComponents` OFF (105) | **MOVE →** | `rules/stack.md` | Config decision record; consulted at next.config/launch decisions only. |
| 10 | Styling (111) | **KEEP-core / move detail** | `rules/tailwind.md` | Keep the one-liner (Tailwind v4 `@theme`, no custom CSS / no `@apply`); move the "theme.css not yet ported" note. |
| 11 | Building a section: ASK FOR FIGMA LINK + SCREENSHOT FIRST (114) | **KEEP-core / move detail** | `rules/figma.md` | The rule is a hard standing do — keep 2 lines in root; move the boat-page war-story + reference-impl list. |
| 12 | 🔴 CONVENTIONS ALWAYS SUPERSEDE FIGMA (136) | **KEEP-core / move detail** | `rules/figma.md` | This is a named site-wide LAW — keep the ruling + the practical test in root; move the 4 proof examples. |
| 13 | Tailwind: THE CLASS NAME MUST EXIST (173) | **KEEP-core / move detail** | `rules/tailwind.md` | Named site-wide rule — keep the rule + the 3 traps summary + the grep-to-check in root; move the "wrong-looking page" corollary. |
| 14 | A schema field that nothing renders is a promise (207) | **KEEP-core / move detail** | `rules/sanity-cms.md` | Keep the one-line principle (verify BEHAVIOUR when a slice first renders a field); move the 3 bug examples. |
| 15 | Content modeling — Portable Text tiers (225) | **MOVE →** | `rules/sanity-cms.md` | Schema-time reference; only relevant during schema passes. |
| 16 | Images — every image has an editable alt field (232) | **MOVE →** | `rules/sanity-cms.md` | Hard rule but image-schema-specific. Pointer in root; also queued for drk-website skill. |
| 17 | Sanity image pipeline — UPLOAD FULL-RES (265) | **MOVE →** | `rules/sanity-images.md` | ~170 lines of measured detail — the single biggest win. Only relevant when uploading/serving images. |
| 18 | Image size targets come from the COMPONENT (433) | **MOVE →** | `rules/sanity-images.md` | Image-audit detail. |
| 19 | The filename LIES. View before naming (449) | **MOVE →** | `rules/sanity-images.md` | Image-naming discipline. |
| 20 | Renaming must NEVER re-encode (469) | **MOVE →** | `rules/sanity-images.md` | Image-handling rule. |
| 21 | Google Drive: "Shared with me" is NOT synced (476) | **MOVE →** | `rules/sanity-images.md` | Image-sourcing mechanics. |
| 22 | Galleries — array-on-the-page (490) | **MOVE →** | `rules/sanity-cms.md` | Gallery schema pattern. |
| 23 | FAQ section layout variants — default/categorized (520) | **MOVE →** | `rules/sanity-cms.md` | Schema field-name decision; consult when building FAQ. |
| 24 | An empty tab/section doesn't render — hide it (533) | **MOVE →** | `rules/sanity-cms.md` | Render rule for empty content. |
| 25 | Eyebrow fields — toggle-to-reveal pattern (554) | **MOVE →** | `rules/sanity-cms.md` | Schema field pattern. |
| 26 | Build approach — skeleton-first, THEN vertical slices (563) | **MOVE →** | `rules/workflow.md` | Big process section. Keep a 1-line pointer (slices + full-wire-per-slice) in root. |
| 27 | Post-slice SEO pass — run `drk-seo` (625) | **MOVE →** | `rules/seo.md` | SEO process + the homepage-seo-gap. Pointer in root. |
| 28 | Studio form section headers — fieldsets (668) | **MOVE →** | `rules/sanity-cms.md` | Studio-form convention. |
| 29 | Load real/placeholder content into every schema (684) | **MOVE →** | `rules/workflow.md` | Review-enablement process rule. |
| 30 | Decluttering the editing form (690) | **MOVE →** | `rules/sanity-cms.md` | Studio-form organization pattern. |
| 31 | Required fields must show an upfront marker (708) | **MOVE →** | `rules/sanity-cms.md` | Studio rule + pending build task (cross-ref MANAGER queue). |
| 32 | Studio staleness — restart clean + verify (717) | **MOVE →** | `rules/workflow.md` | Studio-review procedure. |
| 33 | Session length — offer a fresh session at boundaries (727) | **MOVE →** | `rules/workflow.md` | Session-management protocol. |
| 34 | Localization Studio UX — fix at i18n-build time (746) | **MOVE →** | `rules/sanity-cms.md` | Deferred (i18n is a paid add-on); park with schema/Studio rules. |
| 35 | Sanity Studio editor-organization — defer to last (763) | **MOVE →** | `rules/sanity-cms.md` | Studio-polish sequencing. |
| 36 | Doc split (766) | **KEEP** (slim) | root | Map of the companion docs (_SCHEMA-SPECS, _CONTENT-STATUS, etc.) — useful every session. Compress to a tight list. |
| 37 | Local-only files — underscore prefix (769) | **KEEP** (slim) | root | Repo convention touched whenever creating scratch files. Trim to 2 lines. |
| 38 | Daily recap template (772) | **MOVE →** | `rules/workflow.md` | Only needed when Adinda asks for a recap. |
| 39 | Commit cadence (800) | **MOVE →** | `rules/workflow.md` | Keep a 1-line pointer in root (default-to-committing, local-only). Move the full amended rationale. |
| 40 | Session bookend protocol (852) | **MOVE →** | `rules/workflow.md` | Start/end-of-session procedure incl. work-tracker. Pointer in root. |
| 41 | Review requests must call out mobile (921) | **MOVE →** | `rules/workflow.md` | Short standing rule for review asks. |
| 42 | Real-device testing: PRIVATE TAB FIRST (927) | **MOVE →** | `rules/troubleshooting.md` | Debugging procedure. |
| 43 | `allowedDevOrigins` for LAN testing (969) | **MOVE →** | `rules/troubleshooting.md` | Debugging/env config. |
| 44 | No AI-tool authorship traces in the public build (977) | **KEEP-core / move detail** | `rules/troubleshooting.md` (pre-launch) | Keep the standing constraint (repo stays private, no AI traces) in root; move the checklist detail + git-history note. |
| 45 | Colour names: ALWAYS confirm the hex (993) | **MOVE →** | `rules/tailwind.md` | Colour-token discipline; consult when touching colours. Composes with the class-must-exist rule. |
| 46 | Check the docs BEFORE debugging (1018) | **KEEP** (slim) | root | Cheap meta-rule that applies every debugging session; 2 lines. |
| 47 | A verification ritual only counts if it can fail (1030) | **KEEP** (slim) | root | Foundational meta-principle cited across the file (SEO, Studio, harness). Keep the principle; move the Structure-Builder example. |
| 48 | Icons are ASSETS, never font glyphs (1039) | **MOVE →** | `rules/figma.md` | Component/asset-build detail + harness lesson (the harness lesson generalizes the "verification ritual" principle already kept in root). |
| 49 | Session discipline (carried over) (1071) | **KEEP** (slim) | root | A few durable one-liners (verify compiled CSS, tag `[DRK]`, archive MANAGER). Drop the retro item (dup of bookend → workflow.md). |
| 50 | Commands (1083) | **KEEP** | root | Tiny, needed constantly. Keep whole. |

**Tally:** KEEP (whole or slim) **15** · MOVE **34** · ARCHIVE-eligible material **1** (the Drive-masters
"RESOLVED — do not re-open" block inside #17; travels with `sanity-images.md`, or split to
`rules/_archive.md`). Every MOVE preserves the locked decision verbatim in its target file.

---

## 1b. 🔑 ROUTING RULE — where a fact lives, and what supersedes what (locked 2026-07-20, Adinda)

**This governs Phase 3's every move.** Adinda's question: *"how to handle what goes to CLAUDE.md and what
lives inside skills… to make sure there's no overlap."*

### The precedence chain — TWO layers, not three
> **`CLAUDE.md` + `rules/*.md` (project) — SUPERSEDES → skills (portable)**

**`_handoff/*.md` is deliberately NOT in the chain.** It is an **OUTBOX, not a knowledge layer.** It exists
only because there is no live bridge from this repo to the chat-side skills — a symptom of a sync gap, not
a place truth lives. Making it authoritative would institutionalise the workaround: it stops being a queue
that empties and becomes a second CLAUDE.md read every session (`_handoff/drk-website.md` is already 57KB).
**Write-only. Empties on merge. Never consulted to decide what is true.**
→ **Therefore: DELETE CLAUDE.md's "read every file in `_handoff/*.md` before relying on a skill's content as
current" line during Phase 3.** That line is a staleness patch; the fix is merging promptly so there is
nothing to patch.

### The placement test — ONE question
> **"Would this be true on another DRK project?"**

| Answer | Lives in | Example |
|---|---|---|
| **Yes — portable** | the **skill** | image pipeline, incognito-first, Next 16 conventions, workflow |
| **No — this project only** | **`CLAUDE.md` root** | stack versions, `/boats/mari`, Mari's tokens, `kb8eim50` |
| **Yes, but we do it differently here** | **`CLAUDE.md`** as a one-line **override that NAMES what it overrides** | — |
| **Project detail / war stories / measurements** | **`rules/*.md`** | boat-page rebuild story, the CDN measurements |

**A fact lives in exactly ONE place.** The ~19 sections currently tagged "Skill-wide — queued for
`drk-website`" are duplicates-in-waiting: once merged they **LEAVE** CLAUDE.md rather than sitting in both.

### ⚠️ The ONE exception — locked decisions keep a one-line tripwire in root
**Anything marked "locked <date>, Adinda" keeps a ONE-LINE assertion in `CLAUDE.md` even after the skill
carries the full detail.** Format: the claim + a pointer (`"conventions supersede Figma — detail in
drk-website"`).

**Why — this is not hypothetical, it is the 2026-07-20 root cause.** `drk-website`'s Figma rule said the
**opposite** of the locked "conventions always win" and silently produced the over-literal boat page. Had
that rule lived ONLY in the skill, there would have been no local record to catch the contradiction
against. **The one-liner is a tripwire, not duplication.**

### Consequence for this plan — a THREE-way split, not a two-way move
The section-by-section verdicts in §1 currently route everything to local `rules/*.md`. Under this rule each
section routes three ways: **portable → skill** · **project detail → `rules/`** · **locked claim → root
one-liner**. **This is why the skill round + 2nd audit must run BEFORE Phase 3** — content cannot be routed
into a skill that has not been updated yet, and the audit is what reveals which sections are already merged.

---

## 2. Proposed `rules/` directory layout

Place under repo root as `rules/` (committed, not underscore-prefixed — these are real project docs).
Each file opens with a one-line "load this when…" applicability note.

| File | Holds (from sections) | Load when… |
|---|---|---|
| `rules/stack.md` | #6 Next 16 conventions, #7 Sanity embedded Studio, #9 `cacheComponents` | Touching `next.config.ts`, routes, proxy/redirects, Studio scaffolding, or infra/rendering decisions. |
| `rules/figma.md` | #11 ask-for-link workflow (detail), #12 conventions-supersede-Figma (4 examples + refs), #48 icons-as-assets | Building any page section from a Figma node. |
| `rules/tailwind.md` | #10 Styling detail, #13 class-must-exist (corollary/detail), #45 colour-names-confirm-hex | Writing component styles / choosing tokens, spacing, type ramps, colours. |
| `rules/sanity-cms.md` | #14 examples, #15 Portable Text tiers, #16 image-alt, #22 galleries, #23 FAQ variants, #24 empty-tab render, #25 eyebrow toggle, #28 fieldsets, #30 decluttering, #31 required marker, #34 localization UX, #35 editor-org-defer | Any schema pass or Studio structure/form work. |
| `rules/sanity-images.md` | #17 image pipeline (full), #18 component-sizing, #19 filename-lies, #20 no-re-encode, #21 Drive sourcing | Uploading, naming, sizing, or rendering Sanity images. |
| `rules/workflow.md` | #26 build approach/slices, #29 load-content, #32 Studio staleness, #33 session length, #38 daily recap, #39 commit cadence, #40 session bookend + work-tracker, #41 mobile-review, #49 retro item | Session start/end, planning, committing, reviewing, recaps. |
| `rules/seo.md` | #27 post-slice SEO + in-slice SEO + homepage-seo-gap | Running a page's SEO pass (in-slice author + post-slice verify). |
| `rules/troubleshooting.md` | #42 private-tab-first, #43 `allowedDevOrigins`, Sanity CORS, dev-log diagnostic, #44 pre-launch/no-AI-traces checklist detail | A bug is reported (esp. device/env-specific), or a pre-launch check. |
| `rules/_archive.md` *(optional)* | Genuinely-closed notes (e.g. the Drive "no masters — do not re-open" resolution) if not kept inline in `sanity-images.md` | Rarely — historical reference only. |

### 🔴 ACTIVATION — CORRECTED 2026-07-20, verified against the official Claude Code docs
**The layout above said `rules/` at the REPO ROOT. That is WRONG and would have silently failed.** A bare
root-level `rules/` folder is **not discovered by anything** — the content would have moved out of
always-loaded context into files nothing opens, i.e. we'd have "slimmed" CLAUDE.md by *losing* the rules.
**Caught before Phase 3 started, at Adinda's direct question "is there anything in this round that might
break our process and have to be redone?" — this was it.**

**Use `.claude/rules/` with `paths:` frontmatter.** This is the documented, officially-recommended pattern
for exactly this goal.

```markdown
---
paths:
  - "src/sanity/**/*.ts"
  - "src/sanity/lib/image.ts"
---

# Sanity image pipeline
[the full ~170 lines]
```

**Mechanics (all doc-confirmed):**
- `.claude/rules/**.md` is discovered **recursively**, automatically.
- A rule **WITHOUT** `paths:` loads **at launch, every session**, same priority as `CLAUDE.md`. Use this
  only for rules that genuinely always apply.
- A rule **WITH** `paths:` loads **only when Claude reads a matching file** — automatic, not opt-in, no
  pointer line required. This is the context win.
- ⚠️ **`@path` imports do NOT work for this.** Imported files are expanded into context **in full at
  launch** — organising content that way reduces nothing. (`CLAUDE.md` already imports `@AGENTS.md`; that
  is fine, it's 5 lines.) **Do not "slim" by converting sections into `@` imports.**
- Nested `CLAUDE.md` in a subdirectory is a weaker alternative (directory-scoped, not glob-scoped).

**So each `rules/*.md` in the table above becomes `.claude/rules/*.md` + a `paths:` block.** Suggested
globs: `sanity-images.md` → `src/sanity/**`, image files · `tailwind.md` → `**/*.tsx`,
`src/app/globals.css` · `figma.md` → `src/components/**` · `sanity-cms.md` → `src/sanity/**` ·
`stack.md` → `next.config.ts`, `src/app/**`.

**Judgement call when routing:** `workflow.md`, `troubleshooting.md` and `seo.md` are **not** naturally
path-scoped (they apply at session start/end, when a bug is reported, or per page-slice). Options: leave
them un-scoped (always loaded — but then they don't reduce context), scope them loosely, or keep only
their one-liners in root. **Decide per file during Phase 3; don't blanket-scope.**

**Docs:** `code.claude.com/docs/en/memory.md` — "Organize rules with `.claude/rules/`" + "Path-specific
rules" + "Import additional files".

---

## 3. Estimated resulting root-file size

| Bucket | Approx lines |
|---|---|
| H1 header + intro + `@AGENTS.md` | ~8 |
| #1 Working principle (slim) | ~8 |
| #2 Guiding principle CMS (slim) | ~6 |
| #3 MANAGER queue overrides sprint (slim) | ~4 |
| #4 Skills to load | ~12 |
| #5 Stack table | ~11 |
| #10 Styling one-liner | ~2 |
| #11 Ask-Figma-first (core) | ~3 |
| #12 Conventions supersede Figma (law + test) | ~12 |
| #13 Tailwind class-must-exist (rule + 3 traps + grep) | ~14 |
| #14 Schema-field-promise (principle) | ~2 |
| #36 Doc split (slim list) | ~9 |
| #37 Local-only files (slim) | ~3 |
| #44 No-AI-traces / repo-private (core) | ~5 |
| #46 Check docs before debugging | ~2 |
| #47 Verification ritual principle | ~3 |
| #49 Session discipline (slim) | ~4 |
| #50 Commands | ~7 |
| **New "Rules files — load where relevant" pointer block** (8 one-liners + heading) | ~12 |
| Section spacing / blank lines | ~25 |
| **Estimated total** | **≈150–170 lines** |

Comfortably under the 200-line target, down from 1084 (~85% reduction). Word count drops from
~14.3k to roughly ~2k in root; the remaining ~12k is preserved intact across the eight rules files.

---

## 4. Risks / careful-with-these

1. **Do not delete locked decisions — MOVE verbatim.** Many sections say "locked <date>, Adinda" and
   several are queued for the `drk-website` skill via `_handoff/*.md`. The handoff files reference
   these by content; keep the text intact in the target file so the skill-merge round still finds it.
   Preserve the "Skill-wide — queued for `drk-website`" trailers on each moved block.

2. **The two named LAWS must stay legible in root.** "🔴 CONVENTIONS ALWAYS SUPERSEDE FIGMA" and
   "THE CLASS NAME MUST EXIST" are cited by other rules and by Adinda directly. Slim them, but the
   ruling + the practical test must remain in root, not just a pointer — a pointer alone would let a
   session write a wrong value before it thinks to open the file.

3. **Cross-references between sections.** Several sections cite each other ("see the off-scale rule
   below", "same principle as full-wire-per-slice", "verification-ritual principle applies"). After
   the split these become cross-file links — audit every "below/above/see" reference during execution
   and repoint it to the new file, or the breadcrumbs break.

4. **`#44` (no-AI-traces) has a live standing condition** (repo stays private, revisit if that changes)
   plus a resolved historical note (git trailers OK). Split carefully: the *constraint* stays in root;
   only the *checklist detail* and the resolved git-history note move.

5. **`#31` required-field marker and `#8` nav mega-menu are also pending TASKS**, not just rules. When
   moving them to a rules file, make sure the corresponding MANAGER.md active-queue/gated entry still
   exists (or add one) so the to-do isn't lost among the reference material.

6. **`MANAGER.md` currently points at CLAUDE.md as "prose rules/active decisions."** Update MANAGER.md's
   header + the Doc-split section (#36) so both describe the new `rules/` layer — otherwise the map is
   stale the moment the split lands.

7. **Currency check while moving.** A few blocks contain "not yet built / not yet ported / not yet
   wired" status (Styling #10, image-alt #16, `sanityImageProps` in #17). These are status, not rules —
   verify against the current code when moving, and where a status has since changed, flag it rather
   than copying a stale claim forward. (Out of scope for this plan; noted for the execution pass.)

8. **This is a big single-commit diff.** Recommend executing per-file (one rules file + its pointers at
   a time) with `tsc`/`eslint` unaffected (docs-only), committing incrementally per the commit-cadence
   rule, so the move is reviewable and reversible.
