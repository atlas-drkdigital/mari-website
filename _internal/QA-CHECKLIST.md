# _internal/QA-CHECKLIST.md — for external QA (someone other than Adinda/Claude)

Companion to `_internal/SCHEMA-SPECS.md` (field approval) and `_internal/CONTENT-STATUS.md` (real vs. placeholder
content). This one is for a human doing an actual click-through review of the built site/Studio —
things worth a second pair of eyes, especially open design decisions that don't have a single
obviously-correct answer yet.

Status: 🔲 just started (2026-07-15) — one item so far, add to this as open decisions come up
during the build, don't wait until the end to backfill it.

---

## Open decisions to verify/weigh in on

- [ ] **ADINDA + SERGE — is Studio's delete-blocking dialog clear enough? (2026-07-23, parked by
      Adinda.)** The section curation lists (Destinations Section, Boats Section, destination
      itineraries) use STRONG references: deleting a destination/boat/itinerary that's still in a
      list is blocked, and Studio shows which document references it. Review with Serge whether
      that dialog is understandable for a non-dev. Fix options if not: weak refs (delete always
      works, card silently drops — null-guards already handle it) vs. keep strong + handbook
      education (entry added to _internal/OWNER-HANDBOOK.md). Detail: _internal/PAGE-SPECS.md cross-cutting notes.

- [x] **RESOLVED 2026-07-23 — FAQ category renamed "Booking Terms" → "Payment & Booking".** Adinda:
      the old title was a test value. Renamed in faqGeneral (safe everywhere — sharing toggles are
      _key-based). All FaqCategorized pages (destination/boat/charters) now show the new name.

- [ ] **ADINDA — personally verify the Private Charters URL (`/private-charters`) — 2026-07-23.** The
      route is live at `/private-charters` and stays cheaply modifiable (a route-folder rename + the
      2 Nav links; no Sanity change — the singleton has no slug field). Reasoning behind the current
      choice, so the verify doesn't need re-research: (a) it matches `mari-website`'s url-structure.md,
      the recorded slug reference; (b) the long `/private-liveaboard-charter-indonesia` from 2026-07-15
      was a transcription artifact, and keyword-stuffed slugs buy nothing — keywords in the URL are a
      weak ranking signal (same conclusion as the `/boats/mari` decision in MANAGER.md); the title/H1
      already carry "Private Diving & Snorkeling Liveaboard Charters in Indonesia" verbatim, which is
      what actually ranks; (c) short + readable + matches the nav label wins for sharing/recall. One
      open sub-question already in the skill's own list: `/private-charters` vs `/charters` (Serge).
      **Decide before launch — a post-launch change costs a redirect + SEO equity.**

- [ ] **ADINDA — confirm the recovered boat `slug` is `mari` (i.e. `/boat/mari`) — 2026-07-17.** It didn't
      exist on `boat-mari` until it was recovered from an orphaned draft that morning, so its value is
      simply whatever was typed before the type rename; it has never been a deliberate decision. Cheap now,
      a redirect later. **Do this before the boat route ships.** Detail: `_internal/CONTENT-STATUS.md`.
      _(The 4 recovered gallery images were originally listed here as "needs review" — that was wrong and
      the row is gone. They're smoke-test residue to be REPLACED, not curated content to be reviewed; see
      `_internal/CONTENT-STATUS.md`'s `gallery` row. Not a QA judgement call.)_

- [ ] **Auto-hide guards — verified in code, worth one regression pass at QA Pass 1 (2026-07-17).** Why Us,
      Latest Articles, FAQ and Testimonials hide when their collection is empty; Destinations and CTA
      already did. **Already tested end-to-end** by emptying the dataset and confirming each section
      vanished while Hero / The Boat / Destinations / Contact still rendered — so this is a regression
      check, not an open question. FAQ's empty test is **0 FEATURED questions**, not 0 questions. To
      re-test: empty the relevant collection in Studio and reload. Note Hero / The Boat / Contact
      deliberately have **no** guard — they're driven by singleton fields, not collections, so there's
      nothing to count (and a liveaboard site with no boat isn't a site with a hidden section).

- [ ] **⭐ ADINDA TO REVIEW — the FAQ v2 restructure. NOW BUILT + READY (2026-07-16).** v2 shipped: one
      "General FAQ" (Payment & Booking / What's Included / Others), inline `faqSections` on destination
      (Diving/Travel/Others) + boat (General Information), `isFeatured` driving the homepage, `faq` type
      retired. Verified green (tsc/eslint/schema-validate/GROQ query-back/clean restart).
      **What to look at — in Studio (and check the homepage in a MOBILE viewport too, not just desktop):**
      - Does inline-array editing feel intuitive with real content in it?
      - Is it obvious where each question is edited (page-local vs. shared General FAQ)? The signpost notes
        on destination/boat are the thing carrying that — do they actually land?
      - Does "Feature on homepage" behave as expected? 8 are featured; the homepage shows them General-first
        then boat. Confirm the toggle is correctly ABSENT on destinations (they don't feed the homepage).
      - Is the sidebar down to one clear "General FAQ"?
      - Are the seeded category titles the right starting set? (They're editable defaults, not locked.)

- [ ] **FAQ answer content — needs a real read-through (not a schema question).** The answers were re-seeded
      answer-first from `mari-core`. Two specific things: (a) the **commercial figures** (deposit,
      cancellation, park/fuel fees, single supplement) come from a source that marks itself non-evergreen and
      was last verified 2026-06-09 — see the ⚠️ block in `_internal/CONTENT-STATUS.md`; verify with Serge before
      launch. (b) Voice check: does it sound like Mari?

- [ ] **Komodo's "What is included in a Mari trip?" is a duplicate — decide in the destination slice.** It
      was migrated into Komodo's *Others* per the locked brief, but the destination page will *pull* What's
      Included from the General FAQ, so it will render twice once that composition exists. Deleting it is a
      one-item edit. Flagged rather than silently dropped, since the brief explicitly asked for it.

- [ ] **Eyebrow toggle placement** — every section with an eyebrow (Overview, Cabins, Gallery,
      Specifications, on `boatPage`) currently has its own `showXEyebrow` toggle, shown/hidden
      independently per section. Open question: should there be ONE global toggle controlling all
      eyebrows on a page at once instead of per-section toggles? Pending Serge's input. Check: does
      the current per-section approach feel right once there's real content in the form, or does it
      feel repetitive/fiddly?
- [ ] **Gallery bulk upload — native drag works; click-to-upload button needs a custom component
      (researched 2026-07-15).** Findings: dragging MANY files at once onto the images array DOES work
      natively (this is our whole design) — confirm it with real files in Studio. BUT the native "Add
      item" button's file dialog only selects **one file at a time**; there is no native
      click-to-browse **multi-select** upload button in v6.4 (open Sanity feature requests: GitHub
      issues #1547, #4483). Adinda specifically wants a distinct multi-select "Upload" button — that
      requires a **custom array-input component** (real build work, not a config flag). Decision
      needed: build the custom upload button, or accept drag-and-drop-only for now.
- [ ] **Social image alt** — `seo.ts`'s `ogImage`/`twitterImage` (and any siteSettings social image)
      are bare `type: 'image'` with no alt field, a technical exception to the DRK "every image has an
      editable alt" rule. Social meta images use `og:image:alt` separately, so it's a judgment call.
      Decide whether to add an alt field there or leave as-is.
- [ ] **FAQ scope → category UX (ask Serge specifically, flagged by Adinda 2026-07-16)** — the `faq` type
      has a `scope` radio (General / Destination-specific / Boat-specific) that conditionally swaps which
      category field + reference is shown: `generalCategory` (5-value hub set) when general/boat,
      `destinationCategory` (Diving / Traveling / General Information) when destination. Question for Serge:
      is this one-type-with-conditional-fields intuitive to fill, or confusing enough that a separate
      "destination FAQ" document type would be clearer? Adinda wants his read before locking it — the
      current single-type approach avoids duplicated question/answer structure, which is the tradeoff.
- [ ] 🔴 **PRE-LAUNCH BLOCKER — remove `SITE_NOINDEX=1` from the Vercel project env vars when the real
      domain goes live (added 2026-07-24).** The flag makes the whole site noindex + robots disallow-all
      (staging privacy: the staging production alias is public — Vercel's free protection only covers
      preview URLs). A launched site still carrying this flag is invisible to every search engine.
      Verify at launch: `curl -s https://<domain>/robots.txt` must show the ALLOW policy, and any page's
      HTML must have NO `noindex` robots meta.
