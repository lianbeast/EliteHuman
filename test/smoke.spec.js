import { test, expect } from '@playwright/test';

const BASE = '/EliteHuman/'; // vite base — preview serves app under this path

test('home renders masthead and post list', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE);
  await expect(page.getByRole('heading', { name: 'ELITEHUMAN', level: 1 })).toBeVisible();
  const first = page.locator('article a.post-link').first();
  await expect(first).toBeVisible();
  expect(await page.locator('article').count()).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('post opens, body renders, back-nav returns home', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('article a.post-link').first().click();
  await expect(page).toHaveURL(/\/post\/[\w-]+$/);
  await expect(page.locator('.post-body')).toBeVisible();
  await page.getByRole('link', { name: /← ELITEHUMAN/ }).click();
  await expect(page).toHaveURL(new RegExp(`${BASE}$`));
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

test('archive link from home works', async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole('link', { name: 'THE 105 MARKS →' }).click();
  await expect(page).toHaveURL(new RegExp(`${BASE}archive$`));
});
