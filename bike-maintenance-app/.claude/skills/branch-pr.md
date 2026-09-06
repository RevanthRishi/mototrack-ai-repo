# Branch & PR Protocol

## Purpose
No direct commits to `main`. Every change flows through a feature branch + PR with CI gate.

## Naming Convention
| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<scope>-<brief>` | `feat/auth-biometric` |
| Fix | `fix/<scope>-<brief>` | `fix/fuel-stats-calc` |
| Refactor | `refactor/<scope>-<brief>` | `refactor/store-isolation` |
| Performance | `perf/<scope>-<brief>` | `perf/fuel-memoization` |
| Chore | `chore/<scope>-<brief>` | `chore/skills-framework` |

## Workflow (always this, never skip)

### 1. Start new branch
```bash
git checkout -b feat/<name>
# or: fix/<name>, refactor/<name>, perf/<name>, chore/<name>
```

### 2. Work on branch
- Edit files, commit as needed (`git commit -m "..."`)
- Each commit should have a clear message (see `code-quality.md`)

### 3. Before pushing
- Confirm `main` branch is not edited (check `git branch --show-current`)
- Confirm all skills applied (see `auto.md` trigger matrix)
- Confirm `data-cy` present for new interactive elements
- Confirm tests written / coverage >= 90% on changed files
- Confirm PR description will include skills checklist + real-time validation result

### 4. Push branch
```bash
git push -u origin feat/<name>
```

### 5. Open PR to `main`
- Use `.github/PULL_REQUEST_TEMPLATE.md`
- Fill: Summary, Changes, How to Test, Coverage %, Real-time validation checkbox
- Must include skills checklist (`store-isolation`, `api-boundary`, etc.) — all checked
- Must have CI passing (`.github/workflows/ci.yml` runs on PR)
- Must have 1 approval before merge

### 6. Merge only after
- [ ] CI green (type-check, lint, tests, E2E)
- [ ] Coverage >= 90% on changed lines
- [ ] All skills checklist items confirmed
- [ ] Real-time validation checkbox checked (feature run in app, errors handled, cross-tab sync verified)
- [ ] 1 approval from reviewer (use `code-review.md` checklist format in review comments)

### 7. After merge
```bash
git checkout main
git pull
git branch -D feat/<name>
```
Delete the feature branch. Never reuse it.

## Anti-patterns
- `git commit` directly on `main`
- `git push origin main` for feature work
- Merging PR without CI passing
- Reusing old feature branch for a new task
- Creating PR with empty skills checklist
- Merging without 90% coverage or real-time validation
- Bypassing PR review (no approval)

## Auto-Trigger (from `auto.md`)
Every file edit activates relevant skills. The AI reports which skills were applied at the end of every response (e.g., "[✓] store-isolation, api-boundary, code-review" or "BLOCK: e2e-data-cy missing on new button").
