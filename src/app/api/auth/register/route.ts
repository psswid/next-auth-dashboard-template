import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import argon2 from 'argon2';
import { registerSchema } from '@/zod/auth';
import { validateRequest } from '@/lib/validate';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = await validateRequest(body, registerSchema);

    // prevent duplicate registrations
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        passwordHash,
      },
      select: { id: true, email: true, name: true },
    });

    // Optionally: send welcome email or create audit log

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err: any) {
    // validateRequest already throws NextResponse for 422
    return NextResponse.json({ error: err?.message ?? 'Invalid request' }, { status: 400 });
  }
}
