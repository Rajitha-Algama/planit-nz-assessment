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
    headless: false,
  },
  projects: [
    {
      name: 'PlanitAssessment',
      use: {
        ...devices['Desktop Chrome'],
        viewport: null,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: ['--start-maximized'],
          slowMo: 1000, // 1 second delay between each action
        },
      },
    },
  ],
});