import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object Model for the Login page
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("input[type='email']");
    this.passwordInput = page.locator("input[type='password']");
    this.loginButton = page.locator("button[type='submit']");
    this.errorMessage = page.locator("[data-testid='error-message']");
    this.registerLink = page.locator("a", { hasText: /register/i });
    this.forgotPasswordLink = page.locator("a", {
      hasText: /forgot password/i,
    });
    this.pageHeading = page.locator("h1");
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto("/login");
  }

  /**
   * Fill in the login form and submit
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Click on the register link
   */
  async clickRegister() {
    await this.registerLink.click();
    await this.page.waitForURL(/.*register/);
  }

  /**
   * Click on the forgot password link
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL(/.*forgot-password/);
  }

  /**
   * Check if the error message is displayed
   */
  async expectErrorMessage(message?: string) {
    await expect(this.errorMessage).toBeVisible();
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  /**
   * Verify that the login page is displayed correctly
   */
  async expectPageToBeLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.pageHeading).toBeVisible();
    await expect(this.pageHeading).toContainText("HealthyMeal");
    await expect(this.page).toHaveTitle(/.*Logowanie.*/i);
  }
}
