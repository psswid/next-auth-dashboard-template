import { NextResponse } from 'next/server';
import { prisma } from './db';
import { getServerSession as nextAuthGetServerSession } from 'next-auth/next';
import authOptions from './auth';

/**
 * Return the current user from the server session, or null.
 * Acts like Laravel's auth()->user() in server code.
 */
export async function getCurrentUser(req?: Request | any, res?: any) {
  const session = await nextAuthGetServerSession(req, res, authOptions as any);
  if (!(session as any)?.user?.email) return null;
  const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } });
  return user;
}

/**
 * Require an authenticated user; returns the full user record or throws a redirect to sign-in.
 * Laravel analogy: middleware 'auth'.
 */
export async function requireUser(req?: Request | any, res?: any) {
  const user = await getCurrentUser(req, res);
  if (!user) {
    // For server components/pages, throw a redirect to the sign-in page
    throw NextResponse.redirect('/auth/sign-in');
  }
  if (!user.isActive) {
    // If the account is disabled, throw a 403 Response
    throw new Response('Account disabled', { status: 403 });
  }
  return user;
}

export default getCurrentUser;
