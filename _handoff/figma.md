# → Figma file (`TKjkHpjqPVn5yL5TnpuWAt`)

Places where the built site has drifted from — or gone further than — the Figma source, that should be
synced back into the file. Not blocking the build. Append new drift the moment it's noticed, same edit,
not deferred to a later audit.

---

## Pending
- [ ] 🟢 **[LOW PRIORITY — downgraded from 🔴 on Adinda's call, 2026-07-17.** She pushed back on this being
      surfaced as a project risk, and she was right. **The rename itself is DONE and correct** — nothing in
      the codebase is broken or stale. The only consequence is that *Claude*, reading Figma via the MCP, gets
      handed a dead variable name — and the map below already resolves it at zero cost. It affects one reader
      in one direction, breaks nothing, and does not grow worse over time. **Fix it when you're in the Figma
      file anyway; don't make a trip for it, and don't re-raise it as a blocker.]**
      **CODE-SYNTAX BINDINGS POINT AT DEAD TOKEN NAMES — created 2026-07-17, needs Figma access.**
      The CSS palette rename shipped that day: all 11 legacy `--primitive-*` tokens were confirmed against
      the Figma variable panels and renamed. **A rename is a TWO-SIDED job and only the code side is done.**
      Figma's code-syntax field on each of these variables still says `--primitive-…`, and **those custom
      properties no longer exist** — which is why Figma's MCP returns e.g. `var(--primitive-cream-10)`.
      **Until this is fixed: treat ANY CSS name returned by the Figma MCP as STALE** and resolve it through
      the map below (the authoritative copy lives in `src/app/globals.css`'s primitives header).
      | Figma code syntax says | change it to |
      |---|---|
      | `--primitive-cream-10` (#fdfcfa) | `--beige-50` |
      | `--primitive-cream-50` (#f5f0e8) | `--beige-150` |
      | `--primitive-cream-70` (#ece4d6) | `--beige-200` |
      | `--primitive-cream-80` (#dbcdb2) | `--beige-300` |
      | `--primitive-copper-600` (#8f6d51) | `--chocolate-600` |
      | `--primitive-amber-600` (#b58a2d) | `--amber-600` |
      | `--primitive-navy-900` (#1b2a4a) | `--navy-900` |
      | `--primitive-navy-950` (#131d34) | `--navy-950` |
      | `--primitive-stone-400` (#7c7469) | `--stone-500` ☠️ NOT `--stone-400` — that's a different grey |
      | `--primitive-red-600` (#c10007) | `--red-700` ☠️ NOT `--red-600` — that's a different red |
      | `--primitive-teal-600` (#008236) | `--green-600` ☠️ `teal` was never a real family |
      Also check the two renamed 2026-07-16: `--primitive-cream-30` → `--beige-100`, `--primitive-copper-300`
      → `--chocolate-300`. **Match by HEX when you find each variable, never by its old name** — three of
      these are traps where the obvious name belongs to a different colour.
- [ ] **Destination page hero breadcrumb reads "Home / Boats / Komodo"** (node `778:8608`) — "Boats" is a
      copy slip, should be "Destinations". Code's breadcrumb is auto-generated so the live site will be
      correct; fix the Figma text to match. (Found during the 2026-07-16 destination schema pass.)
- [ ] **Boat page section `778:8845` is labelled "Amenities"; we render "Gallery".** ⚠️ **OPTIONAL AND
      UNDECIDED — deliberately not a to-do** (Adinda, 2026-07-17: *"maybe we can fix that or not, that is to
      decide"*). Logged so it isn't rediscovered as a bug. **Our code supersedes Figma here** — the site says
      Gallery on every surface and that is the confirmed intent, so the build is NOT waiting on this and must
      not be "corrected" toward Figma. Gallery is also the better name: "Amenities" would collide with the
      `specifications` row already called *Amenities & Others*. Decide only if/when the file is being tidied.
- [ ] **Boat page copy, two mari-core violations** (found 2026-07-17, not yet fixed in Figma):
      Overview `778:8755` says *"excellent value for money"* → mari-core mandates **"exceptional value"**.
      The Gallery/Amenities section says *"sundeck"* → mari-core locks **"sky deck"**. The build follows
      mari-core, so the live copy will be correct; Figma is what's out of step.
- [x] **[MIRRORED — not Figma hand-work; tracked in the skill ledgers now]** Current destination frame is
      `778:8608` (`Page/Destination`), not the older `675-2363` the skill docs reference — the 778 frame is
      more detailed (has the sub-nav, the "Upcoming Trips" availability widget, etc.). Updating those node
      references is a **skill edit**, and is now queued in both `_handoff/mari-website.md` and
      `_handoff/atlas-website.md` Pending. Nothing to do on the Figma side; kept here as the origin record.
- [ ] Destinations frame only shows 5 of the 9 built destinations.
- [ ] The Boat's Figma copy says "34-meter"; code correctly uses "30-meter" per mari-core — fix the copy in
      Figma to match.
- [ ] Nav gutter numbers — live code uses the responsive `page-gutter-x` utility (24px→48px→80px across
      breakpoints), not a single flat value. Figma is a static desktop artboard, so only the 80px desktop
      value is portable; not touched this pass since Figma's nav frame wasn't located/confirmed.
- [ ] `_Deprecated/*` styles still present — remove.
- [ ] Mega-menu raw colors (near-white raw rgba values, not canonical tokens) — not urgent, deliberately
      ignored per CLAUDE.md, but flagged here for whenever a cleanup pass happens.
- [ ] `Status/Info` / `Feedback/General` tokens never filled in.

---

## Done
- [x] **Scroll-circle (Element/CircleIconButton) border — no drift, closed (investigated 2026-07-07).**
      This file previously claimed Figma 1px → code 1.5px, but every live usage (hero scroll-arrow,
      destinations arrows) actually uses a plain `border` (1px) in code. No drift exists; treated as
      resolved/stale per Adinda's call. If a real 1.5px border is ever wanted, that's a code change, not a
      Figma sync. (Moved out of Pending 2026-07-17 — it was a closed item parked in the open list.)
- [x] **Type-scale rebase synced to Figma (2026-07-07).** Updated 13 local text styles on the Typography
      Foundations frame (`492:1527`) to match `theme.css`'s post-rebase desktop values: Display/Heading/Accent
      48→40 (letter-spacing -2.4px→-2px, preserving the -0.05em ratio), Display/Heading/H2 54→44
      (letter-spacing is percent-based, auto-scales), Display/Heading/H3 40→34, H4 30→25, H5 23→19,
      Editorial/Heading H1 35→33, H2 29→28, H3 24→23, H4 20→19, H5 17→16, H6 14→13, Body/Large 17→16.
      Display/Heading/H1 confirmed unchanged (stays 80, matches code's restored clamp). Every spec-label text
      on the specimen board was updated to match; live sample text auto-updated since it's bound to the styles.
      **Also fixed an unrelated, previously-unflagged drift**: Eyebrow was 12px in Figma vs 11px in code —
      synced Figma down to 11px (letter-spacing 1.5px→1.375px, preserving the 0.125em ratio), per Adinda's call.
- [x] **Search dropdown radius/border synced to live code (2026-07-07).** Found the real component
      (`Element/Input/DestinationSearch`, `Theme=OnDark, State=Active`, node `476:1479` → `Container` node
      `476:1486`) — was 12px radius + 1px gold stroke. Changed to 8px radius (`rounded-md`), stroke removed
      (shadow only), matching `hero.html`'s live `rounded-md ... shadow-card` dropdown exactly. The input
      field itself (rounded-full, 2px gold border) was already correct, untouched.
- [x] **Spacing & Radius specimen board rebuilt (node `412:831`), 2026-07-07.** Was stale: spacing rows used
      an old index-based naming (`spacing/2`=8px, `spacing/3`=12px, etc., not matching theme.css's
      name-equals-px-value convention) and was missing 2px/4px/80px/160px; had an invalid 144px row (real
      scale jumps 128→160, no 144). Radius section only had one row (mislabeled "radius/sm" for what's
      actually 2px/`xs` in the real scale) out of 6. Rebuilt to the full real scale: 14 spacing rows
      (`Spacing/2` through `Spacing/160`, exactly matching theme.css) and 6 radius rows (`Radius/None` 0,
      `Radius/XS` 2, `Radius/SM` 4, `Radius/MD` 8, `Radius/LG` 16, `Radius/Full` 9999, demo shape capped at
      40px corner radius so it renders as a circle). Board's parent frame is Figma auto-layout, so rows were
      reordered via `insertChild` rather than manual x/y (manual y was silently overridden by the auto-layout
      engine on first attempt — logged here in case this bites again on a future edit).
