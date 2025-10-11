import 'dotenv/config'
import { prisma } from '../src/lib/db'
import { hashPassword } from '../src/lib/password'

async function main() {
    const email = process.env.ADMIN_EMAIL ?? 'admin@local.dev'
    const password = process.env.ADMIN_PASSWORD ?? 'password123'

    console.log(`Seeding admin user with email: ${email}`)

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            passwordHash,
            role: 'admin',
            isActive: true
        },
    })

    await prisma.auditLog.create({
        data: {
            userId: user.id,
            action: 'seeded admin user',
            meta: { seededEmail: email },
        },
    })

    console.log('Seed finished')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })