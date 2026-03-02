import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ProductCatalog, FilterPanel, SearchBar } from './components';
import { products } from './data/products';
import { FilterOptions } from './types/models';
import { useProductFilter } from './hooks/useProductFilter';

function App() {
  const [filters, setFilters] = useState<FilterOptions>({});

  // Apply filters to products using custom hook
  const { filteredProducts, resultCount } = useProductFilter(products, filters);

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category === 'all' ? undefined : category,
    }));
  };

  const handleSearch = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }));
  };

  return (
    <Router>
      <div className="app" style={{ padding: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '1rem' }}>Alora Abayas</h1>
          <SearchBar onSearch={handleSearch} />
        </header>
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
              resultCount={resultCount}
            />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
