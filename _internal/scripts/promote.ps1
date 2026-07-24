# Promote the current `main` to a DEPLOYABLE branch — the strip step (2026-07-24, Adinda's model).
#
# THE BRANCH MODEL (three branches, no more):
#   main       internal working branch — code + ALL documents. The living backup. NEVER deployed.
#   staging    auto-generated STRIPPED copy of main → the Vercel staging site.
#   production auto-generated STRIPPED copy of main → the live site (created at launch).
#
# Both deployable branches are stripped BY CONSTRUCTION — there is no with-documents version of a
# public branch, because the with-documents version is `main` itself. This replaced an earlier
# 4-branch shape (staging-with-docs + a separate `deploy` mirror) that Adinda correctly called
# redundant: production is public by definition, so a "production-public" twin is noise.
#
# WHY THIS EXISTS: `.vercelignore` does NOT filter Vercel's Git-integration deploys — verified
# 2026-07-24 by Adinda's Source-tab check, which found _internal/ + every root .md stored in the
# deployment. Stripping BEFORE the push is the only mechanism that actually keeps them off Vercel.
# Side benefit: each deploy is ONE squashed commit authored "drk-deploy" with a neutral message,
# so the Vercel dashboard never shows working commit messages either (matters once the client has
# dashboard access).
#
# USAGE:  ./_internal/scripts/promote.ps1              → promotes to staging
#         ./_internal/scripts/promote.ps1 production   → promotes to production (at launch)
#
# The branch is rebuilt from scratch each time (orphan commit, force-push): its history is
# disposable by design — main holds the real history.
#
# ⚠️ KEEP $Strip IN SYNC: anything internal added at the repo ROOT must be listed here, or it ships
# to Vercel. Files inside _internal/ are covered forever — prefer putting things there.

param([string]$Target = "staging")

$Strip = @(
  "_internal", ".claude", ".agents", ".vscode", ".github",
  "CLAUDE.md", "AGENTS.md", "MANAGER.md", "COMPONENTS.md", "SANITY-SETUP.md", "README.md",
  "skills-lock.json", ".vercelignore"
)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $repo

if ((git status --porcelain) -ne $null) { throw "Working tree is dirty — commit or stash before promoting." }

$sha = (git rev-parse --short main).Trim()
$original = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host "Promoting main@$sha -> $Target"

git checkout --quiet main
git checkout --quiet -B "_promote-tmp" main

foreach ($path in $Strip) {
  if (Test-Path $path) { Remove-Item -Recurse -Force $path }
}

git add -A --quiet
git config user.name "drk-deploy"
git config user.email "deploy@drkdigital.com"
git commit --quiet -m "Deploy $sha"

# Squash to a single orphan commit so no working history travels with the branch.
$tree = (git rev-parse "HEAD^{tree}").Trim()
$commit = (git commit-tree $tree -m "Deploy $sha").Trim()
git push --force origin "${commit}:refs/heads/$Target"

git checkout --quiet --force $original
git branch -D "_promote-tmp" --quiet
git config --unset user.name
git config --unset user.email

Write-Host "Done. $Target now holds a stripped snapshot of main@$sha."
Write-Host "Verify:  git ls-tree --name-only origin/$Target"
