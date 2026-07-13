@AGENTS.md

# CLAUDE.md — Mari Liveaboard website (Next.js + Sanity)

Production build for Mari Liveaboard, by Atlas (DRK Digital). Migrates the locked static homepage
(`../v1-static-homepage`, frozen — do not edit) into a real Next.js + Sanity site, then builds every
other page directly against Figma/spec (no static intermediate step for non-homepage pages).

## Skills to load this session
- `mari-project` — engagement status, active workstreams, what's next
- `drk-website` — stack conventions (this file adds only what's Mari-specific)
- `atlas-website` — liveaboard page inventory/content checklists
- `mari-core` + `mari-website` — brand facts and page copy
Load `atlas-destinations` / `mari-itineraries` only for destination or itinerary work specifically.

## Stack — verified live 2026-07-14, corrects `drk-website/references/stack.md` (stale, dated 2026-06-10)
| Layer | Version | Note |
|---|---|---|
| Next.js | **16.2.10** (App Router) | doc said "target 15" — 16 is now `latest`, and `next-sanity`'s current release already requires `next ^16.0.0-0`, so 15 would be the mismatch, not 16 |
| Sanity Studio | **6.4.0** (`latest` tag) | doc flagged v6 as "may be imminent" — it's shipped; `next-sanity` supports `^5.29.0 \|\| ^6.0.0` |
| next-sanity | 13.1.1 | |
| React | 19.2.4 | |
| Tailwind | v4, CSS-first `@theme` | matches doc, unchanged |
| TypeScript | 5.x | |
Not yet run: `sanity init` / schema pass. Confirm v6 (not v5) when that happens — this table is the record of that decision, don't re-derive from training data.

## Next.js 16 conventions — real deltas from what `drk-website`'s docs assume (that skill hasn't been updated past 15 yet)
- **Every dynamic API is fully async, no sync fallback**: `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` all require `await`. Applies to every `[slug]` route (Destination, Blog post) from day one.
- **`middleware.ts` → `proxy.ts`.** `drk-website/references/redirects.md`'s "Sanity redirect document type + Next.js middleware" pattern is written against the old filename/export. Build the actual redirect handler as `proxy.ts` exporting `proxy()`, not `middleware()`. Flag this correction back to `drk-website` at the next skill-update round.
- **`next/image`**: use `images.remotePatterns` for `cdn.sanity.io` (`images.domains` is deprecated). Default `images.qualities` is now `[75]` only — if Sanity-sourced images need quality ~80 (per the static-build performance pass), add `qualities: [75, 80]` explicitly in `next.config.ts` or it'll silently coerce to 75.
- Turbopack is default for `dev`/`build` now — `package.json` scripts are already plain (`next dev`, `next build`), no flag needed.
- `next lint` is removed; `npm run lint` runs `eslint` directly (already wired in `package.json`).
- Server Components are the default for every route — only add `'use client'` where actual browser APIs or interactivity are needed (forms, carousels, accordions, mega-menu state). Don't reflexively mark whole pages client.

## Sanity — embedded Studio (per `drk-website/references/sanity-cms.md`)
Studio lives at `/studio/[[...tool]]` in this same deployment, one codebase, one set of env vars. Not yet scaffolded — see `references/sanity-cms.md` and `references/i18n.md` before the schema pass (document-level localization pattern, `defineLive`, TypeGen).

## Styling
Tailwind v4 CSS-first `@theme` layer. **Not yet ported** — the static build's `theme.css` (colors, type, spacing, radius, all generated from Figma variables) needs to move into this repo before any section gets built; don't hand-copy values ad hoc per component. Same "no custom CSS classes / no `@apply` / native utilities only" rule as the static build.

## Doc split (replicate the static-build pattern — see `drk-website/references/claude-code.md`)
This file = prose rules + active decisions. Two more files follow the same convention as the old repo, **not yet created**:
- `COMPONENTS.md` — reusable component specs (ports from the static build's `COMPONENTS.md` at first use, not up front)
- `MANAGER.md` — session/decision log. Full Jul 14–25 build sprint plan (day-by-day, contracted deliverables, page inventory) currently lives in `../v1-static-homepage/MANAGER.md`'s "Build sprint scope — locked 2026-07-13" entry — port the still-relevant parts into this repo's own `MANAGER.md` the first time it's created, rather than reading cross-repo indefinitely.

## Session discipline (carried over from the static build, still applies)
- Verify by reading actual compiled CSS/build output, not by trusting a class or config name's apparent meaning
- Tag reusable rules `[DRK]` as they emerge — don't defer to a batch audit
- MANAGER.md (once created): archive past ~1,900 lines

## Commands
```
npm run dev      # Turbopack dev server
npm run build    # Turbopack production build
npm run start    # serve production build
npm run lint     # eslint
```
