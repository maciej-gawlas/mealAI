import type { Page, Locator } from "@playwright/test";

/**
 * Page Object Model for the Settings page
 */
export class SettingsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly preferences: { [key: string]: Locator };
  readonly saveButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator("h1");
    this.preferences = {
      "Dairy-Free": page.getByLabel("Dairy-Free"),
      "Gluten-Free": page.getByLabel("Gluten-Free"),
      "Low-Carb": page.getByLabel("Low-Carb"),
      "Nut-Free": page.getByLabel("Nut-Free"),
      "Vegetarian": page.getByLabel("Vegetarian")
    };
    this.saveButton = page.getByRole("button", { name: "Zapisz preferencje" });
    this.error = page.getByText("Wybierz co najmniej jedną preferencję");
  }

  /**
   * Navigate to the settings page
   */
  async goto() {
    await this.page.goto("/settings");
  }

  /**
   * Get currently selected preferences
   */
  async getSelectedPreferences() {
    const selected: string[] = [];
    for (const [name, checkbox] of Object.entries(this.preferences)) {
      if (await checkbox.isChecked()) {
        selected.push(name);
      }
    }
    return selected;
  }

  /**
   * Select specific preferences by their names
   */
  async selectPreferences(preferencesToSelect: string[]) {
    // First unselect all
    for (const checkbox of Object.values(this.preferences)) {
      if (await checkbox.isChecked()) {
        await checkbox.click();
      }
    }

    // Then select specified ones
    for (const name of preferencesToSelect) {
      const checkbox = this.preferences[name];
      if (checkbox) {
        if (!(await checkbox.isChecked())) {
          await checkbox.click();
        }
      }
    }
  }

  /**
   * Save preferences
   */
  async savePreferences() {
    await this.saveButton.click();
  }
}
