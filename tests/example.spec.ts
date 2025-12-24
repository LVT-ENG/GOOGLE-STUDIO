import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('http://localhost:5175');
  await expect(page).toHaveTitle(/TryOnYou - Pilot Lafayette/);
  await page.screenshot({ path: 'screenshot.png' });
});
