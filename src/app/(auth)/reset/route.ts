import { NextResponse, userAgent } from "next/server";
import { prisma } from "../../../lib/db";
import argon2 from "argon2";
import { resetSchema } from "@/zod/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, token, password } = resetSchema.parse(body);

        const vt = await prisma.verificationToken.findUnique({
            where: { identifier: email }
        });

        if (!vt || vt.token !== token || vt.expires < new Date()) {
            return NextResponse.json({
                error: 'Invalid or expired token'
            });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({
                error: 'User not found'
            });
        }

        const hashedPassword = await argon2.hash(password);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        await prisma.verificationToken.delete({
            where: { identifier: email }
        });

        await prisma.session.deleteMany({
            where: { userId: user.id }
        });

        return NextResponse.json(
            { ok: true }
        );
    } catch (error: any) {
        return NextResponse.json({
            error: error?.message || 'An error occurred'
        });
    }
}

        