# _internal/POLISH-BACKLOG.md — deferred frontend polish, tracked page by page

Companion to `_internal/SCHEMA-SPECS.md` (field approval), `_internal/CONTENT-STATUS.md` (real vs. placeholder content),
and `_internal/QA-CHECKLIST.md` (external-reviewer open decisions). This one exists so the **vertical-slice** build
approach (locked 2026-07-16 — see CLAUDE.md) doesn't turn into a rabbit hole.

**The rule:** when building a page slice (schema depth + frontend + content), build to *structurally matches
the mockup and is functional* — and the moment something is purely **cosmetic polish** (exact spacing, a
hover micro-interaction, an animation curve, a nice-to-have responsive tweak), **log it here and keep
moving.** Don't stop the slice to perfect it. We burn this list down in a dedicated **polish block** later
(the Jul 21–25 QA/polish window).

**What belongs here:** cosmetic/interaction polish that's safe to defer without blocking the page from
working or being reviewable. **What does NOT:** real bugs, schema problems, missing content, broken
behavior, or anything that changes whether a decision can be made — those get fixed in the slice, not
deferred.

**Status legend:** 🔲 open · ✅ done (during the polish block) · ❌ dropped (decided not worth it)

---

## Homepage
- 🔲 **Sanity CDN image resizing** — Sanity images currently go through Next's own optimizer
  (`/_next/image`), which downloads the full-res source (e.g. 2400px hero) to resize. Letting Sanity's
  CDN do the resizing (a global `images.loaderFile` that appends `?w&q&auto=format&fit=max` to
  `cdn.sanity.io` URLs and passes other URLs through) is more efficient. Deferred from the homepage
  slice because a per-`<Image>` `loader` function can't cross the RSC boundary in Server Components
  (TheBoat, CTA) — a global loaderFile sidesteps that. Perf-only; images render fine today. (2026-07-16)
- 🔲 **Blur-up placeholders (LQIP)** — the image query already fetches `metadata.lqip`; wire
  `placeholder="blur" blurDataURL={lqip}` on the large images (hero, the-boat, why-us) for a nicer load.
- 🔲 **Why Us image framing** — the original hardcoded "divers" card used `objectPosition: '58% center'`
  for framing; Sanity-sourced cards drop it (fall back to center). Revisit via hotspot or a per-image
  focal point when destination/boat galleries get the same treatment.
- 🔲 **Rich text in FAQ answers / Why Us descriptions** — currently flattened to plain text (`toPlainText`)
  to fit the single-`<p>` animated structures. If real content needs bold/links/lists there, render with
  `<RichText>` and adjust the animation wrapper. (2026-07-16)
- 🔲 **Testimonial star rating** — `StarRating` always renders 5 filled stars; wire it to the
  testimonial's `rating` field (with empty stars for <5) if any review is ever below 5.
- ✅ **FAQ default-open item was hardcoded** — `useState('faq-7')` opened the 8th item, which worked only at
  exactly 8 featured questions and silently opened NOTHING below that. **Fixed 2026-07-17** → `'faq-0'`
  (first item; exists for any non-empty list). Logged here as cosmetic on 2026-07-16, then **actually
  reproduced** during the 3-featured-question test — worth noting the pattern: it took a real partial
  dataset to turn a theorised edge case into a visible failure. Decided on UX (one open item signals the
  rest are clickable); no SEO angle — answers are in the DOM either way, the collapse is visual only.
- 🔲 **FAQ min-height's 70px nav offset is unverified against Figma** — `lg:min-h-[calc(100dvh-70px)]` takes
  70px from the Destinations section's existing `calc(100dvh-70px)`, not from the design file. Confirm
  against Figma `778-8603` and correct both if it's wrong. Cosmetic; renders correctly today. (2026-07-17)

## Destination
_(none yet)_

## Boat
_(none yet)_

## Theme / global (near-term tweak, NOT the Jul polish block — do with the post-FAQ theming pass)
- 🔲 **Primary background too white → try `beige/100`** — Adinda 2026-07-16: the current primary page
  background reads too white; switch the primary bg token to `beige/100` and review. (Frontend theme,
  `globals.css`.)
- 🔲 **Accent color must stay readable against BOTH light and dark font** — Adinda 2026-07-16 (screenshot:
  an accent/brown surface where a grey caption was unreadable). Pick/adjust the accent so muted/grey
  caption text and white/dark title text both keep sufficient contrast on it. Verify the exact surface
  from the screenshot (looked like a list/badge row) and fix at the token level, not per-component.

## Other / cross-page
_(none yet)_

---

## 🖼️ FINAL IMAGE / CONTENT PASS — boat page (deferred 2026-07-17, Adinda's explicit call)

**Her call, verbatim in spirit:** *"flag that as a final touch content pass — but I need to make sure the
frontend is built, matches the backend, and functional, and do these polishes last."*

**Why deferred, not dropped:** none of these block the build. All three are cosmetic or content-side, and
every one of them is cheaper once the real photos exist — tuning a crop against a smoke-test placeholder
would be tuning against an image that's about to be replaced. Do them in ONE block, after the sections are
built and reviewed. Full diagnosis for each lives in `_internal/CONTENT-STATUS.md`; this is the burn-down list.

- [ ] **Hero grain** → source asset is `mari-hero-smoketest`, **1448×1086**, upscaled ~3× across a
      full-bleed retina hero. Not a compression setting — no quality value fixes an upscale. Resolves
      itself when shot-list row 1 (≥2560px, ideally 3840px, wide crop) lands. **Verify after upload.**
- [ ] **Honour the Sanity hotspot** → `hotspot: true` is enabled on `imageWithAlt` + `galleryImage`, so an
      editor can drag a focal point **and nothing happens** — `urlForImage` is called with no
      width/height, so Sanity never applies it, and CSS centre-crops. A control that looks like it works
      and doesn't. Site-wide, not boat-only.
      **Fix:** derive `object-position` from `hotspot.x`/`hotspot.y`; return it from `sanityImageProps` as
      a plain `style` object (a style object crosses the RSC boundary; a `loader` function does not).
      GROQ already returns `hotspot` — no query change.
      ⚠️ **Do NOT hardcode an `object-position` per photo.** That's the homepage hero's
      `object-[65%_42%]` — a magic number tuned to one image that breaks for the next boat. Adinda
      explicitly rejected this class of fix ("I'd rather fix the source image than mess it up for when we
      create other boat pages").
      ⚠️ **Reconcile the homepage in the SAME pass** — `Hero.tsx`'s hand-tuned `object-[65%_42%]` will
      fight a hotspot-derived value. Don't bolt one on top of the other.
- [ ] **`quality={80}` elsewhere** → `next.config.ts` has allowed `qualities: [75, 80]` all along, but
      nothing requested 80, so the config was **inert** and every image rendered `q=75`. The boat hero now
      requests 80 (`1b20c04`). Decide whether the homepage's photographic heroes should too — the static
      build's perf pass used ~80 for those. Deliberately NOT changed mid-boat-slice.

## Destination page (added 2026-07-22, during the Komodo slice)
- [ ] **JSON-LD override prefill (Studio)** — toggling `overrideJsonLd` should PRELOAD the auto-generated
      JSON-LD into the textarea instead of an empty box (Adinda: a stated requirement, not a nice-to-have).
      Needs a custom Studio input mirroring the frontend generation (FAQPage + page defaults). ~1h.
      **SCHEDULED: TODAY, once the destination page sections are done (Adinda, 2026-07-22 — "absolutely
      today, deferred too long").**
- [ ] **Articles carousel arrows** — the destination mock (778:8699) shows prev/next circle buttons on the
      Articles header; shipped without them (3 cards fit desktop; mobile has the drag track). Add if Adinda
      asks after seeing it live.
- [ ] **Blog posts Studio structure** — Adinda 2026-07-22: the Blog Post form reads "all over the place,
      hard to review." Restructure (groups/fieldsets/ordering) as part of the BLOG slice, not before.
- [ ] **Blog CTA target decision** — destination Articles button links `/blog` (route not built). Open
      question when the blog page ships: land visitors pre-filtered to the destination's articles, or on
      the full list (Adinda undecided, 2026-07-22).
- [ ] **Section-button slugs must auto-resolve (LOCKED, Adinda 2026-07-22)** — when /faq, /blog and
      /schedule-rates get built, the FAQ/Articles/Trips section buttons must pull the real page slug
      dynamically (link field or slug query), NOT stay hardcoded route strings. "It should not be
      manual." Build this INTO each of those page slices.
