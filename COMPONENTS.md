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
  layout) and boat `BoatFaq` (`categorized` layout). **The row is IDENTICAL between the two FAQ layouts —
  the categorization is the ONLY difference** (Adinda, 2026-07-21): `default` = two columns, no categories;
  `categorized` = category rail + single column. So this row is the shared seam; the layout lives in the
  section. Owns wrapper (border/opacity hover — colour treatment only, per the locked rule), `h3>button`,
  title (active swaps to `editorial-h5`), chevron, and the `grid-rows-[0fr↔1fr]` collapse. Answer passed as
  `children` (plain `<p>` on the homepage, `<RichText>` gap-column on the boat page). Optional `id` anchor.
  Button pattern, NOT `<details>/<summary>` (no SEO gain — do not "upgrade").
- **Consumers:** `Faq` (default), `BoatFaq` (categorized) — both refactored to it. `BoatSpecs` adopts
  `AccordionChevron` only (its row is the divergent light/weight+colour variant). **Destination FAQ** reuses
  `FaqAccordionItem`.
- **Verified:** rendered FAQ DOM byte-identical pre/post (only intra-class-attribute order changed, which
  Tailwind treats as equivalent); tsc + eslint clean.
- **Open:** unifying `Faq` + `BoatFaq` into ONE section component with a `layout: default | categorized`
  field (the locked variant values) is the eventual step — they now share the row, which is the hard part.

## Inline — extraction pending (🧩)

### `TabRail` — in `SubNav.tsx`, `BoatFaq.tsx`, `Destinations.tsx`
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

### `SectionHeader` — recipe across most sections
Eyebrow + heading + description with the site-standard `gap-24` between heading and description (NOT Figma's
`gap-8` — convention supersedes). Candidate for a small shared component.
- **Status:** ⏳ pending (extraction #5).

---

## Change log
- **2026-07-21** — File created. Documented 9 already-standalone components; registered 5 pending
  extractions (Accordion, TabRail, SingleImageCarousel, LightboxGallery, SectionHeader).
