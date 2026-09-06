---
name: project-handbook
description: "One-page master for MotoTrack AI — stack, setup, conventions, patterns, skills, new-dev quickstart"
metadata:
  type: project
  originSessionId: current
---

# MotoTrack AI — Project Handbook

**Status:** PR #5 active (fix/odometer-column-mismatch, rebased clean). 
**Branch rule:** Always `git checkout -b <name> origin/main`.
**Merge:** User merges; ask before push/commit; realtime-test + E2E before merge.

---

## 1. Stack (one line each)
- Frontend: Expo SDK 52, React Native, TypeScript strict, Expo Router (file-based)
- Styling: NativeWind v4 (Tailwind CSS for RN)
- State: TanStack Query v5 (server), Zustand (client/store — garage-first)
- Forms: React Hook Form + Zod
- DB/Backend: Supabase PostgreSQL 16, Auth (JWT), Storage, Edge Functions (Deno)
- Calc: Decimal.js (fuel cost / mileage — never float)
- Stats: Victory Native charts
- CSAT/AI: Claude 3.5 via Vercel AI SDK (streaming, tool-calling)

---

## 2. New Dev — Get Running (2 min)
```bash
git clone <repo> && cd bike-maintenance-app
git fetch origin && git checkout -b <work> origin/main   # from main, never from feature
npm install
cp .env.example .env.local   # fill Supabase URL + anon key
npx supabase start         # Docker needed; local at :54321 / :54323
npm run types:supabase     # rebuild lib/supabase/database.types.ts
npx expo start
```
See `SETUP.md` for full troubleshooting.

---

## 3. Project Conventions (from this session + repo)
- **SSOT interfaces:** `lib/types/` (vehicle/fuel/service/auth/index.ts) — DB columns hidden (current_odometer, quantity); UI uses aliases (odometer, liters).
- **Queries:** `lib/supabase/queries.ts` — return domain interfaces, never raw DB rows to UI.
- **Store:** `lib/stores/userDataStore.ts` — garage-first, other tabs read from Zustand (upsert/remove on mutation).
- **Hooks:** `lib/hooks/useFuelLogs.ts`, `useServiceLogs.ts` — `useQuery<FuelLog[]>` / `useQuery<ServiceLog[]>`.
- **Column mapping:** DB `vehicles.current_odometer` → interface `Vehicle.current_odometer` (UI alias `odometer`). DB `fuel_logs.quantity` → interface `FuelLog.liters`.
- **Shadow deprecation:** No `shadow-[...]` strings; use RN `shadowColor/Offset/Opacity/Radius` style props.
- **JSX:** Separate `className` and `style` props (no combined syntax errors).
- **Queries (400 errors):** Fuel/service logs join via `vehicles` (`.in('vehicle_id', ...)`) — never `.eq('user_id')` (column missing).
- **Error parsing:** `friendlyFuelError()` / `friendlyServiceError()` — parse `PGRST204`, `42501`, `400` details, `503`.
- **Branch/PR:** Separate branch per change → PR → user merges (`03-branch-pr-habit.md`, `02-dev-preferences.md`).
- **Skills auto-activate:** `.claude/skills/` (branch-pr | api-boundary | routing-contract | e2e-data-cy | code-quality | performance-optimization | code-review | pr-template | test-coverage | auto | store-isolation | security).
- **Profile isolation:** Local session `RevanthRishi`; don't mix org accounts.

---

## 4. Design System (quick ref from PROGRESS.md)
- Background: `#0b0c15`, card `#13131f`
- Primary: `#8b7cf6` (violet), accent amber `#f59e0b`, emerald `#10b981`
- Text: white / `#a0a0b0` / muted `#8b8fa3`
- Shadow glow: `shadow-[0_20px_50px_rgba(139,124,246,0.35)]` (use style prop equivalent)
- Typography: `font-extralight`, tracking-tight, tabular nums for stats
- Icons: `lucide-react-native` (ShieldCheck / Sparkles for auth; Gauge / Fuel / Wrench for detail)
- Animation: `FadeInUp` / `FadeInDown` (react-native-reanimated)

---

## 5. Testing / Verification Rules (from .claude/skills/ + docs)
- Before commit: `npm run type-check` + `npm run lint`
- E2E required for UI/auth changes: `npx playwright test e2e/auth.spec.js` (or related)
- Realtime-test + add E2E before commit (habit)
- Data-cy attributes on all interactive elements (`data-cy="vehicle-detail-edit"` etc.)
- Coverage >= 90% changed lines
- `npm test`, `npm run type-check` pass

---

## 6. Key Files (what to edit for common tasks)
- Add feature screen: `app/(tabs)/` or `app/vehicle/`
- Add component: `components/features/` or `components/ui/`
- DB change: `supabase/migrations/` → `npx supabase db push` → `npm run types:supabase`
- Interface change: `lib/types/<domain>.ts` → update `lib/supabase/queries.ts` → use in hooks/store (never screens directly)
- Store mutation: `lib/stores/userDataStore.ts`
- Hook: `lib/hooks/useVehicle.ts` / `useFuelLogs.ts`
- Queries: `lib/supabase/queries.ts`

---

## 7. Size / Cleanup
- `node_modules` = ~576MB (ignored; don't commit)
- Source code = ~3-4MB; assets = ~20KB
- Heavy required: `react-native` (82M), `@expo` (63M), `lucide-react-native` (31M)
- Heavy kept (used): `date-fns` (26M, date utils); `playwright` (17M, E2E required per habit)
- No cleanup needed; keep both.

---

## 8. Related Docs
- `CLAUDE.md` — full architecture, feature breakdown, monetization, phases
- `SETUP.md` — new dev step-by-step (install, DB, start)
- `PROGRESS.md` — completed / in-progress / design tokens
- `README.md` — public-facing overview
- `docs/architecture/ARCHITECTURE.md`, `SCHEMA.md`, `SECURITY.md`
- `docs/CODING_STANDARDS.md` — DRY, type safety, auth flow
- `.claude/skills/` — auto-activated rules (branch-PR, E2E, code-review, routing, etc.)
- `.cursorrules` — AI coding rules
- Memory: `.claude/memories/` — session notes (profile isolation, SSOT interface, branch-from-main)

---

*Created* 2026-09-06 · *Auto-updated each session* — new conventions, patterns, and fixes are appended here as they are discovered and committed.
