import { PrismaClient, Role } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // ── Seed Categories ──
    const categories = [
        { name: 'Casual', description: 'Comfortable everyday abayas for daily wear' },
        { name: 'Formal', description: 'Elegant abayas for special occasions and events' },
        { name: 'Embroidered', description: 'Beautifully embroidered abayas with intricate detailing' },
        { name: 'Plain', description: 'Minimalist abayas with clean simple designs' },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: slugify(cat.name, { lower: true, strict: true }) },
            update: {},
            create: {
                name: cat.name,
                slug: slugify(cat.name, { lower: true, strict: true }),
                description: cat.description,
            },
        });
    }

    console.log(`✅ Seeded ${categories.length} categories`);

    // ── Seed Admin User ──
    // NOTE: The admin user must first be registered via Supabase Auth.
    // Then update this seed with the correct authId from Supabase.
    // For initial setup, this creates a placeholder record.
    const adminAuthId = process.env.ADMIN_AUTH_ID;

    if (adminAuthId) {
        await prisma.user.upsert({
            where: { authId: adminAuthId },
            update: { role: Role.ADMIN },
            create: {
                authId: adminAuthId,
                email: process.env.ADMIN_EMAIL || 'admin@alora-abayas.com',
                name: 'Alora Admin',
                role: Role.ADMIN,
            },
        });
        console.log('✅ Seeded admin user');
    } else {
        console.log('⚠️  Skipping admin seed — set ADMIN_AUTH_ID env var');
    }

    // ── Seed Sample Products ──
    const casualCategory = await prisma.category.findUnique({
        where: { slug: 'casual' },
    });
    const formalCategory = await prisma.category.findUnique({
        where: { slug: 'formal' },
    });
    const embroideredCategory = await prisma.category.findUnique({
        where: { slug: 'embroidered' },
    });
    const plainCategory = await prisma.category.findUnique({
        where: { slug: 'plain' },
    });

    if (casualCategory && formalCategory && embroideredCategory && plainCategory) {
        const products = [
            {
                name: 'Classic Black Everyday Abaya',
                description: 'A timeless black abaya perfect for daily wear. Features a comfortable loose fit with elegant draping and subtle detailing at the cuffs.',
                price: 1200,
                stock: 50,
                categoryId: casualCategory.id,
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['Black'],
                material: 'Premium Nida fabric',
                featured: true,
            },
            {
                name: 'Navy Blue Casual Abaya',
                description: 'Comfortable navy blue abaya with a modern cut. Perfect for everyday activities with its breathable fabric and practical design.',
                price: 1150,
                stock: 40,
                categoryId: casualCategory.id,
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                colors: ['Navy', 'Dark Blue'],
                material: 'Soft Crepe',
                featured: false,
            },
            {
                name: 'Elegant Black Formal Abaya',
                description: 'Sophisticated black formal abaya with delicate lace trim along the front opening. Perfect for special occasions and formal events.',
                price: 2500,
                stock: 25,
                categoryId: formalCategory.id,
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['Black'],
                material: 'Premium Chiffon with lace',
                featured: true,
            },
            {
                name: 'Royal Blue Formal Abaya',
                description: 'Stunning royal blue abaya with pearl embellishments on the sleeves. Makes a statement at weddings and celebrations.',
                price: 2800,
                stock: 15,
                categoryId: formalCategory.id,
                sizes: ['M', 'L', 'XL'],
                colors: ['Royal Blue', 'Sapphire'],
                material: 'Silk blend with pearl details',
                featured: true,
            },
            {
                name: 'Black Embroidered Abaya with Floral Pattern',
                description: 'Beautiful black abaya featuring intricate floral embroidery along the front and sleeves.',
                price: 2200,
                stock: 30,
                categoryId: embroideredCategory.id,
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['Black'],
                material: 'Nida with silk embroidery',
                featured: true,
            },
            {
                name: 'Simple Black Plain Abaya',
                description: 'Minimalist black abaya with clean lines and no embellishments. Perfect for those who prefer understated elegance.',
                price: 950,
                stock: 75,
                categoryId: plainCategory.id,
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                colors: ['Black'],
                material: 'Basic Nida fabric',
                featured: false,
            },
        ];

        for (const prod of products) {
            const slug = slugify(prod.name, { lower: true, strict: true });
            await prisma.product.upsert({
                where: { slug },
                update: {},
                create: {
                    ...prod,
                    slug,
                },
            });
        }

        console.log(`✅ Seeded ${products.length} products`);
    }

    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
