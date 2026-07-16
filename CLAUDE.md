@AGENTS.md

# CLAUDE.md — Mari Liveaboard website (Next.js + Sanity)

Production build for Mari Liveaboard, by Atlas (DRK Digital). Migrates the locked static homepage
(`../v1-static-homepage`, frozen — do not edit) into a real Next.js + Sanity site, then builds every
other page directly against Figma/spec (no static intermediate step for non-homepage pages).

## Working principle — ship fast, document everything, avoid costly-to-reverse decisions (locked 2026-07-15)
Locked explicitly by Adinda, this governs every decision in this file and in MANAGER.md: the goal is
a working website presented as quickly as possible, with every decision made along the way written
down (MANAGER.md, this file, `_handoff/*.md`) so no work is ever lost — not a goal of getting every
field, label, or edge case perfect on the first pass. 80/20 governs where time actually goes: spend
real time on what's genuinely expensive to redo later (field `name` keys and document type `name`s
once real content exists, URL slugs once real traffic/backlinks exist, anything needing a data
migration) — move fast and don't over-think what isn't (Studio field titles/descriptions/grouping,
exact copy before real content exists, cosmetic-only structure, anything a `redirect` document or a
straightforward rename can fix later for free).

**Standing instruction, not a one-time note:** when a request is trending toward low-value nitpicking
on something that's actually cheap to change later, say so explicitly — something like "this is
deferrable and costs nothing to change later, want to do it now or move on?" — rather than silently
complying either way. This is a "surface it and let Adinda decide" rule, every time it comes up, not
a judgment call to make quietly on her behalf.

## Guiding principle — the CMS/admin experience is a product surface, not just the front end (locked 2026-07-16)
Adinda's explicit standing correction: build for TWO kinds of user, not one. The site visitor (front end) AND
the non-technical admin/owner editing content in Studio (back end). The editor is a real user; an intuitive,
self-explanatory CMS is a **selling point** for DRK, not an afterthought. **Decision rule: when a
"cleaner-in-code" model (normalization, references, developer convenience) conflicts with the model a
non-technical owner would find obvious (inline arrays they can see + drag + edit in place, drag-order over
manual numbers, content where they'd expect it, labels that explain themselves), editor-intuitiveness WINS —
unless there is a real technical reason (genuine cross-page reuse, data integrity, performance).** This is the
thread already behind the required-field markers, section-label tabs, fieldset headers, form decluttering, and
evergreen-field-description rules — now made explicit. **Standing behavior:** proactively FLAG whenever
developer-convenience and editor-intuitiveness diverge (e.g. "the normalized model is references, but the
editor-friendly model is an inline array — here's the tradeoff") and let Adinda decide, rather than silently
optimizing for the code. Precedent: the FAQ remodel 2026-07-16 (reference documents → inline array) was chosen
on exactly this basis — the reference pile forced editors to open a whole document per Q&A and hand-manage a
display cap, which is unintuitive; an inline array is what a non-dev expects. Skill-wide (DRK philosophy) —
queued for `drk-website` via `_handoff/drk-website.md`.

## Skills to load this session
- `mari-project` — engagement status, active workstreams, what's next
- `drk-website` — stack conventions (this file adds only what's Mari-specific)
- `atlas-website` — liveaboard page inventory/content checklists
- `mari-core` + `mari-website` — brand facts and page copy
Load `atlas-destinations` / `mari-itineraries` only for destination or itinerary work specifically.

**Also read every file in `_handoff/*.md` before relying on a skill's content as current.** Those files are
a staging area for decisions made in this repo that haven't been merged into the skill sources yet (no live
bridge from this local session to the chat-side skill containers — see `_handoff/drk-website.md`'s own
explanation). A skill can be stale relative to a handoff file, and a handoff file can itself describe a
decision this session's own work has since superseded — when they conflict, flag it back to Adinda rather
than silently picking one. Don't skip this because the skill "should" already have it; verify.

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
2. **Constrained rich text** (most body copy — card descriptions, FAQ answers) — default Portable Text, paragraph + bold/italic/link + bullet lists (revised 2026-07-15 to add bullets), no heading styles or alignment override (layout/CSS already governs presentation).
3. **Full rich text with headings + alignment** — only T&C body, Blog post body, and the page-builder's "Rich Text" block for overview-style sections (Private Charters, possibly About). This is the only tier that gets the heading/alignment customization work.
Every rich-text field uses plain default Portable Text (tier-2 shape) at schema-pass time; only tier-3 fields get the customization layered on later, once that work is actually scheduled — see `MANAGER.md`.

## Images — every image has an editable alt field, hard requirement locked 2026-07-15 (clarified same day)
**The DRK-wide hard rule: every image field must HAVE an editable `alt` field — NOT that alt is
required-to-fill.** An editor can upload an image without writing alt; the requirement is that the
field is always THERE and editable, on every image, on every DRK-built site. This is why every image
field uses `imageWithAlt` (or the `galleryImage` object, which also carries `title` + `caption`),
never bare `type: 'image'` — no exceptions, including retrofitted fields (`siteSettings.logo`/
`favicon`, the rich-text inline image). Applies to every future schema pass (`destinationPage`,
`privateCharters`, `blogPost`, all of Tier 4) without needing to be re-requested.
**Do NOT put `Rule.required()` on alt** — that was an early over-application, corrected 2026-07-15;
alt (and title/caption) are recommended-not-required everywhere.

Alt matters for two reasons beyond accessibility: Sanity's CDN URLs are hash-based and can't be made
descriptive at upload, but Sanity supports "vanity filenames" — a descriptive name appended after the
hash (`.../{hash}-{w}x{h}.{ext}/{seo-name}.{ext}`), confirmed against Sanity's own docs. The
`src/sanity/lib/image.ts` `urlFor()` helper should derive that vanity segment from a **fallback chain**
(decided 2026-07-16, corrects the earlier "slugify from alt" default — that was a soft default, never a
rigorous lock; alt is a full descriptive sentence and makes a poor filename):
1. an optional editor-set **`seoImageName`** field, if filled (clean kebab-case control when wanted);
2. else the asset's **`originalFilename`** (`asset->originalFilename`, which Sanity retains), if it looks
   descriptive — skip it if it matches a junk pattern (`IMG_\d+`, `DSC\d+`, `photo\d+`, etc.);
3. else the **`alt`** text slugified, as a last resort;
4. else **omit** the vanity segment entirely (the image still serves fine, just no SEO name).
Not built yet — no components consume Sanity images today. Skill-wide, not Mari-only (queued for
`drk-website` via `_handoff/drk-website.md`).

**Known follow-up:** `seo.ts`'s `ogImage`/`twitterImage`/`siteSettings` social images are still bare
`type: 'image'` without an alt field — technically an exception to "every image has editable alt."
Social meta images use a separate `og:image:alt` mechanism, so it's a judgment call whether to add
alt there; flagged for review, not yet changed (see _QA-CHECKLIST.md).

**Also queued for the `drk-website` skill** (this is a DRK-wide convention, not Mari-specific) — see
`_handoff/drk-website.md`.

## Galleries — array-on-the-page, grouped by category, for native bulk upload (locked 2026-07-15, EXPERIMENTAL)
Galleries are a **flat array field directly on the page document** (`boatPage.gallery`, and every future
gallery-bearing page the same way) — NOT a separate `galleryImage`/`galleryCategory` document type, and
**NOT grouped by category**. The array's members ARE images (the shared `galleryImage` object:
`type: 'image'` + `title` + `alt` + `caption` + `categories` tag field). **Flat, not grouped — learned
the hard way 2026-07-15:** a category-grouped structure (array of group *objects*, each holding an inner
images array) breaks the obvious drop target — dropping image files onto an array whose members are
objects gives *"no known conversion from content types to array item,"* because Studio can't turn a file
into a group. Flat means the gallery array's members are images, so multi-file drag-drop lands directly
on it and uploads. Category is a per-image tag; per-batch category tagging is deferred to the future
custom upload button.

**Why (this is the whole reason, don't undo it without re-reading):** Sanity's docs confirm *"arrays of
images accept batches of files to be dropped on them"* — so an editor can drag/select many files at once
and they all upload natively, no custom code, usable by any non-technical editor. That batch behavior is
documented for an array of the **`image` type**, and does NOT reliably apply to an array of an *object
that wraps* an image — so the gallery image MUST stay a bare `image` type with extra fields, never a
wrapper object. The earlier separate-document model blocked native batch upload entirely, which is why it
was reversed. Verified directly against the v6.4 image-type docs, not assumed.

**Scope of what's solved vs. not:** bulk upload is about getting the **files** in fast. Per-image `alt`,
`caption`, `title` are still edited individually afterward — there is NO native bulk-alt-editing UI in
v6.4, and that's accepted (alt is human-written for SEO anyway; Adinda explicitly doesn't need alt-at-
scale, only file upload at scale). Category is set **once per group/batch**, not per image, to cut the
per-image busywork.

**Status: EXPERIMENTAL** — the category-per-batch grouping is being tried, not proven; revisit once real
editors actually use it. Reusable beyond Mari (every Atlas liveaboard/destination gallery) — queued for
the skill in `_handoff/drk-website.md`.

## Eyebrow fields — toggle-to-reveal pattern, standard going forward (locked 2026-07-15)
Every eyebrow field on every page type gets a `showXEyebrow` boolean immediately before it
(`hidden: ({ parent }) => !parent?.showXEyebrow`), same mechanism the `seo` object's `jsonLd`
override already used — keeps the Studio form from getting cluttered with rarely-used fields.
Applies to every page type going forward (all of them have eyebrows, per the "every heading and
eyebrow is editable" rule above) — **not a retrofit task**: `page` and `scheduleRates` don't
currently have an eyebrow field at all, so there's nothing to add the toggle to yet. Apply this the
moment either of those (or any new type) actually gets an eyebrow field, not before.

## Build approach — skeleton-first, THEN vertical slices per page (locked 2026-07-16)
Refines the earlier strict phase-gate (all schema, then all frontend). Two phases:
1. **Skeleton-first (done):** every planned document type scaffolded into the Studio sidebar so the whole
   system is visible at once — it doubles as Adinda's checklist of what exists. This phase has served its
   purpose; all Tier 4 types are in the sidebar.
2. **Vertical slices (now):** go page by page — for each page, build the schema to full depth AND build the
   frontend AND load content, reviewing the real rendered page, not an abstract Studio form. Adinda's call
   2026-07-16: abstract schema review had hit its limit ("feels so abstract, I'm not going to say anything
   about it") — seeing the real page with real content is what makes her judgment meaningful and lets her
   approve definitively instead of hedging on empty forms.
   - **Guardrail against rabbit-holing (Adinda's own concern):** build each slice to "structurally matches
     the mockup + functional," and defer all purely-cosmetic polish to `_POLISH-BACKLOG.md` — burned down
     later in one polish block, not mid-slice. Flag immediately if a slice overruns its timebox.
   - **Migration risk is acceptable, confirmed:** a cross-page learning that forces a shared-field rename
     after content exists needs a migration — but during the build our Sanity content is re-seedable
     placeholder data (rename = re-run the seed, not a real migration), and Adinda is standardizing field
     conventions so renames stay rare. Renaming has been cheap in practice.
   - Suggested slice order: **homepage first** (its frontend already exists — wire it to Sanity, lowest
     churn), then destination, then the rest. Lock shared types (`imageWithAlt`, rich-text tiers, `seo`,
     gallery object) before leaning on them cross-page.
   - **A slice is FULLY wired — no leftover hardcoded content — in one pass (locked 2026-07-16, Adinda; UNDER
     TEST, confirm at end of build).** When a page is sliced, EVERY content element on it that is *supposed*
     to be editable must be wired to Sanity in that same pass — do NOT leave a section reading hardcoded copy
     "for now," and do NOT ship the `?? 'hardcoded fallback'` pattern that silently substitutes the original
     strings when a field is empty (that pattern *sabotages review* — Adinda can't tell wired-and-working
     from unwired-showing-old-copy). Where real content doesn't exist yet, **seed placeholder** (literal
     `"placeholder"` / lorem ipsum / a stock image) so the section renders from Sanity, never blank — the
     content being incomplete is fine, the wiring being incomplete is not. Then a page reviews as the *actual*
     Sanity-driven page, and the only end-of-build check is "which fields are still placeholder" (tracked in
     `_CONTENT-STATUS.md`), never "which components were never connected." **Carve-out:** genuinely global
     chrome (Nav, Footer, global contact details) is NOT page content — it belongs to `siteSettings`/
     `navigation` and is wired in a dedicated global-chrome slice, so it may stay hardcoded on a page slice
     until that slice runs. The render must still degrade gracefully (empty reference array → section hides,
     never throws) even though placeholder seeding means it shouldn't happen in practice.
   - **Nav/Footer links un-hardcode INCREMENTALLY, automatically, per slice (locked 2026-07-16, Adinda).**
     Standing sub-step of every page slice, not a one-off: when a page slice ships, **update the Nav and
     Footer link(s) that point to that page to the real route** — so navigation visibly starts working page
     by page. This is a checklist item baked into the slice, done every time without being re-requested. The
     nav/footer *structure* stays hardcoded until the dedicated global-chrome slice does the full dynamic
     wiring (Sanity-driven menu + destinations mega-menu) — only the link targets get fixed incrementally
     here. (Footer *content* — newsletter/disclaimer/copyright/brand-alias — is its own small siteSettings
     pass, separate from both.)
Skill-wide (Adinda's ask) — queued for `drk-website`'s `references/workflow.md` (refines its Phase 6→7 order).
The full-wire-per-slice rule is ALSO queued for `drk-website` (see `_handoff/drk-website.md`), marked
under-test until the build confirms it end-to-end.

## Studio form section headers — every group gets a matching titled fieldset (site-wide, locked 2026-07-16)
Distinct from "editor-organization deferred to last" below (that's field titles/descriptions/sidebar polish
— still deferrable). This one IS applied as each type is built: every document type pairs its `groups`
(tabs) with a matching set of `fieldsets` (titled sections), and every field declares BOTH its `group` and
its `fieldset`. Reason: groups only separate tabs, but **fieldsets render as visible section headers even in
the flat "All Fields" view** — without them an editor can't tell which section they're in. `siteSettings`
already did this; `destination` done 2026-07-16; **retrofit `boat`/`homePage`/`page`/`scheduleRates` and
every new type.** Skill-wide — queued for `drk-website`.

## Load real/placeholder content into every schema so it's reviewable (locked 2026-07-16)
An empty form is too abstract to judge. Whenever a document type is built or filled out, populate at least
one real document with content — pull copy from the mockup where it exists, use clear placeholder (and the
homepage's own titles/copy) where it doesn't, tag placeholders in `_CONTENT-STATUS.md`. Pairs with the
vertical-slice approach: real content + real rendered page = meaningful review. Applies to every type.

## Decluttering the editing form — separate fields by how often they're touched (locked 2026-07-16)
Principle Adinda likes: keep the primary content front-and-center; move rarely-touched fields out of the
way, chosen by WHY they're rarely touched.
- **Shared across instances of a type DESIGNED to hold many** → a `[Type] Defaults` singleton, off the page
  entirely, edited once (with a `{token}` for the per-instance part, e.g. `{destination}`). **The test is
  whether the type is a template/collection (designed for many instances), NOT the current count** —
  corrected 2026-07-16 (Adinda): `boat` is *designed* to hold multiple boats, so it gets a `Boat Defaults`
  even though only one exists today. Applies to **Destinations ✓** and **Boats (pending build)**. **Never
  for single-instance/singleton page types** (homepage, about, T&C, schedule) — designed as one, nothing to
  share; those declutter with the dedicated tab below.
- **Rarely touched but instance-specific, OR the section-labels of a singleton page** → keep on the doc but
  give it a **dedicated, explicitly-labeled tab** (a group titled e.g. **"Section Labels"** or "Defaults")
  and/or a collapsible/collapsed `fieldset`. **Adinda's requirement 2026-07-16: it must be an explicit,
  findable dedicated section — an editor has to clearly see where to edit the eyebrows/labels, not have them
  buried.** For singleton pages (homepage, about, private charters) the eyebrows/section-labels go in such a
  "Section Labels" tab (they can't use a Defaults singleton). Fieldsets = titled sections visible in "All
  Fields"; groups = tabs; a field can declare both, and they compose.

## Required fields must show an upfront marker — site-wide, locked 2026-07-16 (Adinda, repeated ask)
Every required field must display a **visual "required" marker** (asterisk or "(required)") that an editor
sees **before** filling the form — NOT only a validation error on save (editors miss those and think the
backend is broken). Implement **once, site-wide** via a global custom field component
(`sanity.config.ts` → `form: { components: { field } }`) that detects required validation and renders the
marker — not by hand-editing every field title. **Status: NOT built yet — top pending task** (it's been
asked more than once; do it early next session). Verify first whether current Studio shows any default
indicator, then add the global component if not.

## Studio staleness — restart clean + verify BEFORE asking Adinda to review, locked 2026-07-16
After a batch of schema/structure/content changes, **HMR does not reliably reflect them** — the running
Studio goes stale (new document types, Structure Builder nesting, and freshly-seeded content especially).
A browser hard-refresh does NOT fix a stale *server*. Standing rule: before telling Adinda to review Studio
after such changes, **(1) restart the dev server clean** (kill the `:3000` process, `rm -rf .next`, restart),
**(2) verify** — curl `/studio` 200 + a GROQ query-back confirming the content is queryable — **(3) then**
tell her to hard-reload. Don't ask her to review off a server that's had heavy schema edits without a clean
restart first. (This caused a full round of "why is everything empty / missing" on 2026-07-16 — all content
was present; the server was just stale.)

## Session length — offer a fresh session at block boundaries when it's grown long, locked 2026-07-16
Standing rule (Adinda's ask): **at the end of each work block — never mid-task — check whether to start a
fresh conversation, and proactively OFFER it (with a handoff note)** when EITHER trigger holds:
1. **The next block is a distinct task** that wouldn't need the last ~20 messages — the "would this prompt
   make sense in a brand-new terminal?" test (Claude Code's own primary signal). Independent task → fresh
   session.
2. **The session has clearly grown long** — many completed blocks, lots of files read, conversation very
   long. Claude Code guidance: checkpoint around **~60% context** (not 90%) and keep a focused session under
   **~120k input tokens**. Claude can't read an exact context %, so use these as the *spirit* — lean on the
   heuristics + the task-boundary test above.
**Always pair the offer with (a) a written handoff note** (like `_handoff/_NEXT-SESSION-*.md`) **AND (b) a
ready-to-paste kickoff prompt** for the new conversation — skills to load, first steps (restart-clean +
verify), and the task — so the fresh session starts in a single paste (Adinda's ask 2026-07-16). Not just
the note. A deliberate handoff captures decisions/state precisely, which is strictly better than riding
Claude Code's lossy auto-compact. Only offer at a clean, committed boundary, not mid-arc. Composes with the session-bookend
protocol (which covers session *end*); this adds the mid-session length check. Skill-wide — queued for
`drk-website`.
Skill-wide (Adinda's ask) — queued for `drk-website`.

## Localization Studio UX — fix the "which language is this doc?" list problem AT i18n-build time (documented 2026-07-16)
Not now (i18n is a deferred paid add-on) — but capture the solution so we implement it when localization is
turned on. When document-level i18n is on, full-page types (`destination`, `boat`, `blogPost`, `page`,
`homePage`) get **one document per language**, which raises a real list-UX concern (Adinda's, 2026-07-16):
you can't tell which list row is which language. The fix, applied then:
- Set each localized type's `preview` (subtitle / `prepare()`) to show the language → the list reads
  "Mari (EN)" / "Mari (DE)", never a blind click. `@sanity/document-internationalization` also adds its own
  language badge.
- In Structure Builder, **filter/split lists by language** — a document list is just a GROQ filter on the
  `language` field (`*[_type==$t && language==$lang]`), so "English ▸ Destinations" / "German ▸
  Destinations" as separate lists, or group translations under one entry with an in-document language
  switcher.
- **Singletons** (`siteSettings`, `destinationDefaults`, `cta`) use **field-level** i18n → stay ONE doc, so
  they have no list problem at all.
This is presentational Studio config, no schema change — and the Defaults+token pattern actively *helps*
(translate shared chrome once per language, not per instance). Skill-wide — queued for `drk-website`.

## Sanity Studio editor-organization — defer to last, confirmed safe
Field `title`/`description`/tab-grouping and the Structure Builder (sidebar navigation/grouping) are presentational metadata — changing them later costs no data migration. What needs to be reasonably right from the schema-pass itself: the actual field `name` keys and document type `name`s, since renaming those after real content exists needs a migration script. Polish the editor experience last, once every type exists and the full picture is visible — don't front-load it.

## Doc split (replicate the static-build pattern — see `drk-website/references/claude-code.md`)
This file = prose rules + active decisions. `MANAGER.md` (session/decision log, created 2026-07-14) and `COMPONENTS.md` (reusable component specs, **not yet created** — ports from the static build's `COMPONENTS.md` at first use, not up front) follow the same convention as the old repo. Check `MANAGER.md` for today's active task scope and session history before re-deriving it. `_SCHEMA-SPECS.md` (created 2026-07-15) is a fourth doc in this split — a flat, checkable field-by-field spec per Sanity page type, distinct from MANAGER.md's dated log: Adinda marks fields approved there as they're tested in a real build, without re-reading history to find "did we settle this." Update it alongside any schema change, same habit as the other docs. `_CONTENT-STATUS.md` (created 2026-07-15) is the fifth — tracks whether the *value* in a field is real vs. placeholder (Figma-sourced copy preferred by default, stock/Pexels fallback for images Figma doesn't have enough of), a different axis from _SCHEMA-SPECS.md's field-existence tracking. Zero remaining 🔴 rows in it is a hard pre-launch gate, same weight as the other pre-launch checks already in this file. `_QA-CHECKLIST.md` (created 2026-07-15) is the sixth — for an external human reviewer's click-through pass, distinct from both: open design decisions worth a second opinion (e.g. eyebrow-toggle placement), not field approval or content-placeholder tracking. `_POLISH-BACKLOG.md` (created 2026-07-16) is the seventh — page-by-page deferred cosmetic/interaction polish from the vertical-slice build (see "Build approach"), burned down later in one polish block; distinct from _QA-CHECKLIST (that's open *decisions* for a reviewer; this is *known* polish we chose to defer).

## Local-only files — underscore prefix convention, locked 2026-07-15
Any folder or file that is internal/scratch (not real project output — handoff docs, skill-build packaging, test images, throwaway scripts) gets a leading `_` **at the repo root**. That prefix is the standing signal for "never commit this, not a real working file" — `.gitignore`'s `/_*` rule enforces it automatically. Root-anchored only, deliberately not recursive (`/_*`, not `**/_*`): Next.js App Router uses `_`-prefixed folders inside `src/app/` as a real, committed routing convention (private folders like `_components/`, `_lib/` that opt out of routing) — this rule must never touch those. When creating a new scratch file/folder, default to the `_` prefix rather than inventing a new naming scheme per task.

## Daily recap template — standing format, locked 2026-07-16
Whenever Adinda asks for a session/day recap ("give me today's recap," "what did we do," "where are we"),
use this structure every time — she journals from it and wants it consistent, not reinvented per ask.
Don't wait to be asked for each section; include all of them.

1. **What we did today** — grouped by workstream, not a flat chronological dump. Name concrete
   decisions/files/bugs, not vague summaries ("fixed the gallery" → "flattened the gallery array because
   drag-drop broke on the grouped structure"). Pull from MANAGER.md's dated entries, don't re-derive from
   memory.
2. **Sprint status** — the locked sprint-plan table (see "Website" workstream in `mari-project` skill)
   with the current period marked, PLUS a per-page breakdown: which pages have a real Figma mockup vs.
   which don't yet, and which pages need real refinement even WITH a mockup (e.g. a sub-nav or dynamic
   interaction the static mockup can't fully spec). Don't just say "on schedule" — name the specific
   bottlenecks/risks (e.g. FAQ taxonomy still open, mega-menu wiring not built) so the schedule read is
   honest, not just reassuring.
3. **Open decisions / bottlenecks** — anything waiting on Adinda, Serge, or Stefan, and anything flagged
   as "needs a second pass" or "not yet reviewed." Say plainly when something was built fast and hasn't
   been reviewed yet (don't imply reviewed-and-approved when it's actually a same-day shell).
4. **Tomorrow's plan** — prioritized, ordered list, not a grab-bag.
5. **Learnings to document** — classify anything worth keeping into: **local-only** (stays in this
   repo's CLAUDE.md/MANAGER.md, Mari-specific), **`atlas-website`-wide** (reusable across any Atlas
   liveaboard/destination site build, not just Mari), or **`drk-website`-wide** (reusable across any DRK
   client site, not just Atlas). Queue DRK-wide and Atlas-wide items into the matching `_handoff/*.md`
   file immediately, don't batch it for later.

Full spec for this format lives here; the generalized (non-Mari) version is queued for `drk-website`'s
`references/workflow.md` — see `_handoff/drk-website.md`.

## Commit cadence — commit at every checkpoint + remind at session end, locked 2026-07-16
Adinda's explicit standing instruction (she will forget otherwise, so this is on Claude to drive, not
her). Two triggers:
1. **After every MANAGER.md checkpoint is written and confirmed** — commit automatically. This is a
   durable standing authorization, not an ask-each-time: once the checkpoint exists and the
   preconditions below hold, just do it (show the message, don't block waiting for a fresh yes each time).
2. **At the natural end of a session** — if there's uncommitted work, proactively offer/remind to commit
   before wrapping, even if a checkpoint wasn't fully finished. Don't wait to be asked.

**Hard preconditions (both required, every time):**
- **Repo is verified-clean** — `tsc`/`eslint`/dev-server actually run and green, not assumed. NEVER
  commit a mid-repair or known-broken state (the reverted `useDelayedUnmount` work on 2026-07-15 is the
  precedent — that correctly stayed uncommitted).
- **Open to-dos are clearly logged** — the checkpoint (or MANAGER.md / `_SCHEMA-SPECS.md`) spells out
  what's still undecided, unreviewed, or half-done, so an incomplete-but-clean state is committed
  honestly, not as if it were finished. Committing mid-arc is fine *as long as the "what's left" is
  written down* — that's the whole trade that makes this safe.

**Safe because commits stay LOCAL** — a commit is not a push, so it's private and fully reversible.
The standing authorization here is for local commits to this private, DRK-internal repo only. **Revisit
this decision if that ever changes** (a push-to-remote habit, the repo going public, client repo access)
— same condition already attached to the "no AI-authorship traces / repo stays private" rule above.

Skill-wide for all DRK sites (Adinda's explicit ask) — queued for `drk-website`'s `references/workflow.md`
via `_handoff/drk-website.md`, generalized (drop the Mari-specific file names).

## Session bookend protocol — skills-backlog check + model + task-proposal format, locked 2026-07-16
Standing procedure that runs at BOTH triggers, every time, not on request: (a) the start of a session
when Adinda asks for a recap / "good morning", and (b) the natural end of every session. Adinda's explicit
ask so it isn't reinvented per session. Order matters — do the skills-backlog check FIRST, before proposing
or planning any work.

### 1. Skills-backlog check — FIRST, before any work is proposed
The skills live in the chat-side containers; there is **no live bridge** from this repo to them (see
`_handoff/drk-website.md`'s own explanation), so merging a handoff into a skill happens manually, in chat.
Procedure:
- Check `_handoff/*.md` for content queued into the skills but not yet merged.
- If there's a backlog, ask: **"Would you like to update those skills now in chat?"**
- If yes: hand off **one skill at a time**. For each skill give (a) a ready-to-paste prompt for the
  chat-side skill-update session, and (b) pointers to the exact handoff document(s)/sections that feed it.
  Finish one skill fully, then move to the next — don't dump all skills at once (there are often several).
- After the last skill: remind her — **"Don't forget to drop the updated skills into your Downloads folder
  when they're done, and I'll install them."** She updates + downloads in chat; the packages land in
  Downloads; Claude installs from there (per the skill install/update procedure).
- Once she confirms they're updated/installed (or says they're already done): **clean up the handoff docs**
  — strip the now-merged content out of `_handoff/*.md` and any MANAGER.md staging so the backlog doesn't
  accumulate. (Verify what actually landed before cutting anything — same care as the existing handoff
  reconciliation habit.)

### 2. State the current model
Every recap and every task proposal names the model Adinda is currently on.

### 3. Task-proposal format — three things, always
Every suggested task/plan carries all three, never just the plan: (a) the plan, (b) estimated hours,
(c) recommended model + effort per the locked model logic (no Haiku/Fable; **Sonnet-high = default**;
Sonnet-medium for menial tasks; **Opus for architecture-tier decisions**).

### 4. Ask available time, then adapt
Ask how much time / how many work blocks she has today. Adapt the proposed work to fit, and **flag
explicitly if the available time changes the sprint substantially** — never let a sprint-impacting cut pass
silently.

### 5. Granular breakdown after agreement
Once she agrees on a task, break it into a step-by-step subtask list, each subtask carrying its own hour
estimate, small enough to start immediately. (A short note of reasoning is fine on a subtask where it
genuinely matters; otherwise keep it to the step + estimate.)

Generalized (non-Mari) version queued for `drk-website`'s `references/workflow.md` via
`_handoff/drk-website.md`, alongside the daily-recap-template + commit-cadence workflow conventions.

## Review requests must always call out mobile explicitly, locked 2026-07-15
Whenever Claude asks Adinda to review/QA something in a browser, the ask must name checking the **mobile
viewport** as its own explicit step, not bundle it into a generic "look at it" — desktop-only review is the
default failure mode otherwise. Background/full writeup (iframe-`dvh` testing artifact, real-device LAN
`allowedDevOrigins` incident): `drk-website` skill's `references/troubleshooting.md`.

## `allowedDevOrigins` required for real-device LAN testing, locked 2026-07-15
`next.config.ts` sets `allowedDevOrigins: ["192.168.0.101"]` (Adinda's Wi-Fi IP — update if it changes,
check via `ipconfig`). Without it, `next dev` silently blocks the site for any device on the LAN, including
Adinda's own desktop browser when hitting the IP instead of `localhost`. Standing diagnostic rule: **when a
"broken on this device" report comes in, ask first whether it also fails via `localhost`** before
investigating device/browser-engine-specific causes. Full writeup: `drk-website` skill's
`references/troubleshooting.md`.

## No AI-tool authorship traces in the public build — hard requirement, locked 2026-07-15
Nothing in the deployed site's public output (HTML, HTTP headers, shipped JS/CSS, meta tags, Sanity Studio
copy) may reveal it was built with an AI coding tool. Checked clean as of 2026-07-15 (only hits were
dev-only comments referencing `CLAUDE.md` the file, and `ClaudeBot` in `robots.ts`'s AI-crawler policy —
neither is an authorship trace). `poweredByHeader: false` added to `next.config.ts` as a same-class bonus
hardening. Treat this as a standing pre-launch check, not a one-time pass — re-verify before the actual
launch, not just now. Full checklist: `drk-website` skill's `references/pre-launch.md`.

**Git-history question, resolved 2026-07-15:** this repo's history carries `Co-Authored-By: Claude Sonnet 5
<noreply@anthropic.com>` trailers (Claude Code's default commit format). Adinda's call: fine as-is, no
history rewrite needed — her concern is specifically clients/outsiders finding out Claude is used, not the
trailer's mere existence. Git history isn't part of the deployed build and isn't visible to a site visitor.
**Standing condition, not a one-time check: this repo must stay private, DRK-internal-only access — never
made public, never given to the client or the client's other vendors as a collaborator.** If that condition
would ever change (repo goes public, client asks for repo access, etc.), revisit this decision first.

## Session discipline (carried over from the static build, still applies)
- Verify by reading actual compiled CSS/build output, not by trusting a class or config name's apparent meaning
- Tag reusable rules `[DRK]` as they emerge — don't defer to a batch audit
- MANAGER.md (once created): archive past ~1,900 lines
- **Propose an end-of-session retrospective at the natural close of a substantive session**, locked
  2026-07-15 per Adinda's explicit request — don't wait to be asked. Trigger on: the user signaling
  they're wrapping up, or the session having accumulated a lot without one yet (3+ real bugs fixed,
  several logged decisions, conversation clearly grown long). Propose it as a question, not an automatic
  action. Covers time logging + project-specific learnings (this file/MANAGER.md) + reusable DRK-wide
  learnings (the relevant `drk-website` skill reference + a `_handoff/drk-website.md` entry). Full
  spec: `drk-website` skill's `references/workflow.md`, "End-of-session retrospective."

## Commands
```
npm run dev      # Turbopack dev server
npm run build    # Turbopack production build
npm run start    # serve production build
npm run lint     # eslint
```
