# Code Review

## Purpose
Every code change is reviewed against correctness, scope, types, patterns, and tests BEFORE merge. The AI must run this checklist on its own output AND on others' PRs.

## The Review Process (automated habit — always run)

When reviewing code (yours or others'), run this checklist in order. Do NOT skip steps.

### Step 1: Correctness (must pass first)
- [ ] Does the code achieve the stated goal?
- [ ] Are edge cases handled (null user, empty arrays, missing params)?
- [ ] Is error handling present? (not just `try/catch` that catches and does nothing)
- [ ] Does the mutation update both store (`store.upsertX`) and query cache (`setQueryData`/`invalidateQueries`)? (see `store-isolation.md`)
- [ ] Does the mutation call `notify()` for errors? (no `Alert.alert` — see `api-boundary.md`)

### Step 2: Scope Control
- [ ] Only the files/features named in the request were changed?
- [ ] No drive-by refactoring (renaming unrelated variables, formatting unrelated files)?
- [ ] If fixing a shared util (`lib/utils/auth.ts`), were all callers verified? (use `grep` or codegraph)
- [ ] No new dependencies added without justification (check `package.json` delta)

### Step 3: Type Safety (no `any`)
- [ ] All params and return types are explicit?
- [ ] `ApiResponse<T>` used for all API operations (see `api-boundary.md`)?
- [ ] No `as any`, `as unknown`, or implicit `any`?
- [ ] `useLocalSearchParams<{ id: string }>` used for route params? (see `routing-contract.md`)

### Step 4: Pattern Consistency
- [ ] Import order matches file convention (`store-isolation.md`, `code-quality.md`)?
- [ ] Naming matches existing code (camelCase for vars, PascalCase for components, `data-cy` naming)?
- [ ] New file placed correctly (`lib/` for logic, `components/` for reusable, `app/` for routes)?
- [ ] Comments explain WHY, not WHAT?
- [ ] No hardcoded numbers/strings — named constants used?

### Step 5: Performance
- [ ] Heavy computations wrapped in `useMemo`? (`performance-optimization.md`)
- [ ] Lists use `FlatList` with `keyExtractor` if > 20 items?
- [ ] No `useQuery` duplicated across tabs for same data? (Garage is single fetch point)
- [ ] `staleTime` set (not 0 or default)?
- [ ] No `useEffect` where `useMemo` could work?

### Step 6: Store / State Isolation
- [ ] Tab screens read from `userDataStore` selectors — not calling `useFuelLogs(query)` directly? (see `store-isolation.md`)
- [ ] `loading` / `error` mirrored to store via `setLoading`/`setError` in the hook?
- [ ] Mutation actions (`upsertVehicle`, `upsertFuelLog`) called in mutation `onSuccess`?
- [ ] Per-type errors isolated (fuel failure doesn't break service tabs)?

### Step 7: Testing & Coverage (MANDATORY — 90% + real-time validation)
- [ ] All new interactive elements have `data-cy`? (see `e2e-data-cy.md`)
- [ ] Unit/integration tests added for new hooks, store actions, or utilities?
- [ ] E2E spec added for new user-facing flows (`e2e/` folder)?
- [ ] Coverage on changed lines >= 90%?
- [ ] Real-time validation performed: run the feature, click through the flow, verify mutation propagates to other tabs, verify error states render?
- [ ] If using Playwright test, run: `npx playwright test e2e/feature.spec.ts` and confirm passes

### Step 8: PR / Documentation
- [ ] PR description follows `pr-template.md` (what/why/test/coverage)?
- [ ] Skills checklist confirmed (all 4 project skills applied)?
- [ ] No open questions — either resolved or listed in PR description?

## Reporting Format (always this format — concise, no dumps)

```
REVIEW: <file/area>
- Pass: <items that passed>
- Block: <items that must be fixed before merge>
- Note: <non-blocking observations, include if fix needed in follow-up>
- Tests: <unit/integration/coverage % / E2E status / real-time validation result>
```

Example:
```
REVIEW: app/(tabs)/fuel.tsx
- Pass: reads from store selectors (store-isolation), uses data-cy, stats in useMemo
- Block: missing E2E spec for empty-state interaction; real-time validation needed (run screen)
- Note: refresh uses queryClient.invalidateQueries — correct per store-isolation
- Tests: unit 0% (new file), E2E missing, coverage N/A — must add before merge
```

## Mandatory Coverage Rule
- Every PR must include tests for changed lines achieving >= 90% coverage.
- Use `npm test -- --coverage --collectCoverageFrom="lib/**/*" --collectCoverageFrom="app/**/*"` to measure.
- If coverage < 90% on changed files, PR is BLOCKED.
- All interactive elements (`TouchableOpacity`, `Button`, `Input`) require a `data-cy` attribute.
- Before merge: run the code in the app (real-time validation) — not just type-check.

## Anti-patterns (never skip these checks)
- Reviewing only type-check output (`tsc --noEmit`) — not a review
- Writing "looks good" without checking each checklist item — not a review
- Adding tests after review instead of with the PR — not a review
- Skipping E2E for "small" changes — not a review
- Merging without confirming 90% + real-time validation — not allowed
