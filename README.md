# HealthyMeal (MVP)

> A mobile‐first recipe app that leverages AI to generate healthy, dietary‐tailored recipes and lets users manually add and manage their own recipes.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started Locally](#getting-started-locally)
3. [Available Scripts](#available-scripts)
4. [Project Scope](#project-scope)
5. [Project Status](#project-status)
6. [License](#license)

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

### Environment Variables

Create a `.env` file in the project root with the following entries:

```dotenv
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

### Run in Development

```bash
yarn dev
```

Open your browser at `http://localhost:3000` (or the URL shown in the terminal).

## Available Scripts

In the project directory, you can run:

- `yarn dev`
  Start Astro in development mode with hot reload.
- `yarn build`
  Build the production site.
- `yarn preview`
  Preview the production build locally.
- `yarn astro`
  Run the Astro CLI.
- `yarn test`
  Run unit and component tests with Vitest.
- `yarn test:e2e`
  Run end-to-end tests with Playwright.
- `yarn test:visual`
  Run visual regression tests with Percy/Chromatic.
- `yarn lint`
  Run ESLint to catch code issues.
- `yarn lint:fix`
  Run ESLint and automatically fix problems.
- `yarn format`
  Format all files with Prettier.

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
