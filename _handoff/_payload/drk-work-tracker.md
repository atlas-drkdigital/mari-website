# PAYLOAD — NEW DRK SKILL: `drk-work-tracker`

**Status:** staged 2026-07-18, NOT yet authored chat-side. This file is the canonical source for the
skill's content — paste it into a chat-side skill-creation session, export to Downloads, install locally.
The Mari-side enforcement is already live (see that repo's `CLAUDE.md`, session-bookend protocol step 6).

**Why it exists:** Adinda is running a deliberate productivity experiment — how long things actually take,
planned-vs-actual, where time leaks. The tooling half already existed (a per-repo "Session Time Log" table
+ a daily-recap template) **but was not being filled** — on the Mari build, the two single biggest days
(a full build day + the day after) went completely unlogged. The gap was never tooling; it was
**enforcement + consistency + granularity**. This skill is the enforcement.

**Scope note — this is a NEW standalone skill, by Adinda's explicit call 2026-07-18.** It was considered as
a folded-in section of `drk-website` (to avoid skill sprawl); she chose a dedicated skill because work-
tracking is a self-contained protocol she wants to invoke by name across every DRK project, not just web
builds. `log` / `recap` / `week` / `start` are **modes of this one skill**, not separate skills.

---

## Proposed `SKILL.md` frontmatter

```yaml
---
name: drk-work-tracker
description: >-
  Logs and analyses how work time is actually spent across a DRK project — enforced session logging
  (elapsed vs active time, planned-vs-actual-vs-unplanned, blockers, estimate accuracy) plus on-demand
  weekly/period recaps. Use at the start and end of EVERY work session (fires with the session-bookend
  recap / "good morning" / "wrapping up"), and whenever the user asks how they spent their time, how long
  something took, whether they're on estimate, for a daily or weekly recap, "where did my time go", or a
  productivity breakdown. The per-project log lives in that repo's running log file (e.g. MANAGER.md's
  "Session Time Log"); this skill owns the protocol that keeps it filled and turns it into a recap.
---
```

The `description` IS the trigger surface — it must fire on: session bookends, time/productivity questions,
"how long did X take", "am I on estimate", "weekly recap", "log this session", "where did my time go".

---

## The three modes (one skill)

### Mode `log` — SESSION CLOSE (the core enforced flow)
**Fires:** at every session close — any wrap-up signal ("that's it for today", "let's stop", "good night",
or a commit-at-session-end), OR the session-bookend end trigger, OR explicit `/drk-work-tracker log`.
**Non-skippable** — wired into the host project's session-bookend protocol as a mandatory close-out step.

Steps:
1. **Derive elapsed** from `git log` commit timestamps (first→last of the session) + the message span. Do
   NOT ask the user for elapsed — it is derivable. Present it as an outer bound (wall-clock, includes breaks).
2. **Ask the ONE thing only the user knows: active desk time.** Users step away (kanji, cooking, errands)
   while builds/scripts/research run — elapsed ≠ active, and that gap is itself the data. One question.
3. **Reconcile planned → actual → unplanned** against the project's active queue / day plan:
   - **Planned:** what was scheduled for the session.
   - **Actual:** what shipped (cross-check against commits).
   - **Unplanned:** what leaked in — bugs, false-alarm chases (e.g. a cache issue mistaken for a code bug),
     ad-hoc requests, rabbit holes. This column is where the real productivity signal lives.
4. **Blockers** — note new ones; carry open ones forward until cleared.
5. **Write the row** to the per-repo Session Time Log AND update the day-plan actuals.
6. **Estimate accuracy** — planned est vs actual, so estimates self-calibrate over time.

### Mode `start` — SESSION OPEN (carry-forward)
**Fires:** with the bookend start trigger ("good morning" / "where are we" / recap request).
Surfaces: open blockers + the prior session's **unfinished planned items** + the running estimate-accuracy
trend. Stamp the session start (git/clock-derivable). Runs BEFORE work is proposed, so the day's plan is
made with yesterday's slippage visible.

### Mode `recap` / `week` — ANALYSIS (manual, on demand)
**Fires:** "weekly recap", "how did I spend my time", "productivity breakdown", "what did we get done this
week", "am I on estimate", or `/drk-work-tracker recap|week`.
Generates the full recap (format below) from the Session Time Log + git history + the running log's dated
checkpoints. `week` = the estimate-vs-actual analysis specifically; `recap` = the full narrative.

**Bare `/drk-work-tracker`** = infer the mode from context (session-end context → `log`; a question about
the past → `recap`).

---

## Data model — the per-repo Session Time Log row

Reuse/extend the host project's existing time-log table. Required columns per session:

| Column | Source | Notes |
|---|---|---|
| Date | clock | one row per session, multiple sessions/day allowed |
| Session focus | actual work | terse, concrete (name files/decisions, not "worked on X") |
| Elapsed | git-derived | wall-clock outer bound, first→last commit + message span |
| Active | **user, 1 question** | the honest effort number; only the user knows it |
| Planned est / Actual | day plan vs reality | drives estimate-accuracy |
| Unplanned | reconciliation | bugs / chases / ad-hoc — the leak signal |
| Blockers | carried forward | open until cleared |

**Honest-data boundary (state it, don't hide it):** session start is derivable; **active desk time stays a
one-question self-report.** The win is *enforced every session*, not *measured to the minute*. Don't
fabricate active time from commit gaps — commit gaps lie about desk time (a 3h gap may be one 20-min task
plus lunch).

---

## Recap output format (Mode `recap`)

Produce, in this order (matches the daily-recap template the DRK workflow already defines — this skill is
its data engine):
1. **TLDR** — what the period achieved, one paragraph + a short bullet list by workstream.
2. **Daily breakdown table** — Date · Focus · Logged time (elapsed/active) · commit count. Flag days with
   NO active-time data explicitly (do not imply a day was light just because it's unlogged).
3. **Planned but NOT done** — from the day plan; note where slippage was *knowingly accepted* vs a real miss.
4. **Done but NOT planned** — the unplanned column, aggregated (the time-sinks worth seeing).
5. **Blockers** — current, with who owns each.
6. **Estimate accuracy** — planned vs actual per item, so the next plan is better calibrated.

---

## Enforcement (host-project side, already done for Mari)

The skill is inert without a host-project rule that FIRES it. Each DRK repo's session-bookend protocol gets
a mandatory step: "run `drk-work-tracker log` at close, `start` at open." Verification-ritual principle: a
log that can be silently skipped is not a log — so it's a named, non-skippable step, not "remember to log."

---

## Generalisation note

Everything above is project-agnostic (the only Mari-specific binding is *which file* is the running log —
MANAGER.md here). This is a genuine DRK-wide skill. The host-project enforcement rule is also queued for
`drk-website`'s `references/workflow.md` (it belongs next to the daily-recap-template + commit-cadence +
session-bookend conventions), pointing AT this skill rather than duplicating it.
