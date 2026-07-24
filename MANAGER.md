# MANAGER.md — Mari Liveaboard website (Next.js + Sanity)

Running log for this repo's build. Companion to `CLAUDE.md` (prose rules/active decisions) and
`COMPONENTS.md` (not yet created — see CLAUDE.md's doc-split note). Keep entries terse + dated, per the
static-build repo's own size-discipline convention (archive past ~1,900 lines).

The static-build repo (`../v1-static-homepage/MANAGER.md`) holds the full pre-2026-07-14 history: sprint
planning, brand-dump decisions, page inventory, contracted deliverables. Don't re-read it cross-repo going
forward — this file is now the live one.

---

## ▶ RESUME POINT — see `_internal/RESUME.md` (checkpoint 2026-07-20)
**When Adinda asks "what's next," `_internal/RESUME.md` is the single source.** In brief: boat Instance-1 mobile bug
FIXED; `mari-project` skill REMOVED (MANAGER now sole tracker); 3 urgent skill-fix chat prompts queued for
Adinda, then full skill round → 2nd audit → Phase 3 (slim CLAUDE.md). Full findings: `_internal/AUDIT-2026-07-20.md`.

## 🔴 ACTIVE QUEUE — AUTHORITATIVE, THE SOLE TRACKER (the `mari-project` skill was REMOVED 2026-07-20; MANAGER now owns status/queue/ordering)

**Read this before planning any session.** The sprint in `mari-project`'s `working/sprint.md` is a
*planning artifact that has drifted* — it does not know about work Adinda queued after it was written.
Where the two disagree, **this list wins**. Adinda's explicit call 2026-07-16: capture sprint deviations
here rather than waiting for a chat-side skill-update round, because this file loads first.

### 🔵 GATED ITEM — componentize + write `COMPONENTS.md` (queued 2026-07-17, Adinda)
**Trigger: the moment the boat page is finished.** Not now, and explicitly NOT mid-slice — but it is
queued here so it doesn't evaporate, because it's the kind of task that only ever feels deferrable.

**Adinda's ask, in her framing:** *"after we finish the boat page, let's make sure we componentize
everything and set components as well, so that we can reuse the components that we've created in this
project and other websites or other projects as well."* So the goal is **cross-project reuse — other
Atlas boats AND other DRK clients** — not just tidying this repo.

**Why the boat page is the right trigger and not the homepage:** the boat page is where the same shapes
started repeating and the duplication became visible — the carousel arrow button (Cabins + Gallery +
lightbox, which is exactly what forced `CarouselChevron` out on 2026-07-17), the tab strip (Cabins 14px /
Gallery 12px — same component, different scale), the 708×532 image block (byte-identical between Cabins
and Gallery), the section heading + eyebrow pair, and the round icon button. **One page's worth of
evidence about what actually repeats beats a guess made up front** — this is the same reasoning already
in CLAUDE.md for why `COMPONENTS.md` "ports at first use, not up front".

**Scope when it runs:**
- Extract the repeating primitives above into real shared components; `CarouselChevron` is the precedent
  and the pattern (one asset + one component = uniform BY CONSTRUCTION, not by a number kept in sync).
- **Create `COMPONENTS.md`** — the fourth doc in the split that CLAUDE.md has always described as "not yet
  created, ports from the static build's `COMPONENTS.md` at first use". This is that moment.
- **Split Mari-specific from DRK-reusable as you go** and queue the reusable half into
  `_internal/handoff/drk-website.md` — per the daily-recap classification rule (local vs `atlas-website`-wide vs
  `drk-website`-wide). A component is only reusable across projects if its *spec* travels with it.
- ⚠️ **Watch the token coupling.** These components read semantic tokens (`action-primary`, `bg-page`)
  that are Mari's. A genuinely portable component takes the token as input rather than hardcoding it —
  otherwise "reusable" means "copy-paste and then fix the colours", which is what we have today.

**Estimate/model when scheduled:** ~3–4h, Sonnet-high (mechanical extraction against a settled design);
escalate to Opus only for the portability boundary (what's Mari's vs what's DRK's), which is the one
genuinely architectural call in it.

### ✅ DONE 2026-07-24 — root cleanup: all root `_*` entries consolidated into `_internal/` (queued 2026-07-23, Adinda; executed 2026-07-24)
**Executed as specced (the original gated-item spec is preserved in git history before this commit).
What moved (historical old names → new):** `_handoff/` → `_internal/handoff/`, `_scripts/` →
`_internal/scripts/`, `content/` → `_internal/content/` (git mv, TRACKING VERIFIED: `git ls-files
_internal/content/` returns the 3 copy drafts — the `ad06118` near-loss lesson was about tracking,
not location), and all 14 root `_*.md` docs with inner underscores dropped (`_RESUME.md` →
`_internal/RESUME.md`, `_PAGE-SPECS.md` → `_internal/PAGE-SPECS.md`, etc.). Gitignored scratch moved
by plain filesystem move: `_backup/` → `_internal/backup/`, `_image-test/` → `_internal/image-test/`,
the old `_content/` image scratch → `_internal/content-scratch/` (NOT `_internal/content/` — tracked
drafts and ignored scratch never share a folder), plus `_skill-image-retouch/` (+ .zip) and
`_dev-out.log`. **Stays at root: `CLAUDE.md`, `AGENTS.md`, `MANAGER.md`, `COMPONENTS.md`,
`README.md`, `SANITY-SETUP.md`, `skills-lock.json`, and all real build input.**
Same-commit amendments: AGENTS.md's "do not move content/" paragraph rewritten to name
`_internal/content/` as the canonical tracked copy-drafts home (so Codex doesn't recreate `content/`
at root); `.gitignore` rewritten from the `/_*` + `!` exception scheme to `/_internal/`-scoped
targeted ignores; `.vercelignore` simplified to one `/_internal/` line (root doc exclusions kept);
reference sweep across CLAUDE.md/AGENTS.md/MANAGER.md/COMPONENTS.md/`_internal/` itself (final grep
clean); `_internal/README.md` created (plain-language folder map + deployment boundary, Adinda's
ask). Chat-side skills still say `_handoff/` until the next skill round — the rename is noted inside
`_internal/handoff/drk-website.md` so the round picks it up; CLAUDE.md states the new path
authoritatively meanwhile. ⚠️ Deliberately NOT touched: `src/` and `public/` (a handful of code
comments still cite old doc names like `_PAGE-SPECS.md` — cosmetic, fix opportunistically when those
files are next edited; the dev server was left running throughout).

### 🆕 QUEUED 2026-07-22 (Adinda) — per-section QA is the LOCKED review method; homepage + boat get it retroactively
The destination build's rhythm — **every section reviewed TWICE at the moment it ships: (a) the
rendered page (desktop AND mobile) and (b) its Studio editing surface** — is working well
(Adinda's words) and is now the standing method:
1. **Remaining destination sections** (Overview, Gallery, Itineraries, Trips embed, Boats): QA
   per-section as each lands, same as Hero + FAQ already got. Not batched at the end.
2. **RETROACTIVE: homepage and boat page never had this pass** — they were reviewed
   whole-page/abstractly. Queue a section-by-section QA walk (page + Studio per section) for BOTH,
   after the destination page completes. Cheap per section; catches the "field wired to nothing /
   form control nobody understands" class the destination reviews keep surfacing (JSON-LD override
   prefill, card-toggle showing unset, meta-description overflow all came out of exactly this).

### Order of work (next sessions)
1. ~~**auto-hide guards + FAQ min-height.**~~ ✅ **DONE 2026-07-17** — see the 2026-07-17 checkpoint below.
   Guards on Why Us / Latest Articles / FAQ / Testimonials (Destinations ✓ CTA ✓ already had them);
   FAQ's empty test is "0 FEATURED questions" and needed no extra logic (HOMEPAGE_QUERY already filters
   `isFeatured == true`). Min-height locked at `lg:min-h-[calc(100dvh-70px)]` — **the max(600px, ...)
   floor was dropped on Adinda's call**, and mobile deliberately has no minimum at all. Verified by
   actually emptying the dataset and watching each section vanish, not by inspection.
   - **MANUAL SECTION TOGGLES ARE DROPPED for now** (Adinda, 2026-07-16) — see the standing to-do below.
     Re-confirmed 2026-07-17: *"we're not doing that now."* Auto-hide was always the real requirement.
2. **Theme — SPLIT INTO TWO, they are not the same task** (corrected 2026-07-16 after Adinda's screenshot):
   - **(a) Website:** primary background → `beige/100` (`globals.css`). Real frontend work.
   - **(a) DONE 2026-07-16:** `--color-bg-page` is now `--primitive-cream-30` (#fbf8f2, Figma **beige/100**),
     was `--primitive-cream-10` (#fdfcfa, read too white). Verified in the SERVED css, not just the source.
   - **(b) STUDIO, not the website — ✅ DONE + CONFIRMED BY ADINDA 2026-07-16.** Final value: **#bca18a**
     (Figma **chocolate/400**). Set on **BOTH** `--brand-primary` AND `--default-button-primary-color` in
     `sanity.config.ts` — they are one brand colour and must move together. Adinda confirmed the list row
     reads correctly **and the Publish button is fine**, which was the open risk (same token drives both).
     Background colour left as-is; she called further tuning overkill. **Closed.**
     **What it cost, and the lesson:** the task was logged as frontend `globals.css` work — the actual
     surface was a Studio row, so `globals.css` would have fixed nothing. Then a round was lost changing
     only `--brand-primary` (nothing visible happened) on the assumption it painted the row; a DOM inspect
     showed the row's `--card-bg-color` derives from `--default-button-primary-color`. **Adinda's one
     screenshot settled what Claude could not.**
     **Still true for any future contrast work:** `buildLegacyTheme` DERIVES the title/subtitle colours and
     we cannot set them, so the only lever is the background. It's deprecated — if contrast ever can't be
     solved within it, migrate to the v3 theme API rather than fight it.
   - **Palette name drift (Figma vs our CSS) — rename DECLINED, mapping table banked.** Figma renamed the
     colour families (cream→beige, copper→chocolate); our CSS kept the old names, so one palette now lives
     under two naming generations. Rename declined by Adinda: zero user impact, and the cost does NOT grow
     over time. The verified Figma→CSS mapping (plus **3 traps** where a naive rename silently swaps colours)
     is written into `globals.css`'s primitives header. **Rule: match tokens by HEX, never by NAME.**
     Prevention for future builds queued in `_internal/handoff/drk-website.md`.
2. ~~**`boatDefaults` singleton**~~ ✅ **DONE 2026-07-17** — see the checkpoint below. Estimate was ~0.5h
   and it held (Adinda's earlier de-padding correction was right again). Nothing referenced the moved
   fields, so it was a free move — which is exactly what "schema before frontend" was buying.
2b. **Testimonials PAGE — SCHEDULED 2026-07-17 (Adinda): build it IN PARALLEL WITH THE FAQ PAGE, same
   slot (Jul 23). It does NOT get its own slot.** Her reasoning: the two pages are near-identical in shape
   (a singleton with eyebrow/heading/intro + `seo`, auto-listing docs the frontend already has components
   for), so doing them back-to-back while the pattern is loaded costs far less than a separate slot.
   **This closes the "Testimonials has no slot" gap** that had been pushing Jul 23 over capacity — it is
   no longer additive. Still ⚠️ **NOT in the `mari-project` skill's sprint page table** — that's a
   skill-round item (already queued in `_internal/handoff/mari-project.md`), not a scheduling one.
   - **The gap:** we have `testimonial` documents but **no Testimonials page**. Same realization as the FAQ
     ("a thing with SEO + page settings is a page, not a component"). The `atlas-website` skill already
     specs a Testimonials hub; it was never added to the page inventory or the sprint.
   - **Shape — mirror `faqGeneral`, the pattern is already settled:** a **`testimonialsPage` singleton**
     (eyebrow / heading / intro + `seo` + a signpost note) placed in **Main Page Content**. The frontend
     auto-lists the `testimonial` docs. **The `testimonial` docs STAY in Shared Components** — unlike the
     FAQ they are genuinely cross-page (Home + About), so this is a real component + a page that lists it,
     not a page that owns its content.
   - No mockup exists ("simple, not designed yet"); copy needs writing. Adinda expects it to be quick.
   - **⚠️ Blind spot worth remembering:** `_internal/STUDIO-ORGANIZATION-AUDIT.md` checked every EXISTING type for
     "page or component?" — it could never surface a page that doesn't exist yet. When auditing structure,
     also ask what's MISSING, not just what's misplaced. Check the rest of the page inventory for the same
     gap (does anything else have documents but no page?).

**Estimating note (Adinda's correction, 2026-07-16 — worth not repeating):** the first pass at these was
padded to "3–4h" and "1–1.5h". She pushed back correctly — `destinationDefaults` took ~15 min, and
`boatDefaults` is the same job. The padding came from folding verify+docs+commit into the build number and
then rounding up again; that overhead is real but it's ~20 min, not a doubling. **Estimate the build, add
the overhead once, and don't price the user's own review time as build time.**
3. **Boat page slice — PLAN LOCKED 2026-07-17 (Adinda). Build in this order; the order is load-bearing.**
   1. **`boatDefaults`** (~0.5h) — schema before frontend. Moving these fields is free now, a rewire later.
      Field list approved below; **`keyFeaturesHeading` → singleton is Claude's recommendation, NOT yet
      confirmed by Adinda** — ask before building it.
   2. **Boat page sections** (3–4h).
   3. **Compact nav + sticky sub-nav** (2.5–3.5h) — LAST, because it needs the section anchors to exist
      before it can jump between them.
   **Adinda's explicit call: "if it takes two days, then it takes two days."** She chose to build the
   sub-nav properly today rather than ship the boat page without it and retrofit (which would cut against
   full-wire-per-slice). ~6–8h of work against ~5h remaining, so **1–3h spills into Mon Jul 20** — accepted
   knowingly, not an overrun. **Do not re-litigate this to save the calendar.**
   **The consolation is real:** the sub-nav is the SAME component on destination, so Monday's destination
   slice inherits it free. Today's spill buys down Monday rather than only deferring it.
   - ~~**REMINDER OWED: send the Figma colour-variable screenshots.**~~ ✅ **OBSOLETE — closed 2026-07-17.**
     She sent all 6 that morning and the full 11-token rename shipped off them (`1b56add`). This note
     outlived the thing it was reminding about, and was surfaced stale at the boat page start — Adinda
     caught it ("we already did the screenshots right?"). **The recall-then-VERIFY rule applies to our own
     notes, not just to skills:** a reminder is a claim about the present, so check it's still true before
     delivering it. What IS still owed by Adinda is a *different* Figma item — the code-syntax bindings
     (see the section above), which the screenshots never touched.
4. **Destination page slice** — where the destination FAQ *render* composition + the stable-key cross-page
   pull get built.
5. **Global-chrome slice** (Nav/Footer/newsletter/contact details/copyright/"By Atlas").
   - **Footer is MORE than links — Adinda's flag 2026-07-17.** The per-slice standing sub-step only
     un-hardcodes the *link targets*. Footer **content** (newsletter, disclaimer, copyright, brand-alias
     "By Atlas") is a separate small `siteSettings` pass — already scoped that way in CLAUDE.md, restated
     here because it read as unresolved. Not forgotten, just not a page-slice job.
   - 🔵 **NEWSLETTER — needs research BEFORE it's built. Raised by Adinda 2026-07-17; explicitly NOT
     blocking the boat page.** She wants the capture field to be integration-*ready*, not hardwired to a
     provider that doesn't exist yet. Her requirements, in her framing:
     1. There is **no mailing-list service chosen yet** — so the immediate need is simply *don't lose the
        emails*.
     2. Prefer a model that can **support multiple integrations** (or at least swap provider without a
        rewrite) rather than one that hard-codes a single vendor.
     3. If no service exists: just **capture the list** (Resend? a sheet? a Sanity doc?) and be ready to
        pipe it somewhere later.
     **Lead worth checking first — Resend is ALREADY IN THIS STACK** (per the `mari-project` skill's stack
     line: Next.js + Sanity + Vercel + **Resend** + GitHub) and has a Contacts/Audiences API. So "capture
     with no provider yet" may need **zero** new services. Check that before evaluating anything else.
     **Open question, do not assume:** whether Sanity has a native newsletter/subscriber option worth using
     (Adinda asked; unverified — do not answer from memory).
     ⚠️ **Do not build speculatively** — this is the `isFeatured` / section-toggles trap. Research, propose,
     get Adinda's call, then build. A Perplexity prompt was drafted for her on 2026-07-17.

### 🔵 NOTE 2026-07-21 — `_internal/handoff/mari-core.md` RETIRED (Adinda: mari-core is correct, all four items dropped)
Adinda confirmed the mari-core facts questioned on 2026-07-17 are correct as locked: the 3-outdoor-space
inventory, the sky-deck naming, and the equipment ✅s (oxygen / first aid / camera rinse tank); the hull
colour question was dropped as a non-issue. **`_internal/handoff/mari-core.md` DELETED — no mari-core skill round
needed, now or later.** Follow-through moved into `_internal/handoff/mari-website.md`: (a) the two stale "sun deck"
lines in `private-charters.md` L71/L96 are now a **safe straight replace** (the old Serge gate is closed),
(b) flip mari-website's 🔴 "unverified" flags on oxygen/first-aid/rinse-tank to match mari-core's ✅ — so a
copy pass doesn't refuse to publish settled facts. Cross-refs cleaned the same day in `_internal/ADINDA-TODOS.md`
(items 3/5/8), `_internal/RESUME.md`, `_internal/SKILL-ROUND-PLAN.md` (§5 + cleanup checklist), `_internal/STEP2-READY.md` (§5 + the
mari-website paste block), `_internal/AUDIT-2026-07-20.md` (mari-core lane), and CLAUDE.md's two filename-lesson
blocks (the lessons stand; the "evidence against the inventory" claims are annotated closed).

### ✅ CHECKPOINT 2026-07-22 (2) — SESSION CLOSE: KOMODO PAGE FEATURE-COMPLETE (slices 5–7 + JSON-LD prefill + drk-seo pass)
**Model:** Fable 5. `tsc` ✅ · eslint ✅ (0 errors) · `/` `/boats/mari` `/destinations/komodo` `/studio` 200 ·
9 commits `c8a0a04`→`f6c37e5` (+docs). **Every section QA'd by Adinda per-section (page desktop+mobile+Studio)
as it shipped.** Dev server LEFT RUNNING at session close — Serge is reviewing via LAN
(⚠️ Sanity CORS for `192.168.0.101:3000` still un-added → no live updates on his browser; renders fine).

**Shipped this session (afternoon block):**
1. **Gallery (778:8677, `c8a0a04`/`cd277d9`/`4c8c4ae`):** full-bleed square grid (4/2-col), tiles + a
   floating "View All Images" pill (rounded solid surface + CarouselArrowButton-surface shadow; px-16
   compacted from 24, old value recorded) open the combined SiteLightbox. NO visible heading by design —
   `galleryEyebrow`+`galleryTitle` REMOVED from destinationDefaults → single `galleryCtaText`; sr-only
   name reuses `subnavGalleryLabel`. 8 images from the Figma fills seeded (+draft captions for QA);
   `galleryImage.categories` now hidden off non-boat docs (Adinda's catch — boat-tab leak).
2. **Itineraries (778:8688, `367ae73`/`bc11bf6`/`9fe4985`):** hover/tap-reveal cards; conditional
   carousel (static when cards fit 3/2/1; drag+snap+infinite loop + arrows when not); mobile card 70dvh +
   line-clamp-6 + 240-char counter; NO texture (fights Trips below); route line label-sized. Schema:
   `season`/`image` added; **ordering = DRAG ARRAY `destination.itineraries` (order = display, omission =
   hidden — the curation ask free); numeric `order` added then REMOVED same day.** 4 more real itineraries
   seeded from the mari-itineraries library (7 total; seasons 🔴 placeholder); SEO prefilled on all 7.
   🔴 **iOS first-tap-hover trap fixed: touch reveal rides POINTERUP, never click** (CLAUDE.md + handoff).
   **Whole-card links REMOVED everywhere — they fight drag; CTA-only navigation (locked).**
3. **About the Boats (778:8697, `a6f98a9`/`2cb09f9`/`1797ddd`):** one-boat stepper, arrows hide at 1;
   LIGHT texture section (the dark reference was the Figma-canvas trap again); desktop overlap asymmetry
   (image +64px down, card −96px overlap, bleeds right edge); mobile image-first 3:2 full-bleed; image =
   link + hover zoom + touch-swipe steps boats. **`boat.excerpt` (Card summary, richTextBasic, live
   PT char counter + ~500 warning) — NOT overviewBody** (too long, Adinda). Singular/plural heading = two
   explicit defaults fields (localization-proof). Test boat `boat-nusa-test` ("Nusa", manta cover) —
   🔴 DELETE before launch. 🔴 **Bug class logged: `data-reveal` + keyed remount = permanently invisible
   content** (ScrollReveal scans once on mount) — guard comment in DestinationBoats.
4. **JSON-LD override prefill (`e63ba41`) — the overdue promise, CLOSED:** `JsonLdPrefillInput` fetches
   the RENDERED page (same-origin) and extracts its ld+json — single source, can't drift. Invalid-JSON
   Studio warning added (closes that _internal/POLISH-BACKLOG.md item).
5. **drk-seo verify pass (`f6c37e5`) — RUN, page healthy:** 1 h1 / no level skips / FAQPage(16)+
   Organization valid / canonical+og+twitter present. Fixed: footer `#schedule-rates` dead hash →
   `/schedule-rates`; Overview highlight slides now aria-hidden-when-inactive with REAL alt (were
   shipping 6 content images alt="" to crawlers). Remaining bare-`#` links = nav/footer placeholders
   (global-chrome slice, accepted).
6. **Standards locked:** booking embeds full-bleed on mobile (negative margins, NEVER 100vw);
   `_internal/OWNER-HANDBOOK.md` created (living owner-guide source; CLAUDE.md doc-split 8th member).
   COMPONENTS.md shelf: GridGallery, ItineraryCardCarousel, OverlapShowcase, Studio inputs registered —
   extraction deferred to second consumer / componentization pass (Adinda's call). Arrow scan PARKED.

**Open after this session:** Serge review feedback · itinerary seasons 🔴 (content pass) · delete
`boat-nusa-test` after approval · boats-on-route model before a real 2nd boat · retro homepage/boat
per-section QA (queued 2026-07-22) · skill round + audit + Phase 3 (destination page now DONE — unblocked).

### ✅ CHECKPOINT 2026-07-21 (4) — SESSION CLOSE: SubNav APPROVED, gallery CTA, lightbox fullscreen
**Model:** Fable 5. `tsc` ✅ · eslint ✅ · `/` `/boats/mari` 200 · **every item below reviewed +
approved by Adinda in the browser before this checkpoint. Session closed here; `_internal/RESUME.md`
rewritten as the next session's automatic kickoff.**

**SubNav — FINAL, APPROVED, LOCKED AS A PATTERN (site-wide + future DRK sites; queued for
`drk-website`).** Final desktop ladder (post-checkpoint-3 refinements):
1. Top: full dark transparent nav + hero + static rail.
2. First scroll (flip threshold): nav goes STRAIGHT to the compact light row (Mari · menu items ·
   Find a Trip) — NO intermediate full-light flip on subnav pages ("too many transitions is
   dizzying"); the hero rail still visible below = anchors always in exactly one place.
3. Past the rail: navy-glass section row (90%+blur, amber active) fades in beneath (subnav-reveal
   keyframe — a top-transition slide-from-bottom artifact was removed).
🔴 **Oscillation bug fixed on Adinda's catch ("subnav does not float anymore"):** the float
boundary measured the LIVE header height, but floating shrinks the header → feedback loop at the
hand-off band. Boundary now = full-nav height FROZEN while floating (`SubNav.tsx`, documented).
Mobile: nav always visible, light chip bar, approved unchanged.

**Gallery section (Adinda + a Serge complaint):**
- `SingleImageCarousel` chevrons (Cabins + Gallery): fully-opaque beige-50, 24px (was 80% × 16px),
  shadow kept, directional-nudge hover. Component/pattern NAMES REGISTERED for componentization:
  **`SingleImageCarousel`** (single-image thumbnail carousel — masonry etc. may join later),
  **`LightboxGallery` variant `default`** (the YARL config), joining `SubNav`, `TabRail`,
  `CarouselChevron`.
- **"Open Gallery" header CTA**: desktop replaces the round category arrows (categories = tabs
  only); mobile keeps the tab-row arrows AND gains the button (homepage section-header recipe
  verbatim — LatestArticles/Testimonials/FAQ share one structure). Opens the LightboxGallery with
  ALL images at the currently-shown photo. Label editable: `boatDefaults.galleryCtaText`
  (seeded "Open Gallery"; `_internal/scripts/seed-gallery-cta.ts`); **destinationDefaults gets its twin at
  destination-build time — Adinda's "both defaults" was speech-to-text for BOAT defaults.**
- **Lightbox fullscreen** — YARL's official plugin in the shared `SiteLightbox` config → all
  lightboxes at once; enter/exit icons in our mask style. ⚠️ iPhones have no fullscreen API — the
  button correctly doesn't render there; not a bug.

**Session total:** see the Time Log row (≈5h elapsed ≈ active — interactive design iteration).
Open items and next actions: `_internal/RESUME.md` (rewritten this checkpoint).

### ✅ CHECKPOINT 2026-07-21 (3) — SubNav FINAL FORM (two-row compact chrome) + scroll-top + fixes
**Model:** Fable 5. `tsc` ✅ · eslint ✅ · `/` `/boats/mari` 200 · **iterated live with Adinda through
4 design pivots — the final form is what she approved; the intermediate states below are recorded so
nobody resurrects them.**

**SubNav final desktop behavior (the pivots that got here):**
1. auto-hide nav w/ scroll-up reveal → REJECTED (3-row stack on scroll-up).
2. unified single bar (Mari · sections · CTA in ONE row) → REJECTED (misunderstanding).
3. two-row: navy compact nav over light section row → REJECTED (main nav stole attention).
4. **FINAL: floating = compact LIGHT nav row (Mari · full menu items · Find a Trip, no
   email/WhatsApp) + NAVY GLASS section row beneath (90% navy + blur, amber active/hover)** — the
   section row takes centre stage; both rows h-48 exactly; NO scroll-direction logic anywhere (full
   nav returns only near page top); mega menus restore the full nav while open; menu items are ONE
   JSX definition shared by both nav forms (cannot drift). Mobile: nav never hides (hamburger =
   wayfinding, Adinda), light chip bar under it, unchanged.
   Entrance = subnav-reveal FADE keyframe (globals.css), motion-safe; the top-transition slide-from-
   bottom artifact was removed on Adinda's catch.
**Coordination lives in `navScroll.ts`:** shared flip thresholds + the navChrome store
(subNavFloating). Backup of the pre-rework state: commit `806c9c3`.

**Scroll-top button (site-wide, `ScrollTopButton.tsx`, root layout):** bottom-right, glass navy
(90% + blur + faint border + whisper shadow — tuned twice from Adinda's feedback), hero-indicator
chevron asset pointed up, appears at the nav-flip threshold, reduced-motion honoured.

**Scroll-spy hardened:** active section recomputed from POSITIONS on every observer tick (last top
past the 35% line) — the entry-order race (fast backward jumps sticking the wrong item) is dead.
Rail scrolling is reveal-only (fully visible items never move). Layout/Specs sync is bidirectional
(in-section tab clicks replaceState the hash + dispatch hashchange).

**Also this arc:** brochure CTA rebuilt to node 778:8741 (PDF-icon circle, gap-8, bold label) with
the DOWNLOAD glyph (Adinda's override of the node's arrow_forward; icon-download.svg — the iOS
grey-square saga ended by matching the proven Figma asset format: positive viewBox + %-dims);
opens new tab. Stats+brochure grouped at gap-24 (node 778:8723). Placeholder brochure PDF seeded
(`_internal/scripts/seed-brochure-placeholder.ts`) — replace with the real one in Studio. Accordion hover =
active's colour treatment, site-wide (subagent; locked in CLAUDE.md). Android large-font accordion
leak fixed (grid-item padding rule — documented in Nav.tsx). Hero bottom scrim. Mobile rail flush
left. `lg:page-gutter-x` variant-on-@utility compiled wrong — plain utilities now (documented).

**Open:** boat page = gallery uploads (Adinda) + final all-sections review + post-slice drk-seo pass.
Then the between-pages track (work-tracker → Phase 3 → componentize → skill round → audit).

### ✅ CHECKPOINT 2026-07-21 (2) — SubNav desktop + nav hover/active + chevron standard + cabins rhythm
**Model:** Fable 5. `tsc` ✅ · eslint ✅ · `/` `/boats/mari` `/studio` 200 · **each piece REVIEWED by
Adinda in the browser before this checkpoint** (sub-nav clicks incl. Layout/Specs tab pre-select ✓,
nav colours both states ✓, cabins rhythm ✓, chevrons ✓).

**SubNav (desktop, non-floating)** — new shared `src/components/SubNav.tsx` (destination page reuses):
- Real `<a href="#…">` anchors + IntersectionObserver scroll-spy (top-third band, `-70px 0px -65%`),
  smooth scroll via `motion-safe:scroll-smooth` on `<html>` (layout.tsx) — native anchor semantics
  kept, reduced-motion honoured. Sections got `scroll-mt-[70px] lg:scroll-mt-[110px]` (BoatOverview's
  existing convention).
- LAYOUT + SPECS deliberately share one target: `#layout` / `#specs` are real zero-size anchors in
  BoatSpecs; its hashchange listener pre-selects the matching tab. Deep links work (`#specs` opens
  scrolled + tab active).
- Items hide when their section would (guards mirror each section's empty test). NOTE: dataset has
  23 gallery images — `_internal/RESUME.md`'s "gallery renders nothing" was STALE.
- Labels editable in `boatDefaults` → "Section navigation" fieldset (seeded; rides field-level i18n
  later). Item styling = TabRail chip sized up (p-16), inactive at the TabRail 40% (Figma's 55/60
  overridden, Adinda). **Pending: floating/compact state + the mobile pass (started next).**

**Nav menu links — hover + active state (Adinda's long-deferred ask):**
- Hover/active accent is TWO tokens by nav state: dark bar → `accent-ondark-primary` (amber);
  light/floated bar → `action-primary` (chocolate, matches Specs/Cabins tabs). First pass used amber
  in both — Adinda caught the light-state error. Active page = `aria-current` holding the accent
  (only The Boat resolves today). Dropdown chevrons follow their labels.

**Accordion chevron STANDARD locked (CLAUDE.md Styling):** `h-[6.5px] w-[10px]` +
`mask-size:100%_100%` in the `size-[20px]` box — never `size-[10px]`+`contain` (~7.6px, elongated).
Homepage FAQ + boat FAQ brought in line with Specs. Goes into the shared accordion contract at
componentization. Nav's own 7×6 glyph untouched (Adinda asked — colours/transitions only changed there).

**Cabins spacing (Adinda's "looming" polish):** description→tabs→image now 32 / **36** / (mobile) and
48/48 (desktop) — the 36 is +one-unit air before the image, arbitrary value, off-scale, don't round.
**Tab-strip gap-4 between tabs was tried and REJECTED same-day** (seam in the continuous underline
track "looks very strange") — comment in BoatCabins warns against reintroducing it.

Seeds: `_internal/scripts/seed-subnav-labels.ts`. Open: SubNav mobile (in progress) → floating state → final
boat review → post-slice drk-seo pass.

### ✅ CHECKPOINT 2026-07-21 — categorized FAQ built + reviewed, rename-proof composition, paragraph rule
**Model:** Fable 5. `tsc` ✅ · `eslint` 0 errors · `/` `/boats/mari` `/studio` all 200 · **REVIEWED BY
ADINDA on the rendered page** (FAQ look ✓, spacing ✓, rename test ✓) — not just automated checks.

**Built — the `categorized` FAQ layout (Figma `Section/FAQWithCategories` 703:3047 via 778:8696):**
- `BoatFaq.tsx` REBUILT as the categorized variant: homepage `Faq`'s expression verbatim (dark texture,
  header + Read-All button, Block/FAQItem rows, 500ms accordion, first-question-open, same min-height,
  empty → hides) + category rail left (320px cap, 4px active bar) / single accordion column right.
  Mobile: rail becomes the draggable chip track (Destinations pattern) with scroll-into-view.
  `default`/`categorized` are the locked variant names (2026-07-17) — merge into ONE Faq component with
  a `layout` prop at the componentization pass.
- **Accordion mechanics = homepage button pattern, NOT `<details>` (Adinda's call after SEO analysis):**
  the two are SEO-equivalent (all answers in DOM either way; JSON-LD + headings + anchors are the real
  levers), so behavioral parity with the shipped homepage won. Do not "fix" this back for SEO.
- **Shared-category composition IMPLEMENTED** (was a schema-comment promise since 2026-07-16): boat page
  = boat's own sections + General FAQ categories flagged **`showOnBoatPages`** — an editor-visible toggle
  on faqSection, NOT a title match. First pass matched titles; Adinda caught that renaming would silently
  drop a category. Toggle is rename-proof (verified by an actual rename in Studio) and shows editors what
  is shared. Same pattern available for destination pages later (`showOnDestinationPages`, not built).
- `boatDefaults` + FAQ fieldset (`faqEyebrow`/`faqHeading` `{boat} FAQ`/`faqLinkText`), seeded via patch;
  page JSON-LD + rendered DOM now built from ONE composed list so they cannot disagree (11 questions).
- Seeds: `_internal/scripts/seed-faq-defaults.ts`, `_internal/scripts/seed-faq-share-toggles.ts`.

**Rules locked this session (Adinda):**
- **Paragraph spacing: the RichText WRAPPER owns it — `gap-16` body-large / `gap-12` body-medium**,
  responsive text steps the gap. Found live in FAQ answers; four other body-medium wrappers (Specs ×2,
  Gallery tab body, cabin descriptions) had silently omitted it — all fixed. Documented in
  `RichText.tsx` header + CLAUDE.md Styling.
- **Links: internal = same tab, external = new tab (+noopener) — REAFFIRMED, stays.** Adinda floated
  all-new-tab for section links; pushback accepted ("keep same page for now, easy to change later").
  Lives in `RichText`'s link mark + per-component links; centralize in a link primitive at componentization.
- **Global rail behavior + name: `TabRail`** (Adinda asked for a name — proposed, not yet confirmed).
  The draggable scrollbar-hidden chip/tab track: drag-scroll, active-chip `scrollIntoView`
  (`inline:'start'`, browser clamps for last items), skip-on-mount guard. Now in 4 places
  (Destinations, Gallery, Cabins, FAQ mobile) — extract as ONE component at the componentization pass.
- `/faq` route linked from both FAQ sections ahead of its build (Adinda's call); flip `<a>` → `Link`
  when the page ships.
- Deck-plan hover "black border" fixed: Chromium bleeds a box-shadow inward when shadow + overflow clip
  share an element and a child transforms — shadow and clip now on separate elements (`BoatSpecs.tsx`).

**Also in this commit (prior-session leftovers, verified working):** BoatHero mobile stats strip
scroll-not-wrap fix (2026-07-20, enlarged-font wrap bug) + the OG-image backlog note above.

**Open:** `/faq` page design+build (queued — Figma not designed yet) · destination-page FAQ pull toggle ·
homepage FAQ still flattens answers to plain text (loses paragraphs/marks — fine while answers are
1-paragraph; revisit at componentization) · sub-nav next (needs Figma link).

### ✅ CHECKPOINT 2026-07-20 (3) — YARL adopted, boat page polish, Layout & Specs rebuilt
**Model:** Opus 4.8 (1M context). `tsc` ✅ · `eslint` 0 errors · `/` `/boats/mari` `/yarl-test` all 200.
Commits: `d72cd31` `bab1505` `f495f1d` `207dfd7` (plus the SEO chain in checkpoint 2).

**🔴 NOTHING IN THIS CHECKPOINT HAS BEEN CLICKED.** Every automated check passes, but no lightbox
has been opened and the new Specs section has not been seen rendered. `tsc`/lint/200 cannot prove
either works — that is the whole point of the "a ritual that cannot fail is not a check" rule.

#### YARL adopted (Adinda's verdict after reviewing /yarl-test: "I do want YARL")
- **`src/components/SiteLightbox.tsx` is NEW** — one shared component holding the approved config,
  and the dynamic-import boundary. Not duplicated into both sections: the config took many rounds to
  settle and two copies would drift. Same reasoning as `CarouselChevron`. **This is a head start on
  the componentization block already queued above.**
- Dynamic import, `ssr: false`, with a `hasOpened` latch — verified ZERO `yarl__` markup in the
  initial payload, so the ~40KB only loads on first open.
- **Cabins now HAS a lightbox** (it never did). All cabin types combined into one, each slide
  labelled from `cabinType.name`. Opening from Superior lands on the Superior photo, not slide 0.
  `cabinType.images` is `imageWithAlt` with NO caption field, so `alt` doubles as the caption.
- ⚠️ **Unreviewed behaviour change:** the old lightbox hid the thumbnail filmstrip on mobile; the
  approved reference does not, so it now shows there.

#### Schema — `galleryImage.title` REMOVED
It duplicated `alt` (every seeded image had both set to the identical string). ⚠️ Existing documents
still CARRY title values — Sanity does not delete data when a field leaves the schema. Left
deliberately as the only record of the old values.

#### Boat page polish (all Adinda-directed, all unreviewed)
Gallery is now a **GRID, not flex** — on mobile the tab panel must sit BELOW the image while the
heading stays above, and those two are not siblings, so `order` cannot reach across the nesting.
Desktop is visually identical. Tab rail is a spacer sibling filling only the gap to the arrows (the
earlier border-on-container approach put two 2px borders at the same offset and the active tab
looked like it didn't cover). Tab scroll-into-view copied from Destinations — **its mount guard is
load-bearing**, without it every page load jumps to the gallery.
Cabins: mobile gap 80→24, tabs 12px on mobile, `deckLocation` moved into the eyebrow.
Overview: read-more threshold −80px desktop only; button up 16px when collapsed.
Lightbox caption: one bottom line, count first, beige-50, gradient into the scrim, **clamp removed**
(`descriptionMaxLines` is `-webkit-line-clamp`, so long captions truncated instead of wrapping).

#### Layout & Specs rebuilt (`207dfd7`)
Tabs copied from Cabins, accordion from the homepage FAQ with ondark→light token substitutions.
⚠️ **Built WITHOUT a Figma node link** — the standing rule asks for one; it wasn't available and
Adinda asked to start. Spacing needs a pass against the real node.
⚠️ **No longer `<details>/<summary>`** — incompatible with the FAQ's animation (the UA hides children
instantly when `open` drops, so the transition never runs). Keyboard access and crawlability are
both preserved.
⚠️ `layoutDiagrams` is EMPTY in Sanity, so the Layout tab hides and only one tab shows.

#### Open / owed
- 🔴 **Click the two lightboxes** — gallery and cabins, desktop and phone.
- 🔴 **Review the rebuilt Specs section rendered**, incl. mobile (two-col → one-col, scrolling tabs).
- 🔵 Delete `/yarl-test` once the real lightboxes are confirmed — it is now redundant.
- 🔵 Mobile filmstrip: show or hide?
- 🔵 Single-tab strip on Specs: keep or hide?
- 🔵 Figma node link for Layout & Specs.
- 🔵 Gallery captions are PLACEHOLDER copy — replace before launch.
- 🔵 `_boat.md`'s "Verification Required" list (9 items) — Adinda says the claims are correct, but
  they are now live on the page and were never formally confirmed.
- 🔵 Image SEO: only 3 of 23 gallery images reach the HTML. Research says hidden images are NOT
  reliably indexed; the ranked fix is a real `/gallery` page, then a scroll-snap track, then an
  image sitemap. Not started.
- 🔵 **BACKEND PASS — auto-derive Open Graph from existing data (Adinda, 2026-07-21).** Social
  sharing (OG title / description / image) should PRELOAD automatically from data the page already
  has — hero/cover image, page title, tagline — so a share card looks right even when the editor
  never touches the dedicated `seo.ogImage`/`ogTitle` fields. Today's SEO wiring (commit `a2dcaa4`,
  `src/lib/seo.ts`) falls OG *title/description* back to page title/tagline but has NO image
  fallback, so with no `ogImage` uploaded there is simply no card image. Build the chain
  `seo.ogImage` → **hero/cover image** → `siteSettings` default OG image, inside `buildSeoMetadata`,
  for the homepage and every page type. NOT now — this is a backend-pass item.
  **DRK-reusable** (sensible default for every DRK site, not Mari-specific) → queue into
  `_internal/handoff/drk-website.md` when the backend pass runs.
- 🔵 Session time log for 2026-07-20 STILL not filled.

### ✅ CHECKPOINT 2026-07-20 (2) — SEO wiring fixed end-to-end + boat page polish pass
**Model:** Opus 4.8 (1M context). `tsc` ✅ · `eslint` 0 errors (17 pre-existing warnings) ·
`/` `/boats/mari` `/yarl-test` all 200 after a clean restart (`.next` removed, server killed by PID —
`TaskStop` alone leaves the `next` child holding the port, which cost a wrong diagnosis this session).

**⚠️ NOT REVIEWED BY ADINDA.** Every visual change below is unreviewed — she stepped away before seeing
the boat page. Do not treat any of it as approved.

#### 1. SEO — the logged gap was one layer deeper than logged, and the reference was broken
Commits `cf9d42e` (fix) · `8c8e587` (doc corrections) · `f400188` (stega).
- Homepage had **no `generateMetadata`**. Now has one.
- `HOMEPAGE_QUERY` never selected `seo` at all — CLAUDE.md claimed it did "at line 86"; that line was
  inside `BOAT_QUERY`.
- **`SeoData` declared `metaTitle`/`metaDescription`; the schema defines `title`/`description`.** So the
  boat page's `generateMetadata` — the designated reference to copy — had **never** read the seo field.
  `tsc` cannot catch this: query results are **cast**, so a wrong field name type-checks against nothing.
- CLAUDE.md's "the boat title is the fallback working correctly, don't fix it" note was **wrong** and has
  been corrected. It was one session away from causing this fix to be reverted.
- `stega: false` added to both metadata fetches (no-op today; prevents silent corruption when Visual
  Editing is enabled).
- **Verified end-to-end against served HTML**, not source: both titles now come from Sanity. Seeded via
  `_internal/scripts/seed-seo.ts`. Copy is **drafted, not approved** — `mari-website` had both as TBD. Adinda:
  *"I'm ok with anything for now as long as the SEO works"*, to be redone at real-content time.

#### 2. Boat page polish (commit `437ece1` + follow-ups)
Gallery: eyebrow→heading `gap-8`→`gap-24`; arrows moved beside the heading (eyebrow on its own line,
heading+arrows share a row — the `LatestArticles.tsx:44-52` pattern); **mobile-only second arrow set at
the end of the tab row** so the underline track stops before it (Destinations treatment, Adinda's
explicit call, she pre-approved duplicate buttons). Cabins: tab items centred on mobile; cabin **name**
now shares a row with the arrows, the "3 Cabins · Max 2 Guests" label dropped to its own row.
Both: `aspect-[708/532]`→`aspect-[3/2]`, plus `data-reveal` + hover zoom (neither section had either).
**All arrow glyphs de-fonted** — 0 raw `→` characters left on the page; both sections now CSS-mask the
same `icon-arrow-forward.svg` Destinations uses, so weight is uniform by construction.

#### 3. Lightbox scrim + YARL evaluation
New primitive `--navy-975 #0a111f` (navy-950 was already the darkest step; Adinda wanted darker,
approved pure black but near-black-with-navy-cast was used to stay in-palette) + semantic
`--color-background-lightbox-scrim`, deliberately NOT reusing `background-ondark-muted`. Scrim +
`backdrop-blur-md` applied. **Verified in the COMPILED css**, not source.
🔵 **`/yarl-test` (commit `9f3ee79`) is a THROWAWAY route awaiting Adinda's UI verdict** — delete it once
the call is made. It demos (a) YARL reproducing the current gallery and (b) **cabins combined into one
lightbox with each slide labelled by cabin name, derived from `cabinType.name` with NO schema change** —
which matters because `cabinType.images` uses `imageWithAlt`, which has no title/caption field at all.
**YARL is ~2-3h, not a small fix** — flagged to Adinda; the existing lightbox is ~100 lines inlined in
`BoatGallery.tsx`, is NOT a shared component, and YARL is installed but has never been imported.

#### 4. Two bugs I introduced and caught — both invisible to tsc/eslint
- JSX comment placed inside a ternary / between attributes → parse error. Twice. `tsc` caught it.
- **A `mask-image` arbitrary-value class written inside a SINGLE-quoted JS string** → Tailwind baked the
  backslashes into the class name and emitted an unresolvable escaped URL. **`tsc` AND `eslint` both
  passed; the page 500'd and the only evidence was `Module not found` in
  `.next/dev/logs/next-development.log`.** Use double-quoted JS strings for such classes.
  This is the "read the dev log before theorising" rule paying off again.
- 🔴 **AND THEN THIS FILE CAUSED THE SAME BUG.** Writing that broken class **as prose in this checkpoint**
  re-broke the build: **Tailwind v4 scans every non-ignored file in the project, including `.md`**, so it
  extracted the pattern out of the documentation and tried to generate a real rule for it. The site 500'd
  with an identical error, from a Markdown file, with no code change. **Never paste a literal
  arbitrary-value class into a tracked doc** — describe it, or break the token up. Same trap applies to
  `CLAUDE.md`, `_internal/SCHEMA-SPECS.md`, and any doc Tailwind can see. (`_internal/handoff/*` is safe only because
  `/_*` is gitignored.)

#### Open / owed
- 🔴 **Adinda's visual review of the whole boat page** — nothing here is approved.
- 🔵 **YARL verdict** at `/yarl-test`, then delete the route.
- 🔵 Gallery `gap-24` vs Cabins `gap-32` still differ; site-wide there are **three** eyebrow→heading gaps
  (24 / 24-lg-32 / 32). Adinda offered a normalisation pass — not taken up yet.
- 🔵 `data-reveal` remains **opt-in with no failure mode**; the structural fix (wrapper component) is
  deferred to the componentization block.
- 🔵 Session time log NOT filled for 2026-07-20 (Adinda stepped away mid-session) — owed at next bookend.
- Handoff staged this session: SEO silent-omission trap → `_internal/handoff/drk-website.md`; scroll-reveal opt-in
  rule → `_internal/handoff/atlas-website.md`. **Both staged only, not merged into the skills.**

### ✅ CHECKPOINT 2026-07-17 (3) — Overview refinements + the "mobile read-more" bug was CACHE, not code
**Model:** Opus 4.8 (1M context). `tsc` ✅. Dev server restarted clean; `/` 200 + `/boats/mari` 200.
~~⚠️ `eslint` has **4 PRE-EXISTING errors** in `Nav.tsx` + `TheBoat.tsx` — `<a href="/boats/mari/">`
instead of `<Link>`.~~ ✅ **STALE — CLOSED 2026-07-20 without any code change.** Re-checked: both files
already import and use `<Link>` (`TheBoat.tsx:2,23-24,46` · `Nav.tsx:4,207,431`), and `tsc` + `eslint`
are **both clean, zero errors**. The remaining raw `<a>` in `Nav.tsx` are correct as-is — two `mailto:`
and several `href="#"` placeholders for routes that don't exist yet. Most likely fixed within the
2026-07-17 boat slice itself, after this checkpoint line was written.
**Lesson (same one as the stale Figma-screenshots reminder above):** this sat in the queue as a real
scheduled item for three days and would have consumed a slot. **A logged to-do is a claim about the
present — re-verify it before scheduling it, not just before reporting it done.**

**Shipped + approved by Adinda:**
- **Hero mobile +40px** — `translate-y-[40px] lg:translate-y-0`. A transform, NOT padding: under
  `justify-center`, 40px of padding moves content only ~20px (padding shrinks the box, centring re-splits
  the remainder), and moves it none at all once content exceeds `min-h-dvh`. 40 is off-scale → `[40px]`.
- **Editorial headings get `mt-8 first:mt-0`** (RichText, so site-wide). A margin, not the parent's gap:
  a gap is symmetric, but a heading belongs to the text BELOW it and needs more space above than below.
  Verified live: computed `margin-top: 8px`. **Line-height deliberately NOT touched — Adinda's explicit
  call ("line-height is not it at all").**
- **Read less now scrolls to the top of its containing section** — new **site-wide pattern**, explicitly
  **NOT accordions** (closing one FAQ item must not yank the page). Scrolls to the SECTION, which sits
  above the shrinking content, so the target doesn't move during the 700ms collapse. Honours
  reduced-motion. **Not yet extracted to a shared component — one consumer today; extract when the
  destination page needs it, which is the free moment.**

**🔴 THE BIG ONE — "Read more missing on mobile" was the PHONE'S CACHE. There was never a code bug.**
Adinda confirmed: *"incognito fixes it."* This burned most of the session across three wrong theories.
Full rule + the two-allowlist finding written into CLAUDE.md ("Real-device testing: PRIVATE TAB FIRST")
and queued for the skill. The short version:
- **Private/Incognito tab is now the FIRST question on any real-device bug**, ahead of the
  localhost-vs-LAN check — a phone can't be hard-refreshed, so our restart-clean ritual never covered it.
- **The tell was misread:** she reported a missing CSS change AND a missing JS behaviour. One stale bundle
  explains both; no code bug explains both. **Two symptoms with no shared mechanism ⇒ suspect the build
  the device is running.**
- **Claude error worth keeping:** a headless "reproduction" was reported as genuine, then retracted — the
  390/1440 DOMs were byte-identical because Tailwind is CSS-only, so the DOM never varies by width. It was
  measuring hydration timing, not viewport. **A real emulated viewport (puppeteer-core + system Chrome,
  installed in the scratchpad, NOT the repo) proved the component works at 390px:** button present,
  scrollHeight 1642 vs clientHeight 506. That harness is worth reaching for earlier next time.

**🔴 OWED BY ADINDA — Sanity CORS. Real, open, one click, only she can do it (project admin).**
`https://sanity.io/manage/project/kb8eim50/api?cors=add&origin=http%3A%2F%2F192.168.0.101%3A3000`
("Allow credentials" ON). **NOT the read-more bug** — proven: button + margin render fine via the LAN IP
with this error firing. It kills **Sanity Live**, so published content won't live-update on the phone.
**Sanity's CORS list is a SECOND allowlist, separate from `allowedDevOrigins`** — setting one does nothing
for the other, and both need re-adding if the Wi-Fi IP changes.

### 🔴 RESOLVED 2026-07-17 (4) — `richTextFull` had NO LINK OPTION. Adinda spotted it. Real bug.
**Tier 3 — the *fuller* tier — was missing a capability tier 2 had.** An editor could not put a URL in the
**T&C body, a blog post, the boat overview, or the destination overview** (all four use `richTextFull`).

**Root cause — a Sanity footgun worth never re-learning:** the `block` type ships a `link` annotation **by
default**, and **declaring `marks.annotations` REPLACES that default array rather than merging into it.**
`richTextFull` declared `annotations: [alignAnnotation]` to add alignment and **silently deleted link in
the same stroke.** Nothing errored; the button just wasn't in the toolbar. **The same trap applies to
`styles`, `lists`, and `decorators` — declare one and you own the whole list.**

**Why it hid for 2 days:** CLAUDE.md's own locked tier-3 spec (2026-07-15) lists "H1-H6 + Normal + Quote,
bold/italic/underline/strike/code, alignment, inline image, raw HTML embed" — **`link` isn't in the spec
either.** The spec had the same hole as the code, so reading the spec could never catch it. And
`RichText.tsx` *does* render a `link` mark, so the frontend looked complete — it was serving tier 2.

**Fix:** extracted `src/sanity/linkAnnotation.ts` — **ONE definition shared by both tiers**, so they can't
drift into offering different link behaviour on different fields (same reasoning as the
`GALLERY_CATEGORIES` extraction). Field stays `href` → **no migration**; `RichText.tsx` consumes it as-is.

**Also fixed in the same pass — the mirror-image bug.** `type: 'url'`'s DEFAULT validation allows
**http/https ONLY**: it rejects relative paths *and* mailto/tel. So an **internal link was impossible to
enter** — even though `RichText.tsx` has always branched on `external = /^https?:/` and rendered non-http
hrefs as same-tab internal links. **That branch was unreachable: the frontend was ready for a value the
schema refused to accept.** Now `Rule.uri({ allowRelative: true, scheme: ['http','https','mailto','tel'] })`
— a strict superset, so every previously-valid URL still validates and nothing needs migrating.
- ⚠️ **OPEN, ADINDA'S CALL (in `_internal/ADINDA-TODOS.md` #14):** a *typed* internal path silently 404s if a slug
  changes. The robust model is a **document picker** (reference → slug resolves automatically, survives
  renames). Real work; **flagged, not built.** Fine as-is pre-launch.

**The pattern, third instance today:** this is *"a schema field that nothing renders is a promise"* **run
backwards** — the frontend rendering something the schema can never produce. Both directions are invisible
to `tsc`, `eslint`, and a 200. **When a slice first renders a field, check the schema can actually EMIT
every case the component handles — not just that the component handles what the schema emits.**

### ✅ ALSO 2026-07-17 — the 4 pre-existing lint errors are FIXED (Adinda asked)
`<a href="/boats/mari">` → `<Link>` in `Nav.tsx` (×2: desktop nav + mobile menu) and `TheBoat.tsx` (×2:
the image link + the CTA). These were the incremental nav-link un-hardcoding done with a plain anchor.
**Not cosmetic:** a raw `<a>` triggers a full document reload, dropping client-side navigation, the
router cache, and scroll restoration — on the homepage's two main routes into the boat page. `eslint` now
**0 errors**, so the repo is genuinely green for the first time this session.

### 🔁 STANDING TO-DO — run a `drk-seo` pass after EVERY page slice, before logging it done (Adinda, 2026-07-17)
New standing rule; full spec in CLAUDE.md ("Post-slice SEO pass"). **Authoring SEO in-slice ≠ verifying it** —
the in-slice rule existed since 2026-07-16 and the homepage still shipped with no `generateMetadata`. From
now on: page approved → load `drk-seo` → pass over the rendered page (heading hierarchy, semantic tags, alt,
metadata consuming `seo`, JSON-LD, canonical, links resolving) → fix/log → then log the slice done.

**Two retroactive passes owed — do NOT let these evaporate:**
1. 🔴 **Homepage — a REAL BUG, not just an unrun check. Verified 2026-07-17 against the served HTML.**
   `homePage` has a `seo` field, `HOMEPAGE_QUERY` selects it, and `src/app/page.tsx` has **no
   `generateMetadata`** — so it's fetched and discarded. Served: `<title>`/description come from
   `layout.tsx`'s hardcoded root metadata, **0 JSON-LD, 0 `og:` tags**. An editor filling in the homepage
   SEO fields in Studio today changes nothing, silently. **Fix = copy the boat route's `generateMetadata`
   shape** (`src/app/boats/[slug]/page.tsx:37` — resolves `seo.metaTitle || pageTitle || name`, sets
   canonical/robots/openGraph, serves 2 JSON-LD blocks). Est. ~0.5h incl. the pass. **Not scheduled yet —
   needs a slot; flag against the Jul 20 pressure point rather than absorbing it.**
2. **Boat page** — run once Adinda approves the sections. In-slice, no new slot needed.
   ⚠️ The boat page's `<title>` also reads "Mari Liveaboard" — that is the `pageTitle` **fallback working
   correctly**, not the homepage bug. Don't "fix" it.

Skill-wide — queued in `_internal/handoff/drk-website.md` for `references/workflow.md`.

### 🔁 STANDING TO-DO — ask Adinda at the end of every work block: "do we want manual section toggles yet?"
Her explicit ask 2026-07-16: **don't let this evaporate, and don't build it speculatively.** Raise it as a
question at the end of each block/session, not as a plan.

**Decision so far — DROPPED, not rejected.** Per-section on/off booleans (`showTheBoat`, `showWhyUs`, …) were
specced and confirmed earlier the same day, then Adinda pulled them back: they're a **nice-to-have** and they
"introduce risk in terms of reviews and organization." **The auto-hide logic was always the real requirement.**

**The reasoning, so it isn't re-litigated from scratch:**
- Two overlapping ways to hide a section means that when one disappears, an editor has to work out *which*
  mechanism did it. That's worse than either alone.
- Nobody has yet asked to hide a section that **has** content. Building 8 booleans (× 8 page types later) for
  a hypothetical is the **exact `isFeatured` mistake already made once on 2026-07-16** — specced, dropped as
  speculative, reinstated hours later once a real surface existed. Same rule applies: **build it when a
  concrete need shows up.**
- It also defuses the "toggles get invented twice, differently" risk flagged in
  `_internal/STUDIO-ORGANIZATION-AUDIT.md` (the FAQ page wants contact-form/CTA toggles; the homepage wanted its own).
  If/when toggles ARE built, settle ONE convention across all page types in the same pass.

**Adinda still wants to review the Studio organization/section structure** before any of this is revisited.

### ✅ CLOSED 2026-07-17 — the colour-token rename is DONE. One item is owed BY ADINDA (Figma side).
Was "2 of 10 done, pre-launch if time." **Finished in one morning instead** — all 11 remaining tokens
confirmed from Figma's variable panels (Adinda pasted 6 screenshots, ~15 min) then renamed in one
mechanical pass (~15 min). Zero `--primitive-*` tokens remain; the served css emitted an identical set of
54 hexes before and after. Commit `1b56add`. Full record + the final map: `src/app/globals.css` header.

**What flipped the decision, worth keeping:** the whole case for dripping it out opportunistically rested
on *"a big-bang rename would have to GUESS at the unconfirmed names."* The moment Adinda offered to paste
the variable panels, **confirmation stopped being expensive and the objection evaporated.** The strategy
had silently assumed the designer was a scarce resource and never tested it. All three traps turned out
REAL (stone→500 not 400, red→700 not 600, and `teal` was a family that never existed in Figma — invented
at port time). Corrections queued for `drk-website` in `_internal/handoff/drk-website.md`.

### 🔴 OWED BY ADINDA — update Figma's code-syntax bindings. NOT code work; Claude cannot do it.
**Mark this into the next round.** A palette rename is a **two-sided job** and only the code side shipped.
Figma's code-syntax field on each renamed variable still says `--primitive-…` — **names that no longer
exist** — which is why Figma's MCP hands back `var(--primitive-cream-10)`.
- **Until it's fixed:** treat ANY CSS custom-property name returned by the Figma MCP as **STALE**, and
  resolve it through the map in `src/app/globals.css`'s primitives header. Don't trust it in a component.
- **Full mapping table + the three traps:** `_internal/handoff/figma.md` Pending (top item).
- **When doing it: match each variable BY HEX, never by its old name** — three are traps where the obvious
  target name belongs to a genuinely different colour.
- Not blocking any build work. It costs nothing until someone reads a token name out of Figma — at which
  point it costs exactly what this whole episode cost.

### ✅ CHECKPOINT 2026-07-17 PM — gallery divergence resolved + `boatDefaults` shipped (boat slice, step 1 of 3)

**Model:** Opus 4.8 (1M context). Repo verified clean: `tsc` ✅ · `eslint` ✅ · `sanity schema validate` ✅
(0 errors, 0 warnings) · dev server restarted clean, `/` 200 + `/studio` 200.

**1. The `boat-mari` gallery divergence is CLOSED — empty on BOTH sides, as Adinda asked.**
Published had 4, draft had 0. Cleared published, unset on both, **verified by querying BOTH `boat-mari`
AND `drafts.boat-mari` independently** (`count(gallery)` = 0 on each) — the specific failure that caused
this (verifying against the same side you patched) did not recur. Asset refs backed up to
`_internal/scripts/_gallery-backup-boat-mari.json` before the unset.
- **The inspect confirmed the "smoke-test residue" read rather than assuming it:** `mari-hero-smoketest.jpg`
  719KB, `exterior-001` + `-001-edited` the same shot twice, all four with null alt/title. Verifying *what*
  was rescued, not just *that* it was — the lesson from this morning, applied.
- **Note on the draft side:** its `_updatedAt` didn't move, because unsetting an already-absent field is a
  no-op. The end state is still correct; worth knowing so a future reader doesn't read that as a failed write.

**2. `boatDefaults` singleton built + seeded.** 8 fields moved off `boat`, 4 `showXEyebrow` toggles dropped.
Mirrors `destinationDefaults`. Nested under **Boats** beside Boats / Cabin Types / Cabins, `.id()` set
explicitly via the `singleton()` helper (the documented duplicate-list-item-ID prevention).
- **`keyFeaturesHeading` → singleton, ADINDA CONFIRMED 2026-07-17.** The one open question from the handoff
  is now closed: it's a generic label, not an editorial per-boat choice.
- **Orphaned data cleaned.** Removing a field from the schema does NOT remove its data — `boat-mari` still
  held `keyFeaturesHeading`/`cabinsHeading`/`galleryTitle`/`specificationsHeading` invisibly on both sides.
  Unset on both. **Worth remembering: a field "move" is two jobs, schema and data.**
- **A value that was already right:** `specificationsHeading` was already "Layout and specifications" on the
  document, so the singleton's value is sourced from the dataset, not chosen by Claude.

**3. Eyebrow copy — Adinda's correction, now a standing habit.** The first pass invented four generic
eyebrows ("Discover Mari", "Every detail") — precisely the tourist-board filler `mari-core/brand/voice.md`
bans. Her call: **inventing copy is fine (a content pass follows), but pull from `mari-core` /
`mari-itineraries` / related skills FIRST** when Figma has no copy or looks like a wrong copy-paste.
Redone against the locked positioning; three of four now have a real mari-core anchor, `galleryEyebrow`
doesn't. All tagged in `_internal/CONTENT-STATUS.md`. **This generalizes beyond eyebrows — queued for the skills.**

**⚠️ NOT VERIFIED — Adinda's reload is the only real test.** Studio resolves structure client-side, so
`curl /studio` 200 and `schema validate` **cannot** fail on a broken sidebar. The new "Boat Defaults" entry
under Boats is unverified in a browser. Structurally the duplicate-ID class of bug is ruled out by
construction (`.id('boatDefaults')` is unique in that list), but that is an argument, not a check.

**⏭️ NEXT — step 2, boat page sections.** Two things to raise with Adinda first (below).

### ✅ CHECKPOINT 2026-07-17 PM (2) — SESSION ENDED HERE. `galleryTabs` + all boat-page decisions locked.

**Model:** Opus 4.8 (1M context). **Repo clean at `e2dc87a`.** Adinda ended the session here (tired) — a
deliberate stop at a committed boundary, not a mid-arc drop.
**▶ RESUME FROM `_internal/handoff/_NEXT-SESSION-boat.md` — it OPENS with a ready-to-paste kickoff prompt.**

**Shipped this block:**
- **`85ef714`** — `boatDefaults` singleton + `boat-mari` gallery cleared on both sides.
- **`e2dc87a`** — `boat.galleryTabs[]` (per-tab Amenities copy, 5 tabs seeded both sides) +
  `GALLERY_CATEGORIES` extracted to one shared module (was duplicated; drift would silently empty a tab).
- **The boat page's SCHEMA IS NOW COMPLETE.** Step 2 is pure frontend.

**Where the time went, honestly.** `boatDefaults` took its estimated ~0.5h. **The decision round after it
consumed the rest of the Friday block** — Amenities modeling, routes, hero strip. Worth it (all three were
cheaper to settle before the page exists than after, and the Amenities gap would have blocked section 4
regardless), but **the Jul 20 spill is now materially bigger than the 1–3h Adinda accepted.**
🔴 **Say the real number out loud Monday morning. Do not silently absorb it.** Mon Jul 20 was already
flagged as THE pressure point (boat spillover on top of a destination day expected to bleed).

**Two Claude errors this block, both now rules rather than apologies:**
1. **Delivered a stale reminder** (Figma colour screenshots — already done that morning; the rename had
   shipped off them). Adinda caught it. → *A reminder is a claim about the present; verify before
   delivering it. Write a reminder's expiry when you write the reminder.* Queued for `drk-website`.
2. **Invented generic eyebrow copy** ("Discover Mari", "Every detail") — exactly the tourist-board filler
   `mari-core/brand/voice.md` bans. Adinda's correction: **inventing copy is fine (a content pass follows),
   but pull from `mari-core` / `mari-itineraries` / related skills FIRST** when Figma has no copy or looks
   like a wrong copy-paste. Redone against the locked positioning. **Standing habit, not a one-off.**

**Still NOT verified (say this, don't let it pass as done):** the Studio sidebar in a browser. `curl
/studio` 200 and `sanity schema validate` **cannot fail** on a broken sidebar — structure resolves
client-side. The new "Boat Defaults" entry under Boats is unverified. **Ask Adinda to reload and confirm
early next session.**

**Uncommitted at session end, deliberately:** `CLAUDE.md` (Adinda's own commit-cadence amendment) and
`.vscode/` — **not this session's work, so not this session's to commit**, per the amendment's own
parallel-sessions rule. `_internal/handoff/`, `_internal/SCHEMA-SPECS.md`, `_internal/CONTENT-STATUS.md` are gitignored by `/_*` and
live on disk only — that's the convention, not a loss.

### ✅ RESOLVED 2026-07-17 — four boat-page decisions, all locked by Adinda before the sections build

**The authoritative Figma frame is `Page/Boat` = `778:8702`.** The `mari-website` skill's `boat.md` points
at `715:xxxx` / `718:5516` — **stale**, same drift the destination page had (`675-2363` → `778:8608`).
Real section list, read from Figma directly: Hero (`778:8706`, **sub-nav `Block/SubNav` `778:8712` already
in it**) · Overview (`778:8747`) · Cabins (`778:8762`, 2 tabs) · **Amenities (`778:8845`, 5 tabs)** ·
LayoutAndSpecs (`778:8878`) · FAQ (`778:8902`) · CTA (`778:8903`) · ContactUs (`778:8904`) · Footer
(`778:8905`). Queued for the skill round.

**1. The section is called GALLERY everywhere. It's FIGMA that's stale. (Adinda, explicit, AMENDED 2026-07-17 PM.)**

> ⚠️ **This entry previously read "the `gallery` field IS the Amenities section, name stays" — which was
> misleading and cost a round.** It reads as though the *rendered page* says "Amenities". It does not, and
> never did. Amended after Adinda re-raised it and the code was actually checked field by field.

`galleryImage.categories` is `The Boat / Dining / Diving / Relaxation / Others` — **exactly the 5 Figma
tabs**, so the *modeling* was always right. **This closes the skill's "5 tab labels unconfirmed — confirm
with Serge" open item** (they're Figma-derived and in the schema).

**Verified state 2026-07-17 (every surface checked, not inferred):** field key `gallery` · Studio group +
fieldset "Gallery" · `boatDefaults.galleryTitle` initialValue **"Gallery"** · `galleryEyebrow` "Life aboard
{boat}" · `destination`'s equivalent also `gallery`/"Gallery". **There is nothing named "Amenities" in the
rendered output.** The only real (non-comment) occurrence of the word is `'Amenities & Others'`, a
`specifications` accordion category — an unrelated thing.

- **The mismatch is between our code and FIGMA, not inside our code.** Figma's frame `778:8845` is labelled
  Amenities; we render Gallery. **Our code supersedes Figma** (Adinda's standing position: follow Figma
  where sensible, but what we decide here wins). Relabelling the Figma frame is **optional and undecided** —
  noted in `_internal/handoff/figma.md`, deliberately NOT a to-do.
- **Gallery is the better name on the merits, not just the cheaper one:** titling the photo section
  "Amenities" would put an **Amenities** section and an **Amenities & Others** specs row on the same page.
  Adinda caught this. There is no rename to do and no migration to pay — it was already correct.
- **The full amenities LIST lives under `specifications` ("Amenities & Others"), not here** — that section
  is the tabbed photo/copy showcase, a different thing.
- **The full amenities LIST lives under `specifications` ("Amenities & Others"), not here** — this section
  is the tabbed photo/copy showcase, a different thing.
- **The flat array is CONFIRMED correct by a new requirement:** there's also an **"all" gallery lightbox
  showing every image combined**. A flat array gives that for free (it *is* the array); each tab is just a
  filter on `categories`. Nesting images under tabs would mean flattening five arrays back out. The
  2026-07-15 flat-array decision holds for a second, independent reason.
- 🔴 **TWO DIFFERENT IMAGE SOURCES ON ONE SECTION — do not conflate (Adinda, explicit 2026-07-17):**
  - **Each tab's carousel shows ONLY that category's images** → `gallery[]` filtered by
    `categories match <tab>`. NOT all images.
  - **The lightbox shows ALL images combined** → the unfiltered `gallery[]`.
  One array, two reads. The obvious bug is feeding the carousel the whole array (it would look plausible
  and be wrong on every tab), so the filter is the thing to verify per tab, not just "images render".
  An image tagged with several categories appears in each of those carousels — `categories` is multi-select
  by design.
- **Empty category → that tab doesn't render** (same auto-hide pattern already shipped on the homepage).
- **NEW FIELD NEEDED — the one real gap:** each tab has its own heading + paragraph in Figma
  (`778:8858` / `778:8860`) and **no field existed for it**. `galleryDescription` is whole-gallery,
  singular. → **`boat.galleryTabs[]`: `{category, heading, body}` × 5, PER BOAT** (Adinda's call — the
  copy describes *this* boat's spaces, so it isn't shared chrome; a second boat would need its own).
- **Categories stay HARDCODED in `galleryImage.ts` for now.** Adinda: "fixed for every boat." Making them
  editor-managed (a list on `boatDefaults`) needs a **custom input component** — Sanity's `options.list`
  can't read values out of another document. Real work for a list that is by definition fixed. The interim
  note already in `galleryImage.ts` stands; revisit only if it genuinely needs editing.

**2. Hero meta strip → BOAT STATS.** Figma shows Komodo's Season / Duration / Minimum Skill Level — a
copy-paste from the destination page. Adinda: "we use the boat stats, so we can actually change those to
boat stats." → wire to `boat.stats` (Cabins / Guests / Boat Size / Crew, already seeded with confirmed
mari-core facts). **Closes `mari-website` boat.md open item #7.**

**3. ROUTE: `/boats` (listing) + `/boats/mari` (individual).** Locked on Adinda's own consistency
principle — "naming should be consistent between boat and destination", and destinations are
`/destinations` + `/destinations/komodo`. The rejected shape was `/boats` listing + `/boat/mari` child:
two different segments for one collection, so the listing and its children sit at unrelated paths.
- ⚠️ **This CONTRADICTS `mari-website`'s `url-structure.md`, which records `/boat`.** Skill-round item.
- **Free to change right now** — nothing is live, so there are no backlinks to preserve. This was the
  cheapest moment it will ever be, which is why it was worth settling before the route shipped.
- **The slug `mari` was never a decision** (leftover text recovered from an orphaned draft) — it is now.

**4. DYNAMIC COLLECTION SEGMENT — DECLINED. Adinda asked; Claude recommended against; she accepted.**
The ask: make the `/boats/` segment editable in Sanity (defaults or SEO settings) so it could become
e.g. `/liveaboard-diving/mari` later. **Technically possible** (`src/app/[collection]/[slug]/page.tsx`
reading the segment from Sanity; static routes like `/about` still resolve first). **Declined because it's
expensive machinery for a cheap-later problem** — the exact case CLAUDE.md says to flag rather than build:
- A typo in that field would change **every URL on the site at once** and silently 404 every indexed page,
  unless we also auto-generate redirects on change — more machinery again.
- `generateStaticParams`, sitemap, canonicals and breadcrumbs all derive from it → blast radius is the
  whole SEO surface.
- It buys a change that happens ~never, and when it does it's a deliberate SEO migration you'd want to
  plan — not a text box. **Doing it later = rename the folder + add a `redirect` document, ~10 min, once.**
- **What Adinda actually wanted mostly already exists:** `boat.slug` / `destination.slug` are editable in
  Studio *today*. Only the collection segment is in code. (A slug change post-launch needs a `redirect`
  doc so the old URL doesn't 404 — that type exists.)
- **SEO note:** keywords in the URL are a weak ranking signal; both shapes rank the same. What matters is
  picking once and not changing it after launch, and plural-collection-then-slug is both the standard
  convention and what `/destinations` already does. The SEO answer and the IA answer agree.

**Schema naming, for the record (Adinda asked):** it's a **document type** called `boat` (renamed from
`boatPage` 2026-07-16 — the "Page" suffix wasn't a real convention). `boat-mari` is a **document** of that
type. Type = `boat`; document = `boat-mari`.

### 📅 DAY PLAN to the Jul 24 staging push — Adinda's re-shuffle 2026-07-16. Overrides the skill's day-by-day.
**Jul 20 = DESTINATION ONLY, a deliberately BLOCKED day (Adinda's explicit call).** Private Charters was
sharing it in the skill's sprint — **she rejected that outright**: Destination is the deepest slice left
(11 sections + the FAQ render composition + the stable-key cross-page pull + reconciling the interim
`seasonNights`/`excerpt`/`order` fields) and **she expects it to bleed through the day.** Do not re-pack it.
If it finishes early she may pull the next day's work forward — that direction only, never the reverse.

**Re-cut 2026-07-17 AM** after (a) the sub-nav turning out to be a real build, (b) Adinda folding
Testimonials into the FAQ slot. Capacity on Jul 17 was ~5h after the morning block.

| Day | Work | Est. |
|---|---|---|
| ~~**Fri Jul 17**~~ | ~~auto-hide + FAQ min-height (0.5h)~~ ✅ **DONE** · `boatDefaults` (0.5h) · **Boat page** (3–4h) · **compact nav + sticky sub-nav** (2.5–3.5h) | **6–8h vs ~5h → 1–3h spills to Mon, accepted** |
| **Mon Jul 20** | Boat spillover (1–3h) · **Destination template + Komodo** (4–5h + bleed) | **⚠️ THE PRESSURE POINT** |
| **Tue Jul 21** | Private Charters (2–3h) · Schedule & Rates (1–2h) · T&C (~1h) | 4–6h |
| **Wed Jul 22** | Announcement bar (1–1.5h) · Sanity schema review (1–2h) · **About** (2–3h, copy from scratch) | 4–6.5h |
| **Thu Jul 23** | **FAQ page + Testimonials page, same slot in parallel** (3–4h combined) · Blog listing (1.5–2h) · Blog post (1–1.5h) | 5.5–7.5h |
| **Fri Jul 24** | Push to staging + QA Pass 1 | 5–6h |

**Mon Jul 20 is now the honest risk, not Jul 23.** Destination was ALREADY a deliberately-blocked day
expected to bleed (Adinda: *"she expects it to bleed through the day"*) — and it now also carries the boat
spillover. **Do not silently absorb this on Monday morning; say it out loud and re-cut then, with the real
number in hand rather than today's guess.** Partial offset: destination inherits the sub-nav component
built on Friday, so some of Monday's original scope is already paid for.
Jul 23 improved — Testimonials is no longer additive (see 2b above), so the earlier "5.5–8h ⚠️ OVER" is
now ~5.5–7.5h. Still no real slack anywhere before the staging push; the cut order below still stands.

### ⚠️ SCHEDULE HONESTY — the Jul 23 buffer is GONE. Say this out loud; do not absorb it.
Jul 21–23 now carries **~14–21.5h into ~15–18h of capacity**. It fits at the optimistic end and **does not
at the realistic end**. The skill's sprint had **Jul 23 as buffer/catch-up** — that buffer is now consumed by
(a) giving Destination its own blocked day, (b) Private Charters needing a real slot, (c) the **new**
Testimonials page. **There is now no slack before the Jul 24 staging push.** Adinda is not worried about
Jul 22–23 specifically ("FAQ page + blog listing + post can share a day") and she's right that those three
need no new copy — but the arithmetic still leaves zero margin.

**The natural flex, if something has to give (recommend in this order):**
1. **Blog listing + Blog post (2.5–3.5h)** — template-only, **no real content at launch anyway**. Shipping
   them a few days after staging costs almost nothing; they'd go to staging empty regardless. Cleanest cut.
2. **Testimonials page (1–1.5h)** — brand new, wasn't in scope this morning. Post-launch is defensible.
3. **Announcement bar** — no page depends on it.
**Do NOT cut:** About (needed for staging review), FAQ page (the homepage "Read More" points at `#` until
it exists), schema review (field names get expensive to change once real content lands).

### Known deviations from the skill's sprint (don't "fix" these back)
- The skill's day-by-day has **Jul 17 = Boat + Destination start (4–5h)** and does **not contain** the
  auto-hide work, `boatDefaults`, or the **Testimonials page** — none of them exist in the sprint. Reality
  for Jul 17: auto-hide + FAQ min-height (~0.5h) + boatDefaults (~0.5h) + boat page (3–4h) ≈ **4–5h, which
  fits** — but **Destination start slips to Jul 20**, and Jul 20 already carries Destination + Komodo +
  Private Charters. **Testimonials page (~1–1.5h) does not fit Jul 17 on top of that** — it needs a slot,
  and the honest candidates are Jul 22 (already About + FAQ page, i.e. the other danger day) or trading it
  against something. **Raise this with Adinda; don't silently absorb it.**
- **The Testimonials page is a NEW page in the inventory**, not a re-order. The page count for the Jul 24
  staging push went up by one. The skill's page table needs it added at the next skill-update round.
- **[CORRECTED 2026-07-20 — these two were STALE-ABOUT-STALE, per the audit.]** (a) The "SEO as a separate
  QA-Pass-1" note was already fixed in the skill; (b) `mari-website`'s `references/pages/faq.md` is **NOT**
  "stale 3 ways" — it was made current 2026-07-17 (inline `faqSection`, `isFeatured` standard). Both false
  warnings are removed here so they stop misleading. Real facts retained: SEO/image fold per-slice;
  Testimonials is a new inventory page. NOTE: the `mari-project` skill (whose "sprint" this whole section
  compared against) is UNINSTALLED as of 2026-07-20 — MANAGER.md is now the only tracker.

---

## 📌 `boatDefaults` — DECIDED long ago, NEVER SCHEDULED. Do it BEFORE the boat page. (logged 2026-07-16)

Adinda raised this 2026-07-16: "I need boat defaults just like there are destination defaults, same logic."
**She is right, and this was already locked** — CLAUDE.md's decluttering rule says the test is whether a type
is *designed* to hold many instances (not the current count) and explicitly names "**Boats (pending build)**".
It simply fell through the cracks; it was never reasoned away. `destinationDefaults` exists, `boatDefaults`
does not.

**Why the ordering is load-bearing:** the boat page frontend doesn't exist yet, so moving these fields costs
nothing today. Build the boat page first and this becomes a rewire of a page we just shipped. Same logic as
folding SEO into each slice — cheap while the page is fresh.

**Scope (~20–30 min — it's the same job `destinationDefaults` was, and that took ~15 min), mirroring
`destinationDefaults` exactly:**
- MOVE to the singleton (shared chrome): `overviewEyebrow`, `cabinsEyebrow`, `cabinsHeading`, `galleryEyebrow`,
  `galleryTitle`, `specificationsEyebrow`, `specificationsHeading`, `keyFeaturesHeading`. Add a `{boat}` token
  (same mechanism as `{destination}`).
- STAY on each `boat` (bespoke per boat): `overviewHeading`, `cabinsIntro`, and all real content.
- Structure: nest **Boat Defaults** under the existing "Boats" folder, beside Boats / Cabin Types / Cabins.

**SETTLED 2026-07-17 — option A, the singleton** (not a "Section Labels" tab on `boat`). Adinda: *"it's
inside boat defaults, it's cleaner because most of the time it won't be touched, but having it editable by
admins or SEOs is very important."* The deciding argument was an asymmetry: pick A and be wrong → 30 min
plus one extra Studio doc; pick B and be wrong → rewire a boat page we already shipped. Cheapest moment is
now, before the boat frontend exists.

**Approved field list (verified against `boat.ts` 2026-07-17):**
- **MOVE to `boatDefaults`** (boat-agnostic labels; add a `{boat}` token, same mechanism as `{destination}`):
  `overviewEyebrow` · `cabinsEyebrow` · `cabinsHeading` ("Cabins") · `galleryEyebrow` · `galleryTitle`
  ("Gallery") · `specificationsEyebrow` · `specificationsHeading` ("Layout and specifications").
- **STAYS on each `boat`** (bespoke): `overviewHeading` ("Traditional phinisi liveaboard for serious
  divers") · `cabinsIntro` · `galleryDescription` · and all real content (name, pageTitle, slug,
  coverImage, tagline, stats, brochurePdf, keyFeatures, keyFeaturesImage, overviewBody, gallery,
  layoutDiagrams, specifications, faqSections, seo).
- **DROP the four `showXEyebrow` toggles** (`showOverviewEyebrow`/`showCabinsEyebrow`/`showGalleryEyebrow`/
  `showSpecificationsEyebrow`). Resolved by option A: in a shared singleton an empty eyebrow field simply
  doesn't render, so the toggle stops earning its keep — and `destinationDefaults` has none, so this
  reconciles the two types onto one pattern.
- **Structure:** nest **Boat Defaults** under the existing "Boats" folder, beside Boats / Cabin Types /
  Cabins. Set `.id()` explicitly (duplicate-list-item-ID prevention).

**STILL OPEN — ask before building:** is `keyFeaturesHeading` ("Key features") shared chrome or a per-boat
line? **Claude recommends the singleton** (it's a generic label, not an editorial choice) but Adinda has
NOT confirmed it — she locked the plan before answering. One-line move either way.

**Correction on the record:** `cabinType` / `cabin` do **not** have their own pages — they're data feeding the
boat page's Cabins section. There are no cabin pages in the page inventory. They're grouped under "Boats" only
because they make no sense apart from a boat, which is the same reason Boat Defaults belongs there.

---

## ⏳ SEO + IMAGE PIPELINE — now FOLDED PER-SLICE (decision updated 2026-07-16, Adinda)
**UPDATE:** originally flagged as separate unscheduled pre-launch passes; Adinda's call is to **fold SEO
structure + the image pipeline INTO each page slice** (cheap while the page is fresh + most photos are final),
keeping only a **light final SEO review**. See CLAUDE.md "SEO + image pipeline fold INTO each slice" +
`_internal/SCHEMA-SPECS.md` FAQ SEO/AEO decision record. **Sprint reconciliation flag:** the installed `mari-project`
sprint still has SEO as a separate QA-Pass-1 (Jul 24) + a Content pass (Jul 28–29) — update it to per-slice
+ light-review when the skill is next re-updated. Homepage retroactive application (it's already built): SEO
structure (JSON-LD, semantic FAQ, `seo` fields) + verify/tighten the heavier design images (halmahera 667KB,
flores 495KB, sumbawa 482KB — but these are placeholder, real photos get the full pipeline). Below kept for
history:
1. **Full SEO/AEO content pass (site-wide).** Infra partly exists (robots.ts, `seo` object, per-page SEO
   fields, AI-crawler policy stub) but the CONTENT execution isn't done: real SEO titles/descriptions/OG per
   page, JSON-LD structured data (Organization + FAQPage etc.), keyword/intent alignment, AEO-readiness. The
   FAQ `seo` field + FAQ structured data we're adding in the FAQ remodel is PART of this — do the FAQ piece
   once, but the whole-site pass is separate. Cross-check `drk-seo` skill. Consider a Perplexity verify on
   current FAQ SEO/AEO practice (prompt drafted in chat 2026-07-16).
2. **Image pipeline pass (before real photos are uploaded to Sanity).** Two linked tasks:
   - **Descriptive file renaming** — the uploaded filename is the basis for the Sanity CDN vanity URL
     (`urlForImage` chain: `seoImageName` → `originalFilename` → `alt`). Real content photos must be renamed
     to descriptive kebab-case (or `seoImageName` set) BEFORE upload, or they serve with junk vanity names.
   - **Compression + resizing** — optimize source images before upload (perf + the Sanity free-tier 10GB/mo
     bandwidth cap noted earlier). Sanity CDN + Next optimizer resize on delivery, but oversized sources
     still cost storage/bandwidth and slow the content pass.
   Both are per-image content-pass work, distinct from the built `urlForImage` system (which is done).

---

## SESSION CHECKPOINT — 2026-07-24, SCHEDULE & RATES (/booking) SLICE BUILT + SEEDED (one commit)

**/booking is LIVE from Sanity — per-section QA by Adinda PENDING** (built to her dictated design,
no Figma mockup — T&C-reference-screenshot pattern revising `_internal/PAGE-SPECS.md` #2). Route
**/booking locked by Adinda**; the old `/schedule-rates` placeholder links (Footer, DestinationTrips
CTA, JsonLdPrefillInput route map) all point at the real route now, and both Nav "Schedule & Rates"
items (desktop + mobile) un-hardcoded per the incremental link rule.

**What shipped:**
- **Page composition** (`src/app/booking/page.tsx`, mirrors private-charters): Nav(lightHero) →
  BookingHero (NEW — light-texture band on `bg-bg-accent-secondary` beige-100, breadcrumbs +
  H1 + rich description, bottom 6%-black hairline; no hero image, no SubNav) → BookingSchedule
  (NEW — INSEANQ widget in a white shadowed card OVERLAPPING the band seam via `-mt-[64px]` /
  `lg:-mt-[120px]`, DestinationTrips' 160px desktop gutter override, locked mobile full-bleed
  negative-margin rule) → FaqCategorized (General FAQ categories via NEW `showOnBookingPage`
  toggle — the boat/destination/charters toggle set is now a quadruplet) → Contact → Footer.
  generateMetadata via buildSeoMetadata (no social image on purpose — no hero photo);
  FAQPage + BreadcrumbList JSON-LD emitted.
- **Nav `lightHero` prop** (first consumer: /booking): at the top of a light-hero page the nav is
  the LIGHT theme (dark text) with TRANSPARENT background, flipping to the normal solid light bar
  on scroll. Implemented as `data-navbg=clear|solid` CHAINED with `data-nav=light` on the
  bg/shadow classes (chained data variants, not class-order overrides). No prop → navbg always
  `solid` → verified byte-equivalent: `/` serves `data-nav="top" data-navbg="solid"`, /about solid.
- **Schema:** `scheduleRates` grown into the page doc (description richTextBasic; embedCode type
  text → htmlEmbed — safe, GROQ-verified ZERO existing docs; FAQ chrome mirrors charters; groups +
  titled fieldsets) and made a fixed-id SINGLETON in structure.ts. Field names unchanged.
- **Query:** BOOKING_QUERY + ScheduleRatesData/BookingQueryResult in queries.ts. Sitemap lists
  /booking (named per-slice step done).
- **Seed** (`_internal/scripts/seed-booking.ts`, idempotent, seed LAW honoured — drafts.faqGeneral
  absent, skipped): real INSEANQ widget embed (renders live on the page), title, slug `booking`,
  FAQ chrome tone-matched to charters ("Good to Know" / "Booking FAQ & Payment Terms" / "Read all
  FAQs"), `showOnBookingPage=true` on all 3 General FAQ categories (11 questions compose in).

**Placeholder rows (for `_internal/CONTENT-STATUS.md`):** `description` 🔴 [PLACEHOLDER] one
honest paragraph — real copy to follow; `seo.title`/`seo.description` 🟡 draft — review in the
post-slice drk-seo pass (NOT yet run — pending, after Adinda's visual QA, per the standing rule).

**Verification:** tsc + eslint green; clean dev restart (`.next` wiped); / /studio /about /booking
all 200; /booking HTML carries the H1 ("Schedule & Rates", display-h1), `insqwdgt` (embed in the
RSC payload — EmbedHtml mounts it client-side), resolved `<title>` ("…| Mari Liveaboard"), both
JSON-LD blocks, seeded FAQ chrome + categories, and `data-navbg="clear"` at top.

**Open:** Adinda's per-section QA (desktop + MOBILE viewport explicitly — hero paddings
`pt-[112px]/lg:pt-[224px]` and the card overlap depths are suggested values, tune on sight);
post-slice drk-seo pass; real description copy; hero band vs widget band contrast check
(beige-100 vs beige-50 + hairline seam).

## SESSION CHECKPOINT — 2026-07-24, `_internal/` ROOT CLEANUP REFACTOR EXECUTED (one commit)
The gated root-cleanup item ran and is DONE — full detail in the ✅ DONE entry in the ACTIVE QUEUE
above (what moved, same-commit amendments, what was deliberately left alone). Verification results:
- `git ls-files _internal/content/` → the 3 copy drafts (about-page, private-charters-copy,
  charters-current-copy) — tracking preserved through the move.
- All tracked moves done with `git mv` (history preserved, ~105 renames); gitignored scratch
  (`backup/`, `image-test/`, `content-scratch/`, `skill-image-retouch/`, `dev-out.log`) moved by
  plain filesystem move and stays ignored under the new `/_internal/`-scoped `.gitignore` rules.
- Stale-path grep across CLAUDE.md/AGENTS.md/MANAGER.md/COMPONENTS.md/`_internal/` → clean (only
  deliberate historical mentions of the old names remain, e.g. this checkpoint and the DONE entry).
- `src/` and `public/` untouched (dev server left running); a few code comments still cite old doc
  names — cosmetic, fix opportunistically.
- `_internal/README.md` created (plain-language folder map + deployment-boundary explanation +
  the "verify via Vercel Source tab" caveat — Adinda's ask).
Next per `_internal/RESUME.md`: new pages (Schedule & Rates, Testimonials, FAQ) per
`_internal/PAGE-SPECS.md`.

## SESSION CHECKPOINT — 2026-07-23 (afternoon block), ABOUT PAGE BUILT + SITE-WIDE SEO FIXES + CHARTERS COPY v2

**About `/about` is LIVE and through QA rounds 1–2** (commits `0aee2e6` → `d612e60`, all pushed —
git push now allowed via Adinda's permission rule). Built INLINE after both background build
agents **died silently without notification** (~40 min of nothing; lesson: agent silence ≠
progress — check task status, don't trust the quiet). Sections: AboutHero (ChartersHero sibling,
no brochure/subnav, width EXCEPTION 800px cap + 44px intro line so "The Story of Mari: Built from
Tradition." holds one line, homepage scroll-circle centered) · PageOverview (parity with charters
confirmed BY CONSTRUCTION — same component) · WhyUs (homepage doc verbatim, per spec) · AboutCrew
(NEW: circular portraits 4-up, bio = centered MODAL — photo card, gradient-band overlay text,
lightbox scrim, X/Esc/backdrop close; 4 Pexels placeholder crew seeded 🔴) · CTA ·
**Testimonials → now the `testimonialsSection` SINGLETON** (chrome + curated list migrated OFF
homePage, fields unset, schema notes point to the new home) · Contact/Footer. Hero photo + body
sail-up photo uploaded full-res. Sentence-case headings convention LOCKED (H2s AND body h3s;
documented in AGENTS.md for Codex + drk-website handoff). Post-slice drk-seo pass RAN and passed.

**Site-wide SEO fixes shipped (`8d44089`):** JsonLd component = the ONE escaped injection path
(layout + all 4 pages) · BreadcrumbList JSON-LD on boat/destination/charters (mirrors visual
trails) · DestinationTrips chrome guards · richTextFull H1 style REMOVED (hero owns the page H1;
owner-handbook entry) · siteSettings.siteTitle → "Mari Liveaboard" (SEO titles now ≤60ch) ·
sitemap now lists ALL routes (was homepage+boats only — "add route to sitemap" is now a NAMED
per-slice step, in sitemap.ts's header + drk-website handoff). Charters post-slice SEO pass:
**passed clean**, sitemap was its only real finding.

**Charters copy v2 (Codex's rewrite) SEEDED** (published+draft): first-round-approved copy, test
artifacts gone; CTA label corrected to "View All Trips" (Adinda: links to Schedule&Rates = ALL
trips); **inline destinations map restored** after ¶2 (the body swap had wiped it — map master
uploaded full-res 2000×1414). About body re-seeded from Adinda's OWN edit of
_internal/content/about-page.md (she removed the management-names section — private info).

**Infra/process this block:** working docs now COMMITTED (`_*.md`, `_internal/handoff/`, `_internal/scripts/` —
backup decision; `.gitignore` exceptions) · `content/` = canonical TRACKED copy-drafts folder
[since 2026-07-24: moved to `_internal/content/`, still tracked]
(a parallel session moved it to ignored `_content/` — now `_internal/content-scratch/` — and the About commit swept the deletion —
recovered `ad06118`; Codex's rewrite was nearly lost) · `.vercelignore` + backup/deploy-boundary
docs by the terminal session · GitHub in sync (origin/main = local).

**OPEN / NEXT:** 🔴 Adinda's round-2 review pending: /about desktop → mobile → Studio (About doc,
Testimonials Section, no-H1 menu) + charters copy read-through. **She has MORE small refinements
queued for the About page — today or tomorrow, her call.** Flagged: "Mari liveaboard" lowercase-l
in her edited ¶ (possible typo, seeded verbatim). Still open: fake crew 🔴 + [DRAFT] testimonials
🔴 + benefits photos #2/#3 🔴 · /charters vs /private-charters (Serge) · skills handoff round
(growing) · homepage+boat retroactive per-section QA · one-lightbox-per-field · FAQ +
Testimonials PAGES (displaced from today's slot by About — sprint deviation, named) · Jul 24
staging re-cut tomorrow AM · session time-log runs at actual close (checkpoint ≠ close).
**The PARALLEL terminal session will append its own additions below/near this checkpoint** —
Adinda's instruction; don't treat its edits here as conflicts.

## SESSION CHECKPOINT — 2026-07-23 (morning block, ~3h active), PRIVATE CHARTERS PAGE COMPLETE

**The whole `/private-charters` page shipped in one block** — schema (`privateCharters` singleton,
superseding the pinned generic `page`; old `page-private-charters` doc DELETED with approval) +
all 9 sections + 4 live QA rounds with Adinda + seeds. Route `/private-charters` (matches
url-structure.md; `/charters` confirm w/ Serge still open). Nav links wired. drk-seo verify pass +
JSON-LD prefill for this page: QUEUED, not yet run.

**Sections:** ChartersHero (centered, flat 60% overlay, full dvh after 2 height reversals, real
sunset-drinks master photo — byte-identical to the library PNG), ChartersOverview (tier-3 body w/
inline map; Read More desktop cap is CONTENT-based 960px; bg walked beige-100→150→page-50),
ChartersBenefits (image-driven accordion: 1 image = 1 benefit, title/caption model, carousel↔
accordion one state, advance-on-close wrapping, editorial-h4/h3 titles, gallery-style bare-chevron
arrows = THE single-image-carousel standard, light texture, last row borderless), then shared:
Destinations, DestinationBoats (`texture` prop off here; chrome now from the NEW **boatsSection**
shared-section singleton — {destination} resolves as "Indonesia" here, "Komodo" there, verified
live), DestinationTrips as #available-dates (embed copied from Komodo — NO scheduleRates doc
exists), FaqCategorized (own "Private Charters" category + `showOnPrivateChartersPage` toggle;
"Booking Terms" RENAMED "Payment & Booking" — was a test name), Contact, Footer.

**Cross-cutting shipped:** RichTextImage (inline rich-text images now click-to-zoom via lightbox;
caption follows the image's Alignment control, centered by default) · FAQ answer links =
accent-ondark-primary (chocolate too dark on navy) · Trips intro = heading width + primary navy
(shared, both pages) · Trips mobile pt 80→48→64 (=standard) · Boats card mobile: uniform 16 rhythm
+ section pb-0 (card touches next section) · SubNav `centerItems` prop · naming GLOSSARY in
COMPONENTS.md · "Section Nav" = subnav labels ≠ "Section Labels" = eyebrows · Studio reorg: Main
Pages / Secondary Pages (Itineraries·FAQ·Testimonials) / Blog / slimmed Shared Components;
boatsSection lives in the BOATS FOLDER (topic beats abstraction — Defaults precedent); `cabin`
OUT of the sidebar (schema stays, Mari doesn't use it).

**🔴 Reusable lesson — SEED-vs-OPEN-DRAFT CLOBBER:** patches land on the published doc; an editor's
already-open draft doesn't have them, and their next Publish silently reverts the seed (ate the SEO
prefill once, "why do I keep asking"). Seeds/migrations now patch `drafts.*` too when present.

**Open:** destinationsSection singleton (drag-curation replaces `destination.order` — Adinda
approved, ~1–1.5h, NEXT) · rich-text images: one-lightbox-gallery-per-field enhancement (her ask,
answered, queued) · drk-seo pass + JSON-LD prefill · wording reviews deferred (availability intro/
eyebrow) · benefits photos #2/#3 placeholders 🔴 · Serge items (Komodo feedback, seasons, /charters).
**Afternoon block:** FAQ page + Testimonials page (the original Jul 23 slot). **Jul 24 staging push
needs a re-cut tomorrow AM** — About/S&R/T&C/Blog still unslotted (charters ate today, worth it).

**Post-commit wrap-up additions (same morning, Adinda's final round):** benefits last-row border
off BOTH breakpoints · **destinationsSection singleton** (Destinations folder, drag-curated ref
array = carousel order + on/off; hero-search/contact keep the all-list; `destination.order`
retirement queued, not done) · boatsSection gained **eyebrowGeneric** (non-destination pages —
killed the page-code's hardcoded 'Indonesia' token value) · `excerpt` retitled **"Summary"**, moved
Cards→Basic Info on destination + boat (key unchanged) · old `page-private-charters` doc DELETED ·
🔴 **NEW LESSON: the CLI client's default perspective is RAW** — an unfiltered seed query returned
`drafts.*` ids, the ref array dereferenced to null members, homepage 500'd (same class as 8ded5ec).
Seeds referencing docs must filter `!(_id in path("drafts.**"))`; curated arrays get
`.filter(Boolean)` at the page. · Queued for next session: rich-text one-lightbox-per-field
gallery, drk-seo pass + JSON-LD prefill for charters, wording reviews (availability intro/eyebrow).

## 2026-07-23 (later block) — GitHub-backup + Vercel-boundary workflow locked; wip JSON-LD groundwork pushed

Model: **Fable 5** (trial). Adinda's calls, all shipped + pushed to `origin/main`:
1. **Everything now pushes to GitHub** — 130 accumulated local commits pushed; the private repo is the
   living backup of source AND internal docs (`_*.md`, `_internal/handoff/`, CLAUDE.md, MANAGER.md). The old
   "commits stay local" posture is superseded; the repo-stays-private condition is unchanged.
2. **`.vercelignore` created (718d7ff)** — internal docs are excluded from Vercel deployments entirely
   (not uploaded / not in the Source snapshot / not stored), because Adinda's requirement is "must not
   live inside Vercel at all," not merely "not served." Full reasoning + the ⚠️ first-deploys Source-tab
   verification checklist: CLAUDE.md's new "Deployment boundary" section. UNVERIFIED until Vercel is
   actually connected — she is explicitly test-verifying the first few deploys.
3. **Underscore convention AMENDED** — `_` prefix now marks the deployment boundary, not the commit
   boundary (CLAUDE.md section rewritten). Scratch exceptions (`_internal/backup/`, `_internal/image-test/`, logs) stay
   gitignored.
4. **wip commit `bf09013`** — another session's in-flight JSON-LD pass groundwork (`JsonLd.tsx`
   component + `buildBreadcrumbJsonLd()`, both consumer-less) committed honestly as wip at Adinda's
   explicit ask, to get the tree onto GitHub. Wiring is still that workstream's next step.
DRK-wide: the GitHub-backup/Vercel-boundary split queued for `drk-website` via `_internal/handoff/drk-website.md`.

## SESSION CHECKPOINT — 2026-07-17 AM, auto-hide + a real data rescue (superseded by the checkpoint above)

Model: **Opus 4.8 (1M context)**. Verified clean: tsc + eslint + `/` 200, after every change below.

### DONE + verified
1. **Auto-hide guards** on Why Us / Latest Articles / FAQ / Testimonials. Each is `if (x.length === 0)
   return null` **below the hooks** (an early return above them changes hook order). FAQ needed no special
   "0 featured" logic — HOMEPAGE_QUERY already filters `isFeatured == true`, so "0 items" *is* the test.
2. **FAQ min-height** → `lg:min-h-[calc(100dvh-70px)]`, no floor, desktop-only (Adinda, 2026-07-17).
3. **FAQ first item opens on load** — was hardcoded `'faq-7'` from the static build, which silently opened
   NOTHING once fewer than 8 questions were featured. Now `'faq-0'`, which exists for any non-empty list.
   Decided on UX (one open item signals the rest are clickable); **no SEO angle either way** — every answer
   is in the DOM regardless, the collapse is visual only.
4. **`language-en`**: draft (`tag: "en-US"` + a fallback) discarded; published `tag: "en"` stands. `en-US`
   would mis-signal **US targeting** for a EUR-priced Indonesian operator selling to international divers.
   Only use a region subtag when separate regional variants actually exist.
5. **Dataset cleanup**: 6 orphan drafts deleted (all Studio "create new" residue from Jul 14–15, holding
   only schema `initialValue` defaults — the `scheduleRates` one had a half-typed `"schedu"` slug). Only 4
   legitimate drafts remain: `boat-mari`, `faqGeneral`, `homePage`, `navigation`.

### 🔴 THE IMPORTANT ONE — 4 gallery images + the boat slug were nearly deleted
`drafts.boatPage-mari` survived the 2026-07-16 `boatPage` → `boat` rename. It was written off as a ghost of
a deleted type and queued for deletion. **Adinda attached a condition — "assuming we don't lose any content
we've uploaded for the boat" — and that condition is the only reason the content still exists.**

It held **`gallery` (4 uploaded images)** and **`slug`**, neither of which `boat-mari` had. Cause: the rename
migrated only the **published** doc; those four images were uploaded in Studio and **never published**, so
they lived only in the draft — which was then orphaned when the type was deleted. Salvaged onto `boat-mari`
(verified: `slug=mari`, 4/4 image assets resolve), then the ghost was deleted. **The missing slug would also
have blocked the boat route later the same day.**
- **The rule (queued for `drk-website`): a document-type rename must migrate DRAFTS too — that is where
  unpublished work lives.** Migrating only published silently discards it.
- **Second-order lesson:** "draft-only" ≠ "empty". The first emptiness check counted any non-meta key as
  content and kept 5 docs that were pure defaults; the fix is to inspect **values**, not key presence.

### Bug found in this session's own tooling (worth keeping — cost a false conclusion)
**`*[_type == "homePage"][0]` resolves to the DRAFT, not the published doc** — GROQ orders by `_id` and
`"drafts.homePage"` sorts before `"homePage"`. The first auto-hide demo patched only drafts, so the page
kept rendering and the guards looked broken *when they were fine*. **The app itself is clean** — every
singleton in `queries.ts` is selected by explicit `_id`. Audited. Queued for `drk-website`.

### Decisions taken
- **`isFeatured` is STANDARD + ON BY DEFAULT** (Adinda) — supersedes "only add it when a surface consumes
  it". Cheap to add, nothing gained by removing, an editor who doesn't want it doesn't tick it. Corrected in
  `_internal/handoff/drk-website.md` + `_internal/handoff/atlas-website.md` before the skill round could install the old rule.
- **`boatDefaults` = the singleton (option A)**, eyebrow toggles dropped to match `destinationDefaults`.
- **Sub-nav spec (Adinda, 2026-07-17)** — floating sticky sub-nav on boat AND destination, same component
  and behaviour, different section lists. Today's nav is 2 rows (logo+CTA / menu items); stacking a sub-nav
  under it would make 3. So the main nav needs a **compact one-row variant** (logo LEFT, CTA RIGHT, home/
  email/WhatsApp icons dropped) with the sticky sub-nav below it = 2 rows total. **Not yet estimated — it is
  a real addition to the boat slice, not absorbed.**
- **Jul 17 is a FRIDAY.** The day-plan table said "Thu Jul 17"; every other day label was correct.

### Still open
- The 70px nav offset used by the FAQ min-height came from the Destinations section, **not** Figma —
  worth confirming against `778-8603`. In `_internal/POLISH-BACKLOG.md`.
- `navigation` has **no published doc** (both copies are drafts, one a 1-item stub, one empty and now
  deleted). Nothing to publish — the nav content is hardcoded in the frontend. The global-chrome slice
  authors it. **Not an issue, do not re-flag.**

---

## SESSION CHECKPOINT — 2026-07-16, FAQ RESTRUCTURE v2

### What this session did
Executed the locked FAQ restructure brief (`_internal/handoff/_NEXT-SESSION-faq.md`) end to end. Model: **Opus
throughout** (Adinda's call). Verified clean: tsc + eslint + `sanity schema validate` (0 errors/0 warnings)
+ GROQ query-back + `/` and `/studio` 200 after a clean restart, with the homepage confirmed rendering
featured questions from both sources. Field-level detail lives in `_internal/SCHEMA-SPECS.md` — this is the log.

### DONE + verified
1. **`faqSection` — one reusable object** (`title` + `questions[]` of question/answer/`isFeatured`), used
   inline by `faqGeneral`, `destination`, and `boat`. All three now edit FAQs identically.
2. **General FAQ** = `faqGeneral` singleton, sidebar label **"General FAQ"**, categories **Payment & Booking
   / What's Included / Others**, `seo` field added. Cross-cutting questions only.
3. **Inline `faqSections` on `destination`** (Diving/Travel/Others) **and `boat`** (General Information),
   each with a signpost note pointing at the General FAQ for shared questions.
4. **`isFeatured` drives the homepage** — 8 featured across General + boat, General first. Hidden on
   destinations (they don't feed the homepage). Replaces the old auto-first-N logic.
5. **`faq` document type RETIRED** — Komodo's 6 FAQs migrated to `destination-komodo.faqSections`, all 7
   docs deleted, type removed from schema index + structure, file deleted. Sidebar has ONE FAQ entry.
6. **Re-seeded answer-first** from `mari-core` (General 11 Qs, boat 7 Qs, Komodo 6 migrated), voice rules
   applied (no em dashes, "premium", metric-first). Seed: `_internal/scripts/seed-faq.ts` (idempotent).
7. **Quick fixes folded in:** `whyUsItems` min 2→1; **SEO double-nesting fixed site-wide** (dropped the
   single-field `seoFs` fieldset + explicit `title: 'SEO'` on the field, across 8 types).

### Decisions + findings worth keeping
- **`isFeatured` was REINSTATED after being dropped** — and the installed `mari-website` skill still says
  "dropped, do not add to schema." Caught by reading the skill against the brief. The drop was correct when
  made (no consuming UI); the homepage FAQ section is now that UI. **Generalized into `_internal/handoff/drk-website.md`
  as a DRK-wide pattern + decision rule** (Adinda's ask): a featured flag is only worth adding when a concrete
  surface consumes it; and hide a shared object's field in contexts where it has no effect rather than
  showing it inert.
- **GROQ `+` is null-poisoning** — `a + b` yields null if EITHER side is null, so an absent `faqGeneral`
  would have silently discarded the boats' featured questions too. Each side is now `coalesce(..., [])`.
  Found by testing the missing-source case against the real dataset, not by assuming. Queued for `drk-website`.
- **Fieldset convention nuance:** "every group gets a matching fieldset" exists so headers show in "All
  Fields" — it does NOT apply to a group holding one self-describing field (that's the SEO double-nesting
  Adinda flagged). Recorded in `_internal/SCHEMA-SPECS.md`.
- **Category titles are editor-editable defaults** seeded via `initialValue`, not a fixed code list (same
  approach as `boat.specifications`). Adinda approved.

### Open / flagged (nothing broken)
- **⭐ FAQ v2 is ready for Adinda's Studio review** — see `_internal/QA-CHECKLIST.md` for what to look at (incl. mobile).
- **⚠️ Commercial figures in the FAQ answers are unverified** — deposit/cancellation/park+fuel fees/single
  supplement come from `mari-core`'s self-declared non-evergreen `commercial.md` (last verified 2026-06-09).
  Wrong terms on a public page is a real problem. Verify with Serge before launch — see `_internal/CONTENT-STATUS.md`.
- **Komodo's "What is included in a Mari trip?" duplicates** the What's Included the destination page will
  pull from General FAQ. Migrated per the brief; decide in the destination slice.
- **Stable identity for cross-page pulls** — still deferred to the destination slice, per the brief.
- `faqGeneral.seo` is empty; the `/faq` page frontend still doesn't exist, so homepage "Read More" → `#`.
- **Skills backlog grew:** `mari-website` (FAQ file stale 3 ways), `atlas-website` (two-taxonomy FAQ spec
  superseded), `drk-website` (2 new items). Adinda runs the chat-side round.

### Repo state: clean + committed. Reviewable.

---

## SESSION CHECKPOINT — 2026-07-16 (late), homepage FULL-WIRE + FAQ inline-array remodel (SUPERSEDED by the FAQ restructure above)

### What this session did
Took the homepage from "wired-with-hardcoded-fallbacks" to **fully Sanity-driven, no hardcoded content
fallbacks** (Adinda's call — the `?? 'hardcoded'` pattern sabotaged review; see CLAUDE.md "A slice is FULLY
wired"), plus several content-model decisions. Model: Opus throughout. Verified clean end-to-end
(tsc + eslint + `sanity schema validate` + GROQ query-back + `/` and `/studio` 200 after clean restart).

### DONE + verified
1. **Stripped ALL hardcoded fallbacks** from the 10 sections (Hero, TheBoat, WhyUs, Destinations,
   LatestArticles, Faq, Testimonials, Cta, Contact) — each now reads from Sanity, degrades gracefully to
   empty (never throws), and the real copy was **saved INTO Sanity** (not left in the components).
2. **Destinations wired to real docs.** Seeded **9 `destination` docs** (partial: name, tagline,
   seasonNights, excerpt, order, coverImage — data pulled from the built carousel + mari-core; flores/bali/
   n-sulawesi/halmahera excerpts are placeholder). Carousel + Hero search + Contact destination picker all
   read real docs now. **Added 3 interim `destination` fields** (`seasonNights`, `excerpt`, `order`) — flagged
   to reconcile in the destination slice (seasonNights overlaps `stats`; `order` may become an orderable-list
   plugin). Komodo patched (kept its full copy).
3. **Contact section copy moved off homePage → `siteSettings` ("Contact Section": eyebrow/heading/intro)** —
   it's global/near-everywhere, only labels are editable (Adinda's call). Form fields stay code; submission =
   Resend (future). Contact detail (`info@` etc.) → siteSettings in the global-chrome slice.
4. **Testimonials:** the 4 AI-draft demo reviews moved from hardcoded → seeded `testimonial` docs (titles
   keep "[DRAFT]", REMOVE-before-launch); homepage shows 8.
5. **FAQ REMODEL — reference docs → inline array (intuitive-CMS decision).** New **`faqGeneral` singleton**
   = one array of **categories → questions** ({title} → [{question, answer}]), drag-reorder both levels, add
   inline. Homepage shows the general FAQs **automatically** (first `HOMEPAGE_FAQ_LIMIT`=10; the "Read More"
   link covers the rest on the future FAQ page) — no hand-picking, no reference array, no max-items confusion.
   Deleted the 8 obsolete general `faq` docs. **Destination FAQs kept** as `faq` docs, relabeled in Studio
   **"FAQ (Destination-specific)"** vs the new **"FAQ (General)"** singleton, so the split is obvious.

### New STANDING rules locked this session (all in CLAUDE.md; DRK-wide ones queued in _internal/handoff/drk-website.md)
- **Full-wire-per-slice** (no hardcoded fallbacks; seed placeholder; UNDER TEST, confirm at end of build).
- **Guiding principle: the CMS/admin experience is a product surface** — editor-intuitiveness beats
  developer-clean modeling unless there's a real technical reason; FLAG divergences. (Also a memory.)
- **Nav/Footer links un-hardcode incrementally per slice** (automatic slice sub-step); footer *content*
  (newsletter/disclaimer/copyright/brand-alias) = a small siteSettings pass; "By Atlas" = HARDCODE, link
  `atlas@drkdigital.studio`. Full footer field list captured in "STILL TO DO" below.
- **Workflow retro (next projects):** build ONE real slice first, THEN scaffold the skeleton (skeleton-first
  drifted speculative; ~18h on skeleton+homepage). Queued for drk-website.

### STILL TO DO / open (nothing broken — all logged)
- **Theme tweak (near-term, NOT the Jul polish block):** primary bg → `beige/100` (too white); accent color
  must stay readable vs BOTH light + dark font (grey caption was unreadable on it). In `_internal/POLISH-BACKLOG.md`.
- **FAQ page frontend** — only the *homepage* FAQ is wired; the dedicated FAQ page (renders faqGeneral
  categories as sections) isn't built. Homepage "Read More" link → `#` until then.
- **Destination FAQ remodel** — destination FAQs are still `faq` docs; move to inline arrays on destination
  docs + retire the `faq` type in the destination slice (kept now for scope discipline).
- **Interim destination fields** (`seasonNights`/`excerpt`/`order`) — reconcile when the destination page is built.
- **Global-chrome slice** (Footer/Nav): fields captured in the queued list below; newsletter + contact
  details + copyright + brand alias all → siteSettings.
- **Homepage FAQ "Read More"** is the link-to-FAQ-page interpretation, NOT an inline expand — confirm that's
  what Adinda meant (she said "first 10, rest in Read More").
- Red-asterisk-color deferred (not cheap — Sanity title is string-only). Plain asterisk kept (approved).

### REQUESTED NEXT — section visibility: auto-hide empty + manual on/off toggles (Adinda, 2026-07-16 late)
New batch, NOT in the commit above — the next task. Two distinct mechanisms per homepage section:
1. **Auto-hide when there's no content (automatic, graceful).** Section disappears if its content is empty:
   - **Latest Articles** → hide if 0 blog posts (min 1 required to show).
   - **Destinations** → hide if 0 destinations ✓ (already returns null); also a destination with no content
     shouldn't render. "No destination anywhere it's called → section doesn't appear."
   - **FAQ** → hide if 0 questions. **BUT keep a MIN-HEIGHT when shown** — Adinda wants ~one viewport height
     minus the (sticky/fixed) nav bar, matching the mockup's FAQ section height. Confirm exact value vs mockup.
   - **Testimonials** → hide if none.
   - **CTA** → hide if 0 cards ✓ (done). **Why Us** → add the same 0-items guard.
2. **Manual on/off toggle per section (editor-controlled boolean on homePage).** Turn a whole section OFF
   even if it has content. Named by Adinda: **Blog/Latest Articles, Why Us ("queue"?), Testimonials, CTA,
   Contact form.** Likely also Destinations / The Boat / FAQ — CONFIRM the full set. Implement as `showX`
   booleans (consistent with the eyebrow toggle-to-reveal pattern), page.tsx respects them.
   - "queue" in her note is likely a dictation slip for "Why Us" (or "each section") — confirm.
   These two compose: a section shows only if (toggle ON) AND (has content). This generalizes the full-wire
   graceful-degradation rule into an explicit, editor-visible feature. Skill-relevant (likely drk-website).
   **CONFIRMED (Adinda) — toggle set:** The Boat, Why Us, Destinations, Latest Articles, FAQ, Testimonials,
   CTA, Contact (Hero always on). "queue" = Why Us; "Destinations and the boat need to be there" = they get
   toggles too. **FAQ min-height when shown** = ~viewport minus nav via `dvh` (verify Figma node 778-8603).
   **Also:** `homePage.whyUsItems` min 2→1 (Adinda's catch). Read More = link to FAQ page (built). Bundle
   with the theme tweak in ONE pass. FULL confirmed brief → `_internal/handoff/_NEXT-SESSION-toggles-theme.md`.

### Repo state: clean + committed (full-wire + FAQ remodel folded into ONE commit, Adinda's ask). Reviewable.

---

## SESSION CHECKPOINT — 2026-07-16 (evening), homepage vertical slice COMPLETE (schema + content + frontend wired) (superseded by the checkpoint above)

### What this session is
The homepage vertical slice (first real vertical slice per the build-approach shift). Building against the
**already-built homepage** (`src/app/page.tsx` + `src/components/sections/*`) as the source of truth, NOT
the Figma mockup (Adinda's call). Model: all Opus (Adinda's call for now — no Sonnet downshift). Two pending
schema tasks also queued: required-field markers (done ✓), Boat Defaults (still pending).

### DONE + verified this session (tsc / eslint / `sanity schema validate` all 0-errors throughout)
1. **Required-field markers (global Studio component)** — `src/sanity/components/RequiredFieldMarker.tsx`,
   wired in `sanity.config.ts` (`form.components.field`). Shows a `*` on every required field's label
   upfront (Sanity 6.4 shows none by default). Detects required via the compiled validation rules
   (`_rules`/`isRequired()`, verified against `@sanity/types`). **Adinda's repeated #1 ask — now done.**
2. **Image helper (slice a)** — `src/sanity/lib/image.ts`: `urlForImage()` with the full vanity-filename
   fallback chain (`seoImageName` → `originalFilename` (junk-name filtered) → `alt` → omit), using the
   builder's own `.vanityName()`; plus `sanityImageLoader` (a next/image loader — Sanity CDN does the
   resizing, pass only to Sanity-sourced `<Image>`). `next.config.ts` got `cdn.sanity.io` remotePatterns +
   `qualities:[75,80]`. Vanity logic unit-tested (14 cases, all pass).
3. **homePage schema depth (slice b)** — full rewrite of `homePage.ts` against the built page. Per-section
   tabs (Hero, The Boat, Why Us, Destinations, Latest Articles, FAQ, Testimonials, CTA, Contact) each
   mirrored by a titled fieldset. **Dedicated "Section Labels" tab** holds every eyebrow (Adinda's ask —
   findable, not buried). **Shared-component signpost notes** (`SharedComponentNote.tsx` + `sharedComponentNote()`
   helper) tell the editor where borrowed content lives (CTA→CTA Section, Why Us→Why Us Items, FAQ→FAQ,
   Testimonials→Testimonials, Latest Articles→Blog Posts). Why Us/FAQ/Testimonials use reference arrays
   (editor picks which items show); Latest Articles auto-pulls latest 3 posts. Legacy `ctaHeading`/`ctaSubline`
   removed (no data to migrate — homePage doc was empty).
4. **Content seeded + verified** (`_internal/scripts/seed-homepage.ts`, run via `sanity exec --with-user-token`):
   homePage singleton + 4 `whyUsItem` + 8 general `faq` + 4 `testimonial` docs, **11 images uploaded** to
   Sanity (hero, the-boat, 4 why-us, 2 cta, 3 blog covers), cta re-seeded with images, 3 blog posts patched
   with cover images. Copy lifted verbatim from the built components; 2 brand-voice fixes applied in-flight
   (a "--" → period, an em dash → comma). Stray empty homePage + blog drafts deleted. GROQ query-back
   confirms all content + images + references resolve. Tracked in `_internal/CONTENT-STATUS.md` (new homePage section,
   all 🟡 design-sourced).

### Design decisions made this slice (flagged to Adinda, cheap to change — homePage content is re-seedable)
- **Footer + Nav = global chrome, NOT homePage fields** → deferred to a separate siteSettings/navigation
  slice; still hardcoded for now (avoids scope balloon).
- **Destinations carousel keeps `@/lib/destinations`** (built-in 9-destination list) for THIS slice →
  migrates to real `destination` docs in the destination slice (next page). Mega-menu stays title-only.
- Images uploaded to Sanity (not left empty) so the rendered page validates the `urlForImage`/loader
  pipeline end-to-end.

5. **Frontend wired (slices c + d) — DONE + verified rendering.** `page.tsx` is now an async Server
   Component: one GROQ query (`src/sanity/queries.ts`, `HOMEPAGE_QUERY`) fetches homePage + shared CTA +
   latest 3 posts via `sanityFetch`, passes data to each section. `<SanityLive />` added to layout (Studio
   edits live-refresh the page). All 8 sections wired (Hero, TheBoat, WhyUs, LatestArticles, Faq,
   Testimonials, Cta, Contact) — each reads Sanity props with a fallback to its original hardcoded copy, so
   the page never renders blank. Rich text via new shared `<RichText>` (@portabletext/react, installed);
   plain-text fields via `toPlainText`. Images via `sanityImageProps` + explicit alt (local-asset fallback).
   Destinations still `@/lib/destinations`; Footer/Nav unchanged. **Verified: `/` returns 200, every content
   string renders, Sanity CDN images serve WITH working vanity filenames (`…/hero`, `…/why-us-divers`), 0
   server errors.** tsc/eslint clean.
   - **Bug caught + fixed by end-to-end verify:** a next/image `loader` *function* can't cross the RSC
     boundary in Server Components (TheBoat, CTA) → "Functions cannot be passed to Client Components".
     Removed the per-image loader; Next's own optimizer handles Sanity URLs (via cdn.sanity.io
     remotePatterns). CDN-side resizing via a global `images.loaderFile` deferred to `_internal/POLISH-BACKLOG.md`.

### STILL TO DO (queued)
- **Boat Defaults** (queued schema task) — `boatDefaults` singleton + slim `boat`, same pattern as
  `destinationDefaults`. NOT started. Clean boundary — good candidate for a fresh session.
- **Destinations migration** — homepage still uses `@/lib/destinations`; migrate to real `destination`
  docs during the destination slice (next page).
- **Footer/Nav → dedicated global-chrome slice** (siteSettings/navigation), NOT homepage fields. Footer
  content requirements captured from Adinda 2026-07-16 (build these when the slice runs):
  - **Brand alias / "also known as"** — e.g. "also known as Mari Dive Cruise" (editable string). No field yet.
  - **Newsletter block** — heading ("Join our newsletter"), subscribe/button text, description. **Decision:
    content lives in `siteSettings` (renders in footer, edited in Settings — global content is edited in
    Settings, not scattered).** Submission = a backend integration (Resend / newsletter provider), separate
    task, NOT content.
  - **Disclaimer / warning text** — "The Mari Dive Cruise is no longer owned and run by the legal owner of the
    Mari vessel." Editable (`text` or basic rich text). Label it e.g. `footerDisclaimer`.
  - **Copyright line** — auto-composed at render: `© {currentYear} {brandName}` from editable siteSettings
    fields (brand name, legal company name, website); year is dynamic (computed), never typed.
  - **Agency credit ("By Atlas")** — DECISION 2026-07-16: **HARDCODE** in the footer component (not a Sanity
    field). Rationale confirmed by Adinda: it lives in code, so only DRK can change it and the client can't
    touch/remove it — exactly the "I control it, not them" outcome she wanted (a `readOnly` field would still
    expose it to them). **Link target = `atlas@drkdigital.studio`** (the studio), NOT her personal
    `adinda.patty@gmail.com` (explicitly rejected). Ties to the "Atlas credit is desired branding" convention.
- Polish backlog (`_internal/POLISH-BACKLOG.md`): Sanity CDN loaderFile, LQIP blur, Why-Us focal point, rich-text in
  FAQ/Why-Us, testimonial star rating.

### Repo state: homepage vertical slice COMPLETE and committed. The rendered homepage is now Sanity-driven
and reviewable (checkpoint #2). Frontend falls back to hardcoded copy if any field is empty, so it's safe.

---

## SESSION CHECKPOINT — 2026-07-16 (later), skills-update round + session-bookend protocol (superseded by the checkpoint above)

### What this session was
Not a build session — a process/skills-infrastructure session. Two things: (1) locked a new standing
**session-bookend protocol**, (2) ran the first real **chat-side skills-update round** off the accumulated
`_internal/handoff/*.md` backlog.

### New standing protocol — locked into CLAUDE.md ("Session bookend protocol")
Runs at BOTH session start (recap/"good morning") AND session end, every time. Order: (1) **skills-backlog
check FIRST** — check `_internal/handoff/*.md`, if there's a backlog ask "update skills now in chat?", hand off ONE
skill at a time (paste-prompt + full content), remind to drop the re-export in Downloads, install, then
clean the handoff docs; (2) **state the current model**; (3) every task proposal carries **plan + est.
hours + recommended model/effort** (no Haiku/Fable; Sonnet-high default; Sonnet-medium menial; Opus
architecture-tier); (4) **ask available work-blocks**, adapt, flag sprint impact; (5) after agreement,
**granular subtask breakdown with per-task hours**. Generalized version ported to `drk-website`'s
`workflow.md` this same session.

### Key mechanism learned — payloads must INLINE local-only content
The chat-side skill session **cannot see the local installed skill copy** (`.claude/skills/...`). Several
drk-website handoff items said "landed in LOCAL copy" — that drafted text is invisible to chat. So a
skills-update handoff must **lift and inline** any local-only reference content, not just point at it. Built
self-contained payload files for this: `_internal/handoff/_drk-website-chat-payload.md` (done) and
`_internal/handoff/_atlas-website-chat-payload.md` (ready). Each = every pending item + all local drafted content,
generalized, organized by target reference file, with a matching paste-prompt.

### drk-website — UPDATED + INSTALLED + ARCHIVED + reconciled
Adinda updated it in chat from the payload, re-exported, Claude installed from Downloads. Verified against
the freshly-installed files (not the changelog): new `troubleshooting.md` + `image-editing.md` exist;
`workflow.md`/`sanity-cms.md`/`components.md`/`stack.md`/`pre-launch.md`/`claude-code.md` all grew. Archived
to `OneDrive/Desktop/claude/drk-skills/` (canonical + dated snapshot), Downloads copy deleted.
`_internal/handoff/drk-website.md` reconciled — everything moved to a dated Done section; only the named-component
catalog stays open (needs Mari's `COMPONENTS.md`, which doesn't exist as a file yet). Minor: ~13
illustrative "Mari" mentions remain in the skill (acceptable, incident references).

### Two corrections caught BEFORE install (would have regressed the skill)
1. **Alt is `recommended-not-required`, never `Rule.required()`** — the old local `components.md` draft
   still had the wrong required version.
2. **Vanity filenames use a fallback chain**, decided this session, replacing the old "slugify from alt"
   default (alt is a full sentence, poor filename): `seoImageName` (optional editor field) → `originalFilename`
   (if descriptive, skip `IMG_`/`DSC_` junk) → `alt` → omit. Applied to Mari's CLAUDE.md AND skill-wide.
   The `urlFor()` helper that implements it is still unbuilt (no components consume Sanity images yet).

### Round COMPLETE — all 4 skills done (2026-07-16)
All four skills ported chat-side, re-exported, installed, verified against the freshly-installed files,
archived (canonical + dated snapshot in `OneDrive/Desktop/claude/drk-skills/`), Downloads cleaned, and
handoffs reconciled to Done:
- **drk-website** v0.10 — the big one (workflow/session conventions, gallery, image-alt correction, Next 16
  stack, QA patterns, new troubleshooting + image-editing reference files). Two corrections caught pre-install.
- **atlas-website** v0.6 — Testimonials hub (new file) + destination/boat/blog/faq/contact updates; homepage
  as compare-and-flag; held items correctly not built.
- **mari-website** v1.5 — announcement bar final spec, FAQ destination taxonomy, footer newsletter copy.
- **mari-project** — status/sprint/skills-infra refreshed; scope items folded; contract set to Aug 10.

**`is_featured` — DROPPED for v1** (Adinda confirmed 2026-07-16). Stopgap-edited into the installed
`mari-website` faq.md; queued in `_internal/handoff/mari-website.md` to persist chat-side next round.

**All 5 `_internal/handoff/*.md` files reconciled** (drk-website, atlas-website, mari-website, mari-project to Done;
figma.md untouched — it's Figma-file syncs, a separate track, still Pending).

### Destination schema pass — done 2026-07-16 (against the real mockup)
Adinda gave the actual Figma frame — **`778:8608` (`Page/Destination`)**, newer + more detailed than the
`675-2363` the docs referenced. Built the `destination` type out from a shell against it (tsc ✓, eslint ✓,
`sanity schema validate` 0 errors/0 warnings). What the mockup resolved + added:
- **CTA confirmed shared** (generic two-card, no destination urgency line) → no CTA override field. **Booking
  widget confirmed one global embed** ("scheduling partner", lists all routes with its own filters) → no
  per-destination embed field.
- **Added:** an "Upcoming Trips" section group (eyebrow/heading/intro; the widget itself is the global
  embed, frontend-rendered); a "Section Headings" group with editable eyebrow+heading for the three
  auto-content sections (FAQ, About the Boats, Latest Articles); an itineraries eyebrow toggle.
- **Still 🟡 draft** — needs Adinda's Studio review (reload Studio, open a Destination doc, walk the form).
- **Flag (not fixed — belongs to the FAQ pass):** the mockup's destination FAQ categories are
  **Diving / Traveling / General Information**, but `faq.ts` lists the 3rd as `"The Liveaboard"`. The proper
  general-vs-destination category split is still pending (atlas-website). Fix during the FAQ pass, not now.
- **Flag (Figma drift, queued in `_internal/handoff/figma.md`):** hero breadcrumb reads "Boats" not "Destinations";
  destination node refs in the skills should update `675-2363` → `778:8608`.

### Cover video + FAQ split + hybrid workflow — decided 2026-07-16 (all verified: tsc/eslint/schema-validate 0/0)
- **Approach shift, locked in CLAUDE.md ("Build approach"):** skeleton-first (done — all types in sidebar,
  doubles as Adinda's checklist) → THEN **vertical slices per page** (schema depth + frontend + content
  together, review the real page). Driver: abstract Studio-form review kept hitting "feels so abstract, I'm
  not going to say anything." Guardrail: build functional-not-polished, defer cosmetics to new
  `_internal/POLISH-BACKLOG.md`, one polish block later. Migration risk accepted (re-seedable placeholder content +
  standardizing conventions). Slice order: **homepage first** (frontend exists → wire it), then destination.
  Skill-wide, queued for `drk-website`.
- **Two Studio conventions locked (CLAUDE.md, skill-wide):** (1) every group mirrored by a titled `fieldset`
  so "All Fields" view has section headers (destination done; retrofit boat/homePage/page/scheduleRates);
  (2) load real/placeholder content into every schema so review isn't abstract.
- **Cover video → URL, not Sanity upload.** Research (WebSearch): Sanity free tier = 10GB/mo bandwidth, NO
  overage (blocks); a hero loop can't lazy-load → burns the cap; **Sanity Media Library video CDN is
  Enterprise-only**. So `destination.coverVideo` is now an object `{ url, playOnMobile }` — editor points at
  a video CDN (Cloudflare Stream / Bunny for prod; Cloudinary free or /public to test). Specs for a bg loop:
  <5MB, 5–15s seamless, 720p, MP4/H.264, no audio, mobile→poster. Defaults to cover image until Adinda tests.
- **FAQ category split done** (`faq.ts`): `generalCategory` (5 hub values) + `destinationCategory` (Diving/
  Traveling/General Information), shown by `scope`. One type, no duplicated structure. Fixed the old
  "The Liveaboard" → "General Information" mismatch found against the mockup.

### Next session (not this one)
- **Tier 4 shell review** — still the real build-side priority; every shell is 🟡 unreviewed (see the
  Tier 4 checkpoint below). This skills round was infrastructure, not build progress.
- Open slugs/URL confirms (Private Charters, Schedule & Rates, `/boats/mari`), `author.bio`, required-field
  markers — all still open from the Tier 4 session.
- `_internal/handoff/figma.md` drift-syncs (Figma-file edits) whenever a Figma session happens.

---

## SESSION CHECKPOINT — 2026-07-16, Tier 4 shell pass (superseded by the checkpoint above)

### State of the repo right now
Clean and verified: `tsc`, `eslint`, fresh dev server restart (all node processes killed first, `.next`
cleared), Studio 200, homepage 200, zero `SchemaError` in the fresh log (one harmless "Building schema
for synchronization took >1s" info line, and an unrelated `cz-shortcut-listen` hydration warning from a
browser extension, not our code). Migration verified via GROQ query-back, not just script exit code.

### The big move: Tier 4 document-type shells, built in one pass
Per Adinda's explicit ask ("I need the stubs, even if empty, so I have something to review tomorrow") —
every remaining Tier 4 type now exists and is registered/placed in Studio. **All of it is 🟡 Draft,
same-day, unreviewed — `boat` is the ONLY type with a real multi-session review pass behind it.** New
types: `destination`, `itinerary` (stub), `faq` (built with real depth — question/answer/category/scope +
conditional destination-or-boat reference), `testimonial`, `blogPost`, `blogCategory`, `author`,
`homePage` (singleton, deliberately shallow — homepage content is still 100% hardcoded), `whyUsItem` (own
document type, referenced from `homePage.whyUsItems` with `Rule.min(2).max(4)`). Full field-by-field spec
in `_internal/SCHEMA-SPECS.md`'s new "Tier 4 shells" section.

### Rename: `boatPage`/`destinationPage` → `boat`/`destination`, 2026-07-16
Adinda asked why the "Page" suffix existed. Real answer: it wasn't an actual convention — `scheduleRates`
and `blogPost` don't have it either, so it was just how the first two types happened to get named, not a
deliberate rule. Renamed both. `destination` was free (zero content existed). `boat` needed a real
migration since `boatPage-mari` had real content: wrote `_internal/scripts/rename-boatpage-to-boat.ts` (`_type` is
immutable in Sanity, so this creates `boat-mari` fresh, repoints `cabinType-mari-deluxe.boat` to it, then
deletes the old document) — ran via `npx sanity exec ... --with-user-token`, verified via GROQ: `boat-mari`
exists with correct data, `cabinType-mari-deluxe`'s reference correctly repointed, zero `boatPage`
documents remain. Every schema-file reference (`cabinType`, `cabin`, `link`, `faq`, `itinerary`, comments)
updated to match. Queued for `drk-website` handoff: check for a REAL naming pattern before assuming a
suffix is deliberate, before copying it into new types.

### Studio sidebar reorganized into 3 sections, per Adinda's explicit spec (several corrections mid-session)
1. **Main Page Content**: Homepage, Destinations, Boats (nested), Private Charters, About,
   Schedule & Rates, Itineraries, then generic **Pages LAST** (catch-all for T&C, Onboard Prices, etc.).
2. **Blog** (its own section, not lumped into #3 — Adinda's correction): Blog Posts, Blog Categories,
   Blog Authors.
3. **Shared/cross-page components** (repeatable, reusable across pages/page types): Announcements,
   Why Us Items, FAQ, Testimonials. (Why Us Items moved here from Main Page Content mid-session —
   Adinda's correction: it's a repeatable component that may appear on a different page, not homepage-only.)
Then Settings / SEO Tools / Languages, unchanged. Private Charters and About are pinned `page` documents
by fixed ID (`page-private-charters`, `page-about`), not a new schema type — generic `page` per the
already-stated default assumption, just given a fixed sidebar slot the same way `singleton()` pins
Site Settings/Navigation. **Private Charters' slug is still a placeholder** (`private-charters-slug-tbc`)
— real slug unconfirmed, see the open item further down this file.

### Site Settings — `headScripts` field added, 2026-07-16
Adinda's ask: a place for Google Tag Manager / Search Console verification / other `<head>` tracking
snippets, without a code deploy. Added under a new "Tracking & Verification" fieldset in the SEO tab.
Not wired to actual `<head>` rendering yet (same status as everything waiting on the Sanity-wiring pass).
robots.txt/llms.txt are separate static Next.js route files, not Sanity content — nothing to add there.

### Open items from this session, not yet resolved
- **`author.bio`** — built from Adinda's "author name and value," where "value" wasn't clearly specified.
  Interpreted as a short bio field; flag/confirm before treating as final.
- **Required/optional field markers** — Adinda wants a clear upfront visual marker (asterisk or similar)
  on required fields, site-wide, seen before filling the form, not discovered later via an error. Not yet
  actioned — needs verifying whether Sanity Studio already does this by default before assuming custom
  work is needed. Queued as one full pass, applied everywhere, not per-field ad hoc.
- **Private Charters slug + schema-type decision** — still open (see the 2026-07-15 entries below).
- Everything in the Tier 4 shells list above needs an actual review pass — Adinda was explicit she
  couldn't review all of it in this session; treat as the next session's real priority, not "done."

### Daily recap template — locked into CLAUDE.md this session
Adinda wants a consistent recap structure every time she asks ("today/tomorrow/sprint status"), so it
isn't reinvented per ask. Full spec now in CLAUDE.md's "Daily recap template" section; generalized version
queued for `drk-website`'s `references/workflow.md` via `_internal/handoff/drk-website.md`.

---

## SESSION CHECKPOINT — 2026-07-15, LATE second session, saved as Adinda heads to a workout (superseded by the checkpoint above)

### State of the repo right now
Clean and verified — `tsc`, `eslint`, fresh dev server (cache cleared, `Ready in ~2.4s`), Studio 200,
zero `SchemaError` in the fresh log, all confirmed as the last actions. Nothing half-done in the
committable sense. Dev server IS running. Sanity has one real `boatPage-mari` document with mostly-real
content (see _internal/CONTENT-STATUS.md for the real-vs-placeholder breakdown).

### What Adinda should REVIEW first, in Studio (the human-eyes part I can't do)
1. **Hard-reload Studio first** (`Ctrl+Shift+R`, or an incognito tab on `localhost:3000/studio`). Your
   earlier stale-tab errors were pure browser cache — live data was always correct. If a normal browser
   still shows stale state: DevTools → Application → Clear site data for localhost.
2. **Open the Mari boat document** and look at the whole form with real content in it — this is the
   actual test of whether the schema feels right to *use*, not just whether the field list looks right.
3. **Test the gallery bulk upload for real:** add a gallery group (set a category), then **drag several
   image files at once** onto its images array. Confirm one item per file appears. That's the
   experimental bet we need to validate (see "gallery" note below).

### What changed this session (the big arc)
- **Boat page schema** fully built + refined against the real Figma mock: Basic Info (short name / full
  title / slug in that order), Overview (full rich text body, "Read more" truncate — NOT a CTA link,
  that field was removed), Cabins (own group), Gallery (see below), Specifications (8 fixed categories,
  one rich-text body each, matching the mock exactly), SEO.
- **Two shared rich-text types locked:** `richTextBasic` (tier 2 — paragraph + bold/italic/link +
  bullets) and `richTextFull` ("Full Rich Text Block", tier 3 — H1-H6, marks, alignment, image, HTML
  embed, NO text color for now). `page.body` and `boatPage.overviewBody` both use `richTextFull` — one
  source of truth, update once.
- **Gallery reworked to array-on-the-page, grouped by category (EXPERIMENTAL)** — for native multi-file
  bulk upload. Deleted the old galleryImage/galleryCategory document types + their 6 test docs. See the
  dedicated entry below and CLAUDE.md's "Galleries" section for the full why.
- **Image alt rule CORRECTED** (this was a real mistake I made): alt is **editable-not-required** on
  every image, never `Rule.required()`. The DRK hard rule = every image HAS an editable alt field, not
  that alt must be filled. Removed all `Rule.required()` from alt. `galleryImage` now has **title + alt
  + caption**, all optional. Saved as a memory + corrected in CLAUDE.md + handoff.
- **Gallery images now carry an upload recommendation** in the field description: landscape 4:3, ≥
  1600×1200px (retina-ready, bigger than it displays), web-optimized JPEG/WebP under ~500KB.
- **New tracking docs created this session:** `_internal/SCHEMA-SPECS.md` (per-field approval checklist),
  `_internal/CONTENT-STATUS.md` (real-vs-placeholder content), `_internal/QA-CHECKLIST.md` (external-reviewer open
  decisions). All part of the doc-split, all listed in CLAUDE.md.

### What Adinda needs to DECIDE / DO next (prioritized)
1. **Gallery upload button — a real decision, needs your call.** Researched 2026-07-15: dragging many
   files at once works natively (good). BUT a click-to-browse **multi-select "Upload" button** (distinct
   from "Add item", which only picks one file at a time) does **NOT** exist natively in v6.4 — it needs a
   **custom array-input component** (real build work). Decide: build the custom upload button, or accept
   drag-and-drop-only for now. (Open Sanity feature requests confirm it's a known gap: GH #1547, #4483.)
2. **Validate the experimental gallery** — the drag-many test above. If it feels right, we promote it out
   of EXPERIMENTAL; if the category-per-batch grouping is awkward with real content, we adjust.
3. **Eyebrow toggle: global vs. per-section** — still pending Serge's input (in _internal/QA-CHECKLIST.md).
4. **Social image alt** — `seo.ts`'s ogImage/twitterImage are bare images with no alt field, a technical
   exception to the alt rule. Decide whether to add alt there (in _internal/QA-CHECKLIST.md).

### Gallery FLATTENED — drag-drop was failing on the grouped structure (fixed 2026-07-15, same session)
Adinda hard-refreshed and tried to drag 4 jpegs into the gallery → *"no known conversion from content
types to array item."* Diagnosed: NOT a drag-drop bug — she dropped onto the **outer** array, which held
category-group *objects*, not images (Studio can't convert a file into a group object). The grouping made
the obvious drop target dead. **Fixed by flattening:** `boatPage.gallery` is now a FLAT array of
`galleryImage` (the array members ARE images), so multi-file drop lands directly on it. Category moved to
a per-image `categories` tag field. Per-category heading/body descriptions dropped in the flatten
(deferred — flagged in SCHEMA-SPECS). Per-batch category tagging is recoverable later via the custom
upload button. Verified `tsc`/`eslint` clean, dev server restarted fresh, Studio 200, no SchemaError.
**Still needs Adinda's real-file test** to confirm the flat array accepts multi-drop (should, but she
should verify — that's the remaining validation).

### Gallery categories — fixed list now, better options to raise next session (2026-07-15)
Adinda: doesn't like categories being a **plain free-text field** — they should be chosen from a known
set, not typed. **Done now (interim):** `galleryImage.categories` is a fixed multi-select list matching
the Figma gallery mockup tabs — **The Boat, Dining, Diving, Relaxation, Others** (hardcoded in
`objects/galleryImage.ts`). No more free text.
**Options to bring up NEXT SESSION (Adinda's explicit ask to surface these as possible add-ons):**
1. A centrally-managed, editor-editable **Gallery Categories** set — its own small document/list type —
   so the client can add/rename categories without a code change, and images reference from that set.
2. Or the same idea but housed **inside site settings** (a categories field there), if a full document
   type feels heavier than needed.
Both replace the hardcoded list with something the site owner controls. Interim hardcoded list is fine to
start with (matches the mockup exactly); pick the managed approach when categories need to vary per client
or the owner wants to edit them.

### Custom multi-select "Upload" button — schedulable to-do, researched 2026-07-15
Native drag-drop of many files works (once flattened). A click-to-browse **multi-select** Upload button
(distinct from "Add item," which only picks one file) does NOT exist natively in v6.4 — needs a custom
array-input component. **Assessed: small-to-moderate build, ~60-120 lines, ~2-4 focused hours.** Approach:
`components.input` on the gallery array that calls `props.renderDefault(props)` (keeps all native array UI
incl. drag-drop) and adds a styled `<input type="file" multiple>` button that uploads each file via
`props.client.assets.upload('image', file)` and inserts an array item per asset via `set`/`insert` on
`onChange`. No drop-in plugin exists for this exact thing (it's a long-standing open Sanity feature
request, GH #1547/#4483) — build from documented primitives. **Reusable across all DRK galleries.**
Not launch-blocking (drag works). Adinda's call on whether/when to build; slotted as schedulable.

### What CLAUDE should DO next session (in order)
1. **T&C page content** — import the real, final 16-section content from `mari-website` skill's
   `references/pages/tc.md` into an actual `page` document, using the new `richTextFull` editor. This was
   deliberately held to avoid rushing a 16-section import at end-of-session. Clear #1.
2. **Specifications content** — the live doc has all 8 category labels; verify/reload the bodies during
   the content pass (Adinda's call to do it then, not now — see _internal/CONTENT-STATUS.md).
3. **Destination page + Private Charters** Figma passes — links already shared, never got started (this
   whole session was boat-page + gallery). These are the next real page-schema builds.
4. If Adinda greenlights it: the custom multi-select gallery upload button component.
5. Research whether Sanity's Portable Text editor supports a smaller default height (Adinda asked; the
   editor box renders tall by default — may need a custom input, not yet investigated).

### Models / effort (confirmed logic, one open mechanism question)
Locked logic: no Haiku, no Fable. **Sonnet high = default** for this build (higher-risk dynamic
Next+Sanity site). Sonnet medium for menial tasks. **Opus for architecture-tier decisions.** Adinda
switched to **Opus 4.8** partway through this late session (the gallery rework, alt-rule correction, and
rich-text-type extraction were genuinely architecture-tier, so that fit). Still open/honest: the exact
mechanism to set *this session's* reasoning-effort level (vs. sub-agent effort) isn't something I've
confirmed — worth checking `/config` or asking directly before treating that part as fully actionable.

### Contract timeline — RESOLVED 2026-07-15, do not re-raise as a concern
Earlier notes (this file and `_internal/handoff/mari-project.md`) flagged an apparent conflict: "contract end
~Jul 24" vs. the internally-planned Jul 28–Aug 1 launch window. **Corrected directly by Adinda: that was
wrong.** Contract signed ~May 10, 12-week term, real target is **Aug 10**. We're on schedule. The Type A
brochure (~1 week) was extra work Adinda chose to take on, outside contracted scope — that's what created
the earlier appearance of time pressure, not an actual scheduling conflict. **Stop mentioning the
contract-vs-launch-window concern in future sessions** — it was never a real problem. Corrected in
`_internal/handoff/mari-project.md` too (marked resolved there).

### Tracking docs renamed with underscore prefix — 2026-07-15, so they auto-gitignore going forward
`SCHEMA-SPECS.md` → `_internal/SCHEMA-SPECS.md`, `CONTENT-STATUS.md` → `_internal/CONTENT-STATUS.md`, `QA-CHECKLIST.md` →
`_internal/QA-CHECKLIST.md` — Adinda didn't want these build-process tracking docs committed to git, and didn't
want to have to remember to gitignore each new one individually. Applied the convention already locked
in this repo (`CLAUDE.md`'s "Local-only files" section, `.gitignore` line 47: `/_*`) rather than invent a
new mechanism — any root-level file/folder starting with `_` is automatically excluded, no per-file
gitignore entry ever needed. All three were untracked (`??` in git status) before the rename, so this was
a clean rename with nothing to purge from git history. `CLAUDE.md`/`MANAGER.md` were NOT touched — they're
already tracked and are the intentionally-committed doc-split pair, not scratch. Every cross-reference to
the old filenames (in CLAUDE.md, MANAGER.md, and a code comment in `boatPage.ts`) updated to match.

---

## SESSION CHECKPOINT — 2026-07-15, END of second session (superseded by the checkpoint above; kept for history)

### Where things actually stand
Repo is in a clean, verified-working state — `tsc`, `eslint`, and a live Studio reload all confirmed
clean as the very last action before this checkpoint was written (not assumed). `boatPage-mari` has
real content loaded and correct per the latest schema shape. Nothing is mid-edit or half-done.

**One real bug hit and fixed this session, worth knowing about if it recurs:** after a burst of rapid
schema-file edits, the dev server threw a persistent `SchemaError` in Next.js/Turbopack even though
`npx sanity schemas validate` (Sanity's own independent validator) found zero errors — confirming it
was stale Turbopack/dev-server state, not a real schema problem, same class of issue as the earlier
"Jest worker" crash-loop from a long-running process. Fix: kill the dev server, clear `.next/cache`,
restart. If Studio ever throws `SchemaError` again after heavy schema editing, this is the first thing
to try, not a code investigation.

### What changed this round (chronological, both messages)
1. **Vessel & Accommodation was WRONG the first time** — I pulled it out as its own separate
   `vesselAccommodationDetails` rich-text field, reasoning it "reads better as prose." Adinda: "not
   what I mean at all." Then she sent the actual Figma screenshot of the Specifications accordion,
   which resolved it cleanly: **8 fixed categories total, ALL the same shape** — a single
   `richTextBasic` body per category, not label/value pairs, not one category singled out. Final
   list: Vessel & Accommodation, Crew, Diving Equipment, Tenders, Machinery & Power, Navigation &
   Communication, Safety Equipment, **Amenities & Others** (one combined category, confirmed by the
   screenshot — not "Amenities" and "Others" split into two, which is what her dictated list had
   genuinely read as ambiguous before the image arrived). Reverted the separate field, restored one
   unified `specifications` array with 8 categories, each `{category, body: richTextBasic}`,
   `initialValue` seeding all 8 on every new boatPage. Real mari-core content loaded into all 8,
   formatted as flat lines (no bullets) matching the mockup's actual visual style exactly — see
   `_internal/scripts/smoke-test-fix-specs.ts`, verified via GROQ query-back (categories list confirmed).
2. **`overviewCta` field deleted — was a modeling mistake, not a refinement.** Adinda: there's no
   separate CTA/link here at all. `overviewBody`'s "Read More" is a truncate-and-expand on the SAME
   text (identical pattern to the homepage Testimonials cards), not navigation anywhere. Removed the
   `link`-type field entirely; the truncate/expand behavior is a frontend requirement, not yet built
   (no boat page component exists), flagged in-file and in _internal/SCHEMA-SPECS.md.
3. **`overviewBody` upgraded from tier-2 (`richTextBasic`) to tier-3** — same editor as the T&C page.
4. **New shared type: `objects/richTextFull.ts`, named "Full Rich Text Block" per Adinda's explicit
   naming request.** Extracted from `page.ts`'s previously-inline body config. Spec: H1 through H6
   (page.ts only had H1-H4 before — H5/H6 added per Adinda), bold/italic/underline/strike/code,
   alignment, inline image, raw HTML embed. **Text color annotation removed** — Adinda: "not allowed
   for now... not resolved yet," explicit removal, not an oversight. `page.body` and
   `boatPage.overviewBody` both now use this ONE shared type — update it once, both update together,
   matches the same "shared type = single source of truth" pattern already used for `richTextBasic`.
5. **`richTextBasic` (tier 2) gained bullet-list support** — was `lists: []` (none), Adinda wanted
   bold/italic/bullets/links for the specifications rich text. CLAUDE.md's content-model section
   updated to match (tier 2 is now "paragraph + bold/italic/link + bullets", not "basic marks only").
6. **Field descriptions rewritten site-wide** to be evergreen/tight — no names, dates, or
   instance-specific examples ("e.g. Mari") in anything Studio-visible; that reasoning now lives only
   in code comments and this file. Verified Sanity has no built-in tooltip/info-icon alternative to
   always-visible inline description text (would need a custom field component — not worth building).
7. **Cabins moved to its own Studio group**, out of Overview. `cabinsHeading` confirmed + seeded as
   literally "Cabins."
8. **Gallery**: fields now sit inside a `fieldset` with a `description` ("images/categories live in
   the shared Gallery section, not here") — fieldset descriptions render before their fields, verified
   live with no schema error; group-level descriptions don't have this property, which is why a
   fieldset was needed specifically.
9. **Slug repositioned to Basic Info, ordered short name → title → slug** (WordPress-style), applied
   to `boatPage` AND retrofitted `page.ts`/`scheduleRates.ts` (their `settings` groups removed
   entirely, `slug` now lives next to `title`) — "for every page type," per Adinda's explicit ask, not
   boatPage-only.
10. **New `_internal/QA-CHECKLIST.md`** — for an external human reviewer, distinct from _internal/SCHEMA-SPECS.md (field
    approval) and _internal/CONTENT-STATUS.md (content-placeholder tracking). One item so far: whether the
    eyebrow-toggle should be global or per-section (currently per-section) — explicitly left open,
    Adinda is checking with Serge.

### Explained, not changed (Adinda asked, no code action needed)
- **Red warning icons on Studio tab names** = Sanity's own built-in validation-error indicator,
  appears on a tab when a `Rule.required()` field inside it is empty on an unsaved/incomplete
  document. Not a bug — will clear once required fields are filled in.
- **"If a specification category is empty, hide that accordion item entirely"** — understood and
  agreed, this is a frontend rendering requirement (check if `body` has content before rendering that
  accordion row), not a schema change. Not buildable yet, no boat page component exists. Flagged in
  the `specifications` field's code comment.
- **Rich text editor "a little bit smaller by default"** — Adinda wants the Portable Text editor box
  shown smaller than the tall default in her screenshot. **NOT implemented — genuinely unsure whether
  Sanity's block editor supports a configurable default height** (it auto-grows with content by
  design; a fixed/smaller default might need a custom input component). Needs research before
  building, flagged rather than guessed at.
- **Documentation embedded inside Studio itself** — Adinda agreed with the earlier recommendation
  (keep external for now). Logged as an explicit **post-launch backlog item**: a custom Studio tool
  hosting docs, "looks more professional," possibly paired with an intro Loom video — a bonus, not
  pre-launch scope.
- **SEO auto-population tracking** — confirmed it IS tracked (_internal/SCHEMA-SPECS.md's `boatPage` SEO row:
  "real frontend `generateMetadata` work, not schema, not built yet") — same bucket as the JSON-LD
  auto-generation, both blocked on the eventual Sanity-wiring pass, not lost or forgotten.
- **T&C page "is gone"** — real gap, not a bug: the `page` document TYPE exists but no actual T&C
  `page` document was ever created in Sanity. Real content already exists and is ported/final in
  `mari-website` skill's `references/pages/tc.md` (16 sections). **Deliberately NOT done this
  session** — a 16-section content import right as Adinda was stepping away risked rushing it; this
  is the clear top item for the next session instead of a discussion topic.

### Models/effort — confirmed, not yet fully resolved
Adinda confirmed reasoning-effort levels (low/medium/high) are a real concept and accepted the
proposed logic: no Haiku, no Fable, Sonnet at medium effort for menial tasks, **Sonnet at high effort
as the default** (this build is the higher-risk dynamic Next.js+Sanity site, not the old static one),
Opus reserved for architecture-tier decisions. She noted correctly that a lot of *this specific
session's* work (gallery redesign, content-model changes, cross-cutting renames) really was
architecture-tier, not just skeleton-building. **Confirmed directly: current model for this whole
session has been Sonnet 5, not Opus** (per her own `/model` check earlier in the session). **Still
open, flagged honestly both times it came up:** the exact mechanism for adjusting *this session's*
reasoning effort (not sub-agent effort, which is a separate, already-real parameter) isn't something
I have confirmed knowledge of — worth Adinda checking `/config` or asking directly before we treat the
effort-level part of this logic as fully actionable, not just agreed in principle.

### Top of the list for next session
1. **T&C page** — import the real, already-final 16-section content from `mari-website`'s
   `references/pages/tc.md` into an actual `page` document using the new `richTextFull` editor.
2. Research whether Sanity's Portable Text editor supports a smaller default height, before touching
   `richTextBasic`/`richTextFull`'s presentation.
3. Resolve eyebrow-toggle placement (global vs. per-section) once Serge weighs in.
4. Destination page + Private Charters Figma passes — queued, links already shared, not yet started
   (this whole final stretch of the session was boat-page refinement, destination/PC never got to).

---

## SESSION CHECKPOINT — 2026-07-15, second session same day — full page inventory + Tier 4 scope locked (superseded by the checkpoint above for "current state," kept for its own history below)

Late-night session, Adinda explicitly low-energy/ADHD, budgeted ~2.5-3h. No code risk taken — this session
is primarily a locking/decision pass, not a build pass, plus one small content edit (Testimonials, below).

### Full page inventory — locked this session, replaces the incomplete 7-type Tier 4 list below
Cross-checked against the real `Nav.tsx` (not assumption) before asking Adinda to mark it up.

| Page | Slug | SEO-first? | Schema approach | Notes |
|---|---|---|---|---|
| Homepage | `/` | Yes | `homePage` (not built) | |
| The Boat | — | — | — | **STILL OPEN — Adinda did not answer this one.** Currently a homepage anchor only (`#the-boat`). Ask directly next session: standalone `/boat` page too, or is the homepage section enough for launch? |
| Destinations | one per destination | Yes | `destinationPage` (not built) | Template-based, one doc per destination. Will also host that destination's own destination-specific FAQ items (see FAQ below). |
| Private Charters | **tentatively** `/private-liveaboard-charter-indonesia` — **unconfirmed, transcription was garbled, needs a one-line confirm from Adinda** | Yes | Own page — schema type (dedicated vs. generic `page`) not yet specified, default assumption is generic `page` unless Adinda says otherwise | |
| About | `/about` | No (Adinda's explicit call) | Generic `page` type | Also hosts the Testimonials component (see below) |
| Schedule & Rates | **tentatively** `/booking` — **unconfirmed, Adinda said "I think," needs a one-line confirm** | Yes | Already built: `scheduleRates` schema (singleton, has `embedCode` field for INSEANQ) | No new schema decision needed, just the slug |
| Blog | `/blog` | No | **New — `blogPost` doc type + listing page, NOT previously in Tier 4 scope, Adinda caught the gap** | Needs categories. Marine Life Guide folds into Blog as a category rather than its own page — Adinda wants a few dummy/placeholder posts to demo what it looks like, not real content yet |
| Terms & Conditions | — | No | Generic `page` type (confirmed) | Content already sourced, 16 sections, mechanical port |
| Onboard Prices | — | No | Generic `page` type (confirmed) | Adinda has the content already from the current live MVP site |
| FAQ | `/faq` | No | **New — needs an `faq` (or `faqItem`) doc type**, fields: question, answer, `category` (topic grouping for hub-page tabs), `type` (`general` \| `destinationSpecific`), and if destination-specific, a reference to which `destinationPage` | Hub page shows only `general`-type items, tabbed by category. Does NOT list destination-specific FAQs — instead the hub page includes a "browse by destination" slider (reuse the homepage Destinations component) that routes users to the relevant destination page, where that destination's specific FAQ items live |
| Contact | — | — | No standalone page — confirmed | Contact stays as sections distributed across pages (homepage already has one) |
| Itinerary pages | list only, not clickable | Secondary | `itinerary` stub (not built) | Unchanged from already-locked scope |
| Testimonials | — | — | **New — `testimonial` doc type (not built)** | **Correction from Adinda: NOT homepage-only** — also appears on the About page, same component. Needs an optional `tripAdvisorEmbedCode` field: if present, the card's "Read more" button becomes "View on TripAdvisor" and links out directly instead of expanding inline; if absent, current inline-expand behavior applies. No TripAdvisor integration exists yet (contingent on Stefan signing the social add-on, per `mari-project` skill) — build the field now so it's ready, don't wire the actual integration |

**Confirmed OUT of scope, not building:** Gallery, standalone Marine Life Guide page (folded into Blog instead), Booking flow (INSEANQ widget replaces this).

**Revised Tier 4 type list** (supersedes the 7-type list in the 2026-07-14 checkpoint below): `homePage`,
`destinationPage`, `boatPage` *(pending The Boat decision above — may not be needed)*, `itinerary` (stub),
`testimonial` (+ TripAdvisor embed field), `faq` (+ category/type/destination-reference fields), page-builder
block shell, **`blogPost`** (new). `page` (generic), `scheduleRates` already exist from the 2026-07-14 pass
and cover About, T&C, Onboard Prices, and (pending confirm) Private Charters.

### Testimonials — content added this session (code only, no schema yet)
Adinda: the old `TEST_ONLY_REVIEWS` (4 generic "Placeholder review text..." cards) weren't good enough to
show Stefan ahead of launch. Replaced with `DRAFT_REVIEWS_REMOVE_BEFORE_LAUNCH` in `Testimonials.tsx` — 4
AI-drafted, realistic-reading reviews (Mara J, Tomas B, Priya N, Julian F), each with a `[DRAFT]` prefix on
its headline (the `title` field, not the person's `name`) as the tracking marker. **Explicit decision:**
these ARE meant to be visible now (pre-launch, for Stefan's review) — Adinda's call, not a draft/unpublished
staging pattern — but **must be deleted or replaced with real guest reviews before public launch**. Flagged
in-file and here so it isn't lost. `tsc --noEmit` clean after the edit.

### Still open from this session — resolve before locking Tier 4 fully
- [ ] **The Boat** — standalone page or homepage-section-only? Not answered yet.
- [ ] **Private Charters slug** — confirm exact spelling (`private-liveaboard-charter-indonesia`?).
- [ ] **Schedule & Rates slug** — confirm `/booking` is actually what Adinda wants.
- [ ] **Private Charters schema approach** — dedicated type or generic `page`? Not specified.

### Boat page schema — built this session, from the actual Figma mock (node 778:8702), not guessed
Three new document types: `boatPage` (repeatable, NOT singleton — see below), `cabinType` (Deluxe/
Superior etc., references `boat`), `cabin` (individual physical cabin, references both `boat` and
`cabinType`, options-filtered so only cabin types belonging to the already-picked boat are
selectable). New shared object `richTextBasic` — the first real implementation of the locked tier-2
content-model (paragraph + basic marks only); `page.body` remains the only tier-3 field until a
second one is actually needed. `link.ts`'s referenceable-page list now includes `boatPage`.
Registered in `schemaTypes/index.ts` and given a "Boats" nested entry in `structure.ts` (Boats /
Cabin Types / Cabins) — cabinType/cabin deliberately not top-level, matches the "editor-organization
deferred to last" convention. `tsc`, `eslint`, and a live Studio reload all verified clean.

**Real Figma finding that resolved the multi-boat URL question:** the Hero's breadcrumb component
(node 718:5417, inside `MARI Website 1.0`) literally renders `Home / Boats / Mari` — plural
collection, singular boat — while the top nav still shows singular "The Boat" with no dropdown
chevron. Not a Figma inconsistency: this is exactly the two-state nav behavior Adinda described
(single boat today → direct link; multiple boats later → mega-menu dropdown), already built into
the design. **This overrides url-structure.md's currently-locked `/boat`** — recommend `/boats/mari`
(collection pattern, matches `/destinations/[slug]` already in this codebase) instead, avoiding a
redirect/SEO-equity cost if a second boat is ever added post-launch. **Not yet confirmed by Adinda —
flag before treating `/boats/mari` as locked.**

**Hero stats strip — corrected mid-build.** Figma's 3-slot stats strip shows literal Komodo
destination copy (Season/Duration/Minimum Skill Level) — a known placeholder issue already flagged
in mari-website's boat.md open item #7. First pass dropped the strip entirely (doesn't make sense
at boat level). **Adinda corrected this, not dropped:** boat-level stats belong here, just different
content — number of cabins, number of guests, boat size, number of crew. Built as `heroStats`, a
flexible label/value array (not 4 fixed fields), seeded with those 4 as initial values.

**Not built — deliberately deferred, needs a decision first:** boat-level FAQ. The Layout&Specs
section's FAQ tab in Figma likely reuses the same shared `faq` document pattern already planned for
destination-specific FAQs (see the earlier page-inventory lock) — extending `faq`'s reference field
to optionally point at a `boatPage` as well as a `destinationPage` once `faq` itself gets built,
rather than bolting on a separate parallel mechanism now. Also not built: `destinationPage`,
`private-charters` schema approach — next in line per Adinda, Figma links pending for those.

### Gallery reworked to array-on-page for native bulk upload — 2026-07-15, EXPERIMENTAL, decided after Perplexity + docs verification
**Driver:** Adinda's hard requirement — non-technical editors must be able to **bulk-upload gallery
image files** (drag/select many at once), because one-by-one is too slow. She explicitly does NOT need
bulk *alt* editing — alt/caption/title edited per image after upload is fine.

**Research done properly, not guessed:** wrote a Perplexity prompt, then independently verified its two
load-bearing claims against the actual Sanity v6.4 docs via WebFetch (Perplexity's own citations were
mostly fake — they pointed at `localhost:3000/studio`, i.e. Adinda's own Studio URL, not sources; flagged
this to her). Confirmed verbatim from the image-type docs: *"Arrays of images accept batches of files to
be dropped on them."* And from presenting-images: alt lives on the image field (`image.alt`), not the
asset — so alt isn't globally reusable, it's per-usage. The one thing the docs DON'T promise: batch drop
for an array member that's an *object wrapping* an image. **Key insight that resolved everything: we don't
need the wrapper** — use a bare `image` type WITH extra fields, which is both "an array of images" (batch
drop works) and the documented way to attach per-image alt.

**What changed:**
- `boatPage.gallery` is now an **array on the page**, grouped by category: each entry =
  `{ category (required), heading, body, images[] }`. The inner `images` array member is the new shared
  `galleryImage` **object** (`objects/galleryImage.ts`, `type: 'image'` + required `alt` + `caption`).
  Native multi-file batch drop lands on that inner images array. Category set once per group/batch.
- **Deleted both document types** `documents/galleryImage.ts` and `documents/galleryCategory.ts`, their
  schema-index + structure.ts entries, and the "Gallery" Studio sidebar section. Deleted the 6 test
  documents from the dataset (3 galleryImage + 3 galleryCategory — galleryImages first since they
  referenced the categories; verified 0 remain). `boatPage-mari.gallery` is now empty, ready for real
  content in the content pass.
- Three-level description model preserved: page-level `galleryDescription` (level 1) → group
  `heading`/`body` (level 2) → image `caption` (level 3).
- Reverses the galleryImage/galleryCategory-as-documents decision logged earlier this session — a real
  reversal, but driven by a genuine new requirement (not nitpicking), cheap now (only test data), and
  expensive post-launch, so the right time to change.
- **Locked into CLAUDE.md** (new "Galleries" section, with the full reasoning + the load-bearing "must be
  `image` type not a wrapper object" gotcha, per Adinda's ask to document the why) and **queued for the
  `drk-website` skill** (`_internal/handoff/drk-website.md`) as a reusable DRK-wide pattern.
- **Status EXPERIMENTAL** — the category-per-batch grouping is an untested UX bet; _internal/SCHEMA-SPECS.md has an
  explicit "verify with real multi-file drop in Studio" checkbox. Adinda: "we're still trying this out."

Verified: `tsc`, `eslint` clean; dev server restarted fresh (cache cleared), Studio 200, zero
`SchemaError` in the fresh dev log.

### Post-smoke-test schema cleanup round — 2026-07-15, same day
Adinda reviewed the live Studio form directly (per last message's suggestion) and found real issues
a field-list review alone couldn't have caught:
- **Field descriptions had internal/dated/instance-specific language leaking into Studio-visible
  text** ("Adinda's ask", "locked 2026-07-15", "e.g. Mari") — real problem, not nitpicking:
  descriptions are what an actual editor reads, and none of that context is useful or evergreen to
  them. Rewrote every description across `boatPage`/`cabinType`/`cabin`/`galleryImage`/
  `galleryCategory` to be short and generic; decision history stays in code comments and
  MANAGER.md/_internal/SCHEMA-SPECS.md only. Verified: Sanity's `description` renders as always-visible
  inline text by default (confirmed via search — no built-in tooltip/info-icon, would need a custom
  field component, not worth building for this) — tight text is the actual fix, not a UI feature.
- **Cabins moved to its own Studio group**, out of Overview — confirmed `cabinsHeading` should
  literally read "Cabins" (now seeded as its `initialValue`).
- **Gallery**: added a `fieldset` with a `description` wrapping its fields — fieldset descriptions
  render before their fields (verified live, no schema error), group-level ones don't have this
  property, which is why a fieldset was needed specifically here.
- **Vessel & Accommodation pulled out of the `specifications` array into its own
  `vesselAccommodationDetails` rich-text field** — reads as prose, not a spec sheet, unlike the
  other 6 categories. Required upgrading `richTextBasic` (tier 2 of the locked content model) to
  support bullet lists, which it didn't have before — CLAUDE.md's content-model section updated to
  match. `specifications`'s fixed category list dropped to 6 or the remaining categories; now seeded
  via `initialValue` on every new boatPage doc (same pattern as `stats`), not built from empty.
  Real mari-core data loaded for all 6 remaining categories + the new prose field via
  `_internal/scripts/smoke-test-update-specs.ts`, verified via GROQ query-back.
- **Slug repositioning, locked as a convention for every page type, not just boatPage:** short
  name → full title → slug, WordPress-style, always together near the top of the main content
  group — not buried in a separate Settings tab. Applied to `boatPage` (new Basic Info order) AND
  retrofitted `page.ts`/`scheduleRates.ts` (slug moved out of their now-removed `settings` groups,
  next to `title`). Caught and fixed one transient `SchemaError` mid-edit (a field still pointed at
  the deleted `settings` group between the two edits) — confirmed clean afterward, not just assumed.
- **Deferred, not decided:** whether the eyebrow-toggle should be one global toggle or per-section
  (currently per-section) — Adinda is checking with Serge, left as an explicit open question, not
  quietly picked one way.

Verified throughout: `tsc`, `eslint` clean, Studio confirmed loading with no schema errors after
every file change (checked the dev log directly for `SchemaError`, not just HTTP 200).

### Smoke test executed — real documents populated in Sanity, 2026-07-15
Ran `_internal/scripts/smoke-test-content.ts` via `npx sanity exec ... --with-user-token` (underscore-prefix
throwaway script, not a real project file). Created: 1 `boatPage` (Mari), 1 `cabinType` (Deluxe
only), 3 `galleryCategory`, 3 `galleryImage`. Images: 3 uploaded from Figma's own embedded assets
(hero, key features, one gallery photo — all still-valid short-lived Figma asset URLs fetched
earlier this session), 3 from Picsum (stock, standing in for "Pexels or whatever," explicit
PLACEHOLDER alt text on each). Verified via GROQ query-back, not just "script exited 0" — confirmed
`coverImage`'s `_type` correctly resolved to `imageWithAlt` (not the base `image` type), and
`galleryImage.categories[]->name` correctly dereferenced multi-category assignment (one image
tagged to both Relaxation and The Boat). `tsc`/`eslint`/Studio all still clean afterward.
`_internal/CONTENT-STATUS.md` filled in field-by-field with what's real vs. Figma-sourced vs. Claude-authored
placeholder — see that file for the honest per-field breakdown, including a few Claude-authored
stand-ins (cabinsHeading, galleryDescription, 2 of 3 gallery category blurbs) that aren't Figma text
and shouldn't be mistaken for it.

### Field-list review round — boatPage revised again, gallery category model resolved, 2026-07-15
Adinda reviewed the full field list (asked for it explicitly after not having seen it laid out).
Changes: `hero` group renamed `basicInfo` (fields aren't hero-only — `coverImage`/`tagline`/`stats`
also feed a future Boats-listing card component); `heroImage`→`coverImage`, `heroSubheading`→
`tagline`, `heroStats`→`stats`. Reviewed mari-core's `boat.md` for additional at-a-glance stats per
Adinda's ask — nothing essential enough to force into the seed list beyond her original 4
(Cabins/Guests/Boat Size/Crew), noted 1:1 crew ratio and "Built 2008" as optional additions given
the array is already flexible. Added toggle-to-reveal booleans (`showXEyebrow`) on all 4 eyebrow
fields, reusing the exact `hidden: ({parent}) => !parent?.x` pattern the SEO object's `jsonLd`
override already used — genuinely cheap given that precedent, not deferred. `keyFeatures`
description corrected — always was unlimited, wording just implied a cap.

**Gallery category model resolved** — Adinda's own "how do we separate these" question. New
`galleryCategory` document type: `belongsTo` (reference), `name`, `heading`, `body` — one per
category (e.g. "Dining"), giving each its own description distinct from both the whole-gallery
`galleryDescription` and each photo's own `caption`. `galleryImage.tags` (free string array)
changed to `galleryImage.categories` (reference array to `galleryCategory`) — same multi-select
behavior, no typo-driven drift between an image's tag and a category's actual content.

**SEO JSON-LD — already built, not new work.** Checked `seo.ts` directly before assuming anything
needed building: `overrideJsonLd` (boolean) + `jsonLd` (hidden unless toggled) already exists,
exactly matching "auto-populated by default, overridable if wanted" from the 2026-07-14 pass.

Verified throughout: `tsc`, `eslint` clean; Studio hit one transient HMR error right after
`galleryCategory.ts` was added (`module factory is not available` — stale chunk from a brand-new
file, self-healed on the next compile, confirmed via a second curl after the auto-reload). Not a
real bug.

### `_internal/SCHEMA-SPECS.md` created — new root doc, checkbox spec per Sanity page type, 2026-07-15
Adinda: wants the boat page's Sanity field spec documented somewhere durable, checkable per field
("this is approved, this is approved"), distinct from MANAGER.md's dated log — and eventually
promoted to `atlas-website` as a reusable pattern once validated, not before (Mari is explicitly the
pilot). New file, 4th in the CLAUDE.md-documented doc split. 🟡 Draft status on every field right
now — Adinda hasn't approved anything yet, this session just gave her something to approve *against*.
Promotion path staged in `_internal/handoff/atlas-website.md` (new "Sanity schema patterns" reference category
that skill doesn't have yet) — not promoted now, correctly held for validated-at-scale status.

### Gallery, layout diagrams, alt text — reworked same session, before the URL question got answered
New shared `imageWithAlt` object (required `alt` field) — replaces bare `type: 'image'` everywhere
across `boatPage`/`cabinType`. New `galleryImage` document type: ONE shared type for boat AND
future destination galleries (not two types merged later) — each image is its own doc with
`belongsTo` (reference, `boatPage` only for now), `tags` (free-text multi-select, `layout: 'tags'`,
one image can carry several), and `caption`. `boatPage` keeps only `galleryTitle`/
`galleryDescription` — no reference-array field back to the images, since Studio's built-in
"Referenced by" panel already shows that per-document; a hand-maintained array would just be a
second, driftable source of truth. `layoutDiagram` (single image) upgraded to `layoutDiagrams`
(array of {heading, body, images — 1+ `imageWithAlt`, stackable}) per Adinda's actual ask — Figma
only showed one static diagram, not this structure. Verified: `tsc`, `eslint`, live Studio reload
(1.68s schema sync, no errors).

**Image SEO — verified against Sanity's actual docs, not assumed.** Sanity CDN URLs are hash-based
and can't be made descriptive at upload time, but Sanity does support "vanity filenames" — a
descriptive name appended to the URL after the hash (`.../​{hash}-{w}x{h}.{ext}/​{seo-name}.{ext}`),
which still works with all transform params. That's a `src/sanity/lib/image.ts` / `urlFor()`
helper change (slugify from `alt`), not a schema field — not built yet, no components consume
Sanity images yet. What the schema pass CAN and does guarantee now: every image has a required
`alt`, so that helper has something real to slugify once it's built. Source: [Sanity Answers —
preserving image filenames for SEO](https://www.sanity.io/answers/preserving-image-filenames-in-sanity-cdn-urls-for-seo-visibility).

### `/boats/mari` vs `/boat` — SEO analysis, still needs Adinda's final word
Asked directly: is repeating "mari" (domain already `mari-liveaboard.com`) redundant? Answer: no —
URL slugs are a very minor, near-negligible direct Google ranking factor (title tag, H1, body
content, and site authority all matter far more); repeating a brand term in a URL isn't penalized
and is extremely common on real sites. The actual tradeoff is structural, not keyword-density:
`/boats/mari` (collection pattern, matches the Figma breadcrumb and the existing
`/destinations/[slug]` precedent) costs nothing today and avoids a 301 redirect + temporary
crawl/indexing lag if a second boat is ever added later; `/boat` (singular) is marginally shorter
today but would need that migration later if the multi-boat future actually happens. Recommendation
unchanged: `/boats/mari`. **Real reassurance, not just politeness: this costs nothing to change
right now** — zero real content/backlinks exist yet, so a slug rename pre-launch is free; the
"costly to change" scenario only kicks in post-launch with real traffic/backlinks pointing at the
old URL. Still flagged as pending Adinda's actual confirm, not silently locked.

### Alt text + SEO filenames — escalated to a hard, site-wide AND skill-wide rule, locked 2026-07-15
Adinda: bake this in so she never has to repeat it, for this project or future DRK ones. Written into
CLAUDE.md as a standing rule (new "Images" section) and staged in `_internal/handoff/drk-website.md` tagged
`[DRK]` for the skill itself. Retrofitted the two pre-existing image fields that predated `imageWithAlt`
(`page.body`'s inline image — added required validation to its existing `alt` field; `siteSettings.logo`/
`favicon` — switched to `imageWithAlt`). `tsc`/`eslint` clean after the retrofit.

### URL alias / redirect readiness — confirmed prepared, asked directly 2026-07-15
Adinda asked "worst case, are we prepared for a URL alias" before green-lighting `/boats/mari`. Checked
`redirect.ts` directly rather than assume: the Sanity document type already exists and is fully
editor-manageable (`source`, `destination`, `permanent` fields, no code deploy needed to add one). **Not
yet true:** the actual Next.js handler that reads those documents and executes the redirects (`proxy.ts`,
per CLAUDE.md's Next 16 convention note) hasn't been built — data layer ready, wiring not done, same
"queued, not wired" status as several other pieces this build. Answered honestly rather than overstating
readiness: worst case is a small, already-scoped task when needed, not a novel problem — good enough for
Adinda to proceed with `/boats/mari` now.

### FAQ scope field — Adinda's build method for this locked 2026-07-15, not the field itself
Not resolving the general/booking/destination-specific taxonomy question now (still explicitly open, see
above) — instead: build FAQ scope on one real page first, test it, refine, then carry the refined pattern
into the next page's FAQ build, documenting each round. Matches this project's existing skeleton-first /
don't-speculate discipline (e.g. the dropped `is_featured` field) rather than introducing a new process.

### FAQ "scope" field — noted for whenever `faq` gets built, not built now
Adinda: the shared `faq` type needs a way to say what a given FAQ item is *for* — this session,
just "for a boat" as one valid value. Bigger open question (general/booking/payment vs.
boat-specific vs. destination-specific sub-taxonomies e.g. diving/travel/general) explicitly NOT
resolved — Adinda flagged it as something to keep revisiting as the FAQ pass actually happens, not
a today decision. Don't build `faq` speculatively ahead of that pass; just don't lose this
requirement when it does happen.

### Editability + section headings — locked 2026-07-15, boatPage revised accordingly
Adinda's rule, worked through out loud then landed on the definitive version: every heading and
every eyebrow is editable (SEO reason — stated explicitly), full stop, with a short, closed
exception list — everything else on the page is also editable text. Not editable: the Layout &
Specs section's 7 category labels (Vessel & Accommodation, Crew, Diving Equipment, Tenders,
Machinery & Power, Navigation & Communication, Safety Equipment — "standard categories... with
specifications", now a fixed `options.list` on `specifications[].category` instead of free text);
CTA/Contact/Footer (shared components, not boat-specific fields at all); the breadcrumb
(auto-generated from `name`, never a field). Everything else — every section's eyebrow, heading,
body, `keyFeatures` bullets — stays free text, confirmed no exceptions beyond that list.

Gap found applying this: **Cabins and Specifications sections had no eyebrow/heading fields at
all** — `cabinsIntro` and `layoutDiagrams`/`specifications` existed but nothing above them. Added
`cabinsEyebrow`/`cabinsHeading` and `specificationsEyebrow`/`specificationsHeading`. Also added
`overviewEyebrow` and `galleryEyebrow` (headings for those two already existed, eyebrows didn't).

**Short name vs. full title, explicitly split:** `name` ("Mari" — breadcrumb, Studio document
title, internal references) vs. new `pageTitle` ("Mari Liveaboard" — the actual hero heading).
Renamed from the old `heroHeading` for clarity, not just relabeled — Adinda wanted these
distinguishable, they weren't clearly two different things before.

**Cabin type feature list, restructured from a free array to 5 named fields** (`bedConfiguration`,
`deckLocation`, `window`, `bathroom`, `airConditioning`) replacing the old generic
`features: array of string`. Icons are fixed per field in frontend code, not editor-uploadable —
"maybe easiest no" was Adinda's explicit call on custom icons. `bedConfiguration`/`deckLocation`
already existed and already matched her "bed type"/"location" asks — no rename needed there, just
kept as-is and added the 3 new ones alongside.

Verified throughout: `tsc`, `eslint`, live Studio reload, no errors.

### Session time — 2026-07-15, second session (Adinda's own tracked estimate)
~1h clock time, but ~30 min of that was a personal call — net working time roughly 1h to 1h40m.
Append to the Session Time Log table below once this session closes out.

### Favicon — wired this session
`src/app/favicon.ico` was still the stale Next.js/`create-next-app` default (confirmed via checksum
mismatch against the real Mari favicon already sitting unused in `public/assets/favico/` since the
2026-07-14 asset port) — replaced with the real file. Also wired the fuller icon set that was sitting in
that same folder but never referenced anywhere: `layout.tsx`'s `metadata.icons`/`metadata.manifest` now
point to `favicon-16x16.png`, `favicon-32x32.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`,
`apple-touch-icon.png`, and `site.webmanifest` (manifest's icon paths were already correct, no edit needed
there). Verified via a live curl against the running dev server, not just source-reading: all `<link
rel="icon"/manifest"/apple-touch-icon">` tags render with the right paths, and every file 200s with the
correct content-type and byte size matching its source file.

**`siteSettings`'s `favicon` upload field already existed** (added in the 2026-07-14 schema pass, `type:
'image'`) — nothing to add there. Worth flagging though: that field isn't wired to anything yet — the
favicon serving today is 100% the static files above, same as every other still-hardcoded piece of the
site. The Sanity field will only actually control the live favicon once metadata generation is wired to
Sanity (`CLAUDE.md`'s roadmap step 3, "wire the homepage to Sanity"), not before.

---

## SESSION CHECKPOINT — end of 2026-07-15 session (READ THIS FIRST — supersedes the 2026-07-14 checkpoint below)

### Where things stand
**Full homepage QA pass is complete and the site is in a known-good, verified-clean state.** Every
section reviewed on both desktop and mobile, ~10 real bugs found and fixed this session (Nav, Hero,
Destinations, Why Us, Testimonials — see the dated entries below for each). `tsc --noEmit` and `eslint`
both clean as of the last edit. Nothing is mid-flight or half-done in the committable sense — the working
tree is safe to leave as-is overnight.

### One thing NOT finished — a real bug found and reverted, not silently left broken
Adinda asked for smooth open/close animation on Nav's mega menus, the mobile menu overlay, and Hero's
mobile search takeover (currently instant `hidden`/`flex` toggles — flagged as a known gap earlier in the
session, see "No instant expand/collapse" in `components.md`/`claude-code.md`). Built a
`useDelayedUnmount` hook (`src/lib/useDelayedUnmount.ts` — **file still exists, currently unused/not
wired into anything**) meant to keep an overlay mounted through its exit fade. It has a real, unexplained
bug: the opacity/pointer-events half of the fade worked correctly (confirmed via direct DOM inspection),
but the hook's own "should this still be rendered" state got stuck at `false` even when the panel should
have been open — meaning the panel never actually became visible (`hidden` class never left) despite the
rest of the state being correct. Root cause not found before time ran out — tried the React-documented
"adjust state during render" pattern (`if (isOpen !== prevIsOpen) { setPrevIsOpen(isOpen); if (isOpen)
setRendered(true) }`) instead of calling `setState` directly in a `useEffect` (which an eslint rule,
`react-hooks/set-state-in-effect`, correctly flagged as an anti-pattern) — confirmed via the actual
compiled Turbopack bundle that the deployed logic matched the source exactly, so it's a genuine logic bug
in the render-phase-adjustment approach itself, not a stale build or a wrong-button-clicked test artifact.

**Reverted cleanly** rather than leave the site broken: Nav.tsx's 3 overlay toggles (Destinations mega,
Resources mega, mobile menu) and Hero.tsx's mobile search takeover are all back to their original,
confirmed-working instant `hidden`/`flex` toggles. Confirmed via direct DOM check post-revert: mega menu
opens correctly again (`hidden` → `flex` on click). This means: **the smooth-transition work for these 4
overlays specifically is NOT done** — Testimonials and Nav's mobile accordions (the two other transition
fixes from this session) ARE done and working, just not these 4.

**For next session:** either debug `useDelayedUnmount` properly with a clear head (start by adding
temporary `console.log`s inside the hook to see the actual `isOpen`/`prevIsOpen`/`rendered` sequence
across renders — that's the next diagnostic step, not yet done), or consider a different technique
entirely (e.g. the newer native CSS `@starting-style` + `transition-behavior: allow-discrete` approach,
not attempted this session, would avoid JS-managed mount-lag state entirely — worth evaluating browser
support before committing to it).

### What's next after that (unchanged from before today)
Tier 4 schema skeleton pass — explicitly **scheduled for a future/afternoon session, not next thing to
open**. See "What's next, in order" in the 2026-07-14 checkpoint below (item 2) for the full scope; that
plan is still accurate, just superseded in ordering by today's QA work being done first as planned.

### Session time
Logged mid-session at **~2h** (Adinda's own estimate, see Session Time Log table below) — that figure
does NOT include the Testimonials refinement round or the transitions work done after that (including
this reverted attempt). Actual total is longer; ask Adinda for an updated figure next session rather than
guessing one now.

---

## SESSION CHECKPOINT — end of 2026-07-14 session (superseded by the 2026-07-15 checkpoint above — kept for history, "Done"/schema-pass detail below is still accurate)

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
  mega-menu reminder. `_internal/handoff/mari-website.md`'s announcement-bar conflict is reconciled.

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
   reason this was sequenced after the port, not before). **Method locked 2026-07-15: skeleton-first,
   same as the original schema pass** — scaffold all 7 types with core fields only, get them showing in
   Studio's sidebar/structure first, so the actual organization is visible rather than reasoned about
   abstractly, THEN fill in field-level depth per type once the shape is real. Also carries the
   Resources-copy-Sanity-editable and nav-default-link-with-override decisions logged above into this
   pass. **Scheduled for a future session (Adinda: "the afternoon session, but not now") — not part of
   today's remaining work**, despite being the next item in this list.
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

### Why Us — second pass + The Boat, reviewed 2026-07-15 (page-order correction)
QA was reviewing out of page order (jumped to Nav/Hero/Destinations, skipping The Boat and a second Why Us
look entirely) — corrected: actual homepage order is Nav → Hero → **The Boat** → **Why Us** → Destinations →
.... Both reviewed now, page-order-correct, before moving to Destinations.
- [x] **The Boat** — Adinda: no code issues, nothing to fix.
- [x] **Why Us** — Adinda: everything else looks great on both desktop and mobile. Two notes, both
  logged as open backlog, not fixed now (explicitly not urgent):
  - [ ] **Missing hover-zoom effect on card images.** The Boat's image has a subtle hover zoom
    (`group-hover/boat:scale-105`, 1100ms ease-in-out) that Why Us's 4 cards don't have at all —
    confirmed by reading both components directly. Add the same effect to Why Us's `<Image>` elements
    for visual consistency between the two sections, when this gets picked up.
  - [ ] **Card image cropping needs manual re-work — content task, not a code fix.** Adinda's own
    to-do, especially the "Premium Comfort" card (`why-us-dining.webp`, the dining-table image) — the
    current crop isn't right. No code change needed; this is an asset-replacement task on her end.
  - [x] **Hover-zoom fixed same session** (Adinda asked for it explicitly right after logging it as
    backlog) — added the identical `group-hover/boat:scale-105`-style pattern from The Boat to Why
    Us's card `<Image>`s: `transition-transform duration-[1100ms] ease-in-out group-hover/card:scale-105`
    (the cards already had a `group/card` class from their existing expand-on-hover behavior, so this
    layers on top of that, not a new interaction). Verified clean: `tsc --noEmit`, `eslint`.

### Destinations QA — reviewed 2026-07-15, 2 real bugs found + fixed
Adinda checked both desktop and mobile herself. Everything else confirmed good; two real bugs, both fixed:
- **Active tab could scroll out of view with no way back into view.** Clicking a tab near the end of the
  list (e.g. North Sulawesi) made it active but the tabs row never scrolled — Adinda's screenshot showed
  it cut off mid-word at the container's right edge. Fixed: a `useEffect` on `index` change calls
  `scrollIntoView({inline: 'start', block: 'nearest'})` on the active tab, aligning it to the start of the
  visible track. For tabs near the end (not enough remaining items to fill the width), the browser
  naturally clamps this to the max scroll position instead — verified directly: clicking North Sulawesi
  now brings it fully into view with Halmahera (the only tab after it) visible too, exactly matching
  Adinda's requested fallback behavior.
- **Drag-to-scroll on the tabs row worked on mobile (native touch) but not desktop (mouse).** The row
  only had `overflow-x-auto` — enough for native touch scroll, not for a click-and-drag gesture with a
  mouse. Fixed by wiring up the project's existing `useDragScroll` hook (same one `WhyUs.tsx` already
  uses for its mobile card track) — mouse-only by design, leaves touch alone since that already works
  natively. Verified via a simulated real mouse press→move→release: `scrollLeft` moved 0 → 175.
Both fixes in `Destinations.tsx`. Verified clean: `tsc --noEmit`, `eslint`.

### Regression from the fix above, same session: page auto-scrolled to Destinations on every load
Adinda caught it immediately after the tab-scroll fix landed: every page refresh jumped straight to Why
Us on desktop, and to the Footer on mobile — with zero interaction. Traced by instrumenting
`scrollIntoView`/`scrollTo` directly (monkey-patched both, captured a real stack trace on the actual
call) rather than guessing from source, since grepping for likely culprits (`autoFocus`, `.focus()`,
other scroll calls) turned up nothing — the trace pointed straight at `Destinations.tsx`'s own new
`useEffect`.

**Root cause:** `useEffect(() => { tabRefs.current[index]?.scrollIntoView(...) }, [index])` fires on
**mount**, not just on real index changes — `index` starts at `0`, so the effect runs immediately on
every page load. `block: 'nearest'` scrolls the whole PAGE vertically (not just the tabs track
horizontally) if the target element isn't yet in the viewport, which it never is on load since the user
starts at the top of the page. Landing at Why Us vs. Footer on desktop vs. mobile was just which position
the browser computed as "nearest" given each layout's very different total height — same one root cause
either way, not two different bugs.

**Fix:** added a `skipFirstScrollIntoView` ref, set true initially, checked and cleared at the top of the
effect before any scroll call — skips exactly the mount-triggered run, fires normally on every real index
change after that. Verified two ways: (1) re-ran the instrumented fresh-load test — 0 scroll calls
captured, `scrollY` stays `0`; (2) re-confirmed clicking a tab still auto-scrolls it into view correctly
(North Sulawesi test from the original fix, unchanged result). Verified clean: `tsc --noEmit`, `eslint`.

**General rule, not just this component** — logged in `references/components.md` (local `drk-website`
skill copy) and queued in `_internal/handoff/drk-website.md` for the real skill: any `useEffect` that calls
`scrollIntoView`/`scrollTo` and is keyed on a piece of state must explicitly guard against firing on the
initial mount, unless a mount-time scroll is actually the intended behavior. `useEffect` always runs at
least once after first render — an effect keyed on a value that starts at its "default active" state
(index `0`, first item, etc.) will otherwise fire unconditionally on every load.

### QA in progress — mobile bug found + fixed this session (2026-07-15)
Adinda reported "barely any content" on real iPhone (both Safari and Chrome — same WebKit engine).
**Chromium mobile emulation and desktop Playwright WebKit both rendered the page correctly**, so the bug was
only reproducible via real-device screenshots, which Adinda provided section-by-section. Those showed a clean
pattern: every section rendered its background/texture but not its actual content, **except Hero and
Destinations** — the two sections not gated behind the scroll-reveal system (`ScrollReveal.tsx`,
`[data-reveal]`/`[data-revealed]`, IntersectionObserver-driven). Hero is exempt in practice because it's in
the first viewport (reveals instantly on load); Destinations is the only section that doesn't use
`data-reveal` at all. Root cause: the observer was not reliably firing `isIntersecting` for below-the-fold
elements on real WebKit-iOS (suspected: Safari's dynamic toolbar changing the actual viewport height
mid-scroll, interacting badly with the percentage-based `rootMargin`) — content stayed permanently at
`opacity: 0`. Exact WebKit mechanism not fully nailed down (no real-device dev tools access this session),
but the fix doesn't depend on knowing it precisely.

**Fix, `ScrollReveal.tsx`:** added a manual scroll/resize-driven backup check alongside the existing
IntersectionObserver — independently re-checks each not-yet-revealed element's real position and reveals it
once genuinely near the viewport (same trigger condition as the observer's `rootMargin`, just computed
manually). Deliberately NOT a blind timeout-after-mount — an earlier draft of this fix did that and would
have force-revealed all below-the-fold content ~1.5s after page load regardless of scroll position, killing
the reveal-on-scroll effect entirely even on working browsers. Verified clean: `tsc --noEmit`, `eslint`.

**CORRECTION, same session — this WebKit theory was superseded by the real root cause.** Adinda reported the
exact same symptom reproduces on her own *desktop* browser too, purely by which hostname is used: broken via
her LAN IP (`192.168.0.101:3000`), fine via `localhost:3000`, on both desktop and phone. That's not a WebKit
bug — it's Next.js 16's dev-only cross-origin protection: `next dev` blocks requests to dev resources
(HMR websocket, the `__nextjs_font` dev font-serving endpoint, etc.) from any origin other than `localhost`
unless explicitly allowlisted. Confirmed directly in `.next/dev/logs/next-development.log`:
`⚠ Blocked cross-origin request to Next.js dev resource /_next/webpack-hmr from "192.168.0.101"` (and the
same for `/__nextjs_font/geist-latin.woff2`). This single cause explains every observation without needing a
device-specific theory at all — the phone could only ever reach the server via the LAN IP, never `localhost`.
**Real fix:** added `allowedDevOrigins: ["192.168.0.101"]` to `next.config.ts` (Next's own documented
solution for this exact scenario) and restarted the dev server. Confirmed via a fresh CDP-driven browser hit
against `http://192.168.0.101:3000/` post-restart: no blocking warnings in the log, The Boat section (and by
extension everything gated behind `ScrollReveal`) renders correctly. **The `ScrollReveal.tsx` hardening above
is being kept anyway** — it's a legitimate defensive improvement regardless of root cause, just wasn't the
actual fix. **Still needs Adinda's real-device re-test** to close this out — dev-only issue, will not exist
in production (no `allowedDevOrigins`/HMR/dev-font machinery outside `next dev`), but should be confirmed
fixed for the remainder of this QA pass to not be a recurring distraction. If Adinda's Wi-Fi IP changes later
(DHCP), `next.config.ts`'s `allowedDevOrigins` value needs updating to match.

### Homepage port QA checklist — for Adinda, remaining sections
Run `npm run dev`, open `http://localhost:3000/`, and check. **Each section gets a desktop pass AND a
mobile pass, explicitly separate — not one generic look** (2026-07-15: a mobile-only false alarm on this
same homepage turned out to be a testing-artifact, not a real bug, but the near-miss is the reason this
checklist now splits every item by viewport rather than leaving mobile implicit). For mobile, use a real
phone if you have one; a resized desktop browser window is the second-best option — just don't rely on
Claude Code's own automated mobile checks alone without a human look, since even a correct-looking
automated pass can miss real-device quirks (Safari/iOS in particular).
- [x] **Why Us** — reviewed, bug found + fixed (see above).
- [x] **Nav** — reviewed 2026-07-15, both desktop and mobile. 4 real bugs found + fixed, 1 flagged as
  content (not code), 1 needs clarification. See "Nav QA — desktop findings" below for detail.
- [x] **Hero** — reviewed 2026-07-15 alongside Nav (mobile confirmed good; desktop search dropdown had
  the same North-Sulawesi-wrap bug as one of the Nav fixes, same fix applied, confirmed by Adinda).
- [x] **Destinations** — reviewed 2026-07-15, both desktop and mobile. 2 real bugs found + fixed (tab
  auto-scroll, desktop drag-scroll) — see "Destinations QA" above. Everything else confirmed good.
- [x] **Latest Articles ("Blog")** — reviewed 2026-07-15, desktop + mobile. Adinda: nothing alarming,
  may flag specific items later if anything comes up. Not in the original checklist (same oversight as
  The Boat) — added retroactively for an accurate record.
- [x] **FAQ** — reviewed 2026-07-15, desktop + mobile. Adinda: looks good, no issues.
- [x] **Testimonials** — reviewed 2026-07-15. Adinda asked for 4 TEST-ONLY dummy cards to be added
  (`TEST_ONLY_REVIEWS` in `Testimonials.tsx`, clearly marked, not real content) specifically to verify
  carousel overflow/arrow behavior with more than 4 cards — confirmed working (8 cards total, arrows
  appear and scroll through correctly, verified via screenshot). **Remove `TEST_ONLY_REVIEWS` before
  launch** — flagged in-file and here so it isn't forgotten.
- [x] **CTA** — reviewed 2026-07-15 (also not in the original checklist, added retroactively). Adinda:
  looks good including the stats/facts.
- [x] **Contact** — reviewed 2026-07-15, desktop + mobile. Adinda: looks good, no issues.
- [x] **Footer** — reviewed 2026-07-15, desktop + mobile. One content addition requested and made: a
  newsletter subscribe blurb ("Subscribe to receive the latest news, itinerary updates, and exclusive
  specials straight to your inbox.") added above the email field, same styling as the "Also known as
  Mari Dive Cruise" line (`text-body-medium text-text-ondark-secondary`) per Adinda's ask. Hardcoded
  placeholder like the rest of the homepage — flagged in-file to become a Sanity `siteSettings`/footer
  field once that schema exists (Tier 4), not meant to stay hardcoded permanently.
- [x] General cross-check (spacing/hover timing/colors vs. the static build): covered implicitly across
  all the above section-by-section reviews, not run as one separate final pass — Adinda's session went
  section-by-section in page order instead, catching the same class of issues along the way.

**Full homepage QA pass now complete** — every section reviewed on both desktop and mobile, 2026-07-15.

### Testimonials refinements, requested after the QA pass closed out (2026-07-15)
Three real requests, all in `Testimonials.tsx`:
- **"Read more" was stretching every card, not just the one clicked.** Root cause: the track's flex
  container had no `align-items` override, so the default `stretch` made every card in the row match the
  tallest sibling's height whenever one expanded. Fixed with `items-start` on the track.
- **Cards should be a uniform height by default, with text truncated (ellipsis) — not each card sized to
  its own natural content length.** Restructured the data model: `excerpt`/`more` were two separate
  strings rendered as two stacked paragraphs — merged into one continuous `text` field per review (this
  was Adinda's explicit correction: "Read more" reveals the *same* paragraph in full, it doesn't append a
  second one). Truncation now via CSS `line-clamp-3` (native multi-line ellipsis, removed the old manual
  "..." endings from the copy) on that single paragraph; `line-clamp-2` added to the title too. Verified:
  card heights uniform at 277px across 7 of 8 cards (one title wraps to a 2nd line, 303px — flagged to
  Adinda as a residual minor non-uniformity, not yet resolved, see below). Confirmed expanding one card
  only grows that card (541px) while every sibling stays at its original height.
- **Wanted the carousel to loop — right arrow at the end goes back to the start, and vice versa.** Not a
  seamless clone-based infinite scroll (cards don't visually continue past the real last/first) — a
  discrete wrap on arrow click, matching what was actually described. First implementation attempt was
  wrong and shipped-then-caught-by-self-verification, not by Adinda: `goTo` originally detected position
  via "which card is closest to the track's left edge," which works fine mid-list but never actually
  reaches "last card" at max scroll once more than one card is visible per row (4 on desktop) — the wrap
  branch never triggered. Rewrote to check `scrollLeft` against the real `scrollWidth - clientWidth` max
  directly, independent of how many cards are visible at once. Verified both directions explicitly:
  clicking "next" at true max scroll (1249) returns to 0; clicking "prev" at 0 goes to true max (1249).
- Bonus (asked in the same request): arrow-click navigation changed from `behavior: 'instant'` to
  `'smooth'` — was the actual cause of the "snappy" feel Adinda flagged.
Verified clean throughout: `tsc --noEmit`, `eslint`.

**CORRECTED AGAIN, same session.** The `min-h` reservation "fix" above created a new, different bug:
Adinda caught it via screenshot — 1-line-title cards now had visible dead space between the title and
body (the reserved-but-unused half of the 2-line box). Two wrong approaches in a row before landing on the
real one — worth being explicit about the actual requirement this time: **no reserved/padded space
anywhere, ever; instead the body's truncation length dynamically compensates for however many lines the
title actually rendered**, so title+body always total the same number of lines (a 1-line title pairs with
a 3-line body, a 2-line title pairs with a 2-line body — both total 4).

This isn't achievable in pure CSS (no way to make one element's `line-clamp` depend on a sibling's
rendered line count without JS). Implemented via real measurement: each title gets a ref; a
`useLayoutEffect` (not `useEffect` — must resolve before paint, or there'd be a visible flash of the wrong
clamp count on load) measures each title's actual rendered height ÷ its computed line-height to get 1 or
2, stores it in state, and the body paragraph's `line-clamp` reads that value (`line-clamp-3` for a
1-line title, `line-clamp-2` for a 2-line one). A `ResizeObserver` on each title re-measures automatically
on any layout change (window resize, breakpoint shift) rather than only once on mount. Title itself is
never clamped or height-reserved — always shows in full, however many lines it needs.

Verified via direct height measurement (not just visual inspection): all 8 cards now exactly 277px, title
and body flush with normal spacing, no gap. Confirmed clean: `tsc --noEmit`, `eslint`.

### No instant expand/collapse — site-wide fix, requested + applied 2026-07-15
Adinda: every transition, including expand/collapse, should be smooth/eased, consistently across the
site — not just wherever it happened to already be built that way. Asked directly whether the earlier
pixel-measurement approach was good practice generally; answered directly (measured-at-runtime via
`getBoundingClientRect()`/`scrollHeight` is fine, hardcoded-in-source like the abandoned `min-h-[3.3rem]`
is not — the failure mode is the hardcoding, not the unit).

**Fixed:**
- **Testimonials "Read more"** — was an instant `-webkit-line-clamp` snap (genuinely can't be
  CSS-transitioned in any browser). Wrapped the paragraph in a container, animating that container's
  `max-height` between the measured clamped/full pixel heights instead — `overflow-hidden` clips the
  instant underlying clamp toggle to whatever height is currently mid-transition, so it reads as smooth.
  Verified via mid-transition sampling (not just before/after): 79px → 130px (mid) → 343px, confirming
  real animation, not a jump.
- **Nav mobile accordions** (Destinations, Resources) — were a plain `hidden` class toggle, no transition
  at all. Fixed with the grid-rows 0fr/1fr trick already proven in `Faq.tsx` (`overflow-hidden` on the
  inner `<ul>`, not the grid wrapper, so its own padding collapses too). Verified via mid-transition
  sampling: 79px mid-point on the way to 701px.
Both verified clean: `tsc --noEmit`, `eslint`.

**NOT yet fixed, flagged rather than silently skipped:** Nav's desktop mega menus (Destinations,
Resources), the mobile menu overlay, and Hero's mobile search takeover all still use an instant
`hidden`/`flex` toggle. These are full show/hide overlays, not simple accordions — fixing them needs real
enter/exit animation state (can't just add a transition class to a `display` toggle), and carries real
regression risk against the outside-click/Escape/focus handling already carefully built and tested this
session. Held for Adinda's explicit go-ahead rather than changed opportunistically alongside the two
lower-risk fixes above. Logged as a new "No instant expand/collapse" rule in `components.md` either way,
so this doesn't get reintroduced on new components even before the overlay cases are addressed.

### Nav QA — desktop findings (2026-07-15)
Confirmed working, no action: scroll-flip timing, all hover states (nav items, "Find a trip", mega-menu
triggers), Destinations mega menu's open/close/crossfade/images, close buttons on both mega menus, Hero
(scroll/zoom checked separately, fine).

**Fixed:**
- **Destinations mega menu "Scroll for more" / "Scroll to top" hints were decorative only**
  (`pointer-events-none`, not real buttons) — real wheel-scroll on the list itself worked fine
  (verified via a dispatched wheel event: `scrollTop` moved 0 → 203 correctly), but the visible
  hint text wasn't clickable, which read as broken. Converted both into real `<button>`s that scroll
  the list to bottom/top respectively — `Nav.tsx`.
- **Nav logo/wordmark didn't visibly do anything when clicked.** Not actually broken — Next.js's
  `<Link>` only resets scroll on an actual route change, and right now `/` is the only route that
  exists, so clicking "home" while already on it was a real no-op. Added an explicit
  scroll-to-top on click to all 4 home links (desktop icon + wordmark, mobile bar, mobile menu
  overlay) so it behaves like "home" regardless — harmless once other routes exist too — `Nav.tsx`.
- **"North Sulawesi" wrapped to 2 lines — two separate instances, both in `Hero.tsx`, not Nav.**
  Mobile instance found first (Hero's mobile destination-search takeover list) — traced via a real
  390px-viewport screenshot before touching code, since the visual pattern in Adinda's first
  screenshot didn't match Nav's own mobile accordion (which stacks name/tagline vertically and
  doesn't wrap). Fixed: destination name now `whitespace-nowrap` (never wraps), tagline gets
  `truncate` (ellipsis) if too long. Adinda then caught the **same bug's desktop twin** — Hero's
  desktop search dropdown (a separate JSX block, same dark-background/horizontal-layout pattern) —
  initially misdiagnosed as the Nav mega menu until Adinda corrected it; confirmed via the actual
  DOM/computed styles before fixing (not just re-reading source), then applied the identical
  `whitespace-nowrap`/`truncate` fix. Confirmed fixed by Adinda on both mobile and desktop.

Verified clean after all fixes: `tsc --noEmit`, `eslint`.

**Flagged, not a code fix:** Resources mega menu copy needs a real pass — Adinda flagged the current
placeholder text as wrong/uncertain, will edit herself. **Needs clarification, not yet actioned:**
Adinda mentioned Resources menu "needs something [inaudible/unclear] for managing" — possibly wanting
it to be CMS/Sanity-editable rather than hardcoded (which the Nav-as-editable-document pattern already
covers as planned Tier-4 work per `mari-project` skill), but asked her to confirm rather than guessing.

### Still open / needs Adinda's action — not blocking, don't lose track of these
- [x] **"English" `Language` document — created 2026-07-15, confirmed visible in Studio by Adinda.**
  Created via `sanity documents create` (CLI already authenticated locally). Doc ID `language-en`,
  `{name: "English", tag: "en", default: true}`.
- [ ] **Follow-up, explicitly deferred to a future session (after the Tier 4 pass, not blocking it):**
  Adinda doesn't yet understand what this document is *for* / what it actually changes on the site — fair,
  since multilingual itself is deferred/future-paid-add-on scope, so this only exists as a baseline entry
  the localization *scaffold* expects, with no visible effect yet. **Confirmed not blocking Tier 4** — it's
  unrelated to the schema types Tier 4 will build. Also flagged: a Studio "information icon" (likely a
  field-description tooltip) doesn't work — not investigated yet, deferred to the same future session.
- [x] **AI-crawler policy — resolved 2026-07-15, no action needed.** Adinda: wants AI crawlers (GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended) allowed, not blocked. Checked `robots.ts` directly: the block
  rules for all 4 are already commented out, and the active `userAgent: '*'` rule already allows `/`
  (only `/api/` and `/studio/` disallowed) — meaning all of them are already allowed today, by default.
  Nothing to change. Still needs the hardcoded `sitemap` URL updated once the production domain is
  confirmed (unrelated to the crawler-policy question).
- [ ] Verify Sanity Studio v6.4's bulk-edit/multi-select capability — asked, not yet researched.
- [ ] Decide whether to ship `llms.txt` (parked until real page URLs exist to list).
- [ ] CORS: add the production Vercel URL once deployed (currently only `localhost:3000` allowlisted).
- [ ] Sanity Studio UI localization (e.g. German for Stefan) — discussed as genuinely possible
  (`@sanity/locale-de-de`), not yet requested to build.
- [ ] Full icon-level accent-color customization (every icon branded, not just hover/active states) —
  discussed, flagged as bigger than a "simple pass," not yet requested.
- [ ] Destinations drag-swipe live-preview polish (see simplification note above).
- [ ] **Why Us card image re-cropping** (especially "Premium Comfort" / `why-us-dining.webp`) — Adinda's
  own task, explicitly deferred to a future **content pass**, not part of the current build-phase to-do
  flow. Don't raise it again until that phase.
- [ ] **Testimonials `TEST_ONLY_REVIEWS` dummy cards** — Adinda has NOT yet confirmed removal (explicitly:
  "I need to still confirm... I have not"). Leave in place until she says otherwise — don't remove
  proactively.
- [ ] **Resources mega menu — scope clarified 2026-07-15, not yet built:** it's not just the menu items
  list (`RESOURCE_LINKS`) that needs to be Sanity-editable — the descriptive copy panel next to it
  (currently hardcoded in `Nav.tsx`: eyebrow "Before You Set Sail", heading "Plan your voyage with
  confidence.", body paragraph) needs its own Sanity fields too. Copy itself stays as-is content-wise for
  now — just needs to become schema-backed instead of hardcoded, as part of the Tier 4 navigation/
  siteSettings schema work.
- [ ] **Nav link default-with-override principle, locked 2026-07-15:** nav items that conceptually
  correspond to a real page (The Boat, Private Charters, About, Schedule & Rates, Resources sub-items,
  etc.) should default-link to that page's real URL once its page type exists (e.g. `boatPage`), without
  an editor needing to manually pick it — the existing `link` object field (`objects/link.ts`, already
  supports internal-reference-or-external-URL) becomes the *override* for when an editor wants something
  different, not the only way to set the link. Not yet implemented — carry into the Tier 4 schema pass,
  needs the corresponding singleton page types to exist first.

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
| 2026-07-15 | Full homepage QA pass (every section, desktop + mobile) + fixes | **~2h** (Adinda's own tracked estimate, rounded up from ~1h48m measured mid-session) | **~1h of this was a false-alarm chase** (see below), not real QA/bug-fixing time. Once resolved, the actual QA pass covered all 11 sections (Nav, Hero, The Boat, Why Us, Destinations, Latest Articles, FAQ, Testimonials, CTA, Contact, Footer) and turned up ~10 real bugs total, all fixed same session. **Calibration takeaway, revises the 2026-07-14 row's own assumption:** that earlier entry expected future sessions to be "meaningfully faster... now that the patterns exist" — true for *coding* patterns, but a full QA pass has its own largely-fixed cost regardless of how established the code conventions are, because QA time is dominated by *discovering* each section's specific bugs, not by applying known patterns. Budget a full single-homepage QA pass at **~2h** even on a well-patterned codebase, not scaled down just because earlier sessions established good conventions. Sub-note: a "barely any content on mobile" report that looked like a WebKit/iOS bug turned out to be `allowedDevOrigins` (dev server blocking LAN-IP requests), unrelated to any browser engine — see `references/troubleshooting.md`'s localhost-vs-LAN-IP check, which exists specifically to prevent this cost recurring. |
| 2026-07-15 (later, same day) | Boat page full schema build + gallery redesign (3 iterations) + content-model changes (Full Rich Text Block extraction, alt-rule correction) + new tracking docs (`_internal/SCHEMA-SPECS.md`/`_internal/CONTENT-STATUS.md`/`_internal/QA-CHECKLIST.md`) | **~4h30m elapsed, but Adinda estimates only ~70% (~3h10m) was active desk time** — ~30% was her doing other things (learning Japanese, cooking) while background tasks (dev server restarts, Sanity scripts) ran, not actively reviewing/responding. | **New calibration point, distinct from the 2026-07-14 row's caution:** elapsed time and active time diverge meaningfully when a session has real background-task latency (dev server restarts, `sanity exec` scripts, Perplexity/web research) — Adinda could step away during those. **Track both going forward**, not just one figure — elapsed matters for calendar/deadline planning, active time matters for comparing actual effort across sessions. This session's scope was large (full boat schema + 3 gallery redesign iterations + several corrected mistakes), so the ~3h10m active figure is the more honest "how much work was this" number. |
| 2026-07-21 | Categorized FAQ built+approved · SubNav complete arc (static rail → floating → compact two-row chrome, 4 design pivots) · scroll-top button · gallery CTA + chevrons + lightbox fullscreen · ~10 side-fixes (nav hover/active, accordion hovers, Android accordion leak, paragraph rule, deck-plan border, brochure rebuild) | **~5h elapsed (from commits 09:14–13:22 + pre-commit recap); Adinda's active figure: 4h15m given at ~12:30, plus ~45m of review after — call it ~4h45–5h active.** | Unusually interactive session — nearly all elapsed was active (live design iteration with screenshots, not background waits). Calibration: interactive design-iteration sessions have elapsed ≈ active, unlike build sessions with script latency. The SubNav went through FOUR rejected/revised designs before landing — budget real iteration time for novel interactive chrome, it is not a build-to-spec task. |
| 2026-07-22 (afternoon) | Komodo page slices 5–7 (Gallery + Itineraries + About the Boats) + JSON-LD prefill + drk-seo pass + ~6 QA rounds live with Adinda | **~3h elapsed** (first dev restart 14:06 → last commit 16:55 + close-out; commits `c8a0a04` 14:14 → `f6c37e5` 16:55). **Active desk time — Adinda's figure, given 2026-07-23 at day level:** full Jul 22 build ≈ **6h elapsed, active ≈ half (~3h)**; pro-rated, this afternoon block ≈ 1.5h active. | Highly interactive like 2026-07-21 (live per-section QA, 3 sections + 2 tools shipped in one block) but WITH script/restart latency (5 clean restarts, ~8 seed scripts) — expect active < elapsed. Two same-day model reversals (numeric order → drag array; overviewBody → excerpt) both cost ~15 min each because content was re-seedable — the vertical-slice bet paying off, worth citing in estimates. **Adinda's own read (2026-07-23): the day shipped ~5 shared + 4 unique components and felt notably faster than the boat page — partly the established patterns, partly zero context-switching (no skill updates, no feedback rounds interleaved). Calibration: protected single-focus build days genuinely run faster; don't price them like interleaved days.** |
| 2026-07-23 (morning) | Private Charters page complete (9 sections, 4 QA rounds) + shared-section singletons (boatsSection, destinationsSection) + Studio reorg + naming glossary + Payment & Booking rename | **~3h elapsed ≈ ~3h active (Adinda's own figure, "we've only worked for about three hours"; highly interactive live-QA session, elapsed ≈ active per the 2026-07-21 calibration).** | Fastest full-page slice yet — one morning for what the boat page took ~2 days: every pattern (hero, overview read-more, accordion, subnav, FAQ composition, seeds) already existed, and 4 live QA rounds replaced the build-then-review cycle. Two seed pitfalls found + hardened same-day: seed-vs-open-draft clobber; CLI raw perspective returning drafts.* ids. Afternoon block planned: FAQ + Testimonials pages. |
| 2026-07-23 (afternoon + terminal session) | About page built + QA 1–2 (`0aee2e6`→`2ee0d98`) + site-wide SEO fixes (JsonLd/BreadcrumbList/sitemap) + charters copy v2 seeded · PARALLEL terminal session: 130-commit GitHub push + push-everything convention + `.vercelignore`/deployment-boundary docs + `_internal/` refactor queued + resume re-cut (`bf09013`→`1a0c4b8`) | **~3h elapsed** (derived: Adinda's day-level figure "worked six hours today" for the full day, minus the morning row's ~3h; no exact active figure given — but **active < elapsed by her own account: she did kanji reviews, cooked, and cleaned the kitchen in between**, the classic background-latency pattern from the 2026-07-15/07-22 rows). Known non-active chunk: **~40 min lost to two background build agents dying silently** (logged in the afternoon checkpoint). | Day scope per Adinda also included **Studio refactoring, SEO passes, and some componentization** alongside the page builds. **Planned vs actual — named sprint deviation:** the slot was FAQ + Testimonials pages; Adinda re-cut to About (her call, logged), so those pages carry to the next sessions, and the Jul 24 staging push needs a morning re-cut. Unplanned-but-chosen: the terminal-session backup/deployment-boundary arc (Adinda-driven, ad-hoc — infra, not sprint work). Unplanned leaks: dead agents ~40 min + the `content/` near-loss recovery (`ad06118`). Calibration: About = second full-page slice at roughly one-block cost, consistent with the morning row's "patterns exist now" read; day total 6h elapsed spread across charters + about + Studio reorg + SEO + componentization + infra — a genuinely multi-workstream day that still felt sustainable (her read: "not so bad"). |
| 2026-07-16 | Session-bookend protocol locked into CLAUDE.md + first full chat-side skills-update round: all 4 skills (drk-website, atlas-website, mari-website, mari-project) ported, installed, verified, archived, handoffs reconciled | **~1h elapsed (Adinda's estimate); active time notably lower** — she finished her kanji reviews in between, so this is an elapsed figure, not active. | **Calibration for skills-update rounds specifically:** a full 4-skill update round is heavily parallelizable with the user's other tasks. The heavy lifting was Claude-side (assembling self-contained payloads, verification greps, install/archive/reconcile), so Adinda's active involvement was mostly the chat-side paste + re-export + Downloads steps — she could step away during payload prep and Claude-side install/verify. Good template for future rounds: elapsed ≈ 1h for 4 skills, active user time a fraction of that. Distinct from the build-session rows above (those need active review/response). |

---

## End-of-session retrospective — 2026-07-15

Requested by Adinda as a standing close-out practice (now also codified as a workflow — see
`drk-website` skill's `references/workflow.md`, "End-of-session retrospective"). This covers *process*
learnings from the session as a whole — the specific bugs/fixes are already logged inline above and in
the shared skill's `components.md`/`troubleshooting.md`; this section is for what doesn't fit as a single
bug-fix entry.

**New learnings, not yet captured elsewhere this session:**

- **Build QA task lists in actual page/DOM order, not whatever order a checklist happens to already be
  in.** This session's original QA checklist (written before today) omitted The Boat and CTA entirely and
  didn't match the real section order — caused real confusion mid-session (skipped The Boat, had to
  correct course into Destinations before Nav/Hero were even confirmed page-order-correct). Before
  starting any future QA pass, verify the task list against `page.tsx`'s actual render order first.
- **When a bug report names a UI pattern that exists in more than one place on the site (e.g.
  "destinations list" — exists in Nav's mega menu AND Hero's search dropdown, both showing name+tagline),
  don't assume which instance from the report alone.** The North Sulawesi desktop-wrap bug was initially
  misdiagnosed as the Nav mega menu; it was actually Hero's search dropdown, a separate component with a
  similar look. Confirm the exact component via the user's actual evidence (screenshot, DOM inspection)
  before fixing anything — this is a *diagnosis* discipline, distinct from the already-documented
  "grep all siblings before calling a fix done" rule, which is about making a fix *complete* once you
  already know what's broken.
- **Any fix that adds a new scroll/focus/animation-triggering effect needs a cold-load re-test, not just
  a re-test of the specific interaction the original bug was about.** The Destinations tab-scroll fix
  (a real, correct fix for its own bug) immediately regressed into a *new* bug — an unconditional scroll
  on page load — because it was only tested against the "click a tab" path, not a fresh page load. Add
  "reload the page cold and confirm nothing moves unexpectedly" as a standing step after any interactive
  fix involving `scrollIntoView`/`scrollTo`/`.focus()`.
- **CDP (Chrome DevTools Protocol) driven via Python + `websockets`, with real device-metrics emulation
  and API monkey-patching, is a proven, fast, reliable diagnostic toolkit for this kind of work** — used
  successfully this session for real mobile-viewport testing, wheel/drag-event simulation, and capturing
  an exact stack trace for an otherwise-invisible scroll bug. Worth reaching for early once a bug survives
  one round of source-reading, rather than continuing to read/theorize (see
  `troubleshooting.md`'s "Unexplained scroll jumps" for the concrete technique). This supersedes the
  iframe-harness approach as the default automated-testing method for anything beyond a static screenshot.
- **For future page builds (Tier 4 onward): treat `components.md`'s "Bake in from the start" section as a
  pre-build checklist, not just a QA reference.** Every pattern in it was found reactively during QA this
  session; building new pages against that checklist *while writing* the component, not after, is the
  actual lever for the "fewer bugs, faster" outcome Adinda asked about — QA existing to catch these has a
  real, roughly fixed cost per pass (see the time-log row above), so preventing them at build time is
  cheaper than catching them later.
- **Consider QA-ing each section shortly after building it, rather than batching all sections into one
  large QA pass at the end**, for Tier 4 pages onward. This session's single ~2h pass across 11 sections
  found bugs that would have been cheaper to catch and fix individually, closer to when each section was
  built — a recommendation for how to sequence future page-building work, not a retroactive complaint
  about this session.

---

## 2026-07-14 — Repo scaffolded, stack verified, 3 open questions resolved

Full detail lives in `CLAUDE.md` (stack table, Next 16 convention deltas, resolved findings) — not
duplicated here. Summary: Next.js 16.2.10 + Sanity v6.4.0 confirmed correct (not the 15/v5 the `drk-website`
skill still says); `cacheComponents` decided OFF for launch; embedded Studio confirmed to need no custom
auth (Sanity's own SSO+CORS); localization plugin compatibility only partially verified, smoke-test before
relying on it. All queued for the next `drk-website` skill-update round in
`_internal/handoff/drk-website.md` (moved here from the old repo 2026-07-14 — this is now the single live copy).

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
