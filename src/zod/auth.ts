import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100, 'Name must be at most 100 characters long'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const requestResetSchema = z.object({
  email: z.string().email(),
});

export const resetSchema = z.object({
  email: z.string().email(),
  token: z.string().min(10),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});