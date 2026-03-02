# Next.js + Supabase Starter App

This is a starter application that integrates Next.js with Supabase for authentication and database operations. It is designed to be a reusable foundation for future projects.

## Prerequisites

- Node.js (v16+)
- Docker
- Supabase CLI: `npm install -g supabase`

## Quick Start

This project includes a setup script that automates the entire project setup process.

To run the script, execute the following command:

```bash
./setup.sh
```

The script will:
1.  Install npm dependencies.
2.  Start the local Supabase instance.
3.  Create a `.env.local` file with the necessary Supabase credentials.
4.  Reset the local database and run all migrations.

After the script has finished, you can run the development server:

```bash
npm run dev
```

## Manual Setup

If you prefer to set up the project manually, follow these steps:

1.  **Install Dependencies**: `npm install`
2.  **Start Supabase**: `npx supabase start`
3.  **Configure Environment**: Copy the `anon key` and `URL` from the `supabase start` output and create a `.env.local` file with the following content:

    ```
    NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
    ```

4.  **Run Migrations**: `npx supabase db reset`
