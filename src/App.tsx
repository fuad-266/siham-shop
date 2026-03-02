import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './hooks/useCart';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import ShoppingCart from './pages/ShoppingCart';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<ShoppingCart />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
