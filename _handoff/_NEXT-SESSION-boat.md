# NEXT SESSION — Boat page, sections 3–6 (Cabins → Gallery → Specs → FAQ)

## 📋 KICKOFF PROMPT — paste this into the new session, nothing else needed

```
Mari website build. Read CLAUDE.md + AGENTS.md first.

Load skills: mari-project, drk-website, atlas-website, mari-core, mari-website

Then read, in this order:
1. _handoff/_NEXT-SESSION-boat.md  <- this brief. Hero + Overview are DONE and
   APPROVED. Sections 3-6 are the task.
2. CLAUDE.md's 2026-07-17 sections -- each one exists because a session burned
   time on it. Read them BEFORE writing any class name or debugging anything:
     - "Building a section: ASK FOR THE FIGMA LINK + SCREENSHOT FIRST"
     - "Tailwind: THE CLASS NAME MUST EXIST"
     - "A schema field that nothing renders is a promise, not a feature"
     - "Real-device testing: PRIVATE TAB FIRST"  <- newest; cost most of a session
     - "Post-slice SEO pass"
3. src/components/sections/boat/BoatHero.tsx and BoatOverview.tsx <- the two
   REFERENCE implementations. Copy their patterns; don't re-derive them.
4. MANAGER.md's ACTIVE QUEUE + the four RESOLVED 2026-07-17 blocks.
5. _ADINDA-TODOS.md  <- what's blocked on her (Sanity CORS, the open decisions)
6. every other _handoff/*.md

FIRST: restart the dev server clean (kill :3000, rm -rf .next, npm run dev),
then verify / = 200 AND /boats/mari = 200.

WORKFLOW -- Adinda's standing rule, do not skip:
Build ONE section at a time. Before each one, ASK HER for the Figma node link
+ a screenshot, then pull get_design_context on that node for exact values.
Never build from a node NAME. Show her the section, get approval, then move on.

TASK -- boat page sections 3-6, in this order:
  3. Cabins (778:8762)          4. Gallery (778:8845)
  5. Layout & Specs (778:8878)  6. FAQ (778:8902)
All four currently exist but were built from node NAMES with INVENTED class
names, and are broken the same way the hero was (dark text, collapsed gaps).
Each needs a rebuild against real tokens, not a patch. Verified example --
BoatCabins.tsx alone has four classes that emit NOTHING: py-120,
text-body-small, text-body-base, border-beige-200.

Ask Adinda for the Figma link + screenshot for Cabins to start.
```

**⚠️ TIME/SCHEDULE — say this out loud Monday morning, do not absorb it.** Three sessions on 2026-07-17
produced Hero + Overview + `boatDefaults` + `galleryTabs` + the image pipeline. **Sections 3-6 have not
started.** MANAGER.md already flagged that the Jul 20 spill was "materially bigger than the 1-3h Adinda
accepted" — it is bigger again now, and **Mon Jul 20 was ALREADY the pressure point** (destination day
expected to bleed, plus the compact nav + sticky sub-nav, 2.5-3.5h, still not built). **Re-cut Monday with
the real number in hand.** The cut order is in MANAGER.md ("The natural flex").

---

_Updated 2026-07-17 (3rd session of the day). **Repo clean at `23d6203`** — `tsc` ✅ `eslint` **0 errors**
✅ `sanity schema validate` 0/0 ✅ · dev server restarted clean, `/` + `/boats/mari` + `/studio` all 200._
_Model: Opus 4.8 (1M context). Recommend Opus — this is design-judgement work with a review loop._

---

## ✅ DONE — approved by Adinda, do not redo

- **Hero** (`459134a`, `1b20c04`, mobile fix in `59e7821`, **+40px mobile in `f757be1`**) — approved.
  Breadcrumb, scrim, stats strip, `data-reveal="left"`, `quality={80}`.
  **`translate-y-[40px] lg:translate-y-0`** — a transform, NOT padding. Under `justify-center`, 40px of
  padding moves content only ~20px, and none at all once content exceeds `min-h-dvh`.
- **Overview** (`164acbf` → `3e82084` → `f757be1`) — rebuilt from the real Figma spec. **Approved**, incl.
  the 3:2 image cap and the read-less scroll.
- **`src/lib/tokens.ts`** — the `{boat}`/`{destination}` resolver. **It never existed**; the schemas had
  promised it since 2026-07-16. Verified rendering "Life aboard Mari". **Destination inherits it — don't
  rebuild it.**
- **`RichText.tsx`** — renders EVERY richTextFull option. Previously had **no block styles at all**.
  **+ `mt-8 first:mt-0` on every editorial heading (`f757be1`), site-wide, approved.** A margin not a gap:
  a gap is symmetric, but a heading belongs to the text BELOW it. **Line-height is SETTLED — Adinda:
  "line-height is not it at all." Do not touch it.**
- 🔵 **SITE-WIDE PATTERN: read-less scrolls to the top of its containing section** (`f757be1`, approved).
  **Explicitly NOT accordions.** **Not yet extracted to a shared component — ONE consumer today.
  Destination is the free moment to extract it; do it there.**
- **`src/sanity/linkAnnotation.ts` (`23d6203`)** — `richTextFull` had **NO LINK OPTION AT ALL**; tier 3 was
  missing what tier 2 had. Cause: declaring `marks.annotations` **REPLACES** Sanity's defaults (link is a
  default) rather than merging. **Same trap applies to `styles`/`lists`/`decorators`.** One shared
  definition now serves both tiers. Also widened `url` validation to allow relative + mailto/tel.

## ✅ RESOLVED 2026-07-17 — was "needs review", now closed

1. ~~**"Read more" on MOBILE.**~~ **IT WAS THE PHONE'S CACHE. There was never a code bug.** Adinda
   confirmed: *"incognito fixes it."* **This burned most of a session** across three wrong theories.
   🔴 **STANDING RULE NOW IN CLAUDE.md ("Real-device testing: PRIVATE TAB FIRST"): on ANY real-device bug,
   ask for a Private/Incognito reload BEFORE investigating anything.** It outranks the localhost-vs-LAN
   check, which actively misleads here (it surfaced two real-but-innocent origin problems).
   **The tell was misread:** she reported a missing CSS change AND a missing JS behaviour. One stale bundle
   explains both; no code bug explains both. **Two symptoms with no shared mechanism ⇒ suspect the build
   the device is running.**
2. ~~**The typography corrections.**~~ Line-height **confirmed correct and deliberately unchanged**
   (body-large/medium 1.8 in the SERVED css). The 8px heading top margin is in and approved.

## 🔴 STILL NEEDS ADINDA — open decisions, do NOT resolve unilaterally
All four now live in **`_ADINDA-TODOS.md` (#11–14)** — that file is the queue for anything only she can do.
1. **The collapse cap `max(240px, 60dvh)`** — her number, still never reviewed at that value on a screen.
2. **The Overview eyebrow** — Figma *"Liveboard Indonesia Overview"* vs our *"Premium diving at exceptional
   value"*. A Sanity value, 10 seconds either way.
3. **The editorial ramp's lower end** — `editorial-h5` is **16px, identical to body-large**; `editorial-h4`
   is 19px. She read h4 as body text and was right. **Sizes are the real question; the 500→600 weight bump
   was a patch.** Figma/token decision.
4. **Internal links in rich text** — a *typed* `/boats/mari` 404s if a slug changes. A document picker is
   the robust model. Flagged, not built.
5. **Sanity CORS** (`_ADINDA-TODOS.md` #9) — one click, hers only. **NOT a rendering bug** (proven); it
   only kills Sanity Live on the phone, so published content won't live-update there.

## 🟡 OPEN DECISIONS — hers, don't resolve unilaterally

- **The editorial ramp's lower end may be miscalibrated.** `editorial-h5` is **16px — identical in size to
  body-large**, differing only by weight; `editorial-h4` is 19px (3px larger). She read h4 as body text, and
  she was right. h4's weight was bumped 500→600 as a patch. **This is a Figma/token decision — flag, don't
  override in components.**
- **The Overview eyebrow.** Figma says *"Liveboard Indonesia Overview"* (their typo). We render
  *"Premium diving at exceptional value"*. `boatDefaults.ts`'s comment claims "Figma has no eyebrow text for
  the boat page" — **that is false.** Which one wins is hers. It's a Sanity value: a 10-second change.
- **Figma's Overview body says "excellent value for money"**; mari-core mandates **"exceptional value"**.

## 🔵 DEFERRED — agreed with her, do NOT do mid-slice

- **All image polish → one final content pass** (`_POLISH-BACKLOG.md`): the hero grain (1448px smoke-test
  source, needs ≥2560px), the **hotspot silently ignored site-wide**, `quality={80}` elsewhere.
  Her rule: *"make sure the frontend is built, matches the backend, and functional, and do these polishes
  last."*
- **Tier-3 rich-text heading/alignment CUSTOMISATION** — still deferred per CLAUDE.md. (Basic heading
  *rendering* is now done — that was a different, real bug.)

## THE TASK — sections 3–6

All four exist but were built from node NAMES with INVENTED class names. **They are broken the same way the
hero was.** Rebuild each; don't patch.

| # | Section | Node | Watch for |
|---|---|---|---|
| 3 | Cabins | `778:8762` | Tabs = `cabinType` docs. ⚠️ **Only ONE seeded ("Deluxe Cabin") — Superior may not exist as a document.** Check Studio. |
| 4 | **Gallery** | `778:8845` | 🔴 **THE TRAP — see below.** |
| 5 | Layout & Specs | `778:8878` | 8 fixed categories, accordion; empty body → row doesn't render. |
| 6 | FAQ | `778:8902` | `BoatFaq.tsx` is boat-specific on purpose — the homepage `Faq` is hard-coupled to `HomePageData`; generalising it is a real refactor with homepage risk. |

### 🔴 The Gallery trap — still completely unverified
**One array, TWO reads:** each tab's carousel shows **only that category's** images (filter on
`categories`); the **lightbox shows ALL combined**. Feeding the carousel the unfiltered array is the bug
that *looks* correct — tab one often renders right by accident. **Verify on a LATER tab (Diving or
Relaxation), never tab one.**
**The gallery is deliberately EMPTY**, so this has never run against a real image. Shot list is in
`_CONTENT-STATUS.md`. ⚠️ **Every gallery image must be tagged with its category** or it vanishes from all
tabs while still appearing in the lightbox — the most likely content-entry error on this page.

## STILL NOT BUILT
- **Compact nav + sticky sub-nav** (2.5–3.5h) — was step 3 of the original plan. **Shared with destination**,
  which is the whole reason it's worth doing here. Figma `Block/SubNav` (`778:8712` boat / `778:8645` dest).
  Spec: today's nav is 2 rows when stuck; a sub-nav under it = 3 rows, which she does not want. Build a
  **compact one-row variant — logo LEFT, CTA RIGHT, home/email/WhatsApp icons dropped** — so sub-nav sits
  below → 2 rows.
- **`/boats` listing route** — `BOATS_INDEX_QUERY` already exists in `queries.ts`; the route does not. The
  hero breadcrumb links to `/boats` and currently 404s.

## GOTCHAS — learned the hard way, don't rediscover

- **NEVER invent a Tailwind class.** It emits nothing, silently. No `beige-*`/`navy-*` utilities exist
  (semantic layer only; use `*-ondark-*` over photos). **Spacing scale has NO 40 and NO 120** — write
  `[40px]`/`[120px]`, never round. Grep `globals.css` first.
- **A `{/* */}` JSX comment is only valid in CHILDREN position.** Between `cond ? (` and the element = parse
  error = 500. **Made twice in one session.**
- **The dataset has DRAFTS.** `*[_type=="boat"][0]` resolves to `drafts.boat-mari`. Patch BOTH ids
  explicitly and verify BOTH.
- **`_scripts/`, `_handoff/`, `_CONTENT-STATUS.md` are gitignored** (`/_*`, root-anchored). Correct, not a
  bug.
- **PowerShell/bash heredocs mangle quotes** — prefer the Write/Edit tools over `cat <<EOF` for anything
  with backticks or nested quotes. Use `npx sanity exec _scripts/<x>.ts --with-user-token` for GROQ.
- **Compiled output disagreeing with source can mean the BUILD IS BEHIND.** The served CSS showed old token
  values after a clean restart; the edit was right and the chunk hadn't recompiled. Re-check after a
  recompile before concluding either way.
- **`boat.overviewBody` is TEST CONTENT** (`_scripts/seed-overview-body-long.ts`) — long, with h3/h4/bold/
  italic/lists, seeded purely to exercise "Read more". **Not brand voice. Replace in the content pass.**
- **Parallel sessions:** `git status` may show work this session didn't author (CLAUDE.md was amended by
  another). **Don't commit another session's files.**
