import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import argon2 from 'argon2';
import { resetSchema } from '@/zod/auth';
import { createHash } from 'crypto';
import { validateRequest } from '@/lib/validate';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token, password } = await validateRequest(body, resetSchema);

    // Hash incoming token and find token record
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const record = await prisma.verificationToken.findUnique({ where: { token: tokenHash } });
    if (!record || record.identifier !== email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Check expiry
    if (record.expires < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    // Update user's password (use argon2id)
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    await prisma.user.update({ where: { email }, data: { passwordHash } });

    // Delete any active sessions for the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.session.deleteMany({ where: { userId: user.id } });
    }

    // Remove used verification tokens
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Invalid request' }, { status: 400 });
  }
}
