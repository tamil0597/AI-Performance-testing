import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async open(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.loginButton).toBeVisible();
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
    await expect(this.page).toHaveURL(/\/dashboard\/index$/);
  }
}
