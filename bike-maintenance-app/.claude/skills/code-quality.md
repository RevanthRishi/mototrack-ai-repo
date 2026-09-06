# Code Quality

## Purpose
Clean, readable, reusable code. Every file should be obvious to another developer without explanation.

## Naming
- Variables: `userData`, `fuelLogs` (not `data`, `items`)
- Functions: `getServiceLogs`, `formatDate` (verb + noun)
- Components: `ServiceScreen`, `VehicleCard` (noun, not `ServicePage` unless route matches)
- `data-cy`: `{screen}-{action}` or `{screen}-{element}` (see `e2e-data-cy.md`)

## File Size
- Max 300 lines per file. Break into sub-components or move logic to `lib/`.
- Components: single purpose. If a component handles both form input and display, split it.

## Function Size
- Single purpose, max 20 lines preferred. Break dense logic into named helpers.
- Example: `stats.ts` in `lib/calculations/` for metric math; `operations/` for mutation handlers.

## Import Order (enforce with lint)
1. React / Expo / RN imports
2. External libraries (`lucide-react-native`, `expo-linear-gradient`)
3. Internal (`@/lib/*`, `@/components/*`)
4. Relative (`./ChildComponent`)

## Comments — WHY, not WHAT
```ts
// ❌ Restates code
const loading = query.isLoading; // check if query is loading

// ✅ Explains non-obvious reason
const loading = query.isLoading; // mirror to store for cross-tab sync, see store-isolation.md
```

## Magic Literals → Named Constants
- No `5 * 60 * 1000` inline. Name it: `STALE_TIME_MS = 5 * 60 * 1000` in `lib/constants/`.
- Theme colors go in `lib/stores/themeStore.ts`, not hardcoded strings.
- Distance thresholds (`200` km), timeout values (`3000` ms) — all named.

## Reuse Before Writing
Before any new function/component, check:
1. `lib/utils/` (date, currency, validation, auth)
2. `lib/hooks/` (existing TanStack hooks)
3. `components/ui/` (Button, Input, Card)
4. `docs/` (SCHEMA.md for DB patterns)
Only create new file if nothing fits.

## Type Safety (no `any`)
```ts
// ❌ Not allowed
const item: any = log;

// ✅ Always narrow or use real types
import { FuelLogRow } from '@/lib/types/payloads';
const item: FuelLogRow = log;
```

## Consistency With Existing Code
Match naming style, spacing, quote style, import order of the file you're editing. Never introduce a new pattern in one file.

## File Checklist
- [ ] Named constants for all numbers/strings repeated once
- [ ] No `any` types
- [ ] Import order clean
- [ ] Lines under 120 chars preferred
- [ ] Functions single-purpose
