import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  /* Maximum time one test can run for */
  timeout: 30 * 1000,
  expect: {
    /* Maximum time expect() should wait for the condition to be met */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use */
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "playwright-report/test-results.json" }],
  ],
  /* Use a single browser (Chromium only, as specified in requirements) */
  use: {
    /* Base URL to use in actions like `await page.goto("/")` */
    baseURL: "http://localhost:4321",
    /* Maximum time each action (like click()) can take */
    actionTimeout: 0,
    /* Take screenshots on failure */
    screenshot: "only-on-failure",
    /* Record traces on failure */
    trace: "retain-on-failure",
    /* Run in headless mode by default */
    headless: true,
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
