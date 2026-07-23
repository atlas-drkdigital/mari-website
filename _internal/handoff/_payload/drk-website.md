
---

# PART E — 🔴 NEW, HIGH PRIORITY — "Established conventions ALWAYS supersede Figma"

**Added 2026-07-17 at the client's explicit, unprompted instruction:** *"YES conventions always supersede
Figma. Please make sure that THIS entire PROJECT and SKILL (drk-website) understands this to avoid costly
mistakes."* This is a **standing rule for every DRK site**, not one build's preference. It is already
locked in that build's CLAUDE.md; this is the generalized version.

## The rule
**When a Figma node disagrees with a convention the codebase has already established, THE CONVENTION WINS.**
- **Figma is authoritative for structure and intent** — what elements exist, in what order, what the
  section *is*.
- **The codebase is authoritative for expression** — type ramp, spacing scale, colour tokens, gutters,
  responsive behaviour.

## Why it needs to be a rule (four real conflicts, one build, one day — 2026-07-17)
Design files drift *silently*. In every case below, following the node would have shipped a regression:
1. **Spacing — the one that triggered the lock.** A section's Figma said `gap-8` between the heading and
   its description. Every homepage section used **`gap-24`**. Building from Figma would have put an
   interior page visibly out of rhythm with the homepage a visitor arrives from.
2. **Background.** A node specified the palette's near-white. But that token had been deliberately
   swapped a day earlier — by the client — because it "read too white". **Figma never got the memo.**
3. **Colour names.** Figma's code-syntax bindings still emitted primitive names that **had been renamed
   and no longer existed**. Any CSS custom-property name returned by the Figma MCP must be treated as
   STALE by default and resolved through the codebase's own map.
4. **Gutters.** Figma emits flat pixel padding; the codebase had a responsive gutter utility. A flat
   gutter is a mobile bug waiting to happen.

## The practical test — before writing any value off a node
> **"Do we already have a name for this?"**
- Spacing → on the scale? **What do sibling sections use? Check an existing built page first.**
- Colour → resolve the *hex* through the codebase's map. Never trust the Figma *name*.
- Type size → find the ramp entry, don't set a px size.
- Gutter → the project's gutter utility, essentially always.
- **Only when there is genuinely NO name for it** does the Figma value win — and then as an explicit
  arbitrary value, never a rounded guess.

## Two guardrails that keep this from being misread
- **This does NOT license skipping Figma.** The same build had already lost a session to a section built
  from node *names* and guesses instead of a real `get_design_context` pull. **Always pull the node.**
  The rule governs which side wins a *conflict* — not whether to look.
- **When you override Figma, say so in a code comment naming BOTH values.** Otherwise the next session
  reads the divergence as a bug and "fixes" it back to the mockup. An unexplained override is a
  time bomb.

## The two-sided corollary
A rename/retoken is a **two-sided job**: code AND the Figma bindings. Only the code side is ever done by
the agent. **Whoever owns the design file must update its bindings**, and until they do, the mismatch is
expected — not a bug to chase. Worth an explicit tracked item in the design-side backlog.

---

# PART F — Responsive spacing/sizing: STEPPED vs FLUID — pick ONE per project, ask at the start (2026-07-20)

**Added at Adinda's request 2026-07-20**, out of the Mari audit that found 4 boat sections shipped with
FLAT (un-gated) desktop padding on mobile.

## The two legitimate approaches
- **Stepped** (breakpoint-based, Tailwind-idiomatic): `pt-64 lg:pt-[120px]`. Two discrete values, a jump at
  the breakpoint.
- **Fluid** (`clamp()`): `pt-[clamp(4rem,8vw,7.5rem)]`. One value, scales smoothly across all widths.

## The rule — decide ONCE per project, and NEVER MIX
The worst maintenance state is a **mix** — a fluid island in a stepped site (or vice-versa) means two mental
models and silent divergence. So at the **start of a project**, ASK which system to use; then hold it
site-wide. Do not introduce the other one via a one-off bug fix or a single "nicer" section.

## Trade-offs, so the choice is informed
| | Stepped | Fluid |
|---|---|---|
| Debug at a glance | ✅ value is literally what's written | ❌ must compute `Nvw` against the bounds |
| Greppable / consistent | ✅ if the scale is used | ⚠️ only if `clamp()`s are centralized as tokens, else they drift |
| Immune to "forgot the mobile variant → flat" | ❌ the classic failure mode (must remember `lg:`) | ✅ responsiveness lives in the one value |
| Matches Tailwind's utility model | ✅ | ⚠️ arbitrary-value heavy |

## Default and guidance
- **Default to stepped** unless the project explicitly commits to fluid site-wide *with a centralized fluid
  spacing scale* (raw `clamp()` sprinkled per-component is its own mess).
- **Stepped is NOT wrong / not "un-best-practice"** — it's how most of the web works. Fluid is an
  *enhancement*, not a *correction*. The genuinely-bad state is **flat** (no responsiveness at all); both
  stepped and fluid fix that.
- **Preserving the desktop LOOK ≠ hardcoding a desktop pixel.** A fluid value can be tuned to land on the
  same desktop appearance while scaling on mobile — "looks identical on desktop" and "uses a responsive
  value" are independent goals, not a trade-off.
- Raising an existing stepped site to fluid is a **deliberate, scheduled site-wide pass**, never piecemeal.
