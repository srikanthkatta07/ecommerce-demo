import React, { useState, useEffect } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import authStore from '../stores/AuthStore';
import cartIcon from '../assets/cart.png';

function Header({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.length; // Count unique products in the cart
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem('userData')) || {};
  const userName = userDetails.sub || 'Guest';
  const userRole = userDetails.role || 'USER';

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.length); // Count unique products in the cart
    };

    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('cart');
    authStore.logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <header className="header">
      <h1 className="app-title" onClick={() => navigate('/')}>ZIVDAH ONLINE GROCERY</h1>
      <div className="header-right">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        {userRole !== 'ADMIN' && (
          <a href="/cart" className="cart-button">
            <img src={cartIcon} alt="Cart" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </a>
        )}
        {authStore.isLoggedIn ? (
          <div className="profile-container">
            <img
              src="/src/assets/profile.png"
              alt="Profile Icon"
              className="profile-icon"
              onClick={toggleDropdown}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <p>Hello, {userName}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="login-button">Login</button>
            <button onClick={() => navigate('/register')} className="register-button">Register</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
