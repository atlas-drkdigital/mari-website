<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Claude skills

Project knowledge skills currently live outside this repository in the local Claude skills directory:

- Skills root: `C:\Users\adind\.claude\skills`
- Mari brand and product source of truth: `C:\Users\adind\.claude\skills\mari-core`
- Main instructions: `C:\Users\adind\.claude\skills\mari-core\SKILL.md`

When a task involves Mari facts, positioning, management, brand voice or marketing copy, read
`mari-core/SKILL.md` completely first, then load every reference file it routes to for that task.
Do not infer that a Claude skill is unavailable merely because it is absent from Codex's displayed
skill catalog. Check the local Claude skills directory directly.

The Claude skills directory is machine-local and is not stored in this repository. If it cannot be
found at the path above, say so and use the repository's existing content as a fallback. Do not
invent missing Mari facts. On another computer, restore or sync the Claude skills separately, or
update the path in this file.

## Copywriting conventions (Adinda, 2026-07-23)

Headings in website copy use SENTENCE CASE, not Title Case — this applies to section headings
(H2) and to headings inside body/rich-text content (H3 and below): "A traditional Indonesian
Phinisi with diving at its heart", never "A Traditional Indonesian Phinisi With Diving at Its
Heart". Proper nouns (Mari Liveaboard, Phinisi, Komodo, Raja Ampat, Indonesia) keep their
capitals. Hero titles (H1) and short card/benefit titles may deviate — exceptions exist here and
there — but the default for any heading in body copy is sentence case. When drafting copy files
in `_internal/content/`, write headings this way so they can be seeded verbatim.

`_internal/content/` is the canonical, git-TRACKED home for copy drafts (moved from root-level
`content/` in the 2026-07-24 root cleanup — everything internal now lives under `_internal/`).
Do NOT recreate a `content/` folder at the repo root, and do not move copy drafts anywhere else.
The folder must stay git-tracked: it was once swept into an ignored scratch folder and nearly
lost work (that scratch folder is now `_internal/content-scratch/`, which stays gitignored —
tracked drafts and ignored scratch must never share a folder).

## Repository continuity

Keep `AGENTS.md` tracked in Git. It contains shared project instructions needed to resume work after
a fresh clone. Do not add it to `.gitignore`.

Never commit secrets, environment files or machine credentials to `AGENTS.md`. Machine-specific
paths are acceptable as documented pointers, but the external files they reference are not included
in the repository.
