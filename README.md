## FORESE HR Database

A role-based HR contacts management app for FORESE for organising the Mock Placements. Admins, incharges, and volunteers can securely log in, manage HR contacts, analyze outreach progress, and upload bulk contacts via CSV. The app is built on Next.js App Router with a PostgreSQL backend and modern UI components.

### Features
- **Authentication**: Email/password and Google OAuth 2.0.
- **Role-based authorization (RBAC)**: `admin`, `incharge`, `volunteer` with server-side enforcement.
- **HR contacts CRUD**:
  - Add new HR contacts (assignment rules differ by role)
  - Edit and delete with permission checks
  - Copy-to-clipboard for email/phone
- **Search and filters**: Global search plus specific filters (name, phone, interview mode, status).
- **Pagination**: Efficient pagination with totals.
- **CSV upload**: Validate and upload contacts in bulk, detect duplicates by phone number, and export duplicates.
- **Dashboards**:
  - Admin: Incharge-overview and status distribution
  - Incharge: Member distribution and status charts
  - Member: Personal status distribution
- **Analytics**: PostHog stats and bugs/errors tracking.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui (Radix UI primitives)
- **Validation**: `zod`
- **Charts**: `recharts`
- **Auth/session**: `jose` (JWT), `bcryptjs`
- **Database**: PostgreSQL (`pg` client), SQL queries
- **Analytics**: `posthog-js`

### Environment Variables
Create a `.env.local` in the project root. You can start from `example.env`.

```bash
DB_URL=postgresql://USER:PASS@HOST:PORT/DBNAME
SESSION_SECRET="a-strong-random-secret"

# App/URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=

# Google OAuth (optional but supported)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Notes:
- `NEXT_PUBLIC_BASE_URL` is required for Google OAuth redirects.
- Leave `NEXT_PUBLIC_POSTHOG_KEY` empty to disable analytics locally.

### Database
PostgreSQL schema is provided in `db.sql` with two tables:
- `users`: email-unique users with `role` in {admin, incharge, volunteer}, optional `incharge_email` for volunteers.
- `hr_contacts`: HR records linked via `volunteer_email` to `users.email`.

### Setup & Run
Prerequisites: Node.js 18.18+ (or 20+), PostgreSQL 13+.

```bash
git clone <this-repo>
cd hr-database
cp example.env .env.local   # fill values as needed
npm install
# Ensure your DB is created and db.sql applied, and admin user seeded
npm run dev
```

Open `http://localhost:3000`. You’ll be redirected to `Login` from `Welcome` for protected areas. Log in with your seeded admin or any valid user.

Production build:

```bash
npm run build
npm start
```

### Authentication & Authorization
Auth supports two modes:
- **Email/Password**: Checked against the `users` table. Passwords are stored as bcrypt hashes.
- **Google OAuth**: Starts at `/api/auth/google/start`, completes at `/api/auth/google/callback`, verifies the ID token, and logs in users that already exist in the database (no auto-provisioning).

Sessions are JWT-based using `jose` and stored in a `session` cookie.

Route protection:
- Middleware restricts unauthenticated access to key routes (e.g., `/`, `/add-hr`, `/edit-hr`, `/hr-pitch`). Admin-only paths like `/add-user` are enforced.
- Server-side actions enforce role checks for all data operations. Examples:
  - Volunteers only see and modify their own contacts
  - Incharges see/manage contacts of their volunteers
  - Admins have full access

Google OAuth setup:
- Create an OAuth 2.0 Client (Web) in Google Cloud Console
- Authorized redirect URI: `${NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`
- Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `NEXT_PUBLIC_BASE_URL`

### CSV Upload
- Upload a CSV with headers (template available in the UI)
- Validates required fields and phone format
- Prevents duplicates by phone number and lets you download duplicates report

### Scripts
- `npm run dev` — start dev server on port 3000
- `npm run build` — production build
- `npm start` — start production server
- `npm run lint` — run linting (if configured)

### Project Structure (high level)
- `src/app` — Next.js App Router pages, middleware, API routes
- `src/components` — UI components (tables, forms, stats, CSV upload)
- `src/lib` — database pool, server actions, validation schemas, session helpers
- `db.sql` — PostgreSQL schema

### Troubleshooting
- Cannot log in with Google: Ensure `NEXT_PUBLIC_BASE_URL`, OAuth credentials, and redirect URI are correct.
- 401/Unauthorized on actions: Verify you’re logged in and your user has the correct role.
- CSV errors: Use the UI template and ensure phone numbers are exactly 10 digits.


