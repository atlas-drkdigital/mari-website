# _STUDIO-ORGANIZATION-AUDIT.md — is every document type in the right place, called the right thing?

_Written 2026-07-16 while Adinda was out, in answer to "I'm liking how they're organized... refine as we go,
make a pass page by page." Read-only analysis — **nothing here is built except the one change noted as DONE**._

**The question this answers:** for each document type, is it genuinely a **page**, a **shared component**, or
**infrastructure** — and does the sidebar say so? Adinda's own test, from the General FAQ realization: *a thing
that has SEO and page-level settings is describing a page, not a component.*

**The single best signal, and it's already in the schema:** does the type have an **`seo` field**? A component
never needs one; a page always does. Every mismatch below was found by taking that seriously.

**Status key:** ✅ correct · ⚠️ worth changing · 🔵 decide later, not now · 💤 fine, ignore

---

## The one change already made (2026-07-16)

- ✅ **`faqGeneral` moved from "Shared components" → "Main Page Content".** It has `seo`, backs `/faq`, and
  will carry page-level toggles (contact form, CTA). Being *pulled from* by destination/boat pages doesn't
  make it a component — the homepage pulls Destinations and Blog Posts, and those live under pages too.
  One line to revert.

---

## ⚠️ This audit's own blind spot (found by Adinda, 2026-07-16, minutes after it was written)

This file asks "**is each type in the right place?**" — so it can only ever find things that are *misplaced*.
It structurally cannot find things that are **missing**. Adinda immediately found one it missed:

- **Testimonials has documents but NO PAGE.** Same realization as the FAQ: a thing with SEO and page-level
  settings is a page. `atlas-website` already specs a Testimonials hub; it was never added to the page
  inventory or the sprint. Logged in MANAGER's ACTIVE QUEUE with its shape (a `testimonialsPage` singleton
  mirroring `faqGeneral`; the `testimonial` docs correctly STAY shared, since they're used on Home + About).

**Lesson for any future structure audit: also ask what's ABSENT, not just what's mislabeled.** Walk the page
inventory against the document types and look for both directions — a document type with no page that lists
it, and a page with no type behind it. **Still to do: walk the rest of the inventory for the same gap.**

## Mismatches worth acting on

### ⚠️ 1. `itinerary` has an `seo` field but is NOT a page — pick one
**The contradiction:** `itinerary` sits in Main Page Content *and* carries `seo`, but the locked scope says
individual itinerary pages are a **future paid add-on** — at launch they're list-only cards on the Schedule
page and destination pages. So today it behaves as a **component**, but it's shelved and dressed as a page.

An editor filling in an itinerary's SEO title today is doing work that renders nowhere. That's the exact
"backend feels broken" failure the signpost notes exist to prevent.

**Options:**
- **(a)** Leave `seo` (it's harmless, and the page is coming when someone pays for it) but add a signpost note
  saying itineraries don't have their own pages yet. **Cheapest, honest.** ← my recommendation
- **(b)** Remove `seo` now, re-add when the add-on is bought. Cleaner, but it's churn for a field that costs
  nothing to keep.
- **(c)** Move `itinerary` down to shared components. I'd **not** do this — it becomes a page later, and
  moving it twice is worse than leaving it.

### ⚠️ 2. `blogCategory` has a `slug` — implying a category page that isn't in the inventory
`blogCategory` is `name` + `slug`. A slug means a URL. But the page inventory has **Blog listing** and **Blog
post** only — no `/blog/category/[slug]` archive. So either the slug is dead weight, or an archive page is
quietly assumed. Blog is a **template-only build at launch** (no real content), so this is genuinely cheap to
settle now and annoying to discover later. **Decide during the blog slice (Jul 23), not before.**

### 🔵 3. `crewMember` is in Shared but only ever feeds the About page
Everything else in Shared is genuinely cross-page (Testimonials → Home + About; Why Us → Home; CTA →
everywhere). Crew is About-only, so by the folder's own logic it doesn't belong there. **But** About is a
*pinned generic `page` document*, and you can't nest a document list under a pinned document without
restructuring. **Recommendation: leave it.** The inconsistency is cosmetic; the fix isn't. Revisit only if
About ever gets its own document type.

### 🔵 4. `announcementBar` is in Shared, but it's really global chrome
It's site-wide furniture (like Nav and Footer), not a content component reused across pages. Arguably belongs
under **Settings** beside Site Settings and Navigation. **Low value, defer** — revisit in the global-chrome
slice when Nav/Footer get modelled, so all the chrome decisions land together rather than one at a time.

---

## The naming question you raised

**"General FAQ" now sits among Homepage / Destinations / Boats / Private Charters / About / Schedule & Rates
/ Itineraries / Pages.** Every one of those is named after *the page it is*. "General FAQ" is named after
*how it differs from other FAQs* — which mattered when there was a second FAQ list in the sidebar. There
isn't any more.

**Recommendation: rename it to "FAQ"**, and change the two signpost notes on destination/boat from *"edited
under General FAQ"* to *"edited on the FAQ page"*. Plainer, and it stops "General" from reading like a
category an editor has to understand. **Cost:** the label + two note strings. Free, no migration.

**Not doing it without you** — "General FAQ" was your locked wording and the notes depend on it.

---

## The thing I'd most want you to decide: page section toggles are about to diverge

You want **contact form + CTA toggles on the FAQ page**. Tomorrow's task builds **eight section toggles on
the homepage**. Those are the same feature, and right now they're on track to be invented twice, differently.

Nearly every page ends with the same furniture: **CTA section**, **contact form**, sometimes **testimonials**.
Today that's hardcoded per page. If each page type grows its own ad-hoc `showX` booleans as we go, we end up
with eight variations of the same idea and no editor can predict where the switch lives.

**Recommendation: settle the pattern tomorrow, while building the homepage toggles** — not later:
- One consistent convention: a **"Sections"** tab on every page type, holding that page's `showX` booleans.
- Same field names everywhere (`showCta`, `showContactForm`, …) so it's learnable once.
- Compose with auto-hide exactly as already decided: a section shows if **toggle ON *and* it has content**.

Doing this while the first instance is being built costs ~nothing. Retrofitting it across eight page types
after they're built is the expensive version. **Same logic as `boatDefaults` before the boat page.**

---

## Everything that's already right (no action)

- ✅ **Destinations folder** — `destination` list + `destinationDefaults` singleton nested together. The
  model `boatDefaults` should copy exactly.
- ✅ **Boats folder** — `boat` / `cabinType` / `cabin` grouped, because cabin types and cabins are meaningless
  apart from a boat. (Worth restating: **they are not pages** — they're data feeding the boat page's Cabins
  section. `boatDefaults` belongs in this folder for the same reason.)
- ✅ **Pinned pages** (Private Charters, About) as fixed-ID `page` documents — documented technique, works.
- ✅ **Blog as its own section** — enough supporting types (categories, authors) to earn it.
- ✅ **Shared components** — `whyUsItem`, `testimonial`, `cta` are all genuinely cross-page.
- ✅ **Settings / SEO Tools / Languages** — infrastructure, correctly out of the content flow.
- ✅ **`siteSettings` has an SEO group** — site-wide defaults, correct; not the same thing as a page's `seo`.
- 💤 **`page` last in Main Page Content** — your explicit ordering, preserved.

---

## Suggested order, if you want any of this

1. **Rename "General FAQ" → "FAQ"** + update 2 signpost notes. *(minutes — bundle with tomorrow's work)*
2. **Settle the section-toggle convention** while building the homepage toggles. *(no extra time if done then;
   expensive later)* ← **the one with real leverage**
3. **`itinerary` signpost note.** *(minutes)*
4. **`blogCategory` slug** — decide in the blog slice (Jul 23).
5. **`announcementBar` placement** — decide in the global-chrome slice.
6. **`crewMember`** — recommend leaving alone permanently.
