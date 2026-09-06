This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase integration tests & setup checks

These hit a **real** Supabase project (not mocks). Use a dedicated **test/staging** project — do **not** run them against production with real client data.

Required env vars (same names as the app; see `.env.local.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Load them via `.env.local` or `.env` in the project root.

```bash
# Fast unit tests only (no network)
npm test

# Live RPC coverage for get_available_slots (inserts/deletes scoped fixtures)
npm run test:integration

# Schema / cron / storage checklist (exits non-zero on failure)
npm run verify:setup
```

For full `verify:setup` coverage (including `information_schema` defaults, `bookings.hair_texture` type, and `cron.job` names), apply `supabase/migrations/005_verify_setup_checks.sql` in the Supabase SQL editor. Without it, the script still probes columns and the `business-assets` bucket via the service role, but cron/default/type checks need that RPC.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
