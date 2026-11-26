import { defineConfig } from '@playwright/test';
import { environment } from './config/env';

function readIntegerSetting(name: string, fallback: number, minimum: number): number {
  const value = process.env[name];
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum) {
    throw new Error(`${name} must be an integer greater than or equal to ${minimum}.`);
  }
  return parsed;
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: readIntegerSetting('PLAYWRIGHT_WORKERS', 2, 1),
  retries: readIntegerSetting('PLAYWRIGHT_RETRIES', process.env.CI ? 2 : 0, 0),
  forbidOnly: Boolean(process.env.CI),
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  use: {
    baseURL: environment.baseUrl,
    browserName: 'chromium',
    viewport: { width: 1440, height: 900 },
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
