import { expect, type Locator, type Page } from '@playwright/test';

export class PimPage {
  readonly heading: Locator;
  readonly employeeInformationHeading: Locator;
  readonly employeeIdInput: Locator;
  readonly searchButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'PIM' });
    this.employeeInformationHeading = page.getByRole('heading', { name: 'Employee Information' });
    this.employeeIdInput = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
  }

  async validateEmployeeList(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.employeeInformationHeading).toBeVisible();
  }

  async searchEmployee(employeeId: string): Promise<Locator> {
    await this.expandFilters();
    await this.employeeIdInput.fill(employeeId);
    await this.searchButton.click();

    const employeeRow = this.page.getByRole('row').filter({ hasText: employeeId });
    await expect(employeeRow).toBeVisible();
    return employeeRow;
  }

  async firstEmployeeId(): Promise<string> {
    const rows = this.page.getByRole('row');
    await expect(rows.nth(1)).toBeVisible();

    for (let index = 1; index < (await rows.count()); index += 1) {
      const idCell = rows.nth(index).getByRole('cell').nth(1);
      if ((await idCell.count()) === 0) {
        continue;
      }

      const employeeId = (await idCell.innerText()).trim();
      if (employeeId) {
        return employeeId;
      }
    }

    throw new Error('No employee row contained an employee ID to search.');
  }

  private async expandFilters(): Promise<void> {
    if (await this.employeeIdInput.isVisible()) {
      return;
    }

    await this.employeeInformationHeading.locator('xpath=../..').getByRole('button').click();
    await expect(this.employeeIdInput).toBeVisible();
  }
}
