import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { randomBytes } from "crypto";
import addMinutes from "date-fns/addMinutes";
import { requestResetSchema } from "@/zod/auth";
import { sendResetEmail } from "@/lib/mailer";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = requestResetSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { ok: true}
            );
        }

        const token = randomBytes(32).toString("hex");
        const expiresAt = addMinutes(new Date(), 15); // Token valid for 15 minutes

        await prisma.verificationToken.upsert({
            where: { identifier: email },
            update: { token, expiresAt },
            create: {
                identifier: email,
                token,
                expiresAt
            }
        });

        const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

        await sendResetEmail({ to: email, resetUrl });

        return NextResponse.json(
            { ok: true }
        );
    } catch (error: any) {
        return NextResponse.json({
            error: error?.message || 'An error occurred'
        });
    }
}