import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import argon2 from "argon2";
import { registerSchema } from "@/zod/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = registerSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await argon2.hash(data.password, { type: argon2.argon2id });

        const newUser = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                name: data.name,
                role: 'user'
            },
        });

        return NextResponse.json({
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            message: error?.message || 'Internal Server Error'
        }, { status: 400 });
    }
}