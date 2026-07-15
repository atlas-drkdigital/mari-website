# MANAGER.md — Mari Liveaboard website (Next.js + Sanity)

Running log for this repo's build. Companion to `CLAUDE.md` (prose rules/active decisions) and
`COMPONENTS.md` (not yet created — see CLAUDE.md's doc-split note). Keep entries terse + dated, per the
static-build repo's own size-discipline convention (archive past ~1,900 lines).

The static-build repo (`../v1-static-homepage/MANAGER.md`) holds the full pre-2026-07-14 history: sprint
planning, brand-dump decisions, page inventory, contracted deliverables. Don't re-read it cross-repo going
forward — this file is now the live one.

---

## SESSION CHECKPOINT — end of 2026-07-15 session (READ THIS FIRST — supersedes the 2026-07-14 checkpoint below)

### Where things stand
**Full homepage QA pass is complete and the site is in a known-good, verified-clean state.** Every
section reviewed on both desktop and mobile, ~10 real bugs found and fixed this session (Nav, Hero,
Destinations, Why Us, Testimonials — see the dated entries below for each). `tsc --noEmit` and `eslint`
both clean as of the last edit. Nothing is mid-flight or half-done in the committable sense — the working
tree is safe to leave as-is overnight.

### One thing NOT finished — a real bug found and reverted, not silently left broken
Adinda asked for smooth open/close animation on Nav's mega menus, the mobile menu overlay, and Hero's
mobile search takeover (currently instant `hidden`/`flex` toggles — flagged as a known gap earlier in the
session, see "No instant expand/collapse" in `components.md`/`claude-code.md`). Built a
`useDelayedUnmount` hook (`src/lib/useDelayedUnmount.ts` — **file still exists, currently unused/not
wired into anything**) meant to keep an overlay mounted through its exit fade. It has a real, unexplained
bug: the opacity/pointer-events half of the fade worked correctly (confirmed via direct DOM inspection),
but the hook's own "should this still be rendered" state got stuck at `false` even when the panel should
have been open — meaning the panel never actually became visible (`hidden` class never left) despite the
rest of the state being correct. Root cause not found before time ran out — tried the React-documented
"adjust state during render" pattern (`if (isOpen !== prevIsOpen) { setPrevIsOpen(isOpen); if (isOpen)
setRendered(true) }`) instead of calling `setState` directly in a `useEffect` (which an eslint rule,
`react-hooks/set-state-in-effect`, correctly flagged as an anti-pattern) — confirmed via the actual
compiled Turbopack bundle that the deployed logic matched the source exactly, so it's a genuine logic bug
in the render-phase-adjustment approach itself, not a stale build or a wrong-button-clicked test artifact.

**Reverted cleanly** rather than leave the site broken: Nav.tsx's 3 overlay toggles (Destinations mega,
Resources mega, mobile menu) and Hero.tsx's mobile search takeover are all back to their original,
confirmed-working instant `hidden`/`flex` toggles. Confirmed via direct DOM check post-revert: mega menu
opens correctly again (`hidden` → `flex` on click). This means: **the smooth-transition work for these 4
overlays specifically is NOT done** — Testimonials and Nav's mobile accordions (the two other transition
fixes from this session) ARE done and working, just not these 4.

**For next session:** either debug `useDelayedUnmount` properly with a clear head (start by adding
temporary `console.log`s inside the hook to see the actual `isOpen`/`prevIsOpen`/`rendered` sequence
across renders — that's the next diagnostic step, not yet done), or consider a different technique
entirely (e.g. the newer native CSS `@starting-style` + `transition-behavior: allow-discrete` approach,
not attempted this session, would avoid JS-managed mount-lag state entirely — worth evaluating browser
support before committing to it).

### What's next after that (unchanged from before today)
Tier 4 schema skeleton pass — explicitly **scheduled for a future/afternoon session, not next thing to
open**. See "What's next, in order" in the 2026-07-14 checkpoint below (item 2) for the full scope; that
plan is still accurate, just superseded in ordering by today's QA work being done first as planned.

### Session time
Logged mid-session at **~2h** (Adinda's own estimate, see Session Time Log table below) — that figure
does NOT include the Testimonials refinement round or the transitions work done after that (including
this reverted attempt). Actual total is longer; ask Adinda for an updated figure next session rather than
guessing one now.

---

## SESSION CHECKPOINT — end of 2026-07-14 session (superseded by the 2026-07-15 checkpoint above — kept for history, "Done"/schema-pass detail below is still accurate)

### Done, committed, verified (typecheck + lint + Studio/homepage smoke-tested clean throughout)
- Sanity project `kb8eim50` ("Mari Liveaboard") created, Studio embedded at `/studio`, fully isolated from
  the live MVP project (`sjkpkyaw`) — see `SANITY-SETUP.md`.
- Full schema skeleton: `page` (generic, rich text matched to the live MVP's proven spec — colors via
  `@sanity/color-input`, sized/aligned images, HTML embed, no link annotation), `scheduleRates`,
  `announcementBar` (multi-doc, exclusive-active warning validation, Normal/Medium/High urgency),
  `navigation` (shared `link` object, Destinations-mega-menu placeholder field), `siteSettings` (tabs +
  fieldsets, contact arrays, social platform enum), `redirect`, `language`, plus shared objects (`seo`
  with full Yoast-parity checklist + live char-count, `linkItem`, `socialLink`, `contactEmail`/`Phone`,
  `htmlEmbed`).
- Custom Studio structure (grouped sidebar: Pages, Announcements, Settings, SEO Tools, Languages), singleton
  locks on Site Settings/Navigation, auto-slug component.
- Studio branding: copper/amber/navy colors + Bricolage Grotesque font + "Mari Studio" title, via
  `buildLegacyTheme` (values sourced from `theme.css`, not invented).
- **`theme.css` fully ported into this repo** as Tailwind v4 `@theme` (`globals.css`) — full color/spacing/
  radius/shadow/type-scale token layer, adapted for Next.js (font via `next/font`, texture URLs public-
  absolute). Static asset library (images/icons/per-section JS) copied to `public/assets/`
  (`pre-webp-originals/` deliberately excluded — confirmed unreferenced dev-only files first).
- Documentation: `drk-website` skill's `sanity-cms.md` has all reusable patterns from this session (Structure
  grouping, singleton lock, slug/char-count components, shared `link` object, exclusive-active validation,
  SEO checklist, Studio branding boundaries — what's realistic vs. not); its `workflow.md` now has the
  session-time-tracking convention. CLAUDE.md has the handoff-doc-reading instruction + Destinations
  mega-menu reminder. `_handoff/mari-website.md`'s announcement-bar conflict is reconciled.

### Homepage markup port — DONE this session too (was the top "what's next" item, now complete)
All 11 static sections (Nav, Hero, The Boat, Why Us, Destinations, Latest Articles, FAQ, Testimonials, CTA,
Contact, Footer) ported from `../v1-static-homepage` into real Next.js components at `src/components/` +
`src/components/sections/`, assembled in `src/app/page.tsx`. Content is still hardcoded (matches the static
build verbatim) — no Sanity wiring yet, that's blocked on the `homePage` schema type (Tier 4). Verified:
`tsc --noEmit`, `eslint`, and `next build` all clean; `/` and `/studio` both smoke-tested.

**Two deliberate simplifications vs. the source** (noted in-file, not oversights):
- Destinations' drag-swipe no longer live-previews the incoming photo sliding in mid-gesture — swaps on
  release instead, same crossfade as the tab/arrow navigation. Real visual-polish item to revisit.
- Testimonials dropped 4 explicit test-only placeholder reviews from the original (they were only ever
  there to verify carousel overflow behavior, never real content) — ported only the 4 genuine reviews.

### What's next, in order
1. **Finish visual/functional QA of the homepage port** — in progress, see checklist below (Why Us already
   reviewed and fixed, see next section). Needs Adinda's eyes in a real browser; I can't visually confirm
   hover states, animation feel, or real-device touch/drag behavior myself.
2. **Tier 4 schema types**: `homePage`, `destinationPage`, `boatPage`, `itinerary` (stub), `testimonial`,
   `faq`, page-builder block shell — now genuinely informed by the real ported component structure (the
   reason this was sequenced after the port, not before). **Method locked 2026-07-15: skeleton-first,
   same as the original schema pass** — scaffold all 7 types with core fields only, get them showing in
   Studio's sidebar/structure first, so the actual organization is visible rather than reasoned about
   abstractly, THEN fill in field-level depth per type once the shape is real. Also carries the
   Resources-copy-Sanity-editable and nav-default-link-with-override decisions logged above into this
   pass. **Scheduled for a future session (Adinda: "the afternoon session, but not now") — not part of
   today's remaining work**, despite being the next item in this list.
3. **Wire the homepage to Sanity** once `homePage` schema exists — replace the hardcoded content in each
   section with real GROQ-fetched data.
4. Once `destinationPage` exists: wire the Destinations mega-menu (`navItem`'s `menuStyle` placeholder is
   already there — see CLAUDE.md's Navigation section for the exact to-do).

### QA in progress — bug found + fixed this session (2026-07-14, same day)
Adinda reviewed **Why Us** first and caught a real bug via screenshots (not-expanded state showed 2 of 4
cards blank/washed-out; any card interaction "fixed" it). Diagnosed by reading the actual rendered HTML
(not guessed from source review alone) — two real, separate causes, both fixed in `WhyUs.tsx`:
- `next/image`'s `fill` prop forces `width:100%;height:100%` as an inline style, which no Tailwind class can
  override — the ported "55vw-wide, shifted-to-center" framing classes were dead on 3 of 4 cards. Fixed by
  moving those classes to a wrapping div and letting the Image fill *that* instead.
- All 4 images had `loading="lazy"` + a large fallback size — genuine load-timing flash on a section sitting
  just below the fold, read as broken in a screenshot taken during that window. Switched to eager loading.
Both confirmed via `curl`-diffing the actual rendered HTML before/after, not just re-reading source. Verified
clean: `tsc --noEmit`, `eslint`, `next build`. Committed (`bc1aaa7`).

**Given this exact bug pattern (framing classes silently dead under `next/image`'s `fill`), spot-check the
other sections using the same `fill` + non-trivial-positioning-classes combo** when reviewing them — Nav's
mega-menu destination images and Destinations' background crossfade layers use `fill` too, though their
positioning is simpler (`object-cover` only, no extra shift/width classes), so they're lower-risk than Why
Us was, but worth a deliberate glance rather than assuming they're fine by analogy.

### Why Us — second pass + The Boat, reviewed 2026-07-15 (page-order correction)
QA was reviewing out of page order (jumped to Nav/Hero/Destinations, skipping The Boat and a second Why Us
look entirely) — corrected: actual homepage order is Nav → Hero → **The Boat** → **Why Us** → Destinations →
.... Both reviewed now, page-order-correct, before moving to Destinations.
- [x] **The Boat** — Adinda: no code issues, nothing to fix.
- [x] **Why Us** — Adinda: everything else looks great on both desktop and mobile. Two notes, both
  logged as open backlog, not fixed now (explicitly not urgent):
  - [ ] **Missing hover-zoom effect on card images.** The Boat's image has a subtle hover zoom
    (`group-hover/boat:scale-105`, 1100ms ease-in-out) that Why Us's 4 cards don't have at all —
    confirmed by reading both components directly. Add the same effect to Why Us's `<Image>` elements
    for visual consistency between the two sections, when this gets picked up.
  - [ ] **Card image cropping needs manual re-work — content task, not a code fix.** Adinda's own
    to-do, especially the "Premium Comfort" card (`why-us-dining.webp`, the dining-table image) — the
    current crop isn't right. No code change needed; this is an asset-replacement task on her end.
  - [x] **Hover-zoom fixed same session** (Adinda asked for it explicitly right after logging it as
    backlog) — added the identical `group-hover/boat:scale-105`-style pattern from The Boat to Why
    Us's card `<Image>`s: `transition-transform duration-[1100ms] ease-in-out group-hover/card:scale-105`
    (the cards already had a `group/card` class from their existing expand-on-hover behavior, so this
    layers on top of that, not a new interaction). Verified clean: `tsc --noEmit`, `eslint`.

### Destinations QA — reviewed 2026-07-15, 2 real bugs found + fixed
Adinda checked both desktop and mobile herself. Everything else confirmed good; two real bugs, both fixed:
- **Active tab could scroll out of view with no way back into view.** Clicking a tab near the end of the
  list (e.g. North Sulawesi) made it active but the tabs row never scrolled — Adinda's screenshot showed
  it cut off mid-word at the container's right edge. Fixed: a `useEffect` on `index` change calls
  `scrollIntoView({inline: 'start', block: 'nearest'})` on the active tab, aligning it to the start of the
  visible track. For tabs near the end (not enough remaining items to fill the width), the browser
  naturally clamps this to the max scroll position instead — verified directly: clicking North Sulawesi
  now brings it fully into view with Halmahera (the only tab after it) visible too, exactly matching
  Adinda's requested fallback behavior.
- **Drag-to-scroll on the tabs row worked on mobile (native touch) but not desktop (mouse).** The row
  only had `overflow-x-auto` — enough for native touch scroll, not for a click-and-drag gesture with a
  mouse. Fixed by wiring up the project's existing `useDragScroll` hook (same one `WhyUs.tsx` already
  uses for its mobile card track) — mouse-only by design, leaves touch alone since that already works
  natively. Verified via a simulated real mouse press→move→release: `scrollLeft` moved 0 → 175.
Both fixes in `Destinations.tsx`. Verified clean: `tsc --noEmit`, `eslint`.

### Regression from the fix above, same session: page auto-scrolled to Destinations on every load
Adinda caught it immediately after the tab-scroll fix landed: every page refresh jumped straight to Why
Us on desktop, and to the Footer on mobile — with zero interaction. Traced by instrumenting
`scrollIntoView`/`scrollTo` directly (monkey-patched both, captured a real stack trace on the actual
call) rather than guessing from source, since grepping for likely culprits (`autoFocus`, `.focus()`,
other scroll calls) turned up nothing — the trace pointed straight at `Destinations.tsx`'s own new
`useEffect`.

**Root cause:** `useEffect(() => { tabRefs.current[index]?.scrollIntoView(...) }, [index])` fires on
**mount**, not just on real index changes — `index` starts at `0`, so the effect runs immediately on
every page load. `block: 'nearest'` scrolls the whole PAGE vertically (not just the tabs track
horizontally) if the target element isn't yet in the viewport, which it never is on load since the user
starts at the top of the page. Landing at Why Us vs. Footer on desktop vs. mobile was just which position
the browser computed as "nearest" given each layout's very different total height — same one root cause
either way, not two different bugs.

**Fix:** added a `skipFirstScrollIntoView` ref, set true initially, checked and cleared at the top of the
effect before any scroll call — skips exactly the mount-triggered run, fires normally on every real index
change after that. Verified two ways: (1) re-ran the instrumented fresh-load test — 0 scroll calls
captured, `scrollY` stays `0`; (2) re-confirmed clicking a tab still auto-scrolls it into view correctly
(North Sulawesi test from the original fix, unchanged result). Verified clean: `tsc --noEmit`, `eslint`.

**General rule, not just this component** — logged in `references/components.md` (local `drk-website`
skill copy) and queued in `_handoff/drk-website.md` for the real skill: any `useEffect` that calls
`scrollIntoView`/`scrollTo` and is keyed on a piece of state must explicitly guard against firing on the
initial mount, unless a mount-time scroll is actually the intended behavior. `useEffect` always runs at
least once after first render — an effect keyed on a value that starts at its "default active" state
(index `0`, first item, etc.) will otherwise fire unconditionally on every load.

### QA in progress — mobile bug found + fixed this session (2026-07-15)
Adinda reported "barely any content" on real iPhone (both Safari and Chrome — same WebKit engine).
**Chromium mobile emulation and desktop Playwright WebKit both rendered the page correctly**, so the bug was
only reproducible via real-device screenshots, which Adinda provided section-by-section. Those showed a clean
pattern: every section rendered its background/texture but not its actual content, **except Hero and
Destinations** — the two sections not gated behind the scroll-reveal system (`ScrollReveal.tsx`,
`[data-reveal]`/`[data-revealed]`, IntersectionObserver-driven). Hero is exempt in practice because it's in
the first viewport (reveals instantly on load); Destinations is the only section that doesn't use
`data-reveal` at all. Root cause: the observer was not reliably firing `isIntersecting` for below-the-fold
elements on real WebKit-iOS (suspected: Safari's dynamic toolbar changing the actual viewport height
mid-scroll, interacting badly with the percentage-based `rootMargin`) — content stayed permanently at
`opacity: 0`. Exact WebKit mechanism not fully nailed down (no real-device dev tools access this session),
but the fix doesn't depend on knowing it precisely.

**Fix, `ScrollReveal.tsx`:** added a manual scroll/resize-driven backup check alongside the existing
IntersectionObserver — independently re-checks each not-yet-revealed element's real position and reveals it
once genuinely near the viewport (same trigger condition as the observer's `rootMargin`, just computed
manually). Deliberately NOT a blind timeout-after-mount — an earlier draft of this fix did that and would
have force-revealed all below-the-fold content ~1.5s after page load regardless of scroll position, killing
the reveal-on-scroll effect entirely even on working browsers. Verified clean: `tsc --noEmit`, `eslint`.

**CORRECTION, same session — this WebKit theory was superseded by the real root cause.** Adinda reported the
exact same symptom reproduces on her own *desktop* browser too, purely by which hostname is used: broken via
her LAN IP (`192.168.0.101:3000`), fine via `localhost:3000`, on both desktop and phone. That's not a WebKit
bug — it's Next.js 16's dev-only cross-origin protection: `next dev` blocks requests to dev resources
(HMR websocket, the `__nextjs_font` dev font-serving endpoint, etc.) from any origin other than `localhost`
unless explicitly allowlisted. Confirmed directly in `.next/dev/logs/next-development.log`:
`⚠ Blocked cross-origin request to Next.js dev resource /_next/webpack-hmr from "192.168.0.101"` (and the
same for `/__nextjs_font/geist-latin.woff2`). This single cause explains every observation without needing a
device-specific theory at all — the phone could only ever reach the server via the LAN IP, never `localhost`.
**Real fix:** added `allowedDevOrigins: ["192.168.0.101"]` to `next.config.ts` (Next's own documented
solution for this exact scenario) and restarted the dev server. Confirmed via a fresh CDP-driven browser hit
against `http://192.168.0.101:3000/` post-restart: no blocking warnings in the log, The Boat section (and by
extension everything gated behind `ScrollReveal`) renders correctly. **The `ScrollReveal.tsx` hardening above
is being kept anyway** — it's a legitimate defensive improvement regardless of root cause, just wasn't the
actual fix. **Still needs Adinda's real-device re-test** to close this out — dev-only issue, will not exist
in production (no `allowedDevOrigins`/HMR/dev-font machinery outside `next dev`), but should be confirmed
fixed for the remainder of this QA pass to not be a recurring distraction. If Adinda's Wi-Fi IP changes later
(DHCP), `next.config.ts`'s `allowedDevOrigins` value needs updating to match.

### Homepage port QA checklist — for Adinda, remaining sections
Run `npm run dev`, open `http://localhost:3000/`, and check. **Each section gets a desktop pass AND a
mobile pass, explicitly separate — not one generic look** (2026-07-15: a mobile-only false alarm on this
same homepage turned out to be a testing-artifact, not a real bug, but the near-miss is the reason this
checklist now splits every item by viewport rather than leaving mobile implicit). For mobile, use a real
phone if you have one; a resized desktop browser window is the second-best option — just don't rely on
Claude Code's own automated mobile checks alone without a human look, since even a correct-looking
automated pass can miss real-device quirks (Safari/iOS in particular).
- [x] **Why Us** — reviewed, bug found + fixed (see above).
- [x] **Nav** — reviewed 2026-07-15, both desktop and mobile. 4 real bugs found + fixed, 1 flagged as
  content (not code), 1 needs clarification. See "Nav QA — desktop findings" below for detail.
- [x] **Hero** — reviewed 2026-07-15 alongside Nav (mobile confirmed good; desktop search dropdown had
  the same North-Sulawesi-wrap bug as one of the Nav fixes, same fix applied, confirmed by Adinda).
- [x] **Destinations** — reviewed 2026-07-15, both desktop and mobile. 2 real bugs found + fixed (tab
  auto-scroll, desktop drag-scroll) — see "Destinations QA" above. Everything else confirmed good.
- [x] **Latest Articles ("Blog")** — reviewed 2026-07-15, desktop + mobile. Adinda: nothing alarming,
  may flag specific items later if anything comes up. Not in the original checklist (same oversight as
  The Boat) — added retroactively for an accurate record.
- [x] **FAQ** — reviewed 2026-07-15, desktop + mobile. Adinda: looks good, no issues.
- [x] **Testimonials** — reviewed 2026-07-15. Adinda asked for 4 TEST-ONLY dummy cards to be added
  (`TEST_ONLY_REVIEWS` in `Testimonials.tsx`, clearly marked, not real content) specifically to verify
  carousel overflow/arrow behavior with more than 4 cards — confirmed working (8 cards total, arrows
  appear and scroll through correctly, verified via screenshot). **Remove `TEST_ONLY_REVIEWS` before
  launch** — flagged in-file and here so it isn't forgotten.
- [x] **CTA** — reviewed 2026-07-15 (also not in the original checklist, added retroactively). Adinda:
  looks good including the stats/facts.
- [x] **Contact** — reviewed 2026-07-15, desktop + mobile. Adinda: looks good, no issues.
- [x] **Footer** — reviewed 2026-07-15, desktop + mobile. One content addition requested and made: a
  newsletter subscribe blurb ("Subscribe to receive the latest news, itinerary updates, and exclusive
  specials straight to your inbox.") added above the email field, same styling as the "Also known as
  Mari Dive Cruise" line (`text-body-medium text-text-ondark-secondary`) per Adinda's ask. Hardcoded
  placeholder like the rest of the homepage — flagged in-file to become a Sanity `siteSettings`/footer
  field once that schema exists (Tier 4), not meant to stay hardcoded permanently.
- [x] General cross-check (spacing/hover timing/colors vs. the static build): covered implicitly across
  all the above section-by-section reviews, not run as one separate final pass — Adinda's session went
  section-by-section in page order instead, catching the same class of issues along the way.

**Full homepage QA pass now complete** — every section reviewed on both desktop and mobile, 2026-07-15.

### Testimonials refinements, requested after the QA pass closed out (2026-07-15)
Three real requests, all in `Testimonials.tsx`:
- **"Read more" was stretching every card, not just the one clicked.** Root cause: the track's flex
  container had no `align-items` override, so the default `stretch` made every card in the row match the
  tallest sibling's height whenever one expanded. Fixed with `items-start` on the track.
- **Cards should be a uniform height by default, with text truncated (ellipsis) — not each card sized to
  its own natural content length.** Restructured the data model: `excerpt`/`more` were two separate
  strings rendered as two stacked paragraphs — merged into one continuous `text` field per review (this
  was Adinda's explicit correction: "Read more" reveals the *same* paragraph in full, it doesn't append a
  second one). Truncation now via CSS `line-clamp-3` (native multi-line ellipsis, removed the old manual
  "..." endings from the copy) on that single paragraph; `line-clamp-2` added to the title too. Verified:
  card heights uniform at 277px across 7 of 8 cards (one title wraps to a 2nd line, 303px — flagged to
  Adinda as a residual minor non-uniformity, not yet resolved, see below). Confirmed expanding one card
  only grows that card (541px) while every sibling stays at its original height.
- **Wanted the carousel to loop — right arrow at the end goes back to the start, and vice versa.** Not a
  seamless clone-based infinite scroll (cards don't visually continue past the real last/first) — a
  discrete wrap on arrow click, matching what was actually described. First implementation attempt was
  wrong and shipped-then-caught-by-self-verification, not by Adinda: `goTo` originally detected position
  via "which card is closest to the track's left edge," which works fine mid-list but never actually
  reaches "last card" at max scroll once more than one card is visible per row (4 on desktop) — the wrap
  branch never triggered. Rewrote to check `scrollLeft` against the real `scrollWidth - clientWidth` max
  directly, independent of how many cards are visible at once. Verified both directions explicitly:
  clicking "next" at true max scroll (1249) returns to 0; clicking "prev" at 0 goes to true max (1249).
- Bonus (asked in the same request): arrow-click navigation changed from `behavior: 'instant'` to
  `'smooth'` — was the actual cause of the "snappy" feel Adinda flagged.
Verified clean throughout: `tsc --noEmit`, `eslint`.

**CORRECTED AGAIN, same session.** The `min-h` reservation "fix" above created a new, different bug:
Adinda caught it via screenshot — 1-line-title cards now had visible dead space between the title and
body (the reserved-but-unused half of the 2-line box). Two wrong approaches in a row before landing on the
real one — worth being explicit about the actual requirement this time: **no reserved/padded space
anywhere, ever; instead the body's truncation length dynamically compensates for however many lines the
title actually rendered**, so title+body always total the same number of lines (a 1-line title pairs with
a 3-line body, a 2-line title pairs with a 2-line body — both total 4).

This isn't achievable in pure CSS (no way to make one element's `line-clamp` depend on a sibling's
rendered line count without JS). Implemented via real measurement: each title gets a ref; a
`useLayoutEffect` (not `useEffect` — must resolve before paint, or there'd be a visible flash of the wrong
clamp count on load) measures each title's actual rendered height ÷ its computed line-height to get 1 or
2, stores it in state, and the body paragraph's `line-clamp` reads that value (`line-clamp-3` for a
1-line title, `line-clamp-2` for a 2-line one). A `ResizeObserver` on each title re-measures automatically
on any layout change (window resize, breakpoint shift) rather than only once on mount. Title itself is
never clamped or height-reserved — always shows in full, however many lines it needs.

Verified via direct height measurement (not just visual inspection): all 8 cards now exactly 277px, title
and body flush with normal spacing, no gap. Confirmed clean: `tsc --noEmit`, `eslint`.

### No instant expand/collapse — site-wide fix, requested + applied 2026-07-15
Adinda: every transition, including expand/collapse, should be smooth/eased, consistently across the
site — not just wherever it happened to already be built that way. Asked directly whether the earlier
pixel-measurement approach was good practice generally; answered directly (measured-at-runtime via
`getBoundingClientRect()`/`scrollHeight` is fine, hardcoded-in-source like the abandoned `min-h-[3.3rem]`
is not — the failure mode is the hardcoding, not the unit).

**Fixed:**
- **Testimonials "Read more"** — was an instant `-webkit-line-clamp` snap (genuinely can't be
  CSS-transitioned in any browser). Wrapped the paragraph in a container, animating that container's
  `max-height` between the measured clamped/full pixel heights instead — `overflow-hidden` clips the
  instant underlying clamp toggle to whatever height is currently mid-transition, so it reads as smooth.
  Verified via mid-transition sampling (not just before/after): 79px → 130px (mid) → 343px, confirming
  real animation, not a jump.
- **Nav mobile accordions** (Destinations, Resources) — were a plain `hidden` class toggle, no transition
  at all. Fixed with the grid-rows 0fr/1fr trick already proven in `Faq.tsx` (`overflow-hidden` on the
  inner `<ul>`, not the grid wrapper, so its own padding collapses too). Verified via mid-transition
  sampling: 79px mid-point on the way to 701px.
Both verified clean: `tsc --noEmit`, `eslint`.

**NOT yet fixed, flagged rather than silently skipped:** Nav's desktop mega menus (Destinations,
Resources), the mobile menu overlay, and Hero's mobile search takeover all still use an instant
`hidden`/`flex` toggle. These are full show/hide overlays, not simple accordions — fixing them needs real
enter/exit animation state (can't just add a transition class to a `display` toggle), and carries real
regression risk against the outside-click/Escape/focus handling already carefully built and tested this
session. Held for Adinda's explicit go-ahead rather than changed opportunistically alongside the two
lower-risk fixes above. Logged as a new "No instant expand/collapse" rule in `components.md` either way,
so this doesn't get reintroduced on new components even before the overlay cases are addressed.

### Nav QA — desktop findings (2026-07-15)
Confirmed working, no action: scroll-flip timing, all hover states (nav items, "Find a trip", mega-menu
triggers), Destinations mega menu's open/close/crossfade/images, close buttons on both mega menus, Hero
(scroll/zoom checked separately, fine).

**Fixed:**
- **Destinations mega menu "Scroll for more" / "Scroll to top" hints were decorative only**
  (`pointer-events-none`, not real buttons) — real wheel-scroll on the list itself worked fine
  (verified via a dispatched wheel event: `scrollTop` moved 0 → 203 correctly), but the visible
  hint text wasn't clickable, which read as broken. Converted both into real `<button>`s that scroll
  the list to bottom/top respectively — `Nav.tsx`.
- **Nav logo/wordmark didn't visibly do anything when clicked.** Not actually broken — Next.js's
  `<Link>` only resets scroll on an actual route change, and right now `/` is the only route that
  exists, so clicking "home" while already on it was a real no-op. Added an explicit
  scroll-to-top on click to all 4 home links (desktop icon + wordmark, mobile bar, mobile menu
  overlay) so it behaves like "home" regardless — harmless once other routes exist too — `Nav.tsx`.
- **"North Sulawesi" wrapped to 2 lines — two separate instances, both in `Hero.tsx`, not Nav.**
  Mobile instance found first (Hero's mobile destination-search takeover list) — traced via a real
  390px-viewport screenshot before touching code, since the visual pattern in Adinda's first
  screenshot didn't match Nav's own mobile accordion (which stacks name/tagline vertically and
  doesn't wrap). Fixed: destination name now `whitespace-nowrap` (never wraps), tagline gets
  `truncate` (ellipsis) if too long. Adinda then caught the **same bug's desktop twin** — Hero's
  desktop search dropdown (a separate JSX block, same dark-background/horizontal-layout pattern) —
  initially misdiagnosed as the Nav mega menu until Adinda corrected it; confirmed via the actual
  DOM/computed styles before fixing (not just re-reading source), then applied the identical
  `whitespace-nowrap`/`truncate` fix. Confirmed fixed by Adinda on both mobile and desktop.

Verified clean after all fixes: `tsc --noEmit`, `eslint`.

**Flagged, not a code fix:** Resources mega menu copy needs a real pass — Adinda flagged the current
placeholder text as wrong/uncertain, will edit herself. **Needs clarification, not yet actioned:**
Adinda mentioned Resources menu "needs something [inaudible/unclear] for managing" — possibly wanting
it to be CMS/Sanity-editable rather than hardcoded (which the Nav-as-editable-document pattern already
covers as planned Tier-4 work per `mari-project` skill), but asked her to confirm rather than guessing.

### Still open / needs Adinda's action — not blocking, don't lose track of these
- [x] **"English" `Language` document — created 2026-07-15, confirmed visible in Studio by Adinda.**
  Created via `sanity documents create` (CLI already authenticated locally). Doc ID `language-en`,
  `{name: "English", tag: "en", default: true}`.
- [ ] **Follow-up, explicitly deferred to a future session (after the Tier 4 pass, not blocking it):**
  Adinda doesn't yet understand what this document is *for* / what it actually changes on the site — fair,
  since multilingual itself is deferred/future-paid-add-on scope, so this only exists as a baseline entry
  the localization *scaffold* expects, with no visible effect yet. **Confirmed not blocking Tier 4** — it's
  unrelated to the schema types Tier 4 will build. Also flagged: a Studio "information icon" (likely a
  field-description tooltip) doesn't work — not investigated yet, deferred to the same future session.
- [x] **AI-crawler policy — resolved 2026-07-15, no action needed.** Adinda: wants AI crawlers (GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended) allowed, not blocked. Checked `robots.ts` directly: the block
  rules for all 4 are already commented out, and the active `userAgent: '*'` rule already allows `/`
  (only `/api/` and `/studio/` disallowed) — meaning all of them are already allowed today, by default.
  Nothing to change. Still needs the hardcoded `sitemap` URL updated once the production domain is
  confirmed (unrelated to the crawler-policy question).
- [ ] Verify Sanity Studio v6.4's bulk-edit/multi-select capability — asked, not yet researched.
- [ ] Decide whether to ship `llms.txt` (parked until real page URLs exist to list).
- [ ] CORS: add the production Vercel URL once deployed (currently only `localhost:3000` allowlisted).
- [ ] Sanity Studio UI localization (e.g. German for Stefan) — discussed as genuinely possible
  (`@sanity/locale-de-de`), not yet requested to build.
- [ ] Full icon-level accent-color customization (every icon branded, not just hover/active states) —
  discussed, flagged as bigger than a "simple pass," not yet requested.
- [ ] Destinations drag-swipe live-preview polish (see simplification note above).
- [ ] **Why Us card image re-cropping** (especially "Premium Comfort" / `why-us-dining.webp`) — Adinda's
  own task, explicitly deferred to a future **content pass**, not part of the current build-phase to-do
  flow. Don't raise it again until that phase.
- [ ] **Testimonials `TEST_ONLY_REVIEWS` dummy cards** — Adinda has NOT yet confirmed removal (explicitly:
  "I need to still confirm... I have not"). Leave in place until she says otherwise — don't remove
  proactively.
- [ ] **Resources mega menu — scope clarified 2026-07-15, not yet built:** it's not just the menu items
  list (`RESOURCE_LINKS`) that needs to be Sanity-editable — the descriptive copy panel next to it
  (currently hardcoded in `Nav.tsx`: eyebrow "Before You Set Sail", heading "Plan your voyage with
  confidence.", body paragraph) needs its own Sanity fields too. Copy itself stays as-is content-wise for
  now — just needs to become schema-backed instead of hardcoded, as part of the Tier 4 navigation/
  siteSettings schema work.
- [ ] **Nav link default-with-override principle, locked 2026-07-15:** nav items that conceptually
  correspond to a real page (The Boat, Private Charters, About, Schedule & Rates, Resources sub-items,
  etc.) should default-link to that page's real URL once its page type exists (e.g. `boatPage`), without
  an editor needing to manually pick it — the existing `link` object field (`objects/link.ts`, already
  supports internal-reference-or-external-URL) becomes the *override* for when an editor wants something
  different, not the only way to set the link. Not yet implemented — carry into the Tier 4 schema pass,
  needs the corresponding singleton page types to exist first.

### Reviews — in progress (Why Us done, rest of checklist still open); schema/Studio already reviewed
Schema was reviewed live in-browser by Adinda throughout, iterated on directly. Studio branding was
implemented per her direct requests. Homepage port review started 2026-07-14 (same day as the build) — Why
Us is reviewed and its bug fixed (see above); Nav, Hero, Destinations, FAQ, Testimonials, Contact, and
Footer still need an actual look in a browser — code-level checks (typecheck/lint/build) don't substitute
for that, especially for animation feel and touch/drag behavior on a real device.

---

## Session Time Log (for DRK sprint/hour-estimation calibration — see `drk-website` skill's `workflow.md`)

Adinda's own tracked estimate, not independently measured. Append future sessions here, don't recompute past
ones.

| Date | Session focus | Duration | Notes |
|---|---|---|---|
| 2026-07-14 | Sanity schema pass + Studio branding + theme.css port | ~2h15–2h30 | First full backend session on this build — established schema/Studio/branding conventions from scratch. Expect meaningfully faster on similar future sessions now that the patterns exist. |
| 2026-07-15 | Full homepage QA pass (every section, desktop + mobile) + fixes | **~2h** (Adinda's own tracked estimate, rounded up from ~1h48m measured mid-session) | **~1h of this was a false-alarm chase** (see below), not real QA/bug-fixing time. Once resolved, the actual QA pass covered all 11 sections (Nav, Hero, The Boat, Why Us, Destinations, Latest Articles, FAQ, Testimonials, CTA, Contact, Footer) and turned up ~10 real bugs total, all fixed same session. **Calibration takeaway, revises the 2026-07-14 row's own assumption:** that earlier entry expected future sessions to be "meaningfully faster... now that the patterns exist" — true for *coding* patterns, but a full QA pass has its own largely-fixed cost regardless of how established the code conventions are, because QA time is dominated by *discovering* each section's specific bugs, not by applying known patterns. Budget a full single-homepage QA pass at **~2h** even on a well-patterned codebase, not scaled down just because earlier sessions established good conventions. Sub-note: a "barely any content on mobile" report that looked like a WebKit/iOS bug turned out to be `allowedDevOrigins` (dev server blocking LAN-IP requests), unrelated to any browser engine — see `references/troubleshooting.md`'s localhost-vs-LAN-IP check, which exists specifically to prevent this cost recurring. |

---

## End-of-session retrospective — 2026-07-15

Requested by Adinda as a standing close-out practice (now also codified as a workflow — see
`drk-website` skill's `references/workflow.md`, "End-of-session retrospective"). This covers *process*
learnings from the session as a whole — the specific bugs/fixes are already logged inline above and in
the shared skill's `components.md`/`troubleshooting.md`; this section is for what doesn't fit as a single
bug-fix entry.

**New learnings, not yet captured elsewhere this session:**

- **Build QA task lists in actual page/DOM order, not whatever order a checklist happens to already be
  in.** This session's original QA checklist (written before today) omitted The Boat and CTA entirely and
  didn't match the real section order — caused real confusion mid-session (skipped The Boat, had to
  correct course into Destinations before Nav/Hero were even confirmed page-order-correct). Before
  starting any future QA pass, verify the task list against `page.tsx`'s actual render order first.
- **When a bug report names a UI pattern that exists in more than one place on the site (e.g.
  "destinations list" — exists in Nav's mega menu AND Hero's search dropdown, both showing name+tagline),
  don't assume which instance from the report alone.** The North Sulawesi desktop-wrap bug was initially
  misdiagnosed as the Nav mega menu; it was actually Hero's search dropdown, a separate component with a
  similar look. Confirm the exact component via the user's actual evidence (screenshot, DOM inspection)
  before fixing anything — this is a *diagnosis* discipline, distinct from the already-documented
  "grep all siblings before calling a fix done" rule, which is about making a fix *complete* once you
  already know what's broken.
- **Any fix that adds a new scroll/focus/animation-triggering effect needs a cold-load re-test, not just
  a re-test of the specific interaction the original bug was about.** The Destinations tab-scroll fix
  (a real, correct fix for its own bug) immediately regressed into a *new* bug — an unconditional scroll
  on page load — because it was only tested against the "click a tab" path, not a fresh page load. Add
  "reload the page cold and confirm nothing moves unexpectedly" as a standing step after any interactive
  fix involving `scrollIntoView`/`scrollTo`/`.focus()`.
- **CDP (Chrome DevTools Protocol) driven via Python + `websockets`, with real device-metrics emulation
  and API monkey-patching, is a proven, fast, reliable diagnostic toolkit for this kind of work** — used
  successfully this session for real mobile-viewport testing, wheel/drag-event simulation, and capturing
  an exact stack trace for an otherwise-invisible scroll bug. Worth reaching for early once a bug survives
  one round of source-reading, rather than continuing to read/theorize (see
  `troubleshooting.md`'s "Unexplained scroll jumps" for the concrete technique). This supersedes the
  iframe-harness approach as the default automated-testing method for anything beyond a static screenshot.
- **For future page builds (Tier 4 onward): treat `components.md`'s "Bake in from the start" section as a
  pre-build checklist, not just a QA reference.** Every pattern in it was found reactively during QA this
  session; building new pages against that checklist *while writing* the component, not after, is the
  actual lever for the "fewer bugs, faster" outcome Adinda asked about — QA existing to catch these has a
  real, roughly fixed cost per pass (see the time-log row above), so preventing them at build time is
  cheaper than catching them later.
- **Consider QA-ing each section shortly after building it, rather than batching all sections into one
  large QA pass at the end**, for Tier 4 pages onward. This session's single ~2h pass across 11 sections
  found bugs that would have been cheaper to catch and fix individually, closer to when each section was
  built — a recommendation for how to sequence future page-building work, not a retroactive complaint
  about this session.

---

## 2026-07-14 — Repo scaffolded, stack verified, 3 open questions resolved

Full detail lives in `CLAUDE.md` (stack table, Next 16 convention deltas, resolved findings) — not
duplicated here. Summary: Next.js 16.2.10 + Sanity v6.4.0 confirmed correct (not the 15/v5 the `drk-website`
skill still says); `cacheComponents` decided OFF for launch; embedded Studio confirmed to need no custom
auth (Sanity's own SSO+CORS); localization plugin compatibility only partially verified, smoke-test before
relying on it. All queued for the next `drk-website` skill-update round in
`_handoff/drk-website.md` (moved here from the old repo 2026-07-14 — this is now the single live copy).

## Today's work session — 3pm–6pm (3h), schema-pass day

**T&C + Schedule & Rates: ≤1h combined.** Content already sourced/verbatim for T&C (16 sections, mechanical
port). Schedule & Rates simplified same session: INSEANQ is a copy-paste embed, not a real integration —
schema just needs one `embedCode` field (raw string). The "Calico Jack sidebar" layout question is
explicitly deprioritized — ship the simple layout, revisit only if time allows later, not blocking.
Adinda still needs to email INSEANQ about filtering (separate, non-blocking, her own to-do).

**Full Sanity schema pass: skeleton only, ~1.5–2h.**
- In scope: `sanity init` + Studio booting at `/studio/[[...tool]]`; all ~15 planned types defined with
  *core* fields only, registered in the schema index; the reusable SEO object; the page-builder array shell
  with 1–2 stub block types (not the full catalog); site-wide singletons (`navigation`, `siteSettings`,
  `announcementBar`); a generic `redirect` type; default (uncustomized) Portable Text wherever rich text is
  needed; smoke test that Studio opens clean and every type is creatable.
- Explicitly deferred (all non-destructive to add later): field-level validation beyond the bare minimum,
  custom Studio previews/input widgets, the minimum-content-guard pattern, the full page-builder block
  catalog, Portable Text heading/alignment customization (see below), localization plugin install, any
  actual GA/GSC/JSON-LD wiring logic (that's Next.js component work, not schema).

**Portable Text heading/alignment customization: explicitly NOT today.** Pair with whichever day first
needs genuinely rich formatted content — Blog is the most rich-text-heavy page in the inventory, the
natural candidate.

**Localization plugins: NOT installed today.** `sanity-plugin-internationalized-array` +
`@sanity/document-internationalization` compatibility is still only partially verified (see CLAUDE.md).
Multilingual itself is deferred/future-paid-add-on scope anyway — no reason to build on an unconfirmed
dependency now. Structure fields so localization *can* be added later; don't wire the plugins.

## Content-model rule: three-tier rich text (locked 2026-07-14, Adinda's framing)

Not one global Portable Text config — three distinct tiers, decide which applies by field, not per-page:
1. **Plain string** — headings, labels, CTA text, eyebrows. No rich text at all.
2. **Constrained rich text** (most body copy — card descriptions, FAQ answers) — Portable Text, paragraph +
   basic marks (bold/italic/link) only. No heading styles, no alignment override — layout/CSS already
   governs presentation, and overriding it per-entry would fight the design system.
3. **Full rich text (headings + alignment)** — reserved for genuinely long-form, structurally flexible
   content: T&C body, Blog post body, and the page-builder's dedicated "Rich Text" block for overview-style
   sections (Private Charters, possibly About's story text).
Practically: every rich-text field uses default Portable Text today (tier-2 behavior). Only tier-3 fields
get the heading/alignment customization layered on later — same field type, enhanced config, nothing gets
rebuilt.

## Pre-launch to-dos surfaced during schema-review session (2026-07-14)

- [ ] **Verify Sanity Studio v6.4's actual bulk-edit / multi-select capability** — Adinda asked; not yet
  researched (didn't find it documented in the skills checked so far). Look up before answering, don't guess.
- [x] `app/robots.ts` created (Next.js dynamic Metadata Files API, default allow-all + `/api/`/`/studio/`
  disallowed). **Still open:** [ ] decide the AI-crawler policy (GPTBot / ClaudeBot / PerplexityBot /
  Google-Extended — allow increases AI-citation chances, block prevents AI-training use) — the block rules
  are stubbed out commented in the file, ready to uncomment once decided. See `drk-seo` skill's
  `aeo-considerations.md`. Also update the hardcoded `sitemap` URL once the production domain is confirmed.
- [ ] **Decide whether to ship an `llms.txt`** file at launch (emerging AEO practice, static root file like
  `robots.txt`) — needs real page URLs to be worth building, so parked until more page types exist.
- [x] **`page` type's rich text body upgraded** — resolved by pulling the actual spec directly from the
  live MVP repo (`atlas-drkdigital/mari-website-mvp`) instead of waiting on a paste: H1-H4/Quote styles,
  underline/strike/code marks, align + text-color annotations, sized/aligned images, HTML embed block.

## Tier 4 backlog additions from schema-review session (2026-07-14)

Captured while reviewing the schema locally, not built yet (Tier 4 is deferred — Adinda will resequence
later):
- **Destination page** and **Itinerary page**: each needs an optional INSEANQ `embedCode` field (same
  pattern as `scheduleRates`), so availability can be shown/filtered in context, not just on the dedicated
  Schedule & Rates page.
- **Private Charters page**: needs its own INSEANQ `embedCode` field too (filtered sync).
- **New page type: "Specials"** — an Atlas-website page candidate, essentially a filtered INSEANQ sync view.
  Cheap to add ("just a matter of filtering and sync") — flagged as a likely near-free addition once
  Destination/Itinerary embed wiring exists. Not in the original page inventory — add to `atlas-website`
  skill's page checklist when Tier 4 resumes.
- INSEANQ filtering email sent to Andrew (Adinda's own to-do, non-blocking) — placeholder `embedCode`
  content is fine until his response arrives.

## Sanity project created, Studio embedded (2026-07-14)

New Sanity project **`kb8eim50`** ("Mari Liveaboard"), dataset `production`, fully separate from the live
MVP's project (`sjkpkyaw`) — Adinda's call: full isolation, new repo + new Sanity project (+ new Vercel
project later at deploy time), zero shared state with the currently-live site. Studio embedded at
`/studio/[[...tool]]`, smoke-tested (200 response, boots clean, zero schema types yet). Upgraded off the
CLI's default `sanity@5`/`@sanity/vision@5` to the verified `6.4.0` per CLAUDE.md's stack table. Full
connection details + redo steps: see `SANITY-SETUP.md` (new file, root of repo).

## Studio editor-organization — deferred to last, confirmed safe (2026-07-14)

Field `title`/`description`/tab-grouping and the Structure Builder (sidebar navigation) are presentational
metadata only — changing them later costs no migration. What must be reasonably right from today: the
actual field `name` keys and document type `name`s, since renaming those after real content exists needs a
migration script. Today's skeleton pass already handles this; labeling/grouping polish is legitimately a
finalize-last task — better done last anyway, once the full type list is visible.
