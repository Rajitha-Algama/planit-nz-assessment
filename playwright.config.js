// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['line'],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      detail: true,
      suiteTitle: true,
    }],
  ],
  use: {
    baseURL: 'http://jupiter.cloud.planittesting.com/',
    trace: 'on-first-retry',
    headless: !!process.env.CI, // headless in CI, visible locally
  },
  projects: [
    {
      name: 'PlanitAssessment',
      use: {
        ...devices['Desktop Chrome'],
        viewport: process.env.CI ? { width: 1920, height: 1080 } : null,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: process.env.CI ? [] : ['--start-maximized'],
          slowMo: process.env.CI ? 0 : 1000,
        },
      },
    },
  ],
});