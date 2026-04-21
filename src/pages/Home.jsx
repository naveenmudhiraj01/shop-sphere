import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaStar,
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaHeadset,
  FaTag,
  FaBolt,
} from "react-icons/fa";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [heroVisible, setHeroVisible] = useState(false);
  const navigate = useNavigate();

  const categories = ["All", "Electronics", "Clothing", "Jewelry", "Others"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3001/products");
        setProducts(res.data);
      } catch {
        setProducts([
          { id: 1, name: "Gaming Laptop",    price: 75000, category: "Electronics", stock: 15, rating: 4.8 },
          { id: 2, name: "Cotton T-Shirt",   price: 1200,  category: "Clothing",    stock: 50, rating: 4.3 },
          { id: 3, name: "Smart Watch",      price: 8500,  category: "Electronics", stock: 25, rating: 4.6 },
          { id: 4, name: "Gold Necklace",    price: 22000, category: "Jewelry",     stock: 8,  rating: 4.9 },
          { id: 5, name: "Wireless Earbuds", price: 5500,  category: "Electronics", stock: 30, rating: 4.5 },
          { id: 6, name: "Denim Jacket",     price: 3200,  category: "Clothing",    stock: 20, rating: 4.2 },
        ]);
      }
    };

    fetchProducts();
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    const updatedCart = existing
      ? cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      : [...cart, { ...product, qty: 1 }];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    showToast(`"${product.name}" added to cart!`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getCategoryEmoji = (category) => {
    const map = { Electronics: "⚡", Clothing: "👕", Jewelry: "💎", Others: "📦" };
    return map[category] || "🛍️";
  };

  const renderStars = (rating = 4) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        style={{ color: i < Math.round(rating) ? "#f59e0b" : "#d1d5db", fontSize: "11px" }}
      />
    ));

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className={`hero-section ${heroVisible ? "visible" : ""}`}>
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <FaBolt style={{ fontSize: "11px" }} /> New Arrivals This Week
          </div>
          <h1 className="hero-title">
            Shop Smarter,<br />
            <span className="hero-accent">Live Better</span>
          </h1>
          <p className="hero-subtitle">
            Discover thousands of curated products across electronics, fashion,
            jewelry and more — delivered right to your door.
          </p>
          <div className="hero-cta">
            <button
              className="btn-primary-hero"
              onClick={() =>
                document.getElementById("products").scrollIntoView({ behavior: "smooth" })
              }
            >
              Shop Now <FaArrowRight style={{ fontSize: "13px" }} />
            </button>
            <button className="btn-secondary-hero" onClick={() => navigate("/login")}>
              Seller Portal
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>10K+</strong><span>Products</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>50K+</strong><span>Happy Customers</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>4.8★</strong><span>Avg Rating</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-float card-f1">
            <div className="float-card-icon">⚡</div>
            <div>
              <p className="float-card-label">Electronics</p>
              <p className="float-card-sub">500+ items</p>
            </div>
          </div>
          <div className="hero-card-float card-f2">
            <div className="float-card-icon">💎</div>
            <div>
              <p className="float-card-label">Jewelry</p>
              <p className="float-card-sub">200+ items</p>
            </div>
          </div>
          <div className="hero-card-float card-f3">
            <div className="float-card-icon">🚀</div>
            <div>
              <p className="float-card-label">Fast Delivery</p>
              <p className="float-card-sub">2–3 days</p>
            </div>
          </div>
          <div className="hero-main-visual">
            <div className="visual-ring ring-1" />
            <div className="visual-ring ring-2" />
            <div className="visual-center">🛍️</div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[
            "Free Shipping Over ₹999", "⚡ Flash Sale Live", "New Electronics Drop",
            "💎 Jewelry Collection", "30-Day Returns", "24/7 Support",
            "Free Shipping Over ₹999", "⚡ Flash Sale Live", "New Electronics Drop",
            "💎 Jewelry Collection", "30-Day Returns", "24/7 Support",
          ].map((text, i) => (
            <span key={i} className="marquee-item">
              <FaTag style={{ fontSize: "10px", marginRight: "6px" }} />{text}
            </span>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <section className="products-section" id="products">
        <div className="section-header-row">
          <div>
            <p className="section-eyebrow">Our Collection</p>
            <h2 className="section-title">Browse Products</h2>
          </div>
          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product, idx) => (
            <div
              key={product.id}
              className="product-card"
              style={{ animationDelay: `${idx * 0.07}s` }}
            >
              <div className="product-img-wrap">
                <div className="product-img-placeholder">
                  <span className="product-emoji">{getCategoryEmoji(product.category)}</span>
                </div>
                <span className="product-category-tag">{product.category}</span>
                {product.stock <= 10 && (
                  <span className="stock-badge">Only {product.stock} left</span>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-stars">
                  {renderStars(product.rating)}
                  <span className="product-rating-val">({product.rating || "4.5"})</span>
                </div>
                <div className="product-footer">
                  <span className="product-price">₹{product.price?.toLocaleString()}</span>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <FaShoppingCart style={{ fontSize: "12px" }} /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <p>No products found in this category.</p>
          </div>
        )}
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" id="features">
        <div className="features-grid">
          {[
            { icon: <FaTruck />,     title: "Free Delivery",   desc: "On all orders above ₹999 anywhere in India" },
            { icon: <FaShieldAlt />, title: "Secure Payments", desc: "100% secure checkout with SSL encryption" },
            { icon: <FaHeadset />,   title: "24/7 Support",    desc: "Round-the-clock customer care team" },
            { icon: <FaTag />,       title: "Best Prices",     desc: "Guaranteed lowest prices or we'll match it" },
          ].map((feat, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{feat.icon}</div>
              <h4 className="feature-title">{feat.title}</h4>
              <p className="feature-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="promo-banner">
        <div className="promo-content">
          <p className="promo-eyebrow">Limited Time Offer</p>
          <h2 className="promo-heading">Up to 40% off on Electronics</h2>
          <p className="promo-sub">
            Don't miss our biggest sale of the season. Shop before stock runs out.
          </p>
          <button
            className="promo-btn"
            onClick={() => {
              setActiveCategory("Electronics");
              document.getElementById("products").scrollIntoView({ behavior: "smooth" });
            }}
          >
            Grab the Deal <FaArrowRight style={{ fontSize: "12px" }} />
          </button>
        </div>
        <div className="promo-deco">
          <div className="promo-circle c1" />
          <div className="promo-circle c2" />
          <span className="promo-big-emoji">⚡</span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-dot" />
            <span className="brand-name">ShopZone</span>
            <p className="footer-tagline">Your one-stop destination for everything.</p>
          </div>
          <div className="footer-links-group">
            <p className="footer-links-title">Quick Links</p>
            <a href="#products">Products</a>
            <a href="#features">Features</a>
            <span onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>Login</span>
          </div>
          <div className="footer-links-group">
            <p className="footer-links-title">Admin</p>
            <span onClick={() => navigate("/admin")} style={{ cursor: "pointer" }}>Dashboard</span>
            <span onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>Sign In</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopZone. All rights reserved.</p>
        </div>
      </footer>

      {/* ── TOAST ── */}
      {toast && (
        <div className="toast-notification">
          <FaShoppingCart style={{ fontSize: "13px" }} /> {toast}
        </div>
      )}
    </div>
  );
};

export default Home;