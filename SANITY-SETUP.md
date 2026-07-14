# SANITY-SETUP.md — how this repo connects to Sanity

Written 2026-07-14 so this doesn't need to be re-derived from memory. Companion to `CLAUDE.md` (stack
decisions) and `MANAGER.md` (session log).

---

## Architecture: this build is fully isolated from the live MVP

There are **two separate Sanity projects**, on purpose — zero shared state, so nothing done in this repo
can ever touch the currently-live site:

| | Project name | Project ID | Repo | Status |
|---|---|---|---|---|
| Live MVP | MARI Liveaboard MVP | `sjkpkyaw` | (separate, pre-existing) | Live at mari-liveaboard.com — do not touch from this repo |
| This rebuild | Mari Liveaboard | `kb8eim50` | `atlas-drkdigital/mari-website` (this repo) | Dataset: `production` (fresh, empty) |

Decision made 2026-07-14: Adinda wants a full new deployment (new repo + new Sanity project + a new Vercel
project at deploy time) rather than reusing the MVP's project/dataset, since the rebuild's content model is
substantially different. This repo's `.env.local` / `sanity.cli.ts` point at `kb8eim50` only — there is no
config anywhere in this repo referencing `sjkpkyaw`.

---

## Where things live

- **Sanity dashboard for this project:** https://www.sanity.io/manage/project/kb8eim50
- **Login:** email/password (not Google/GitHub) — account `atlas@drkdigital.studio`
- **Env vars:** `.env.local` (gitignored — confirmed `.env*` is in `.gitignore`), contains
  `NEXT_PUBLIC_SANITY_PROJECT_ID=kb8eim50` and `NEXT_PUBLIC_SANITY_DATASET=production`
- **Studio route:** `/studio/[[...tool]]` (`src/app/studio/[[...tool]]/page.tsx`), embedded in this same
  Next.js app — one codebase, no separate Studio deployment
- **Schema types:** `src/sanity/schemaTypes/`
- **Studio structure (sidebar):** `src/sanity/structure.ts`
- **CORS origins:** `http://localhost:3000` added automatically during init. **Still to do before launch:**
  add the production Vercel URL at manage.sanity.io → this project → API → CORS Origins, with "Allow
  credentials" checked (this is the entire Studio-auth story per CLAUDE.md — no custom auth code needed).

## Stack versions installed (matches CLAUDE.md's verified table)

`sanity@6.4.0`, `@sanity/vision@6.4.0`, `next-sanity@13.1.1`. Note: the Sanity CLI's `init` command defaults
to installing `sanity@5` / `@sanity/vision@5` regardless of what's actually current — after running init,
these were manually upgraded to `6.4.0` to match the verified decision in CLAUDE.md. Re-check this if
re-running init from scratch in future.

---

## How this was set up (for reference / redoing elsewhere)

1. `npx sanity login --provider sanity` (email/password login — `--provider` is required for unattended/
   scripted runs since the CLI can't show its interactive provider picker; opens a browser to complete auth)
2. `npx sanity projects create "Mari Liveaboard" --yes --json` → returns the new `projectId`. (Creating the
   project this way avoids `sanity init`'s `--organization` requirement in unattended mode when creating a
   project inline.)
3. `npx sanity init -y --project <projectId> --dataset-default --template clean --typescript
   --package-manager npm --auto-updates --no-mcp --no-skills --no-import-dataset --no-git
   --nextjs-add-config-files --nextjs-append-env --nextjs-embed-studio` — run from the repo root, targets
   the just-created project, creates the `production` dataset, writes `.env.local`, adds
   `http://localhost:3000` to CORS, and scaffolds the embedded Studio files into this Next.js app.
4. `npm install sanity@6.4.0 @sanity/vision@6.4.0` — upgrade off the CLI's default v5.
5. Smoke test: `npm run dev`, then confirm `http://localhost:3000/studio` returns 200.

## To check an existing project's org/dataset without creating anything

`npx sanity projects list` — read-only, lists every project the logged-in account can see, with its ID. Used
above to confirm `sjkpkyaw` (MVP) is untouched and separate from `kb8eim50` (this build).

---

## Adding editors / team members

Done on Sanity's side, not in code — Studio access is entirely project-membership + CORS, no app-level auth.

1. Go to `https://www.sanity.io/manage/project/kb8eim50` → **Members**
2. **Invite members** → enter email → pick a role:
   - **Administrator** — full control incl. billing/inviting others
   - **Editor** — create/edit/publish all content, no project settings — the role for Serge/Mila/Ayu
   - **Viewer** — read-only
   - Contributor roles can be scoped to specific document types if someone needs to be limited further
3. They accept the email invite, then log into `/studio` with their own account (own email/Google/GitHub —
   separate from yours). No separate site password; project membership + CORS origin allowlisting is the
   entire access story (same mechanism noted above for Studio auth generally).

## Studio branding

`sanity.config.ts` sets `title: 'Mari Studio'` and a `buildLegacyTheme(...)` override (copper/amber accent
colors, sourced from `../v1-static-homepage/theme.css`'s `--primitive-copper-600` / `--primitive-amber-600`)
— cosmetic only, no functional effect. `buildLegacyTheme` is flagged `@deprecated` in Sanity's own types
("will be removed in an upcoming major version") — still the current supported API as of v6.4.0, but
re-check this when upgrading Sanity majors.
