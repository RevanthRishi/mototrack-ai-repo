# Commit Message & PR Description Rules

## Purpose
Every commit and PR describes what changed, why, what was tested, and which skills were applied. No vague messages like "fix" or "update".

## Commit Message Format (always use)

```
<type>(<scope>): <short description>

<body: detailed explanation of what changed and why>

<skills applied>
<tests added / coverage %>
<breaking changes / migration notes if any>

Co-Authored-By: Claude Code <noreply@anthropic.com>
```

### Types (must pick one)
- `feat`: new feature or user-facing change
- `fix`: bug fix
- `refactor`: change that does not alter external behavior (store isolation, type updates)
- `perf`: performance improvement (memoization, query optimization)
- `chore`: build, tools, docs, skills framework, CI
- `test`: adding or updating tests only
- `docs`: documentation updates

### Scope (must specify area)
- `auth` — login, register, OAuth, sign out
- `store` — Zustand store (`userDataStore`)
- `api` — `lib/utils/auth.ts`, edge functions, `ApiResponse<T>`
- `routing` — `app/*` navigation, route params
- `ui` — components (`components/ui/`, `components/auth/`)
- `e2e` — Playwright tests (`e2e/`)
- `skills` — `.claude/skills/` framework
- `ci` — `.github/workflows/`
- `docs` — `docs/`, `.github/PULL_REQUEST_TEMPLATE.md`

### Short Description (first line)
- Max 72 characters
- Imperative mood: "Add biometric login" (not "Added" or "Adds")
- Specific: "Fix fuel stats zero division on first log" (not "fix stats")

### Body (required — explain why, not just what)
```
This fixes a division-by-zero when calculating avgKmL for a new
user with a single fuel log entry. The `firstKm` calculation returns
NaN if `logs.length === 1`, which breaks the chart component.

Fix: guard the division with `totalL > 0 ? ... : 0`.
```

### Skills Applied (always list)
```
Skills: store-isolation [✓], api-boundary [✓], code-review [✓]
```

### Tests / Coverage
```
Tests: `e2e/fuel.spec.ts`, `lib/utils/auth.test.ts`
Coverage: 92% changed lines (threshold: 90%)
Real-time validation: tested happy + error + cross-tab flows
```

### Breaking Changes / Migration
```
Breaking: `updateProfile` payload now requires `full_name` string,
not optional. Migration: update all callers in `profile.tsx`.
```
If none: write `Breaking: none` — never omit.

### Example (good)
```
feat(store): add mutation actions for fuel/service logs

Adds `upsertFuelLog`, `removeFuelLog`, `upsertServiceLog`,
`removeServiceLog` actions to userDataStore. Other tabs now
see log changes immediately without extra API calls.

Skills: store-isolation [✓], code-quality [✓], code-review [✓]
Tests: `tests/store-mutation.spec.ts`
Coverage: 94% changed lines
Real-time validation: added log in fuel tab, verified in profile stats
Breaking: none

Co-Authored-By: Claude Code <noreply@anthropic.com>
```

### Example (bad — never use these)
```
fix stuff           # no type, no scope, vague
update login        # no explanation, no skills, no tests
fix                 # empty body
```

## PR Description Details (from `pr-template.md` — must include)

Every PR description must have these sections filled in (not headers only — content required):

### 1. Summary (2-3 sentences)
- What changed: "Replaced `Alert.alert` with `notify()` toast across auth screens"
- Why: "Centralizes error handling, improves UX, aligns with `api-boundary` contract"
- Impact: "Login and register screens now show consistent toast errors"

### 2. Changes (bullet list of files with purpose)
- `lib/utils/auth.ts` — all auth functions return `ApiResponse<T>`; added `getAuthErrorMessage()` usage
- `app/(auth)/login.tsx` — removed `Alert.alert`; uses `notify()` + `useNotification()`
- `components/auth/GoogleSignInButton.tsx` — updated to handle `ApiResponse` pattern

### 3. How to Test (step-by-step, numbered)
1. Start `npx expo start`
2. Go to login screen, enter wrong password → verify toast appears (no alert popup)
3. Go to register screen, submit valid form → verify success toast + redirect
4. Click "Log Out" from profile → verify logout confirmation modal + success toast

### 4. Screenshots / Recording
Before image and after image embedded (or link). Required for any UI change. For non-UI changes: write `[N/A]` — never leave empty.

### 5. Migration Notes
- DB changes: list new tables/columns, migration files created (`supabase/migrations/`)
- Env vars: new variables needed (`.env.local`), updated `.env.example`
- Breaking APIs: name the old vs new signature
- If none: write `Migration: none — no DB/env changes`

### 6. Skills Checklist (all must be checked)
```
- [x] `store-isolation`
- [x] `api-boundary`
- [x] `routing-contract`
- [x] `e2e-data-cy`
- [x] `code-quality`
- [x] `performance-optimization`
- [x] `code-review`
```
No unchecked items allowed. PR blocked if any missing.

### 7. Test Coverage (always include numbers)
- Unit: `lib/utils/auth.test.ts` (4 test cases)
- Integration: `tests/store-mutation.spec.ts` (2 cases)
- E2E: `e2e/auth.spec.ts` (3 flows: login, register, logout)
- Coverage: 93% changed lines (threshold: 90%)
- Real-time validation: [x] completed — happy path (login success), error path (wrong password), cross-tab sync (profile stats updated after login)

### 8. Related Issues
`Closes #42`, `Related to #38`, or `N/A` — never leave empty.

## PR Title Format
```
feat(auth): add biometric login support
fix(fuel): correct km/L division by zero on first log
refactor(store): unify ApiResponse<T> across all auth
perf(fuel): memoize fuel stats computation
chore(skills): add code-review and test-coverage rules
docs(ci): add Playwright E2E gate to workflow
```

## Auto-Trigger (from `auto.md`)
Every `git commit` or PR creation activates `commit-message.md` and `pr-template.md`. The AI verifies format and content before pushing. If format is wrong (missing type, empty body, no skills, no coverage), the AI fixes it or reports BLOCK.
