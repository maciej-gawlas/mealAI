import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserPreferencesForm } from "../UserPreferencesForm";
import { toast } from "sonner";
import "@testing-library/jest-dom/vitest";

// Mock PreferenceCheckboxGroup
vi.mock("@/components/recipes/PreferenceCheckboxGroup", () => ({
  PreferenceCheckboxGroup: vi.fn(({ value, onChange }) => (
    <div data-testid="mock-preference-group">
      <button type="button" onClick={() => onChange(value)}>
        Mock Select
      </button>
    </div>
  )),
}));

// Mock the toast module
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("UserPreferencesForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    render(<UserPreferencesForm />);
    expect(screen.getByTestId("preferences-loading")).toBeInTheDocument();
    // Wait for initial state update
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/users/me/preferences");
    });
  });

  it("loads and displays user preferences", async () => {
    const mockPreferences = {
      data: [
        { preference_id: "123e4567-e89b-12d3-a456-426614174000" },
        { preference_id: "987fcdeb-51d3-11ee-be56-0242ac120002" },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPreferences),
    });

    render(<UserPreferencesForm />);

    await waitFor(() => {
      expect(
        screen.queryByTestId("preferences-loading"),
      ).not.toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/users/me/preferences");
  });

  it("handles preference loading error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<UserPreferencesForm />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Nie udało się pobrać twoich preferencji",
      );
    });
  });

  it("submits form with selected preferences", async () => {
    const user = userEvent.setup();
    const preferenceId = "123e4567-e89b-12d3-a456-426614174000";
    const mockPreferences = {
      data: [{ preference_id: preferenceId }],
    };

    // Mock initial preferences load
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPreferences),
    });

    // Mock successful form submission
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<UserPreferencesForm />);

    // Wait for initial preferences to load
    await waitFor(() => {
      expect(
        screen.queryByTestId("preferences-loading"),
      ).not.toBeInTheDocument();
    });

    // Simulate selecting preferences using the mock component
    const mockSelect = screen.getByRole("button", { name: /mock select/i });
    await user.click(mockSelect);

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /zapisz preferencje/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      // Verify the PUT request
      expect(mockFetch).toHaveBeenCalledWith("/api/users/me/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: [preferenceId],
        }),
      });

      // Verify success message
      expect(toast.success).toHaveBeenCalledWith(
        "Preferencje zaktualizowane pomyślnie!",
      );
    });
  });

  it("handles form submission error", async () => {
    const user = userEvent.setup();
    const preferenceId = "123e4567-e89b-12d3-a456-426614174000";
    const mockPreferences = {
      data: [{ preference_id: preferenceId }],
    };

    // Mock initial preferences load
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPreferences),
    });

    // Mock failed form submission
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.reject(new Error("Failed to update")),
    });

    render(<UserPreferencesForm />);

    // Wait for initial preferences to load
    await waitFor(() => {
      expect(
        screen.queryByTestId("preferences-loading"),
      ).not.toBeInTheDocument();
    });

    // Simulate selecting preferences using the mock component
    const mockSelect = screen.getByRole("button", { name: /mock select/i });
    await user.click(mockSelect);

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /zapisz preferencje/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Nie udało się zaktualizować preferencji",
      );
    });
  });

  it("shows validation error when no preferences selected", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    });

    render(<UserPreferencesForm />);

    await waitFor(() => {
      expect(
        screen.queryByTestId("preferences-loading"),
      ).not.toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", {
      name: /zapisz preferencje/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Wybierz co najmniej jedną preferencję"),
      ).toBeInTheDocument();
    });
  });
});
