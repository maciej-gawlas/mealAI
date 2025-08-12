# HealthyMeal (MVP)

> A mobile‐first recipe app that leverages AI to generate healthy, dietary‐tailored recipes and lets users manually add and manage their own recipes.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started Locally](#getting-started-locally)
3. [Available Scripts](#available-scripts)
4. [Testing](#testing)
5. [Project Scope](#project-scope)
6. [Project Status](#project-status)
7. [License](#license)

## Tech Stack

- **Frontend**
  - Astro 5
  - React 19 (Shadcn/UI components)
  - TypeScript 5
  - Tailwind CSS 4 (JIT, `@apply`, dark mode, responsive)
  - clsx, class‐variance‐authority, lucide‐react, tw‐animate‐css

- **Backend**
  - Supabase (PostgreSQL, Auth)

- **AI Integration**
  - Openrouter.ai (OpenAI, Anthropic, Google, …)

- **Testing**
  - Vitest + React Testing Library (Unit & Component Tests)
  - Mock Service Worker (MSW) for API mocking
  - Playwright (End-to-End Tests)

- **CI / CD & Hosting**
  - GitHub Actions
  - Docker → DigitalOcean

## Getting Started Locally

### Prerequisites

- Node.js v22.14.0 (use `.nvmrc` with [nvm](https://github.com/nvm-sh/nvm))
- A Supabase project (URL & anon/public key)
- An Openrouter.ai API key

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-org>/mealAI.git
cd mealAI

# Use the correct Node version
nvm use

# Install dependencies
yarn
```

cd mealAI
npm install

# Setup Playwright (for E2E tests)

./setup-playwright.sh

````

### Environment Variables

Create a `.env` file in the project root with the following entries:

```dotenv
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
OPENROUTER_API_KEY=your-openrouter-api-key
````

### Run in Development

```bash
npm run dev
```

Open your browser at `http://localhost:4321` (or the URL shown in the terminal).

## Available Scripts

In the project directory, you can run:

- `npm run dev`
  Start Astro in development mode with hot reload.
- `npm run build`
  Build the production site.
- `npm run preview`
  Preview the production build locally.
- `npm run astro`
  Run the Astro CLI.
- `npm run test`
  Run unit and component tests with Vitest.
- `npm run test:watch`
  Run tests in watch mode during development.
- `npm run test:ui`
  Run tests with the Vitest UI.
- `npm run test:coverage`
  Generate test coverage report.
- `npm run test:e2e`
  Run end-to-end tests with Playwright.
- `npm run test:e2e:ui`
  Run end-to-end tests with Playwright UI.
- `npm run lint`
  Run ESLint to catch code issues.
- `npm run lint:fix`
  Run ESLint and automatically fix problems.
- `npm run format`
  Format all files with Prettier.

## Testing

We have implemented a comprehensive testing strategy following the testing pyramid:

### Test Environment Setup

Before running tests, create a `.env.test` file in the project root with test-specific variables:

```dotenv
SUPABASE_URL=your-test-supabase-url
SUPABASE_ANON_KEY=your-test-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-test-service-role-key
OPENROUTER_API_KEY=your-test-openrouter-key

# E2E Test User Credentials
E2E_USERNAME_ID=your-test-user-id
E2E_USERNAME=test@example.com
E2E_PASSWORD=your-test-password
```

### Unit Tests (Vitest + React Testing Library)

- Test individual components, utilities, and services
- Fast execution and focused on specific functionality
- Located in `__tests__` directories next to the code they test

```bash
npm run test        # Run all unit tests
npm run test:watch  # Run in watch mode during development
npm run test:ui     # Run with Vitest UI
```

### Integration Tests (MSW for API mocking)

- Test interactions between components and services
- Mock API requests to test frontend logic with controlled responses
- MSW setup in `src/test/server.ts` and handlers in `src/test/mocks.ts`

### End-to-End Tests (Playwright)

- Test complete user flows from a user's perspective
- Run in real browsers (Chromium)
- Located in the `e2e` directory
- Follow the Page Object Model pattern for maintainability

The E2E tests use a separate build with test environment variables:

```bash
# Running E2E tests
npm run test:e2e    # Run all E2E tests
npm run test:e2e:ui # Run with Playwright UI

# Manual testing with test environment
npm run build:test    # Build with test environment
npm run preview:test  # Preview test build
```

#### E2E Test Development

1. Create/update your test in the `e2e` directory
2. Tests automatically use credentials from `.env.test`
3. Test data cleanup is handled automatically after each test run
4. For local development:
   - Use `npm run build:test` to build with test environment
   - Use `npm run preview:test` to preview the test build
   - Tests will automatically handle build and preview when running

For more detailed information about testing, see [docs/testing.md](docs/testing.md).

## Project Scope

### In Scope (MVP)

- **User Accounts**:
  - Email/password sign up & login (password ≥ 6 chars, 1 digit, 1 special char)
  - Basic profile page with 5 dietary preference checkboxes
- **Recipes Management**:
  - Manual create (Name, Ingredients, Instructions)
  - AI‐powered generation (structured JSON output + safety disclaimer)
  - Read (list + detail view)
  - Delete (with confirmation)
- **AI Generation Screen**:
  - Text prompt + dietary‐preferences override
  - Loading state & error handling
  - Disclaimer on generated recipes
- **Empty State UI** for new users with no recipes

### Out of Scope (MVP)

- Password reset flows
- Media (images/videos) in recipes
- Social features (sharing, comments, ratings)
- Importing external recipe URLs
- Admin panel or moderation tools

## Project Status

**MVP in active development.**
Key functionalities have been scoped and are under implementation. Contributions and feedback are welcome!

## License

This project is licensed under the [MIT License](LICENSE).
