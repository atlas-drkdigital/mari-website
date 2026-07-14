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
- **`proxy.ts`'s scope on this project is redirects only — verified via Perplexity 2026-07-14.** Protecting the embedded `/studio` route does **not** need custom proxy/middleware logic: Sanity's own SSO login + CORS origin allowlisting (configured at `manage.sanity.io`, with "Allow credentials" on) handles Studio access control. Don't build a custom auth check in front of `/studio` — that's an unnecessary Next 14/15-era pattern that can conflict with Sanity's own auth flow. Nothing else in this project's planned scope (no geo/locale logic, no bot protection, no A/B testing) needs `proxy.ts` beyond the redirects list.
- **`next/image`**: use `images.remotePatterns` for `cdn.sanity.io` (`images.domains` is deprecated). Default `images.qualities` is now `[75]` only — if Sanity-sourced images need quality ~80 (per the static-build performance pass), add `qualities: [75, 80]` explicitly in `next.config.ts` or it'll silently coerce to 75.
- Turbopack is default for `dev`/`build` now — `package.json` scripts are already plain (`next dev`, `next build`), no flag needed.
- `next lint` is removed; `npm run lint` runs `eslint` directly (already wired in `package.json`).
- Server Components are the default for every route — only add `'use client'` where actual browser APIs or interactivity are needed (forms, carousels, accordions, mega-menu state). Don't reflexively mark whole pages client.

## Sanity — embedded Studio (per `drk-website/references/sanity-cms.md`)
Studio lives at `/studio/[[...tool]]` in this same deployment, one codebase, one set of env vars. Not yet scaffolded — see `references/sanity-cms.md` and `references/i18n.md` before the schema pass (document-level localization pattern, `defineLive`, TypeGen).
- **Studio access control needs no custom code** — verified directly against Sanity's own docs (2026-07-14), not just Perplexity synthesis. Sanity's login (SSO) + CORS origin allowlisting (set at `manage.sanity.io`, "Allow credentials" on) is the entire auth story. Don't build a custom `/studio` auth check.
- **Localization plugin compatibility — only partially verified, do not treat as settled.** Sanity's docs confirm field-level (`sanity-plugin-internationalized-array`) and document-level (`@sanity/document-internationalization`) localization *strategies* can coexist *by choice per document type* in one project. They do **not** confirm the two plugin *packages* are conflict-free when both are actually installed together, and don't mention Studio v6 specifically at all. **Smoke-test both installed together in this actual project before relying on the split (singleton fields = field-level, full pages = document-level) as planned in MANAGER.md's brand-dump section.**

## Navigation — dynamic Destinations mega menu (queued, not wired)

`navItem` has a `menuStyle` field with a `destinationsGrid` option — a **placeholder only**. When the
`destinationPage` document type is built (Tier 4), come back and wire this: the frontend nav component
should, when `menuStyle === 'destinationsGrid'`, query live Destination documents (with their images)
instead of using the item's manual `children` list. Locked 2026-07-14 during the schema-review session so
this doesn't get forgotten once destination work starts.

## Rendering model — `cacheComponents` (Next 16's PPR successor): **decided OFF for launch, confirmed 2026-07-14**
Off by default in Next.js; leave it off — do not set `cacheComponents: true` in `next.config.ts` for the Jul 28 launch. Verified directly against Next.js docs, not just Perplexity synthesis:
- Enabling it makes data fetching dynamic-by-default with opt-in `"use cache"` caching, and switches client-side nav to React's `<Activity>` model — component state (open dropdowns, form inputs, expanded cards) *persists* across navigation instead of unmounting. Real behavioral change (FAQ accordion, mega-menu), not a pure upgrade, and this site's mostly-static/Sanity-driven architecture doesn't need the mixed static+streaming benefit it exists for.
- **Confirmed this does NOT block content freshness.** Standard ISR (`revalidatePath`/`revalidateTag` + a Sanity webhook on publish) is a fully separate, independently-supported "previous model" in Next 16 docs — editors publishing in Sanity still update the live site without `cacheComponents`.
- Revisit post-launch once there's room to test the `<Activity>` state-preservation behavior properly — not a permanent decision, just the right call for a 2-week timeline.

## Styling
Tailwind v4 CSS-first `@theme` layer. **Not yet ported** — the static build's `theme.css` (colors, type, spacing, radius, all generated from Figma variables) needs to move into this repo before any section gets built; don't hand-copy values ad hoc per component. Same "no custom CSS classes / no `@apply` / native utilities only" rule as the static build.

## Content modeling — Portable Text tiers (locked 2026-07-14)
Not one global rich-text config — three tiers, decide which applies by field:
1. **Plain string** (headings, labels, CTA text, eyebrows) — no rich text.
2. **Constrained rich text** (most body copy — card descriptions, FAQ answers) — default Portable Text, paragraph + basic marks only, no heading styles or alignment override (layout/CSS already governs presentation).
3. **Full rich text with headings + alignment** — only T&C body, Blog post body, and the page-builder's "Rich Text" block for overview-style sections (Private Charters, possibly About). This is the only tier that gets the heading/alignment customization work.
Every rich-text field uses plain default Portable Text (tier-2 shape) at schema-pass time; only tier-3 fields get the customization layered on later, once that work is actually scheduled — see `MANAGER.md`.

## Sanity Studio editor-organization — defer to last, confirmed safe
Field `title`/`description`/tab-grouping and the Structure Builder (sidebar navigation/grouping) are presentational metadata — changing them later costs no data migration. What needs to be reasonably right from the schema-pass itself: the actual field `name` keys and document type `name`s, since renaming those after real content exists needs a migration script. Polish the editor experience last, once every type exists and the full picture is visible — don't front-load it.

## Doc split (replicate the static-build pattern — see `drk-website/references/claude-code.md`)
This file = prose rules + active decisions. `MANAGER.md` (session/decision log, created 2026-07-14) and `COMPONENTS.md` (reusable component specs, **not yet created** — ports from the static build's `COMPONENTS.md` at first use, not up front) follow the same convention as the old repo. Check `MANAGER.md` for today's active task scope and session history before re-deriving it.

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
