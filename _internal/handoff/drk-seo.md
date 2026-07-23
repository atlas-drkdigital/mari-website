# Handoff → `drk-seo` skill

Staging area for SEO/AEO conventions decided on this build that should be merged into the `drk-seo`
skill (reusable across all DRK client sites). Same mechanism as `_internal/handoff/drk-website.md` — merge in chat,
then strip merged items from here.

## Pending

### 🔴 [NEW 2026-07-17] IMAGE SEO IS ENTIRELY ABSENT FROM THIS SKILL — filenames, alt text, Google Images
**Target:** a new `references/image-seo.md`, or a section in `technical-seo.md`. Cross-ref `drk-website`'s
Sanity image-pipeline item (that one owns *delivery*; this owns *discoverability* — different jobs).

**The gap, verified by a full grep of the skill (2026-07-17), not assumed.** `SKILL.md`, `README.md`,
`MANAGER.md`, `DEPENDENCIES.md` and all four references were searched for filename / file name /
Google Images / img / photo / alt. **Complete inventory of what exists:**
- `SKILL.md` quality bar: *"Open Graph image is 1200x630 and referenced via canonical URL builder."*
- `technical-seo.md` L130-134, the ONLY image section — *"Use `next/image` … Serve WebP/AVIF … LQIP …
  explicit dimensions"* — filed under **Performance / Core Web Vitals**, i.e. speed, not discoverability.
- `structured-data.md` uses `image:` in JSON-LD examples; `eeat-principles.md` has an author-schema image field.

**Absent entirely:** image filename conventions · alt-text conventions · Google Images optimisation ·
image ranking factors · any statement of how filenames weigh against alt vs. page context.
`drk-seo-writer` is no better — four passing mentions, all treating alt as a tickbox, and its own
`MANAGER.md` L53 already admits the hole: *"No image / visual asset planning. Skill references
'supporting visuals' but does not generate alt text or image briefs."*

**Consequence worth stating plainly:** `drk-website`'s vanity-filename fallback chain (`seoImageName` →
`originalFilename` → slugified `alt` → omit) is a **local decision with no skill backing** — `drk-seo`
neither supports nor contradicts it. That's a rule about SEO living in the wrong skill.

**The convention to merge (client's own call 2026-07-17, and it's the right split):**
> **Filenames are for ORGANISATION. Alt text is for SEO.**
Filenames are a real but *minor* signal; alt text, the surrounding heading, and page context carry
substantially more weight. For branded queries the site wins on authority regardless of filenames. So a
filename convention is worth having because it is nearly free and **permanent once content exists** — but
it is not worth agonising over keyword variants. Spend the effort on alt.
- Shape used: `{brand}-{category}-{nn}-{2-3 descriptive words}.{source ext}`
- **Never hardcode the extension** — a `.png` → `.jpg` "rename" is a lossy re-encode (see `drk-website`).
- **Describe what is IN THE FRAME, not a classification you can't verify.** `beanbags-under-shade-net`,
  not `sky-deck-beanbags`. A filename that makes no factual claim cannot be falsified later, so naming
  never blocks on an open content question and no rename is owed. This is the reusable trick.
- Where the CMS derives a **vanity CDN URL from `originalFilename`** (Sanity does), the filename IS a
  public URL segment — so working-state words (`-fave`, `-edited`, `-final`, `-original`) must never
  survive into it.

**Two myths to kill in the same edit — both traced and both false:**
1. ❌ ***"Google recommends ~200KB per image."*** Widely repeated; **traces to NO Google source.** Invented.
   Don't cite it. Real reference point: HTTP Archive 2024 median largest-image-per-page = **135KB**
   (p75 404KB).
2. ❌ ***"High-DPR screens tolerate lower quality."*** Rests on a single 2012 Filament Group test that now
   carries an outdated-advice disclaimer and **failed independent replication** (the effect was a
   Photoshop artifact). Directionally maybe true; not evidence.

**And one live number the skill should carry, because a stale pipeline now gets flagged:** Chrome's
image-density target **tightened from 2.0 → 1.33 bits/px** between Lighthouse 12 and 13, and LH13
**deleted** the "Properly size images" / "Efficiently encode images" audits in favour of one
`image-delivery-insight`. Any advice written against the old audits (including the still-live Chrome doc
citing the 4KiB rule) is stale. Source: shipping DevTools `ImageDelivery.ts`
(`TARGET_BYTES_PER_PIXEL_AVIF = 2 * 1/12`). Cross-check that earns trust: 1.3 bits/px is exactly the
Web Almanac 2024 median real-world WebP.

**A `<45vw`-style thumbnail can be the LCP element** (≈280,000px² vs ≈108,000px² for a two-line H1) —
worth one line in the skill, since the escape hatch is non-obvious: below-the-fold elements are not LCP
candidates at all.

---

## Done — reconciled 2026-07-17 against the installed drk-seo skill

Adinda updated the chat-side skill from `_payload/drk-seo.md`, re-exported, and Claude installed it.
Verified against the extracted package before install and spot-checked after. `aeo-considerations.md`
+59 lines, `structured-data.md` +2.

- [x] **FAQ SEO/AEO handling** → `references/aeo-considerations.md`, new "FAQ SEO/AEO" section, date-stamped
      (researched 2026-07-16) with all 10 sources. Verified present:
      1. **The counterintuitive headline landed WITH its reason** — Google restricted FAQ rich results to
         gov/health sites in late 2023 (no SERP accordion for commercial sites), *and we emit it anyway*
         because it feeds AI Overviews and is cited by ChatGPT/Perplexity/Copilot. The file states the trap
         explicitly: *"Anyone who learns only that fact will reasonably conclude `FAQPage` schema is obsolete
         and remove it."* That framing was the whole point of the item — the snippet already existed; the
         reasoning didn't.
      2. **Semantic HTML** — native `<details>`/`<summary>` + `<h3>` per question; ARIA only for a custom
         button accordion, *not* stacked on native `<details>`.
      3. **AEO citability** — answer-first lead ("an answer engine lifts the lead, not the build-up"), natural
         user-query phrasing, stable URL + `#anchor` per Q&A, consistent entity naming, Organization schema.
      4. **Hybrid structure** — embedded per-page FAQ sections (JSON-LD scoped to that page) PLUS a central
         `/faq` hub. Not either/or.
      5. **Per-slice process** — cross-references `drk-website` → `workflow.md` → per-slice family (M3),
         correctly marked as landed 2026-07-17 rather than "queued". Ownership split recorded: `drk-seo` owns
         the FAQ-specific application, `drk-website` owns the sequencing convention.
- [x] **`structured-data.md` cross-reference added** — points back to `aeo-considerations.md` for the full
      reasoning, with the short answer inline plus the "scope per page, don't dump all site FAQs into one
      emission" guard.

**Known cosmetic deviation, accepted — do NOT re-queue as a fix.** The payload said "do not re-add the
`FAQPage` snippet." The session instead **copied** it into the new section (line ~67) while the original
stayed under "Technical Implementation" (line ~127), so the same code block now appears twice in the file —
under a heading that reads *"already in this file — don't re-add it"*. Both copies are identical and correct;
the cost is a little bloat and a mildly self-contradicting label. Judged not worth a chat round-trip. Fix
opportunistically if that file is ever open for another reason.
