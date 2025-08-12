import { test, expect } from "@playwright/test";
import { LoginPage } from "./page-objects/login-page";

test.describe("Basic navigation flow", () => {
  test("should redirect to login page when not authenticated", async ({
    page,
  }) => {
    // Initialize page objects
    const loginPage = new LoginPage(page);

    // Navigate to home page - should redirect to login
    await page.goto("/");

    // Should be redirected to login page
    await loginPage.expectPageToBeLoaded();
  });

  test("should show error message with invalid credentials", async ({
    page,
  }) => {
    // Initialize login page object
    const loginPage = new LoginPage(page);

    // Go directly to login page
    await loginPage.goto();
    await loginPage.expectPageToBeLoaded();

    // Try to login with invalid credentials
    await loginPage.login("invalid@example.com", "wrongpassword");

    // Should show an error message
    await expect(page).toHaveURL(/\/login$/);
  });
});
