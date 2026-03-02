# Design Document: Alora Abayas E-Commerce Website

## Overview

Alora Abayas is a modern e-commerce web application built to showcase and sell abayas with an immersive zoom-in animation interface. The application follows a client-side architecture with a focus on visual engagement, smooth animations, and user-friendly shopping experience. The design emphasizes performance, accessibility, and mobile responsiveness while maintaining the signature zoom animation aesthetic throughout the user journey.

## Architecture

### System Architecture

The application follows a **Single Page Application (SPA)** architecture with the following layers:

1. **Presentation Layer**: React-based UI components with animation library integration
2. **State Management Layer**: Client-side state management for cart, filters, and user session
3. **Data Layer**: Product catalog data, order management, and local storage persistence
4. **Animation Layer**: Centralized animation system for zoom effects and transitions

### Technology Stack

- **Frontend Framework**: React with TypeScript for type safety
- **Styling**: CSS-in-JS (styled-components) or Tailwind CSS for responsive design
- **Animation**: Framer Motion for declarative animations and gesture handling
- **State Management**: React Context API or Zustand for lightweight state management
- **Routing**: React Router for client-side navigation
- **Image Optimization**: Next.js Image component or lazy loading with Intersection Observer
- **Storage**: Browser LocalStorage for cart persistence
- **Form Handling**: React Hook Form for checkout forms
- **File Upload**: Client-side file handling for payment screenshot uploads

### Deployment Architecture

- **Hosting**: Static site hosting (Vercel, Netlify, or AWS S3 + CloudFront)
- **Assets**: CDN for product images and static assets
- **Backend**: Optional lightweight backend (Node.js/Express) for order submission and email notifications

## Components and Interfaces

### Core Components

#### 1. ProductCatalog Component

**Responsibility**: Display grid of product cards with category filtering

**Props**:
```typescript
interface ProductCatalogProps {
  products: Product[];
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}
```

**Key Features**:
- Responsive grid layout (4 columns desktop, 2 tablet, 1 mobile)
- Intersection Observer for scroll-triggered zoom animations
- Category filter buttons
- Loading states with animated skeletons

#### 2. ProductCard Component

**Responsibility**: Display individual product preview with hover zoom effect

**Props**:
```typescript
interface ProductCardProps {
  product: Product;
  onProductClick: (productId: string) => void;
  inView: boolean;
}
```

**Animations**:
- Scale transform on hover (1.0 → 1.05)
- Zoom-in entrance animation when scrolled into view
- Smooth transition on click to detail view

#### 3. ProductDetail Component

**Responsibility**: Display full product information with image gallery

**Props**:
```typescript
interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string) => void;
}
```

**Key Features**:
- Image gallery with thumbnail navigation
- Zoom modal for enlarged image view
- Size and color selectors
- Add to cart button with animation feedback

#### 4. ShoppingCart Component

**Responsibility**: Display cart items and manage quantities

**Props**:
```typescript
interface ShoppingCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}
```

**Key Features**:
- Item list with thumbnails
- Quantity increment/decrement controls
- Real-time price calculation
- Persistent storage sync

#### 5. CheckoutForm Component

**Responsibility**: Collect shipping information and payment details

**Props**:
```typescript
interface CheckoutFormProps {
  cartTotal: number;
  onSubmitOrder: (orderData: OrderData) => void;
}
```

**Key Features**:
- Multi-step form (shipping → payment → confirmation)
- Form validation with error messages
- Bank account and Telebirr details display
- Screenshot upload with preview
- Order summary sidebar

#### 6. ZoomAnimation Component

**Responsibility**: Reusable wrapper for zoom animation effects

**Props**:
```typescript
interface ZoomAnimationProps {
  children: React.ReactNode;
  trigger: 'hover' | 'click' | 'inView';
  scale?: number;
  duration?: number;
}
```

**Implementation**:
- Uses Framer Motion's motion components
- Configurable scale factor and duration
- Respects prefers-reduced-motion media query

#### 7. SearchBar Component

**Responsibility**: Product search with live filtering

**Props**:
```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}
```

**Key Features**:
- Debounced input for performance
- Clear button
- Search icon with animation

#### 8. FilterPanel Component

**Responsibility**: Advanced filtering options

**Props**:
```typescript
interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}
```

**Key Features**:
- Price range slider
- Size checkboxes
- Color swatches
- Category selection
- Active filter badges with clear options

## Data Models

### Product Model

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string; // "ETB" for Ethiopian Birr
  images: string[]; // Array of image URLs
  sizes: string[]; // e.g., ["S", "M", "L", "XL"]
  colors: string[]; // e.g., ["Black", "Navy", "Burgundy"]
  category: string; // e.g., "casual", "formal", "embroidered"
  material: string;
  careInstructions: string;
  inStock: boolean;
  featured: boolean;
}
```

### CartItem Model

```typescript
interface CartItem {
  id: string; // Unique cart item ID
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  addedAt: Date;
}
```

### Order Model

```typescript
interface Order {
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
```

### CustomerInfo Model

```typescript
interface CustomerInfo {
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
```

### FilterOptions Model

```typescript
interface FilterOptions {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sizes?: string[];
  colors?: string[];
  searchQuery?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

