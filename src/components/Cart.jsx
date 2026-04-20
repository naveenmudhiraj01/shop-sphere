import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(state => state.cart);
  const { currentUser } = useSelector(state => state.user);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (!currentUser) {
      alert('Please login to proceed to checkout');
      return;
    }
    // Navigate to checkout page
    window.location.href = '/checkout';
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>
            <FaShoppingCart /> Shopping Cart
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <FaShoppingCart className="empty-cart-icon" />
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.productId} className="cart-item">
                    <div className="item-image">
                      <img
                        src={item.image || '/images/placeholder.jpg'}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>

                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-price">${item.price.toFixed(2)} each</p>
                      <p className="item-seller">Sold by: {item.sellerName || 'Unknown'}</p>
                    </div>

                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <div className="item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-actions">
                  <button className="clear-cart-btn" onClick={handleClearCart}>
                    Clear Cart
                  </button>
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={!currentUser}
                >
                  {currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;