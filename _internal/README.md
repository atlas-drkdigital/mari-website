# What is this folder?

`_internal/` holds everything that belongs to the *making* of the Mari Liveaboard website —
notes, plans, drafts, scripts, and scratch files. Nothing in here is part of the website
itself, and none of it ever appears online.

## What's in the project folder (one level up)

| Entry | What it is |
|---|---|
| `src/` | The website's actual code — pages, sections, styling, CMS setup. |
| `public/` | Images and files the website serves directly (logos, icons, etc.). |
| `CLAUDE.md` | The project's working rules and decisions — the "how we build here" handbook. |
| `AGENTS.md` | Shared instructions for development tools working in this repo. |
| `MANAGER.md` | The running project log: what's done, what's next, session history. |
| `COMPONENTS.md` | Notes on reusable building blocks of the site. |
| `README.md` | The standard technical readme for the code project. |
| `package.json`, `tsconfig.json`, `next.config.ts`, etc. | Technical configuration files the build needs. |
| `_internal/` | This folder — all internal working material, in one place. |

## What's inside `_internal/`

| Entry | What it is |
|---|---|
| `SANITY-SETUP.md` | Notes on how the content management system (Sanity) was set up. |
| `VERCEL-CLI.md` | What the Vercel command-line tool is, and which commands are safe to run. |
| `handoff/` | Notes queued up to be merged into the shared skill library later. |
| `content/` | Approved copy drafts for website pages (these ARE backed up in git). |
| `content-scratch/` | Old scratch images — the real masters live in Google Drive and Sanity. |
| `backup/` | Stale one-off file copies kept just in case. Not backed up in git. |
| `image-test/` | Throwaway image test output. Not backed up in git. |
| `scripts/` | Small helper scripts used to load and fix content in the CMS. |
| `README.md` | This file. |
| `RESUME.md` | "Start here" note for picking up work in a new session. |
| `PAGE-SPECS.md` | Specifications for pages still to be built. |
| `CONTENT-STATUS.md` | Tracker: which content is real vs. placeholder. |
| `SCHEMA-SPECS.md` | Field-by-field spec of the CMS content types. |
| `QA-CHECKLIST.md` | Open design questions worth a reviewer's second opinion. |
| `POLISH-BACKLOG.md` | Known cosmetic polish deliberately saved for later. |
| `OWNER-HANDBOOK.md` | Notes for the future site owner: behaviours that are correct by design. |
| `ADINDA-TODOS.md` | Things only Adinda can do. |
| `PHASE3-PLAN.md`, `AUDIT-2026-07-20.md`, `SKILL-ROUND-PLAN.md`, `STEP2-READY.md`, `STUDIO-ORGANIZATION-AUDIT.md`, `WORKOUT-RECAP.md` | Older working documents and audits, kept for reference. |

## What gets deployed where

- **GitHub (private) gets EVERYTHING.** The private repository is the project's living backup —
  code, notes, drafts, logs, all of it. It is private and only the team can see it.
- **Vercel (the hosting service) gets ONLY what the build needs.** The file `.vercelignore` at
  the project root is the mechanism: it tells Vercel to skip `_internal/` and the root document
  files (CLAUDE.md, MANAGER.md, and friends) entirely, so they are never uploaded to Vercel and
  never stored there — let alone shown to visitors.
- **Honest caveat:** this mechanism is not yet verified. For the first few deploys, check it:
  open the deployment in the Vercel dashboard, go to the Source tab, and confirm `_internal/`,
  `CLAUDE.md`, and `MANAGER.md` are absent. Once that's been seen a few times, it can be trusted.
