import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
    const users = await prisma.user.findMany({
        select: { id: true, authId: true, email: true, name: true, role: true },
    });
    console.log('All users in database:');
    console.table(users);
    await prisma.$disconnect();
}

checkUsers().catch((e) => {
    console.error(e);
    process.exit(1);
});
