import { test, expect } from "@playwright/test";
import { loginUser } from "./utils/auth";
import { SettingsPage } from "./page-objects/settings-page";

test.describe("Settings page", () => {
  let settingsPage: SettingsPage;

  test.beforeEach(async ({ page }) => {
    // TODO: Replace with actual credentials once provided
    await loginUser(page, "tester@example.com", "password");

    settingsPage = new SettingsPage(page);
    await settingsPage.goto();

    // Verify we're on the settings page
    await expect(settingsPage.title).toHaveText("Ustawienia");
  });

  test("should persist preference changes and validate minimum selection", async ({
    page,
  }) => {
    // Unselect all preferences and verify error message
    await settingsPage.selectPreferences([]);
    await settingsPage.savePreferences();
    await expect(settingsPage.error).toBeVisible();

    // Select first two preferences and verify they can be saved
    await settingsPage.selectPreferences(["Dairy-Free", "Gluten-Free"]);
    await settingsPage.savePreferences();

    // Verify preferences were saved by reloading and checking
    await page.reload();
    const selectedPreferences = await settingsPage.getSelectedPreferences();
    expect(selectedPreferences).toEqual(["Dairy-Free", "Gluten-Free"]);

    // Select Dairy-Free and Gluten-Free preferences and verify
    await settingsPage.selectPreferences(["Dairy-Free", "Gluten-Free"]);
    await settingsPage.savePreferences();

    // Reload page and verify selected preferences persisted
    await page.reload();
    const selectedAfterUpdate = await settingsPage.getSelectedPreferences();
    expect(selectedAfterUpdate).toEqual(["Dairy-Free", "Gluten-Free"]);
  });
});
