# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Tooling and commands

This is a Next.js 16 + TypeScript app using `pnpm` and Vitest/Playwright.

### Prerequisites

- Node.js `>=20.0.0`
- `pnpm >=8.0.0`

### Install and run locally

```bash
pnpm install
cp .env.example .env.local   # fill in values from README
pnpm dev                     # http://localhost:3000
```

### Linting, typechecking, build

All commands are defined in `package.json`:

- Lint: `pnpm lint`
- Typecheck (no emit): `pnpm typecheck`
- Production build (typecheck + lint + Next build): `pnpm build`
- Build + build-time tests (ensures special routing/SSR invariants): `pnpm build:test`
- Start production build: `pnpm start`
- Formatting: `pnpm format`

### Tests

Unit/integration tests use Vitest; E2E tests use Playwright.

- Run all unit/integration tests (Vitest): `pnpm test`
- Watch mode: `pnpm test:watch`
- Build-time tests (e.g. `tests/build/brief-prerender.test.ts`): `pnpm test:build`
- All E2E tests: `pnpm test:e2e`
- Headed E2E run: `pnpm test:e2e:headed`

Running a single test:

- Single Vitest file:
  - `pnpm test -- src/app/api/brief/route.test.ts`
- Single Playwright spec:
  - `pnpm test:e2e -- tests/e2e/brief.spec.ts`

Vitest also supports name-based filtering, for example:

- `pnpm test -- -t "brief"`

Playwright supports the usual CLI filters (e.g. `--grep`), if needed.

### Supabase and database commands

Database setup is Supabase-based and documented in `supabase/README.md`.

Key options:

- Recommended (Supabase CLI):
  - `supabase db push`
  - or for a local project: `supabase migration up`
- Manual (SQL Editor): apply `supabase/setup-db.sql` in the Supabase Dashboard.
- Apply individual migrations (in order), e.g.:
  1. `20250115120000_create_submissions.sql`
  2. `20250116000000_create_brief_submissions.sql`

Convenience scripts in `package.json`:

- `pnpm db:migrate` → `supabase db push`
- `pnpm db:setup` → prints a short guide mirroring `supabase/README.md`

Supabase creates:

- Tables: `public.submissions`, `public.brief_submissions`, `public.admin_members`
- Storage bucket: `brandbooks` (for uploaded brandbooks)
- RLS policies and indexes (see `supabase/README.md` and migrations for details)

Environment variables required for Supabase/Brevo are summarized in `README.md` and `supabase/README.md` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `BREVO_API_KEY`, `NEXT_PUBLIC_BREVO_SENDER_EMAIL`, `BREVO_NOTIFICATION_EMAIL`).

## Environment configuration

Environment handling is centralized under `src/config` and is strongly typed with Zod:

- `src/config/env.client.ts` — schema for `NEXT_PUBLIC_*` variables safe for the browser.
- `src/config/env.server.ts` — schema for server-only variables (`NODE_ENV`, `SUPABASE_SERVICE_ROLE_KEY`, `BREVO_API_KEY`, `BREVO_NOTIFICATION_EMAIL`).
- `src/config/env.ts` — exports:
  - `clientEnv` — parsed client-safe env (used in browser/shared code).
  - `serverEnv` — proxy around validated server-side env; throws if accessed on the client.
- `src/config/env.ssr.ts` — `ssrEnv` proxy combining client + server variables for server components/actions.

When adding new environment variables, update the appropriate schema(s) and re-export as needed from `src/config/index.ts`. Server-only code should consume `serverEnv`/`ssrEnv` instead of `process.env` directly.

## High-level architecture

### App routing and layout

- Next.js App Router, root entry at `src/app/layout.tsx`:
  - Sets global `<html>`/`<body>` skeleton, dark theme, and favicons/Apple icons.
- Localization-aware tree under `src/app/[locale]`:
  - `src/app/[locale]/layout.tsx` wires up:
    - `next-intl` (`NextIntlClientProvider`, `getMessages`, `getTranslations`).
    - Global fonts (Inter, Manrope, JetBrains Mono) via `next/font/google`.
    - `ThemeProvider` from `@/components/theme/theme-provider`.
    - `CookieConsent` from `@/components/cookie-consent`.
    - Skip link text from `common.skipToContent` translations.
  - `generateStaticParams` comes from `@/i18n/routing` and precomputes all locales.

Key localized pages live under `src/app/[locale]/…` (`about`, `blog`, `brief`, `cases`, `contact`, `privacy-policy`), plus locale-level metadata files (`page-metadata.ts`).

#### Brief page: dynamic-only behavior

`src/app/[locale]/brief/page.tsx` is intentionally *not* prerendered:

- It defines its own `generateStaticParams` returning `[]`, overriding the locale layout’s `generateStaticParams` for this route.
- It sets `dynamic = 'force-dynamic'`, `dynamicParams = false`, `revalidate = 0`, `fetchCache = 'force-no-store'`, and calls `unstable_noStore()`.
- This guarantees the brief wizard always renders dynamically at request time and avoids build-time issues.
- Build tests in `tests/build/brief-prerender.test.ts` guard these invariants; if you change this page’s rendering mode, adjust tests accordingly.

### Internationalization

- Core config is in `src/i18n/config.ts`:
  - `locales = ['ru', 'en', 'kk']`, `defaultLocale = 'en'`, plus localized display names.
  - `isValidLocale(locale)` helper.
- Routing helpers live in `src/i18n/routing.ts` and `src/i18n/request.ts` (locale detection and path helpers for the app router).
- All locale-aware pages are nested under the `[locale]` segment; any new user-facing route should generally follow this pattern and use `next-intl` messages.

### Feature modules

The domain logic is organized by feature under `src/features`.

#### Brief feature (`src/features/brief`)

Responsible for both the original brief wizard and the newer cost-calculating brief.

- `components/` — client-side multi-step form UI:
  - `brief-form-provider.tsx` — context provider + hook (`BriefFormProvider`, `useBriefFormContext`) wrapping form state and navigation.
  - Step components (`client-step.tsx`, `audience-step.tsx`, `metrics-step.tsx`, `contact-step.tsx`, `design-step.tsx`, `modules-step.tsx`, `technical-step.tsx`, `timeline-step.tsx`, etc.) implement each wizard section.
  - Progress and navigation components (`brief-progress.tsx`, `brief-step-navigator.tsx`, `brief-new-*` variants) manage current step, progress bar, and summary preview.
- `constants/` — wizard configuration:
  - `defaults.ts` / `defaults-new.ts` — initial `BriefFormValues` for legacy/new flow.
  - `steps.ts` / `steps-new.ts` — ordered step metadata (`BRIEF_STEPS`, `BRIEF_STEP_ORDER` exports via `index.ts`).
  - `options.ts` — select/checkbox option lists (industries, channels, integrations, etc.).
  - `storage.ts` — local storage keys/policies for persisting draft brief state.
- `hooks/` — step navigation state machines (`use-brief-step`, `use-brief-new-step`).
- `schemas/` — Zod validation schemas:
  - `brief.ts` — schema for the original brief flow and `/api/brief`.
  - `brief-new.ts` — schema for the interactive cost-calculating brief.
  - `brief.test.ts` — schema-focused tests around data validation.
- `types/` — TypeScript types re-exported as the feature’s public API.
- `utils/calculation.ts` — core cost estimation logic for the new brief (hourly rates, per-module breakdown, totals). This is used by both the client-side wizard and the PDF/API layer.

Public exports from `src/features/brief/index.ts` are used by pages and API routes; when introducing new brief-related components or types, add them here if they need to be shared.

#### Admin feature (`src/features/admin`)

Admin area for reviewing and triaging submitted briefs.

- `components/login-form.tsx` — magic link login via Supabase Auth using the browser client (`getSupabaseBrowserClient`). Redirects back to `/admin`.
- `components/dashboard.tsx` — main admin dashboard:
  - Fetches `submissions` from Supabase, with status filter and selection.
  - Allows updating `status` (`new`, `in_progress`, `completed`, `archived`) in-place; optimistic update with rollback on error.
  - Shows detailed client/audience/metrics/contact info and links to brandbook files/links.
  - Uses the same Supabase browser client as frontend features; no direct server code in the dashboard.
- `types.ts` — `SubmissionRow` typed view of the `submissions` table, re-exported from `index.ts`.

`src/app/admin/page.tsx` composes this feature:

- Uses `supabase.auth.getSession()` + `onAuthStateChange` to gate access.
- Shows a loading screen while initializing; then either `AdminLoginForm` or `AdminDashboard` based on session state.

### Data access and backend integrations

#### Supabase clients

Centralized in `src/lib`:

- `src/lib/supabase-browser.ts`:
  - Builds a browser `SupabaseClient` using `clientEnv.NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - Enables session persistence and URL detection.
  - Used in admin and any client-side data-fetching pieces.
- `src/lib/supabase-admin.ts`:
  - Creates a server-only admin client using `clientEnv.NEXT_PUBLIC_SUPABASE_URL` and `serverEnv.SUPABASE_SERVICE_ROLE_KEY`.
  - Throws early if either is missing.
  - Used by API routes to write to tables and Supabase Storage (`brandbooks` bucket).

Supabase schema details (tables, RLS, indexes) are owned by the SQL migrations under `supabase/` and summarized in `supabase/README.md`.

#### Email (Brevo)

`src/server/email/brevo.ts` provides the single entrypoint for sending transactional emails via Brevo:

- Uses `serverEnv.BREVO_API_KEY` and `clientEnv.NEXT_PUBLIC_BREVO_SENDER_EMAIL`.
- Exposes `sendBrevoEmail({ to, subject, html, replyTo, attachments })`.
- Throws if required credentials/recipients are missing; surfaces Brevo API errors with JSON payload where possible.

This module is used by both brief-related APIs:

- Legacy brief: attaches a generated brief PDF for admin and client.
- New brief: sends admin notification + client confirmation with calculated totals.

#### PDF generation

Two separate PDF-generation paths exist:

- `src/server/pdf/brief-report.ts`:
  - Generates a concise summary PDF of the legacy brief (`BriefFormValues`), grouped into sections (Client & Business, Audience & Product, Metrics & Brand, Contacts).
  - Used in `app/api/brief/route.ts` to attach a summary to emails.
- `app/api/brief/generate-pdf/route.ts`:
  - Builds a full commercial proposal PDF based on the new brief (`BriefNewFormValues`) and `CalculationResult`.
  - Contains logic to patch PDFKit’s font loading to work under Next.js/Turbopack (custom `fs.readFileSync` shim pointing at `Helvetica.afm`).
  - Renders multi-page content: title page, executive summary, detailed per-phase cost breakdown (Discovery, Design, Frontend, Backend, E‑commerce, Integrations, Technical, Testing, Deployment, Documentation), totals, and contact info.

If you change how cost calculation works (`utils/calculation.ts` or `HOURLY_RATES`), you will likely need to update this route to keep the PDF structure consistent.

### API routes for briefs

All brief-related APIs live under `src/app/api` and are closely tied to the feature modules and Supabase/ Brevo helpers.

#### `src/app/api/brief/route.ts` (legacy brief submission)

- Accepts JSON `{ data, brandbookFile? }` where `data` is validated by `briefSchema`.
- Always strips `metrics.brandbookFile` from the validated payload and handles file upload via Supabase Storage instead.
- Handles optional `brandbookFile`:
  - Decodes base64 payload.
  - Uploads into the `brandbooks` bucket under `submissionId/timestamp-filename`.
  - Obtains a public URL for use in DB and admin.
- Writes a row into `submissions` with flattened fields (client, audience, metrics, contact, status, meta like IP/user-agent).
- Generates a PDF summary via `generateBriefPdf` and sends two Brevo emails:
  - Admin email (to `BREVO_NOTIFICATION_EMAIL` or fallback to sender/contact) with detailed HTML + attached PDF.
  - Client email with confirmation and attached PDF.
- Special test mode: if `process.env.E2E_TEST_MODE === "true"`, short-circuits after validation and returns a fake `{ id, mode: "test" }` without hitting Supabase or Brevo; E2E tests rely on this.

#### `src/app/api/brief-new/route.ts` (interactive cost-calculating brief)

- Accepts `{ formData: BriefNewFormValues, calculation: CalculationResult, locale? }`.
- Validates essential fields (`projectInfo.projectName`, `contact.contactEmail`).
- Uses its own admin Supabase client instance (not the shared `supabase-admin.ts`), created from `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Inserts into `brief_submissions`:
  - Stores both hours and monetary `costBreakdown` components, plus full `formData` as JSON.
  - Captures IP and user-agent.
- Sends two Brevo emails (if `BREVO_NOTIFICATION_EMAIL` and `NEXT_PUBLIC_BREVO_SENDER_EMAIL` are set):
  - Admin summary with `formatCurrency(calculation.totalCost, locale)` and key project/contact data.
  - Client confirmation emphasizing that the quote is approximate, with locale-aware messaging.

#### `src/app/api/brief/generate-pdf/route.ts` (proposal PDF endpoint)

- Accepts the same `{ formData, calculation, locale? }` shape as `brief-new`.
- Validates required structure (project name, presence of `costBreakdown`).
- Returns an `application/pdf` response (attachment) with a full commercial offer document.
- Used by the new brief UI to allow users to download a detailed proposal.

### Shared UI components and layout

Shared layout and UI live under `src/components` and `src/app/[locale]`:

- `src/components/layout/` — site shell (`site-shell.tsx`), header/footer, layout container.
- `src/components/theme/` — theme context and toggle.
- `src/components/background/` — dynamic background/visuals.
- `src/components/blog/markdown-content.tsx` — markdown rendering for blog posts using `react-markdown`/syntax highlighting.
- `src/components/seo/structured-data.tsx` — helpers for injecting structured data into pages.
- `src/components/cookie-consent/` — cookie consent banner; wired into locale layout.

Data helpers and utilities in `src/lib` are used across these components:

- `blog-data.ts`, `portfolio-data.ts` — structured content for the site’s blog/case sections.
- `metadata.ts` — shared metadata generator used by the locale layout’s `generateMetadata`.
- `currency.ts` — formatting helpers shared between APIs and UI, especially for the cost calculator.
- `cn.ts`, `cookie-consent.ts`, `zod-resolver.ts` — generic utility functions.

### Testing layout

Tests are split by concern:

- Unit/schema tests co-located with code:
  - `src/app/api/brief/route.test.ts` — API-level tests for the legacy brief route.
  - `src/features/brief/schemas/brief.test.ts` — Zod schema tests for brief data.
- Build-time invariants:
  - `tests/build/brief-prerender.test.ts` — ensures the brief page is not prerendered and keeps its dynamic configuration.
- E2E tests (`tests/e2e`):
  - `brief.spec.ts` — end-to-end happy path through the brief wizard (mocks API, asserts payload and success screen).
  - `brief-api.spec.ts`, `brief-validation.spec.ts` and helpers in `tests/e2e/utils/brief-helpers.ts` — exercise API contracts, validation flows, and UI interactions.

When changing routing or brief behavior, update both unit tests and the relevant E2E/build tests to keep the flows in sync.
