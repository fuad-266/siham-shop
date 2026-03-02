# Alora Abayas E-Commerce Website

A modern e-commerce web application for selling abayas with an immersive zoom-in animation interface.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Styled Components
- **Animation**: Framer Motion
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Testing**: Vitest + React Testing Library
- **Property-Based Testing**: fast-check

## Project Structure

```
src/
├── components/     # Reusable React components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── data/           # Mock data and constants
└── test/           # Test setup and utilities
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm test -- --run
```

### Linting

```bash
npm run lint
```

## Features

- Product catalog with category filtering
- Immersive zoom-in animations
- Product detail pages with image galleries
- Shopping cart management with localStorage persistence
- Secure checkout process with payment screenshot upload
- Responsive design (mobile, tablet, desktop)
- Search and advanced filtering
- Accessibility features (keyboard navigation, screen reader support)
- Performance optimizations (lazy loading, image optimization)

## Development Guidelines

- TypeScript strict mode is enabled
- All components should be typed
- Write both unit tests and property-based tests
- Follow accessibility best practices
- Optimize for performance (lazy loading, code splitting)
- Support responsive design from 320px to 2560px

## License

Private
