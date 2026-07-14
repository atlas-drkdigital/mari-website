# MANAGER.md — Mari Liveaboard website (Next.js + Sanity)

Running log for this repo's build. Companion to `CLAUDE.md` (prose rules/active decisions) and
`COMPONENTS.md` (not yet created — see CLAUDE.md's doc-split note). Keep entries terse + dated, per the
static-build repo's own size-discipline convention (archive past ~1,900 lines).

The static-build repo (`../v1-static-homepage/MANAGER.md`) holds the full pre-2026-07-14 history: sprint
planning, brand-dump decisions, page inventory, contracted deliverables. Don't re-read it cross-repo going
forward — this file is now the live one.

---

## SESSION CHECKPOINT — end of 2026-07-14 session (read this first for "what's next")

### Done, committed, verified (typecheck + lint + Studio/homepage smoke-tested clean throughout)
- Sanity project `kb8eim50` ("Mari Liveaboard") created, Studio embedded at `/studio`, fully isolated from
  the live MVP project (`sjkpkyaw`) — see `SANITY-SETUP.md`.
- Full schema skeleton: `page` (generic, rich text matched to the live MVP's proven spec — colors via
  `@sanity/color-input`, sized/aligned images, HTML embed, no link annotation), `scheduleRates`,
  `announcementBar` (multi-doc, exclusive-active warning validation, Normal/Medium/High urgency),
  `navigation` (shared `link` object, Destinations-mega-menu placeholder field), `siteSettings` (tabs +
  fieldsets, contact arrays, social platform enum), `redirect`, `language`, plus shared objects (`seo`
  with full Yoast-parity checklist + live char-count, `linkItem`, `socialLink`, `contactEmail`/`Phone`,
  `htmlEmbed`).
- Custom Studio structure (grouped sidebar: Pages, Announcements, Settings, SEO Tools, Languages), singleton
  locks on Site Settings/Navigation, auto-slug component.
- Studio branding: copper/amber/navy colors + Bricolage Grotesque font + "Mari Studio" title, via
  `buildLegacyTheme` (values sourced from `theme.css`, not invented).
- **`theme.css` fully ported into this repo** as Tailwind v4 `@theme` (`globals.css`) — full color/spacing/
  radius/shadow/type-scale token layer, adapted for Next.js (font via `next/font`, texture URLs public-
  absolute). Static asset library (images/icons/per-section JS) copied to `public/assets/`
  (`pre-webp-originals/` deliberately excluded — confirmed unreferenced dev-only files first).
- Documentation: `drk-website` skill's `sanity-cms.md` has all reusable patterns from this session (Structure
  grouping, singleton lock, slug/char-count components, shared `link` object, exclusive-active validation,
  SEO checklist, Studio branding boundaries — what's realistic vs. not); its `workflow.md` now has the
  session-time-tracking convention. CLAUDE.md has the handoff-doc-reading instruction + Destinations
  mega-menu reminder. `_handoff/mari-website.md`'s announcement-bar conflict is reconciled.

### Homepage markup port — DONE this session too (was the top "what's next" item, now complete)
All 11 static sections (Nav, Hero, The Boat, Why Us, Destinations, Latest Articles, FAQ, Testimonials, CTA,
Contact, Footer) ported from `../v1-static-homepage` into real Next.js components at `src/components/` +
`src/components/sections/`, assembled in `src/app/page.tsx`. Content is still hardcoded (matches the static
build verbatim) — no Sanity wiring yet, that's blocked on the `homePage` schema type (Tier 4). Verified:
`tsc --noEmit`, `eslint`, and `next build` all clean; `/` and `/studio` both smoke-tested.

**Two deliberate simplifications vs. the source** (noted in-file, not oversights):
- Destinations' drag-swipe no longer live-previews the incoming photo sliding in mid-gesture — swaps on
  release instead, same crossfade as the tab/arrow navigation. Real visual-polish item to revisit.
- Testimonials dropped 4 explicit test-only placeholder reviews from the original (they were only ever
  there to verify carousel overflow behavior, never real content) — ported only the 4 genuine reviews.

### What's next, in order
1. **Finish visual/functional QA of the homepage port** — in progress, see checklist below (Why Us already
   reviewed and fixed, see next section). Needs Adinda's eyes in a real browser; I can't visually confirm
   hover states, animation feel, or real-device touch/drag behavior myself.
2. **Tier 4 schema types**: `homePage`, `destinationPage`, `boatPage`, `itinerary` (stub), `testimonial`,
   `faq`, page-builder block shell — now genuinely informed by the real ported component structure (the
   reason this was sequenced after the port, not before).
3. **Wire the homepage to Sanity** once `homePage` schema exists — replace the hardcoded content in each
   section with real GROQ-fetched data.
4. Once `destinationPage` exists: wire the Destinations mega-menu (`navItem`'s `menuStyle` placeholder is
   already there — see CLAUDE.md's Navigation section for the exact to-do).

### QA in progress — bug found + fixed this session (2026-07-14, same day)
Adinda reviewed **Why Us** first and caught a real bug via screenshots (not-expanded state showed 2 of 4
cards blank/washed-out; any card interaction "fixed" it). Diagnosed by reading the actual rendered HTML
(not guessed from source review alone) — two real, separate causes, both fixed in `WhyUs.tsx`:
- `next/image`'s `fill` prop forces `width:100%;height:100%` as an inline style, which no Tailwind class can
  override — the ported "55vw-wide, shifted-to-center" framing classes were dead on 3 of 4 cards. Fixed by
  moving those classes to a wrapping div and letting the Image fill *that* instead.
- All 4 images had `loading="lazy"` + a large fallback size — genuine load-timing flash on a section sitting
  just below the fold, read as broken in a screenshot taken during that window. Switched to eager loading.
Both confirmed via `curl`-diffing the actual rendered HTML before/after, not just re-reading source. Verified
clean: `tsc --noEmit`, `eslint`, `next build`. Committed (`bc1aaa7`).

**Given this exact bug pattern (framing classes silently dead under `next/image`'s `fill`), spot-check the
other sections using the same `fill` + non-trivial-positioning-classes combo** when reviewing them — Nav's
mega-menu destination images and Destinations' background crossfade layers use `fill` too, though their
positioning is simpler (`object-cover` only, no extra shift/width classes), so they're lower-risk than Why
Us was, but worth a deliberate glance rather than assuming they're fine by analogy.

### Homepage port QA checklist — for Adinda, remaining sections
Run `npm run dev`, open `http://localhost:3000/`, and check:
- [x] **Why Us** — reviewed, bug found + fixed (see above).
- [ ] **Nav**: scroll-flip (top → light background) happens at the right point; Destinations mega menu
  opens/closes, hover/focus crossfades the right image; Resources mega menu opens; mobile hamburger menu +
  its Destinations/Resources accordions work on a real narrow viewport (not just a resized desktop window).
- [ ] **Hero**: destination search dropdown filters as you type (desktop); on mobile, tapping the search
  field opens the full-screen takeover, not the inline dropdown.
- [ ] **Destinations**: tabs/arrows switch the crossfade correctly; try the drag-swipe on an actual touch
  device or trackpad, not just a mouse click — this is the section with a known simplified interaction (see
  above).
- [ ] **FAQ**: only one item open at a time; clicking the open item closes it.
- [ ] **Testimonials**: "Read more" expands each card; arrows disable/hide correctly (there are only 4 real
  cards now, so on a wide desktop screen you may not see any overflow/arrows at all — that's expected).
- [ ] **Contact**: both multi-selects (Destination, Departure Month) open/close, show the right "+N more"
  label; Number of Guests select works; submitting shows the thank-you message.
- [ ] **Footer**: newsletter field submits (clears, no real backend yet); social icons render.
- [ ] General: compare side-by-side against `../v1-static-homepage` (still running, unedited) for anything
  that looks or feels off — spacing, hover timing, colors.

### Still open / needs Adinda's action — not blocking, don't lose track of these
- [ ] Add the "English" `Language` document in Studio (name: English, tag: en, default: true) — a content
  task, not code; may already be done, check before re-asking.
- [ ] Verify Sanity Studio v6.4's bulk-edit/multi-select capability — asked, not yet researched.
- [ ] Decide the `robots.ts` AI-crawler policy (block rules stubbed/commented, ready to uncomment) and update
  its hardcoded sitemap URL once the production domain is confirmed.
- [ ] Decide whether to ship `llms.txt` (parked until real page URLs exist to list).
- [ ] CORS: add the production Vercel URL once deployed (currently only `localhost:3000` allowlisted).
- [ ] Sanity Studio UI localization (e.g. German for Stefan) — discussed as genuinely possible
  (`@sanity/locale-de-de`), not yet requested to build.
- [ ] Full icon-level accent-color customization (every icon branded, not just hover/active states) —
  discussed, flagged as bigger than a "simple pass," not yet requested.
- [ ] Destinations drag-swipe live-preview polish (see simplification note above).

### Reviews — in progress (Why Us done, rest of checklist still open); schema/Studio already reviewed
Schema was reviewed live in-browser by Adinda throughout, iterated on directly. Studio branding was
implemented per her direct requests. Homepage port review started 2026-07-14 (same day as the build) — Why
Us is reviewed and its bug fixed (see above); Nav, Hero, Destinations, FAQ, Testimonials, Contact, and
Footer still need an actual look in a browser — code-level checks (typecheck/lint/build) don't substitute
for that, especially for animation feel and touch/drag behavior on a real device.

---

## Session Time Log (for DRK sprint/hour-estimation calibration — see `drk-website` skill's `workflow.md`)

Adinda's own tracked estimate, not independently measured. Append future sessions here, don't recompute past
ones.

| Date | Session focus | Duration | Notes |
|---|---|---|---|
| 2026-07-14 | Sanity schema pass + Studio branding + theme.css port | ~2h15–2h30 | First full backend session on this build — established schema/Studio/branding conventions from scratch. Expect meaningfully faster on similar future sessions now that the patterns exist. |

---

## 2026-07-14 — Repo scaffolded, stack verified, 3 open questions resolved

Full detail lives in `CLAUDE.md` (stack table, Next 16 convention deltas, resolved findings) — not
duplicated here. Summary: Next.js 16.2.10 + Sanity v6.4.0 confirmed correct (not the 15/v5 the `drk-website`
skill still says); `cacheComponents` decided OFF for launch; embedded Studio confirmed to need no custom
auth (Sanity's own SSO+CORS); localization plugin compatibility only partially verified, smoke-test before
relying on it. All queued for the next `drk-website` skill-update round in
`_handoff/drk-website.md` (moved here from the old repo 2026-07-14 — this is now the single live copy).

## Today's work session — 3pm–6pm (3h), schema-pass day

**T&C + Schedule & Rates: ≤1h combined.** Content already sourced/verbatim for T&C (16 sections, mechanical
port). Schedule & Rates simplified same session: INSEANQ is a copy-paste embed, not a real integration —
schema just needs one `embedCode` field (raw string). The "Calico Jack sidebar" layout question is
explicitly deprioritized — ship the simple layout, revisit only if time allows later, not blocking.
Adinda still needs to email INSEANQ about filtering (separate, non-blocking, her own to-do).

**Full Sanity schema pass: skeleton only, ~1.5–2h.**
- In scope: `sanity init` + Studio booting at `/studio/[[...tool]]`; all ~15 planned types defined with
  *core* fields only, registered in the schema index; the reusable SEO object; the page-builder array shell
  with 1–2 stub block types (not the full catalog); site-wide singletons (`navigation`, `siteSettings`,
  `announcementBar`); a generic `redirect` type; default (uncustomized) Portable Text wherever rich text is
  needed; smoke test that Studio opens clean and every type is creatable.
- Explicitly deferred (all non-destructive to add later): field-level validation beyond the bare minimum,
  custom Studio previews/input widgets, the minimum-content-guard pattern, the full page-builder block
  catalog, Portable Text heading/alignment customization (see below), localization plugin install, any
  actual GA/GSC/JSON-LD wiring logic (that's Next.js component work, not schema).

**Portable Text heading/alignment customization: explicitly NOT today.** Pair with whichever day first
needs genuinely rich formatted content — Blog is the most rich-text-heavy page in the inventory, the
natural candidate.

**Localization plugins: NOT installed today.** `sanity-plugin-internationalized-array` +
`@sanity/document-internationalization` compatibility is still only partially verified (see CLAUDE.md).
Multilingual itself is deferred/future-paid-add-on scope anyway — no reason to build on an unconfirmed
dependency now. Structure fields so localization *can* be added later; don't wire the plugins.

## Content-model rule: three-tier rich text (locked 2026-07-14, Adinda's framing)

Not one global Portable Text config — three distinct tiers, decide which applies by field, not per-page:
1. **Plain string** — headings, labels, CTA text, eyebrows. No rich text at all.
2. **Constrained rich text** (most body copy — card descriptions, FAQ answers) — Portable Text, paragraph +
   basic marks (bold/italic/link) only. No heading styles, no alignment override — layout/CSS already
   governs presentation, and overriding it per-entry would fight the design system.
3. **Full rich text (headings + alignment)** — reserved for genuinely long-form, structurally flexible
   content: T&C body, Blog post body, and the page-builder's dedicated "Rich Text" block for overview-style
   sections (Private Charters, possibly About's story text).
Practically: every rich-text field uses default Portable Text today (tier-2 behavior). Only tier-3 fields
get the heading/alignment customization layered on later — same field type, enhanced config, nothing gets
rebuilt.

## Pre-launch to-dos surfaced during schema-review session (2026-07-14)

- [ ] **Verify Sanity Studio v6.4's actual bulk-edit / multi-select capability** — Adinda asked; not yet
  researched (didn't find it documented in the skills checked so far). Look up before answering, don't guess.
- [x] `app/robots.ts` created (Next.js dynamic Metadata Files API, default allow-all + `/api/`/`/studio/`
  disallowed). **Still open:** [ ] decide the AI-crawler policy (GPTBot / ClaudeBot / PerplexityBot /
  Google-Extended — allow increases AI-citation chances, block prevents AI-training use) — the block rules
  are stubbed out commented in the file, ready to uncomment once decided. See `drk-seo` skill's
  `aeo-considerations.md`. Also update the hardcoded `sitemap` URL once the production domain is confirmed.
- [ ] **Decide whether to ship an `llms.txt`** file at launch (emerging AEO practice, static root file like
  `robots.txt`) — needs real page URLs to be worth building, so parked until more page types exist.
- [x] **`page` type's rich text body upgraded** — resolved by pulling the actual spec directly from the
  live MVP repo (`atlas-drkdigital/mari-website-mvp`) instead of waiting on a paste: H1-H4/Quote styles,
  underline/strike/code marks, align + text-color annotations, sized/aligned images, HTML embed block.

## Tier 4 backlog additions from schema-review session (2026-07-14)

Captured while reviewing the schema locally, not built yet (Tier 4 is deferred — Adinda will resequence
later):
- **Destination page** and **Itinerary page**: each needs an optional INSEANQ `embedCode` field (same
  pattern as `scheduleRates`), so availability can be shown/filtered in context, not just on the dedicated
  Schedule & Rates page.
- **Private Charters page**: needs its own INSEANQ `embedCode` field too (filtered sync).
- **New page type: "Specials"** — an Atlas-website page candidate, essentially a filtered INSEANQ sync view.
  Cheap to add ("just a matter of filtering and sync") — flagged as a likely near-free addition once
  Destination/Itinerary embed wiring exists. Not in the original page inventory — add to `atlas-website`
  skill's page checklist when Tier 4 resumes.
- INSEANQ filtering email sent to Andrew (Adinda's own to-do, non-blocking) — placeholder `embedCode`
  content is fine until his response arrives.

## Sanity project created, Studio embedded (2026-07-14)

New Sanity project **`kb8eim50`** ("Mari Liveaboard"), dataset `production`, fully separate from the live
MVP's project (`sjkpkyaw`) — Adinda's call: full isolation, new repo + new Sanity project (+ new Vercel
project later at deploy time), zero shared state with the currently-live site. Studio embedded at
`/studio/[[...tool]]`, smoke-tested (200 response, boots clean, zero schema types yet). Upgraded off the
CLI's default `sanity@5`/`@sanity/vision@5` to the verified `6.4.0` per CLAUDE.md's stack table. Full
connection details + redo steps: see `SANITY-SETUP.md` (new file, root of repo).

## Studio editor-organization — deferred to last, confirmed safe (2026-07-14)

Field `title`/`description`/tab-grouping and the Structure Builder (sidebar navigation) are presentational
metadata only — changing them later costs no migration. What must be reasonably right from today: the
actual field `name` keys and document type `name`s, since renaming those after real content exists needs a
migration script. Today's skeleton pass already handles this; labeling/grouping polish is legitimately a
finalize-last task — better done last anyway, once the full type list is visible.
