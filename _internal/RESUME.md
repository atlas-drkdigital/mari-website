# ▶ RESUME HERE — checkpoint 2026-07-24 (staging LIVE + stripped; simple pages done; blog is next)

**New session? Read THIS file, then MANAGER.md's 2026-07-24 checkpoints. Don't re-derive.**

## One-line state
Staging is **live, stripped, and noindexed** at `mari-website-beta.vercel.app`. Shipped today:
`/booking` (Schedule & Rates), `/terms`, `/onboard-pricing` (all live + on staging), the
`_internal/` deployment-boundary mechanism (verified), a site-wide default share image, and TABLE
support in rich text. Working tree clean, GitHub in sync (main + staging).

## The deployment model (NEW today — internalize this)
- **`main`** = internal, everything, the living backup. Never deployed.
- **`staging`** = auto-stripped snapshot of main → the Vercel staging site. `production` added at launch.
- **Promote with `powershell -ExecutionPolicy Bypass -File _internal\scripts\promote.ps1`** (has a
  guard that aborts if any internal file would leak). Vercel tracks `staging`; `main`/preview auto-deploy
  is off via vercel.json. Full rationale + the two silent traps: CLAUDE.md "THE MECHANISM" section.

## ▶ NEXT — the blog, the last big build (Adinda, 2026-07-24)
1. **Blog posts LIST page** (`_internal/PAGE-SPECS.md` #6) — hero + description, filter (search +
   categories + destinations), featured 3-card carousel on mobile, latest grid (homepage card) with
   2-rows-then-show-more. CTA/Contact/Footer.
2. **Blog POST page** (#7, NO breadcrumbs) — slimmer cover-image hero (category+destination clickable
   filters, title, date+author), 3-col content (auto TOC scroll-spy left / rich body middle / sticky
   social+author+newsletter right), recommended articles, CTA/Contact/Footer.
   This is the biggest remaining slice (schema for blogPost/category/author already scaffolded; two
   routes; real components). Clean tree, NO parallel agents during it.

## Carry-forward / open (none blocking blog)
- **Vercel: delete the OLD pre-strip deployments** (dashboard, ⋯ → Delete) — they still store internal
  files from before today's fix. Adinda's dashboard action; do after confirming a good stripped build.
- **🔴 PRE-LAUNCH: remove `SITE_NOINDEX=1`** from Vercel at launch (QA-CHECKLIST blocker). The robust
  host-based mechanism to replace the manual flag is speced in `_internal/handoff/drk-website.md`.
- **Light SEO on simple pages: structurally DONE** (generateMetadata, WebPage+BreadcrumbList JSON-LD,
  one h1, semantic HTML incl. real `<table>`). Only the 🟡 draft seo title/description copy on
  `/terms` + `/onboard-pricing` is editorial (Adinda's to word) — not a code task.
- **Onboard Pricing SEO drafts + the tables** are 🟢 seeded/real; page copy verbatim from live site.
- **12 pre-existing `no-html-link-for-pages` lint errors** (Footer/Nav internal `<a>`) — DEFER to the
  global-chrome slice, which rebuilds Nav/Footer anyway (fixing then rebuilding = wasted work).
- **Global-chrome slice** (LAST, after all pages): Sanity-driven nav + auto-listing footer (auto-includes
  new boats/destinations, hide toggles, curated custom links) + dynamic Destinations mega-menu.
- **Tracking & Integrations** slice: own page in a Settings folder, GTM front + rest behind a toggle,
  env-gated production-only; fold in the `siteSettings.defaultSeo` dead-control fix (Opus-tier).
- Skills handoff round: ~1,700+ lines queued in `_internal/handoff/` (grew today: deployment boundary,
  @sanity/table pinning, noindex mechanism). Unblocked whenever; separate read-only terminal.

## ⚠️ Standing cautions (all learned the hard way today)
- ONE repo writer at a time. Agents `git add -A` swept a parallel session's files into a wrong commit —
  agents must stage EXPLICIT paths; the main session must not run tsc/serve while a code+`npm install`
  agent is active (node_modules churn → false "Cannot find module 'next'" floods).
- `git commit` with quotes breaks in PowerShell → `git commit -F <tempfile>`.
- Verify tsc with `node node_modules/typescript/bin/tsc --noEmit`, NOT `npx tsc` (npx fetched a wrong
  package mid-install).
- Dev server: start UNSANDBOXED (`dangerouslyDisableSandbox`) or /studio 404s; keep it running between
  tasks; clean-restart only after schema changes.
- Kill stray node processes between big agent runs (14 piled up today from repeated restarts).

## 📋 Ready-to-paste kickoff prompt
> Continuing Mari. Read `_internal/RESUME.md` first. Next is the blog: (1) blog posts LIST page then
> (2) blog POST page, per `_internal/PAGE-SPECS.md` #6 and #7. Biggest remaining slice — clean tree,
> no parallel agents. Promote to staging with `_internal/scripts/promote.ps1` when a slice is ready.
> Dev server: check :3000, start unsandboxed if down. Model note: Opus now (was Fable earlier today).
