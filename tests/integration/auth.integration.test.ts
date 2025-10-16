import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

// This integration test assumes a Postgres instance is available and
// TEST_DATABASE_URL is set. It's meant to run in CI or locally with docker-compose.

describe('integration: auth flows', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    // Prefer explicit TEST_DATABASE_URL but fall back to DATABASE_URL for CI parity
    if (!process.env.TEST_DATABASE_URL && !process.env.DATABASE_URL) {
      throw new Error('TEST_DATABASE_URL or DATABASE_URL must be set for integration tests');
    }

    // If TEST_DATABASE_URL is set, make sure Prisma reads it via DATABASE_URL too
    if (process.env.TEST_DATABASE_URL && !process.env.DATABASE_URL) {
      process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    }

    // If only DATABASE_URL is set, expose it as TEST_DATABASE_URL for test helpers
    if (!process.env.TEST_DATABASE_URL && process.env.DATABASE_URL) {
      process.env.TEST_DATABASE_URL = process.env.DATABASE_URL;
    }

    // Run prisma migrate deploy to ensure schema exists
    execSync('npx prisma migrate deploy', { stdio: 'inherit', env: { ...process.env } });

    prisma = new PrismaClient({});
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('can create and find a user', async () => {
    const email = `it+${Date.now()}@example.test`;
    const u = await prisma.user.create({ data: { email, passwordHash: 'x', role: 'user' } });
    const found = await prisma.user.findUnique({ where: { id: u.id } });
    expect(found).toBeTruthy();
    // cleanup
    await prisma.user.delete({ where: { id: u.id } });
  });
});
