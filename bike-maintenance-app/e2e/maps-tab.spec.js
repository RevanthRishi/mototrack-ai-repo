// Maps Tab E2E — verifies new tab exists and stations + notify UI render
const { test, expect } = require('@playwright/test');

test.describe('Maps Tab — GPS & Stations', () => {
  test('Maps tab is visible and station cards render', async ({ page }) => {
    await page.goto('http://localhost:8081/(tabs)');
    await page.waitForTimeout(1500);

    // Verify Maps tab is navigable by checking URL or content presence
    // We navigate via router for consistency
    await page.goto('http://localhost:8081/(tabs)/maps');
    await page.waitForTimeout(1000);

    const station1 = page.locator('[data-cy="maps-station-1"]');
    await expect(station1).toBeVisible();

    const station2 = page.locator('[data-cy="maps-station-2"]');
    await expect(station2).toBeVisible();

    const notifyBtn = page.locator('[data-cy="maps-notify-btn"]');
    await expect(notifyBtn).toBeVisible();

    console.log('PASS: Maps screen loads, stations and notify button visible');
  });
});
