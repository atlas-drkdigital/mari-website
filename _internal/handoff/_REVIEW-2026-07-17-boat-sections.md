# Boat page — section-by-section review + open questions (2026-07-17)

**Model:** Opus 4.8 (1M context). **Read order:** go section by section; each has its own
`WHAT TO REVIEW` and `OPEN QUESTIONS`. Nothing here is committed yet.

## ⚠️ Read this first — the one thing that changed my whole session

`BoatHero.tsx` was rebuilt on 2026-07-17 because it used **invented utility class names** that Tailwind
silently emits nothing for. **That bug was never swept out of the other five boat sections.** It is still
live. Verified by reading `globals.css`'s block boundaries, not by guessing:

- `:root` = lines 77–146 → **primitives** (`--beige-200`, `--navy-950`, …). Plain CSS vars. **No utilities.**
- `@theme` = lines 148–330 → **semantic tokens** (`--color-*`, `--text-*`, `--spacing-*`). Utilities.

So every one of these renders **nothing at all**:

| Class | Where it was | Real effect |
|---|---|---|
| `py-120` | BoatCabins, BoatFaq, BoatSpecs | **Zero vertical padding** — no 120 on the scale |
| `border-beige-200` | BoatCabins, BoatFaq, BoatSpecs | **Invisible dividers** |
| `bg-navy-950/90` `text-beige-50` `bg-beige-150` `text-beige-150` | BoatGallery (8 uses) | **Transparent lightbox backdrop, invisible text** |

**Status: fixed in BoatCabins / BoatFaq / BoatSpecs. STILL BROKEN in BoatGallery** (see §2).

---

# §1 — CABINS · Figma `778:8762` · ✅ REBUILT, ready to review

**Files:** `src/components/sections/boat/BoatCabins.tsx` (rewritten), `src/app/globals.css` (+1 token).
`tsc` + `eslint` clean. **Not yet rendered in a browser** — see "Not verified" below.

### Good news: the schema was already right
`cabinType.ts` already matches this node exactly — `count`, `maxGuests`, `description`, `images`, and the
five named feature fields with code-chosen icons. **No schema change was needed.** Your 2026-07-15 lock
held up.

### What I changed and why
The old `BoatCabins.tsx` was written from the schema spec, never from the node. Eight real drifts:

| | Was | Figma says | Why it matters |
|---|---|---|---|
| Section padding | `py-120` (dead) | `pt-120 pb-160` | Section had **no padding at all** |
| Tabs | `text-button-small` (12px) | **14px** (`text-button`) | Wrong size |
| Tab inactive | `text-text-secondary` (stone) | `action-primary/55` | Wrong colour family |
| Tab track | `border-transparent`, `gap-16` | continuous 2px track, `px-12`, no gap | Underline was broken into segments |
| Description | `text-body-large` (16px) | **14px** (`text-body-medium`) | Wrong size |
| "3 Cabins · Max 2" | `text-body-small text-text-secondary` | **eyebrow** 11px/1.375/action-primary | Wrong style entirely |
| Carousel | **absent** — rendered `images[0]` only | 2 arrow pairs | Feature missing |
| Row icons | **absent** | 5 icons | Feature missing |
| Dividers | `border-beige-200` (dead) | `#ece4d6` | Invisible |

### The icons were in Figma, exactly as you said
No `icon-cabin-*` assets existed locally and no icon library is installed. Rather than fake them, I pulled
all five straight off the node into `public/assets/`: `icon-cabin-bed / -deck / -window / -bathroom / -air.svg`.
Verified they're real SVGs, not error pages.

### New design token — needs your sign-off
Figma's spec-row divider is `#ece4d6`. **No semantic token resolved to it** (`border-default` is
`--beige-300` `#dbcdb2`, visibly darker). You picked "name it", so `@theme` now has:
`--color-border-subtle: var(--beige-200);` → used as `border-border-subtle`.

### 🔴 OPEN QUESTIONS — §1

1. **THE BIG ONE — what do the two round arrows beside "Deluxe cabin" actually do?**
   I inferred they step through **cabin types** (Deluxe ↔ Superior), mirroring your Gallery instruction
   that the paired arrows move between *categories* and only the on-image arrows move between *images*.
   **You never confirmed this for Cabins.** If it's wrong the fix is one line (`stepType` → `stepImage`).
   This is the single most likely thing I got wrong.
2. **Deluxe "Max. 2 Guests" contradicts `mari-core`.** Figma says 2. `mari-core` gives Deluxe an *extra
   bed* and says it suits "couples, **families**, or small groups" — implying 3. The arithmetic backs
   Figma (3×2 + 4×2 = 14 = confirmed max; at 3 you'd get 17). But **`mari-core` states no Deluxe
   per-cabin max at all** — Figma's "2" is unsourced. **Question for Serge.** Built with 2 for now.
3. **`mari-core` says *Superior* has "windows"; Deluxe never names an aperture.** That's the opposite of
   a Superior-porthole/Deluxe-window split. "Porthole" appears nowhere in either skill.
4. **Superior's amenity list is shorter than Deluxe's** ("Sea View" vs "Sea View & Natural Light") —
   looks like copy drift, not a real product difference, since Superior is the one with confirmed windows.
5. Figma's spec row says `leading-[22.4px]` (1.6) but its own named style Body/Medium says 1.8. I used
   **1.8** (`text-body-medium`), because you corrected `globals.css` to 1.8 on 2026-07-17 to match Figma's
   named style. Internal Figma inconsistency — worth a look.

### ⚠️ NOT VERIFIED (be sceptical of my "done")
- **Never opened in a browser.** `tsc`/`eslint` green proves nothing about layout — per your own rule,
  a check that can't fail isn't a check. **Review desktop AND mobile.**
- **Content not seeded. Images not uploaded to Sanity.** The section will render from whatever is in
  Sanity now, which may be empty. This is a real gap against the full-wire-per-slice rule — I ran out of
  room before the seed.

### Content ready to paste (verbatim from `mari-website`, no invention)
- **Deluxe desc:** "With a convertible double or twin bed layout plus an extra bed, Mari's Deluxe cabins
  suit couples, families or small groups traveling together. Every one sits on the main deck with a sea
  view, natural light, private air conditioning and an ensuite bathroom with hot water."
- **Superior desc:** "Superior cabins use a bunk-bed setup for up to 2 guests each, a natural fit for solo
  travelers and dive buddies sharing a room. Like every cabin on Mari, they're on the main deck with a sea
  view, private air conditioning and an ensuite bathroom with hot water."
- **Counts:** Deluxe 3 / Superior 4 (= 7 ✓). **Beds:** Deluxe "Convertible Double or Twin Bed + Extra Bed";
  Superior "Bunk Beds · Up to 2 Guests". *(Voice rule: no single dash — keep the `+`.)*

### Images — use `02. IMAGES\cabins` (your call), 1416px target
Slot is a fixed **708px** → **1416px @2×**. Six of seven pass at ~1535px.
🔴 **`mari-liveaboard-cabin-superior-bathroom-001.jpg` is 1025×1534 — FAILS.** It's a *portrait*, and in a
cover-cropped slot a portrait is **width**-bound, so orientation buys it nothing. Upload with caption:
`⚠ NEEDS UPSCALE — current 1025w, target 1416w (cabins carousel @2x)`.

---

# §2 — GALLERY · Figma `778:8845` · ✅ REBUILT (this section was written BEFORE the rebuild)

> **⚠️ CORRECTION 2026-07-17, after an interruption.** This section was written at 18:37 saying
> "NOT REBUILT". The rebuild then happened at 18:43 and the session was cut off before the doc was
> updated. **Everything below marked "not yet applied" IS NOW APPLIED** and committed in `53bab8b`:
> `sizes` → `708px`, heading → `text-editorial-h3`, all 8 dead classes replaced (lightbox backdrop
> and text now actually render), `pt-96 pb-160`, tabs at 12px.
> **Still true / still open:** the two OPEN QUESTIONS below (the `gallery-photo` tab, and where
> "VIEW FULL GALLERY" links). The button is **deliberately omitted** in code with a comment saying
> why — building a button to nowhere is worse than no button. Nothing here has been rendered.

### The screenshot you sent is not our render
Your gallery screenshot shows **navy `#1b2a4a` text on black**. The node sets **no background** — it
inherits cream `bg-page`. That's the Figma *frame on a dark canvas*, exactly the trap already documented
in CLAUDE.md. **I did not build a dark section.** Flag if you actually meant one.

### Confirmed: the image block is identical to Cabins
`708.144 × 532.072` — **the same block**. That matches your "same treatment as the deluxe cabin" exactly.
🔴 **But `BoatGallery.tsx` currently declares `sizes="55vw"` (→792px).** Wrong per the design. Both
sections should say **708px → 1416px @2×**.

### Your `_needs-upscale` folder is exactly self-consistent
All six files in it (1176, 1264, 1312, 1023, 1068, 1219) are **precisely** the ones under 1416. Your
`1600w__` / `2400w__` prefixes already encode targets — I'll use **your** numbers in captions, not my 1416.

### Other confirmed deltas (not yet applied)
- Gallery tabs are **12px** (`text-button-small`) — genuinely different from Cabins' 14px. Not a mistake.
- "Plenty of space for everyone" is **Editorial/H3 23px** → `text-editorial-h3`, **not** `text-display-h3`.
  Current code uses display. This is exactly the ramp trap in CLAUDE.md.
- Section is `pt-96 pb-160`, left col `pl-160 pt-64`, gaps 48/64.
- Needs a **"VIEW FULL GALLERY"** button (48px, bordered, 12px text) — absent today.
- The 8 dead classes listed at the top are all here, incl. the **transparent lightbox backdrop**.

### 🔴 OPEN QUESTIONS — §2
1. **`gallery-photo/` has exactly 1 image** (`photo-01-guests-sunset-drinks.png`). Which tab? "Others"?
   The five tabs are The Boat / Dining / Diving / Relaxation / Others, and the folders are
   `gallery-boat`(7) `gallery-dining`(4) `gallery-diving`(4) `gallery-relaxation`(7) `gallery-photo`(1).
   `gallery-photo` → "Others" is my guess. **Not building on a guess.**
2. **Where does "VIEW FULL GALLERY" link to?** No `/gallery` route exists.

---

# §2b — DECISIONS APPLIED 2026-07-17 (after the interruption)

Adinda answered the blocking questions. What changed, and what's still open:

| Question | Answer | Applied? |
|---|---|---|
| Cabins arrows step what? | **Cabin types** (Deluxe ↔ Superior) | ✅ already built that way — no change |
| FAQ layout variant names | **`default` / `categorized`** | 📝 recorded only — the field doesn't exist yet (§4 not started) |
| Lightbox | **Install YARL** | ✅ `yet-another-react-lightbox@3.32.1` installed, not yet wired |
| `gallery-photo` (1 image) | ~~Drop the 'Others' tab~~ → **superseded**, see below | ✅ hide-empty-tabs instead |
| `--color-border-subtle` `#ece4d6` | keep (no objection) | ✅ in `globals.css` |
| `bg-page` over Figma's `beige-50` | keep (Figma is the stale side) | ✅ |

## ✅ RESOLVED — 'Others', and the copy was never orphaned
Both of my framings above were wrong. Adinda's corrections, 2026-07-17:
1. **Don't drop the category — hide empty tabs.** The value being there is fine; the tab just shouldn't
   render while it has no images. Reverted the schema drop; `BoatGallery` now filters tabs to those with
   images. General rule, no special-casing. Now in CLAUDE.md.
2. **"Good to know" is not orphaned copy — it's the FAQ section's eyebrow.** Recorded for §4. The Wi-Fi /
   desalinator / hot-water paragraph stays seeded on the (hidden) Others tab as placeholder; it is real
   `mari-core` fact and can move into FAQ content when §4 is built. Nothing needs deciding here.

**No write token needed after all** — `boat-mari` keeping its 5th tab is now correct, not a defect, so the
seed does not need re-running. (For reference if a seed IS needed later: `.env.local` has only
`NEXT_PUBLIC_SANITY_DATASET` / `NEXT_PUBLIC_SANITY_PROJECT_ID`, and the scripts use `getCliClient`, so
they need `npx sanity login` first.)

## ⚠️ The gallery renders NOTHING right now, and that's correct
Zero images are tagged in Sanity (`gallery` is null on `boat-mari`), so every tab is empty, so every tab
hides, so the section returns null. **Expected.** It resolves when images are uploaded and tagged — don't
debug it.

---

# §3 — LAYOUT & SPECS · Figma `778:8878` · 🟡 PARTIAL

**Applied:** `py-120` → `py-[120px]`; divider → `border-b-[0.75px] border-accent-subtle`.

**Correction I made to myself:** I first swept this to `border-subtle` (`#ece4d6`). **Wrong.** Figma's
`Block/FAQItem` uses **`accent-subtle` `#c9b89a`** on a **bottom** border. `border-subtle` is right for
Cabins' spec rows only. Same fix applied to `BoatFaq.tsx`.

### Not done
- 🔴 **The topo texture is missing.** The node has `--texture-light` at **opacity-20**, `bg-size
  1024×682.75`, top-left. `BoatSpecs.tsx` has no texture at all. `globals.css` documents the exact recipe.
- 🔴 **No LAYOUT tab.** Only Specifications exists. Needs tab + heading + deck-plan image.
- Deck plan: **`G:\My Drive\##MARI\02. IMAGES\deck-plan\mari-deck-plan.png`, 2000×2000, 1230KB** — the
  only non-`_archives` file, as you said. Not uploaded.

### 🔴 OPEN QUESTIONS — §3
1. **Background conflict — I deliberately did NOT follow Figma.** The node says `#fdfcfa` (`beige-50`).
   But `globals.css` records *your* 2026-07-16 decision: `bg-page` was moved **off** `beige-50` **onto**
   `beige-100 #fbf8f2` because beige-50 "read too white". So Figma is the stale side and I kept
   `bg-bg-page`. **Confirm.**
2. **What heading goes on the LAYOUT tab?** Not in `mari-core`, not in the node.
3. Should the deck plan be zoomable/lightboxed? It's 2000×2000 — detail is unreadable inline.

---

# §4 — FAQ · Figma `778:8902` · 🔴 NOT STARTED

Deliberately not started: **I did not pull the node.** Per your own standing rule I won't build from a
screenshot + description. What I understand from your message (to confirm):
- Split layout: category list **left** (vertical, active = left border bar), Q&A accordion **right**.
- Dark navy section w/ `texture-dark`; reuses the homepage FAQ accordion; "READ ALL FAQ" button.
- **Mobile: categories become horizontally draggable chips, same as Destinations.**
- You want this named as a **reusable layout variant** ("split / two-column-with-categories") because the
  pattern repeats site-wide.

### 🔴 OPEN QUESTIONS — §4
1. **What should the two layout variants be called?** You said "just needs to be named differently" but
   didn't name them. This is a schema field name → **expensive to change later** once content exists, per
   the 80/20 rule. **This one is worth your 2 minutes now.**
2. Is the variant chosen **per-section by the editor**, or fixed per page type?

---

# §5 — SUB-NAV / NAV BAR · Figma `778:8706` · 🔴 NOT STARTED

You said build it if I'm confident. **I'm not confident enough to build it blind, and here's the honest
reason:** the screenshot shows a sub-nav (OVERVIEW / CABINS / GALLERY / LAYOUT / SPECS / FAQ) pinned to the
bottom of the hero, and you said the floating behaviour **has no mockup**. Building an unmocked sticky
interaction from a still frame is exactly how the first boat-page pass went wrong.

**Noted from your message:** conventions **supersede Figma** for type/spacing. Agreed — that's already how
I treated the `bg-page` conflict in §3.

### 🔴 OPEN QUESTIONS — §5
1. **Scroll behaviour:** does the sub-nav detach from the hero and stick to the top on scroll? Does it sit
   *under* the main nav or *replace* it? Does the main nav hide?
2. **Active state:** scroll-spy (highlights the section you're in), or click-only?
3. Sanity-driven or derived from which sections have content? (Deriving it means it can't go stale.)

---

# §6 — CROSS-CUTTING

## 🔴 DECISION #1 — the lightbox. This is the biggest open item.
Researched properly (npm + GitHub verified 2026-07-17, not training data). **I did not install anything —
adding a dependency to a client build is your call.**

**Recommendation: `yet-another-react-lightbox`.**

| | YARL | react-photoswipe-gallery | lightgallery |
|---|---|---|---|
| Published | **2026-07-08** | photoswipe core **2024-05-24** 🔴 | 2025-10-01 |
| Weekly | 454k | 53k | 89k |
| Size | **12KB, 0 deps** | ~20KB | 7.9MB |
| React 19 | **Explicit peer** | Never claimed | n/a |
| Captions + filmstrip | **Both native** | Neither 🔴 | Both |
| License | MIT | MIT | **GPLv3** 🔴 |

- **`lightgallery` is GPLv3** — disqualified for a commercial client site (copyleft or paid licence).
- **PhotoSwipe core hasn't shipped to npm in 26 months**; its caption plugin last published **2022**.
- **Bespoke is ~600–900 lines** (focus trap, iOS scroll lock, swipe velocity). Wrong trade before Jul 28.

**Honest caveats:** YARL's captions **overlay** the image and **split title (top) / description (bottom)** —
not one block below. Getting your "title + description together" needs `render.slideFooter` (supported).
And YARL's **filmstrip isn't independently swipeable on mobile** ([open issue #398]) — the common pattern is
to hide it on mobile anyway (`thumbnails: {hidden: true, showToggle: true}`).

**Sub-question:** you asked for the cabins lightbox **per cabin type**, but the gallery lightbox to pull
**all categories combined**. Confirmed — those are different and both are noted.

## 🔴 DECISION #2 — where do cabin images live?
`_website-ready/boat-page/cabins-deluxe/` and `cabins-superior/` are **empty**. You said use
`02. IMAGES\cabins`. Fine for now, but the two folders will drift. Worth deciding the canonical home.

## 🟡 Note — parallel session
`boatDefaults` appeared mid-session from another Claude session. Per the commit rule I have **not**
committed it — only the session that wrote it knows what its message should honestly say.

## Nothing is committed
Working tree has: `globals.css` (+token), `BoatCabins.tsx` (rewrite), `BoatFaq.tsx`, `BoatSpecs.tsx`
(2 fixes each), 5 new icon SVGs. `tsc` + `eslint` green. Say the word and I'll commit with an honest
`wip:` message noting it's unreviewed and unrendered.
