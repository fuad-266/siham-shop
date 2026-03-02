import { useState } from 'react';
import { ProductCatalog, FilterPanel, SearchBar } from '../components';
import { useProductFilter } from '../hooks/useProductFilter';
import { products } from '../data/products';
import { FilterOptions } from '../types/models';
import './Home.css';

const Home = () => {
    const [filters, setFilters] = useState<FilterOptions>({
        category: 'all',
    });

    const { filteredProducts } = useProductFilter(products, filters);

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters);
    };

    const handleSearch = (query: string) => {
        setFilters((prev) => ({
            ...prev,
            searchQuery: query,
        }));
    };

    const handleProductClick = (productId: string) => {
        console.log('Product clicked:', productId);
        // Future: navigate to product detail page
    };

    return (
        <div className="home-page">
            <header className="home-page__header">
                <div className="container">
                    <h1 className="home-page__title">Alora Abayas</h1>
                    <p className="home-page__subtitle">Premium Abayas E-Commerce</p>
                    <div className="home-page__search-container">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>
            </header>

            <main className="home-page__main container">
                <aside className="home-page__sidebar">
                    <FilterPanel
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </aside>

                <section className="home-page__content">
                    <ProductCatalog
                        products={filteredProducts}
                        onProductClick={handleProductClick}
                    />
                </section>
            </main>

            <footer className="home-page__footer">
                <div className="container">
                    <p>&copy; 2024 Alora Abayas. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
