import { argon2d } from 'argon2';
import { prisma } from './prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { getServerSession, type NextAuthOptions } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import argon2 from 'argon2';
import { Session } from 'inspector/promises';
import { getServerSession as nextAuthGetServerSession } from 'next-auth/next';


export const authOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'database',
    },
    providers: [
        CredentialProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: { email?: string; password?: string } | undefined) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.passwordHash) {
                    return null;
                }
                if (!user.isActive) {
                    return null;
                }

                const ok = await argon2.verify(user.passwordHash, credentials.password);
                if (!ok) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                } as any;
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            const dbUser = await prisma.user.findUnique({
                where: { id: user?.id as string }
            });
            if (dbUser) {
                (session as Session & { user: any }).user = {
                    ...session.user,
                    id: dbUser.id,
                    isActive: dbUser.isActive,
                };
            }
            return session;
        }
    },
    cookies: {
        // Define your cookie options here
        sessionToken: {
            name: 'next_auth.session_token',
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
} as NextAuthOptions;

export const getServerAuthSession = ( ...args: Parameters<typeof getServerSession>) => {
    nextAuthGetserverSession(...args);
}

export default authOptions;