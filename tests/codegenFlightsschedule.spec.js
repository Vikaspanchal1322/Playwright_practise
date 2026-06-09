import { test, expect } from '@playwright/test';

test('Codegen the Fllights schedule ', async ({ page }) => {
  await page.goto('https://www.yatra.com/flight-schedule');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Delhi to Bhubaneshwar Flight' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('slider', { name: 'Maximum value' }).fill('12020');
});