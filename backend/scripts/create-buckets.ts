import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function createBuckets() {
    // 1. Create product-images (public)
    const { data: d1, error: e1 } = await supabase.storage.createBucket('product-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
    });
    if (e1) {
        if (e1.message?.includes('already exists')) {
            console.log('✅ Bucket "product-images" already exists');
        } else {
            console.error('❌ Failed to create product-images:', e1.message);
        }
    } else {
        console.log('✅ Created bucket "product-images" (public)');
    }

    // 2. Create payment-proofs (private)
    const { data: d2, error: e2 } = await supabase.storage.createBucket('payment-proofs', {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
    });
    if (e2) {
        if (e2.message?.includes('already exists')) {
            console.log('✅ Bucket "payment-proofs" already exists');
        } else {
            console.error('❌ Failed to create payment-proofs:', e2.message);
        }
    } else {
        console.log('✅ Created bucket "payment-proofs" (private)');
    }

    // List all buckets to confirm
    const { data: buckets } = await supabase.storage.listBuckets();
    console.log('\nAll storage buckets:');
    buckets?.forEach(b => console.log(`  - ${b.name} (${b.public ? 'public' : 'private'})`));
}

createBuckets().catch(console.error);
