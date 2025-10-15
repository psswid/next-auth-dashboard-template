import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';
import addMinutes from 'date-fns/addMinutes';
import { requestResetSchema } from '@/zod/auth';
import { sendResetEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = requestResetSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ ok: true }); // do not reveal

    const token = randomBytes(32).toString('hex');
    const expires = addMinutes(new Date(), 60);

    await prisma.verificationToken.upsert({
      where: { identifier: email },
      update: { token, expires },
      create: { identifier: email, token, expires },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/auth/reset?token=${token}&email=${encodeURIComponent(email)}`;
    await sendResetEmail({ to: email, resetUrl });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Invalid data' }, { status: 400 });
  }
}
