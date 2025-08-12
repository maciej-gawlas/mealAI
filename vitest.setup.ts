/// <reference types="vitest" />
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect method with methods from React Testing Library
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock Astro's client-side directives
// This allows testing components with client: directives
vi.mock("astro:content", () => {
  return {
    defineCollection: vi.fn(),
    getCollection: vi.fn(() => Promise.resolve([])),
    getEntry: vi.fn(() => Promise.resolve({})),
  };
});

// Mock environment variables
if (!import.meta.env) {
  Object.defineProperty(import.meta, "env", {
    value: {},
  });
}

// Setup any global mocks needed for tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock for window.matchMedia - used by many UI components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
