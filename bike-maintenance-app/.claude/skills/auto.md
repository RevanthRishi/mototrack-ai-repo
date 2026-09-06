# Auto-Execution Rules

These skills run automatically — no command needed. The AI activates them by default based on action context.

## Trigger Matrix

| When this happens | Skill activated | Why automatic |
|---|---|---|
| Reading/editing any `.tsx` file in `app/` or `components/` | `store-isolation`, `routing-contract`, `e2e-data-cy` | Every interactive screen needs these checks |
| Editing `lib/utils/auth.ts`, `lib/types/api-response.ts`, or `supabase/functions/*` | `api-boundary` | Boundary contract applies to all API-related files |
| Creating new component/file | `code-quality` | New code must follow naming, size, import rules |
| Changing `package.json`, `app/*`, `lib/hooks/*` with performance impact | `performance-optimization` | Any change affecting render/query loads |
| Reviewing code or opening PR | `code-review`, `pr-template`, `test-coverage` | Review process is mandatory before merge |
| Writing/committing tests | `test-coverage` | Coverage check runs with PR |
| Starting any new task or `git commit` | `branch-pr` | Every change must flow through a feature branch + PR |
| Any file edit involving auth, env, secrets, storage, or edge functions | `security` | Security rules enforced on every relevant change |

## Enforced Rules (no override)

### Every file edit checks:
1. `store-isolation` — does this tab read from store?
2. `api-boundary` — is `ApiResponse<T>` used? No `Alert.alert`?
3. `e2e-data-cy` — does new interactive element have `data-cy`?
4. `routing-contract` — are route params typed? Navigation uses constants?

### Every PR/review checks:
1. `code-review` — checklist must be completed
2. `pr-template` — PR description must include skills checklist and coverage
3. `test-coverage` — >= 90% coverage required, real-time validation confirmed

### Branch / PR Rule (mandatory for every change):
- Every new task starts a fresh branch: `feat/<name>`, `fix/<name>`, or `chore/<name>`
- Work happens on that branch; `main` is never edited directly
- When task completes: push branch → create PR to `main` (not merge direct)
- PR must include `pr-template.md` filled out (skills checklist + coverage + real-time validation)
- PR requires CI pass (`.github/workflows/ci.yml`) + 1 approval before merge
- After merge, delete feature branch; never reuse a feature branch for a different task

### Every new feature checks:
1. `code-quality` — naming, no `any`, single purpose
2. `performance-optimization` — `useMemo` where needed, `staleTime` set

## Reminder Mechanism

The AI does NOT ask "do you want to use skills?" — it activates them automatically and reports which skills were checked in the final summary (e.g., "Applied: store-isolation [✓], api-boundary [✓], e2e-data-cy [✓], performance-optimization [✓]").

If a skill check fails, it's reported as BLOCK (must fix before merge). If it passes, it's confirmed [✓]. No manual invocation needed.
