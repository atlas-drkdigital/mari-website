# ✅ DONE / SUPERSEDED — DO NOT ACT ON THIS FILE (marked 2026-07-16)

> This handoff is **complete**. The homepage slice was built, then fully wired (no hardcoded fallbacks) and
> committed (`7825576`). Required-field markers, image helper, homePage schema + seed: all done. Kept only for
> history — the record lives in MANAGER.md's checkpoints.
>
> **The live handoffs are:** `_NEXT-SESSION-faq.md` (task 1 — do first), then
> `_NEXT-SESSION-toggles-theme.md` (task 2), then the destination page slice.

---

# Next session handoff — homepage vertical slice + pending schema tasks (HISTORICAL)

_Written 2026-07-16 at the end of a very long session. Everything below is committed (latest commits on
`main`, ending ~`6992121` + a CLAUDE.md commit). Nothing is lost. Start a FRESH conversation + terminal._

## First 3 things to do in the new session
1. **Load skills:** `mari-project`, `drk-website`, `atlas-website`, `mari-core`, `mari-website`. Read
   `CLAUDE.md`, the top of `MANAGER.md`, and `_handoff/*.md`.
2. **Restart the dev server CLEAN before reviewing anything** (this is now a locked rule — see CLAUDE.md
   "Studio staleness"): kill the `:3000` process, `rm -rf .next`, `npm run dev`, curl `/studio` for 200,
   then hard-reload the browser. HMR does NOT reflect schema/structure/content changes reliably.
3. **Verify content is live** with a quick GROQ query-back before telling Adinda to review.

## Where things are (current Studio structure)
- **Main Page Content:** Homepage · Destinations (folder: Destinations list + **Destination Defaults**) ·
  Boats (folder: Boats + Cabin Types + Cabins) · Private Charters · About · Schedule & Rates · Itineraries ·
  Pages.
- **Blog:** Blog Posts · Blog Categories · Blog Authors.
- **Shared Components:** Announcements · Why Us Items · FAQ · Testimonials · **Crew Members** · **CTA Section**.
- **Settings / SEO Tools / Languages.**
- **Content seeded:** Komodo destination (full copy), Mari boat (8 specs), Destination Defaults + CTA
  singletons, 3 blog posts (author "Mari Liveaboard"), 3 itineraries, 6 Komodo FAQs, 1 Deluxe cabin type.

## Design decisions locked today (all in CLAUDE.md — don't re-litigate)
- **Skeleton-first → vertical slices** per page (schema depth + frontend + content together, review the real
  page). Build-approach section.
- **Every group mirrored by a titled fieldset** (section headers show in "All Fields"). Applied to all
  tabbed types now.
- **`[Type] Defaults` singleton** for types DESIGNED to hold many instances (Destinations ✓; Boats pending),
  with a `{destination}`-style token; single-instance pages use a dedicated "Section Labels" tab instead.
- **Decluttering + load-content-for-review + localization Studio-UX** conventions — all in CLAUDE.md.
- **Cover video = hosted URL** (not Sanity upload); FAQ split (generalCategory/destinationCategory by scope).

## PENDING TASKS — prioritized for next session

### 1. Required-field markers (TOP priority — asked more than once, still not done)
Every required field must show an upfront "*" / "(required)" marker BEFORE the editor fills the form.
Implement **once, site-wide** via a global custom field component in `sanity.config.ts`
(`form: { components: { field } }`) that detects required validation and renders the marker. Verify first
whether Studio shows any default indicator. See CLAUDE.md "Required fields must show an upfront marker."

### 2. Boat Defaults (the rule correction)
`boat` is designed to hold multiple boats → create a **`boatDefaults` singleton** (same pattern as
`destinationDefaults`: shared boat-page section eyebrows/headings, `{boat}` token if a heading includes the
boat name), nested under the **Boats** folder. Then **slim `boat`** — move its shared section eyebrows/
headings into `boatDefaults`, leaving only boat-unique content on the doc (same refactor we did for
destination). Update `_CONTENT-STATUS`/seed as needed.

### 3. Homepage vertical slice (the main build)
**Build against the CURRENT BUILT homepage, NOT the mockup** (Adinda's call — the real page is the source of
truth). The homepage frontend already exists and works, hardcoded, at `src/app/page.tsx` +
`src/components/sections/*` (Hero, TheBoat, WhyUs, Destinations, LatestArticles, Faq, Testimonials, Cta,
Contact, Footer). Wiring is **incremental, ~30–45 min per section — NOT a 5–7h monolith.** Steps:
- **Foundation first:** build the `urlFor()` image helper in `src/sanity/lib/image.ts` (with the vanity-
  filename fallback chain: `seoImageName` → `originalFilename` → `alt` → omit) + a `next/image` loader — no
  Sanity image renders until this exists. Then a homepage GROQ query + convert `page.tsx` to an async server
  component that fetches and passes props.
- **Flesh out `homePage` schema depth** against the built homepage. Put the **eyebrows / section-labels in a
  dedicated, explicitly-labeled "Section Labels" tab** (Adinda's requirement — she must clearly see where to
  edit eyebrows; don't bury them). The CTA section should use the shared `cta` singleton (the legacy
  `ctaHeading`/`ctaSubline` shell fields get reconciled/removed here).
- **Then wire section by section**, migrating each component's hardcoded content into Sanity. Replace the
  hardcoded `@/lib/destinations` with real `destination` docs (used by Hero search + Destinations + Nav).
- **Guardrail:** build "functional, matches the built page" — defer cosmetic polish to `_POLISH-BACKLOG.md`.

### 4. Private Charters — needs section-labels/eyebrows handling when built (same "Section Labels" tab pattern).

### 5. Misc: delete the one stray empty blog draft if it's still around.

## Model guidance (per the locked model rules — state it every task per the session-bookend protocol)
No Haiku/Fable · Sonnet-high default · Sonnet-medium menial · **Opus for architecture-tier**. This slice
splits cleanly:
- **Opus:** the `urlFor` image-helper design, `homePage` schema depth (Section Labels tab), Boat Defaults
  design, the required-field-marker global component (needs a judgment/research pass).
- **Sonnet-high:** the repetitive section-by-section component wiring + migrating hardcoded content into
  Sanity (mechanical, lower-risk, cheaper). Recommend the downshift once the schema/data-layer design is
  done and it's just the wiring grind. Sonnet-medium for pure copy/paste seeding if any.

## Plan note — full vertical slices, don't drift schema-only again
Today drifted schema-heavy (destination got schema + content but no frontend; homepage was only planned) —
so Adinda hasn't seen a real rendered page yet, which is the whole point of vertical slices. The new session
must do COMPLETE slices: **each page = schema depth + frontend + content together → a real page Adinda can
look at.** Homepage first (its frontend already exists → fastest to a visible result). Confirm with Adinda
whether she wants frontend-first-then-wire for pages whose frontend doesn't exist yet (e.g. destination).

## Do NOT redo
Fieldset headers (done on all tabbed types), Destination Defaults + CTA + slim destination, FAQ split,
cover-video URL field, crewMember type, all the content seeding — all done + committed.
