import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    }
  }
}));

import { prisma } from '@/lib/db';

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('creates user when email not existing', async () => {
    // stub prisma methods
  (prisma as any).user.findUnique.mockResolvedValue(null);
  (prisma as any).user.create.mockResolvedValue({ id: 'u1', email: 'user@example.test', name: 'Alice' });

  const registerRoute = await import('@/app/api/auth/register/route');
  const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ email: 'user@example.test', password: 'password123', name: 'Alice' }) });
    const res = await registerRoute.POST(req as any);

  // Assert response
  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json.ok).toBe(true);
  });

  it('returns 409 when email exists', async () => {
  (prisma as any).user.findUnique.mockResolvedValue({ id: 'u1', email: 'user@example.test' });

  const registerRoute = await import('@/app/api/auth/register/route');
  const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ email: 'user@example.test', password: 'password123', name: 'Alice' }) });
    const res = await registerRoute.POST(req as any);

  // Assert response
  expect(res.status).toBe(409);
  });
});
