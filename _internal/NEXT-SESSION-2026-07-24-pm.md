# ▶ Handoff — 2026-07-24 midday (Fable session → Opus). READ TOP TO BOTTOM BEFORE ACTING.

## ⚠️ FIRST: two in-flight things this session could not finish

### 1. A /terms build agent may have DIED mid-work when the session ended
A background agent was building the Terms & Conditions slice. **Check `git status` + `git log --oneline -5`:**
- If a commit like "terms slice / simple page" landed on main → it finished; verify /terms renders, then proceed.
- If the tree has UNCOMMITTED changes (src/app/[slug]/, SimplePageHero, queries.ts PAGE_QUERY, page schema,
  seed-terms script) → the agent died mid-arc. Review what's there: finish + verify (tsc/lint//terms 200) and
  commit honestly, or `git checkout -- .` and re-run the slice fresh.
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
- ✅ DONE + committed: `.github/workflows/deploy-branch.yml` (strip list mirrors .vercelignore — keep in sync).
- ❌ TODO (in order):
  a. Create `vercel.json` at root: `{ "git": { "deploymentEnabled": { "main": false, "staging": false } } }`
     — stops Vercel uploading unstripped branches; `deploy` stays enabled by omission. Commit.
  b. Update CLAUDE.md "Deployment boundary" section: verification FAILED 2026-07-24 (Git integration uploads
     the whole repo); mechanism is now the deploy branch; .vercelignore kept for CLI-only. Keep history.
  c. Promote staging: `git checkout staging; git reset --hard main; git push --force-with-lease` (the
     LOCKED promotion model — staging = exact snapshot of main, empty trigger commits get discarded).
     This fires the Action → `deploy` branch appears on GitHub.
  d. Walk Adinda through (her side): Vercel → Settings → Environments → Production → Branch Tracking →
     change `staging` → **`deploy`**. Then DELETE all existing deployments (each row ⋯ → Delete) — they
     permanently store the internal files. Then re-run the Source-tab check on the first deploy-branch
     build: must show ONLY build input.
  e. 🔍 OPEN QUESTION for Adinda: she saw a "yarl test" file in the Source tab — no `*yarl*` file exists in
     the repo today (globbed). Ask her for the exact filename/path she sees. If it's under _internal/ it
     dies with the deploy-branch fix anyway; if it's in public/ or src/ it needs hunting.

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
> Continuing Mari on Opus. Read `_internal/NEXT-SESSION-2026-07-24-pm.md` top to bottom before acting —
> two in-flight items: (1) a /terms build agent may have died mid-work, check git status/log and
> finish-or-rerun per the handoff; (2) finish the Vercel deploy-branch fix (vercel.json + CLAUDE.md update +
> promote staging + walk me through pointing Vercel at `deploy` and deleting old deployments — the
> .vercelignore verification FAILED and internal files are stored on Vercel). Also ask me for the exact
> "yarl test" filename I saw in the Source tab. Dev server: check :3000, start unsandboxed if down.
