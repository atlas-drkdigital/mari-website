# Promote the current `main` to a DEPLOYABLE branch - the strip step (2026-07-24, Adinda's model).
#
# NOTE: ASCII ONLY in this file. PowerShell 5.1 reads .ps1 as ANSI, so a UTF-8 em-dash or arrow
# becomes mojibake and breaks parsing (cost us a round on 2026-07-24). Plain hyphens, no arrows.
#
# THE BRANCH MODEL (three branches, no more):
#   main       internal working branch - code + ALL documents. The living backup. NEVER deployed.
#   staging    auto-generated STRIPPED copy of main, deployed to the Vercel staging site.
#   production auto-generated STRIPPED copy of main, deployed to the live site (created at launch).
#
# Both deployable branches are stripped BY CONSTRUCTION - there is no with-documents version of a
# public branch, because the with-documents version is `main` itself. This replaced an earlier
# 4-branch shape (staging-with-docs + a separate `deploy` mirror) that Adinda correctly called
# redundant: production is public by definition, so a "production-public" twin is noise.
#
# WHY THIS EXISTS: `.vercelignore` does NOT filter Vercel's Git-integration deploys - verified
# 2026-07-24 by Adinda's Source-tab check, which found _internal/ and every root .md stored in the
# deployment. Stripping BEFORE the push is the only mechanism that actually keeps them off Vercel.
# Side benefit: each deploy is ONE squashed commit authored "drk-deploy" with a neutral message,
# so the Vercel dashboard never shows working commit messages either (matters once the client has
# dashboard access).
#
# USAGE:  powershell -ExecutionPolicy Bypass -File _internal\scripts\promote.ps1
#         powershell -ExecutionPolicy Bypass -File _internal\scripts\promote.ps1 production
#
# The branch is rebuilt from scratch each time (orphan commit, force-push): its history is
# disposable by design - main holds the real history.
#
# KEEP $Strip IN SYNC: anything internal added at the repo ROOT must be listed here, or it ships
# to Vercel. Files inside _internal/ are covered forever - prefer putting things there.

param([string]$Target = "staging")

$Strip = @(
  "_internal", ".claude", ".agents", ".vscode", ".github",
  "CLAUDE.md", "AGENTS.md", "MANAGER.md", "COMPONENTS.md", "SANITY-SETUP.md", "README.md",
  "skills-lock.json", ".vercelignore"
)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $repo

if ((git status --porcelain) -ne $null) { throw "Working tree is dirty. Commit or stash first." }

$sha = (git rev-parse --short main).Trim()
$original = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host "Promoting main@$sha to $Target"

git checkout --quiet -B "_promote-tmp" main

foreach ($path in $Strip) {
  if (Test-Path $path) { Remove-Item -Recurse -Force $path }
}

# NOTE: `git add` has NO --quiet flag. Passing one makes the command FAIL, which left the strip
# unstaged and pushed the full tree - caught 2026-07-24 only because the run was aimed at a
# throwaway branch. Hence the hard guard below.
git add -A
git config user.name "drk-deploy"
git config user.email "deploy@drkdigital.com"
git commit --quiet -m "Deploy $sha"

# Squash to a single orphan commit so no working history travels with the branch.
$tree = (git rev-parse "HEAD^{tree}").Trim()

# GUARD - a check that can actually fail. Inspect the exact tree about to be pushed and abort if
# any stripped path survived. Without this the failure mode is SILENT: a green run that shipped
# every internal document to Vercel.
$shipped = git ls-tree -r --name-only $tree
$leaked = @()
foreach ($path in $Strip) {
  $needle = $path.TrimEnd('/')
  if ($shipped | Where-Object { $_ -eq $needle -or $_.StartsWith("$needle/") }) { $leaked += $needle }
}
if ($leaked.Count -gt 0) {
  git checkout --quiet --force $original
  git branch -D "_promote-tmp" | Out-Null
  git config --unset user.name
  git config --unset user.email
  throw "ABORTED - strip failed, these would have shipped: $($leaked -join ', ')"
}

$commit = (git commit-tree $tree -m "Deploy $sha").Trim()
git push --force origin "${commit}:refs/heads/$Target"

git checkout --quiet --force $original
git branch -D "_promote-tmp" | Out-Null
git config --unset user.name
git config --unset user.email

Write-Host "Done. $Target now holds a stripped snapshot of main@$sha."
Write-Host "Verify with: git ls-tree --name-only origin/$Target"
