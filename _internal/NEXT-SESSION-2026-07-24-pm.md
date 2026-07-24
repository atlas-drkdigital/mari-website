# ▶ Handoff — 2026-07-24 midday (Fable session → Opus). READ TOP TO BOTTOM BEFORE ACTING.

## ⚠️ FIRST: the one thing left to finish

### 1. /terms — NOT STARTED, run it fresh (agent died at step 1, wrote NOTHING)
The build agent hit Adinda's session limit after only reading files. Tree was clean; there is no
half-finished work to untangle. **Just run the brief below as a fresh agent.**
- Its brief (re-runnable): /terms, first instance of the generic `page` simple-page pattern. Light hero
  (NO image), bg = deepest existing beige token (Adinda asked "beige 250" which DOESN'T EXIST — started on
  bg-bg-accent/beige-150, flag at QA), H1 split text-editorial-h1 lg:text-display-h1, breadcrumbs light
  palette, `<Nav lightHero />` (first real consumer). Body band bg-bg-accent-secondary (beige-100) with the
  BookingSchedule white overlapping card holding TIER-3 rich text. Then CTA (shared, copy About's usage) +
  Contact + Footer. Content = REAL, fetched verbatim from https://www.mari-liveaboard.com/terms (h2 numbered
  sections, h3 subheads; don't rewrite legal copy). Seed page doc slug 'terms'; sitemap adds generic pages;
  Footer T&C link '#' → '/terms'. Equal visual space nav→title and title→container (Adinda). Mobile per
  conventions incl. -mx-24 full-bleed card.

### 2. Vercel deployment-boundary fix — HALF DONE, finish before anything else deploys
**The .vercelignore Git-integration verification FAILED** (Adinda's Source-tab check, 2026-07-24):
the deployment source contains `_internal/`, CLAUDE.md, AGENTS.md, MANAGER.md, COMPONENTS.md, README.md.
CLAUDE.md's deployment-boundary section predicted exactly this failure mode; the chosen fallback is now
being built: **a stripped, squashed `deploy` branch published by GitHub Actions on every push to
`staging`** — kills BOTH stored internal files AND working commit messages in the dashboard (labels become
"Staging deploy <sha>", neutral author; matters because Adinda says the client will eventually get
dashboard access).
- ✅ ALL CODE-SIDE WORK DONE (commits bc13758 → e5e431a): `.github/workflows/deploy-branch.yml` (strip list
  mirrors .vercelignore — KEEP IN SYNC), `vercel.json` (main/staging auto-deploy off), CLAUDE.md's
  deployment-boundary section rewritten to record the FAILED verification + the new mechanism.
- ✅ `deploy` BRANCH EXISTS AND IS VERIFIED STRIPPED. The Action fired on the staging promotion; its root
  is exactly: .gitignore, eslint.config.mjs, next.config.ts, package*.json, postcss.config.mjs, public,
  sanity.cli.ts, sanity.config.ts, src, tsconfig.json, vercel.json. No _internal/, no CLAUDE.md, no
  MANAGER.md, no AGENTS.md, no COMPONENTS.md, no README.md.
- ✅ "yarl test" RESOLVED — it was NOT an internal doc: `src/app/yarl-test/` was a leftover
  lightbox-library evaluation page shipping as a REAL PUBLIC ROUTE (/yarl-test). Deleted in e5e431a
  (unreferenced; tsc+lint green). Lesson worth keeping: the Source-tab check caught a live-route leak
  the internal-docs audit would never have found.
- ❌ REMAINING — ADINDA'S DASHBOARD STEPS (walk her through, nothing left in code):
  a. Vercel → Settings → Environments → Production → Branch Tracking → `staging` → **`deploy`**.
  b. DELETE every existing deployment (row ⋯ → Delete) — they permanently store the internal files
     AND the working commit messages. This is the actual remediation; the new mechanism only fixes
     deployments made from now on.
  c. Re-run the Source-tab check on the first `deploy`-branch build: must show ONLY build input.
  d. NOTE: the deploy branch's commits are authored "drk-deploy" with neutral "Staging deploy <sha>"
     messages — so the dashboard stops showing working commit messages too (matters once the client
     has dashboard access).

## Vercel state (all set up today, working)
Project `mari-website` (separate from the MVP project — untouched). Domain: mari-website-beta.vercel.app.
Env vars: the 3 Sanity vars + `SITE_NOINDEX=1` (Production). SITE_NOINDEX kill-switch VERIFIED live:
robots.txt disallow-all + noindex meta on all pages (🔴 REMOVE AT LAUNCH — QA-CHECKLIST blocker entry).
Sanity CORS for the domain: Adinda clicked it. Deployment protection: NOT purchasable for production
domains on this plan — mitigation IS the noindex + obscure URL. Staging = production branch (currently
`staging`, becomes `deploy` per above). Promotion model: reset staging to main, force-with-lease.

## Today so far (all committed + pushed on main through 02d9616 + workflow/handoff commit)
About page CLOSED (crew: shadows/zoom/accent positions, square bio-modal carousel — swipe on mobile,
on-image chevrons desktop, portal z-70, full-vw mobile card, 12 crew seeded, View More/Less wired + styled,
About Studio folder, bio counter + photo-size guidance). Nav separator unified. /booking page FULL SLICE
(photo hero: STOCK Pexels pink-beach Komodo 3200px 🟡 marked, overlay 50%, H1 editorial-mobile/display-
desktop, INSEANQ live, FAQ toggles quadruplet, breadcrumbs+JSON-LD+sitemap, links un-hardcoded).
_internal/ refactor + README. Homepage SEO seeded + browser-tab test PASSED (CLAUDE.md caveat closed).
PageOverview heading→body gap 24→32. Dev-server rules: session-start autostart + MUST be unsandboxed
(sandbox 404s /studio — documented in CLAUDE.md).

## Queue after the two blockers
1. Post-slice drk-seo pass on /booking (slice not "done" until it runs — standing rule).
2. Adinda's /terms QA when built, then promote staging for Serge review.
3. Testimonials page (#3 in _internal/PAGE-SPECS.md), FAQ page (#4), blog list+post (longest, day's tail).
4. Queued slices: Tracking & Integrations page (own singleton in a Settings folder; GTM front, rest behind
   toggle; env-gated production-only). Global-chrome slice LAST after all pages (Sanity nav + footer:
   auto-listing footer w/ hide toggles incl. AUTO boats+destinations, curated custom links; nav curated;
   Destinations mega-menu goes dynamic).
5. Skills handoff round: Adinda may have a second read-only coordinator terminal open for it.

## Standing cautions
- ONE repo writer at a time (agent or main session) — scoped commits if unavoidable; agents `git add -A`.
- git commit -m with quotes breaks in PowerShell here → `git commit -F <tempfile>`.
- Real-device bug reports: private tab FIRST (stale-bundle burned us twice today).
- Adinda is switching THIS session to Opus for usage-limit reasons (Fable trial note in memory stands).

## 📋 Ready-to-paste kickoff prompt
> Continuing Mari on Opus. Read `_internal/NEXT-SESSION-2026-07-24-pm.md` top to bottom before acting.
> Two things: (1) build the /terms simple page — the brief is in that file, it was never started, run it
> as a fresh agent; (2) walk me through the three remaining Vercel dashboard steps (point Production at
> the `deploy` branch, delete all old deployments, re-run the Source-tab check) — all the code-side
> deploy-branch work is already done and the stripped branch is verified. Dev server: check :3000, start
> unsandboxed if down.
