import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productsSlice';
import { FaShoppingBag, FaStar, FaTruck, FaShieldAlt } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const featuredProducts = products.slice(0, 4);
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ShopCart</h1>
          <p>Discover amazing products from trusted sellers worldwide</p>
          <div className="hero-actions">
            <a href="/products" className="btn btn-primary">
              <FaShoppingBag /> Shop Now
            </a>
            {!currentUser && (
              <a href="/signup" className="btn btn-secondary">
                Join Us
              </a>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/hero-shopping.jpg" alt="Shopping" onError={(e) => e.style.display = 'none'} />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose ShopCart?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaTruck className="feature-icon" />
              <h3>Free Shipping</h3>
              <p>Free delivery on orders over $50</p>
            </div>
            <div className="feature-card">
              <FaShieldAlt className="feature-icon" />
              <h3>Secure Payment</h3>
              <p>100% secure payment processing</p>
            </div>
            <div className="feature-card">
              <FaStar className="feature-icon" />
              <h3>Quality Products</h3>
              <p>Curated products from trusted sellers</p>
            </div>
            <div className="feature-card">
              <FaShoppingBag className="feature-icon" />
              <h3>Easy Returns</h3>
              <p>30-day return policy on all items</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="categories">
          <div className="container">
            <h2>Shop by Category</h2>
            <div className="categories-grid">
              {categories.map(category => (
                <a
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="category-card"
                >
                  <div className="category-image">
                    <img
                      src={`/images/${category.toLowerCase()}.jpg`}
                      alt={category}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <h3>{category}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="featured-products">
          <div className="container">
            <h2>Featured Products</h2>
            <div className="products-grid">
              {featuredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img
                      src={product.image || '/images/placeholder.jpg'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar
                          key={i}
                          className={i < Math.floor(product.rating || 0) ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                      <span>({product.rating || 0})</span>
                    </div>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <a href={`/products`} className="btn btn-primary">
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="view-all">
              <a href="/products" className="btn btn-secondary">
                View All Products
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for the latest deals and products</p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;