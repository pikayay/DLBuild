# Change Log

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Created the Deadlock app, a build-crafting app for the game Deadlock.
- Created `items`, `builds`, and `heroes` pages.
- Created a new layout for the Deadlock pages with a sidebar and animations.
- Created a placeholder API client for items, builds, and heroes.

### Changed
- Updated the homepage to be more relevant to the Deadlock app.
- Updated the middleware to redirect unauthenticated users to the homepage.
- Updated the title and description of the app.

### Removed
- Removed the login, signup, dashboard, and profile pages and components from the starter app.
- Removed unnecessary markdown files.

## 2026-03-03

### Added
- Created `profiles` table with declarative schema in `supabase/schemas/profiles.sql`.
- Generated migration `20260301120005_create_profiles.sql` from the declarative schema.
- Added RLS policies to the `profiles` table.
- Added a trigger to automatically create a profile for new users.
- Added a trigger to automatically update the `updated_at` field on profile updates.

## 2026-02-28

### Added
- sign up, sign in, and sign out functionality.
