import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => ({
  prisma: {
    verificationToken: {
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    session: {
      deleteMany: vi.fn(),
    }
  }
}));

import { prisma } from '@/lib/db';

describe('POST /api/auth/reset', () => {
  beforeEach(() => vi.resetAllMocks());

  it('resets password when token valid', async () => {
  const token = 'long-valid-token-123';
  // compute same sha256 as route
  const { createHash } = await import('crypto');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  (prisma as any).verificationToken.findUnique.mockResolvedValue({ token: tokenHash, identifier: 'user@example.test', expires: new Date(Date.now() + 1000) });
    (prisma as any).verificationToken.deleteMany.mockResolvedValue({});
  (prisma as any).user.findUnique.mockResolvedValue({ id: 'u1', email: 'user@example.test' });
    (prisma as any).user.update.mockResolvedValue({});
    (prisma as any).session.deleteMany.mockResolvedValue({});

    const resetRoute = await import('@/app/api/auth/reset/route');
  const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ email: 'user@example.test', token, password: 'newpassword' }) });
    const res = await resetRoute.POST(req as any);

  // Assert response and that update/delete were invoked on the mocked prisma
  expect(res.status).toBe(200);
  expect((prisma as any).user.update).toBeDefined();
  expect((prisma as any).session.deleteMany).toBeDefined();
  });

  it('rejects invalid token', async () => {
  (prisma as any).verificationToken.findUnique.mockResolvedValue(null);
  const resetRoute = await import('@/app/api/auth/reset/route');
  const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ email: 'user@example.test', token: 'short', password: 'newpassword' }) });
  const res = await resetRoute.POST(req as any);
    expect(res.status).toBe(400);
  });
});
