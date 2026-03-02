/**
 * Mock Product Data for Alora Abayas
 * 
 * This file contains sample abaya products for the e-commerce application.
 * Requirements: 1.1, 1.4
 */

import { Product } from '../types/models';

export const products: Product[] = [
  // Casual Abayas
  {
    id: 'abaya-001',
    name: 'Classic Black Everyday Abaya',
    description: 'A timeless black abaya perfect for daily wear. Features a comfortable loose fit with elegant draping and subtle detailing at the cuffs.',
    price: 1200,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&crop=top',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    category: 'casual',
    material: 'Premium Nida fabric',
    careInstructions: 'Machine wash cold, hang dry, iron on low heat',
    inStock: true,
    featured: true
  },
  {
    id: 'abaya-002',
    name: 'Navy Blue Casual Abaya',
    description: 'Comfortable navy blue abaya with a modern cut. Perfect for everyday activities with its breathable fabric and practical design.',
    price: 1150,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800',
      'https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&crop=top',
      'https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Dark Blue'],
    category: 'casual',
    material: 'Soft Crepe',
    careInstructions: 'Hand wash or gentle machine cycle, air dry',
    inStock: true,
    featured: false
  },
  {
    id: 'abaya-003',
    name: 'Burgundy Casual Abaya',
    description: 'Rich burgundy colored abaya with a relaxed fit. Features side pockets and a matching belt for added style and convenience.',
    price: 1300,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&crop=top',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&crop=bottom'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Burgundy', 'Wine Red'],
    category: 'casual',
    material: 'Nida fabric',
    careInstructions: 'Machine wash cold, tumble dry low',
    inStock: true,
    featured: false
  },
  {
    id: 'abaya-004',
    name: 'Olive Green Casual Abaya',
    description: 'Modern olive green abaya with a contemporary silhouette. Lightweight and comfortable for all-day wear.',
    price: 1250,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&crop=top',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Olive Green', 'Sage'],
    category: 'casual',
    material: 'Cotton blend',
    careInstructions: 'Machine wash warm, hang dry',
    inStock: true,
    featured: false
  },
  {
    id: 'abaya-005',
    name: 'Charcoal Grey Casual Abaya',
    description: 'Versatile charcoal grey abaya with minimalist design. Perfect for work or casual outings.',
    price: 1180,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&crop=top',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal', 'Grey'],
    category: 'casual',
    material: 'Polyester blend',
    careInstructions: 'Machine wash cold, low heat dry',
    inStock: true,
    featured: true
  },

  // Formal Abayas
  {
    id: 'abaya-006',
    name: 'Elegant Black Formal Abaya',
    description: 'Sophisticated black formal abaya with delicate lace trim along the front opening. Perfect for special occasions and formal events.',
    price: 2500,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&crop=top',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    category: 'formal',
    material: 'Premium Chiffon with lace',
    careInstructions: 'Dry clean only',
    inStock: true,
    featured: true
  },
  {
    id: 'abaya-007',
    name: 'Royal Blue Formal Abaya',
    description: 'Stunning royal blue abaya with pearl embellishments on the sleeves. Makes a statement at weddings and celebrations.',
    price: 2800,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&crop=top',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&crop=bottom'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Royal Blue', 'Sapphire'],
    category: 'formal',
    material: 'Silk blend with pearl details',
    careInstructions: 'Dry clean recommended, hand wash with care',
    inStock: true,
    featured: true
  },
  {
    id: 'abaya-008',
    name: 'Emerald Green Formal Abaya',
    description: 'Luxurious emerald green abaya with gold thread detailing. Elegant and eye-catching for formal gatherings.',
    price: 3200,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&crop=top',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Emerald', 'Forest Green'],
    category: 'formal',
    material: 'Velvet with gold embroidery',
    careInstructions: 'Dry clean only',
    inStock: true,
    featured: false
  },
  {
    id: 'abaya-009',
    name: 'Champagne Formal Abaya',
    description: 'Elegant champagne colored abaya with sequin detailing. Perfect for evening events and celebrations.',
    price: 2900,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=800',
      'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=800&crop=top',
      'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Champagne', 'Gold'],
    category: 'formal',
    material: 'Satin with sequins',
    careInstructions: 'Dry clean only, store in garment bag',
    inStock: true,
    featured: false
  },
  {
    id: 'abaya-010',
    name: 'Plum Purple Formal Abaya',
    description: 'Rich plum purple abaya with crystal embellishments. Sophisticated design for special occasions.',
    price: 3000,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&crop=top',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&crop=bottom'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Plum', 'Purple'],
    category: 'formal',
    material: 'Premium Georgette with crystals',
    careInstructions: 'Dry clean only',
    inStock: true,
    featured: false
  },

  // Embroidered Abayas
  {
    id: 'abaya-011',
    name: 'Black Embroidered Abaya with Floral Pattern',
    description: 'Beautiful black abaya featuring intricate floral embroidery along the front and sleeves. A perfect blend of tradition and elegance.',
    price: 2200,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea1f5e82?w=800',
      'https://images.unsplash.com/photo-1558769132-cb1aea1f5e82?w=800&crop=top',
      'https://images.unsplash.com/photo-1558769132-cb1aea1f5e82?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    category: 'embroidered',
    material: 'Nida with silk embroidery',
    careInstructions: 'Hand wash cold, air dry, iron inside out',
    inStock: true,
    featured: true
  },
  {
    id: 'abaya-012',
    name: 'Navy Embroidered Abaya with Silver Thread',
    description: 'Navy blue abaya adorned with silver thread embroidery creating geometric patterns. Elegant and versatile.',
    price: 2400,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&crop=top',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Midnight Blue'],
    category: 'embroidered',
    material: 'Crepe with metallic embroidery',
    careInstructions: 'Hand wash recommended, dry flat',
    inStock: true,
    featured: false
  },
  {
    id: 'abaya-013',
    name: 'Maroon Embroidered Abaya with Gold Details',
    description: 'Rich maroon abaya with gold embroidered details on the chest and cuffs. Perfect for festive occasions.',
    price: 2600,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&crop=top',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&crop=bottom'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Maroon', 'Burgundy'],
    category: 'embroidered',
    material: 'Velvet with gold thread',
    careInstructions: 'Dry clean recommended',
    inStock: true,
    featured: true
  },
  {
    id: 'abaya-014',
    name: 'Grey Embroidered Abaya with Pearl Accents',
    description: 'Sophisticated grey abaya with delicate pearl and bead embroidery. Subtle elegance for any occasion.',
    price: 2350,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&crop=top',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Grey', 'Silver Grey'],
    category: 'embroidered',
    material: 'Chiffon with pearl details',
    careInstructions: 'Hand wash cold, hang dry',
    inStock: true,
    featured: false
  },
  {
    id: 'abaya-015',
    name: 'Brown Embroidered Abaya with Beige Stitching',
    description: 'Warm brown abaya featuring beige embroidered patterns. Comfortable and stylish for everyday elegance.',
    price: 2100,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&crop=top',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Brown', 'Chocolate'],
    category: 'embroidered',
    material: 'Cotton blend with embroidery',
    careInstructions: 'Machine wash cold, tumble dry low',
    inStock: true,
    featured: false
  },

  // Plain Abayas
  {
    id: 'abaya-016',
    name: 'Simple Black Plain Abaya',
    description: 'Minimalist black abaya with clean lines and no embellishments. Perfect for those who prefer understated elegance.',
    price: 950,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800',
      'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&crop=top',
      'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    category: 'plain',
    material: 'Basic Nida fabric',
    careInstructions: 'Machine wash cold, tumble dry low',
    inStock: true,
    featured: false
  },
  {
    id: 'abaya-017',
    name: 'Beige Plain Abaya',
    description: 'Soft beige plain abaya with a comfortable fit. Versatile and easy to style for any occasion.',
    price: 980,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&crop=top',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Cream'],
    category: 'plain',
    material: 'Polyester',
    careInstructions: 'Machine wash warm, hang dry',
    inStock: true,
    featured: false
  },
  {
    id: 'abaya-018',
    name: 'White Plain Abaya',
    description: 'Pure white plain abaya with a flowing silhouette. Simple and elegant for everyday wear.',
    price: 1050,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800',
      'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&crop=top',
      'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Off-White'],
    category: 'plain',
    material: 'Cotton blend',
    careInstructions: 'Machine wash cold, bleach safe',
    inStock: true,
    featured: false
  },
  {
    id: 'abaya-019',
    name: 'Taupe Plain Abaya',
    description: 'Neutral taupe colored plain abaya. Practical and stylish for daily activities.',
    price: 920,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&crop=top',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&crop=bottom'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Taupe', 'Tan'],
    category: 'plain',
    material: 'Nida fabric',
    careInstructions: 'Machine wash cold, low heat dry',
    inStock: true,
    featured: false
  },
  {
    id: 'abaya-020',
    name: 'Dusty Rose Plain Abaya',
    description: 'Soft dusty rose plain abaya with a modern cut. Feminine and comfortable for all-day wear.',
    price: 1100,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&crop=top',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Dusty Rose', 'Blush Pink'],
    category: 'plain',
    material: 'Crepe',
    careInstructions: 'Hand wash cold, air dry',
    inStock: true,
    featured: false
  },

  // Additional Casual Abayas
  {
    id: 'abaya-021',
    name: 'Teal Casual Abaya with Belt',
    description: 'Vibrant teal abaya with a matching belt. Modern design with practical side pockets.',
    price: 1350,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&crop=top',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&crop=bottom'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Teal', 'Turquoise'],
    category: 'casual',
    material: 'Nida with belt',
    careInstructions: 'Machine wash cold, hang dry',
    inStock: true,
    featured: false
  },

  // Additional Formal Abaya
  {
    id: 'abaya-022',
    name: 'Midnight Black Formal Abaya with Cape',
    description: 'Dramatic midnight black abaya with an attached cape overlay. Statement piece for special events.',
    price: 3500,
    currency: 'ETB',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&crop=top',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&crop=bottom'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Black'],
    category: 'formal',
    material: 'Chiffon with cape overlay',
    careInstructions: 'Dry clean only',
    inStock: true,
    featured: true
  }
];

/**
 * Helper function to get products by category
 */
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

/**
 * Helper function to get featured products
 */
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

/**
 * Helper function to get product by ID
 */
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
