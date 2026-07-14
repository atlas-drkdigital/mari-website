# MANAGER.md — Mari Liveaboard website (Next.js + Sanity)

Running log for this repo's build. Companion to `CLAUDE.md` (prose rules/active decisions) and
`COMPONENTS.md` (not yet created — see CLAUDE.md's doc-split note). Keep entries terse + dated, per the
static-build repo's own size-discipline convention (archive past ~1,900 lines).

The static-build repo (`../v1-static-homepage/MANAGER.md`) holds the full pre-2026-07-14 history: sprint
planning, brand-dump decisions, page inventory, contracted deliverables. Don't re-read it cross-repo going
forward — this file is now the live one.

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
- [ ] **`page` type's rich text body needs upgrading** — Adinda has an existing MVP page (already solved
  colors + inline images there) she wants matched. Waiting on her to paste that spec in before building —
  don't guess at this shape. Reminder flag: ask her for it next session if she hasn't already provided it.

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
