# ▶ RESUME HERE — checkpoint 2026-07-23 evening (ABOUT LIVE through QA-2; refactor gated next)

**New session? Read THIS file, then MANAGER.md's two 2026-07-23 checkpoints (afternoon = About,
morning = Private Charters). Don't re-derive.**

## One-line state
`/about` is **LIVE and through QA rounds 1–2** (AboutHero 800px-exception, PageOverview, WhyUs,
AboutCrew modal bios, CTA, `testimonialsSection` singleton, Contact/Footer; post-slice drk-seo pass
RAN and passed). `/private-charters` complete + copy v2 seeded. Site-wide SEO fixes shipped
(`JsonLd` escaped injection path everywhere, BreadcrumbList, sitemap now lists ALL routes).
Working tree clean, **GitHub in sync** (push-everything convention locked 2026-07-23).

## ▶ NEXT — ORDER SET BY ADINDA 2026-07-23 evening. Do these IN THIS ORDER:
1. **FINISH the About page.** Adinda's round-2 review is pending (desktop → mobile → Studio: About
   doc, Testimonials Section, no-H1 menu check) and **she has MORE small refinements queued** —
   collect them, apply, re-QA. Also flagged: "Mari liveaboard" lowercase-l in her edited ¶
   (possible typo, seeded verbatim — ask).
2. **Commit the About fixes** (normal checkpoint commit + push).
3. ✅ **DONE 2026-07-24 — the `_internal/` root-cleanup refactor executed** (this file now lives at
   `_internal/RESUME.md`; content tracking verified, AGENTS.md amended, ignore files rewritten,
   `_internal/README.md` created — see MANAGER.md's 2026-07-24 checkpoint). Original item:
   **🔵 THEN the `_internal/` root-cleanup refactor — BEFORE starting any other page.** Full spec:
   MANAGER.md ACTIVE QUEUE gated item (queued 2026-07-23). Summary: `git mv` every root `_*` entry
   into `_internal/` (inner underscores dropped); `CLAUDE.md`/`AGENTS.md`/`MANAGER.md`/
   `COMPONENTS.md` STAY at root; reference sweep + final stale-path grep; simplify `.gitignore` +
   `.vercelignore` to `/_internal/`-based rules. ⚠️ **`content/` moves too** (Adinda's re-cut: NO
   stray folders at root) — `git mv content _internal/content` so it STAYS TRACKED (the `ad06118`
   near-loss was about losing tracking, not location), verify with `git ls-files`, **amend
   AGENTS.md's "do not move content/" paragraph in the same commit** (else Codex recreates it),
   and keep ignored scratch separate as `_internal/content-scratch/`. Full spec: the gated item.
   ~30–45 min.
4. **Only then, new pages** per `_internal/PAGE-SPECS.md`: Schedule & Rates (#2), Testimonials page (#3),
   FAQ page (#4) — FAQ/Testimonials were displaced from Jul 23's slot by About (named sprint
   deviation). Jul 24 staging-push re-cut is due in the AM — say it out loud, don't absorb.

## ⚠️ STANDING STATE
- Dev server likely running on :3000 (LAN 192.168.0.101 — Sanity CORS for LAN still needs Adinda's
  one-click, see CLAUDE.md real-device section). Don't clean-restart unless schema changed.
- **Deployment boundary is documented but UNVERIFIED**: `.vercelignore` keeps internal docs off
  Vercel; Adinda will test-verify via the deployment Source tab on the first few real deploys
  (CLAUDE.md "Deployment boundary" section). Nothing to do until Vercel is connected.
- Seed LAWS (MANAGER morning checkpoint): patches must hit `drafts.*` too when a draft exists;
  CLI client is RAW perspective — reference-building seed queries MUST filter
  `!(_id in path("drafts.**"))`.
- Background build agents died silently this afternoon (~40 min) — agent silence ≠ progress;
  check task status, don't trust the quiet.

## Open items / carried decisions
- 🔴 Content: 4 Pexels placeholder crew on About · [DRAFT] testimonials · benefits photos #2/#3
  (charters) · charters overview below-map filler · SEO title/desc drafts 🟡.
- JSON-LD prefill wiring for EVERY page type (Adinda's call) + one-lightbox-per-field rich-text
  gallery (~30 min; test material in charters overview body) — both still queued.
- Homepage + boat retroactive per-section QA (queued 2026-07-22).
- Serge: Komodo feedback round · itinerary seasons 🔴 · /charters vs /private-charters.
- `destination.order` retirement · boat-nusa-test deletion (awaits boats-stepper approval).
- Skills handoff round: ~1,500+ lines in `_internal/handoff/` and growing (now includes deployment-boundary
  + sentence-case entries) — deferred by Adinda, unblocked whenever.
- Session time-log: the afternoon block's log runs at actual close (checkpoint ≠ close).

## 📋 Ready-to-paste kickoff prompt
> Continuing Mari. Read `_internal/RESUME.md` first — the NEXT list is ordered and locked by Adinda:
> (1) finish the About page (her round-2 review + queued small refinements), (2) commit, (3) run
> the `_internal/` root-cleanup refactor from MANAGER.md's gated item BEFORE any new page —
> EVERYTHING moves, `content/` included (git mv, stays tracked; amend AGENTS.md in the same
> commit) — then (4) Schedule & Rates / Testimonials / FAQ pages per
> _internal/PAGE-SPECS.md. Dev server should be running; don't clean-restart unless schema changed.
> Model note: Fable trial ongoing (memory: user-fable-model-test).

## Session log
2026-07-23 (morning, ~3h active): Private Charters full slice + QA + shared-section singletons +
Studio reorg. (afternoon): About page built inline + QA 1–2, site-wide SEO fixes, charters copy
v2 seeded, content/ recovery. (terminal session, parallel): 130-commit push + push-everything
convention, `.vercelignore` + deployment-boundary docs, underscore convention amended,
`_internal/` refactor queued as gated item. Full detail: MANAGER.md 2026-07-23 checkpoints.
