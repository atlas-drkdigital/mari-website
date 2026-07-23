# ▶ RESUME HERE — checkpoint 2026-07-23 midday (PRIVATE CHARTERS COMPLETE + shared sections)

**New session? Read THIS file, then MANAGER.md's 2026-07-23 checkpoint. Don't re-derive.**

## One-line state
`/private-charters` is **feature-complete, per-section QA'd (4 live rounds), and committed**:
Hero, Overview (tier-3 body + inline zoomable map), Benefits (image-driven accordion), shared
Destinations/Boats/Availability-embed/FAQ/Contact. Plus: **shared-section singletons** are live
(`boatsSection` in the Boats folder, `destinationsSection` in the Destinations folder — drag-curated
carousel), Studio reorganized into Main/Secondary Pages bands, FAQ category renamed
"Payment & Booking". All three pages verified 200.

## ⚠️ STANDING STATE
- Dev server running on :3000 (LAN 192.168.0.101 — Sanity CORS for LAN still needs Adinda's
  one-click, see CLAUDE.md real-device section).
- **Adinda has NOT yet re-checked in Studio:** the Destinations Section doc (new), Boats Section's
  two-eyebrow split, Summary in Basic Info (destination + boat). First thing on return.
- Two seed lessons are now LAW (in MANAGER checkpoint): (1) patches must hit `drafts.*` too when a
  draft exists (publish clobbers seeds otherwise — ate the SEO prefill once); (2) CLI client is
  RAW perspective — seed queries that build references MUST filter `!(_id in path("drafts.**"))`
  (draft refs deref to null members and 500 pages — happened live, fixed + hardened).

## ▶ NEXT — **ORDER RE-CUT BY ADINDA 2026-07-23 midday: full page specs dictated → `_PAGE-SPECS.md`**
1. **ABOUT page** (her explicit "next", replacing the FAQ/Testimonials slot): PC-style hero (no
   brochure) + PC-style overview + shared WhyUs/CTA/Testimonials/Contact + NEW crew section
   (no mockup — propose a simple layout). Spec: _PAGE-SPECS.md #1.
2. **Schedule & Rates** (#2): imageless no-subnav hero + INSEANQ + FAQ (P&B/What's Included/
   Private Charters) + contact.
3. Then per specs: Testimonials page (#3 grid+read-more), FAQ page (#4 light theme + search),
   simple pages T&C/Onboard Prices (#5/#8), blog list (#6), blog post (#7 — 3-col, TOC, share rail).
4. **JSON-LD prefill: wire for EVERY page type** (Adinda's call — JsonLdPrefillInput everywhere the
   seo object appears).
5. **Rich-text lightbox: one gallery per field** — now also REQUIRED by blog post spec (#7). ~30
   min; test material already in the charters overview body (2 images).
6. Wording reviews deferred: availability intro + "Check Availability" eyebrow.
7. Drk-seo verify pass on /private-charters: ✅ RUN (h1 span-join fixed; findings logged in the
   2cdd137 commit message). Production CWV check waits for the staging build.
8. **Staging-push re-cut still due** — say it out loud, don't absorb.
9. Parked for Serge review: strong-ref delete-blocking clarity (_QA-CHECKLIST.md).

## Open items / carried decisions
- `destination.order` numeric field: superseded by destinationsSection's drag array for the
  CAROUSEL, but still sorts the all-lists (hero search, contact dropdown) — retirement queued.
- Benefits photos: #2/#3 are Komodo placeholders 🔴; all four need real matches (image pass).
- Overview body below the map = Claude demo filler (content pass). SEO title/desc = drafts 🟡.
- Serge: Komodo feedback round, itinerary seasons 🔴, /private-charters vs /charters.
- boat-nusa-test deletion — awaits Adinda's boats-stepper approval.
- OG fields empty in Studio = CORRECT (overrides; page serves og:* via fallback chain).
- Skill round backlog (~1,500 lines in _handoff/) — deferred by Adinda, unblocked whenever.
- Main is ~130 commits ahead of origin; pushing is Adinda's call (private-repo rule).

## 📋 Ready-to-paste kickoff prompt
> Continuing Mari. Read `_RESUME.md` first. Private Charters is complete + committed; dev server
> should be running (don't clean-restart unless schema changed). First: Adinda reviews in Studio —
> Destinations Section, Boats Section eyebrows, Summary field placement. Then the afternoon slot:
> FAQ page + Testimonials page, followed by the drk-seo pass + JSON-LD prefill on /private-charters
> and the rich-text lightbox gallery tweak. Model note: Fable trial ongoing (memory:
> user-fable-model-test).

## Session log
2026-07-23 (morning, ~3h active): Private Charters full slice + 4 QA rounds + boatsSection/
destinationsSection singletons + Studio reorg + glossary + Payment & Booking rename. Commits:
"Private Charters page complete..." + the wrap-up commit after. Full detail: MANAGER.md 2026-07-23.
