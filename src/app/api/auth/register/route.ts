import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import argon2 from 'argon2';
import { registerSchema } from '@/zod/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: 'User exists' }, { status: 400 });

    const passwordHash = await argon2.hash(data.password, { type: argon2.argon2id });
    const user = await prisma.user.create({ data: { email: data.email, name: data.name, passwordHash, role: 'user' } });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Invalid data' }, { status: 400 });
  }
}
