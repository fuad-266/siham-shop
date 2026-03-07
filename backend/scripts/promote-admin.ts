import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteAdmin() {
    const email = 'sharafafuad54@gmail.com';

    // Find the user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error(`❌ User with email ${email} not found in the database.`);
        console.log('Available users:');
        const allUsers = await prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true },
        });
        console.table(allUsers);
        await prisma.$disconnect();
        process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email}) — current role: ${user.role}`);

    // Update role to ADMIN
    const updated = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
    });

    console.log(`✅ User ${updated.email} promoted to ADMIN in the database.`);
    console.log('');
    console.log('⚠️  IMPORTANT: You also need to set user_metadata.role = "ADMIN" in Supabase Dashboard:');
    console.log('   1. Go to Authentication → Users');
    console.log('   2. Click on the user');
    console.log('   3. Edit "User Metadata" and set: { "role": "ADMIN" }');

    await prisma.$disconnect();
}

promoteAdmin().catch((e) => {
    console.error(e);
    process.exit(1);
});
