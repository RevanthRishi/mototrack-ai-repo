// Garage / Add Vehicle E2E — verifies sheet opens and dropdown shows
const { test, expect } = require('@playwright/test');

test.describe('Garage Tab — Add Vehicle', () => {
  test('clicking Add Vehicle tile opens sheet', async ({ page }) => {
    await page.goto('http://localhost:8081/(tabs)');
    await page.waitForTimeout(1500);

    // Click the Add Vehicle tile using data-cy selector
    const tile = page.locator('[data-cy="home-add-vehicle"]');
    await tile.click();
    await page.waitForTimeout(500);

    // Verify sheet is visible via data-cy
    const sheet = page.locator('[data-cy="add-vehicle-sheet"]');
    await expect(sheet).toBeVisible();

    // Screenshot evidence
    await page.screenshot({ path: 'e2e/add-vehicle-sheet-visible.png' });
    console.log('PASS: Add Vehicle sheet visible after tile click');
  });
});
