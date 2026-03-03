import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCatalog, FilterPanel, SearchBar } from '../components';
import { useProductFilter } from '../hooks/useProductFilter';
import { useCart } from '../hooks/useCart';
import { products } from '../data/products';
import { FilterOptions } from '../types/models';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { itemCount } = useCart();
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterOptions>({
        category: 'all',
    });

    const { filteredProducts } = useProductFilter(products, filters);

    // Simulate initial data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

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
        navigate(`/product/${productId}`);
    };

    return (
        <div className="home-page">
            <header className="home-page__header">
                <div className="container home-page__header-inner">
                    <div className="home-page__brand">
                        <h1 className="home-page__title">Alora Abayas</h1>
                        <p className="home-page__subtitle">Premium Abayas E-Commerce</p>
                    </div>
                    <button
                        className="home-page__cart-btn"
                        onClick={() => navigate('/cart')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                navigate('/cart');
                            }
                        }}
                        aria-label={`Shopping cart with ${itemCount} items`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {itemCount > 0 && (
                            <span className="home-page__cart-badge" aria-live="polite" aria-atomic="true">{itemCount}</span>
                        )}
                    </button>
                </div>
                <div className="container">
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
                        searchQuery={filters.searchQuery}
                        onClearFilters={() => setFilters({ category: 'all' })}
                        loading={loading}
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
