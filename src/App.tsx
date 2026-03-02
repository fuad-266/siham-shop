import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ProductCatalog, FilterPanel } from './components';
import { products } from './data/products';
import { FilterOptions } from './types/models';

function App() {
  const [filters, setFilters] = useState<FilterOptions>({});

  // Apply filters to products
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Price range filter
    if (filters.priceRange) {
      if (
        product.price < filters.priceRange.min ||
        product.price > filters.priceRange.max
      ) {
        return false;
      }
    }

    // Size filter
    if (filters.sizes && filters.sizes.length > 0) {
      const hasMatchingSize = filters.sizes.some((size) =>
        product.sizes.includes(size)
      );
      if (!hasMatchingSize) {
        return false;
      }
    }

    // Color filter
    if (filters.colors && filters.colors.length > 0) {
      const hasMatchingColor = filters.colors.some((color) =>
        product.colors.some((productColor) =>
          productColor.toLowerCase().includes(color.toLowerCase())
        )
      );
      if (!hasMatchingColor) {
        return false;
      }
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDescription = product.description.toLowerCase().includes(query);
      if (!matchesName && !matchesDescription) {
        return false;
      }
    }

    return true;
  });

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category === 'all' ? undefined : category,
    }));
  };

  return (
    <Router>
      <div className="app" style={{ padding: '2rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>Alora Abayas</h1>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ width: '300px', flexShrink: 0 }}>
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              minPrice={900}
              maxPrice={3500}
            />
          </div>
          <div style={{ flex: 1 }}>
            <ProductCatalog
              products={filteredProducts}
              selectedCategory={filters.category}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
