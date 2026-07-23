# Next session handoff — section visibility (auto-hide + toggles) + theme tweak

> ✅ **FAQ restructure is DONE + committed (`0094bdb`, 2026-07-16)** — see `_NEXT-SESSION-faq.md`, now the
> record rather than a brief. **THIS is the next task**, then the destination page slice.
>
> ⚠️ **Both quick fixes in section (1d) below are ALREADY DONE — SKIP THEM.** `whyUsItems` is now
> `Rule.min(1)` with an updated description, and the SEO double-nesting is fixed site-wide across 8 types
> (dropped the single-field `seoFs` fieldset + explicit `title: 'SEO'` on the field). The convention nuance
> that came out of it is recorded in CLAUDE.md's "Studio form section headers" section.
>
> ⚠️ **The FAQ auto-hide rule in (1a) needs re-reading against what shipped.** "Hide if 0 questions" still
> holds, but the homepage FAQ no longer shows "the first N general questions" — it shows the questions
> toggled **"Feature on homepage"** across the General FAQ + boats. So the empty check is "0 **featured**
> questions," not "0 questions." A site with plenty of FAQs and nothing featured correctly renders nothing.

_Written 2026-07-16, end of a long session. Everything is committed (latest commits on `main`). Start a FRESH
conversation + terminal._

## First 3 things to do
1. **Load skills:** `mari-project`, `drk-website`, `atlas-website`, `mari-core`, `mari-website`. Read
   `CLAUDE.md`, the top of `MANAGER.md` (the "homepage FULL-WIRE + FAQ" checkpoint), and `_internal/handoff/*.md`.
   **NOTE:** Adinda updated the `mari-project` skill and will drop it in Downloads — install it, review it
   against the current repo, and flag anything that needs updating (she'll re-update + you reinstall).
2. **Restart the dev server CLEAN before reviewing anything** (locked rule): kill `:3000`, `rm -rf .next`,
   `npm run dev`, curl `/studio` for 200, then hard-reload the browser.
3. **Verify** with a quick GROQ query-back before telling Adinda to review.

## The task — do (1) + (2) in ONE pass (Adinda's call). (3) is a separate later session.

### (1) Section visibility — two mechanisms that COMPOSE (show only if toggle ON **and** has content)
**a. Auto-hide when empty** (graceful, automatic — extends the full-wire "degrade gracefully" rule):
- **Latest Articles** → hide if 0 blog posts.
- **FAQ** → hide if 0 questions.
- **Testimonials** → hide if 0.
- **Why Us** → hide if 0 items (add the guard).
- Destinations ✓ and CTA ✓ already `return null` when empty.

**b. Manual on/off toggle per section** — `showX` boolean on `homePage` (same toggle-to-reveal pattern as
the eyebrow toggles), `page.tsx` respects it. **Confirmed section set (Adinda):** The Boat, Why Us,
Destinations, Latest Articles, FAQ, Testimonials, CTA, Contact. (Hero always on — confirm.) Adinda's
"Destinations and the boat need to be there" = they get toggles too (not that they're forced-on).
Put these toggles in a findable place — likely a "Sections" tab or inline per-section booleans; decide
per the intuitive-CMS principle.

**c. FAQ section MIN-HEIGHT when shown** — Adinda wants ~one viewport minus the sticky nav (~70px), matching
the mockup. Use a `dvh` value (NOT pixels), same pattern as Destinations:
`min-h-[max(720px,calc(100dvh-70px))]` (current FAQ is `lg:min-h-[600px]`). Cross-check the exact intended
height against Figma node **778-8603**
(https://www.figma.com/design/TKjkHpjqPVn5yL5TnpuWAt/MARI-Website-1.0?node-id=778-8603).

**d. Quick fixes — ✅ BOTH DONE in the FAQ session (`0094bdb`). Nothing to do here.**
- ~~`homePage.whyUsItems` `Rule.min(2)` → `min(1)`~~ — done, description updated to "(1 to 4)".
- ~~SEO double-nesting~~ — done site-wide across blogPost/boat/destination/faqGeneral/homePage/itinerary/
  page/scheduleRates.

### (2) Theme tweak (frontend `globals.css` — needs Adinda's visual review)
- **Primary background too white → try `beige/100`** as the primary page bg token.
- **Accent color must stay readable against BOTH light and dark font** — a grey/muted caption was unreadable
  on the current accent. Fix at the token level so caption (grey) + title (white/dark) both keep contrast.
  Verify the exact surface from Adinda's screenshot (looked like a list/badge row).

## Already-confirmed decisions (don't re-litigate)
- **Homepage FAQ "Read More" = a LINK to the FAQ page**, NOT an inline expand (built; inline-expand scratched).
- **"Destination slice" = the destination PAGE build** (frontend + full schema + content), a separate later
  session. Its FAQ work is now only the **render** side: composing this destination's own categories with the
  shared ones pulled from the General FAQ, plus the stable-key identity for that pull. *(The schema half —
  inline arrays on destination, retiring the `faq` type — is already DONE as of `0094bdb`.)*
- **FAQ v2 shipped** (`0094bdb`): one `faqSection` object used inline by General FAQ + destination + boat;
  `faq` type retired; homepage shows questions toggled **"Feature on homepage"** across General + boat (NOT
  auto-first-N any more). Adinda has this on her review list (`_internal/QA-CHECKLIST.md`) — **still unreviewed**.

## After this task, in order (MANAGER.md's ACTIVE QUEUE is authoritative — read it)
1. **`boatDefaults` singleton (~20–30 min) — BEFORE the boat page slice, not after.** Decided long ago
   (CLAUDE.md names "Boats (pending build)"), never scheduled, raised again by Adinda 2026-07-16. The boat
   frontend doesn't exist yet, so moving the shared eyebrows/headings is free today and a rewire tomorrow.
   Full scope + the two open decisions → MANAGER.md's "📌 `boatDefaults`" note.
2. **Boat page slice** (3–4h), then the destination slice, then global chrome.

⚠️ The `mari-project` skill's sprint has **Jul 17 = Boat + Destination start** and knows about **neither**
this task nor `boatDefaults`. Realistically Jul 17 = theme + boatDefaults + boat page (~6h), and the
destination start slips. Flag that to Adinda rather than absorbing it.

## Also pending (not this task)
- Skills backlog: Adinda will run the drk-wide skills-update round soon (queued items in
  `_internal/handoff/drk-website.md`: CMS-as-product-surface, full-wire-per-slice, nav/footer incremental, workflow
  retro). Don't need to drive it unless she asks.
- Global-chrome slice (Nav/Footer/newsletter/contact-details/copyright/"By Atlas"→`atlas@drkdigital.studio`).
- Interim destination fields (`seasonNights`/`excerpt`/`order`) reconcile in the destination slice.

## Model guidance (session-bookend protocol)
Adinda is on **Opus 4.8 (1M)**. Toggles + auto-hide = mechanical, could downshift to Sonnet-high; the theme
accent/contrast call has a small judgment element (Opus or careful Sonnet-high). State the model + est. hours
+ recommended model when proposing.

## Do NOT redo
Homepage full-wire, FAQ remodel, contact→siteSettings, 9 destination docs, draft testimonials — all done +
committed (`7825576`). Trackers updated (`_internal/CONTENT-STATUS.md`, `_internal/SCHEMA-SPECS.md`, `_internal/QA-CHECKLIST.md`, `_internal/POLISH-BACKLOG.md`).
