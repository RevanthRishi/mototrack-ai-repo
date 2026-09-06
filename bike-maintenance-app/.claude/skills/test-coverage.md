# Test Coverage & Real-Time Validation

## Purpose
Every PR achieves >= 90% coverage on changed lines. Tests run in CI and locally. Before merge, the feature is validated in a real runtime — not just type-check.

## Coverage Threshold
- **Changed lines only** (not whole repo — avoids 90% on untouched legacy code)
- Measure with: `npm test -- --coverage --collectCoverageFrom="lib/**/*" --collectCoverageFrom="app/**/*" --collectCoverageFrom="components/**/*"`
- If any changed file is < 90%, PR is BLOCKED.

## Test Types (all 3 required when feature involves interaction)

### 1. Unit Tests (`__tests__/` or `*.test.ts` next to source)
```ts
// lib/utils/auth.test.ts
import { signInWithEmail } from '../auth';

describe('auth', () => {
  it('returns ApiResponse on error', async () => {
    const res = await signInWithEmail('bad', 'bad');
    expect(res.success).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it('returns okResponse with session on success', async () => {
    const res = await signInWithEmail('valid', 'valid');
    expect(res.success).toBe(true);
    expect(res.data?.session).toBeDefined();
  });
});
```

### 2. Integration Tests (`lib/store/` or `tests/integration/`)
Test mutation + store + query interaction together:
```ts
describe('store mutations', () => {
  it('upsertVehicle updates store and invalidates query', () => {
    const store = useUserDataStore.getState();
    store.upsertVehicle({ id: 'v1', make: 'Yamaha' } as VehicleRow);
    expect(useUserDataStore.getState().vehicles[0].make).toBe('Yamaha');
  });
});
```

### 3. E2E Tests (`e2e/*.spec.ts` — Playwright)
```ts
// e2e/fuel.spec.ts
import { test, expect } from '@playwright/test';

test('add fuel log and see in profile', async ({ page }) => {
  await page.goto('/(tabs)/fuel');
  // Add log
  await page.getByTestId('add-fuel-btn').click();
  await page.getByTestId('fuel-submit').click();
  // Verify in profile
  await page.goto('/(tabs)/profile');
  await expect(page.getByTestId('profile-stat-logs')).toContainText('1');
});
```

## Data-Cy Coverage (from `e2e-data-cy.md`)
Every interactive element needs `data-cy`. Check with a quick grep before review:
```bash
grep -r "data-cy" app/ components/ | wc -l  # count
# Compare with count of interactive elements (TouchableOpacity, Button, Input)
grep -rP "TouchableOpacity|Button|Input" app/ components/ | wc -l
```

If `data-cy` count < interactive element count, PR is BLOCKED.

## Real-Time Validation (mandatory before merge — not just CI)
Before merging any feature:
1. Start app: `npx expo start`
2. Navigate to new feature on device/simulator
3. Test happy path: complete action → verify result appears
4. Test error path: trigger error → verify error message renders correctly (toast, not crash)
5. Test cross-tab: make change in one tab → verify visible in another tab without extra refresh
6. Confirm `notify()` appears; no `Alert.alert`

Record result in PR description under "Real-time validation" with what was tested and outcome.

## Coverage Report Format

```markdown
## Test Coverage
- Unit: `lib/utils/auth.test.ts`, `lib/store/store.test.ts`
- Integration: `tests/store-mutation.spec.ts`
- E2E: `e2e/fuel.spec.ts`
- Changed lines: XX% (threshold 90%)
- Real-time: [✓] done — tested happy + error + cross-tab flows
```

## CI Gate (from `pr-template.md`)
All must pass before merge:
- `npm test`
- `npx playwright test`
- Coverage >= 90% on changed files
- Real-time validation checkbox checked
- All `data-cy` elements have matching E2E selectors

## Anti-patterns
- Writing tests after PR is approved (must be with PR)
- Only testing happy path — include error state
- Using `as(string)` in tests instead of real inputs
- Coverage measured on entire repo to hide low new-file coverage
- Type-check only — not a substitute for real-time validation
- Merging without confirming mutation propagates across tabs
