# → mari-project skill

Items that need a manual chat-side edit to `mari-project` (same reason as `drk-website` — no live bridge
from this local session to the chat container that owns the skill source; see `_internal/handoff/drk-website.md`
for the full explanation of that mechanism). Paste this file's Pending section into a session scoped to
`mari-project` when you're ready to do the update there.

---

## Pending

_Empty — everything queued for `mari-project` was merged and verified on 2026-07-17 (see Done). Append new
project-status / scope drift here as it emerges._

**Note for whoever refills this:** the 2026-07-16 round left this section reading "Empty" while real work sat
staged in a separate payload file — the tracker's own ledger was lying about itself for a day. If work is
staged elsewhere, say so HERE. "Empty" must mean empty.

---

## Done — reconciled 2026-07-17 against the installed mari-project skill

Adinda updated the chat-side skill from `_payload/mari-project.md`, re-exported, and Claude installed it.
Verified against the extracted package before install and spot-checked after.

- [x] **Homepage status corrected** → `working/sprint.md` page table + MANAGER.md: "Fully wired (2026-07-16,
      commit `7825576`) — no hardcoded fallbacks. Only Nav + Footer remain hardcoded (global chrome → own
      slice)." The "finish wiring Destinations carousel" to-do is closed; **Global-chrome slice** added as the
      next to-do. Wiring detail correctly pointed at `mari-website`, not restated. *(The old "8 sections
      wired… carousel still hardcoded" line survives only inside MANAGER.md's dated v1.9 changelog entry —
      that's history, not live status, and is correct to keep.)*
- [x] **SEO is no longer a separate pass** → `sprint.md`: QA Pass 1 (Jul 24) is now **"Technical — SEO
      structure already exists per-slice; this pass is verification only"**, and the Jul 28 content pass reads
      "SEO structure not rebuilt here." Both the one-liner AND the affected rows were corrected — a pointer
      alone would have left the schedule contradicting itself.
- [x] **Current queue updated** → FAQ restructure, section visibility (toggles + auto-hide + FAQ min-height),
      theme tweak, then Destination slice → Global-chrome slice. One-line pointers recorded for the FAQ model
      and the standing build principles, with detail left in `mari-website` / `drk-website`.
- [x] **Skeleton-first retrospective** → MANAGER.md, "2026-07-16 — Skeleton-first cost us rework". Recorded as
      a project retrospective; the forward-looking rule itself stays queued for `drk-website`.
- [x] **Testimonials page row added** → `sprint.md` page table: *"New page — not a re-order. Simple: no design
      yet. Copy not written. Structure/schema in `atlas-website`; page status/copy in `mari-website`."* Also
      appears in the Jul 23 day-plan row. **Minor inconsistency, not worth a round-trip:** the page table's
      Build column reads "TBD" while the day plan schedules it Jul 23.
- [x] **Day plan replaced + schedule honesty recorded** → `sprint.md`: Jul 20 is a **deliberately blocked
      Destination-only day** ("Do not re-pack"); the **zero-slack warning** is recorded verbatim in spirit
      (~14–21.5h into ~15–18h; Jul 23 buffer consumed by the blocked day + Private Charters + Testimonials);
      the flex order (Blog → Testimonials → Announcement bar) and the do-not-cut list (About, FAQ, schema
      review) both landed. `boatDefaults` + auto-hide/FAQ min-height now land Jul 17, pushing Destination to
      Jul 20.
- [x] **The stale FAQ-pointer hedge was NOT added.** The staged payload (written 2026-07-16) instructed marking
      the pointer *"see `mari-website` — its faq.md update is pending"*. That instruction was removed before
      this pass ran, because `mari-website` landed earlier in the same round. *Verified:* no "pending" / "known
      stale" hedge appears anywhere in the skill.
- [x] **`full-wire-per-slice` was NOT re-added** — *Verified:* it was already present (SKILL.md + MANAGER.md)
      from the 2026-07-16 round, and the payload's "don't re-add" instruction held.

## Done — reconciled 2026-07-16 against the installed mari-project skill

Adinda updated the chat-side skill from `_mari-project-chat-payload.md`, re-exported, and Claude installed
it. Verified against the freshly-installed `SKILL.md`:

- [x] **Website workstream status refreshed** — no longer "Static HTML homepage in progress"; now reads
      design sprint complete, homepage ported to Next.js + QA-passed, Sanity schema layer in progress (boat
      page + full Tier 4 shells, most pending review). Sprint plan table updated (2026-07-16) with the build
      phase 🔵 in progress and design rows ✅.
- [x] **Skills-infrastructure table corrected** — `atlas-website` and `mari-website` are no longer "Not
      started"; all three website skills marked built + installed + **updated 2026-07-16** (drk-website
      v0.10, atlas-website v0.6, mari-website v1.5), with the strategy note fixed (they're in active use,
      Mari is the pilot, not "deferred indefinitely").
- [x] **New locked scope folded in** — new sibling repo for the Next.js + Sanity build (`v1-static-homepage`
      frozen as historical record); contracted-deliverables reconciliation against Notion's Master
      Deliverables page; TripAdvisor + Instagram integrations marked **contingent-only** (Stefan hasn't
      signed the social add-on); announcement/pop-up bar + pre-launch security review pass added as in-scope.
- [x] **Contract timeline set straight** — signed ~May 10, 12-week term, real target **Aug 10, on schedule**;
      the old ~Jul 24 concern is resolved and marked do-not-re-raise. The Type A brochure was voluntary
      out-of-scope work that created the earlier appearance of pressure.
- [x] Itineraries workstream confirmed already accurate (`mari-itineraries` v1.0, 2026-07-12) — no change.

---

## Done

_(2026-07-16 was the first transfer round for this file.)_
