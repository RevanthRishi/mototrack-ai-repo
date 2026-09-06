# Coding Standards — MotoTrack AI

**Updated:** 2026-09-04  
**Applies to:** `lib/utils/`, `components/auth/`, `app/(auth)/`, `app/_layout.tsx`, database migrations.

---

## 1. DRY — Never Duplicate Logic

- **Shared data writes** (e.g., `users` table profile rows): extract to `lib/utils/<domain>.ts`. `signUpWithEmail` and `onAuthStateChange` must call the same `upsertUserProfile`, never inline `supabase.from(...).insert(...)`.
- **Auth triggers** (Google OAuth): hook (`lib/hooks/useGoogleSignIn.ts`) owns `loading` + `trigger`; button (`components/auth/GoogleSignInButton.tsx`) is pure presentation (`label`, `loading`, `disabled`, `onPress`). Parent screens compose.
- **Form inputs** (login/register): if more than one screen repeats `Controller` + icon + error pattern, extract to `components/ui/FormField.tsx`.

## 2. Type Safety — Zero `any`; Zero Unnecessary Casts

- **Database queries:** import `Database` from `@/lib/supabase/database.types`; use `.from('table')` (typed by the `Database` definition). Never `as never`.
- **Window / DOM access:** `globalThis` + narrow `unknown` cast (`WindowLike = { location?: { origin?: string } }`), never `typeof window` in `.ts` files without `lib: ["ES2020", "DOM"]`.
- **Error returns:** `AuthResponse.error` is `AuthError | null`. Do not construct fake `AuthError` objects; return `null` or the real Supabase error.
- **Schema changes:** after SQL, run `npm run types:supabase`; update `lib/supabase/database.types.ts`; verify `avatar_url` etc. appear.

## 3. Component Boundaries

- **Presentation vs State:** buttons/components do not call `supabase.auth.*` directly; they call hooks or `onPress` callbacks from parents.
- **Single responsibility:** `lib/utils/auth.ts` = auth primitives only; `lib/utils/users.ts` = profile DB writes; `lib/hooks/useAuth.ts` = session listener + profile sync.
- **Max 200 lines per component:** split if exceeded.

## 4. Auth Flow — Where Profile Updates Happen

- **Email signup:** `signUpWithEmail` calls `upsertUserProfile` after confirmed user.
- **OAuth (Google, Apple):** `signInWithOAuth` returns redirect immediately; the session comes back via `supabase.auth.onAuthStateChange` in `useAuth`. Profile sync (full_name, avatar_url from `session.user.user_metadata`) belongs in that listener, not in the button's `handlePress`.

## 5. Testing & Verification

- After any auth change: `npm run type-check` must pass; `npx playwright test e2e/auth.spec.js` must pass; new E2E cases for new buttons must include visibility + position checks.
- Remove `test-results/` and `e2e/*.png` from repo if generated locally (`git clean -fd e2e/` or ignore).

---

See `.cursorrules` for design/architecture rules and `CLAUDE.md` for full project architecture.

## Skills Auto-Activation (2026-09-06)
Every code change activates the 9 project skills automatically. No manual command needed.
Skills: store-isolation | api-boundary | routing-contract | e2e-data-cy | code-quality | performance-optimization | code-review | pr-template | test-coverage | auto
Reference: .claude/skills/ (11 files)
Coverage rule: >=90% changed lines + real-time validation required

