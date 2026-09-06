# PR Template

## Purpose
Every pull request has a consistent structure so reviewers understand the change instantly, know how to validate it, and can confirm skills compliance without hunting through diffs.

## Template

```markdown
## Summary
<!-- 1-3 sentences: what changed and why -->

## Changes
<!-- Bullet list of files changed and what each does -->

## How to Test
<!-- Step-by-step manual validation. Include specific user flows. -->
1.
2.

## Screenshots / Recording
<!-- Before/after for UI changes. Required for any visual change. -->

## Migration Notes
<!-- Any DB migration, env var, breaking change, or deployment step needed -->

## Skills Checklist
Confirm all skills applied:
- [ ] `store-isolation` — tab screens read from store, mutations update store
- [ ] `api-boundary` — ApiResponse<T>, no Alert.alert, getAuthErrorMessage used
- [ ] `routing-contract` — typed params, data-cy on all interactive elements, route constants
- [ ] `e2e-data-cy` — Playwright spec added for new interactive features
- [ ] `code-quality` — no any, named constants, comments explain WHY
- [ ] `performance-optimization` — useMemo where needed, staleTime tuned
- [ ] `code-review` — all checklist items passed

## Test Coverage
<!-- Unit/integration test files added: list them -->
<!-- E2E spec files added: list them -->
<!-- Coverage on changed lines: XX% (must be >= 90%) -->
<!-- Real-time validation: [ ] done — describe what you ran and the result -->

## Related Issues
<!-- Closes #X, Related to #Y -->
```

## Rules

### Every PR Must Have
- A clear **Summary** (what + why, not just "fix bug")
- **How to Test** section with actual steps (not "test it")
- **Screenshots** for any UI change (before + after)
- **Migration Notes** if DB schema, env vars, or breaking API changes
- **Skills Checklist** — AI fills this out and confirms every item
- **Test Coverage** — list of test files, coverage %, real-time validation checkbox

### PR Title Format
`type(scope): short description`

```
feat(auth): add biometric login support
fix(fuel): correct km/L calculation for first log entry
refactor(store): unify ApiResponse<T> across all auth functions
perf(fuel): memoize stats computation in FuelScreen
chore(skills): add e2e-data-cy and store-isolation rules
```

Types: `feat`, `fix`, `refactor`, `perf`, `chore`, `docs`, `test`, `ci`

### PR Size
- Max ~400 lines changed per PR. Split large features into stacked PRs.
- If PR is > 400 lines, explain why and add a migration plan.

### Draft PRs
- Open as Draft if not ready for review.
- Move to Ready when all skills checklist items are confirmed.
- Never merge a Draft PR.

### Review Required
- Minimum 1 approval before merge.
- Reviewer must confirm: correctness, scope, types, patterns, coverage.
- Use the `code-review.md` checklist format in the review comment.

### CI Gate (blocks merge)
All must pass:
- [ ] Type check: `npm run type-check`
- [ ] Lint: `npm run lint`
- [ ] Unit + Integration tests: `npm test`
- [ ] E2E tests: `npx playwright test`
- [ ] Coverage >= 90% on changed lines

### Linking Issues
Always link to an issue: `Closes #X` or `Related to #X`.

## Anti-patterns
- PR title: "update", "changes", "fixes"
- Summary: "fixed some things" without describing what/why
- No screenshots on UI changes
- Missing migration notes on DB changes
- Skills checklist left unchecked
- No test coverage mentioned
- Merging without CI passing
