import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { randomBytes, createHash } from 'crypto';
import { requestResetSchema } from '@/zod/auth';
import { sendResetEmail } from '@/lib/mailer';
import { validateRequest } from '@/lib/validate';

export async function POST(request: Request) {
  try {
  const body = await request.json();
  const { email } = await validateRequest(body, requestResetSchema);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ ok: true }); // do not reveal

  const token = randomBytes(32).toString('hex');
  // store only a hash of the token in the database
  const tokenHash = createHash('sha256').update(token).digest('hex');
    // expire in 60 minutes
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    // Delete any existing tokens for this identifier and create a new one.
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({ data: { identifier: email, token: tokenHash, expires } });

  const resetUrl = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/auth/reset?token=${token}&email=${encodeURIComponent(email)}`;
    await sendResetEmail({ to: email, resetUrl });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Invalid data' }, { status: 400 });
  }
}
