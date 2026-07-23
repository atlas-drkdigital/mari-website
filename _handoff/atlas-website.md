# → atlas-website skill

New destination (2026-07-07) — `atlas-website` was just installed, so this file starts now, per CLAUDE.md's
own already-written convention for it. Different scope from `drk-website.md`: that file is generic
DRK/Tailwind/Next.js patterns; this one is liveaboard/dive-tourism **page structure and content shape** —
what pages a liveaboard site needs and what goes on each, which is exactly what `atlas-website`'s own
`references/pages.md` and `references/page-structure.md` cover. Mari is the pilot project for this skill, so
its own `MANAGER.md` explicitly has an open to-do: "Validate page structure against Mari build — update
after Mari Next.js build sprint." This file is the running source for that validation.

**Habit, not a batch job:** the moment a page-level or content-shape decision emerges on Mari that's
liveaboard-specific (not just generic DRK/Tailwind), append it here immediately.

---

## QUEUED 2026-07-20 — Scroll-reveal is OPT-IN, so new sections silently ship with no animation

**Status: staged, NOT yet merged into the skill.** Adinda's explicit ask this session — file it here so
local notes and the skill can't disagree once the skill round runs.

**The bug pattern.** `ScrollReveal.tsx` animates only elements that declare a `data-reveal` attribute
(`document.querySelectorAll('[data-reveal]')`). Nothing applies it globally. So a newly-built section has
**no fade at all**, there is no error, no warning, and nothing fails — it just looks slightly dead next to
every other section. On Mari this shipped on **two** boat-page sections (Cabins and Gallery) and was only
caught when Adinda noticed the page felt different from the homepage, days later.

**Why it belongs in `atlas-website` and not `drk-website`:** the *mechanism* (an IntersectionObserver +
an attribute) is generic, but the **convention that every section animates in** is a look-and-feel rule of
these liveaboard sites, and the variant vocabulary below is specific to how these pages are composed.

**The variant vocabulary — three, not arbitrary per-design** (Mari's `globals.css`):
| Attribute | Behaviour | Applied to |
|---|---|---|
| `data-reveal` | fade + rise from below | images, cards, media blocks |
| `data-reveal="left"` | fade + slide in from the left | text columns, body copy |
| `data-reveal="none"` | fade only, no movement | chrome (nav on load) |

Adinda's framing: *"I want every new section to have a fade going forward — similar to the homepage"*, and
she correctly anticipated that the exact behaviour varies by design. It does — but from this fixed set.

**The rule to write into the skill:** every section gets a reveal; pick the variant by what the element IS
(media → default, copy → `left`, chrome → `none`), not by taste. **Do NOT leave it off.**

**Open — the real fix is structural, and is NOT yet decided.** A checklist item still relies on memory,
which is exactly what failed here twice. The candidate is a wrapper/`<Section>` component that applies the
default reveal unless overridden, so *forgetting* is impossible rather than merely discouraged. Flagged for
the componentization block (queued in Mari's MANAGER.md, gated on the boat page finishing). **Don't merge
this into the skill as "solved" — merge it as a rule plus a known-weak enforcement.**

**Generalisable principle worth carrying with it:** an opt-in visual convention with no failure mode is
indistinguishable from an unfinished one. Same shape as the SEO `generateMetadata` gap logged the same day
in `drk-website.md` — a field an editor fills that nothing renders, and a class of bug where *nothing
breaks*, so no test, typecheck, or lint can catch it. Both were found by a human looking at the page.

---

## Pending

_Only genuinely-open items remain — all three are waiting on **Adinda's decision**, not on a merge. They were
pasted into the 2026-07-17 round still marked open (her explicit call), and the installed skill correctly
still flags all three as open. **Do NOT resolve these in a skill-update round** — they need a decision first._

### [HELD] Sanity schema-patterns reference category — not ready to create until validated
A new reference category for reusable Atlas-wide **schema field specs** (multi-boat nav behavior, the shared
gallery-image model, the "every heading/eyebrow editable except a closed exception list" pattern) is coming,
but is being validated component-by-component on the Mari build first, tracked in that repo's
`_SCHEMA-SPECS.md` (🟡 draft / 🟢 approved / 🔵 validated-at-scale). Deliberately NOT created in the
2026-07-16 or 2026-07-17 update passes — the chat session was told to hold it both times. Confirmed still
held in the 2026-07-17 install (no `references/schema-patterns/` folder exists).
- [ ] **When Mari's boat fields reach 🔵 validated in `_SCHEMA-SPECS.md`:** create
      `references/schema-patterns/` (new folder) starting with `boat-page.md`; port the validated field list
      + the genuinely-reusable reasoning (multi-boat nav: single boat → direct link, 2+ → mega-menu dropdown;
      the shared gallery-image model reused per-entity via a `belongsTo`-style reference, not duplicate types
      per entity; the closed editability-exception-list pattern). Leave Mari's own field values/copy out.

### [UNCONFIRMED] Dedicated `/destinations` index/listing page — needs Adinda's go-ahead
A dedicated `/destinations` index/listing page for SEO (separate from the homepage's Destinations preview)
— an idea, NOT confirmed. Doesn't exist in Mari's current URL structure. The AllDestinations block (built
for the FAQ destination-redirect note) would supply most of its content. **Do not build speculatively** —
confirm with Adinda first. Left out of the 2026-07-16 and 2026-07-17 updates by design; add to `pages.md`
only once confirmed. Confirmed still flagged "⚠️ open question, NOT confirmed" in the 2026-07-17 install.

### [OPEN DECISION] Homepage section order — flagged in the skill, decision still owed
The 2026-07-16 update added an "Open reconciliation" note to `references/page-structure/homepage.md` rather
than overwriting the existing order. The completed-build order
(`Nav → Hero → The Boat → Why Us → Destinations → Latest Articles → FAQ → Testimonials → CTA → Contact →
Footer`) needs a decision: is it the new Atlas default, or a per-client variant? Decide before the next
liveaboard homepage build, then update the file to match. Confirmed still flagged open in the 2026-07-17
install.

---

## Done — reconciled 2026-07-17 against the installed atlas-website skill

Adinda updated the chat-side skill from `_payload/atlas-website.md`, re-exported, and Claude installed it.
**Every item below was verified against the extracted package BEFORE install and spot-checked after** — for
the two supersessions, verified both that the new content is present AND that the old content is gone (not
merely that the file changed).

- [x] **FAQ two-taxonomy split RETIRED** → `faq.md` rewritten around the reusable `faqSection` object (inline
      on the General FAQ singleton, each destination, each boat; no `faq` document type at all; composition at
      render, not taxonomy at storage). *Verified:* `faqSection` present ×9; the old model survives only as an
      explicit supersession note (*"The `faq` document type has been retired entirely… Do not implement it"*),
      and the old GROQ snippets written against it are removed. Category titles recorded as editor-editable
      `initialValue` defaults, not a locked taxonomy. The stable-identity problem for the cross-page pull was
      correctly left deferred — not solved speculatively.
- [x] **Testimonials page-vs-component split** → `testimonials.md` gained a "Page-vs-component split" section:
      `testimonialsPage` singleton in Main Page Content, `testimonial` docs stay Shared Components. The
      reusable test landed with it: *inline it when the content belongs to one page; keep it a referenced
      component when several surfaces genuinely consume the same record.* Audit blind spot carried over as its
      own section ("what's ABSENT, not just what's misplaced").
- [x] **TripAdvisor page-level section + fallback** (Adinda, settled 2026-07-17) → `testimonials.md`,
      "TripAdvisor section — page-level spec". Distinguished from the pre-existing per-card
      `tripAdvisorEmbedCode` field, which was kept. Widget-vs-cards fallback is automatic; config split
      (`siteSettings` for the operator-level account, `testimonialsPage` for the page-specific embed) recorded
      as a proposal to decide at first build. Speculative-build guard carried over.
- [x] **`isFeatured` is STANDARD and ON BY DEFAULT** (Adinda, settled 2026-07-17) — supersedes "only add a
      featured flag when a concrete UI surface consumes it". *Verified:* `testimonial` now carries
      `isFeatured` as *"Standard field — homepage + About query it. Always included"*; the old *"decide during
      the build, don't implement speculatively"* text is **gone**; "Cross-page reuse" records the
      toggle-is-the-selection-mechanism / cap-is-only-a-safety-net rule. **Note:** the 2026-07-16 Done section
      below records `is_featured` as "correctly NOT built" — **that call was reversed on 2026-07-17**; the
      line stays as history only.
- [x] **Destination Figma node reference** `675-2363` → `778:8608` → `destination.md`. *Verified:* the old
      node survives only inside the supersession sentence.

## Done — reconciled 2026-07-16 against the installed atlas-website skill

Adinda updated the chat-side skill from `_atlas-website-chat-payload.md`, re-exported, and Claude installed
it. Verified against the freshly-installed files: new `testimonials.md` exists with the full `testimonial`
doc type (incl. `tripAdvisorEmbedCode` + `isMachineTranslated` + `enabled` guard); `faq.md` gained the
destination 3-category taxonomy (Diving / Traveling / General Information) alongside the intact 5-category
hub set with the `generalCategory`/`destinationCategory` split; the held items (schema-patterns folder,
`/destinations` index page, `is_featured`) were correctly NOT built. Only 1 client-specific mention remains
(incident reference).

- [x] **Testimonials hub** — new `references/page-structure/testimonials.md` + `testimonial` doc type
      (quote, authorName, rating, tripTaken, date, photo+alt, `tripAdvisorEmbedCode`, `isMachineTranslated`)
      + minimum-content guard. Moved from "optional/add-on" to a standard page in `pages.md`.
- [x] **Destination page additions** → `destination.md`: full-name + short-name fields (short name for the
      destinations menu); floating sub-nav bar (StickyAnchorNav); lightbox gallery (drk-website gallery
      pattern).
- [x] **Boat as a first-class document type** (multi-boat ready; short-description/tagline does double duty
      as hero subheading + destination "Boats on this route" card excerpt) + galleries follow the
      drk-website flat-array pattern → `boat.md`.
- [x] **Blog `relatedDestinations`** reference array (alongside category + tags) → `blog.md`.
- [x] **FAQ two-taxonomy split** — 5-category hub (unchanged) + 3-category destination set, conditional
      `generalCategory`/`destinationCategory` field split → `faq.md`. Real-content categories (dive
      requirements/skill, Nitrox, crew ratio, payment/cancellation) confirmed to map into the existing sets.
- [x] **Homepage** — "The Boat" teaser + two-card CTA (private charter vs. shared trip) pattern added;
      section-order difference flagged as an open reconciliation (see Pending above, not silently rewritten).
- [x] **Data-model notes** → `pages.md`: Destinations must be a referenceable Sanity document type from day
      one (six consumers threaded through one dataset). → `contact.md`: liveaboard form fields (Number of
      Guests 1–14 + separate "14+"; Preferred Destination multi-select; Preferred Departure Month rolling
      12-month + "Later").

---

## Done — reconciled 2026-07-13 against atlas-website skill v0.5

- [x] FAQ page structure: 5 consolidated categories + "All" tab, destination-redirect + AllDestinations
      block, rejected items (loyalty/visa page/language hints), `is_featured` flagged as droppable —
      new `references/page-structure/faq.md`.
- [x] Blog page structure fully expanded from the old thin stub: 3-column layout, categories + tags,
      required EEAT author byline, last-updated date, share button, "Related Articles" naming —
      `references/page-structure/blog.md`.

---

## Page-structure specs — Adinda's dictated standards (2026-07-23, from the Mari build)
Generalize into the page inventory/checklists. Mari-specific build detail stays in that repo's
`_PAGE-SPECS.md`. FAQ page + blog list/post + simple page are DRK-wide (queued in drk-website.md);
these are the ATLAS-standard (liveaboard) pages. Breadcrumbs on every page except the blog post.

### About page (liveaboard standard)
Hero with in-page section nav (same structure as other content pages; no brochure CTA; hero image
sourced from the boat gallery) → Overview (eyebrow + centered heading + full rich body with
read-more) → Why Us (shared component) → Crew section (photo/name/role cards from crewMember docs)
→ Testimonials (shared section) → Contact form → Footer.

### Schedule & Rates page
Imageless title-only hero, NO section nav → booking-widget embed (full-bleed on mobile per the
locked embed rule) → FAQ section composing the payment/inclusions/charter categories via
show-on-page toggles → Contact form → Footer.

### Testimonials page
Simple hero, no section nav → if no external review widget: GRID of testimonial cards (desktop
4×2 rows, mobile 8 cards; "read more" loads 2 more rows until exhausted — never a carousel here)
→ CTA → Contact → Footer.

### Shared-section singletons (pattern, proven on Mari)
Chrome + drag-curation for a section that repeats across PAGE TYPES lives in ONE singleton placed
in that topic's Studio folder (not a "shared components" abstraction bucket): e.g. Boats Section
(eyebrow ×2: {destination}-token + generic, headings singular/plural, CTA, drag-ordered boat refs),
Destinations Section (card CTA with {destination} token + drag-ordered destination refs = order AND
on/off; search/contact dropdowns deliberately keep the ALL list). Strong refs = deletion blocked
while listed (owner-handbook entry teaches the dialog).
