import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import CreateCategory from './pages/CreateCategory';
import Header from './pages/Header';
import authStore from './stores/AuthStore';
import './App.css';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} isLoggedIn={authStore.isLoggedIn} />
      <div className="main-content">
        {!authStore.isLoggedIn ? (
          <div className="auth-container">
          </div>
        ) : authStore.role === 'ADMIN' ? (
          <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <button onClick={() => navigate('/manage-products')} className="admin-button">Manage Products</button>
            <button onClick={() => navigate('/manage-categories')} className="admin-button">Manage Categories</button>
          </div>
        ) : (
          <p></p>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/create-category" element={<CreateCategory />} />
        \      </Routes>
    </div>
  );
}

export default App;
