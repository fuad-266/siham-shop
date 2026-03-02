/**
 * Data models for Alora Abayas E-Commerce Application
 * 
 * This file contains all TypeScript interfaces for the application's data structures.
 * Requirements: 1.1, 1.2, 4.1, 5.2
 */

/**
 * Product Model
 * Represents an abaya item available for purchase
 * Requirements: 1.1, 1.2
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string; // "ETB" for Ethiopian Birr
  images: string[]; // Array of image URLs
  sizes: string[]; // e.g., ["S", "M", "L", "XL"]
  colors: string[]; // e.g., ["Black", "Navy", "Burgundy"]
  category: string; // e.g., "casual", "formal", "embroidered", "plain"
  material: string;
  careInstructions: string;
  inStock: boolean;
  featured: boolean;
}

/**
 * CartItem Model
 * Represents a product in the shopping cart with selected options
 * Requirements: 4.1
 */
export interface CartItem {
  id: string; // Unique cart item ID
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  addedAt: Date;
}

/**
 * CustomerInfo Model
 * Contains customer shipping and contact information
 * Requirements: 5.2
 */
export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

/**
 * Order Model
 * Represents a completed purchase transaction
 * Requirements: 5.2
 */
export interface Order {
  orderId: string;
  orderDate: Date;
  status: 'pending' | 'verified' | 'shipped' | 'delivered';
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'bank_transfer' | 'telebirr';
  paymentScreenshot: string; // Base64 or URL
}

/**
 * FilterOptions Model
 * Contains all available filter criteria for product search
 * Requirements: 1.1
 */
export interface FilterOptions {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sizes?: string[];
  colors?: string[];
  searchQuery?: string;
}
