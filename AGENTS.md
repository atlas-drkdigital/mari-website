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
in `content/`, write headings this way so they can be seeded verbatim.

`content/` at the repo root is the canonical, git-TRACKED home for copy drafts — do not move it
or rename it (it was once swept into the ignored `_content/` scratch folder and nearly lost work).

## Repository continuity

Keep `AGENTS.md` tracked in Git. It contains shared project instructions needed to resume work after
a fresh clone. Do not add it to `.gitignore`.

Never commit secrets, environment files or machine credentials to `AGENTS.md`. Machine-specific
paths are acceptable as documented pointers, but the external files they reference are not included
in the repository.
