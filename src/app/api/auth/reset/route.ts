import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import argon2 from 'argon2';
import { resetSchema } from '@/zod/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token, password } = resetSchema.parse(body);

    // Find by token and identifier (Prisma schema uses @@unique([identifier, token]))
    const vt = await prisma.verificationToken.findFirst({ where: { identifier: email, token } });
    if (!vt || vt.expires < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const hash = await argon2.hash(password, { type: argon2.argon2id });
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });

    // Remove any tokens for this identifier
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    // Invalidate sessions for safety
    await prisma.session.deleteMany({ where: { userId: user.id } });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Invalid data' }, { status: 400 });
  }
}
