# COMPONENTS.md — reusable component registry (living document)

Companion to `CLAUDE.md` (rules) and `MANAGER.md` (session log). This is the **living registry of
reusable UI components** for the Mari site — what exists, what's still inline, each component's contract
(prop API + locked design rules + token coupling), and who consumes it. Started 2026-07-21 during the
componentization pass; **expand it every time a component is extracted or reused** (e.g. when the
Destination page reuses one, add itself to that component's Consumers row).

## How to read a status
- ✅ **Extracted** — lives in its own file, imported by ≥1 section. Reuse it; don't re-implement.
- 🧩 **Inline (extraction pending)** — the pattern is duplicated across sections and slated to be pulled
  into a shared component. Until then, if you touch one copy, touch all of them (they must stay identical).
- 📝 **Documented-only** — a one-off that isn't (yet) reused; recorded here so it's discoverable.

## Portability principle (locked — see CLAUDE.md)
These components ship to other DRK sites eventually. **Design tokens are INPUTS, not hardcoded** — a
component references semantic tokens (`text-primary`, `accent-ondark-primary`, …) that each site defines in
its own `globals.css`. Never bake a primitive hex or a Mari-specific value into a component. Where a
component genuinely needs a per-use value (an object-position, a category list), it takes it as a prop.

## "Componentized" ≠ "reusable across projects" — read this first
Two different things, and conflating them is what made componentization feel like a huge tax:
- **Extracted/shared (DRY within Mari)** — pulled into one file used by *multiple* spots in Mari. Only
  worth doing where there's real duplication (the accordion) or imminent reuse. This is the "componentize"
  work.
- **Reusable across projects** — a clean, self-contained file you copy into the next repo and re-skin.
  **A section used exactly ONCE in Mari is already this** — it's a tidy component file; you just copy it.
  It does NOT need to be "componentized" first.

So the **reuse shelf is basically all of `src/components/`** already. This catalog is the shelf list. The
cross-project vehicle is a **starter template** that carries these files + this catalog; you clone it, swap
tokens, and pull pieces off the shelf. See `_handoff/drk-website.md` → "Cross-project reuse workflow (DRAFT)".

## 🗂️ Reuse shelf — at-a-glance catalog
Status: 🟢 extracted/shared · 🔵 reusable file (single-use here, copy-&-adapt) · 🟡 inline candidate
(embedded in a section — extract when a 2nd use appears).

| Component | File / location | Status | Cross-project note |
|---|---|---|---|
| `SubNav` (+ scroll chrome) | `components/SubNav.tsx` | 🟢 | Locked pattern; reuse as-is. Destination reuses. |
| `Accordion` (`AccordionChevron`, `FaqAccordionItem`) | `components/Accordion.tsx` | 🟢 | Shared by both FAQ layouts + Specs chevron. Destination FAQ reuses. |
| `CarouselArrowButton` | `components/CarouselArrowButton.tsx` | 🟢 | THE round prev/next arrow (tailed `icon-arrow-forward`, 36→52px, 3 variants). Extracted 2026-07-22 at 3rd consumer; Testimonials + Destinations + DestinationOverview all use it. NOT the chevron — that's `CarouselChevron`, for controls inside image carousels. |
| `CarouselChevron` | `components/CarouselChevron.tsx` | 🟢 | Circular arrow; masks the shared nav-chevron asset. |
| `HeroVideo` | `components/HeroVideo.tsx` | 🟢 | Optional hero bg video island. |
| `SiteLightbox` | `components/SiteLightbox.tsx` | 🟢 | Fullscreen lightbox wrapper. |
| `RichText` | `components/RichText.tsx` | 🟢 | Portable Text renderer (wrapper owns paragraph gap). |
| `MultiSelect` | `components/MultiSelect.tsx` | 🟢 | Custom select (contact form). |
| `ScrollReveal` / `ScrollTopButton` | `components/*.tsx` | 🟢 | Scroll animation + scroll-top button. |
| `Nav` (+ mega-menu) | `components/Nav.tsx` | 🟢 | Global nav; mega-menu wires to live Destinations when built. |
| Hero (homepage) | `sections/Hero.tsx` | 🔵 | Full-bleed hero + destination search. Copy & adapt. |
| BoatHero | `sections/boat/BoatHero.tsx` | 🔵 | Liveaboard hero variant (scrim recipe reference). |
| Overview / TheBoat | `sections/boat/BoatOverview.tsx`, `sections/TheBoat.tsx` | 🔵 | Text + image feature blocks. |
| Cabins | `sections/boat/BoatCabins.tsx` | 🔵 | Cabin cards + image carousel (carousel = 🟡 inline, see below). |
| Gallery | `sections/boat/BoatGallery.tsx` | 🔵 | Category-tabbed carousel + combined lightbox. |
| Specs | `sections/boat/BoatSpecs.tsx` | 🔵 | Tabbed spec accordion + image grid. |
| FAQ (`default` / `categorized`) | `sections/Faq.tsx`, `sections/FaqCategorized.tsx` | 🟢 | `categorized` EXTRACTED 2026-07-22 (was `boat/BoatFaq.tsx`) when Destination became its 2nd consumer — boat + destination pages now share it. Rows share `Accordion`. |
| Destinations / WhyUs / Testimonials / LatestArticles / CTA / Contact / Footer | `sections/*.tsx` | 🔵 | Standard marketing sections; copy & adapt. |
| **Brochure download button** | inline in boat hero/overview | 🟡 | Standard on liveaboard sites → pull into its own small component. |
| **`TabRail`** (draggable chips / breadcrumbs) | inline in `SubNav`, `FaqCategorized`, `Destinations` | 🟡 | Extract when Destination reaches for it (just-in-time). |
| **`SingleImageCarousel`** | inline in `BoatCabins`, `BoatSpecs` | 🟡 | Extract at 2nd cross-page use. |

**Rule going forward:** the moment a 🟡 gets a real second use, extract it (that's when its shape is
knowable). A 🔵 doesn't need extraction to be reused — copy the file into the new project and re-skin.

---

## Extracted components (✅)

### `SubNav` — `src/components/SubNav.tsx`
**LOCKED PATTERN (2026-07-21, Adinda) — do not restructure.** In-page section navigation + scroll chrome:
anchor links + IntersectionObserver positional scroll-spy + the two-row compact floating chrome that
docks under the main nav. Desktop ladder: dark nav over hero → ONE switch to compact light nav row +
navy-glass section row (no intermediate states, no scroll-direction logic). Mobile: nav always visible,
chip bar (`TabRail`) beneath. The float boundary is a FROZEN full-nav height — live measurement
oscillates; do not "simplify" it back. Full behavior contract in the file header.
- **Consumers:** boat page (`/boats/mari`). **Destination page will reuse this** — inherits as-is.
- **Coupling:** section anchors + labels passed in; scroll-spy is positional recompute (never derive
  active from IntersectionObserver entry order).

### `CarouselChevron` — `src/components/CarouselChevron.tsx`
The circular prev/next arrow for carousels. Reuses `icon-nav-chevron.svg` (the SAME file as
Nav/Contact/MultiSelect), rotated ±90° — uniform stroke weight BY CONSTRUCTION, never a second "matching"
asset. Circle in CSS, chevron masked. `preserveAspectRatio="none"` on the export means the box ratio must
match the viewBox (7.91668:6). Do NOT rebuild from Figma's `Button/Carousel Arrow-Small` (filled Material
glyph — rejected as too heavy; conventions supersede Figma here).
- **Consumers:** `BoatCabins`, `BoatSpecs` (and any future carousel).

### `HeroVideo` — `src/components/HeroVideo.tsx`
Optional hero **background video** — a client island layered OVER the hero poster `<Image>` (which stays
mounted as LCP + fallback). Muted/looped/`playsInline` autoplay from a CDN-hosted MP4 URL (never a Sanity
upload — bandwidth cap). Guards via `useSyncExternalStore` (SSR/first-paint + reduced-motion +
mobile-without-`playOnMobile` all show the poster). Fades in on `onCanPlay`; poster never unmounts.
- **Props:** `{ url?: string|null; playOnMobile?: boolean; className? }` (`className` carries the poster's
  crop so a poster↔video swap doesn't jump).
- **Consumers:** `Hero` (homepage), `BoatHero`. **Destination inherits** when built — add
  `coverVideo{ url, playOnMobile }` to its query + drop `<HeroVideo>` into its hero wrapper.
- Schema: shared `objects/heroVideo.ts` → `homePage.heroVideo` / `boat.coverVideo` / `destination.coverVideo`.

### `SiteLightbox` — `src/components/SiteLightbox.tsx`
Fullscreen lightbox wrapper (built on `yet-another-react-lightbox`). Used by the gallery + specs image
grids. (Detail to expand when `LightboxGallery` is extracted around it — see pending §.)

### `RichText` — `src/components/RichText.tsx`
Portable Text renderer. **Carries NO margins** — every wrapper around `<RichText>` must be a flex column
with a gap (`gap-16` for body-large, `gap-12` for body-medium) or multi-paragraph copy renders unseparated
(locked 2026-07-21). Heading styles map to the `editorial-*` ramp (tier-3 heading styling deferred).

### `MultiSelect` — `src/components/MultiSelect.tsx`
Custom multi-select control (uses `icon-nav-chevron.svg`). Used in the contact form.

### `ScrollReveal` — `src/components/ScrollReveal.tsx`
`data-reveal` scroll-triggered entrance animations (IntersectionObserver).

### `ScrollTopButton` — `src/components/ScrollTopButton.tsx`
The floating scroll-to-top button that appears with the SubNav compact chrome.

### `Nav` — `src/components/Nav.tsx`
Global top nav + destinations mega-menu (`destinationsGrid` currently a placeholder — wire to live
Destination docs when the destination page ships, per CLAUDE.md).

---

## Extracted components (✅) — added by the componentization pass

### Accordion — `src/components/Accordion.tsx` — exports `AccordionChevron`, `FaqAccordionItem`
Extracted 2026-07-21. The accordion is **not one component** — the FAQ rows and the Specs row genuinely
diverge, so it's a shared primitive + a variant, not one boolean-parameterised blob (composition rule:
explicit variants over boolean props).
- **`AccordionChevron`** — THE locked chevron glyph, used by **all three** consumers. Owns the geometry:
  `h-[6.5px] w-[10px]` + `[mask-size:100%_100%]` inside a `size-[20px]` box, masking `icon-nav-chevron.svg`,
  rotating 180° on `open`. NEVER `size-[10px]` + `contain`. Colour + which transitions run are the only
  per-context difference → passed via `className` (FAQ: `bg-text-ondark-primary`, transform only; Specs:
  recolours `accent-subtle`→`action-primary`, so also transitions background-color).
- **`FaqAccordionItem`** — one row of the **ondark FAQ accordion**, shared by the homepage `Faq` (`default`
  layout) and `FaqCategorized` (`categorized` layout). **The row is IDENTICAL between the two FAQ layouts —
  the categorization is the ONLY difference** (Adinda, 2026-07-21): `default` = two columns, no categories;
  `categorized` = category rail + single column. So this row is the shared seam; the layout lives in the
  section. Owns wrapper (border/opacity hover — colour treatment only, per the locked rule), `h3>button`,
  title (active swaps to `editorial-h5`), chevron, and the `grid-rows-[0fr↔1fr]` collapse. Answer passed as
  `children` (plain `<p>` on the homepage, `<RichText>` gap-column on the boat page). Optional `id` anchor.
  Button pattern, NOT `<details>/<summary>` (no SEO gain — do not "upgrade").
- **Consumers:** `Faq` (default), `FaqCategorized` (categorized, ex-`BoatFaq`) — both refactored to it. `BoatSpecs` adopts
  `AccordionChevron` only (its row is the divergent light/weight+colour variant). **Destination FAQ** reuses
  `FaqAccordionItem`.
- **Verified:** rendered FAQ DOM byte-identical pre/post (only intra-class-attribute order changed, which
  Tailwind treats as equivalent); tsc + eslint clean.
- **Open:** unifying `Faq` + `FaqCategorized` into ONE section component with a `layout: default | categorized`
  field (the locked variant values) is the eventual step — they now share the row, which is the hard part.

## Inline — extraction pending (🧩)

### `TabRail` — in `SubNav.tsx`, `FaqCategorized.tsx`, `Destinations.tsx`
Horizontally-draggable category chip bar (mobile section nav + categorized-FAQ categories + destinations
carousel tabs). Active chip = left-border/color treatment; drag-scroll with `scrollIntoView` on select.
- **Status:** ⏳ pending (extraction #2).

### `SingleImageCarousel` — in `BoatCabins.tsx`, `BoatSpecs.tsx`
Single-image-at-a-time carousel with `CarouselChevron` prev/next. (Distinct from the multi-image gallery.)
- **Status:** ⏳ pending (extraction #3).

### `LightboxGallery` (variant `default`) — in `BoatGallery.tsx`
The category-tabbed carousel + combined fullscreen lightbox. Locked rule: each tab's carousel shows ONLY
that category's images; the lightbox shows ALL combined. Empty tabs hide (don't render). Registered variant
name: `default`.
- **Status:** ⏳ pending (extraction #4). ⚠️ carousel/lightbox split unverified until real photos exist.

### `GridGallery` — in `destination/DestinationGallery.tsx` (registered 2026-07-22, Adinda: "definitely likely on other projects")
Full-bleed gap-0 square grid (4-col/2-col), every tile opens the shared `SiteLightbox` with ALL images
combined (grid renders only asset-bearing images so grid index === lightbox index), plus the floating
"View All Images" pill (rounded solid `bg-surface` + the CarouselArrowButton `surface` shadow recipe,
bottom-center, 64/48px up). No visible heading by design — sr-only accessible name.
- **Status:** ⏳ shelf. Extract at second consumer (possible: homepage). ⚠️ Token coupling: pill colors +
  scrim family are Mari semantic tokens; portable version takes them as props.

### `ItineraryCardCarousel` — in `destination/DestinationItineraries.tsx` (registered 2026-07-22, same ask)
Hover/tap-reveal photo cards (closed: key-info ✦ line + title + pin route over light scrim; open: hard
darken + summary + TextButton CTA) in a conditional carousel: static row while cards fit the breakpoint
(3/2/1), drag + snap + INFINITE loop (3 copies + idle scrollLeft normalization) + paired arrows only when
they don't. Touch reveal rides POINTERUP (iOS first-tap-hover trap — see CLAUDE.md). NO whole-card link
ever (fights drag) — CTA-only navigation. Cards fed by a drag-ordered reference array on the parent doc
(order = display order, omission = hidden).
- **Status:** ⏳ shelf. The card + the loop mechanism are separable extractions; wait for the second
  consumer (possible: homepage itineraries band) or the componentization pass.

### `OverlapShowcase` (boats stepper) — in `destination/DestinationBoats.tsx` (registered 2026-07-22)
One-item-at-a-time stepper: image linked with hover zoom + touch-swipe stepping, cream card overlapping
the image (desktop asymmetry: image dropped 64px, card −96px overlap, bleeds to right viewport edge),
arrows hide at 1 item, singular/plural heading via two explicit fields. Mobile: image-first 3:2
full-bleed stack. ⚠️ data-reveal + keyed remount = invisible content (documented in the file).
- **Status:** ⏳ shelf. Generic "entity showcase" shape (boats today; could present anything card-like).

### Studio inputs — `JsonLdPrefillInput`, `RichTextCharCountInput`, `CharCountInput` — in `src/sanity/components/`
DRK-portable Studio UX: (a) JSON-LD override prefill that reads the RENDERED page's ld+json (single
source, can't drift — needs only a type→route map per project); (b) live char counters for string/text
AND Portable Text fields (`options.maxLength` + `.warning()` rule contract).
- **Status:** ✅ effectively portable as-is — copy the files; queued for `drk-website` at the next skill round.

### `SectionHeader` — recipe across most sections
Eyebrow + heading + description with the site-standard `gap-24` between heading and description (NOT Figma's
`gap-8` — convention supersedes). Candidate for a small shared component.
- **Status:** ⏳ pending (extraction #5).

---

## Change log
- **2026-07-21** — File created. Documented 9 already-standalone components; registered 5 pending
  extractions (Accordion, TabRail, SingleImageCarousel, LightboxGallery, SectionHeader).
