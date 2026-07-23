# _ADINDA-TODOS — things only Adinda can do

Actions that need a human, outside Claude Code. Claude cannot do these — they need Drive access,
an image editor, or an answer from Serge. Claude keeps this file current; Adinda ticks it off.

Created 2026-07-17 (boat-page image pipeline session).

---

## 🔴 BLOCKING — one action unblocks the most work

### 1. Add a Drive shortcut to Ayu's shared photo folder  ·  ~10 seconds
In Google Drive: right-click **`Mari Liveaboard Photos`** (shared by arsandhi.ayu@gmail.com) →
**Organise** → **Add shortcut to Drive** → put it in **My Drive**.

**Why:** Drive for Desktop does NOT sync "Shared with me". A shortcut mounts it under
`G:\.shortcut-targets-by-id\` and Claude can then read it exactly like `##MARI` — view every
photo, measure every dimension, match them against ours, and copy the best versions into place.
Right now Claude is blind to that folder: the Drive connector returns files as base64 (≈350k
tokens per MB — not viable) and Drive's metadata carries **no pixel dimensions**, so
"is this file higher-res?" is literally unanswerable without the sync. (The existing
`Learning Resources` shortcut proves the mechanism works on this machine.)

**What it unblocks:** `2. Mari Profils` contains files that are NOT in `##MARI` at all, and the
names map straight onto our two weakest sailing shots:
```
Sail away - Mari Liveaboard.png     2,896,241 B   ← owned by mariliveaboard.marketing@
Sails Up - Mari Liveaboard.png      2,113,019 B   ← same account
3 Mari Liveaboard.jpg               1,054,346 B
Mari Sailing 2 / 3 / 4                511k–765k
Anchored at Sunset  ×2                511k / 533k
```
vs. our `boat-04-under-sail-daytime` (272 KB) and `boat-06-under-sail-sunset` (199 KB).
⚠️ Size is only a *hint* — a bloated PNG of a small image looks identical in metadata. Your own
folder already contains that exact trap (`exterior-001-original.jpeg` is SMALLER than its own
derivative). Only the sync settles it.

---

## 🟡 IMAGE WORK — 6 files to upscale

📁 `G:\My Drive\##MARI\02. IMAGES\_website-ready\_needs-upscale\`
The **target width is the filename prefix**. Full brief in `_READ-ME-targets.txt` in that folder.

| File | Now | → Target | × |
|---|---|---|---|
| `2400w__…hero-02-aerial-sunset.png` | 1312 × 809 | **2400 × 1480** | 1.83× |
| `1600w__…boat-01-side-deck-golden-hour.jpg` | 1023 × 1537 | 1600 × 2404 | 1.56× |
| `1600w__…boat-05-under-full-sail.jpg` | 1068 × 1473 | 1600 × 2207 | 1.50× |
| `1600w__…boat-06-under-sail-sunset.jpg` | 1176 × 784 | 1600 × 1067 | 1.36× |
| `1600w__…dining-02-breakfast-fruit-spread.png` | 1219 × 1290 | 1600 × 1693 | 1.31× |
| `1600w__…boat-04-under-sail-daytime.jpg` | 1264 × 843 | 1600 × 1067 | 1.27× |

- **`hero-02` is the one that matters.** It runs full-bleed; at 1312px it is unusable, not merely
  soft. The other five are gallery slots and are "nice to have".
- **Keep the filename prefix on** — Claude strips it automatically on the way back.
- **Export the same format the file already is** (`.png` stays `.png`), JPEG at **q90+**, **no WebP**.
  Sanity re-encodes on delivery, so compressing here means compressing twice, and it shows.
  File size does not matter at this stage — bigger and cleaner is strictly better.
- ⚠️ **Do #1 (the shortcut) FIRST.** If Ayu's folder has real originals of `boat-04`/`boat-06`,
  two of these six evaporate. Don't upscale what might already exist at full resolution.
- **Nothing is blocked on this.** Current-resolution copies are already in `boat-page\`; the site
  can be built and uploaded today. These are upgrades.

---

## 🟡 QUESTIONS FOR SERGE

### 3. ~~Hull colour question~~ — DROPPED 2026-07-21 (Adinda)
Adinda's call: mari-core is correct as-is and this doesn't matter — dropped along with the whole
`_handoff/mari-core.md` backlog (file deleted). `hero-01` stays the hero; don't re-raise.

### 4. Do model releases exist for guest photos?
Four photos show clearly identifiable guests. Worth knowing before they go on a commercial page:
- `photo-01-guests-sunset-drinks` — a full group, faces sharp, **and it looks noticeably older
  than the rest of the set**
- `diving-03-divers-boarding-tender`
- `diving-04-tender-island-excursion` — includes a child
- `relaxation-02-hammock-shaded-lounge`

### 5. Pre-existing boat-page blockers (not from this session — still open)
- 🟡 **Amenities 5 tab labels unconfirmed** — blocks the Amenities/Gallery tab copy
- 🔴 **Crew count framing**: 14 total vs 10 operational — affects overview card + all marketing copy
- ~~Oxygen / first aid / camera rinse tank~~ — **CLOSED 2026-07-21 (Adinda): `mari-core`'s ✅ is
  correct.** `mari-website` still marks them 🔴 unverified — flip those flags at that skill's next
  update (queued in `_handoff/mari-website.md`).

### 6. Do true full-res originals exist anywhere? (low priority)
Ayu's folder is byte-identical to `##MARI` — it IS the source, and Ayu no longer works for Mari, so
there's no one to chase there. Everything sits at ~1535px. The only two accounts that could
plausibly hold real masters: **`sergedahan@gmail.com`** (owns `mari-liveaboard-deck-003.jpg`) and
**`mariliveaboard.marketing@gmail.com`** (owns `Sunset drink on the Sky deck.png`, `Sail away`,
`Sails Up`). One passing question someday — **not worth blocking on.** Thumbnails are unaffected;
only the lightbox is mildly soft.

---

## 🟢 DECISIONS FOR ADINDA (quick, no research needed)

### 7. `boat-04` vs `boat-06` — same frame, two grades. Pick one.
`boat-04-under-sail-daytime` (blue sky) and `boat-06-under-sail-sunset` (orange sky) are
near-certainly **the same photograph, colour-graded two ways** — identical wetsuits on the rail,
identical sail set. Only one belongs in the gallery.

### 8. Skills backlog — THREE skills have unmerged content from today
Per the session-bookend protocol. No live bridge from this repo to the chat-side skills — each merge
happens manually, in chat, **one skill at a time**. Today's session queued into:

| Handoff file | What's queued | Priority |
|---|---|---|
| `_handoff/drk-seo.md` | **Image SEO is entirely absent from that skill** (verified by full grep) — no filename, alt, or Google Images guidance at all. Plus two myths to kill and Chrome's 2.0→1.33 bits/px change | 🔴 real gap |
| `_handoff/drk-website.md` | Sanity image pipeline (measured) · component-not-assumption sizing · filenames lie · rename≠re-encode · Drive shared-folder access | 🟡 |
| `_handoff/mari-website.md` | 2 stale "sun deck" instances in private-charters (now a safe straight replace) · flip the 🔴 equipment flags to match mari-core · gallery categories + naming convention + photo source of truth | 🟡 |

(`_handoff/mari-core.md` was RETIRED 2026-07-21 — Adinda confirmed mari-core correct on all four
queued items; the file is deleted and there is nothing to merge.)

---

## 🔵 DEV ENVIRONMENT — one click each, Claude has no access

### 9. Sanity CORS — add the LAN IP so Studio content live-updates on your phone
Open this, confirm, and make sure **"Allow credentials" is ON**:
```
https://sanity.io/manage/project/kb8eim50/api?cors=add&origin=http%3A%2F%2F192.168.0.101%3A3000
```
**What breaks until it's done:** **Sanity Live is dead on the phone** — content you publish in Studio will
not live-update at `192.168.0.101:3000`. The page renders fine regardless, which is why nobody noticed.

**What this is NOT — read before expecting a change:** this is **not** the "read more missing on mobile"
bug. That was your phone's cache (incognito fixed it). Proven 2026-07-17: the button and the heading
margin both render correctly over the LAN IP *while this error is firing*. Fixing this will change nothing
visible. It only restores live updates.

**Why Claude can't:** needs Sanity project admin.

⚠️ **Re-do it if your Wi-Fi IP changes** (DHCP). **There are TWO separate allowlists** and both need the
IP: this one, and Next's `allowedDevOrigins` in `next.config.ts` (that one Claude can edit). Setting one
does nothing for the other. Current IP via `ipconfig`.

### 10. Figma — code-syntax bindings still point at deleted token names  ·  🟢 LOW
The colour rename shipped on the code side; Figma's code-syntax field on each variable still says
`--primitive-…`, and those custom properties no longer exist. **Nothing is broken** — it only affects
Claude reading token names out of Figma's MCP, and the map in `globals.css`'s primitives header resolves
it for free. **Do it when you're in the file anyway; don't make a trip.** Full table: `_handoff/figma.md`
(top item). **Match by HEX, never by the old name** — three are traps where the obvious name is a
different colour.

---

## 🟢 DECISIONS — Overview / typography (added 2026-07-17, boat-page sections session)

### 11. Overview eyebrow — Figma vs mari-core
Figma says *"Liveboard Indonesia Overview"* (their typo); we render *"Premium diving at exceptional
value"*. Which wins? It's a Sanity value — 10 seconds either way.

### 12. The editorial ramp's lower end — the real fix for "h4 reads like body text"
`editorial-h5` is **16px, identical in size to body-large**, differing only by weight. `editorial-h4` is
19px. You read h4 as body copy and you were right. The weight was bumped 500→600 as a patch; **the sizes
are the actual question**, and it's a Figma/token decision, not a component one. (Line-height is settled —
you confirmed it's not the issue, and the 8px heading top margin is in and approved.)

### 13. The Overview collapse cap — `max(240px, 60dvh)`
Your number, never reviewed at that value on a real screen. It's what decides how much body text shows
before "Read more".

### 14. Internal links in rich text — typed paths vs. document picker
Editors can now type `/boats/mari` into a link (fixed 2026-07-17 — see MANAGER.md). **But a typed path
silently 404s if a slug ever changes.** The robust alternative is a document picker (choose the page from
a list, slug resolves automatically, survives renames) — that's real work and isn't built. Flagged so it's
your call, not a default. Fine to leave as-is pre-launch.

---

## ✅ DONE THIS SESSION (no action needed — for reference)
- 25 gallery photos renamed + sorted into `_website-ready\boat-page\` (originals untouched)
- Naming convention locked: `mari-liveaboard-{category}-{nn}-{2-3 words}.{ext}`,
  categories `boat / dining / diving / relaxation / photo`
- Sanity image pipeline measured against the live CDN and documented in `CLAUDE.md`
- The old "compress/resize BEFORE upload" rule was **measured wrong** and deleted
