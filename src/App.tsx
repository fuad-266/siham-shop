import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './hooks/useCart';
import { ErrorBoundary } from './components';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import ShoppingCart from './pages/ShoppingCart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
