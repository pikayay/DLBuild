# Gemini Development Guidelines for Deadlock Build App

This document outlines the guidelines and context for the Gemini AI agent while working on this project. Adhering to these principles will ensure consistency, quality, and alignment with the project's goals.

## 1. Project Core Objective

The primary goal is to create a data-driven web application for the game *Deadlock*. The app will empower players to craft, analyze, and share item builds. The user experience should be intuitive for theory-crafters and visually aligned with the game's aesthetic.

When in doubt about the purpose of a feature, refer back to the core objective: **Does this help a player make better build decisions or understand the game's items and heroes more deeply?**

## 2. Technical Stack & Conventions

This project uses a specific set of technologies. Please adhere to them strictly. Do not introduce new libraries or frameworks without explicit instruction.

*   **Frontend:** React / Next.js (TypeScript)
*   **Styling:** Tailwind CSS (as is common with Next.js) and **Framer Motion** for animations. The visual identity should be a priority, reflecting the *Deadlock* game's art style.
*   **Data Visualization:** Use a library like **D3.js** for creating charts and graphs for item/hero statistics.
*   **Backend & Database:** **Supabase** will be used for the PostgreSQL database and user authentication.
*   **Background Jobs:** **BullMQ** with Redis for scheduled tasks like sending emails.
*   **LLM Integration:** **Google AI Studio** for specific, contained features like summarizing community sentiment.

**Coding Style:**
*   Follow existing code style and conventions.
*   Use TypeScript for all new components and logic.
*   Write functional components with React Hooks.

## 3. Key Project Considerations

### API Instability

The *Deadlock* game API is for a game in early alpha and is subject to frequent changes and potential instability.

*   **Defensive Coding:** All API calls must have robust error handling. The UI should gracefully handle API failures, perhaps by displaying a message to the user or falling back to cached/static data where possible.
*   **Data Caching/Fallback:** For critical data (like item lists), consider creating local fallbacks or a caching mechanism to ensure the app remains usable even if the API is down.
*   **Modular API Service:** Encapsulate all API-related logic in a dedicated service module. This will make it easier to update when the API changes.

## 4. Development Workflow

1.  **Consult `STRUCTURE.md`:** Review this file for the high-level design of the website and page structure.
2.  **Understand the Goal:** Before writing code, understand the feature's purpose from `PROPOSAL.md`.
3.  **Plan the Implementation:** Briefly outline the components, state management, and data flow.
4.  **Write Tests:** For complex logic (e.g., build calculations, API data transformation), write unit tests.
5.  **Implement the Feature:** Write the code, adhering to the tech stack and style guidelines.
6.  **Verify:** Test the feature manually and run any existing automated tests.

## 5. Specific Instructions

*   When adding new features or pages, ensure they are linked from the main navigation or relevant sections of the app.
*   When adding new dependencies, use `npm install`.
*   Prioritize a polished and visually appealing UI. Use Framer Motion to add meaningful animations that enhance the user experience, not just for decoration.
*   For any new file, especially components, follow the naming and organizational structure of the existing `app/` directory.









# STARTER APP (COMPLETED) DOCUMENT BELOW

# Gemini Development Guidelines for Starter App (COMPLETED)

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

