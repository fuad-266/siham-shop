# Responsive Breakpoints Documentation

## Overview
This document outlines the responsive design implementation for the Alora Abayas e-commerce website, including breakpoint definitions, media queries, and responsive adjustments across all components.

## Breakpoint Definitions

### Mobile
- **Range**: 320px - 767px
- **Target Devices**: Smartphones, small tablets in portrait mode
- **Grid Layout**: 1 column for product catalog
- **Touch Targets**: Minimum 44px × 44px for all interactive elements

### Tablet
- **Range**: 768px - 1023px
- **Target Devices**: Tablets, small laptops
- **Grid Layout**: 2 columns for product catalog
- **Adjustments**: Moderate font sizes and spacing

### Desktop
- **Range**: 1024px and above
- **Target Devices**: Laptops, desktop computers, large displays
- **Grid Layout**: 4 columns for product catalog
- **Adjustments**: Full font sizes and optimal spacing

## CSS Custom Properties

Defined in `src/index.css`:

```css
:root {
  --breakpoint-mobile: 767px;
  --breakpoint-tablet: 1023px;
  --font-size-base: 16px;
  --spacing-unit: 1rem;
}
```

### Responsive Font Sizes
- **Mobile**: 15px base font size
- **Tablet**: 15.5px base font size
- **Desktop**: 16px base font size

## Component-Specific Responsive Implementations

### 1. ProductCard Component
**File**: `src/components/ProductCard.css`

#### Mobile (max-width: 767px)
- Content padding: 14px
- Name font size: 15px
- Price font size: 17px
- Sizes font size: 13px
- Badge font size: 11px
- Minimum touch target: 44px

#### Tablet (768px - 1023px)
- Content padding: 18px
- Name font size: 17px
- Price font size: 19px

#### Desktop (1024px+)
- Content padding: 20px
- Name font size: 18px
- Price font size: 20px
- Sizes font size: 15px

### 2. ProductCatalog Component
**File**: `src/components/ProductCatalog.css`

#### Grid Layout
- **Mobile**: 1 column, 1.5rem gap
- **Tablet**: 2 columns, 1.5rem gap
- **Desktop**: 4 columns, 2rem gap

#### Filter Buttons
- All viewports: Minimum 44px × 44px touch targets
- Mobile: Reduced padding (0.5rem 1rem)

### 3. FilterPanel Component
**File**: `src/components/FilterPanel.css`

#### Mobile (max-width: 768px)
- Padding: 1rem (reduced from 1.5rem)
- Header: Flex column layout
- Title font size: 1.125rem
- Category buttons: Reduced padding
- Price inputs: Stacked vertically
- All interactive elements: Minimum 44px touch targets

### 4. SearchBar Component
**File**: `src/components/SearchBar.css`

#### Mobile (max-width: 767px)
- Max width: 100%
- Input font size: 16px (prevents iOS zoom on focus)
- Clear button: 44px × 44px minimum
- Icon container: 44px × 44px minimum

#### Tablet (768px - 1023px)
- Max width: 500px

#### Desktop
- Max width: 600px

### 5. Home Page
**File**: `src/pages/Home.css`

#### Layout Grid
- **Mobile**: 1 column (sidebar stacks below)
- **Tablet**: 220px sidebar + 1fr content
- **Desktop**: 280px sidebar + 1fr content

#### Typography
- **Mobile**: Title 1.75rem, Subtitle 0.875rem
- **Tablet**: Title 2.25rem, Subtitle 0.95rem
- **Desktop**: Title 2.5rem, Subtitle 1rem

### 6. ProductDetail Page
**File**: `src/pages/ProductDetail.css`

#### Layout
- **Mobile**: 1 column (image stacks above content)
- **Tablet**: 2 columns with 2rem gap
- **Desktop**: 2 columns with 3rem gap

#### Typography
- **Mobile**: Name 1.5rem, Price 1.25rem
- **Tablet**: Name 1.75rem, Price 1.35rem
- **Desktop**: Name 2rem, Price 1.5rem

### 7. ShoppingCart Page
**File**: `src/pages/ShoppingCart.css`

#### Layout
- **Mobile**: 1 column (summary below items)
- **Tablet**: 1fr + 300px sidebar
- **Desktop**: 1fr + 360px sidebar

#### Cart Items
- **Mobile**: Flex wrap, controls span full width
- **Tablet/Desktop**: Inline layout

#### Touch Targets
- Mobile quantity buttons: 44px × 44px
- Mobile remove button: 44px minimum height

### 8. Checkout Page
**File**: `src/pages/Checkout.css`

#### Layout
- **Mobile**: 1 column (sidebar on top)
- **Tablet**: 1fr + 300px sidebar
- **Desktop**: 1fr + 360px sidebar

#### Form Fields
- **Mobile**: Single column for all rows
- **Tablet/Desktop**: Multi-column rows

#### Payment Methods
- **Mobile**: Single column
- **Tablet/Desktop**: 2 columns

### 9. ImageGallery Component
**File**: `src/components/ImageGallery.css`

#### Main Image Height
- **Mobile**: 300px
- **Tablet**: 420px
- **Desktop**: 500px

#### Thumbnails
- **Mobile**: 56px × 56px (minimum 44px)
- **Tablet**: 64px × 64px
- **Desktop**: 72px × 72px

### 10. CartNotification Component
**File**: `src/components/CartNotification.css`

#### Positioning
- **Mobile**: Full width with 0.75rem margins
- **Tablet**: Fixed bottom-right with 1.5rem margins
- **Desktop**: Fixed bottom-right with 2rem margins

## Accessibility Features

### Touch Targets
All interactive elements on mobile viewports have minimum touch target sizes of 44px × 44px as per WCAG guidelines:
- Buttons
- Links
- Form inputs
- Checkboxes
- Radio buttons
- Icon buttons

### Reduced Motion Support
All components respect the `prefers-reduced-motion` media query:
- Animations are disabled or significantly reduced
- Transitions are removed
- Only essential motion is preserved

### Font Size Adjustments
- Mobile font sizes prevent iOS zoom on input focus (16px minimum)
- Text remains readable across all viewport sizes
- Line heights maintain readability

## Grid System

### Product Catalog Grid
```css
/* Mobile: 1 column */
grid-template-columns: 1fr;

/* Tablet: 2 columns */
@media (min-width: 768px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Desktop: 4 columns */
@media (min-width: 1024px) {
  grid-template-columns: repeat(4, 1fr);
}
```

### Page Layout Grid
```css
/* Mobile: Single column */
grid-template-columns: 1fr;

/* Tablet: Sidebar + Content */
@media (min-width: 768px) {
  grid-template-columns: 220px 1fr;
}

/* Desktop: Wider Sidebar + Content */
@media (min-width: 1024px) {
  grid-template-columns: 280px 1fr;
}
```

## Typography Scale

### Headings
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Page Title | 1.5rem | 1.75rem | 2rem |
| Section Title | 1.25rem | 1.35rem | 1.5rem |
| Card Title | 15px | 17px | 18px |

### Body Text
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Base | 15px | 15.5px | 16px |
| Small | 13px | 14px | 14px |
| Large | 17px | 19px | 20px |

## Spacing Scale

### Padding
| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Page | 1rem 0.75rem | 1.5rem 1rem | 2rem 1rem |
| Card | 14px | 18px | 20px |
| Section | 1rem | 1.25rem | 1.5rem |

### Gaps
| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Grid | 1.5rem | 1.5rem | 2rem |
| Flex | 0.5rem | 0.75rem | 1rem |

## Testing Checklist

### Viewport Testing
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone X/11/12)
- [ ] 414px (iPhone Plus)
- [ ] 768px (iPad Portrait)
- [ ] 1024px (iPad Landscape)
- [ ] 1280px (Laptop)
- [ ] 1920px (Desktop)

### Device Testing
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Desktop Safari

### Interaction Testing
- [ ] Touch targets are at least 44px on mobile
- [ ] Forms are usable on mobile keyboards
- [ ] Horizontal scrolling is prevented
- [ ] Content reflows without page reload
- [ ] Animations respect reduced motion preference

## Implementation Status

✅ All components have responsive breakpoints implemented
✅ Mobile-first approach used throughout
✅ Touch targets meet WCAG guidelines
✅ Typography scales appropriately
✅ Grid layouts adapt to viewport size
✅ Reduced motion preferences respected
✅ Font sizes prevent iOS zoom issues

## Requirements Validation

**Requirement 6.1**: ✅ System adapts layout for 320px to 2560px
**Requirement 6.2**: ✅ Touch-friendly interface with 44px minimum touch targets
**Requirement 6.3**: ✅ Zoom animations adjusted for mobile performance
**Requirement 6.4**: ✅ All functionality maintained across viewports
**Requirement 6.5**: ✅ Layout reorganizes without page reload on resize
