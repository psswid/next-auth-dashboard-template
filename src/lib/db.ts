import { PrismaClient } from '@prisma/client';

declare global {
  // prevent multiple instances during HMR / ts-node runs
  // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined;
}


export const prisma: PrismaClient = 
    global.__prisma ?? new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV === 'development' && !global.__prisma) {
    global.__prisma = prisma;
}