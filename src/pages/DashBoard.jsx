import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import {
  FaShoppingCart,
  FaUsers,
  FaRupeeSign,
  FaBoxOpen,
  FaTachometerAlt,
  FaUserFriends,
  FaCubes,
  FaClipboardList,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaPlus
} from "react-icons/fa";

import "./DashboardPage.css";




/* ---------- SHOP DATA ---------- */

// Orders per month
const ordersData = [
  { name: "Jan", orders: 120 },
  { name: "Feb", orders: 150 },
  { name: "Mar", orders: 200 },
  { name: "Apr", orders: 170 },
  { name: "May", orders: 220 }
];

// Revenue sources
const revenueData = [
  { name: "Electronics", value: 500 },
  { name: "Clothing", value: 300 },
  { name: "Jewelry", value: 200 },
  { name: "Others", value: 150 }
];

// Customers by category/location
const customerData = [
  { name: "New Users", customers: 120 },
  { name: "Returning", customers: 90 },
  { name: "Premium", customers: 60 },
  { name: "Guest", customers: 40 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DashBoard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sidebarOpen] = useState(true);
  
  // Edit modal states
  const [editingUser, setEditingUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  // Mock data for products and orders (since they don't exist in db.json yet)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:3001/users"),
          axios.get("http://localhost:3001/products"),
          axios.get("http://localhost:3001/orders")
        ]);

        setUsers(usersRes.data);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to mock data if API fails
        setProducts([
          { id: 1, name: "Gaming Laptop", price: 75000, category: "Electronics", stock: 15 },
          { id: 2, name: "Cotton T-Shirt", price: 1200, category: "Clothing", stock: 50 },
          { id: 3, name: "Smart Watch", price: 8500, category: "Electronics", stock: 25 }
        ]);
        setOrders([
          { id: 1, customerName: "John Doe", productName: "Gaming Laptop", amount: 75000, status: "delivered" },
          { id: 2, customerName: "Jane Smith", productName: "Cotton T-Shirt", amount: 1200, status: "pending" },
          { id: 3, customerName: "Bob Johnson", productName: "Smart Watch", amount: 8500, status: "shipped" }
        ]);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3001/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3001/products/${productId}`);
        setProducts(products.filter(product => product.id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:3001/orders/${orderId}`);
        setOrders(orders.filter(order => order.id !== orderId));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  // Edit functions
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      const originalId = editingUser.id;
      const newId = updatedUser.id;
      
      console.log('Original ID:', originalId);
      console.log('New ID:', newId);
      console.log('Updated user data:', updatedUser);
      
      if (originalId !== newId) {
        // ID is changing - need to create new user and delete old one
        console.log('ID is changing, creating new user and deleting old one');
        
        // Create new user with new ID
        const { id, ...userDataWithoutId } = updatedUser; // Remove id from body
        await axios.post(`http://localhost:3001/users`, { ...userDataWithoutId, id: newId });
        
        // Delete old user
        await axios.delete(`http://localhost:3001/users/${originalId}`);
        
        // Update local state
        setUsers(users.filter(user => user.id !== originalId).concat(updatedUser));
      } else {
        // Normal update
        console.log('Normal update, sending PATCH request to:', `http://localhost:3001/users/${updatedUser.id}`);
        const response = await axios.patch(`http://localhost:3001/users/${updatedUser.id}`, updatedUser);
        console.log('PATCH response:', response);
        
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      }
      
      setShowUserModal(false);
      setEditingUser(null);
      alert('User updated successfully!');
    } catch (error) {
      console.error("Error updating user:", error);
      console.error("Error response:", error.response);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      await axios.patch(`http://localhost:3001/products/${updatedProduct.id}`, updatedProduct);
      setProducts(products.map(product => product.id === updatedProduct.id ? updatedProduct : product));
      setShowProductModal(false);
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error("Error updating product:", error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleCloseModals = () => {
    setShowUserModal(false);
    setShowProductModal(false);
    setEditingUser(null);
    setEditingProduct(null);
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      <h2>Dashboard Overview</h2>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaShoppingCart className="card-icon icon-booking" />
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="stat-card">
          <FaUsers className="card-icon icon-customers" />
          <h3>Total Customers</h3>
          <p>{users.filter(u => u.role === 'user').length}</p>
        </div>

        <div className="stat-card">
          <FaRupeeSign className="card-icon icon-revenue" />
          <h3>Total Revenue</h3>
          <p>₹{orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <FaBoxOpen className="card-icon icon-location" />
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts-grid">
        <div className="chart-box">
          <h3>Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ordersData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#0b5ed7" strokeWidth={3}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Customer Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="customers" fill="#198754" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {revenueData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <h2>User Management</h2>
        <button className="btn btn-primary">
          <FaPlus /> Add User
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-warning" onClick={() => handleEditUser(user)}>
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <h2>Product Management</h2>
        <button className="btn btn-primary">
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="btn btn-sm btn-warning" onClick={() => handleEditProduct(product)}>
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <h2>Order Management</h2>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>{order.productName}</td>
                <td>₹{order.amount}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-info">
                    View Details
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteOrder(order.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'users': return renderUsers();
      case 'products': return renderProducts();
      case 'orders': return renderOrders();
      default: return renderDashboard();
    }
  };

  // Edit User Modal
  const UserEditModal = () => (
    <div className="modal-overlay" onClick={handleCloseModals}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit User</h3>
          <button className="modal-close" onClick={handleCloseModals}>×</button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const id = formData.get('id')?.toString() || editingUser?.id;
          const email = formData.get('email')?.toString() || '';
          const name = formData.get('name')?.toString() || '';
          const role = formData.get('role')?.toString() || 'customer';
          
          const updatedUser = {
            ...editingUser,
            id,
            email,
            name,
            role
          };
          
          console.log('Updating user:', updatedUser); // Debug log
          handleSaveUser(updatedUser);
        }}>
          <div className="form-group">
            <label>ID:</label>
            <input
              type="text"
              name="id"
              defaultValue={editingUser?.id}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              defaultValue={editingUser?.email}
              required
            />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              defaultValue={editingUser?.name}
            />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <select name="role" defaultValue={editingUser?.role}>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Edit Product Modal
  const ProductEditModal = () => (
    <div className="modal-overlay" onClick={handleCloseModals}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Product</h3>
          <button className="modal-close" onClick={handleCloseModals}>×</button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const updatedProduct = {
            ...editingProduct,
            name: formData.get('name'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            stock: parseInt(formData.get('stock')),
            description: formData.get('description')
          };
          handleSaveProduct(updatedProduct);
        }}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              defaultValue={editingProduct?.name}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              step="0.01"
              defaultValue={editingProduct?.price}
              required
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <input
              type="text"
              name="category"
              defaultValue={editingProduct?.category}
              required
            />
          </div>
          <div className="form-group">
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              defaultValue={editingProduct?.stock}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              defaultValue={editingProduct?.description}
              rows="3"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <FaUserFriends />
            <span>Users</span>
          </button>

          <button
            className={`nav-item ${activeSection === 'products' ? 'active' : ''}`}
            onClick={() => setActiveSection('products')}
          >
            <FaCubes />
            <span>Products</span>
          </button>

          <button
            className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
          >
            <FaClipboardList />
            <span>Orders</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <div className="span-mother">
              <span>L</span>
              <span>O</span>
              <span>G</span>
              <span>O</span>
              <span>U</span>
              <span>T</span>
            </div>
            <div className="span-mother2">
              <span>L</span>
              <span>O</span>
              <span>G</span>
              <span>O</span>
              <span>U</span>
              <span>T</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {renderContent()}
      </div>

      {/* Modals */}
      {showUserModal && <UserEditModal />}
      {showProductModal && <ProductEditModal />}
    </div>
  );
};

export default DashBoard;