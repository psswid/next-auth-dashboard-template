# NextJS Auth + Dashboard + User Management Template

**A production-lean, reusable boilerplate** for building SaaS / admin-style apps  
(inspired by Laravel structure, built with Next.js 15 + TypeScript + Tailwind)

---

## Table of Contents

1. [Why This Template](#why-this-template)  
2. [Tech Stack & Versions](#tech-stack--versions)  
3. [Project Structure](#project-structure)  
4. [Setup & Development](#setup--development)  
   - Prerequisites  
   - Docker / local services  
   - Environment variables  
   - Running migrations & seeding  
   - Starting dev server  
5. [Feature Overview](#feature-overview)  
   - Authentication  
   - RBAC / Authorization  
   - Dashboard & User Management  
   - Security (rate limiting, CSP, headers)  
6. [Laravel → Next Mapping](#laravel-→-next-mapping)  
7. [Testing](#testing)  
8. [CI / Quality Checks](#ci--quality-checks)  
9. [Branch: Auth.js v5 Beta](#branch-authjs-v5-beta)  
10. [Roadmap & Extensibility](#roadmap--extensibility)  
11. [Troubleshooting / FAQs](#troubleshooting--faqs)  
12. [License](#license)  

---

## Why This Template

Brief pitch: This template gives you a “ship-fast” starting point for web apps needing auth, RBAC, admin dashboards, and user management. You don’t waste weeks wiring boilerplate.

---

## Tech Stack & Versions

- Node.js **22 LTS** (with upgrade notes to 24)  
- Next.js **15.x**  
- React **19**  
- TypeScript **5.9.x**  
- Tailwind CSS **v4** + shadcn/ui  
- Prisma **6.x** + PostgreSQL  
- NextAuth.js **v4** (with adapter)  
- CASL **v6** for RBAC  
- Zod for input validation  
- Upstash Rate Limit for API endpoints  
- Nodemailer + MailHog (dev)  
- Vitest for unit tests, Playwright for e2e  

---

## Project Structure

(Insert ASCII tree + brief explanation, similar to above.)

---

## Setup & Development

### Prerequisites

- Docker & Docker Compose  
- Node.js 22 installed  
- pnpm / yarn / npm (we use `pnpm` in examples)

### Local Services (via Docker)

We include a `docker-compose.yml` that brings up:

- PostgreSQL  
- MailHog (SMTP and web UI)  

Start services:

```bash
docker compose up -d
