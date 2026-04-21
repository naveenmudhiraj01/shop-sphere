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

  const currentUser = useSelector((state) => state.user.currentUser);
  const items = useSelector((state) => state.cart.items);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('user');
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
                  Welcome, {currentUser.role === 'admin'
                    ? 'admin'
                    : (currentUser.name || currentUser.email)}
                </span>

                {/* ✅ NEW LOGOUT BUTTON */}
                <button className="logout-btn" onClick={handleLogout}>
                  <div className="sign">
                    <svg viewBox="0 0 512 512">
                      <path d="M377.9 105.9L352 131.9 406.1 186H192v36h214.1L352 276.1l25.9 26 96-96zM160 64h96V0H160c-35.3 0-64 28.7-64 64v384c0 35.3 28.7 64 64 64h96v-64h-96V64z"/>
                    </svg>
                  </div>
                  <div className="text">LogIn</div>
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

      <footer className="footer">
        <p>&copy; 2024 ShopCart. All rights reserved.</p>
      </footer>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default App;