# Pipeline Tracker

A personal Candidate Pipeline Dashboard for tracking companies, applications, and candidates.

## Setup

### Prerequisites

- Node.js 20+
- pnpm
- A Supabase project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in your Supabase credentials in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` — only for migration scripts, never committed

### Database Setup

Run the SQL migrations in order in your Supabase SQL editor:

1. `supabase/migrations/001_extensions_and_helpers.sql`
2. `supabase/migrations/002_dropdown_options.sql`
3. `supabase/migrations/003_companies.sql`
4. `supabase/migrations/004_candidates.sql`
5. `supabase/migrations/005_applications.sql`
6. `supabase/migrations/006_outcome_history.sql`

### Running Locally

```bash
pnpm dev
```

### Running Tests

```bash
pnpm vitest run
```

### Type Checking

```bash
pnpm tsc --noEmit
```

## GitHub Actions Setup

Add the following secret to your GitHub repository:

- `HEALTH_CHECK_URL` — the full URL to your deployed `/api/health` endpoint (e.g., `https://your-app.vercel.app/api/health`)

This is used by the keep-alive workflow to ping your Supabase database every 6 hours to prevent the free tier from pausing.

## Deployment

Deploy to Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

## Architecture

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (Postgres)
- **Auth**: Supabase magic-link auth
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Testing**: Vitest

## Features

- Track companies you have applied to
- Manage application records with status, round, and outcome tracking
- Attach optional candidate information to applications
- Parse pasted "Label: Value" details blocks to auto-fill forms
- Outcome history timeline for each application
- Dashboard with summary counts
