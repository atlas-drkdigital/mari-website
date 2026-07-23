# → drk-website skill

Items learned on the Mari build that belong in `C:\Users\adind\.claude\skills\drk-website\`, not here.
When it's time to actually do the transfer: paste this file's Pending section into a session scoped to
that skill, port the *generalized* pattern only (leave Mari's exact px values / copy / brand specifics
out), then cut each item down into Done here once it's actually landed in a reference file.

**Habit, not a batch job:** the moment a new `[DRK]`-worthy rule surfaces in CLAUDE.md, or a reusable
lesson shows up in MANAGER.md, append it here immediately — same edit, not deferred to a later audit.

---

## Pending

### 🟣 [DRAFT / IDEA — 2026-07-21] Cross-project reuse workflow — "clone the base, swap tokens, pull off the shelf"
**Target:** `references/workflow.md` (a new "Reusing across projects" section) once it firms up.
**Status: DRAFT — a running idea Adinda is working out, NOT a locked pattern. Do not merge as settled.**
Captured here so the thinking isn't lost. Emerged 2026-07-21 while questioning whether the Mari
componentization pass was even worth it (answer: mostly no — see the reframe below).

**The reframe that drove it — "componentized" ≠ "reusable across projects":**
- *Extracted/shared (DRY within a site)* = pulled into one file used by multiple spots in that site. Only
  worth doing where there's real duplication (Mari's accordion, 3 copies) or imminent reuse.
- *Reusable across projects* = a clean, self-contained component FILE you copy into the next repo and
  re-skin. **A section used exactly once in a site is already this** — it needs no prior "componentizing."
- Conclusion: don't run a big standalone componentization phase for hypothetical cross-project reuse. It
  optimizes the wrong goal. Extract within a project **just-in-time** (at the 2nd real use), and let
  cross-project reuse be served by the two mechanisms below.

**The proposed workflow for starting a NEW client site:**
1. **Clone the base** — a DRK **starter-template repo** (the Next 16 + Sanity v6 + Tailwind stack with
   tokens, base primitives, nav/footer shells, image pipeline, conventions). Until a dedicated starter
   exists, clone the cleanest recent project. New repo opens with the whole shelf in `src/components/`.
2. **Swap the tokens** — edit `globals.css` colours/fonts; the whole site re-skins in one place.
3. **Pull components off the shelf** per page (Hero, FAQ/Accordion, Cabins carousel, Lightbox, SubNav…),
   adjusting copy/props. `COMPONENTS.md` (carried in the starter) is the shelf catalog — look a component
   up by its registered name.
4. **Build new** only for what this client has that the base didn't → becomes a new shelf item.

**The two cross-project mechanisms (this is the actual "library"):**
- **Starter template = the vehicle.** `src/components/` IS the library. No npm package — that's overkill
  for a bespoke-client agency where each site is re-skinned, not sharing one design system.
- **`COMPONENTS.md` + this skill = the catalog/index.** Every reusable component has a registered name +
  contract + props, so you refer to it by name.

**The "graduation" step (deferred, deliberate, its own session):** after a site has 2–3 pages, lift the
*proven* components into the starter template — and THAT is the moment to pay the portability tax (tokens
as inputs, no hardcoded hexes/asset paths). Don't pay it per-site up front; pay it once, at graduation, on
the pieces that earned it.

**Open questions to resolve before this is locked:** (a) does a single starter template work across
different liveaboard/non-liveaboard client types, or do we need a couple? (b) where does the starter repo
live and how is it versioned? (c) how do token systems stay compatible so a shelf component drops in
cleanly? (d) is "copy & adapt" enough, or do the truly-universal primitives (accordion, image pipeline)
eventually want to be a real shared package after all?



### 🔴 [NEW 2026-07-20] A `seo` field an editor can fill that NOTHING renders — plus the cast that hides it
**Target:** `references/seo.md` (and cross-ref `references/workflow.md`'s per-slice SEO step).
**Status: staged, NOT yet merged.** Adinda's explicit ask — filed here so the local notes and the skill
can't drift apart when the round runs.

**What happened on Mari (2026-07-20), in the order it was found — the order matters:**
1. The homepage had **no `generateMetadata` at all.** `homePage` had an `seo` field, an editor could type a
   meta title into Studio, and the served `<title>` came from `layout.tsx`'s hardcoded root metadata. No
   error, no warning. It had been like that since the homepage slice shipped **four days earlier**, despite
   a written "SEO folds into every slice" rule already existing.
2. The project's own note said `HOMEPAGE_QUERY` **selected** `seo` "at line 86". It did not — line 86 was
   inside a *different* query. The homepage query never fetched the field. **A line number is a claim about
   a file that drifts.**
3. The designated **reference implementation was itself broken.** The schema defines the fields as
   `title`/`description`; the TS type declared `metaTitle`/`metaDescription`. So the boat page's
   `seo?.metaTitle` was **always `undefined`** and silently fell through to a fallback. Copying the
   reference as instructed would have propagated a dead lookup.
4. A note in the project file said the boat title rendering the site name was *"the fallback working
   correctly, NOT the same bug — don't fix it."* **It was the bug.** That line came one session from
   causing the real fix to be reverted.

**🔑 The rule for the skill — why `tsc` cannot save you here.** Query results are **cast**
(`as XQueryResult`), so the type is an *assertion*, not a check. A field name that exists in no schema
type-checks against nothing, forever. **When a type is reached through a cast, green `tsc` means "the cast
compiles", NOT "the field exists."** Write this into the CMS/SEO reference as a named trap.

**Concrete checks to add (all cheap, all would have caught it):**
- The post-slice SEO pass must read the **served HTML**, not the source: `curl <page> | grep -o '<title>...'`.
  Assert the value came from the CMS, not the root layout.
- **The only test that can fail:** change the SEO title in the CMS, reload, confirm the tab follows. If a
  check would pass on a broken system, it is not a check.
- Grep the schema's field `name`s against the TS type in the same commit; a rename in one must move the
  other.
- `stega: false` on every metadata fetch. Stega encodes edit-links as invisible Unicode — harmless in body
  copy, ships junk into `<title>`/`og:` tags. Currently a no-op if Visual Editing is off, which is exactly
  why it gets forgotten until the day it isn't.

**Second-order lesson, arguably the bigger one:** three separate *written, verified-looking* notes were
wrong, and each had been trusted for days. **A logged to-do is a claim about the present — re-verify it
before SCHEDULING it, not only before reporting it done.** (Same session, a queued "4 pre-existing eslint
errors" item turned out to be already fixed and would have consumed a slot.)

**Companion item:** the opt-in `data-reveal` scroll animation bug is queued in `_handoff/atlas-website.md`
(look-and-feel, so it belongs to the Atlas layer, not here). Same underlying shape — **a class of bug where
nothing breaks**, so no test, typecheck, or lint catches it, and only a human looking at the page does.
Worth naming that shape explicitly in the skill: *silent-omission bugs*.

### 🔵 [NEW 2026-07-20] Skill-round SOP: DELETE the installed `.skill` from Downloads after verify
**Target:** `references/skill-update-protocol.md`. The protocol's Step 4 covers deleting the **payload** and
cleaning the **ledger**, but NOT clearing the **downloaded `.skill` package** from the client's Downloads
folder after install. Add it as an explicit install-loop step.

**The rule:** install loop = (1) verify the download has the intended change, (2) install to
`~/.claude/skills/<name>/`, (3) verify the INSTALLED file (not the download), (4) **delete the `.skill` from
Downloads.** Also proactively remove any *other* stale `.skill` files spotted there.

**Why:** a leftover `mari-core.skill` (an already-installed duplicate) triggered a whole "is this a newer
version?" investigation on 2026-07-20 — Downloads accumulating installed packages = confusion + clutter.
Client's explicit standing SOP ("install → delete from Downloads, every time").

### 🔴 [NEW 2026-07-17] Real-device bugs: PRIVATE TAB FIRST — and there are TWO origin allowlists
**Target:** `references/troubleshooting.md`. **Amends the existing "Works on localhost, broken on device"
entry** — that rule's first diagnostic is now the SECOND. Cost most of a session to learn.

**New first move:** a bug reported on a real phone but not on the desktop → **have the client reload in a
Private/Incognito tab before investigating anything.** Fixed there = it was the device's cache, no bug.

**Why this must outrank the localhost-vs-LAN check.** A "button missing on mobile" report was chased
through three wrong theories (layout, `allowedDevOrigins`, CMS CORS), one retracted false reproduction,
and a puppeteer harness. The answer was **the phone's browser cache.**
- **A phone cannot be hard-refreshed the way a desktop can.** Our "restart clean + hard reload" ritual is
  a DESKTOP ritual — it silently does not cover the device the bug was reported on. The device can sit on
  a days-old bundle while every desktop check passes. **The existing verification ritual has a hole
  exactly the shape of the machine the bug is on.**
- **The tell, and it generalises:** the report named BOTH a missing CSS change AND a missing JS behaviour.
  One stale bundle explains both; no code bug explains both, because they share no mechanism. **When two
  symptoms have no common cause in the code, suspect the build the device is actually running.**
- **The localhost-vs-LAN check actively misleads here:** localhost works, LAN fails → points at origin →
  and origin findings *will* turn up, because dev servers legitimately have origin allowlists. Two real
  ones were found, both innocent. **Confirming that two environments differ does not identify the cause.**

**The second lesson — TWO allowlists, same class of symptom, setting one does nothing for the other:**
1. **The framework's dev-origin allowlist** (Next: `allowedDevOrigins` in `next.config.ts`) — gates
   dev-only resources (HMR socket, dev font endpoint). Symptom: content invisible, animations never fire.
2. **The CMS's own project CORS allowlist** (Sanity: `manage.sanity.io` → API → CORS origins, "Allow
   credentials" ON) — gates the live-content channel. Symptom: page renders fine but **published content
   never live-updates on that device**. Only a project admin can change it; the developer cannot.

Both need the LAN IP for real-device testing, and **both must be re-added when the client's DHCP lease
changes the IP.** Neither warns in the browser — **both land in the dev server's log**
(`.next/dev/logs/next-development.log` for Next). **Read the dev log before theorizing** — that is now
twice this log held the answer the whole time (cf. the 2026-07-15 incident already in this file).

### 🔴 [NEW 2026-07-17] Post-slice SEO pass — AUTHORING SEO IN-SLICE IS NOT THE SAME AS VERIFYING IT
**Target:** `references/workflow.md` (the per-slice family — it already carries the "SEO folds into each
slice" rule, and this is the missing second half). Cross-ref `references/claude-code.md`'s
verification-ritual rule.

**The rule:** a page slice is not done when it renders correctly. It is done when a **`drk-seo` pass has
been run against the rendered page** and the findings are fixed or logged. Trigger: after the client
approves the page's look, before the slice is logged done.

**The split that matters — write both, they are different jobs:**
- **In-slice = AUTHOR.** Fill the CMS `seo` field, emit the JSON-LD, write alt text, rename images.
- **Post-slice = VERIFY.** Load `drk-seo`, read the *rendered* page: one H1 + no skipped heading levels ·
  semantic tags not div soup · alt present and descriptive · **the metadata function actually consuming the
  CMS `seo` field** · JSON-LD emitted and valid · canonical set · internal links resolving, not `#`.

**Why it needs to be its own named step (this is the whole lesson).** The in-slice rule had been written
down for a full day and the first-built page still shipped with **no metadata function at all** — the CMS
`seo` field was queried, typed, and silently discarded, so the page served the root layout's hardcoded
title, zero JSON-LD, zero `og:` tags. **An editor could type a meta title and nothing would happen.**
Authoring and verifying are different jobs, and the one that was written down is the one that got skipped.

**Two existing skill rules predicted this and should cite it as their precedent:**
1. *"A verification ritual only counts if it can actually fail"* — "we did SEO in the slice" is not a check;
   it cannot fail. A named step with a skill attached can.
2. *"A schema field that nothing renders is a promise, not a feature"* — `seo` is the purest instance: it is
   a field an editor fills in, and **nothing consumed it**. Generalise: the CMS `seo` object needs the same
   "verify the BEHAVIOUR when it first renders" treatment as any other field. It hides especially well
   because its output is in `<head>`, invisible on the page an editor is looking at.

**Generalised corollary worth its own line:** when one route implements a pattern correctly (metadata
function, JSON-LD) and another route predates it, the gap is **invisible to typecheck, lint, and a 200
response**. The only check that catches it is diffing the *served* `<head>` between the two routes. Cheap,
and it's the check nobody runs.

### 🔴 [NEW 2026-07-17] Image size targets come from the COMPONENT — and portraits are the ones that fail
**Target:** `references/performance.md` or the images/CMS family. Sibling of the Sanity-pipeline item below.

**The rule:** before computing any image resolution target, **read the component's `sizes` attribute and
its aspect box.** Not the design file, not a remark in the conversation — the code that ships. A whole
image audit was computed, delivered, and re-computed this session because "the gallery is ~45% of
viewport width" was taken from a passing comment. The component declared `sizes="(min-width: 1024px)
55vw, 100vw"`. 45 → 55 moved the 2x target from 1296px to 1584px and **flipped every pass/fail verdict.**

**The counter-intuitive part, worth its own line: in a cover-cropped grid, PORTRAITS are width-bound.**
A fixed-aspect slot (`aspect-[708/532]` + `object-cover`) crops a portrait to landscape, so its **width**
must clear the target — being tall buys nothing. Consequence: landscape shots at 1535px pass while
portraits at 1023–1219px fail by up to 1.55×, **from the same source resolution**. Failures cluster
entirely on portraits and nobody expects that.

**Corollary — "is this image big enough" has no single answer, only a per-slot one.** The same portrait
that FAILS a cover-cropped carousel PASSES a `object-contain` lightbox comfortably (height-bound, not
width-bound). Audit per slot, not per image.

### 🔴 [NEW 2026-07-17] The filename lies — view the image, AND read the original filename
**Target:** the images/asset-pipeline reference. Pairs with the vanity-filename rule.

Three failures in one session, all on files that had **already been hand-renamed by a human**:
a file named `…sundeck-2-beanbags` was beanbags **under a shade net** (i.e. the *shaded lounge deck* —
wrong twice in one name); a file named `Corridor 1` was an **exterior side deck**; a file suffixed
`-original` was **smaller than its own derivative**. A hand-rename is not evidence.

**But the photographer's original filenames carried real location facts that the renames destroyed** —
the source folder distinguished spaces that the renamed copies had collapsed into one word. **So: read
the original filename AND look at the image. Neither alone is sufficient.**

**The reusable trick (client's own call, and it's a good one): name the descriptor after WHAT IS IN THE
FRAME, never after a claim about where it is.** `beanbags-under-shade-net`, not `sky-deck-beanbags`. A
filename that makes no location claim cannot be falsified when the client finally answers the "which
deck is this?" question — so **the naming work never blocks on the content question**, and no rename is
owed later. Generalises to any asset naming where the taxonomy is still unsettled: describe the
observable, not the classification.

### 🔴 [NEW 2026-07-17] Renaming must never re-encode; and Drive "Shared with me" is not synced
**Target:** the asset-pipeline / tooling reference. Two small hard-won facts.

**1. A rename is a copy — preserve the source extension.** `.jpeg` → `.jpg` is fine (extension text
only). **`.png` → `.jpg` is a lossy re-encode, not a rename**, and it contradicts the upload-full-res
rule directly. PNG-encoded photographs should stay PNG: it costs the visitor nothing (the CDN re-encodes
on delivery) and preserves the best master available. Naming conventions should therefore end
`.{whatever the source already is}`, never hardcode an extension.

**2. Google Drive: "Shared with me" is NOT synced by Drive for Desktop.** Only `My Drive` is. A shared
folder becomes locally readable only after **right-click → Organise → Add shortcut to Drive**, which
mounts it under `<drive>:\.shortcut-targets-by-id\<id>\`. Until then it is invisible to every local tool.
**The Drive MCP connector is not a substitute** — two limits, both hit this session: (a)
`download_file_content` returns **base64 into context** (~350k tokens per MB — not viable for one photo,
let alone a folder); (b) **file metadata carries NO pixel dimensions**, so "is this file higher-res?" is
*unanswerable* from the connector. Bytes are a hint, not an answer — a bloated PNG of a small image is
metadata-indistinguishable from a real master. **The connector is for FINDING and DECIDING; a synced
path is for READING.** Ask the client for the shortcut early: ten seconds, and it unblocks visual
matching, dimension audits, and copying in one move.

### 🔴 [NEW 2026-07-17] Sanity image pipeline: upload full-res, NEVER pre-compress — and measure, don't read
**Reverses a rule that shipped in this skill's orbit and was wrong.** The prior guidance ("compress/resize
before upload, to protect the bandwidth cap") fails on both halves. Generalised, no client specifics:

**The rule:** rename → upload the highest-res master available → let the CDN size and compress on demand.
`urlFor()` is a pure string builder (zero API quota); the CDN caches each variant indefinitely, keyed on
the exact URL string. Sanity's own docs: *"Content managers are advised to upload full-resolution assets"*
and *"You don't need to optimize images before uploading."* **The RENAME half stands** — the CDN vanity
URL derives from `originalFilename`.

**Why pre-compressing is actively harmful:** it destroys the archival master permanently, and the quota is
defined as *outgoing* bandwidth — so it shrinks the stored file, which is not what's billed. [The
served-not-stored reading is INFERENCE: no Sanity page states it outright, and a targeted docs search
failed to confirm it. Well-founded, unproven.]

**Settings that survive measurement:**
- **`q=75`, not 80.** Against Chrome's 1.33 bits/px flag line (tightened from 2.0 in Lighthouse 13), a
  ~1.1MP variant ceilings at ~187KB. Measured: AVIF q80 = 179KB ✅ but **cold-path WebP q80 = 207KB ❌
  flagged**. q75 passes on both paths. **Choose quality against the COLD path** — see AVIF below.
- **Always `.auto('format')`.** It is the ONLY route to AVIF; `fm=avif` returns 400 **by design** (AVIF is
  generated asynchronously, so it can't be demanded synchronously — documented at `/docs/help/avif`).
  `.format()`'s TS union is `jpg|pjpg|png|webp`; AVIF is in neither the types nor the URL param.
- **Always `fit('max')` on any width-capped variant.** The pipeline **upscales past the source without
  complaint** — a 3000px request off a 1535px source returned 3.4MB of mush. `fit('max')` is the only guard.
- **`sizes` is mandatory** on anything not at 100vw, or the browser assumes 100vw and downloads ~2×.
- **Use the framework's Sanity image loader, not the bare framework `<Image>`.** Bare `next/image` proxies
  through its own optimizer and **re-encodes what Sanity already encoded** — two lossy passes, two caches.
  Exactly one system may own format negotiation. Corollary: the framework's own `images.qualities` config
  becomes dead code under a Sanity loader.

**AVIF is ASYNC and PER-URL — design for the cold path.** The first visitor to *every distinct URL* gets
WebP; AVIF appears only after background encoding (documented, and measured — one URL never converted
within 25s). A 5-width srcset × DPR ≈ 10 URLs, each warming separately, so **real traffic gets a mix.**
Two consequences: (a) **never benchmark image bytes cold** — it understates by ~15% and will make two
measurements of the same URL disagree; (b) quality must clear the threshold on the cold path.

**Never upload WebP — for QUALITY reasons, not support reasons.** WebP uploads *are* supported (see the
doc-conflict note below). But transforms re-encode from the stored original, so a lossy WebP master makes
every served variant **lossy→lossy**. [Inference — Sanity states the transform behaviour but never spells
out the generational loss.] The tell is empirical and counter-intuitive: **a pre-crushed WebP source
measured 3.4× SMALLER than a real JPEG source through the identical request** (52KB vs 179KB). That looks
like a win and is actually the damage. **Benchmark against a JPEG source or the numbers will flatter you.**

**Docs-vs-reality gaps found by measurement (all against live CDN):**
- Docs say *"Defaults are 75 for JPG and WebP"* — **JPEG's default is actually 80** (`fm=jpg` with no `q`
  ≡ `q=80`). WebP's 75 ✓.
- Docs say a bare asset URL serves *"the original asset"* — **false for JPEG and WebP**, both are
  re-encoded with zero params (JPEG −55%, WebP −15%). **PNG alone is byte-exact.** So the archival original
  is **not retrievable through the CDN** for JPEG/WebP — keep masters outside Sanity if they matter.
- **PNG + a width param WITHOUT `auto=format` INFLATES the file** — a 2.5MB PNG at `w=1296` returned
  3.2MB, larger than the source. Always pair PNG with `auto=format`.
- **No lossless path exists.** `q=100` still re-encodes; `lossless=true` is *silently ignored*; `q=0` is
  silently ignored → default; `q=101` → 400. `q` has no floor (q=1 → ~35KB), so a typo'd low `q` ships mush
  with no error.
- **EXIF/ICC stripped at every quality; chroma subsampling locked 4:2:0 even at q=100**, no param to change
  it. Output is sRGB. Fine for most photography; matters for wide-gamut work.
- **The "Sanity is Imgix under the hood" claim (widespread in blogs) looks FALSE** — headers show Varnish +
  GCS and Boom-format JSON errors, none of which are Imgix's. The *param vocabulary* is Imgix-inspired,
  which is likely what those blogs pattern-matched. Actual encoder: not documented. Don't repeat the claim.

**Two meta-lessons, the generalisable part:**
1. **WHEN TWO SANITY DOC PAGES DISAGREE, THE NEWER ONE WINS — check publish dates.** `studio/image-type`
   (2026-04-14) contradicts `content-lake/technical-limits` (2026-06-23) on upload formats. Reasoning from
   the stale page produced a confidently-wrong rule this session. Sanity's docs are not internally
   consistent; date-check before trusting.
2. **For CDN behaviour, MEASURE — a doc read is not a verification.** Every correction above came from
   HTTP requests, not reading. Three separate doc claims were flatly wrong. This is the existing "verify by
   reading compiled output, not by trusting a name" rule extended to a vendor's runtime — with an
   image-specific footgun: **cold-vs-warm makes the same URL measure differently**, so a single
   measurement is not a measurement.

**Also debunked while here:** the widely-repeated *"Google recommends ~200KB per image"* traces to **no
Google source** — it is invented. Don't cite it. Real reference: HTTP Archive 2024 median
largest-image-per-page = 135KB (p75 404KB). And *"high-DPR screens tolerate lower quality"* rests on one
2012 test that now carries an outdated-advice disclaimer and **failed independent replication**.

### 🔴 [NEW 2026-07-17] A design system's class names must be VERIFIED, not pattern-matched
Tailwind emits **nothing** for a class it doesn't recognise — no warning, no error, no build failure. An
invented utility is therefore invisible to typecheck, lint, and an HTTP-200 check. It surfaces only as a
page that looks broken.

**The incident (a build, 2026-07-17):** a hero was written with class names that *looked* like the design
system but didn't exist in it. Heading text silently inherited a dark colour on a bright photo; a stats row
lost every gap and rendered four labels as one run-on string. Nothing errored, the page returned 200, and it
took a screenshot from the client to catch it. The same session then repeated the mistake in a second
section before the rule was written down.

**Two generalisable traps:**
1. **Primitives vs semantic tokens.** A palette's primitive layer (`--beige-100`) is usually *deliberately
   not exposed* as a utility; only the semantic layer is (`text-primary`, `bg-page`, `accent-muted`).
   Writing `text-beige-50` because the primitive exists in the CSS file produces nothing. **Compounds with
   palette drift**: if primitives were renamed, a plausible name may not exist *or* may be a different
   colour. For text over a photo, systems typically expose a dedicated `*-ondark-*` / `*-onimage-*` family
   — find it rather than reaching for a raw primitive.
2. **The spacing scale has gaps.** If the scale is `…24,32,48,64,80,96,128,160`, then **40 and 120 do not
   exist** — and designers use both constantly. **Write off-scale steps as arbitrary values (`gap-[40px]`),
   never round to the nearest step.** Rounding is what makes a build look "nearly right" and drift.

**The rule:** grep the theme for the token before writing the utility. Same discipline as the palette
hex-not-name rule — this is its sibling, one layer up.

**Corollary — a wrong-looking page is not always the code's fault.** In the same session, a screenshot of a
section on a black background looked like a broken background token. Every token resolved correctly: the
screenshot was the *design file* on a dark canvas, not the built page. **The tell was content, not colour**
— the screenshot's copy differed from what the page rendered, so it couldn't have been the page.

**Corollary 2 — compiled output disagreeing with source can mean the BUILD IS BEHIND.** Later the same day,
the served CSS still showed old token values after a clean `.next` wipe and restart; the edit was correct
all along and the chunk simply hadn't recompiled. **Re-check after a recompile before concluding either
"it failed" or "it landed."** Verify against compiled output — and verify that the compiled output is
current.

### 🔴 [NEW 2026-07-17] Build a section from the DESIGN NODE, never from its NAME
**Standing workflow:** before building any section, get the design-file node link + a screenshot from the
designer, then pull the node's real spec via the design tool's MCP (`get_design_context` or equivalent).
Never start from a node name, a node ID copied from a doc, or a section's position in a list.

**Why (same build, 2026-07-17):** a node named `Block/HighlightCard` was assumed to be a card with text over
an image. It was an image with a heading and list *below* it on the page background — nothing overlaid. A
list bullet was assumed to be an icon asset and faked with a CSS shape; it was a **text character**, which
is precisely why no matching SVG existed in the repo. Time was lost hunting an asset that was never supposed
to exist. Guessing produced ~8 wrong values in one section and forced a full rebuild.

The node spec returns the exact type ramp, colour token, and spacing. It is cheap. **The client's framing:
"the assets will be there, so you don't have to make things up and guess."**

**Pair it with a reference implementation:** once one section is built correctly and reviewed, name it in the
project's CLAUDE.md as the canonical example. Later sections copy it rather than re-deriving the scrim
recipe, the reveal hook, the on-image colour family, and the off-scale-spacing convention.

### 🔴 [NEW 2026-07-17] Two heading ramps are not interchangeable: display vs editorial
Design systems commonly ship **two** heading ramps, and picking by number alone is a silent bug:
- **display-*** — headings that ANCHOR a section (page H1, section H2). Large, tight leading, negative
  tracking. Always set by a *component*.
- **editorial-*** — headings WITHIN body copy. Smaller, looser leading, sized to sit beside paragraphs.

**Any heading an editor types into a rich-text field is editorial by definition** — it's inside body copy.
Mapping rich-text `h3` to `display-h3` renders a body subheading at section-title scale.

**Watch the ramp's lower end.** On this build `editorial-h5` was the *same size* as body-large, differing
only in weight, and `editorial-h4` was 3px larger — the client read them as body text, correctly. When a
ramp's small headings collide with body size, weight has to carry the distinction, and that's a **token
decision for the designer, not something to override in a component.** Flag it; don't silently patch it.

### 🔴 [NEW 2026-07-17] A schema field nothing renders is a PROMISE, not a feature
Under schema-before-frontend a field can sit "done" for weeks with no consumer — and **a field with no
consumer is unverified by construction.** Three bugs of identical shape surfaced the day one page first
rendered its fields for real. In each, the CMS offered the editor a control, the schema documented it, and
the frontend silently ignored it — so it *appeared* to work and did nothing:
- **A `{token}` placeholder** the schema promised "the frontend swaps in per page." No resolver had ever
  been written. It would have shipped rendering the braces literally.
- **Rich-text headings and half the marks.** The rich-text schema offered H1–H6, five marks, an alignment
  annotation, an inline image and an HTML embed; the renderer had **no block styles at all**, handled three
  marks, and rendered neither custom type. An editor applying "H3" saw nothing change — and frameworks whose
  CSS reset sets heading tags to `inherit` make this look like plain body text rather than an error.
- **The image focal point (hotspot).** Enabled on every image object, so the editor can drag it — but the
  URL builder was called without dimensions, so the CDN never applied it and CSS centre-cropped instead.

**Rules:** when a slice first renders a field, **verify the field's BEHAVIOUR, not that text appears.**
**Seed content that EXERCISES the behaviour, not content that fills the box** — a placeholder body of
uniform paragraphs would never have exposed the heading gap; one containing a real heading did, instantly.
And **when a rich-text schema gains a style/mark/member, add it to the renderer in the same pass** — the two
files are a contract, and only one of them fails loudly.

### 🔴 [NEW 2026-07-17] Only show a "read more" when there IS more — and measure it
A truncate/expand control must render **only when the content is genuinely clipped**. A button that expands
to reveal nothing is worse than no button.
- **A fixed line-clamp is a guess.** It can't know whether anything is hidden, and it breaks the moment the
  body contains headings, lists, or anything whose line height differs from a paragraph's.
- **Cap with a max-height**, e.g. `max(floor, 60dvh)` — a floor so it never collapses to a sliver, a
  viewport share so it adapts. Use `dvh`, not `vh`, or mobile browser chrome skews it. ⚠️ **Beware a px
  ceiling silently defeating the percentage**: `clamp(240px, 60dvh, 404px)` caps at 404 on any tall screen,
  so the 60dvh never applies. That shipped on this build.
- **There is no CSS way to ask "am I clipped?"** — measure `scrollHeight > clientHeight`, re-measuring on a
  ResizeObserver **and** on `document.fonts.ready` (webfonts land after first paint and reflow text).
- **Don't re-measure while expanded**: an open element has `scrollHeight === clientHeight`, reports "no
  overflow", and hides the only control that collapses it again.
- **The button is absent from SSR output by design** — the measurement only runs after hydration. So an
  HTML/curl check can never verify it. Say so; don't claim it works off a grep.
- **To animate the height you need a measured pixel target on both ends** — you can't transition to `none`,
  and transitioning to an arbitrary large value makes the easing run across a distance the content doesn't
  occupy, reading as a lurch then a stop.
- **Fade the cut edge with a `mask-image` gradient, not an overlay div.** A mask needs no knowledge of the
  background colour, so it can't desync from the page background the way a hardcoded gradient-to-bg would.
- **Pick the duration from the interaction's CLASS, not one global default.** A large content reveal wants
  the site's *reveal* timing (~700ms); a ~300ms hover convention on a big height change reads as a jolt.

### 🟡 [NEW 2026-07-17] JSX: a `{/* */}` comment is only valid in CHILDREN position
Placing one between `cond ? (` and the element it guards is a parse error that takes the whole page to a
500. Made twice in one session. Put the comment **above** the conditional, or **inside** the element.

> **▶ NEXT ROUND.** The 2026-07-17 **Round 2** (mid-restructure) shipped and is fully installed/verified —
> see Done. The item below arrived **after that round's payload was built** and is owed to the next one.
> It was preserved by the protocol's own new "re-read before rebuilding" rule, on that rule's first use;
> the old destructive cleanup would have deleted it without trace.
>
> **Note the moved target:** it names `references/sanity-cms.md`, which **no longer exists** — Round 2's
> restructure split it into `sanity-setup.md` + `sanity-studio.md`. PART Q's content is in one of those.
> Re-point it when merging.

### 🔴 [CORRECTION to a MERGED item — `references/session-conventions.md`, "Commit cadence"] The verified-clean precondition gates the MESSAGE, not whether to commit
Adinda, 2026-07-17. Already applied to this project's CLAUDE.md the same day; owed to the skill.

**The symptom that exposed it (Adinda's own report):** *"sometimes there's so much work done already but no
commit ever done."* **Cause:** the rule's precondition sets the bar at *"typecheck/lint/build actually run
green"* — **a bar nobody clears mid-arc.** So the rule written to protect the repo is what prevents the
checkpoint. It optimised against the cheap reversible risk (a messy commit) and ignored the expensive
irreversible one (an uncommitted tree).

**The correction.** A **local commit is not a claim the work is good — it's a checkpoint.** Free, private,
reversible. An **uncommitted working tree is the only genuinely lossy state.** So:
1. **Default to committing.**
2. **The verified-clean precondition gates what the MESSAGE CLAIMS, not whether you commit.** Never imply
   verification you didn't do. `wip: X — untested, mid-arc` beats no commit and is honest.
3. **A breaking bug is fine to commit if the message says so.** The forbidden thing is a broken state that
   **looks finished in the log** — a future session reads it and believes it. This *reinterprets* the existing
   "never commit a mid-repair/known-broken state" line rather than deleting it: that rule was always about
   committing broken work **silently**, as if done. It's a message problem wearing a commit problem's clothes.
4. **Narrow genuine exceptions:** secrets/credentials, large junk artifacts, a tree another process is
   actively writing.

**ADD — parallel sessions (new, not in the merged rule at all).** When several agent sessions run against one
repo, `git status` shows work **this session didn't author**. **Don't commit it** — not because it's
unverified, but because **only the authoring session knows what the message should honestly say**, and a
message written by someone who doesn't know what they're describing is precisely what rule 2 forbids. Name the
files, say they appear to be another session's, leave them. The commit reminder belongs to *that* session.
Never say "shall I commit?" — it implies it's yours to offer.

**Generalise — and this is the bigger finding.** This is the **third rule shipped 2026-07-17 that a single
day's real use disproved** (the others: "reconcile palettes opportunistically, never in one pass"; "the `/`200
+ Studio 500 orphan tell is live"). **All three failed identically: a plausible premise that was never tested**
— *confirmation is expensive*; *the tell is leading*; *committing unverified work is risky*. None was checked
against one real run. **When writing a standing rule, name its load-bearing premise explicitly and ask what it
would cost to test it.** An untested premise inside an otherwise-good rule is invisible — the rule reads as
sound right up until it costs someone a day.

### 🔴 [STRENGTHEN the item this round shipped — `references/sanity-cms.md`, PART Q draft/published split] Verifying against the side you WROTE to is not verifying. Check BOTH, and say which you changed.
Mari, 2026-07-17. PART Q merged that morning and is right as far as it goes ("never `[0]` on a `_type`
filter; select by explicit `_id`"). **It is not sufficient, and the same day proves it — twice, in
opposite directions.**

**Failure 1 (the one PART Q covers):** a mutation script used `*[_type == "homePage"][0]`, which resolved
to `drafts.homePage`. Only drafts were patched; the site (published perspective) never changed, so the
feature under test looked broken when it was fine.

**Failure 2 (NOT covered, and it happened AFTER the rule was written):** a salvage script did
`client.patch('boat-mari')` — an explicit `_id`, exactly as PART Q instructs — which patched **published
only**. The verification then queried **published** and returned green. **The client opened Studio, which
shows the DRAFT, and saw an empty field.** Published had 4 images, the draft had none. Every rule in PART Q
was followed and the result still diverged.

**Why the rule was insufficient:** `_id` discipline fixes *which document you address*. It says nothing
about the fact that **a document is TWO documents**, and that writing one silently diverges it from the
other. The verification inherited the same blind spot as the write, so it could not fail.

**The strengthened rule:**
1. **A mutation must state which side it targets — published, draft, or both — and that must be a
   deliberate choice, not a default.** For content the editor should see: patch **both**.
2. **Verify BOTH sides, always.** A check that queries only the side you wrote to is not a check — it's
   the write, restated. (This is the already-merged "a ritual that can't fail isn't a check" rule
   (`claude-code.md`) reached from a third direction. Cross-reference them.)
3. **Divergence is a live hazard, not untidiness:** publishing lets the stale draft silently overwrite the
   published field, and meanwhile the built site renders content no editor can see or delete.

**The meta-lesson worth the most:** this happened to a session that had spent the preceding hour writing
the drafts-vs-published warning into three separate documents. **Knowing about a trap does not stop you
falling into it from the opposite direction.** Prose warnings don't generalise on their own — the rule has
to name the *mechanical* check ("query both sides"), because that's the only part that survives contact
with a different-shaped instance of the same bug.

### 🔴 [NEW 2026-07-17 — `references/session-conventions.md` or wherever the recall rules live] A REMINDER is a claim about the present. Verify it before delivering it.
The repo carried a standing note: *"when the boat page starts, remind Adinda to send the Figma
colour-variable screenshots."* By the time the boat page started, **she had already sent them and the whole
rename had shipped off them the same morning** — the reminder had outlived its subject. It was delivered
anyway, and she caught it ("we already did the screenshots right?").
- **The rule already exists for skills and memories** ("recalled memories reflect what was true when
  written — verify before recommending"). **It applies identically to our OWN notes** — MANAGER.md
  reminders, `_handoff` items, to-dos. A stale reminder is worse than no reminder: it spends the user's
  attention and quietly implies they dropped something they actually did.
- **The generalizable tell:** the note named a *trigger* ("when the boat page starts") but not an
  *invalidation condition* ("unless the screenshots have arrived"). A reminder whose subject can be
  completed by another route should say what makes it obsolete. **When writing a reminder, write its
  expiry.**
- Same family as the verification rules already here: *check the thing, don't trust the label on it.*

### 🟡 [NEW 2026-07-17 — content-modeling reference] Name a field for the SECTION IT RENDERS, not the shape of its data
Mari's boat page has a Figma section called **Amenities** (5 tabs, each with copy + a photo carousel). The
schema field that drives it is called **`gallery`** — because when it was modeled, the data *shape* was
"a pile of images." The result: a whole session's confusion over a schema/Figma "disagreement" that was
purely a naming mismatch — the field was right, its name pointed at the wrong concept.
- **Adinda's explicit call: live with it on Mari (renaming costs a migration for zero user impact), but do
  NOT repeat it on the next project.** So this is a *prevention* item, not a fix.
- **The rule:** when a field drives one named section of a page, name it after that section. Data shape
  changes; the section's identity usually doesn't.
- **Corollary that saved this one:** the field's own code comment ("fixed list from the Figma gallery
  mockup — The Boat / Dining / Diving / Relaxation / Others") is what proved the two were the same thing.
  **The comment outlived the name's accuracy** — more evidence for the existing "reasoning lives in code
  comments, not Studio-visible text" rule.

### 🟡 [NEW 2026-07-17 — `references/redirects.md` or URL conventions] Don't make the collection URL segment editable. Make the slug editable — it already is.
Adinda asked whether the `/boats/` segment could be configurable in Sanity (so it could become
`/liveaboard-diving/` later). **It can** (`app/[collection]/[slug]/page.tsx` reading the segment from
Sanity; static routes still resolve before the dynamic one). **Recommended against, and she accepted.**
- **Why:** one field that can re-URL the entire site — a typo silently 404s every indexed page unless you
  also auto-generate redirects (more machinery). `generateStaticParams`, sitemap, canonicals and
  breadcrumbs all derive from it, so the blast radius is the whole SEO surface. It buys a change that
  happens ~never, and when it does it's a deliberate migration you'd want to *plan*.
- **Doing it later is cheap:** rename the route folder + one `redirect` document. ~10 min, once, ever.
- **The reframe that resolved it:** the user mostly already had what they wanted — **per-document slugs are
  editable in Studio today**; only the collection segment is in code. Worth checking what already exists
  before building configurability for it.
- **SEO note worth carrying:** keywords in a URL are a weak ranking signal — competing shapes rank the same.
  What matters is picking once, not changing post-launch, and staying internally consistent
  (`/destinations/komodo` ⇒ `/boats/mari`, never `/boat/mari` alongside a `/boats` listing).
- **General principle:** *editable* and *correct* are different goals. Adding a knob doesn't make a
  decision right — it adds a way to get it wrong. Prefer getting it right once where the cost of changing
  later is a folder rename.

### Components — the one real gap left (still open after the 2026-07-16 update)
- [ ] All 7 entries in Mari's `COMPONENTS.md` (Circle Icon Button, Ambient Image Zoom, Section Heading w/
      Trailing CTA, FAQ Accordion Item, Multi-Select Checkbox Dropdown, CTA Card, Button/Ghost Button) —
      read that file directly at transfer time, it's the source of truth (has its own PENDING/TRANSFERRED
      legend). Port mechanics only. → `references/components.md`.
      **Why still open:** the 2026-07-16 update told the chat session this is still the gap, but couldn't
      fill it — Mari's `COMPONENTS.md` doesn't exist as a file yet (it's a planned doc, see CLAUDE.md's
      doc-split note), so there was no source to port from. `references/components.md` still has essentially
      no named-component *catalog* (only Sticky Anchor Nav) despite its name. Fill this once `COMPONENTS.md`
      actually exists.

### Mari-build follow-ups that rode along on ported items — NOT skill ports, tracked in Mari's MANAGER.md
These are build-side to-dos that were nested under handoff entries now marked Done. They are NOT chat-side
skill edits — they live in Mari's own build tracking and are listed here only so they aren't mistaken for
skill-port work still owed to this file:
- Gallery pattern is marked EXPERIMENTAL in the skill; the real-editor multi-file-drop validation is a Mari
  build task (see `_SCHEMA-SPECS.md`).
- The `urlFor()` vanity-filename helper (now specced as a fallback chain in the skill) is not built yet — no
  components consume Sanity images in the Mari build. Sequenced for the image-rendering wiring pass.
- No-instant-state-changes: Nav desktop mega menus, mobile menu overlay, and Hero mobile search takeover
  still use instant toggles — deliberately held for explicit sign-off (real regression risk), per MANAGER.md.
- Localization: the skill now says "smoke-test both plugins installed together before relying on the split."
  The actual smoke-test is a Mari build task, not a skill edit.

---


---


---

## Done — reconciled 2026-07-17 (ROUND 2, mid-restructure) against the installed drk-website skill

Adinda restructured the skill in chat and merged `_payload/drk-website.md` (4 PARTs) into the restructure in
one pass, re-exported; Claude installed it. **Verified against the extracted package before install and
spot-checked after — including a content-loss check across the restructure's file splits, which is the risk a
restructure carries that a normal merge doesn't.**

**The restructure itself:** `sanity-cms.md` → split into **`sanity-setup.md` + `sanity-studio.md`**;
`workflow.md` → split out **`session-conventions.md` + `skill-update-protocol.md`**. *Verified no content lost:*
sanity 589 → 600 lines across the split; workflow 512 → 562 across three files. Every rule merged in Round 1
was confirmed still present after the move (drafts split, `buildLegacyTheme`, GROQ coalesce, fieldset
exception, `isFeatured`, one-slice-first, absent-audit, product-surface), and *"Skeleton first, always"* is
still gone.

- [x] **PART A — 🔴 palette rule REVERSED.** "Reconcile opportunistically, never in one pass" is corrected:
      **ask the designer to paste the variable panels first** — 11 tokens confirmed at source in ~15 min across
      6 screenshots, renamed in one mechanical pass, identical 54-hex output before and after. Opportunistic
      reconciliation is now the documented **fallback**, not the default. *Verified:* the old rule survives only
      as an explicit dated supersession note. Generalised: *before designing a workflow around "we can't know
      X," check what asking costs.*
- [x] **PART B — three reconciliation findings ADDED** → `figma-conventions.md`: a drifted port is *partial*
      (diagnose per-token, not per-file); a stale name can be **fiction** (a token named for a colour family
      that never existed — never invent a name at port time, it's undetectable from inside the codebase); and
      verify the tokens you believe are already correct (the gap-fill pattern is a strong prior, never proof —
      right 11/11 and still not evidence).
- [x] **PART C — 🔴 orphan tell marked LAGGING** → `troubleshooting.md`. The diagnosing question is **"was this
      process's parent/wrapper killed?"**, not "does it answer right now" — a freshly-orphaned server passes
      both checks and degrades ~15 min later. *Verified:* the `/` 200 + Studio 500 pairing is kept for servers
      of unknown provenance; a clean both-200 is explicitly no longer proof of health.
- [x] **PART D — 🔴 the protocol's two holes CLOSED** → the new `skill-update-protocol.md`. It now has a
      **"Step 5 — Re-scan, then close"** (Step 0 was a snapshot; a round takes hours), and a
      **"ledger cleanup is destructive — re-read before rebuilding"** rule preferring surgical edits to
      whole-file reconstruction.
      **That second rule proved itself immediately:** re-reading Pending before this very cleanup surfaced a
      🔴 STRENGTHEN item added *after* this payload was built. The old cleanup would have deleted it with no
      diff and no recovery. It is preserved in Pending above.
## Done — reconciled 2026-07-17 against the installed drk-website skill

Adinda updated the chat-side skill from `_payload/drk-website.md` (17 PARTs), re-exported, and Claude
installed it. **Every PART was verified against the extracted package before install and spot-checked after.
For the four correction-class PARTs, BOTH halves were checked: new text present AND old text gone.** File
growth: `workflow.md` +197 lines, `sanity-cms.md` +147, `troubleshooting.md` +77, `claude-code.md` +46,
`figma-conventions.md` +29. No files added or lost.

**The corrections (the highest-risk items in the round):**
- [x] **PART L — build sequencing INVERTED.** The skill said *"Skeleton first, always"* (Key decision rules)
      and *"Default method: skeleton-first"* (Phase 6) — the exact ordering the 2026-07-16 retro concluded was
      backwards. *Verified:* **both statements are gone** from `workflow.md`; replaced with "one real vertical
      slice first (surfaces shared foundations), then the skeleton informed by it, then the remaining slices",
      and the pre-existing "known conflict" note was reconciled — it now reads as moving TOWARD Sanity's own
      model-early-and-iteratively guidance. **This was found by the payload build, not by the pre-flight scan
      — the scan compared the ledger to the repo's docs, and never asked what the skill itself already said.**
- [x] **PART O — the skill-update-round protocol REPLACES bookend step 1.** *Verified:* the old thin step now
      reads *"Skills-backlog check (FIRST) — see 'The skill-update-round protocol' below for the full spec.
      Never restate the full procedure here — one spec, not two that drift."* Exactly one spec.
- [x] **PART F — `isFeatured` is standard + on by default**, superseding "only add a featured flag when a
      concrete UI surface consumes it". *Verified:* the old rule survives **struck through and explicitly
      marked superseded**, with the whiplash reasoning attached. **This deviates from the payload's "old text
      must be GONE" instruction and is BETTER** — no session could read `~~…~~ — superseded` as live, and
      keeping it preserves *why* the rule flipped. Same call as the `atlas-website` history annotation.
- [x] **PART I — fieldsets WITH the single-self-describing-field exception.** *Verified:* present, framed via
      the rule's purpose (exactly one clear header per section) rather than as an ad-hoc override.

**Everything else:**
- [x] **PART Q (highest severity) — Sanity draft/published split** → `sanity-cms.md` (the rules) +
      `troubleshooting.md` (the two diagnostic tells). Never `[0]` on a `_type` filter in a mutation; select by
      explicit `_id`; a type rename migrates `drafts.<id>` alongside `<id>`; dump contents before deleting;
      pin singletons early.
- [x] **PART A** palette port-once / match-by-hex-never-by-name / opportunistic reconciliation →
      `figma-conventions.md`.
- [x] **PART B** "does waiting make this more expensive?" evaluated ACROSS inheriting projects on a
      pilot/template → `workflow.md`.
- [x] **PART C** three process rules → `claude-code.md`: C1 docs-before-debugging (+ the fix-AND-prevention
      corollary), C2 a ritual that can't fail isn't a check, C3 an agent may propose but never author an
      attribution.
- [x] **PART D** → `troubleshooting.md`: D1 orphaned dev server + Turbopack Jest-worker crash (merged — same
      `/` 200 + Studio 500 signature, two causes), D2 Structure Builder duplicate-ID (fix = delete the dupe;
      prevention = explicit `.id()`).
- [x] **PART E** `buildLegacyTheme` derives text colours you can't set + the wrong-surface trap →
      `sanity-cms.md`.
- [x] **PART G** GROQ `+` is null-poisoning — coalesce each operand → `sanity-cms.md`.
- [x] **PART H** CMS/admin as a product surface → SKILL.md + `sanity-cms.md`.
- [x] **PART J** decluttering toolkit + required-field marker + pre-i18n Studio-UX note → `sanity-cms.md`.
- [x] **PART K** a structure audit must ask what's ABSENT → `sanity-cms.md`, generalized ("any checklist
      derived from an existing set inherits that set's blind spot"; the paired question needs a *different
      source*).
- [x] **PART M** the per-slice family → `workflow.md`: M1 full-wire-per-slice (**UNDER TEST** marker
      preserved), M2 nav/footer links un-hardcode incrementally, M3 SEO + image pipeline fold in, M4 load
      real/placeholder content.
- [x] **PART N** session-length check + Studio-staleness clean restart → `workflow.md`.
- [x] **PART P** estimating amendment to the bookend protocol's "(b) estimated hours" — build only, overhead
      once, never bill the client's review time as build time.

**Corrections to this ledger's own record, discovered during the round:**
- **`full-wire-per-slice` had NOT landed in the 2026-07-16 round**, despite CLAUDE.md and the staged payloads
  both asserting it had. It was merged this round as PART M1. Caught only by verifying against the installed
  files instead of trusting the Done section — which is now a standing rule (see the protocol, Step 4).
- **The SEO+image per-slice content was mis-nested** under the Jest-worker heading in this ledger (a
  formatting slip). It was split out correctly into PART M3 at payload-build time.
## Done — reconciled 2026-07-16 against the installed drk-website skill (this update round)

Adinda updated the chat-side `drk-website` skill from the `_drk-website-chat-payload.md` brief, re-exported,
and Claude Code installed it. Verified directly against the freshly-installed reference files (not just the
skill's changelog): the two flagged corrections landed (alt is `recommended-not-required`, never
`Rule.required()`; vanity filenames use the `seoImageName → originalFilename → alt → omit` fallback chain),
the two new files exist (`references/troubleshooting.md`, `references/image-editing.md`), and `stack.md` is
version-labeled with the "look up before every new build" guard. Minor: ~13 illustrative "Mari" mentions
remain across reference files (incident references, acceptable) — eyeball on a future pass if desired.

- [x] **Commit cadence** (commit at every checkpoint + remind at session end) → `references/workflow.md`.
- [x] **Session-bookend protocol** (skills-backlog check + model + task-proposal format + ask-time +
      granular breakdown) → `references/workflow.md`.
- [x] **Standardized daily-recap template** → `references/workflow.md`.
- [x] **Research-before-custom-build** standard → `references/workflow.md`.
- [x] **Placeholder-content tracker** workflow practice (file structure + sourcing policy) →
      `references/workflow.md`.
- [x] **End-of-session retrospective** standing workflow → `references/workflow.md`.
- [x] **Skeleton-first schema methodology** → `references/workflow.md` (Phase 6 + Key decision rules row).
- [x] **Document-type naming** — check for a REAL pattern before assuming a suffix is deliberate →
      `references/sanity-cms.md`.
- [x] **Editor-managed category lists** beat hardcoded enums once there's >1 instance →
      `references/sanity-cms.md`.
- [x] **"Own document type + count constraint"** for small fixed-count repeating content →
      `references/sanity-cms.md`.
- [x] **Gallery pattern** (flat array-on-page, bare `image`-type members, native bulk upload, EXPERIMENTAL)
      → `references/sanity-cms.md`.
- [x] **Image alt rule — CORRECTED** (editable, never `Rule.required()`) → `references/components.md` +
      `references/sanity-cms.md`.
- [x] **Vanity-filename fallback chain** (`seoImageName → originalFilename → alt → omit`) →
      `references/components.md` + `references/sanity-cms.md`.
- [x] **No instant state changes, ever** (grid-rows / max-height / delayed-unmount techniques) →
      `references/claude-code.md`.
- [x] **Fixed px/rem as a stand-in for content-relative sizing** → `references/components.md`.
- [x] **QA "bake in from the start" patterns** (`next/image` `fill`, scrollable tab/track, hover-zoom,
      home-link scroll-to-top, decorative-must-be-interactive, grep-all-siblings) → `references/components.md`.
- [x] **Scroll-effects-guard-on-mount** (prevention) → `references/claude-code.md`; **unexplained scroll
      jumps — instrument, don't guess** (diagnostic) → `references/troubleshooting.md`.
- [x] **No AI-tool authorship traces in the public build** + git-history condition → `references/pre-launch.md`.
- [x] **`allowedDevOrigins` / real-device LAN testing** + headless-Chrome/iframe-`dvh` gotchas + review-
      mobile rule → `references/troubleshooting.md` (new file) + `references/claude-code.md`.
- [x] **Image-editing SOP** (cost gate, photo-edit-not-repaint, lighting+shadow together, resolution diff,
      per-call cost) → new `references/image-editing.md`.
- [x] **Stack version drift + Next.js 16 conventions** (Next 16 / Studio v6, `proxy.ts`, `remotePatterns`,
      `qualities`, async dynamic APIs, `cacheComponents` off, embedded-Studio auth needs no custom code,
      re-verify-guidance-not-just-versions) → `references/stack.md` + `references/redirects.md` +
      `references/sanity-cms.md`.
- [x] **Two general content-modeling patterns** (Studio-org-safe-to-finalize-last; rich-text tiering) →
      `references/sanity-cms.md`.
- [x] **Brand-dump patterns** (page-builder + fixed Hero/Nav/Footer; minimum-content guard; SEO
      auto-populate-with-override; reference-direction; nav-as-editable-document) → `references/sanity-cms.md`.
- [x] **Skill install/update procedure** (internal vs external, archive + delete-from-Downloads discipline)
      → `references/claude-code.md`.
- [x] Localization plugin compatibility — landed as a caveat ("smoke-test both installed together before
      relying on the split"), NOT as a settled fact, per the flag. Build-side smoke-test tracked in Mari.

---

## Done — reconciled 2026-07-13 against drk-website skill v0.9

- [x] Tabbed field groups (Content/SEO/Settings) as a blanket Studio convention — `references/components.md`.
- [x] JSON-LD override field disabled-by-default UX pattern — `references/components.md`.
- [x] Generic central-document + reference/category filtering pattern for recurring cross-page content —
      `references/components.md`.
- [x] Sticky Anchor Nav w/ scrollspy, named reusable component — `references/components.md`.
- [x] Image handling: no custom compression pipeline needed for Next.js+Sanity (Sanity CDN + `next/image`
      handle it automatically), size targets, vanity-filename SEO technique — `references/sanity-cms.md`.
- [x] Presentation Tool / Visual Editing "pending research" marker cleared — `references/sanity-cms.md`.

---

## Done — reconciled 2026-07-07 against drk-website skill v0.5

Adinda updated and reinstalled the `drk-website` skill (v0.5) and installed the new `atlas-website` skill
today. Cross-checked every item below directly against the new file contents (not just the skill's own
changelog) before marking Done.

- [x] Image compression pipeline — `references/performance.md`.
- [x] MANAGER.md size/archiving discipline — `references/claude-code.md`.
- [x] Content-modeling-timing conflict (DRK's phase-gate order vs. Sanity's own parallel-iteration
      guidance) — `references/workflow.md`, after Phase 6.
- [x] Page-level horizontal overflow as first mobile-symptom suspect + diagnostic — `references/components.md`.
- [x] Body text sizing, two tiers by location (section-intro flat, card-level scales down) — `references/components.md`.
- [x] Fixed-height anti-flicker rule for revealed/hidden text in width-changing containers — `references/components.md`.
- [x] Percentage width with a pixel floor, paired with a mobile override — `references/components.md`.
- [x] Scroll-reveal scope: first-viewport-entry only, interactive state changes get a plain crossfade — `references/components.md`.
- [x] "Luxury ease" vs "quick ease" timing system + the shared-transition audit rule — `references/components.md`.
- [x] Full-bleed sections need explicit nav-height clearance on top of Figma's spacing value — `references/components.md` + `references/figma-conventions.md`.
- [x] Page-gutter (repeated utility triplets) → named Tailwind v4 `@utility` — `references/components.md`.
- [x] Mobile gap formula: (desktop value / 2) + 4px — `references/components.md`.
- [x] Heading mobile floor must be diffed against nearest body text's mobile floor — `references/components.md`.
- [x] Duplicated content across UI locations must be grepped/updated together — `references/components.md`
      (routed here instead of `workflow.md`, which also got its own launch-checklist version — see below).
- [x] Wide-viewport / zoomed-out audit procedure — `references/workflow.md` Phase 8 (condensed vs. the full
      Mari write-up, but the core method — full-page capture without inflating viewport height, real
      `getBoundingClientRect()` bounds, force-reveal at test time, grep for missing `isolate` — is there).
- [x] Figma-vs-established-rules precedence policy, incl. the "would this change a static screenshot"
      classification test — `references/figma-conventions.md`.
- [x] Bare-number Tailwind utility outside the custom `--spacing` scale silently compiles to nothing — `references/components.md`.
- [x] `--spacing-*: initial` wipes `--spacing-0` too — `references/components.md`.
- [x] Headless Chrome ~500px minimum window-width floor + iframe-harness workaround — `references/claude-code.md`.
- [x] Tailwind v4 `max-lg:`/`max-*` variants can compile to `min-width` — verify compiled CSS — `references/components.md`.
- [x] Verify by reading actual compiled CSS, not trusting class names — `references/components.md` + `references/claude-code.md`.
- [x] Raw text nodes as direct flex children don't reliably shrink/wrap — `references/components.md` + `references/figma-conventions.md`.
- [x] `isolate` + negative-z-index stacking-context trap — `references/components.md`.
- [x] Cache-busting discipline (`?v=N`) as a static-phase-only workaround — `references/components.md`.
- [x] `scrollIntoView({behavior:'smooth'})` unreliable in headless Chrome — use `instant` — `references/claude-code.md`.
- [x] The three-doc split (CLAUDE.md / COMPONENTS.md / MANAGER.md) as a reusable process pattern — `references/claude-code.md`.

---

## QUEUED 2026-07-21 — SubNav scroll-chrome pattern (locked, Adinda: "lock this in as a pattern throughout the website and possibly future websites")
A page-local section nav (SubNav) with: server-rendered anchor links + IntersectionObserver
scroll-spy (POSITIONAL recompute — never trust entry order, it races on fast backward jumps) +
drag-scrollable TabRail form on mobile + a two-row compact floating chrome: on scroll, the main nav
collapses to ONE compact row (brand · menu items · CTA) and the section nav floats beneath it
(contrasting glass row). No scroll-direction show/hide logic — a scroll-up-reveal variant was tried
and rejected (produces a 3-row stack). On sub-nav pages, skip the nav's intermediate scrolled-flip:
one costume change only. ⚠️ Float boundary must be measured against the FULL nav height FROZEN
while floating — a live measurement oscillates because floating itself shrinks the header.
Reference implementation: mari-website `src/components/SubNav.tsx` + `src/lib/navScroll.ts`.
Component names registered: SubNav, TabRail, SingleImageCarousel, LightboxGallery(default),
CarouselChevron.

## QUEUED 2026-07-22 — iOS Safari eats the FIRST tap on hover-reactive cards: reveal on pointerup, never click
Touch-device "tap to reveal" interactions (card overlays, hover-state equivalents) must ride
`pointerup` (with `pointerType === 'touch'`), NOT `click`. iOS Safari's hover-emulation consumes
the first tap on content it considers hover-reactive and only delivers `click` on the second —
users report it as "I have to tap twice". Pointer events bypass the heuristic entirely. Two
required guards: (a) a ≤10px pointerdown→pointerup movement test so carousel swipes don't toggle
the card they started on; (b) skip events whose target is inside an `<a>` (closest('a')) so
tapping a CTA doesn't also toggle — note stopPropagation on the link's `click` does NOT cover
this, the pointerup fires regardless. Reference: mari-website
`src/components/sections/destination/DestinationItineraries.tsx` (fix commit 9fe4985).
Related same-day lesson: a full-card `<a>` overlay on a drag-scrollable carousel makes dragging
impossible (every drag attempt becomes a navigation) — navigation belongs on an explicit CTA
inside the card, never the card surface, whenever the track is draggable.

## QUEUED 2026-07-22 — booking-widget embeds (INSEANQ etc.): full viewport width on mobile, STANDARD
Third-party booking/scheduling embeds are dense tables — at phone width inside normal page
gutters they're unreadably small. Standard: the embed container goes full-bleed on mobile
(gutters return from md up). Implementation matters: negative margins that exactly cancel the
wrapper's own padding (`-mx-24` + `self-stretch` in a flex column), NEVER `w-screen`/`100vw` —
vw includes the scrollbar and reintroduces the horizontal-page-scroll bug. Reference:
mari-website `src/components/sections/destination/DestinationTrips.tsx`.

---

## DRK-STANDARD page specs — FAQ page, blog list, blog post, simple page (Adinda, 2026-07-23)
Dictated during the Mari build and declared "standard for DRK websites" — merge into the page
patterns reference. Breadcrumbs on every page except the blog post page.

### FAQ page
Simple hero, no section nav; sub-line pointing topic-specific FAQs to their own pages; a SEARCH
input (the auto-filtering variant of the site's hero search input — componentize) → body: category
list on the left as FILTERS incl. an "All" category (search activity forces "All"); layout = the
categorized-FAQ component in its LIGHT theme → CTA → Contact → Footer.

### Blog posts list
Simple hero + short description → filter bar (search + categories + taxonomy e.g. destinations) →
Featured articles (3 cards, carousel on mobile) → Latest articles (3-card grid rows; 2 rows by
default + "show more" reveals more rows) → CTA → Contact → Footer.

### Blog post page (no breadcrumbs)
Slim hero over the cover image: category + taxonomy tag (diamond-separated, both clickable as
list filters), title, date + author → 3-column content on desktop: LEFT auto-TOC from the H2s with
scroll-spy; MIDDLE full-rich-text body (all inline images join ONE combined lightbox gallery);
RIGHT fixed rail: social share incl. WhatsApp, author bio, newsletter subscribe → Recommended
articles (same category latest; taxonomy match first when present; fallback latest overall) →
CTA → Contact → Footer.

### Simple page (T&C, prices, any legal/utility page)
Title-only hero → full-rich-text body → CTA → Contact → Footer.

### Rich-text conventions that shipped with these (already queued separately, cross-ref)
Inline rich-text images: click-to-zoom lightbox, caption follows the image's alignment control,
one combined gallery per field. Embed-section intros are tier-2 rich text (links/bold/
multi-paragraph), e.g. "contact us" linking the page's #contact section.

## Sitemap upkeep is a NAMED first-line step of every page slice (Adinda, 2026-07-23)
For `references/workflow.md` (the per-slice checklist) — locked after the gap bit twice on Mari
(destination + private-charters slices both shipped without their sitemap entries; found only by a
later SEO verify pass).
- The DRK sitemap is always **code** (Next.js `sitemap.ts` serving `/sitemap.xml`), querying the CMS
  — so CONTENT urls (new destination/boat/post documents) auto-update with zero code changes, and
  `noIndex` docs drop out automatically. That half needs no process.
- The half that CANNOT be automatic: a **new page type / new route** only exists when its code is
  written, so nothing can list it beforehand. Therefore: **"add the new route to `sitemap.ts`" is a
  first-line, named step of the page slice itself — done during the build, before the post-slice SEO
  pass; the SEO pass then VERIFIES it** (a check that can actually fail, not the place it's first
  remembered). Also write the rule into `sitemap.ts`'s own header comment so the file self-documents.

## Deployment boundary: private GitHub = full backup, Vercel gets ONLY build input (Adinda, 2026-07-23)
For `references/workflow.md` + `references/pre-launch.md` — DRK-wide, every client site.
- **Commit + push EVERYTHING to the private GitHub repo**, including internal working docs (`_*.md`,
  handoffs, CLAUDE.md, MANAGER.md). Git+GitHub is the living backup; "local-only" is no longer a doc tier.
  Precondition unchanged: repo stays private, DRK-internal, never client-accessible (no-AI-traces rule).
- **`.vercelignore` at repo root excludes all internal docs from every deployment** — `/_*` plus the named
  non-underscored docs (CLAUDE.md, AGENTS.md, MANAGER.md, COMPONENTS.md, README.md, `.claude/`, etc.).
  Per Vercel docs, excluded files are never uploaded, never in the deployment Source snapshot, never
  served, never stored on Vercel. The requirement this serves: internal docs must not LIVE on Vercel at
  all — "only build output is served" was already true and was not enough.
- **The underscore prefix is what makes the boundary self-maintaining**: one `/_*` glob in `.vercelignore`
  covers every current and future `_`-file with zero upkeep. A non-underscored internal file needs a
  hand-added line — prefer the prefix.
- **Verification is part of the workflow, not optional** (a check that can actually fail): on each of the
  first few deploys of a project, open the deployment in the Vercel dashboard, Source tab, and confirm the
  internal docs are ABSENT. Caveat driving this: Vercel officially documents `.vercelignore` for CLI
  uploads; Git-integration behaviour is community-confirmed only (vercel/vercel discussion #4679).
  Fallback if it fails (failure mode = stored on Vercel, visible to project members, NOT public): deploy
  via CLI/GitHub Actions where `.vercelignore` filters before upload, or a stripped deploy branch.
  Fold the check into the pre-launch no-AI-traces pass — same concern, same timing.

## PageOverview is a DRK-wide section pattern + sentence-case headings convention (Adinda, 2026-07-23)
Two items from the About build:
1. **PageOverview** (centered eyebrow + display-h2 + tier-3 rich body with the site Read More
   collapse — content-based desktop cap, 60dvh mobile cap) is now a shared component with two
   consumers (Private Charters + About) and Adinda called it a **DRK-website-wide pattern** —
   register it in the component conventions alongside SubNav/TabRail/etc. at the next skill round.
2. **Headings in website copy are SENTENCE CASE, not Title Case** — H2 section headings AND
   h3+ headings inside rich-text body copy (the editorial standard; proper nouns keep capitals;
   hero H1s and short card titles may deviate as exceptions). Belongs in the copy/content
   conventions so every DRK site and every copy-drafting agent (Codex included) inherits it.
