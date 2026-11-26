import {
  test as base,
  type BrowserContext,
  type BrowserContextOptions,
  type Page,
} from '@playwright/test';
import { environment, getCredentials } from '../config/env';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';
import { measureStep, recordNavigationMetrics } from '../utils/performance';

type BrowserContextFactory = (options?: BrowserContextOptions) => Promise<BrowserContext>;

type AutomationFixtures = {
  authenticatedPage: Page;
  dashboardPage: DashboardPage;
  loginPage: LoginPage;
  pimPage: PimPage;
  createBrowserContext: BrowserContextFactory;
};

export const test = base.extend<AutomationFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },
  authenticatedPage: async ({ page, loginPage }, use, testInfo) => {
    await loginPage.open();
    await recordNavigationMetrics(page, testInfo);

    const { username, password } = getCredentials();
    await measureStep(page, testInfo, 'Login to dashboard', async () => {
      await loginPage.signIn(username, password);
    });

    await use(page);
  },
  createBrowserContext: async ({ browser }, use) => {
    const contexts: BrowserContext[] = [];
    await use(async (options = {}) => {
      const context = await browser.newContext({
        ...options,
        baseURL: options.baseURL ?? environment.baseUrl,
        viewport: options.viewport ?? { width: 1440, height: 900 },
      });
      contexts.push(context);
      return context;
    });

    await Promise.all(contexts.map((context) => context.close()));
  },
});

export { expect } from '@playwright/test';
