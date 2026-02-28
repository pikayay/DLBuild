# Gemini Development Guidelines for Starter App

This document provides rules and guidelines for developing the Next.js + Supabase starter application. Adhering to these conventions ensures consistency, maintainability, and alignment with the project's goals.

## 1. Core Technologies

- **Framework**: Next.js (v16+, App Router)
- **Language**: TypeScript (strict mode)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS (v4)
- **Linting**: ESLint with `eslint-config-next`
- **Package Manager**: npm

## 2. Development Workflow

### Initial Setup

1.  **Install Dependencies**: Run `npm install` to install all required packages.
2.  **Start Supabase**: Run `npx supabase start` to initialize the local database.
3.  **Configure Environment**: Use the setup script (e.g., `setup.sh` or a similar Node.js script) to generate the `.env.local` file with Supabase credentials. If running manually, copy the `anon key` and `URL` from the `supabase start` output.
4.  **Run Migrations**: Execute `npx supabase db reset` to apply all database migrations and reset the local database.

### Making Changes

- **Run Development Server**: Use `npm run dev` to start the Next.js development server.
- **Linting**: Before committing, run `npm run lint` to check for and fix code style issues.
- **Testing**: Run the test suite (command to be determined, e.g., `npm test`) to ensure changes don't break existing functionality.

## 3. Codebase Conventions

### Directory Structure

- `app/`: Contains all routes and pages, following Next.js App Router conventions.
- `components/`: For reusable React components (e.g., buttons, inputs, layout elements).
- `lib/`: For shared utility functions, helper scripts, and third-party library configurations.
  - `lib/supabase/`: Specifically for Supabase client (client-side) and server-side utilities.
- `styles/`: For global stylesheets.
- `public/`: For static assets like images and fonts.

### TypeScript & Naming

- **Strict Mode**: The project uses `"strict": true`. All code must be strictly typed.
- **Path Aliases**: Use the `@/*` alias for absolute imports from the project root (e.g., `import { MyComponent } from '@/components/MyComponent';`).
- **Naming**:
    - Component files and functions: `PascalCase` (e.g., `UserProfile.tsx`).
    - Utility functions and variables: `camelCase` (e.g., `getUserProfile.ts`).
    - Custom hooks: `use` prefix (e.g., `useAuth`).

### Styling

- **Tailwind CSS**: Use Tailwind utility classes for all styling.
- **CSS Modules**: For component-specific styles that are complex, CSS modules can be used, but prefer Tailwind first.
- **Global Styles**: Global styles are defined in `app/globals.css`. Add new global styles sparingly.

## 4. Database (Supabase)

### Schema Management

- **Declarative Schemas**: All database tables, views, and types must be defined as SQL files in the `supabase/schemas/` directory. Do not modify the database schema manually via the Supabase Studio UI for changes that should be persisted.
- **Triggers**: PostgreSQL functions and triggers (like the one for automatic profile creation) should be defined in their own SQL files within the migrations.

### Migrations

- **Generation**: After changing a declarative schema file, generate a new migration using the command: `npx supabase db diff --schema schemas > supabase/migrations/YYYYMMDDHHMMSS_my_descriptive_name.sql`.
- **Application**: Migrations are applied automatically by the setup script (`npx supabase db reset`) or during CI/CD. For incremental updates during development, you can use `npx supabase migration up`.
- **Immutability**: Never edit a migration file after it has been run or committed.

### Security

- **Row Level Security (RLS)**: RLS must be enabled on all tables containing user-specific or sensitive data.
- **Policies**: Define fine-grained RLS policies that grant access based on `auth.uid()`. As a default, users should only be able to view and edit their own data.

## 5. Authentication

- **SSR Support**: Use the `@supabase/ssr` library to handle authentication in both Server and Client Components.
- **Middleware**: The `proxy.ts` (or equivalent middleware) is responsible for refreshing the user's session token.
- **Auth Utils**:
  - Create a `lib/supabase/client.ts` for the client-side Supabase client.
  - Create a `lib/supabase/server.ts` for the server-side Supabase client.
- **Protected Routes**: Use layout files or higher-order components to protect routes that require authentication, redirecting unauthenticated users to `/login`.

## 6. Deployment & CI/CD

- **Environment Variables**: All secrets (Supabase keys, database URLs) must be managed through environment variables and never hard-coded.
- **GitHub Actions**: A GitHub Actions workflow must be configured to run database migrations (`npx supabase migration up`) against the production database on deployment to the `main` branch.
- **Secrets**: Production secrets for the GitHub Actions workflow must be stored in GitHub Repository Secrets.

## 7. Documentation
- Document every change in CHANGELOG.md.

