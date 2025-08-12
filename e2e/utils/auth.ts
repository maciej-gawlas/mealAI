import type { Page } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";

export async function loginUser(
  page: Page,
  email: string = process.env.E2E_USERNAME ?? "",
  password: string = process.env.E2E_PASSWORD ?? "",
) {
  if (!email || !password) {
    throw new Error(
      "Email and password must be provided either as arguments or in environment variables (E2E_USERNAME, E2E_PASSWORD)",
    );
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
  // Wait for navigation after successful login
  await page.waitForURL("/recipes");
}
