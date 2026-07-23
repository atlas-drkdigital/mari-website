# FAQ restructure — ✅ DONE 2026-07-16. This file is now the RECORD, not a brief.

_The build brief that used to live here has been executed in full and verified. Kept as the record of what
was decided and what's still open, per Adinda's ask to redo/consolidate this once FAQ was done. **Next task
is `_NEXT-SESSION-toggles-theme.md`** (section toggles + auto-hide + theme), then the destination page slice._

## What shipped (all verified: tsc + eslint + schema validate 0/0 + GROQ query-back + clean restart)
- **`faqSection`** — one reusable object (`title` + `questions[]` of `{question, answer, isFeatured}`), used
  inline by `faqGeneral`, `destination`, and `boat`.
- **General FAQ** — `faqGeneral` singleton, sidebar label "General FAQ", categories **Payment & Booking /
  What's Included / Others**, `seo` field added. Cross-cutting questions only.
- **Destination** — inline `faqSections` (Diving / Travel / Others) + signpost note.
- **Boat** — inline `faqSections` (General Information) + signpost note.
- **`isFeatured`** ("Feature on homepage") on General + boat, **hidden on destination**. 8 featured drive the
  homepage, General first, capped at 10 in the frontend as a safety net.
- **`faq` type RETIRED** — Komodo's 6 migrated to `destination-komodo.faqSections`, all 7 docs deleted, type
  gone from index + structure, file deleted. ONE FAQ entry in the sidebar.
- **Re-seeded answer-first** from `mari-core` — `_internal/scripts/seed-faq.ts`, idempotent, safe to re-run.
- **Quick fixes done** (skip them in the toggles session): `whyUsItems` min 2→1; SEO double-nesting fixed
  site-wide across 8 types.

## Still open — carry these forward
- **⭐ Adinda's Studio review of FAQ v2** — not yet done. What to look at: `_internal/QA-CHECKLIST.md` (incl. mobile).
- **⚠️ Commercial figures unverified** — the General FAQ answers quote deposit/cancellation/park+fuel fees/
  single supplement, sourced from `mari-core`'s self-declared non-evergreen `commercial.md` (last verified
  2026-06-09). **Verify with Serge before launch.** Detail: `_internal/CONTENT-STATUS.md`.
- **Komodo's "What is included in a Mari trip?" is a duplicate** of the What's Included the destination page
  will pull from General FAQ. Migrated per the brief; **decide in the destination slice** (one-item delete).
- **Stable identity for cross-page pulls** (so renaming a shared General-FAQ category can't break another
  page's composition) — **deferred to the destination slice**, where the pull is actually implemented. This
  was always the plan, not an oversight.
- **`/faq` page frontend doesn't exist** — `faqGeneral.seo` is empty and the homepage "Read More" points at
  `#` until it's built. Not in any current brief; needs scheduling.
- **Per-page FAQ render work** (page-scoped `FAQPage` JSON-LD, `<details>/<summary>` + `<h3>`, `#faq-slug`
  anchors) folds into each page slice as it's built — schema-side is done, render-side isn't.
- **Homepage retroactive SEO pass** (FAQ JSON-LD + semantic markup on the already-built homepage) — still
  outstanding, was noted in the original brief and is not part of the toggles session.

## Skills backlog this created (chat-side, Adinda runs the round)
- **`mari-website`** — `references/pages/faq.md` is stale **3 ways**: says `is_featured` is dropped (it's
  reinstated), lists the old 5-category hub, and describes the retired `faq` doc type. See
  `_internal/handoff/mari-website.md`.
- **`atlas-website`** — its FAQ two-taxonomy split spec is superseded by the compose-at-render model. See
  `_internal/handoff/atlas-website.md`.
- **`drk-website`** — 2 new items: the "Feature on homepage" pattern + its decision rule, and GROQ `+`
  null-poisoning. See `_internal/handoff/drk-website.md`.
