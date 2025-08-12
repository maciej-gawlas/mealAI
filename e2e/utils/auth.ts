import type { Page } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";

export async function loginUser(page: Page, email: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
  // Wait for navigation after successful login
  await page.waitForURL("/recipes");
}
