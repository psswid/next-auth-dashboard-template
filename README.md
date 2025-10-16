# Next.js 15 Auth + Dashboard + User Management Template

## Quick Start

```bash
pnpm install
cp .env.example .env.local
docker compose up -d
pnpm dev
```

## Stack

- **Node.js 22 LTS** (see upgrade notes for Node 24)
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript 5.9**
- **Tailwind CSS v4** + **shadcn/ui**
- **PostgreSQL + Prisma 6**
- **NextAuth.js v4** (DB sessions, Prisma adapter)
- **CASL v6** (RBAC)
- **Zod** (validation)
- **Upstash Ratelimit** (rate limiting)
- **Nodemailer** (MailHog for dev email)
- **Vitest** (unit), **Playwright** (e2e)

## Docker Compose

- `db`: Postgres 15
- `mailhog`: SMTP testing (http://localhost:8025)
- `pgadmin`: DB browser (http://localhost:5050, admin@local.dev/admin)

## Laravel Mapping

| Laravel Concept      | Next.js/Stack Equivalent                |
|----------------------|-----------------------------------------|
| Controller           | Route handler (`route.ts`)              |
| Middleware           | `middleware.ts` + server actions        |
| Policies/Guards      | CASL abilities (server & UI)            |
| FormRequest          | Zod schemas                             |
| Service Container    | File-scoped modules in `src/lib/`       |

## Setup Steps

1. Clone repo, install deps, copy `.env.example` to `.env.local`.
2. Start Docker: `docker compose up -d`
3. Run migrations/seeds: `pnpm exec prisma generate  && pnpm exec prisma migrate dev --name init && pnpm exec tsx prisma/seed.ts`
4. Start dev server: `pnpm dev`
5. Access MailHog at [localhost:8025](http://localhost:8025), pgAdmin at [localhost:5050](http://localhost:5050).

## Upgrade to Node 24 LTS

- Update `.nvmrc` to `24`

---

## Node 24 LTS Upgrade Checklist

1. Update `.nvmrc` to `24`
2. Run `nvm install 24 && nvm use`
3. Update `package.json` engines field if pinned
4. Test app locally, check for deprecation warnings
5. Confirm all dependencies support Node 24
6. Update CI config if needed
- Run `nvm install 24 && nvm use`
- Update `package.json` engines if needed
- Test app, check for deprecation warnings
- Confirm all dependencies support Node 24

## Decisions & Trade-offs

- **NextAuth v4** is stable; **Auth.js v5** is in `authjs-v5-beta` branch.
- **CASL** for RBAC: flexible, works server & client.
- **Prisma** for type-safe DB.
- **MailHog** for safe local email testing.

## Tests

- Unit: `pnpm test` (Vitest)
- E2E: `pnpm exec playwright test`

## Integration tests

This project includes an isolated ephemeral Postgres configuration for integration tests.

- Test compose file: `docker-compose.test.yml` (Postgres mapped to host port 5433)
- Useful npm scripts:
	- `npm run integration:db:up` — start ephemeral test DB
	- `npm run integration:reset` — reset test DB (runs `prisma migrate reset` against the test DB)
	- `npm run integration:run` — full flow: start test DB, wait for it, run migrations, run integration tests, and teardown

Local quick-start:

```bash
# start ephemeral test DB
npm run integration:db:up

# run tests (the scripts set TEST_DATABASE_URL to the test DB)
npm run integration:run

# or run step-by-step
PGPORT=5433 ./scripts/wait-for-db.sh
export TEST_DATABASE_URL='postgresql://postgres:postgres@localhost:5433/app_db'
npx prisma migrate deploy
npx vitest run tests/integration --run

# teardown
npm run integration:db:down
```

Notes:
- The test DB maps to host port `5433` to avoid colliding with the default dev DB (5432).
- The `integration:run` npm script uses a custom compose project (`-p integration-test`) so it won't try to remove your dev network when tearing down.
- Don't run `integration:reset` against your development DB — it's destructive by design and intended for the ephemeral test DB.

Environment files
-----------------

This repo provides multiple env files to make local host development and containerized development easier:

- `.env` — for host-local development. Uses `localhost` for services (e.g., `DATABASE_URL` points at `localhost:5432`, `MAIL_HOST=localhost`).
- `.env.docker.local` — for running inside Docker Compose. Uses service hostnames (`db`, `mailhog`) so containers can resolve each other.
- `.env.example` — template you can copy when setting up a new environment.

When running the app on your laptop (dev server outside Docker), prefer `.env`. When running everything via `docker compose`, use `.env.docker.local`.

## See Also

- [Next.js 15 Docs](https://nextjs.org/docs/app/guides/upgrading/version-15?utm_source=chatgpt.com)
- [Tailwind v4 Upgrade](https://tailwindcss.com/docs/upgrade-guide?utm_source=chatgpt.com)
- [shadcn/ui](https://ui.shadcn.com/docs/installation/next)
- [MailHog](https://github.com/mailhog/MailHog?utm_source=chatgpt.com)
- [Node.js LTS](https://endoflife.date/nodejs?utm_source=chatgpt.com)
