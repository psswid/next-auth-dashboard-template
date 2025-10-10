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
3. Run migrations/seeds: `pnpm prisma migrate deploy && pnpm prisma db seed`
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

## See Also

- [Next.js 15 Docs](https://nextjs.org/docs/app/guides/upgrading/version-15?utm_source=chatgpt.com)
- [Tailwind v4 Upgrade](https://tailwindcss.com/docs/upgrade-guide?utm_source=chatgpt.com)
- [shadcn/ui](https://ui.shadcn.com/docs/installation/next)
- [MailHog](https://github.com/mailhog/MailHog?utm_source=chatgpt.com)
- [Node.js LTS](https://endoflife.date/nodejs?utm_source=chatgpt.com)
