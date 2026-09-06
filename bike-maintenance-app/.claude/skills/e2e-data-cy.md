# E2E & Data-Cy

## Purpose

Every interactive element has a `data-cy` attribute for automated testing. A Playwright spec must exist for every new interactive feature before code is merged. This is not optional — it is a merge requirement.

## Rule 1: `data-cy` on every interactive element

Add `data-cy` to any element the user can tap, press, or interact with:

```tsx
// ✅ Good — descriptive, context-specific
<TouchableOpacity data-cy="profile-upgrade-premium" ...>
<TouchableOpacity data-cy="logout-confirm" ...>
<TouchableOpacity data-cy="logout-cancel" ...>
<TouchableOpacity data-cy="fuel-log-item-${log.id}">
<TouchableOpacity data-cy="service-stat-fuel">

// ✅ Acceptable — generic but clear
<TouchableOpacity data-cy="settings-button">
<Button data-cy="submit-form">

// ❌ Wrong — non-descriptive
<TouchableOpacity data-cy="btn-1">
<TouchableOpacity data-cy="item">
<Pressable data-cy="click">
```

**Naming convention**: `{screen}-{action}` or `{screen}-{element}`. Use kebab-case.

Examples from existing codebase:
- `profile-upgrade-premium` → profile screen, upgrade premium action
- `logout-confirm` / `logout-cancel` → logout modal
- `fuel-log-item-${id}` → fuel screen, log item with dynamic ID
- `service-stat-${label}` → service screen, stat card
- `fuel-see-all` → fuel screen, see all link

## Rule 2: Modal/overlay elements also need `data-cy`

Any overlay, modal, or sheet that appears on interaction must have `data-cy` on its trigger AND its internal actions:

```tsx
// Modal trigger
<TouchableOpacity onPress={() => setConfirmOpen(true)} data-cy="logout-trigger">
  <Text>Log Out</Text>
</TouchableOpacity>

// Modal actions
<Modal visible={confirmOpen}>
  <TouchableOpacity data-cy="logout-confirm">
  <TouchableOpacity data-cy="logout-cancel">
</Modal>
```

## Rule 3: Forms need `data-cy` on inputs and submit

```tsx
// ✅ Full form coverage
<Input data-cy="login-email" ... />
<Input data-cy="login-password" ... />
<Button data-cy="login-submit" ... />

// ❌ Missing coverage
<Input ... />  {/* no data-cy */}
<Button>Log In</Button>  {/* no data-cy */}
```

## Rule 4: New interactive features require a Playwright spec

When adding a new feature with interactive elements, create a Playwright spec file in `e2e/` before opening a PR:

```ts
// e2e/fuel-log.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fuel Log', () => {
  test('should display fuel log items', async ({ page }) => {
    await page.goto('/(tabs)/fuel');
    // Uses data-cy selectors defined in components
    await expect(page.getByTestId('fuel-log-item-1')).toBeVisible();
  });

  test('should show empty state when no logs exist', async ({ page }) => {
    await page.goto('/(tabs)/fuel');
    await expect(page.getByTestId('fuel-empty-state')).toBeVisible();
  });
});
```

## Rule 5: E2E tests cover mutation propagation

A key integration test: verify that a mutation in one tab is visible in another tab without re-fetching:

```ts
test('adding a vehicle in garage reflects in profile stats', async ({ page }) => {
  // Garage tab — add vehicle
  await page.goto('/(tabs)');
  await page.getByTestId('add-vehicle-button').click();
  // ... fill form and submit

  // Profile tab — check vehicle count updated
  await page.goto('/(tabs)/profile');
  await expect(page.getByTestId('profile-stat-vehicles')).toContainText('2');
});
```

## Rule 6: CI runs E2E on every PR

GitHub Actions must run Playwright tests before merge. Add to `.github/workflows/ci.yml`:

```yaml
- name: Run E2E tests
  run: npx playwright test
```

If E2E tests fail, the PR cannot be merged.

## File Structure

```
e2e/
├── auth.spec.ts         # login, register, logout flows
├── fuel.spec.ts         # fuel log CRUD, empty state, stats
├── service.spec.ts      # service log CRUD, empty state, timeline
├── profile.spec.ts     # profile display, logout modal
└── vehicle.spec.ts     # add, edit, delete vehicle
```

## Anti-patterns

- Adding a new interactive element without `data-cy`
- Merging a feature with no Playwright spec
- Using text content (`getByText('Log In')`) as the primary selector instead of `data-cy`
- Writing E2E tests that only test happy paths — include error states
- `data-cy` values that are not descriptive (e.g. `btn`, `item-1`)
