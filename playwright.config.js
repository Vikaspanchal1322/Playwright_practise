// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    /* Global settings */
    trace: 'on-first-retry',
  },

  /* FIX: projects must be an ARRAY (use square brackets []) */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1800, height: 2000 },
        screenshot: "on",
        video: "on",
        trace: "on",
      },
    },
  ],
});