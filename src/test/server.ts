import { beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "./mocks";

// Setup MSW server with our handlers
export const server = setupServer(...handlers);

// Start the server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Reset any handlers between tests to ensure clean state
afterEach(() => server.resetHandlers());

// Close the server after all tests are done
afterAll(() => server.close());
