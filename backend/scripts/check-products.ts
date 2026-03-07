import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProducts() {
    const products = await prisma.product.findMany({
        select: { id: true, name: true, isActive: true, stock: true, deletedAt: true },
    });
    console.log(`Found ${products.length} products:`);
    console.table(products);

    const categories = await prisma.category.findMany({
        select: { id: true, name: true, slug: true, isActive: true },
    });
    console.log(`Found ${categories.length} categories:`);
    console.table(categories);

    await prisma.$disconnect();
}

checkProducts().catch((e) => {
    console.error(e);
    process.exit(1);
});
