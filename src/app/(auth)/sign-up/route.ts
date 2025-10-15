import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import argon2 from 'argon2';
import { registerSchema } from '@/zod/auth';
import { email } from 'zod';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsedData = registerSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email: parsedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        const passwordHash = await argon2.hash(parsedData.password, { type: argon2.argon2id });

        const newUser = await prisma.user.create({
            data: {
                email: parsedData.email,
                name: parsedData.name,
                passwordHash: passwordHash,
                role: 'user',
            },
        });

        return NextResponse.json({
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || 'Internal Server Error',
        }, { status: 400 }
        );
    }
}