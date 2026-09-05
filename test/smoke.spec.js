import { test, expect } from '@playwright/test';

test('journey loads, ascent meter visible, scrolls cleanly', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('status')).toBeHidden({ timeout: 10000 }); // preloader gone
  await expect(page.locator('text=ALT')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  const alt = await page.locator('text=ALT').first().textContent();
  expect(alt).toMatch(/ALT 0\.[89]|ALT 1\.00/);
  expect(errors).toEqual([]);
});

test('archive route loads, card opens lightbox', async ({ page }) => {
  await page.goto('/archive');
  await expect(page.getByRole('heading', { name: /THE 105 MARKS/i })).toBeVisible();
  const firstCard = page.getByRole('button').first();
  await firstCard.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('reduced-motion skips Lenis', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('text=ALT')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(200);
  const alt = await page.locator('text=ALT').first().textContent();
  expect(alt).not.toBe('ALT 0.00');
  await ctx.close();
});
