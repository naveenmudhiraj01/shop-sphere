import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, setSearchQuery, setSelectedCategory, setSortBy } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { FaSearch, FaFilter, FaShoppingCart, FaStar, FaHeart } from 'react-icons/fa';
import './ProductsPage.css';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, filteredProducts, categories, loading, error } = useSelector(state => state.products);
  const { items: cartItems } = useSelector(state => state.cart);
  const { currentUser } = useSelector(state => state.user);

  const [searchQuery, setSearchQueryLocal] = useState('');
  const [selectedCategory, setSelectedCategoryLocal] = useState('');
  const [sortBy, setSortByLocal] = useState('name');
  const [sortOrder, setSortOrderLocal] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQueryLocal(query);
    dispatch(setSearchQuery(query));
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategoryLocal(category);
    dispatch(setSelectedCategory(category));
  };

  const handleSort = (sortBy, sortOrder) => {
    setSortByLocal(sortBy);
    setSortOrderLocal(sortOrder);
    dispatch(setSortBy({ sortBy, sortOrder }));
  };

  const handleAddToCart = (product) => {
    if (!currentUser) {
      alert('Please login to add items to cart');
      return;
    }

    const cartItem = {
      productId: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      sellerId: product.sellerId,
    };

    dispatch(addToCart(cartItem));
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId.toString());
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <h1>Shop Our Products</h1>
        <p>Discover amazing products from trusted sellers</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-controls">
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleSort(sortBy, sortOrder);
            }}
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low-High</option>
            <option value="price-desc">Price High-Low</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="newest-desc">Newest First</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <h3>Categories</h3>
            <div className="category-filters">
              <button
                className={selectedCategory === '' ? 'active' : ''}
                onClick={() => handleCategoryFilter('')}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={product.image || '/images/placeholder.jpg'}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
                <button className="wishlist-btn">
                  <FaHeart />
                </button>
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-rating">
                  {renderStars(product.rating || 0)}
                  <span className="rating-text">
                    ({product.rating || 0}) {product.reviews?.length || 0} reviews
                  </span>
                </div>

                <div className="product-price">
                  <span className="price">${product.price.toFixed(2)}</span>
                  <span className="stock">Stock: {product.stock}</span>
                </div>

                <div className="product-seller">
                  Sold by: {product.sellerName}
                </div>

                <button
                  className={`add-to-cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart />
                  {product.stock === 0 ? 'Out of Stock' :
                   isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredProducts.length > 12 && (
        <div className="load-more">
          <button className="load-more-btn">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;