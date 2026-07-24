@AGENTS.md

# CLAUDE.md — Mari Liveaboard website (Next.js + Sanity)

Production build for Mari Liveaboard, by Atlas (DRK Digital). Migrates the locked static homepage
(`../v1-static-homepage`, frozen — do not edit) into a real Next.js + Sanity site, then builds every
other page directly against Figma/spec (no static intermediate step for non-homepage pages).

## Working principle — ship fast, document everything, avoid costly-to-reverse decisions (locked 2026-07-15)
Locked explicitly by Adinda, this governs every decision in this file and in MANAGER.md: the goal is
a working website presented as quickly as possible, with every decision made along the way written
down (MANAGER.md, this file, `_internal/handoff/*.md`) so no work is ever lost — not a goal of getting every
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
queued for `drk-website` via `_internal/handoff/drk-website.md`.

## MANAGER.md's ACTIVE QUEUE overrides the skill's sprint — locked 2026-07-16
`mari-project`'s `working/sprint.md` is a **planning artifact that drifts**: it can't know about work queued
after it was written, and there's no live bridge from this repo to the chat-side skills. **MANAGER.md's
"🔴 ACTIVE QUEUE" section is authoritative for what to do next and in what order** — read it before planning
any session, and where it and the skill's sprint disagree, the queue wins. Adinda's explicit call: log sprint
deviations in MANAGER.md immediately rather than waiting for a skill-update round, because this file and
MANAGER.md load first. **This does not make the sprint useless** — it's still the source for the launch
timeline, the QA-pass scopes, and the page inventory. It's specifically the *day-by-day ordering* that goes
stale. When a deviation pushes a dated sprint item, **say so explicitly** rather than quietly absorbing it.

## Skills to load this session
- `drk-website` — stack conventions (this file adds only what's Mari-specific)
- `atlas-website` — liveaboard page inventory/content checklists
- `mari-core` — brand/product facts (source of truth for boat/destination/brand facts)
- `mari-website` — **content LOOKUP LIBRARY ONLY** (page copy / SEO / URL reference). Do NOT auto-adhere,
  and do NOT run it unprompted — consult it only when Adinda explicitly asks to fetch or look something up.
  It is a reference to pull from, not a spec to follow. (Locked 2026-07-20, Adinda.)
- **`mari-project` REMOVED 2026-07-20 (Adinda).** It duplicated and clashed with MANAGER.md — two competing
  trackers. **MANAGER.md is now the SINGLE source of truth for status / queue / day-ordering.** The
  chat-side skill source still exists; reinstall only if a non-repo context ever needs it.
Load `atlas-destinations` / `mari-itineraries` only for destination or itinerary work specifically.

## 🔑 Precedence — TWO layers, and `_internal/handoff/` is NOT one of them (locked 2026-07-20, Adinda)
> **`CLAUDE.md` + `rules/*.md` (project) — SUPERSEDES → skills (portable)**

**Placement test, one question: "would this be true on another DRK project?"** Yes → the skill. No → here.
Yes-but-we-differ → here, as a one-line override that **names what it overrides**. Detail/war-stories →
`rules/*.md`. **A fact lives in exactly ONE place.**

**Exception — locked decisions keep a one-line tripwire here even when a skill carries the detail.** Not
hypothetical: `drk-website`'s Figma rule once said the *opposite* of the locked "conventions always win" and
silently produced an over-literal boat page. With no local assertion there was nothing to catch it against.

**`_internal/handoff/*.md` is an OUTBOX, not a knowledge layer** — write-only staging for decisions not yet merged
into the chat-side skills (there is no live bridge). **Do not read it to decide what is true**; merge it
promptly instead. Full routing rule: `_internal/PHASE3-PLAN.md` §1b.
⚠️ **Until Phase 3 lands, the old behaviour still applies as a stopgap:** skills may be stale relative to
`_internal/handoff/*.md`, so when a skill's content is load-bearing and looks outdated, check the handoff and flag
the conflict to Adinda rather than silently picking one. **Verify a chat-side item's status against
`~/.claude/skills/` directly — repo docs go stale silently** (on 2026-07-20 both `_internal/RESUME.md` and
`MANAGER.md` still called the 3 urgent skill fixes "queued" days after they had shipped).

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

**Paragraph spacing in rich text — the WRAPPER owns it (locked 2026-07-21, Adinda).** `RichText`
blocks carry no margins, so every wrapper around `<RichText>` must be a flex column with a gap or
multi-paragraph copy renders unseparated (shipped that way in the boat FAQ before this was caught).
Values step with the type size: **body-large → `gap-16`, body-medium → `gap-12`** (responsive text
steps the gap with it). Full reasoning in `RichText.tsx`'s header.

**Accordion chevron glyph — THE STANDARD is `h-[6.5px] w-[10px]` + `[mask-size:100%_100%]`, inside
a `size-[20px]` centering box (locked 2026-07-21, Adinda).** Never `size-[10px]` + `contain` — that
renders the nav-chevron mask ~7.6px tall and reads elongated (tuning history in `BoatSpecs.tsx`;
5.5px was tried and read as a pancake). Applies to every accordion/expander site-wide (Specs,
homepage FAQ, boat FAQ all conform); goes into the shared accordion component's contract at the
componentization pass.

**Accordion row hover — a closed row takes the ACTIVE row's COLOR treatment on hover (locked
2026-07-21, Adinda).** Colors/opacity/border-color/chevron color only — never the active state's
size or typography changes (no body-large→editorial-h5 swap, no weight bump), never the chevron
rotation, never expansion. Hover = "looks lit like the open one," not "looks open." Applied in
`Faq.tsx`, `BoatFaq.tsx`, `BoatSpecs.tsx`; part of the shared accordion component's contract at
the componentization pass, same as the glyph standard above.

## Building a section: ASK FOR THE FIGMA LINK + SCREENSHOT FIRST — locked 2026-07-17 (Adinda)
**Standing rule, every section, no exceptions.** Before building any page section, **ask Adinda for the
Figma node link and a screenshot**, then pull `get_design_context` on that node for exact values. Do not
start from a node NAME, a node ID out of a skill doc, or the section's position in a list.

**Why this is a rule and not a preference — it cost most of a session on 2026-07-17.** The boat page's
first pass was built from node names and guesses. Two examples of what that produces:
- `Block/HighlightCard` was assumed to be "a card with text over an image". It is an image with a heading
  and list **below** it, on the page background. Nothing is overlaid. The name implied a card; the design
  wasn't one.
- The bullet was assumed to be an icon asset and faked with a rotated square. It is the **character `✦`**
  at 18px in `action-primary` — which is *why* no matching SVG exists in `/assets`. Hunting for the "missing
  icon" was hunting for something that was never supposed to exist.
`get_design_context` returns the real type ramp, colour token, and spacing for every node. It is cheap.
Guessing produced ~8 wrong values in one section and a full rebuild. **Adinda's own framing: "the assets
will be there, so you don't have to make things up and guess."**

**Reference implementations — copy these, don't re-derive:** `BoatHero.tsx` and `BoatOverview.tsx` (built
2026-07-17, reviewed by Adinda). Between them they demonstrate the scrim recipe, the `*-ondark-*` family
over photos, `data-reveal`, arbitrary values for off-scale spacing, the measure-then-animate collapse, and
the mask-based fade. Read one before starting a new section.

## 🔴 ESTABLISHED CONVENTIONS ALWAYS SUPERSEDE FIGMA — locked 2026-07-17 (Adinda, explicit, site-wide)
**When a Figma node disagrees with a convention this codebase has already established, THE CONVENTION
WINS. Every time. Do not "match the mockup" against a token, a scale step, or a spacing rhythm we have
already settled.** Figma is authoritative for **structure and intent** (what elements exist, what order,
what the section *is*). The codebase is authoritative for **how it's expressed** — type ramp, spacing
scale, colour tokens, gutters, responsive behaviour.

**Why this is a hard rule and not a preference.** Figma drifts continuously and *silently*, and this repo
already has four proven instances where following the node would have shipped a regression:
1. **Spacing (2026-07-17, the one that prompted this lock).** Cabins' Figma says `gap-8` between the
   section heading and its description. Every homepage section uses **`gap-24`** (`TheBoat.tsx`). Built
   from Figma, the boat page would be visibly out of rhythm with the homepage — on a page a visitor
   reaches *from* the homepage.
2. **Background (2026-07-17).** `Section/LayoutAndSpecs` (778:8878) says `#fdfcfa` (`beige-50`). But
   `bg-page` was deliberately moved OFF `beige-50` ONTO `beige-100 #fbf8f2` on 2026-07-16 because
   beige-50 "read too white" — Adinda's own call. Figma never got the memo. **Keep `bg-bg-page`.**
3. **Colour names.** Figma's code-syntax bindings still emit `var(--primitive-cream-30)`. Those names
   **no longer exist**. Any CSS name from the Figma MCP is STALE by default — resolve it through the map
   in `globals.css`, never paste it.
4. **Gutters.** Figma emits flat `px-[160px]` / `px-[24px]`. We have **`page-gutter-x`** (24/48/80
   responsive). A flat pixel gutter is a mobile bug waiting to happen.

**The practical test, before writing any value off a node:** *"Do we already have a name for this?"*
- A spacing gap → is it on the scale, and what do sibling sections use? **Check a homepage section first.**
- A colour → resolve the hex through `globals.css`'s map. Never trust the Figma name.
- A type size → find the ramp entry (`display-*` vs `editorial-*`), don't set a px size.
- A gutter → `page-gutter-x`, essentially always.
- **Only when we genuinely have NO name for it** does the Figma value win — and then it's an arbitrary
  value (`gap-[34px]`), never a rounded guess. (See the off-scale rule below: there is no 40 and no 120.)

**This does NOT license ignoring Figma.** The 2026-07-17 boat-page rebuild happened because a section was
built from node *names* and guesses instead of `get_design_context`. **Still pull the node, every time.**
The rule is about which side wins a *conflict*, not about skipping the pull. And when you override Figma,
**say so in a code comment naming both values** — otherwise the next session "fixes" it back.

Skill-wide (Adinda's explicit ask, 2026-07-17) — queued for `drk-website` via `_internal/handoff/_payload/drk-website.md`.

## Tailwind: THE CLASS NAME MUST EXIST. Verify against `globals.css` — locked 2026-07-17
**Tailwind emits nothing for a class it doesn't recognise. It does not warn, does not error, does not
fail the build.** An invented utility is invisible in `tsc`, `eslint`, and a `curl` 200 — it shows up only
as a page that looks broken, which is exactly how the 2026-07-17 boat hero shipped with dark navy text on a
bright photo and a stats strip reading "CabinsGuestsBoat SizeCrew". **A class name that "looks like" the
design system is the single easiest way to silently break a page here.**

Three specific traps, all hit in one session:
1. **There is NO `beige-*` / `navy-*` / `chocolate-*` colour utility.** Those are *primitives*
   (`--beige-100`), deliberately not exposed. The `@theme` layer exposes a **semantic** set only:
   `text-primary`, `bg-page`, `accent-muted`, `action-primary`, `border-default`, … For text over a photo
   the family is **`*-ondark-*`** / **`*-onimage-*`** (`text-text-ondark-primary`,
   `accent-ondark-primary`, `background-ondark-page`). Composes with the hex-not-name rule below: the
   primitives were renamed, so a plausible primitive name may not exist *or* may be a different colour.
2. **The spacing scale is `0,2,4,8,12,16,20,24,32,48,64,80,96,128,160`. There is NO 40 and NO 120.**
   Figma uses both. **Write them as arbitrary values (`gap-[40px]`, `py-[120px]`) — do NOT round to
   48/128.** Rounding is what makes a build look "nearly right" and drift from the mockup.
3. **Two heading ramps, not interchangeable — `display-*` vs `editorial-*`.** `display-*` anchors a
   section (the page H1, a section H2): large, tight leading, negative tracking, always set by a
   *component*. `editorial-*` is a heading *within body copy* — which is what rich text is. **Any heading
   an editor types in a rich-text field maps to `editorial-*`.** Picking by number alone (`h3` → whichever
   ramp) renders a body subheading at section-title scale.

**How to check, before writing the class:** `grep -oE "^\s*--color-[a-z0-9-]+" src/app/globals.css` for
colours, `--spacing-` for the scale, `--text-` for typography. This is the same "verify by reading the
actual compiled CSS, not by trusting a name" discipline already in Session discipline below — it just has
teeth now.

**Corollary — a wrong-looking page is not always OUR bug.** On 2026-07-17 a screenshot of the Overview on a
black background looked like a broken `bg-bg-page`. Every token resolved correctly; the screenshot was the
*Figma frame* on a dark canvas, not our render. **The tell was content, not colour** — the image's eyebrow
read "Liveboard Indonesia Overview" while our page rendered "Premium diving at exceptional value", so it
could not have been our page. **Check the compiled CSS and the rendered content before "fixing" a report.**

## A schema field that nothing renders is a promise, not a feature — locked 2026-07-17
Three bugs of the identical shape surfaced in one session on the boat page's first real render. In each,
Studio offered an editor a control, the schema documented it, and **the frontend silently ignored it** —
so it appeared to work and did nothing:
- **`{boat}` / `{destination}` tokens** — the schemas promised "the frontend swaps it in per page" since
  2026-07-16. No resolver existed. It would have shipped printing `Life aboard {boat}`, braces and all.
- **Rich-text headings + underline/strike/code/ordered lists** — `richTextFull` offers H1–H6 and five
  marks; `RichText.tsx` had no `block` styles at all and rendered 3 of 5 marks. An editor applying "H3"
  saw nothing change.
- **Sanity `hotspot`** — enabled on every image object, so an editor can drag a focal point. `urlForImage`
  is called with no width/height, so Sanity never applies it and CSS centre-crops. Still open, deferred to
  polish.
**Why all three hid:** nothing had ever *rendered* the field. Schema-before-frontend means a field can sit
"done" for weeks with no consumer. **So: when a slice first renders a field, verify the field's BEHAVIOUR,
not just that text appears** — the `{boat}` resolver was proven by seeing "Life aboard Mari" on the page,
and the heading gap only surfaced once a body containing a real heading was seeded. **Seed content that
exercises the behaviour, not just content that fills the box.**

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
`drk-website` via `_internal/handoff/drk-website.md`).

**Known follow-up:** `seo.ts`'s `ogImage`/`twitterImage`/`siteSettings` social images are still bare
`type: 'image'` without an alt field — technically an exception to "every image has editable alt."
Social meta images use a separate `og:image:alt` mechanism, so it's a judgment call whether to add
alt there; flagged for review, not yet changed (see _internal/QA-CHECKLIST.md).

**Also queued for the `drk-website` skill** (this is a DRK-wide convention, not Mari-specific) — see
`_internal/handoff/drk-website.md`.

## Sanity image pipeline — UPLOAD FULL-RES, DO NOT PRE-COMPRESS. Measured 2026-07-17, not assumed.
**Supersedes the old "compress/resize BEFORE upload" rule, which was wrong.** Every number below was
measured against our own CDN (`kb8eim50`, asset `1b3c0a0f…-1600x1200`) with real HTTP requests — not read
off a doc, not synthesised. Re-measure before overriding; don't re-derive from training data.

### The rule
**Rename → upload the highest-res master you have → let the CDN size and compress it.** Nothing else.
`urlFor()` is a pure string builder (zero API quota); the CDN generates each variant on demand and caches
it indefinitely, keyed on the exact URL string.

### Why pre-compressing is actively wrong (both halves of the old rationale failed)
- **Bandwidth** [INFERENCE — not explicitly documented, flagged 2026-07-17]: the quota is defined as
  *"total **outgoing** bandwidth"* (plans-and-payments), and outgoing = what's served, so a 12MB master
  served as a 52KB thumbnail should cost 52KB. **Sanity has NO page that states quota = served-not-stored
  in so many words** — a Perplexity pass over the official docs specifically failed to confirm it. Treat
  as well-founded but unproven; if a bill ever looks wrong, this assumption is the first suspect. Either
  way the old "10GB/mo cap ⇒ pre-compress" rationale doesn't follow: pre-compressing shrinks the *stored*
  file, and nothing suggests stored size is what's billed.
- **Perf**: the CDN already beats best-practice targets by ~3× unaided (numbers below). There is nothing
  left to win, and pre-compressing destroys the archival master permanently.
- Sanity's own docs agree: *"Content managers are advised to upload full-resolution assets"* and *"You
  don't need to optimize images before uploading."*

### Measured output — `w=1296&q=80&auto=format`, TWO sources, and the gap between them IS the lesson
| Source | Cold (1st hit) | Warm |
|---|---|---|
| `destination-bali.webp` 1600×1200 — **already a crushed WebP** | WebP 69.2 KB | AVIF **52.3 KB** |
| `mari-key-features-smoketest.jpg` 1535×1024 — **real JPEG** | WebP 207 KB | AVIF **179 KB** |
**3.4× apart on the same pipeline.** The WebP source looks "better" only because it was already
degraded before upload — that is the generational-loss problem showing up as a flattering number, not a
win. **Benchmark against a JPEG source; a WebP-source measurement will lie to you.**

`q` sweep, JPEG source at `w=1296` (bytes): q1 → 34,698 WebP · q50 → 128,660 · q70 → 159,654 ·
**q75 → 169,378** · **q80 → 206,546** · q90 → 306,568 · q100 → 561,850 (still lossy). Note the
**q75→q80 knee: +22% bytes for one notch.**

- **It does NOT always serve WebP — it serves AVIF.** `auto=format` negotiates on the `Accept` header
  only (`Vary: origin, accept`): AVIF → modern Chrome, WebP → WebP-only, JPEG → old browsers.
- **`fm=avif` returns HTTP 400** — exact error: `Parameter "fm" must be one of: "jpg", "pjpg", "png",
  "webp", "gif" or "json"`. AVIF is reachable ONLY via `auto=format`. `.format()`'s TS union is
  `'jpg' | 'pjpg' | 'png' | 'webp'` (`@sanity/image-url@2.1.1`), so `gif`/`json` are URL-reachable but
  untyped, and AVIF is reachable via neither. **Always set `.auto('format')`** — it is the only path to
  the best format.
- 🔴 **AVIF IS ASYNC, PER-URL — the first visitor to EVERY distinct URL gets WebP.** **This is DOCUMENTED
  behaviour, not a discovery** — `sanity.io/docs/help/avif` says the first few requests return "the second
  best option" (WebP) with AVIF appearing after a short delay, and that older cached objects keep serving
  non-AVIF until they expire. It's also *why* `fm=avif` 400s: AVIF is generated asynchronously, so it
  can't be demanded synchronously. Measured repeatedly here too (`w=777` never converted within 25s). A
  5-width srcset × DPR ≈ 10 URLs, each
  needing its own warm-up, so **real traffic gets a WebP/AVIF mix and the cold path is the one to design
  for.** Two consequences: (a) never benchmark image bytes cold — it understates by ~15% and is why two
  measurements of the same URL disagreed this session; (b) **quality must be chosen against the COLD WebP
  path, not the warm AVIF one.**
- **USE `q=75`, NOT `q=80`** — corrected 2026-07-17 after measurement; an earlier draft of this section
  said q=80 and was wrong. Against Chrome's 1.33 bits/px flag line (1296×865 = 1.12MP → ceiling ≈187KB):
  AVIF q80 = 179KB (0.159 B/px ✅) but **cold WebP q80 = 207KB (0.184 B/px ❌ FLAGGED)**. q75 stays under
  in *both* paths (WebP 169KB / 0.151 B/px ✅). q=80 only passes if you assume the warm path, which most
  first-time visitors don't get.
- **`q` is applied LITERALLY to whichever encoder `auto=format` picks — no cross-format normalisation.**
  q=80 → 254,282 JPEG / 206,546 WebP / 178,755 AVIF from one source. Since WebP q80 ≈ JPEG q67
  perceptually (scales are offset), **one `q` silently means three different qualities across visitors.**
  Nothing to do about it; just don't assume `q` is a perceptual constant.
- **No lossless path.** q=100 still re-encodes; `lossless=true` is **silently ignored**; `q=0` silently
  ignored → default. `q=101`/`q=-5` → 400. `q` has no floor (q=1 → 34,698 B), so a typo'd low q ships
  mush with no error.
- **Docs are WRONG twice — trust these measurements over the doc pages:**
  (a) docs say *"Defaults are 75 for JPG and WebP"* — measured **JPEG default is 80** (`fm=jpg` with no q
  ≡ `q=80`); WebP default is 75 ✓.
  (b) docs say a bare asset URL serves *"the original asset"* — **false for JPEG and WebP**: bare URL
  re-encodes (JPEG 721,218 → 323,501 B, −55%; WebP 134,572 → 113,702, −15%). **PNG alone is byte-exact.**
  So `<img src={asset.url}>` ships ~323KB not 721KB (better than feared) — but **the archival original is
  NOT retrievable through the CDN for JPEG/WebP.** Keep masters outside Sanity if they matter.
- ⚠️ **PNG + `w=` without `auto=format` INFLATES the file** — a 2,529,858 B PNG at `w=1296` returned
  **3,167,020 B, larger than the source.** Always pair PNG with `auto=format`.
- ⚠️ **It upscales happily past the source and will not stop you** — `w=3000&q=100&fm=jpg` from a 1535px
  source → **3,465,195 B** of upscaled mush. **`fit('max')` is the ONLY guard.** Mandatory on lightbox.
- **EXIF/ICC are stripped at every quality; chroma subsampling is locked 4:2:0 even at q=100**, with no
  param to change it. Output is sRGB; `cs` is the only colour control. Fine for reef photography, would
  matter for wide-gamut work.
- **The "Sanity is Imgix under the hood" claim (common in blogs) looks FALSE** — headers show `X-Varnish-Age`
  (Imgix uses Fastly) and `x-sanity-asset-storage: gcs-default`; errors are Boom-format JSON, not Imgix's.
  The *param vocabulary* is Imgix-inspired, which is likely what those blogs pattern-matched. Actual
  encoder: **not documented.** Don't repeat the Imgix claim.

### Frontend rules that make or break the above
- **Use the `next-sanity/image` loader, NOT bare `next/image`.** Bare `next/image` proxies through
  `/_next/image` where Sharp RE-ENCODES what Sanity already encoded — two lossy passes, two caches.
  Exactly one system may own format negotiation, and it must be Sanity's CDN.
- **`sizes` is mandatory on any image not at 100vw.** Omitting it makes the browser assume 100vw and
  download ~2×. For the boat gallery (~45vw): `sizes="(max-width: 768px) 100vw, 45vw"`.
- 🔴 **NONE OF THE ABOVE IS WIRED UP TODAY — verified by reading the code 2026-07-17.**
  `sanityImageProps()` (`src/sanity/lib/image.ts`) returns `urlForImage(image).url()` — **a bare URL with
  no `.width()`, no `.quality()`, no `.auto('format')`.** So right now: no `q=75`, no AVIF negotiation, no
  `fit('max')` guard, and **hotspot cannot work** (the builder needs width/height before Sanity applies it
  — this is the root cause of the hotspot bug already logged above). Next's own optimizer does the resizing
  (enabled by `cdn.sanity.io` in `remotePatterns`), which means **we re-encode what Sanity already
  re-encoded** — the exact double-pass this section warns against. **Consequence: `images.qualities:
  [75, 80]` is NOT dead code today — it is the only quality control actually in effect.** It only becomes
  dead once we move to a Sanity loader. Don't delete it before then.
  **The fix is `images.loaderFile` in `next.config.ts`**, NOT a per-`<Image>` `loader` prop — the code
  comment in `image.ts` correctly notes a `loader` function can't cross the RSC boundary from a Server
  Component, but a *global* `loaderFile` is config, not a prop, so it sidesteps that entirely. Deferred to
  `_internal/POLISH-BACKLOG.md`. **Until it lands, everything above is theory.**
- **Centralise `urlFor()` in one helper.** The CDN cache key is the exact URL string; inconsistent param
  order across components = cache misses + repeated transform cost.
- `fit('crop')` is what honours the editor's hotspot — and requires querying `hotspot`/`crop` alongside
  the asset. `fit('max')` for lightbox so it never upscales past the master.

### Upload source format — JPEG/TIFF/PNG, never WebP (**for quality reasons, NOT support reasons**)
⚠️ **Corrected 2026-07-17 via Perplexity + doc dates.** An earlier draft said WebP "isn't a supported
upload, it appears only as a delivery target" — **that was wrong, and it came from a stale page.**
`studio/image-type` (2026-04-14) lists archival originals as JPG/SVG/PNG/GIF/TIFF, but
`content-lake/technical-limits` (2026-06-23) and the animated-images changelog both confirm **WebP
uploads ARE supported.** The image-type page conflicts with newer docs; **trust technical-limits and
image-urls (2026-06-15) over it.** Where two Sanity pages disagree, take the newer one.
**The rule survives the correction, on different grounds:** don't upload WebP because it's a *lossy
source*, not because it's rejected. Transforms re-encode from the stored original, so a lossy WebP master
makes every served variant **lossy→lossy**. Sanity nowhere states this explicitly — it's inference from
documented on-demand transform behaviour, but the two-source measurement above is what makes it concrete
(the WebP-source asset measured 3.4× smaller *because it had already been degraded*).
🔴 **Known debt: the existing seed already uploaded WebP**
(`destination-bali.webp`, `why-us-crew.webp`, `destination-halmahera.webp`, …). Placeholder content, so
low stakes — but do not repeat it for real photos, and re-upload these from JPEG when real assets land.

### Size targets (sourced: Chrome DevTools `ImageDelivery.ts`, tightened 2.0 → 1.33 bits/px in Lighthouse 13)
- Gallery thumbnail at 45vw: served **648px @1x / 1296px @2x** (1440 viewport). Ceiling **~46KB @1x,
  ~187KB @2x**. Measured from a real JPEG source at q75: **169KB cold-WebP / ~150KB warm-AVIF @2x** —
  inside, but with far less headroom than it first appeared. (An earlier draft claimed "26KB / 52KB
  comfortably inside" — that was measured off an already-crushed WebP source and was wrong. See the
  two-source table above.)
- Lightbox: cap **1920** (`fit('max')`, `q=70`). 2560@2x costs ~600KB and ~14.7MB decode RAM per image.
- Ladder: **640 / 900 / 1280 / 1600 / 1920**.
- ⚠️ The widely-repeated **"Google recommends ~200KB per image" rule traces to no Google source** —
  it is invented. Don't cite it. Real reference point: HTTP Archive 2024 median largest-image-per-page
  = 135KB (p75 404KB).
- A 45vw thumbnail **can become the LCP element** (≈280,000px² vs ≈108,000px² for a two-line H1). Escape
  hatch: below-the-fold elements aren't LCP candidates. If a thumbnail IS above the fold, `priority` on
  that ONE only; otherwise `loading="lazy"`.

### 🔴 Known gap on this project — we have no masters
Every boat-page gallery source in `G:\My Drive\##MARI\02. IMAGES` is **already a web export**: 19 of 25
are 1535×1024, only 2 are 2400px, and `boat/originals/mari-liveaboard-exterior-001-original.jpeg` is
1176×784 — *smaller than its own derivative*. So `originals/` is not originals. Consequence: thumbnails
are fine (1296@2x fits), but the **lightbox caps at ~1500 instead of 1920**. Seven sources are PNG-encoded
photos (up to 7.68MB) — pure storage waste, but harmless: the CDN re-encodes on serve, so visitors never
pay. Not worth converting.

**RESOLVED-AS-FAR-AS-IT-GOES 2026-07-17 — do NOT re-open this looking for masters.** Checked Ayu's shared
`Mari Liveaboard Photos` folder: it holds the **same files at the same byte sizes** (`Corridor 1` 652,226 ≡
0.62MB local; `Main Deck` 802,695 ≡ 0.77MB; `Sunset drink on the Sky deck.png` 2,529,858 ≡ 2.41MB). That
folder **IS** the source of the `##MARI` copies — there is no higher-res tier hiding in Drive, and **Ayu no
longer works for Mari**, so there's no one to ask there. **1535px is the ceiling; treat it as final and
ship.** Only two accounts could plausibly hold true originals if they exist at all —
**`sergedahan@gmail.com`** (owns `mari-liveaboard-deck-003.jpg`) and **`mariliveaboard.marketing@gmail.com`**
(owns `Sunset drink on the Sky deck.png`). Worth one passing question to Serge someday; **not worth
blocking on** — thumbnails are unaffected and only the lightbox is mildly compromised. If masters ever
surface, re-upload is cheap.

**Mine the photographer's ORIGINAL filenames — they carry location facts our renames destroyed.** The
shared folder names distinguish `Sky Deck` from `Sundeck Main Deck` / `Sundeck 1` / `Long chairs Sundeck
Main Deck`, and include `Divedeck` and `Lounge Area 1/2`. Whoever shot them treated sky deck and the
main-deck sundeck as **different spaces**. (That read as evidence against `mari-core`'s three-outdoor-space
inventory — **resolved 2026-07-21: Adinda confirmed mari-core is correct; the inventory stands, question
closed.** The read-the-filename lesson itself still applies.) Our rename to
`common-006-sundeck-1-sunbeds` dropped "Main Deck" and lost that. **Read the original filename before
naming a photo.**

Skill-wide — this is DRK-wide, not Mari-specific. Queued for `drk-website` via `_internal/handoff/drk-website.md`.

## Image size targets come from the COMPONENT, never from an assumption — locked 2026-07-17
**The whole session's image audit was computed twice because the first pass guessed the viewport
fraction.** "The gallery is ~45% of viewport width" was taken from a passing remark and never checked.
`BoatGallery.tsx` actually declares `sizes="(min-width: 1024px) 55vw, 100vw"` — **55vw, not 45** — so the
real 2x target is **1584px, not 1296px**. Every "this image is fine / too small" verdict flipped. **Read
the component's `sizes` + its aspect box before computing a single number.** The component is the
authority; a number in a conversation is not.

**The non-obvious rule that fell out of it — in a cover-cropped grid, PORTRAITS are width-bound.**
The carousel slot is a fixed `aspect-[708/532]` box with `object-cover`, so a portrait is cropped to
landscape and its **width** is what must clear the target — orientation buys it nothing. Result: our
landscape shots at 1535px pass, while portraits at 1023–1219px fail by up to 1.55×, *from the same
source resolution*. **The failures cluster on portraits, and that is not intuitive.** Corollary: a
portrait passes the LIGHTBOX easily (`object-contain`, height-bound) while failing the carousel — so
"is this image big enough" has no single answer, only a per-slot one.

## The filename LIES. View the image before naming it — locked 2026-07-17
Proven twice in one session, on files that had *already been hand-renamed*:
- `common-004-sundeck-2-beanbags.jpg` is maroon beanbags **under a shade net** — i.e. `mari-core`'s
  "shaded lounge deck", verbatim. Not a sundeck, not the sky deck. **Wrong twice in one name.**
- `Corridor 1 - Mari Liveaboard.jpg` is an **exterior side deck** in golden light, not a corridor.
- `mari-liveaboard-exterior-001-original.jpeg` is **1176×784 — smaller than its own "derivative"**
  (1264×843). The word "original" was decorative.

**But the photographer's ORIGINAL filenames carry real location facts our renames destroyed** — the
shared folder distinguishes `Sky Deck` from `Sundeck Main Deck` / `Sundeck 1` / `Long chairs Sundeck
Main Deck`, plus `Divedeck` and `Lounge Area 1/2`. Whoever shot them treated sky deck and the
main-deck sundeck as **different spaces** (a question since closed — Adinda confirmed mari-core's
three-space inventory correct, 2026-07-21). Our rename to `common-006-sundeck-1-sunbeds` dropped "Main Deck".
**So: read the original filename AND look at the image. Neither alone is enough.**

**Adinda's resolution to the resulting deck-naming mess (2026-07-17), and it's the reusable trick:**
**name the descriptor after what is IN THE FRAME, never after a claim about which deck it is** —
`beanbags-under-shade-net`, `bow-sun-mattresses`, `sun-loungers-sea-view`. A filename that makes no
location claim cannot be wrong when Serge answers, so the naming never blocks on the content question.

## Renaming must NEVER re-encode — preserve the source extension — locked 2026-07-17
A rename is a copy. `.jpeg` → `.jpg` is fine (extension text only). **`.png` → `.jpg` is not a rename,
it is a lossy re-encode**, and it contradicts the upload-full-res rule directly. Seven boat-page sources
are PNG-encoded photographs (up to 7.68MB) — they stay PNG. It costs the visitor nothing (Sanity
re-encodes on delivery) and preserves the best master we have. **Convention is
`mari-liveaboard-{category}-{nn}-{2-3 words}.{whatever the source already is}`.**

## Google Drive: "Shared with me" is NOT synced — a shortcut mounts it — locked 2026-07-17
Drive for Desktop syncs `My Drive` (here `G:\My Drive`) but **not** "Shared with me". A shared folder
becomes locally readable only after **right-click → Organise → Add shortcut to Drive**, which mounts it
under `G:\.shortcut-targets-by-id\<id>\`. Until then it is invisible to every local tool.
**The Drive MCP connector is NOT a substitute** — two hard limits, both hit this session:
1. `download_file_internal/content-scratch` returns **base64 into context** (~350k tokens per MB). Not viable for even
   one photo, let alone a folder.
2. **File metadata carries NO pixel dimensions** — only name, bytes, MIME. So "is this file
   higher-resolution?" is **unanswerable** from the connector. Bytes are a hint, not an answer: a
   bloated PNG of a small image is indistinguishable from a real master, and this repo already contains
   that exact trap (see the `-original` file above).
**So the connector is for FINDING and DECIDING; a synced path is for READING.** Ask for the shortcut
early — it's ten seconds and it unblocks visual matching, dimension audits, and copying.

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
the skill in `_internal/handoff/drk-website.md`.

## SubNav scroll chrome — LOCKED PATTERN, site-wide + future DRK sites (2026-07-21, Adinda)
The in-page section navigation and its scroll ladder are a locked pattern; the behavior contract
lives in `src/components/SubNav.tsx`'s header (anchors + IntersectionObserver positional scroll-spy
+ TabRail mobile + the two-row compact floating chrome with the main nav). **Desktop ladder: dark
nav over hero → ONE switch to compact light nav row + navy-glass section row; no intermediate
states, no scroll-direction logic. Mobile: nav always visible, chip bar beneath.** Registered
component names for the componentization pass: `SubNav`, `TabRail`, `SingleImageCarousel`,
`LightboxGallery` (variant `default`), `CarouselChevron`. Queued for `drk-website` via
`_internal/handoff/drk-website.md`.

## FAQ section layout variants — `default` / `categorized` (locked 2026-07-17, Adinda)
The FAQ section repeats site-wide in two shapes, and they are ONE component with a `layout` field, not two
components. **The field values are `default` and `categorized`** — named for what the variant *does*, not
what it looks like (rejected: `stacked`/`split`, `fullWidth`/`twoColumn`, both of which describe geometry
and say nothing about *why* the second variant exists — it exists because there are categories).
- **`default`** — accordion, full width. The homepage FAQ.
- **`categorized`** — category list down the left (active = left border bar), Q&A accordion right; on
  mobile the categories become horizontally draggable chips, same as Destinations. The boat page FAQ.
**This is a schema field `name`, so it is in the expensive-to-change bucket per the 80/20 rule** — that's
why it was decided before the field was written rather than after. **Not built yet** (boat FAQ §4 not
started); apply these exact values when it is. Still open: whether the editor picks the variant per-section
or it's fixed per page type.

## An empty tab/section doesn't render — hide it, don't explain it (locked 2026-07-17, Adinda)
**A gallery tab with no images tagged to it is not shown to the visitor.** The category list
(`galleryCategories.ts`) stays fixed and complete; the *render* is what adapts. No category is ever
special-cased in a component.

**This replaced a worse fix, and the difference is the lesson.** Asked what to do about 'Others' (a
Figma tab with only one plausible image), the first answer was to delete the category from the schema.
Adinda's correction: the value is fine — *"as long as it's empty ... we don't need to show that."*
**Deleting the category solves one instance; hiding empty tabs solves the class** — and it means an
unused category costs nothing, the editor still sees the row in Studio (so they can tag an image to it),
and the tab appears by itself the moment one is. **When a piece of content is empty, prefer a general
"hide what's empty" rule over removing the thing from the model.**

⚠️ **Consequence to remember:** the boat gallery has ZERO images in Sanity today, so the entire gallery
section currently renders **nothing at all**. That is correct behaviour, not a bug — it resolves as soon
as images are uploaded and tagged. Don't debug it.

Also note the earlier "an empty tab says so rather than collapsing" comment in `BoatGallery.tsx` was
removed — it argued the opposite, for the editor's benefit. Studio is where the editor sees the empty
tab; the public page is not the place to explain the CMS to a visitor.

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
     the mockup + functional," and defer all purely-cosmetic polish to `_internal/POLISH-BACKLOG.md` — burned down
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
     `_internal/CONTENT-STATUS.md`), never "which components were never connected." **Carve-out:** genuinely global
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
The full-wire-per-slice rule is ALSO queued for `drk-website` (see `_internal/handoff/drk-website.md`), marked
under-test until the build confirms it end-to-end.
   - **SEO + image pipeline fold INTO each slice, not a separate end-pass (locked 2026-07-16, Adinda).**
     Every page slice also does, in-slice: (a) **SEO structure** — fill the `seo` field, emit page-scoped
     `FAQPage`/`Organization`/etc. JSON-LD, use semantic HTML (`<details>/<summary>` + heading per question,
     answer-first copy), stable `#anchor` per Q&A; (b) **image pipeline** — rename real photos to descriptive
     kebab-case (the Sanity CDN vanity URL derives from the filename) before upload. Rationale (Adinda): cheap
     while the page is fresh + most photos are final (not wasted), vs. a painful, error-prone manual end-pass.
     ⚠️ **This rule USED to also say "compress/resize BEFORE upload (perf + the Sanity 10GB/mo bandwidth cap)"
     — that half was measured WRONG on 2026-07-17 and is deleted. Upload full-res masters; do NOT pre-compress.
     The bandwidth cap counts SERVED bytes, not stored, so pre-compressing saves nothing and destroys the
     archival master. See "Sanity image pipeline" below for the measurements. The RENAME half stands.** Keep ONLY a **light final SEO
     review** (holistic keyword/cannibalization check, structured-data validation, sitemap completeness) — not
     a from-scratch content pass. Same principle as full-wire-per-slice. FAQ SEO/AEO specifics (verified via
     Perplexity 2026-07-16, cross-check `drk-seo`): `FAQPage` JSON-LD is still worth emitting for AEO/AI-answer
     citability even though Google dropped FAQ rich results for commercial sites in 2023; hybrid model
     (embedded per-page FAQ + central `/faq` hub) is the recommended structure — which is exactly our
     composition model. Skill-wide — queued for `drk-website`.

## Post-slice SEO pass — run `drk-seo` against every page before the slice is called done (locked 2026-07-17, Adinda)
**Standing rule, every page, no exceptions.** A slice is not finished when it renders correctly. It is
finished when a **`drk-seo` pass has been run against the built page** and its findings are fixed or logged.

**This is a DIFFERENT job from the in-slice SEO rule above — do not let one stand in for the other:**
- **In-slice (the rule above) = AUTHOR.** Fill the `seo` field, emit the JSON-LD, write the alt text,
  rename the images. Done while the page is being built.
- **Post-slice (this rule) = VERIFY.** Load `drk-seo`, read the *rendered* page, and check it is
  structurally/technically built with SEO in mind: **heading hierarchy** (exactly one H1, no skipped
  levels, `display-*` vs `editorial-*` used per their ramps), **semantic tags** (`<section>` / `<nav>` /
  `<article>` / `<dl>` / `<details>`, not div soup), **alt text** present and descriptive on every image,
  **`generateMetadata` actually consuming the `seo` field**, **JSON-LD** emitted and valid, **canonical**
  set, **internal links resolving** (not `#` or a 404 route).

**Why this is a separate, named step and not just "remember to do SEO."** The in-slice rule has been in this
file since 2026-07-16 — and the homepage still shipped with **no `generateMetadata` at all** (verified
2026-07-17, see the gap below). Authoring and verifying are different jobs; the one that was written down is
the one that silently got skipped. This is the **"a verification ritual only counts if it can actually fail"**
principle applied to SEO: unless the check is a named step with a skill attached, it evaporates into "we did
SEO in the slice" — which is exactly what happened. It is also the **"a schema field that nothing renders is
a promise, not a feature"** rule in its purest form: `seo` is a *field an editor fills in*, and on the
homepage nothing consumed it.

**Trigger:** after Adinda approves the page's look, before the slice is logged done in MANAGER.md. Cheap
(minutes, while the page is fresh); the alternative is a from-scratch site-wide audit before launch.

**Retroactive scope, agreed 2026-07-17:** run it on the **boat page once approved**, and on the **homepage**
(already built, never passed). Every subsequent slice gets it inline.

### ✅ RESOLVED 2026-07-20 — the homepage `seo` gap, and the bug hiding UNDERNEATH it
**The 2026-07-17 entry that stood here was right that the homepage had no `generateMetadata`, but two of
its supporting details were wrong — and one of them was actively dangerous.** Corrected in `cf9d42e`;
kept in full because *how* it was wrong is the reusable part.

**What was actually true (verified 2026-07-20 by grep + a live GROQ query, not by re-reading the note):**
1. ❌ *"`HOMEPAGE_QUERY` **selects** `seo` (line 86)"* — **it did not.** Line 86 was inside `BOAT_QUERY`.
   The homepage query never fetched `seo` at all, so the gap was one layer deeper than logged: there was
   nothing to "throw away." **A line number is a claim about a file that drifts; it pointed at the wrong
   query and nobody re-checked for three days.**
2. ❌ *"the boat page is the correct reference — copy that shape"* — **the reference was itself broken.**
   `objects/seo.ts` defines the fields as **`title`/`description`**; `SeoData` declared
   **`metaTitle`/`metaDescription`**. So `boat.seo?.metaTitle` was ALWAYS `undefined`. **Copying the
   reference as instructed would have propagated a dead lookup onto the homepage.**
3. ❌ *"the boat `<title>` reading 'Mari Liveaboard' is the `pageTitle` fallback working correctly, NOT
   the same bug. Don't 'fix' it."* — **it WAS the bug.** The fallback fired precisely because the real
   field could never resolve. This line came within one session of causing the fix to be reverted.

**Why `tsc` never caught any of it — the generalisable trap:** query results are **cast**
(`as BoatQueryResult`), so the TS type is an *assertion*, not a check. A field name that exists in no
schema type-checks against nothing, forever. **When a type is reached through a cast, `tsc` green means
"the cast compiles", NOT "the field exists."** Same shape as the "verification ritual that cannot fail"
rule — the check passed because it was structurally incapable of failing.

**Current state:** `HOMEPAGE_QUERY` selects `seo`; `HomePageData` carries it; `src/app/page.tsx` has
`generateMetadata`; both pages read the real field names.
✅ **VERIFIED against served HTML 2026-07-24** — `homePage.seo` was seeded with real draft copy
(`_internal/scripts/seed-homepage-seo.ts`, 🟡 wording pending Adinda's review) and the served `<title>`
now reads "Mari Liveaboard — Phinisi Diving Liveaboard in Indonesia". The test that could fail, run and
passed. `boat.seo` remains null/untested — same wiring, but fill it and check the tab when boat SEO copy
lands.

**Still open, same class, wider scope:** `ogTitle` / `ogDescription` / `twitterTitle` / `twitterImage` /
`canonicalUrl` / `focusKeyword` / `breadcrumbTitle` / `noFollow` / `overrideJsonLd` / `jsonLd` in
`seo.ts` have **no consumer anywhere in the codebase** — every one is a control an editor can fill that
does nothing. The homepage still serves **0 JSON-LD blocks and no `og:image`**. This is the
"schema field nothing renders is a promise, not a feature" rule at its widest; needs a real slot.

Skill-wide (Adinda's ask) — queued for `drk-website` via `_internal/handoff/drk-website.md`.

## Studio form section headers — every group gets a matching titled fieldset (site-wide, locked 2026-07-16)
Distinct from "editor-organization deferred to last" below (that's field titles/descriptions/sidebar polish
— still deferrable). This one IS applied as each type is built: every document type pairs its `groups`
(tabs) with a matching set of `fieldsets` (titled sections), and every field declares BOTH its `group` and
its `fieldset`. Reason: groups only separate tabs, but **fieldsets render as visible section headers even in
the flat "All Fields" view** — without them an editor can't tell which section they're in. `siteSettings`
already did this; `destination` done 2026-07-16; **retrofit `boat`/`homePage`/`page`/`scheduleRates` and
every new type.** Skill-wide — queued for `drk-website`.

**Exception, learned 2026-07-16 (Adinda's SEO double-nesting catch):** this does NOT apply to a group
holding a **single self-describing field** — there the fieldset is pure duplication. The `seo` group was
rendering "SEO" (fieldset) → "Seo" (the object field) → the actual fields: three headers for one section.
Fixed site-wide by dropping the single-field `seoFs` fieldset and giving the `seo` field an explicit
`title: 'SEO'`, leaving ONE clean header. The rule's *purpose* is a visible section header in the flat
"All Fields" view — when the field already provides one, adding a fieldset works against that purpose.

## Load real/placeholder content into every schema so it's reviewable (locked 2026-07-16)
An empty form is too abstract to judge. Whenever a document type is built or filled out, populate at least
one real document with content — pull copy from the mockup where it exists, use clear placeholder (and the
homepage's own titles/copy) where it doesn't, tag placeholders in `_internal/CONTENT-STATUS.md`. Pairs with the
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
**Always pair the offer with (a) a written handoff note** (like `_internal/handoff/_NEXT-SESSION-*.md`) **AND (b) a
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
This file = prose rules + active decisions. `MANAGER.md` (session/decision log, created 2026-07-14) and `COMPONENTS.md` (reusable component specs, **not yet created** — ports from the static build's `COMPONENTS.md` at first use, not up front) follow the same convention as the old repo. Check `MANAGER.md` for today's active task scope and session history before re-deriving it. `_internal/SCHEMA-SPECS.md` (created 2026-07-15) is a fourth doc in this split — a flat, checkable field-by-field spec per Sanity page type, distinct from MANAGER.md's dated log: Adinda marks fields approved there as they're tested in a real build, without re-reading history to find "did we settle this." Update it alongside any schema change, same habit as the other docs. `_internal/CONTENT-STATUS.md` (created 2026-07-15) is the fifth — tracks whether the *value* in a field is real vs. placeholder (Figma-sourced copy preferred by default, stock/Pexels fallback for images Figma doesn't have enough of), a different axis from _internal/SCHEMA-SPECS.md's field-existence tracking. Zero remaining 🔴 rows in it is a hard pre-launch gate, same weight as the other pre-launch checks already in this file. `_internal/QA-CHECKLIST.md` (created 2026-07-15) is the sixth — for an external human reviewer's click-through pass, distinct from both: open design decisions worth a second opinion (e.g. eyebrow-toggle placement), not field approval or content-placeholder tracking. `_internal/POLISH-BACKLOG.md` (created 2026-07-16) is the seventh — page-by-page deferred cosmetic/interaction polish from the vertical-slice build (see "Build approach"), burned down later in one polish block; distinct from _internal/QA-CHECKLIST.md (that's open *decisions* for a reviewer; this is *known* polish we chose to defer). `_internal/OWNER-HANDBOOK.md` (created 2026-07-22, Adinda's ask) is the eighth — a LIVING list of correct-by-design behaviours a site owner can't guess from Studio alone (e.g. the itinerary Destination field doesn't place it on a page; the list does). **Add an entry the moment such a quirk ships** — it is the source material for the final owner handoff guide, written as we go, not reconstructed at handoff.

## `_internal/` = internal working files, NOT build input — REFACTORED 2026-07-24 (was root-level `_*` prefix; "never commit" dropped 2026-07-23)
**2026-07-24: the root cleanup landed — every internal file/folder now lives inside ONE folder,
`_internal/`, at the repo root** (handoff docs, working docs, copy drafts, skill-build packaging, test
images, throwaway scripts — inner underscores dropped: `_handoff/` → `_internal/handoff/`, `_RESUME.md`
→ `_internal/RESUME.md`, etc.). This replaces the old per-file `_` prefix convention; new internal
files go in `_internal/`, never `_whatever` at root. **The 2026-07-23 meaning change still holds: this
marks the DEPLOYMENT boundary, not the commit boundary.** Load-bearing working docs (`_internal/*.md`,
`_internal/handoff/`, `_internal/scripts/`, `_internal/content/`) ARE committed and pushed: git + the
private GitHub repo is the project's living backup (Adinda's framing: "a living, breathing backup of
everything"). What the single folder buys is that ONE line covers all of them everywhere:
- `.vercelignore`'s `/_internal/` line keeps everything internal off Vercel automatically — a new
  `_internal/whatever.md` needs zero per-file maintenance to stay off the deployment (see "Deployment
  boundary" below).
- `.gitignore` tracks `_internal/` in general but keeps genuine scratch UNcommitted via targeted ignores
  (`_internal/backup/`, `_internal/image-test/`, `_internal/content-scratch/`,
  `_internal/skill-image-retouch/`, logs, zips — stale copies and generated junk, where Drive/Sanity
  hold the masters). ⚠️ `_internal/content/` (tracked copy drafts) and `_internal/content-scratch/`
  (ignored images) are deliberately SEPARATE — tracked drafts and ignored scratch must never share a
  folder (the `ad06118` near-loss recipe).
Next.js App Router still uses `_`-prefixed folders inside `src/app/` as a real, committed routing
convention (private folders like `_components/`, `_lib/`) — neither ignore file touches those. A
NON-underscored internal file at root (like `MANAGER.md`) still has to be added to `.vercelignore` by
hand — prefer putting new internal files in `_internal/` instead, which is what makes the boundary
self-maintaining.

## Deployment boundary — GitHub holds EVERYTHING, Vercel gets only build input (locked 2026-07-23, Adinda — ⚠️ UNVERIFIED until first deploys are checked)
The repo now serves two different masters, and the boundary between them is explicit:
- **GitHub (private) = the living backup.** Everything is committed and pushed — source, internal docs,
  handoffs, MANAGER.md, CLAUDE.md. Safe because the repo is private, DRK-internal-only (the standing
  no-AI-traces condition already requires that and is unchanged: repo never goes public, client never
  gets access).
- **Vercel = the deploy target, and it gets ONLY what the build needs.** `.vercelignore` (repo root,
  created 2026-07-23; simplified 2026-07-24 when the `_internal/` refactor landed) excludes
  `_internal/`, `CLAUDE.md`, `AGENTS.md`, `MANAGER.md`, `COMPONENTS.md`, `SANITY-SETUP.md`,
  `README.md`, `skills-lock.json`, `.claude/`, `.agents/`, `.vscode/` — per Vercel's docs these are
  never uploaded, never in the deployment's source snapshot, never served, and never stored on Vercel
  at all. (The old `/_*` + `content/` lines are gone: everything internal, copy drafts included, now
  lives under `_internal/`.)

**Why (the reasoning, so it isn't re-derived):** the *serving* layer was never the risk — only build
output + `/public` are ever web-visible; a repo markdown file is unreachable at any URL regardless. The
`.vercelignore` exists because Adinda's requirement is stronger than "not served": the internal docs must
not **live inside Vercel at all** (not in the build upload, not in the dashboard's Source view, not
retained anywhere on their platform). Defense in depth: (1) build-output-only serving, (2) `.vercelignore`
keeps the files out of the pipeline entirely, (3) the private GitHub repo is the only place the docs exist
outside this machine.

**⚠️ VERIFICATION REQUIRED — Adinda is deliberately testing this over the first few deploys; treat the
mechanism as UNPROVEN until then.** Vercel's own docs only explicitly document `.vercelignore` for CLI
uploads; the Git-integration behaviour ("acts as an extension of `.gitignore`") is community-confirmed
(vercel/vercel discussion #4679), not officially stated. **The check that can actually fail: after each of
the first few deploys, open the deployment in the Vercel dashboard → Source tab → confirm `_internal/handoff/`,
`CLAUDE.md`, and `MANAGER.md` are ABSENT.** Repeat until trusted, then note the result here. If the files
DO appear: the failure mode is "stored on Vercel, visible to Vercel project members" — NOT public — and
the fallback is deploying via CLI/GitHub Actions (where `.vercelignore` filters before upload ever
happens) or a stripped deploy branch. Fold this check into the pre-launch no-AI-traces pass — same
concern, same timing.

**Maintenance rules (updated 2026-07-24 for the `_internal/` refactor):** (a) new internal doc → put it
in `_internal/`, auto-covered forever; (b) a new internal file at repo root must be added to
`.vercelignore` by hand — prefer `_internal/`; (c) copy drafts live in `_internal/content/` (tracked)
and nothing in `src` reads them — if a build ever imports from there, it fails loudly at build time.
Skill-wide (every DRK site wants this exact split) — queued for `drk-website` via
`_internal/handoff/drk-website.md`.

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
   client site, not just Atlas). Queue DRK-wide and Atlas-wide items into the matching `_internal/handoff/*.md`
   file immediately, don't batch it for later.

Full spec for this format lives here; the generalized (non-Mari) version is queued for `drk-website`'s
`references/workflow.md` — see `_internal/handoff/drk-website.md`.

## Commit cadence — commit at every checkpoint + remind at session end, locked 2026-07-16
### ⚠️ AMENDED 2026-07-17 (Adinda) — read this first, it changes how the preconditions below are read
**The problem this fixes:** work was piling up uncommitted for long stretches. Cause: the "verified-clean"
precondition below sets the bar at *typecheck/lint/build actually green* — **a bar nobody clears mid-arc** —
so the rule meant to protect the repo was preventing the checkpoint. That's backwards. A **local commit is
not a claim the work is good; it's a checkpoint.** It's free, private and reversible (`reset`, `amend`,
branch). An **uncommitted working tree is the only genuinely lossy state in the system.**

**So: DEFAULT TO COMMITTING.** The "verified-clean" precondition does **not** gate *whether* to commit — it
gates **what the message is allowed to CLAIM**. Never write a message implying verification you didn't do.
`wip: boatDefaults — untested, mid-arc, not reviewed` is strictly better than no commit and is honest.
A breaking bug is **fine** to commit if the message says it's broken; what's forbidden is a broken state that
**looks finished in the log**, because a future session reads it and believes it. (This *reinterprets*, and
does not delete, the "never commit a mid-repair/known-broken state" line below — that rule was always about
committing broken work **silently**, as if done.)

**The narrow genuine don't-commit cases:** secrets/credentials in the tree · large junk artifacts · a tree
another process is **actively writing right now** (wait, then commit).

**Parallel sessions — the case that prompted this (2026-07-17).** When several Claude sessions run against
this one repo, `git status` will show work **this session didn't author** (e.g. `boatDefaults` appeared
mid-session from a parallel one). **Do NOT commit another session's in-flight work** — not because it's
unverified, but because **only the session that wrote it knows what the message should honestly say**, and a
message written by someone who doesn't know what they're describing is the exact thing this rule forbids.
Instead: **name the files, say plainly they look like another session's, and leave them.** The reminder to
commit belongs to *that* session. Never phrase it as "shall I commit?" — that implies it's yours to offer.

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
- **Open to-dos are clearly logged** — the checkpoint (or MANAGER.md / `_internal/SCHEMA-SPECS.md`) spells out
  what's still undecided, unreviewed, or half-done, so an incomplete-but-clean state is committed
  honestly, not as if it were finished. Committing mid-arc is fine *as long as the "what's left" is
  written down* — that's the whole trade that makes this safe.

**Safe because commits stay LOCAL** — a commit is not a push, so it's private and fully reversible.
The standing authorization here is for local commits to this private, DRK-internal repo only. **Revisit
this decision if that ever changes** (a push-to-remote habit, the repo going public, client repo access)
— same condition already attached to the "no AI-authorship traces / repo stays private" rule above.

Skill-wide for all DRK sites (Adinda's explicit ask) — queued for `drk-website`'s `references/workflow.md`
via `_internal/handoff/drk-website.md`, generalized (drop the Mari-specific file names).

## Session bookend protocol — skills-backlog check + model + task-proposal format, locked 2026-07-16
Standing procedure that runs at BOTH triggers, every time, not on request: (a) the start of a session
when Adinda asks for a recap / "good morning", and (b) the natural end of every session. Adinda's explicit
ask so it isn't reinvented per session. Order matters — do the skills-backlog check FIRST, before proposing
or planning any work.

### 1. Skills-backlog check — FIRST, before any work is proposed
The skills live in the chat-side containers; there is **no live bridge** from this repo to them (see
`_internal/handoff/drk-website.md`'s own explanation), so merging a handoff into a skill happens manually, in chat.
Procedure:
- Check `_internal/handoff/*.md` for content queued into the skills but not yet merged.
- If there's a backlog, ask: **"Would you like to update those skills now in chat?"**
- If yes: hand off **one skill at a time**. For each skill give (a) a ready-to-paste prompt for the
  chat-side skill-update session, and (b) pointers to the exact handoff document(s)/sections that feed it.
  Finish one skill fully, then move to the next — don't dump all skills at once (there are often several).
- After the last skill: remind her — **"Don't forget to drop the updated skills into your Downloads folder
  when they're done, and I'll install them."** She updates + downloads in chat; the packages land in
  Downloads; Claude installs from there (per the skill install/update procedure).
- Once she confirms they're updated/installed (or says they're already done): **clean up the handoff docs**
  — strip the now-merged content out of `_internal/handoff/*.md` and any MANAGER.md staging so the backlog doesn't
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

### 6. Work-tracking log — MANDATORY, non-skippable, at BOTH bookends (`drk-work-tracker`, locked 2026-07-18)
Adinda is running a deliberate productivity experiment — how long things actually take, planned-vs-actual,
where time leaks. The tooling for this already existed (MANAGER.md's "Session Time Log" + the daily-recap
template) **but was not being filled** — Jul 16's full build day and all of Jul 17 went unlogged, the two
biggest days of the week. So this is now an **enforced close-out step**, not a habit to remember. The
`drk-work-tracker` skill owns the mechanics (authored chat-side, payload in `_internal/handoff/_payload/drk-work-tracker.md`);
this rule is what makes it fire. **Verification-ritual principle applies: a log that can be silently skipped
is not a log.**
- **At session CLOSE (every session, before wrap-up is called done):** run the LOG flow. (a) Derive the
  session's elapsed window from git commit timestamps + the message span — do NOT ask her for elapsed, it's
  derivable. (b) Ask her the ONE thing only she knows: **active desk time** (she steps away for kanji/cooking
  while builds/scripts run — elapsed ≠ active, and that gap is real data, per the 2026-07-15 boat-schema row).
  (c) Reconcile **planned → actual → unplanned** against the ACTIVE QUEUE / day plan: what was scheduled, what
  shipped, what leaked in (bugs, false-alarm chases like the 2026-07-17 cache hunt, ad-hoc requests). (d) Note
  **blockers**, carrying open ones forward. (e) Append the row to MANAGER.md's Session Time Log AND update the
  day-plan actuals. (f) Compute **estimate accuracy** (planned est vs actual) so her estimates self-calibrate.
- **At session START (with the recap / "good morning"):** run CARRY-FORWARD — surface open blockers +
  yesterday's unfinished planned items + the running estimate-accuracy trend. This is the same start trigger
  as the bookend, one step earlier in the flow.
- **Manual override:** `/drk-work-tracker` (`log` / `recap` / `week`, or bare = infer from context).
- **Honest-data boundary:** session start is git/clock-derivable; **active desk time stays a one-question
  self-report** — only she knows when she stepped away. Enforced every session is the win, not measured-to-the-minute.

Generalized (non-Mari) version queued for `drk-website`'s `references/workflow.md` via
`_internal/handoff/drk-website.md`, alongside the daily-recap-template + commit-cadence workflow conventions. The
`drk-work-tracker` skill itself is a NEW DRK-wide skill — payload staged in `_internal/handoff/_payload/drk-work-tracker.md`,
authored chat-side per the standard skill workflow.

## Review requests must always call out mobile explicitly, locked 2026-07-15
Whenever Claude asks Adinda to review/QA something in a browser, the ask must name checking the **mobile
viewport** as its own explicit step, not bundle it into a generic "look at it" — desktop-only review is the
default failure mode otherwise. Background/full writeup (iframe-`dvh` testing artifact, real-device LAN
`allowedDevOrigins` incident): `drk-website` skill's `references/troubleshooting.md`.

## Real-device testing: PRIVATE TAB FIRST, before any theorizing — locked 2026-07-17 (cost a session)
**Standing first move whenever a bug is reported on a REAL phone but not on the desktop browser:** ask
Adinda to reload in a **Private/Incognito tab** before investigating anything else. If it's fixed there,
it was the phone's cache and there is no bug. This takes ten seconds and it is now the FIRST question,
ahead of the `localhost`-vs-LAN check below.

**Why it needs to outrank the existing rule.** On 2026-07-17 "Read more is missing on mobile" was chased
across most of a session — three wrong theories (a layout bug, `allowedDevOrigins`, Sanity CORS), a
retracted false reproduction, and a puppeteer harness — and the answer was **the phone's browser cache**.
Adinda confirmed: *"incognito fixes it."*
- **A phone cannot be hard-refreshed the way a desktop can.** The existing "restart clean + hard reload"
  ritual is a DESKTOP ritual; it silently does not cover the device the bug was reported on. So a phone can
  sit on a days-old bundle while every desktop check passes — which is exactly what happened.
- **The tell was there and was misread:** she reported BOTH a missing CSS change (an 8px margin) AND a
  missing JS behaviour (the button). One stale bundle explains both at once; no code bug explains both,
  because they share no mechanism. **When two symptoms have no common cause in the code, suspect the
  build the device is actually running, not the code.**
- **The `localhost`-vs-LAN check below did NOT catch this** and actively misled: localhost (desktop) worked,
  LAN (phone) failed, which points straight at origin — so two real-but-innocent origin findings turned up
  and both looked like the culprit. **Confirming a difference between two environments does not identify
  the cause of it.** Rule out cache first, then trust that signal.

### 🔴 SANITY HAS ITS OWN, SEPARATE CORS ALLOWLIST — not the same thing as `allowedDevOrigins`
Found 2026-07-17 while chasing the above. **Real, still open, and only Adinda can fix it** (needs Sanity
project admin). It is NOT the read-more bug — proven: the button and the 8px margin both render correctly
via the LAN IP with this error firing, because it breaks the live-updates channel, not hydration.
- **Symptom in `.next/dev/logs/next-development.log`** (never in the browser):
  `Sanity Live is unable to connect to the Sanity API as the current origin - http://192.168.0.101:3000 -
  is not in the list of allowed CORS origins`
- **Consequence:** `sanityFetch`/`defineLive`'s live channel is dead on any LAN device → **content
  published in Studio will not live-update on the phone.** Everything else renders.
- **Fix (Adinda, one click, "Allow credentials" ON):**
  `https://sanity.io/manage/project/kb8eim50/api?cors=add&origin=http%3A%2F%2F192.168.0.101%3A3000`
- **The generalisable point: there are TWO allowlists with the same class of symptom.** Next's
  `allowedDevOrigins` (below, in `next.config.ts`) and Sanity's project CORS list (at `manage.sanity.io`).
  Setting one does nothing for the other. Both need the LAN IP for real-device testing, and **both must be
  re-added if the Wi-Fi IP changes.**
- **The dev log is the diagnostic for both** — it is where the 2026-07-15 incident was "sitting the whole
  time," and it is where this one was too. **Read `.next/dev/logs/next-development.log` before theorizing.**

Skill-wide — queued for `drk-website`'s `references/troubleshooting.md` via `_internal/handoff/drk-website.md`.

## Touch reveal = `pointerup`, never `click` — locked 2026-07-22 (Adinda's "tap twice" catch)
iOS Safari consumes the FIRST tap on hover-reactive content as hover-emulation and only delivers
`click` on the second. Any tap-to-reveal interaction rides `pointerup` (pointerType 'touch', ≤10px
movement test vs swipes, skip targets inside an `<a>` — link-side `stopPropagation` on click does
NOT cover pointerup). Reference: `DestinationItineraries.tsx`. **Corollary, same day: a draggable
card track never gets a whole-card link** — every drag attempt becomes a navigation; the CTA inside
the card is the only link. Skill-wide — queued via `_internal/handoff/drk-website.md`.

## Booking-widget embeds go FULL viewport width on mobile — STANDARD, locked 2026-07-22 (Adinda)
INSEANQ (and any dense third-party booking embed) is unreadable at phone width inside page gutters.
The embed container goes full-bleed on mobile, gutters return md+. Implement with negative margins
canceling the wrapper's own padding (`-mx-24` + `self-stretch`), **never `w-screen`/`100vw`** — vw
includes the scrollbar and is the horizontal-scroll bug. Applies to the future Schedule & Rates
page too. Reference: `DestinationTrips.tsx`. Skill-wide — queued via `_internal/handoff/drk-website.md`.

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

## Colour names: ALWAYS confirm the hex, and rename opportunistically — locked 2026-07-16 (Adinda)
Figma renamed the colour families (cream→beige, copper→chocolate) after they were ported; our CSS kept the
old names, so one palette lives under two naming generations. Full mapping, the 3 traps, and the reasoning
live in `src/app/globals.css`'s primitives header — **read it before touching a colour name.**

**Two standing rules, Adinda's design (they compose — the first is what makes the second safe):**
1. **When Adinda names a colour without giving a hex, ASK HER TO CONFIRM THE HEX.** Never resolve a Figma
   name to a token by name — the names disagree. Always match by hex.
2. **The moment a mapping is confirmed by (1), rename that token then and there** — the declaration plus
   its usages (the semantic layer in `globals.css`, plus any direct `var(--primitive-*)` refs in
   components). ~2 minutes per token.

**Why this beats both alternatives** (a full rename pass was considered and DECLINED): a big-bang rename
would have to guess at ~8 unconfirmed names, which is worse than a known-stale name. Doing nothing leaves a
papercut that recurs forever. This makes confirmation a **byproduct of normal work** — tokens get fixed
exactly when they're proven and exactly when someone cares, and tokens nobody ever names cost nobody
anything. No audit, no guessing, no half-finished migration to remember.

**Per-rename safety net:** the served CSS must emit the identical set of hex values before and after. A
rename that changes a rendered value is a bug — that diff is the only check that catches it (see the
verification rule below). Also update the mapping table in `globals.css`: move the entry from inferred to
confirmed, or delete it once renamed.

Skill-wide (the opportunistic-reconciliation pattern generalizes) — queued for `drk-website`.

## Check the docs BEFORE debugging — locked 2026-07-16 (Adinda)
When ANY bug appears, **first check whether it's already documented**, before experimenting: this file,
`MANAGER.md`, `_internal/handoff/*.md`, and `drk-website`'s `references/troubleshooting.md`. Trying things out when
the answer is already written down wastes the session and risks re-introducing a fix we already know is
wrong. This is the read half of a habit we've only been doing the write half of — the troubleshooting file
is only worth keeping if it's consulted first, not just appended to. Skill-wide — queued for `drk-website`.

**Corollary — write BOTH halves down.** When a bug is logged, record how to *fix* it AND how to *avoid
re-introducing* it. Precedent: the Studio "List items with same ID found" bug (2026-07-16) — the fix was
deleting a duplicate, but the prevention was setting `.id()` explicitly in `structure.ts`, which is what
actually stops it recurring. See `_internal/handoff/drk-website.md`.

## A verification ritual only counts if it can actually fail — locked 2026-07-16
The "restart clean + curl `/studio` 200 + GROQ query-back" ritual **does not verify Structure Builder
changes.** Studio resolves structure client-side, so `curl` returns 200 on a completely broken sidebar, and
`tsc`/`eslint`/`sanity schema validate` all pass (it isn't a schema error). A fully broken Studio was
handed to Adinda for review on 2026-07-16 having "passed" every check. **For structure changes, either load
Studio in a real browser or state plainly that Adinda's reload is the only real test — never report it as
verified.** Generalize the principle: before claiming something is verified, ask what the check would do if
the thing were broken. If the answer is "pass", it isn't a check.

## Icons are ASSETS, never font glyphs — and put a KNOWN-GOOD control in every test harness (2026-07-17)
Two lessons from one bug, both reusable.

**1. A text character is not an icon — and ONE icon file is what makes weight uniform.** The
cabins/gallery carousel arrows were the character `›` at 18px. Adinda spotted it as "distorted... maybe
it's a matter of sizing" — but sizing was never the problem: a glyph's shape and weight are whatever the
typeface decides, and Bricolage Grotesque draws `›` thick and stretched. Now
`src/components/CarouselChevron.tsx`.
- 🔴 **The fix is NOT Figma's icon.** `Button/Carousel Arrow-Small` (778:8778) uses a filled Material
  `arrow_back_ios` path — much heavier than every other chevron on the site. Building that (first
  attempt) drew a correct-to-Figma chevron that Adinda immediately rejected: **"needs to be uniform in
  size and thickness as existing ones."** Another instance of conventions superseding Figma — and note
  the node was followed *faithfully* and still produced the wrong answer.
- **So `CarouselChevron` reuses `icon-nav-chevron.svg` — the SAME FILE as Nav/Contact/MultiSelect/
  BoatOverview**, rotated ±90°. Uniform thickness **by construction**, not by a number kept in sync.
  A second "matching" asset would drift the first time either is touched.
- ⚠️ **Figma's SVG exports set `preserveAspectRatio="none"`**, so the glyph stretches to fill ANY box
  and thickens the stroke on one axis. **The box ratio must match the viewBox** (7.91668:6 here). The
  existing `size-[10px]` usages are 1:1 boxes on a 1.32 glyph — already slightly squashed. Don't copy
  that; `h-[7.58px] w-[10px]` keeps their scale without the distortion.
- Figma exports the whole button (circle + shadow + chevron) as ONE flat SVG. Don't use it as-is — it
  can't hover or recolour. Keep the circle in CSS, mask the chevron.

**2. 🔴 CSS `mask-image` silently does NOT load over `file://` — it renders NOTHING, no error.** A
headless-Chrome screenshot of a local HTML file will show every masked icon as blank. **Serve the test
page over HTTP** (`python -m http.server`) or the harness lies to you.
**The general rule that caught it: every visual test harness needs a KNOWN-GOOD control.** The debug page
included the nav chevron — which demonstrably works in production. When it came back blank *too*, the
harness was indicted in one step instead of the new icon being "fixed" for an hour. **When a test fails,
the test is a suspect, and a control is what makes that cheap to check.** Corollary to "a verification
ritual only counts if it can actually fail": a ritual that *falsely* fails is just as expensive.

## Session discipline (carried over from the static build, still applies)
- Verify by reading actual compiled CSS/build output, not by trusting a class or config name's apparent meaning
- Tag reusable rules `[DRK]` as they emerge — don't defer to a batch audit
- MANAGER.md (once created): archive past ~1,900 lines
- **Propose an end-of-session retrospective at the natural close of a substantive session**, locked
  2026-07-15 per Adinda's explicit request — don't wait to be asked. Trigger on: the user signaling
  they're wrapping up, or the session having accumulated a lot without one yet (3+ real bugs fixed,
  several logged decisions, conversation clearly grown long). Propose it as a question, not an automatic
  action. Covers time logging + project-specific learnings (this file/MANAGER.md) + reusable DRK-wide
  learnings (the relevant `drk-website` skill reference + a `_internal/handoff/drk-website.md` entry). Full
  spec: `drk-website` skill's `references/workflow.md`, "End-of-session retrospective."

## Dev server at session start — always bring localhost up (locked 2026-07-24, Adinda)
At the start of every session, check whether the dev server is listening on :3000 and start
`npm run dev` in the background if it isn't — without being asked. Idempotent check first
(`Get-NetTCPConnection -LocalPort 3000 -State Listen`), never stack a second server. Composes with
the existing Studio-staleness rule: a clean restart is still required after heavy schema changes.
🔴 **Start it OUTSIDE the sandbox (`dangerouslyDisableSandbox: true`) — learned 2026-07-24.** A dev
server inheriting Claude's sandboxed shell serves every normal route but 404s `/studio` specifically:
the sandbox layer mishandles the `[[...tool]]` folder (brackets are glob characters, and Studio is the
only bracketed route). Symptom signature: site fine + Studio clean-404 + `--localstorage-file` warning
in the server output = sandboxed server; kill it and restart unsandboxed. Don't debug the route.

## Commands
```
npm run dev      # Turbopack dev server
npm run build    # Turbopack production build
npm run start    # serve production build
npm run lint     # eslint
```
