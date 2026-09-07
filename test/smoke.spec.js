import { test, expect } from '@playwright/test';

const BASE = '/EliteHuman/'; // vite base — preview serves app under this path

test('journey loads, ascent meter visible, scrolls cleanly', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE);
  await expect(page.getByRole('status')).toBeHidden({ timeout: 10000 }); // preloader gone
  await expect(page.locator('text=ALT')).toBeVisible();
  // hero: title + fixed gold-ring logo present at load
  await expect(page.getByRole('heading', { name: 'BODY', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'EliteHuman Instagram' })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  const alt = await page.locator('text=ALT').first().textContent();
  expect(alt).toMatch(/ALT 0\.[89]|ALT 1\.00/);
  // outro: stats + archive CTA visible at end
  await expect(page.getByText('MARKS', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'ENTER THE ARCHIVE →' }).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('archive route loads, card opens lightbox, arrows navigate', async ({ page }) => {
  await page.goto(`${BASE}archive`);
  await expect(page.getByRole('heading', { name: /THE 105 MARKS/i })).toBeVisible();
  const firstCard = page.locator('article[role="button"]').first();
  await firstCard.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const before = await page.getByRole('dialog').textContent();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  const after = await page.getByRole('dialog').textContent();
  expect(after).not.toBe(before); // nav moved to another post
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('reduced-motion skips Lenis', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await expect(page.locator('text=ALT')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(200);
  const alt = await page.locator('text=ALT').first().textContent();
  expect(alt).not.toBe('ALT 0.00');
  await ctx.close();
});
