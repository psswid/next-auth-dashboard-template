import argon2 from 'argon2';

const DEFAULT_OPTIONS: argon2.Options & { type?: number } = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 MB
  timeCost: 5,
  parallelism: 1,
};

export async function hashPassword(plain: string) {
    return argon2.hash(plain, DEFAULT_OPTIONS);
}

export async function verifyPassword(hash: string, plain: string) {
    try {
        return await argon2.verify(hash, plain, DEFAULT_OPTIONS);
    } catch {
        return false;
    }
}