import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly heading: Locator;
  readonly pimLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.pimLink = page.getByRole('link', { name: 'PIM', exact: true });
  }

  async validateDashboard(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.page.getByText('Quick Launch', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Time at Work', { exact: true })).toBeVisible();
  }

  async openPim(): Promise<void> {
    await this.pimLink.click();
    await expect(this.page).toHaveURL(/\/pim\/viewEmployeeList$/);
  }
}
