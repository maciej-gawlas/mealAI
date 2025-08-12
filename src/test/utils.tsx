import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vitest";
import type { ReactElement } from "react";
import userEvent from "@testing-library/user-event";

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Custom render function that provides common wrappers (if needed)
function customRender(ui: ReactElement, options = {}) {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      // Wrap components with providers here if needed
      // For example:
      // wrapper: ({ children }) => (
      //   <ThemeProvider>
      //     {children}
      //   </ThemeProvider>
      // ),
      ...options,
    }),
  };
}

// Re-export everything from testing-library
export * from "@testing-library/react";

// Override render method with our custom one
export { customRender as render };
