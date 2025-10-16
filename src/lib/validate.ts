import { ZodSchema } from 'zod';
import { NextResponse } from 'next/server';

/**
 * Validate a parsed JSON body against a Zod schema and return typed data.
 * On validation errors, throws a 422 NextResponse with details.
 */
export async function validateRequest<T>(body: any, schema: ZodSchema<T>): Promise<T> {
  try {
    return schema.parse(body);
  } catch (err: any) {
    const formatted = err?.format ? err.format() : { _errors: [err?.message ?? 'Invalid'] };
    throw NextResponse.json({ errors: formatted }, { status: 422 });
  }
}

export default validateRequest;
