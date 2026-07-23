# _PAGE-SPECS.md — Adinda's section-by-section specs for the remaining pages (dictated 2026-07-23)

**Skill propagation (Adinda, same day): the non-Mari-specific halves are QUEUED in the handoff
outbox** — About / Schedule & Rates / Testimonials / shared-section-singleton pattern →
`_handoff/atlas-website.md`; FAQ page / blog list / blog post / simple page (DRK-standard) →
`_handoff/drk-website.md`. This file keeps the Mari build detail + open questions.

Captured verbatim-in-spirit from her dictation; ⚠️ marks Claude's open questions to resolve at each
page's build, not before. **Build order per Adinda: About FIRST, then Schedule & Rates.** The rest
follow. BREADCRUMBS: always present on every page EXCEPT the blog post page.

---

## #1 ABOUT (NEXT UP)
- **Hero** — same SubNav structure, IDENTICAL to the Private Charters hero in structure, but NO
  Download Brochure. Hero image: pulls ONE image from the boat gallery. ⚠️ "pulls one" = editor
  picks via a reference/field, or literally reuse a gallery asset? Assume an imageWithAlt field
  seeded from a gallery asset; confirm at build.
- **Overview** — exact same layout as Private Charters (eyebrow + centered h2 + tier-3 rich body,
  Read More).
- **Why Us** — the shared component already on the homepage, verbatim.
- **Crew section** — NEW BUILD, not mocked up. "Pretty simple and straightforward" — crewMember
  docs exist (Shared Components). ⚠️ Layout to propose (cards w/ photo+name+role?); show her before
  polishing.
- **CTA** — shared component.
- **Testimonials** — same as homepage; COMPONENTIZE if not already. Studio target shape:
  **Testimonials (Secondary Pages) → Testimonials Page + TestimonialsSection as separate things** —
  i.e. the section chrome becomes a shared-section singleton (like boatsSection), distinct from the
  testimonialsPage doc.
- **Contact form** — shared, same as everywhere. **Footer.**

## #2 SCHEDULE & RATES
- **Hero** — NO image at all, NO subnav. (Simple title hero.)
- **INSEANQ embed** (the scheduled-trips widget; the scheduleRates doc/type exists, unbuilt page).
- **FAQ section** — categories: Payment & Booking, What's Included, Private Charters — "identical
  to Private Charters essentially" (⚠️ = add showOnSchedulePage toggle, or reuse the charters
  toggle set? Decide at build — likely its own toggle, the triplet becomes a quadruplet).
- **Contact form. Footer.**

## #3 TESTIMONIALS PAGE
- **Hero** — simple, no subnav.
- **Body** — if the TripAdvisor widget is NOT present: testimonials in a GRID, not carousel.
  Desktop 4 cards × 2 rows; "Read More" reveals 2 more rows at a time until exhausted. Mobile: also
  8 cards by default + same read-more behavior. (⚠️ TripAdvisor widget presence = the existing
  tripAdvisorEmbedCode field / Stefan's social add-on — grid is the launch state.)
- **CTA. Contact. Footer.**

## #4 FAQ PAGE
- **Hero** — simple, no subnav. Mentions that destination-specific FAQs live on each destination
  page (as a "sub tag"/sub-line). Plus a **SEARCH BAR** — same design as the homepage "Where would
  you like to dive" input (componentize that input), but auto-filtering as you type.
- **Body** — categories on the LEFT as filters, including an **"All"** category; while the search
  input is active the filter defaults to All. Layout = the categorized FAQ we have, but **LIGHT
  theme** (like the boat page's Specifications), not navy.
- **CTA. Contact form. Footer.**

## #5 / #8 SIMPLE PAGE (generic `page` type — first instances: Terms & Conditions, Onboard Prices)
- Simple hero (title only) → Body (full rich text editor) → CTA → Contact form → Footer.

## #6 BLOG POSTS LIST
- Simple hero (title) + short description.
- Filter section: search bar + categories + destinations.
- **Featured articles** (if any): 3 cards, carousel on mobile.
- **Latest articles**: grid of 3-card rows (same card as homepage); 2 rows loaded by default +
  "show more" (same read-more behavior as testimonials grid).
- **CTA. Contact. Footer.**

## #7 BLOG POST PAGE (NO breadcrumbs here)
- **Slimmer hero**, featured/cover image as bg, containing:
  (a) category + destination separated by a diamond (✦?) when destination present — both CLICKABLE
  as filters (link back to the filtered list);
  (b) post title;
  (c) date + author, separated by a (⚠️ separator glyph cut off in dictation — assume the same
  diamond/dot; confirm).
- **Content section, 3 columns desktop**:
  - LEFT: table of contents auto-pulled from the H2s, scroll-spying. ⚠️ Design to propose within
    conventions; text not too big.
  - MIDDLE: body (full rich text) — inline images join ONE combined lightbox gallery (the
    rich-text-gallery behavior, same as the queued one-gallery-per-field change).
  - RIGHT (fixed, doesn't scroll): social share buttons (standard set incl. WhatsApp) · Author bio ·
    Newsletter subscribe ("Be the first to hear our latest news and exclusive discounts").
- **Recommended articles**: latest of the same category; if the post has a destination, latest
  matching that destination first; fallback = latest overall.
- **CTA. Contact. Footer.**

---

## Cross-cutting notes from the same dictation
- **JSON-LD prefill: wire for EVERY page type**, not just destination/charters.
- **Strong-reference deletion blocking** (curation arrays): parked for review WITH SERGE — is
  Studio's "can't delete, referenced by…" dialog clear enough for a non-dev? Possible fixes if not:
  (a) keep strong refs (status quo — Studio names the referencing doc, integrity preserved);
  (b) switch curation arrays to weak refs — deletion always succeeds, the section just drops the
  card (null-guards already in place), but an editor gets no warning the carousel changed;
  (c) strong refs + an owner-handbook entry teaching the dialog (done, cheapest). Logged in
  _QA-CHECKLIST.md.
