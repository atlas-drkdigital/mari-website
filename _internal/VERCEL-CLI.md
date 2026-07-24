# Vercel CLI — what it is, how it's wired here, what's safe to run

Set up 2026-07-24 (Adinda's ask: do the Vercel dashboard actions from the repo instead of by hand).
This file is the reference for that. **Read §4 and §5 before running any Vercel command.**

---

## 1. What it's for

Vercel's official command-line tool. It exposes the same surface as the Vercel dashboard, but
scriptable: list projects and deployments, inspect a build, read logs, manage environment
variables, delete deployments, trigger deploys.

**Why we have it:** several launch/maintenance steps were previously dashboard-only, i.e. manual
work only Adinda could do. The CLI moves those into this repo so Claude can run them (with her
approval — see §5). That is the entire point: **minimize manual work.**

## 2. Who published it

**Vercel — the company.** npm package `vercel`, installed globally (`npm install -g vercel`).
Version at setup: **56.5.0**. It is a general developer tool with no connection to Claude or
Anthropic; any human or CI script uses it the same way.

### Not the same thing as the Vercel *plugin*
There is also a **Vercel plugin for Claude Code** (`vercel@claude-plugins-official`, v0.45.1),
installed here 2026-07-24. It is **also authored by Vercel** (repo `github.com/vercel/vercel-plugin`,
Apache-2.0) and merely *distributed* through Anthropic's official marketplace. It bundles slash
commands (`/bootstrap`, `/deploy`, `/env`, `/status`), three agents, ~58KB of Vercel docs, and an
MCP connection to `https://mcp.vercel.com`.

🔴 **The plugin's MCP is READ-ONLY in its initial release** — its own `.mcp.json` says so verbatim:
*"Read-only in initial release: search docs, list projects/deployments, inspect logs."* **It cannot
delete deployments or change environment variables.** So the CLI is not redundant; it is the only
path for anything that changes state.

**Default split: plugin for READING, CLI for CHANGING.** (The plugin also needs its own OAuth
authorization, separate from the CLI login, and only loads after a session restart.)

## 3. This usage — how it's wired on this machine

| Step | Command | Note |
|---|---|---|
| Install | `npm install -g vercel` | global, v56.5.0 |
| Auth | `vercel login` → device OAuth | signed in as **`atlas-drkdigital`** |
| Link | `vercel link --project mari-website --scope mari-liveaboard --yes` | writes `.vercel/project.json` |

🔴 **`vercel login` cannot be run by Claude.** It is an interactive browser OAuth flow (device code
→ `https://vercel.com/oauth/device`); a non-interactive shell cannot drive it. **Adinda runs
`! vercel login` in the prompt** and approves in the browser. Everything after that is automatable.
The token is stored in the CLI's own local config — **never in this repo**.

**Side effects of `vercel link`, both correct, both verified 2026-07-24:**
- appended `.vercel` and `.env*` to `.gitignore`;
- pulled a `VERCEL_OIDC_TOKEN` into `.env.local`.

Both are gitignored and untracked. Verified at the same time: **no env file has ever been committed
in this repo's history** (`git log --all -- '*.env*'` → empty).

## 4. 🔴 THE ACCOUNT HAS TWO PROJECTS — the single most important safety fact

| Project | Production URL | What it is |
|---|---|---|
| **`mari-website`** | `mari-website-beta.vercel.app` | **our** staging build — the site being built |
| **`mari-liveaboard-website`** | `www.mari-liveaboard.com` | the **LIVE MVP site** — 🔴 DO NOT TOUCH |

Both sit under the team **`mari-liveaboard`**. There is no personal-account scope (Vercel rejects
it), so those two are the whole picture.

**Consequence: every command must carry `--scope mari-liveaboard` AND name `mari-website`
explicitly.** A command that omits the project can resolve against the wrong one — and one of them
is the client's live website.

## 5. Safe vs not safe

### ✅ Safe — read-only, run freely
```
vercel whoami
vercel teams ls
vercel project ls
vercel ls mari-website --scope mari-liveaboard
vercel inspect <deployment-url> --scope mari-liveaboard
vercel logs <deployment-url> --scope mari-liveaboard
vercel env ls --scope mari-liveaboard          # lists NAMES, not secret values
```

### ⚠️ Needs Adinda's explicit yes — EVERY time (her standing rule, locked 2026-07-24)
Not a one-off approval: she asked that Vercel actions always be run by her first. Claude proposes
the exact command and the exact targets, then waits.
```
vercel remove <deployment-url>      # irreversible
vercel env add | vercel env rm      # production env changes (launch-day SITE_NOINDEX removal)
vercel alias                        # changes what a URL points at
```

### 🔴 NEVER
- **`vercel remove mari-website`** — a bare **project name** with no URL deletes **THE WHOLE
  PROJECT**, not a deployment. **Always pass full deployment URLs.**
- Anything naming **`mari-liveaboard-website`** or **`www.mari-liveaboard.com`**.
- **`vercel deploy` / `vercel --prod` from this repo.** It uploads the **current working
  directory**, which on `main` is every internal file — bypassing the entire strip-before-push
  boundary in one command. **Deployment happens ONLY via `_internal/scripts/promote.ps1` →
  `origin/staging` → Vercel's Git integration.** The CLI is for *managing*, never for *deploying*.

### Flags that matter
- **`--safe`** on `vercel remove` skips any deployment holding an active alias — it turns a mistake
  into a skip. **Use it on the first pass**, then inspect whatever got skipped before deciding.
  (This is exactly what caught the three branch-alias deployments on 2026-07-24.)
- **`--yes`** skips the confirmation prompt. Required, because the shell is non-interactive. It is
  **not** permission — Adinda's yes is the permission.

## 6. What this moves off Adinda's plate

Previously dashboard-only, now runnable from the repo (still with her yes):
- **deleting old deployments** — ✅ done 2026-07-24, 15 removed
- reading build logs when a promote fails
- listing what is actually deployed
- 🔴 **launch day:** `vercel env rm SITE_NOINDEX production --scope mari-liveaboard`, then verify
  `robots.txt` allows and no page carries a `noindex` meta

**Stays hers, unavoidably:** `vercel login` (browser OAuth), domain configuration, billing, team
members, deployment-protection settings.

## 7. Verification ritual after any change

```
vercel ls mari-website --scope mari-liveaboard        # what survived
curl https://mari-website-beta.vercel.app             # staging still serving
```

🔴 **HTTP 200 alone is NOT a passing check.** An auth-gated Vercel URL returns **200 with
`<title>Login – Vercel</title>`**. **Assert on the title, not the status code** — the real staging
site returns `Mari Liveaboard — Phinisi Diving Liveaboard in Indonesia`. That exact distinction is
what let the 2026-07-24 cleanup tell a live site apart from a protected placeholder, and it is the
"a verification ritual only counts if it can actually fail" rule applied to HTTP.

---

**Skill-wide** — every DRK site with a Vercel account wants this same split (two-project safety
rule, read-vs-change permission boundary, never-deploy-from-CLI). Queued for `drk-website` via
`_internal/handoff/drk-website.md`.
