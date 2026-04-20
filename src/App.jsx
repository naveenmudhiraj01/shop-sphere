import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store/store';
import { FaShoppingCart, FaBars } from 'react-icons/fa';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProtectedRoutes from './components/ProtectedRoutes';
import DashBoard from './pages/DashBoard';
import Cart from './components/Cart';

import './App.css';

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ FIX: useSelector instead of store.getState()
  const currentUser = useSelector((state) => state.user.currentUser);
  const items = useSelector((state) => state.cart.items);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('user');
    // dispatch(logout()); // if you have logout action
    navigate('/login');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>ShopCart</h1>
          </div>

          <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            {/* ✅ FIX: use Link instead of <a> */}
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>

            {currentUser?.role === 'seller' && (
              <Link to="/seller/dashboard" className="nav-link">Seller Dashboard</Link>
            )}
            {currentUser?.role === 'admin' && (
              <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
            )}
          </nav>

          <div className="header-actions">
            {currentUser ? (
              <div className="user-menu">
                <span className="welcome-text">
                  Welcome, {currentUser.role === 'admin' ? 'admin' : (currentUser.name || currentUser.email)}
                </span>

                <button className="logout-btn" onClick={handleLogout}>
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="auth-link">Login</Link>
                <Link to="/signup" className="auth-link signup">Sign Up</Link>
              </div>
            )}

            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </button>

            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/products"
            element={
              <ProtectedRoutes>
                <ProductsPage />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <DashBoard />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoutes role="seller">
                <DashBoard />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoutes role="admin">
                <DashBoard />
              </ProtectedRoutes>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 ShopCart. All rights reserved.</p>
      </footer>

      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default App;