---
title: FORESE HR Database - Project Documentation
authors:
  - FORESE Engineering
  - Contributors
---

## Executive Summary

The FORESE HR Database is a role-based contacts management platform used to organize Mock Placements outreach. It enables admins, incharges, and volunteers to securely authenticate, manage HR contact records, analyze progress via dashboards, and perform bulk CSV uploads. The application is built with Next.js App Router, React, and PostgreSQL, and employs JWT-based sessions with server-side authorization.

## Table of Contents

1. Introduction
2. Architecture Overview
3. Tech Stack
4. Features
5. Roles and Permissions
6. Environment & Configuration
7. Database Schema
8. Data Flows
9. API Endpoints
10. Server Actions
11. Frontend Pages & Components
12. Authentication & Session Management
13. CSV Upload Flow
14. Analytics & Telemetry
15. Setup, Build, and Run
16. Deployment
17. Security Considerations
18. Troubleshooting & Support
19. Future Technical Improvements
20. Appendix

## 1. Introduction

FORESE HR Database centralizes HR outreach contacts and progress tracking with fine-grained, role-based access. It is optimized for reliability, clarity, and speed of operations across Admin, Incharge, and Volunteer user groups.

## 2. Architecture Overview

- Web application using Next.js 15 App Router and React 19.
- PostgreSQL as the primary data store with SQL queries through `pg`.
- Server Actions for data mutations and reads under `src/lib/actions.js`.
- API routes for OAuth and auxiliary data under `src/app/api`.
- JWT-based session management via `jose`, cookies, and edge middleware for route protection.
- Tailwind CSS and shadcn/ui (Radix primitives) for UI.
- Optional analytics via PostHog.

High-Level Directory Map:

- `src/app` — App Router pages, middleware, API routes
- `src/components` — UI and page-level building blocks
- `src/lib` — database pool, actions, validation, session helpers, utilities
- `db.sql` — PostgreSQL schema (new and legacy reference)

## 3. Tech Stack

- Frontend
  - Next.js 15 (App Router), React 19
  - UI: Tailwind CSS, shadcn/ui built on Radix UI primitives, lucide-react icons
  - Charts: recharts
  - State/UX: next-themes, next-nprogress-bar

- Validation and typing
  - zod for schema validation

- Data and backend
  - PostgreSQL with `pg` node client
  - SQL queries in server actions under `src/lib/actions.js`

- Authentication and security
  - jose (HS256 JWT) for sessions
  - bcryptjs for password hashing
  - Middleware-based route protection

- File processing
  - papaparse for CSV parsing
  - react-dropzone for client-side uploads

- Analytics
  - posthog-js with ingestion rewrites configured in `next.config.mjs`

- Utilities and styling
  - clsx + tailwind-merge for class composition

- Tooling
  - Tailwind CSS + tailwindcss-animate
  - drizzle-kit present for potential migrations (not currently used in runtime)

## 4. Features

- Authentication: Email/Password and Google OAuth 2.0.
- Role-based authorization (RBAC): Admin, Incharge, Volunteer with server-side checks.
- HR contacts CRUD with strict permissioning and pagination/search/filters.
- Bulk CSV upload with duplicate detection by phone number and downloadable duplicates report.
- Dashboards: Admin (Incharge overview), Incharge (Member distribution), Volunteer (Personal stats).
- PostHog-based analytics for events and page views (optional).

## 4. Roles and Permissions

- Admin
  - Manage all users (create incharges/volunteers).
  - Full read/write on all HR records.
  - Access admin dashboard (`/stats`).

- Incharge
  - Read/write HR records for volunteers assigned to them.
  - View incharge dashboard aggregations.

- Volunteer
  - Read/write only their own HR records.
  - View personal member statistics.

Route Protection (middleware):

- Protected: `/`, `/add-hr`, `/edit-hr`, `/hr-pitch`
- Admin-only: `/add-user`
- Public (landing): `/welcome`; login redirect flow at `/login`

## 5. Environment & Configuration

Environment variables (see `example.env`):

```
DB_URL=postgresql://USER:PASS@HOST:PORT/DBNAME
SESSION_SECRET="<strong-random-secret>"
NEXT_PUBLIC_POSTHOG_KEY=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Key Config Files:

- `next.config.mjs`: PostHog ingestion rewrites; `skipTrailingSlashRedirect: true`.
- `tailwind.config.js`: Dark mode via class, content globs, animations, and CSS variables for color/radius.

## 6. Database Schema

Primary tables (from `db.sql`):

- `users`
  - `id SERIAL PRIMARY KEY`
  - `email VARCHAR(255) UNIQUE NOT NULL`
  - `password VARCHAR(255) NOT NULL` (bcrypt hash)
  - `role VARCHAR(50) NOT NULL` in {`admin`, `incharge`, `volunteer`}
  - `incharge_email VARCHAR(255)` (FK to `users.email`, nullable)
  - `name VARCHAR(255)`

- `hr_contacts`
  - `id SERIAL PRIMARY KEY`
  - `hr_name VARCHAR(255)`
  - `volunteer_email VARCHAR(255)` (FK to `users.email` ON DELETE CASCADE)
  - `phone_number VARCHAR(50)`
  - `email VARCHAR(255)`
  - `company VARCHAR(255)`
  - `status VARCHAR(50)`
  - `interview_mode VARCHAR(50)`
  - `hr_count INTEGER DEFAULT 1`
  - `transport VARCHAR(255)`
  - `address TEXT`
  - `internship VARCHAR(50)`
  - `comments TEXT`

Notes:

- App logic enforces uniqueness of `phone_number` for inserts/updates. If you need database-level enforcement, add a unique index: `CREATE UNIQUE INDEX unique_phone_number ON hr_contacts (phone_number);`

## 7. Data Flows

- Login (Email/Password)
  1. `login` action validates credentials with `zod` and bcrypt compares against `users.password`.
  2. On success, a session JWT is set in `session` cookie containing email, role, name, and optional incharge details.

- Login (Google OAuth)
  1. `/api/auth/google/start` redirects to Google with a CSRF `state` cookie.
  2. `/api/auth/google/callback` verifies state and ID token, then looks up the user by email.
  3. If user exists, sets JWT session and redirects to `/login?google=1` to complete client-side routing.

- Session & RBAC
  - `src/lib/session.js` handles JWT sign/verify and cookie management.
  - `src/middleware.js` restricts routes and enforces admin-only sections.
  - All server actions read `getSession()` to authorize operations.

## 8. API Endpoints

- `GET /api/auth/google/start`
  - Redirects to Google OAuth 2.0 authorization endpoint. Sets `google_oauth_state` cookie.

- `GET /api/auth/google/callback`
  - Handles OAuth callback, exchanges code for tokens, validates ID token, looks up user, sets session, redirects.

- `GET /api/incharges`
  - Auth required (`admin`/`incharge`/`volunteer`). Returns list of users with role `incharge` as `{ name, email }`.

## 9. Server Actions (selected)

- `login(formData)`
  - Validates `email`, `password`. Compares bcrypt hash; sets session.

- `getHrData(page, pageSize, searchParams)`
  - Paginates HR records with role-aware filters (volunteer, incharge, admin). Returns data and total count.

- `addHrRecord(formData)`
  - Validates and inserts HR record; enforces volunteer assignment rules per role; returns inserted row with joined names.

- `editHR(id, formData)` / `deleteHR(id)`
  - Authorization checks by role and ownership; updates or deletes record accordingly.

- `addUser(state, formData)`
  - Admin-only. Creates users; if role is volunteer, verifies specified incharge exists.

- `getMemberStats()` / `getInchargeStats(inchargeEmail)` / `getAdminStats()`
  - Aggregated metrics per role using conditional counts over `hr_contacts`.

- `addHrBulk(hrDataArray)`
  - Volunteer-only bulk insert; skips existing `phone_number` rows and returns duplicates summary.

## 10. Frontend Pages & Components

Key routes (App Router):

- `/welcome` — public landing
- `/login` — login UI and Google OAuth finalizer
- `/` — main table/dashboard; protected
- `/add-hr` — add HR form; protected
- `/edit-hr` — edit HR flow; protected
- `/hr-pitch` — pitch resources; protected
- `/csv-upload` — CSV upload UI; protected
- `/add-user` — admin-only user creation
- `/stats` — dashboards (admin/incharge/member views)

Representative components:

- `src/components/hr/hr-table.jsx`, `search-form.jsx`, `pagination-controls.jsx` — data table UX
- `src/components/csv-upload.jsx` — CSV import and duplicate export
- `src/components/admin-stats.jsx`, `incharge-stats.jsx`, `member-stats.jsx` — charts via `recharts`
- `src/components/login-page.jsx`, `navbar.jsx`, `hr-details-dialog.jsx` — UI flows

## 11. Authentication & Session Management

- Sessions: HS256-signed JWT via `jose`, stored in `session` cookie (7-day expiry).
- Helpers: `createSession`, `createSessionOnResponse`, `getSession`, `deleteSession`, `updateSession`.
- Middleware: restricts protected routes and redirects logged-in users away from `/login` (except during Google finalization).

## 12. CSV Upload Flow

1. Volunteer prepares CSV with required headers (see UI template).
2. Client uploads; server-side parses with `papaparse` and validates with `zod`.
3. Records inserted if `phone_number` not present; duplicates are reported back for export.

## 13. Analytics & Telemetry

- Optional: `posthog-js` for page views and events.
- `next.config.mjs` includes rewrite rules for PostHog ingestion and skipTrailingSlashRedirect.

## 14. Setup, Build, and Run

Prerequisites: Node.js 18.18+ (or 20+), PostgreSQL 13+.

Steps:

1. Clone repository and install dependencies.
2. Copy `example.env` to `.env.local` and set values (including `NEXT_PUBLIC_BASE_URL`).
3. Create database and apply `db.sql`. Seed at least one admin user.
4. Start dev server: `npm run dev` (default port 3000).
5. Build and run production: `npm run build && npm start`.

## 15. Deployment

Environments: Production and staging environments should be configured with strong secrets, HTTPS, and managed PostgreSQL.

Options:

- Vercel + Managed Postgres (e.g., Neon/Supabase)
  - Set env vars in project settings: `DB_URL`, `SESSION_SECRET`, Google OAuth, `NEXT_PUBLIC_BASE_URL`.
  - Import schema: apply `db.sql` on the managed database; seed an admin user.
  - Ensure Node.js runtime (Next.js 15) and Edge Middleware are supported (default on Vercel).

- Docker Compose (self-hosted)
  - Example (adjust volumes/secrets):
  ```yaml
  version: '3.9'
  services:
    db:
      image: postgres:15
      environment:
        POSTGRES_PASSWORD: example
        POSTGRES_DB: hrdb
      ports: ["5432:5432"]
      volumes:
        - pgdata:/var/lib/postgresql/data
    web:
      image: node:20
      working_dir: /app
      command: sh -c "npm ci && npm run build && npm start"
      environment:
        DB_URL: postgresql://postgres:example@db:5432/hrdb
        SESSION_SECRET: change-me
        NEXT_PUBLIC_BASE_URL: https://your-domain
      ports: ["3000:3000"]
      depends_on: [db]
      volumes:
        - ./:/app
  volumes:
    pgdata:
  ```
  - Apply `db.sql` to the `db` service (e.g., `docker exec -i <db> psql -U postgres -d hrdb < db.sql`).

- VM/Bare Metal with PM2 + Nginx
  - Install Node 20+, PostgreSQL (or use managed DB).
  - `npm ci && npm run build && pm2 start npm --name hrdb -- start`.
  - Terminate TLS at Nginx; proxy to `127.0.0.1:3000`.

Operational notes:

- Cookies: set `httpOnly: true`, `secure: true`, `sameSite: lax/strict` in production.
- Database: create least-privileged DB user; enable automated backups.
- Monitoring: enable logs aggregation and uptime checks; consider PostHog for analytics.
- Scaling: use connection pooling (e.g., PgBouncer) and horizontal scaling behind a reverse proxy.

## 15. Security Considerations

- Use a strong `SESSION_SECRET` and set `httpOnly`/`secure` on cookies in production.
- Enforce HTTPS in deployment environments.
- Consider adding a unique index on `hr_contacts.phone_number` to harden duplicate prevention.
- Validate all inputs with `zod` and sanitize outputs where appropriate.

## 16. Troubleshooting & Support

- Google login failing:
  - Check `NEXT_PUBLIC_BASE_URL`, OAuth credentials, and redirect URI.
- 401/403 on actions:
  - Ensure valid session and appropriate role.
- CSV import errors:
  - Confirm phone numbers are exactly 10 digits and headers match the template.

## 18. Future Technical Improvements

- Data layer and migrations
  - Adopt migrations tool (e.g., Drizzle Kit or Prisma Migrate) instead of manual `db.sql`.
  - Add DB constraints and indexes (unique `phone_number`, partial indexes on `status`, `volunteer_email`).
- Security & auth
  - Enforce `httpOnly` and `secure` cookies in prod; tighten `SameSite`.
  - Add rate limiting on API routes; centralize CSRF for mutating Server Actions.
  - Consider rotating session tokens or a short-lived access token + refresh strategy.
- Observability
  - Structured logging (request IDs), error reporting (Sentry), metrics (Prometheus/Grafana).
  - Add health/readiness endpoints for orchestration.
- Performance
  - Cursor-based pagination for large datasets; query optimization and indexes.
  - Caching strategies (HTTP caching, SWR/React Query, server-side caches).
  - Improve CSV ingestion via streaming or `COPY` when permitted.
- Product & UX
  - Accessibility (WCAG) pass; keyboard navigation; color contrast.
  - i18n and localization scaffolding.
  - Audit log of user actions for compliance.
- Tooling & QA
  - CI/CD (GitHub Actions) with tests (unit/integration/e2e via Playwright) and lint checks.
  - Codegen for types across API and DB (zod-to-ts, OpenAPI if exposing public APIs).

## 19. Appendix

Dependencies (selected): Next.js 15, React 19, `pg`, `jose`, `bcryptjs`, `zod`, `papaparse`, `posthog-js`, `recharts`, Radix UI.

License: Internal use by FORESE; update accordingly if open-sourcing.


