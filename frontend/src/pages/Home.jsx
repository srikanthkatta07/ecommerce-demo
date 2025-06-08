import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Header from './Header';

function Home() {
  return (
    <div>
      <Header />
      <div id="home-page-id" className="home-container">
        <header className="home-header">
          <h1>Welcome to the Ecommerce App</h1>
        </header>
        <nav className="home-nav">
          {/* <Link to="/products" className="home-link">View Products</Link>
          <Link to="/cart" className="home-link">View Cart</Link>
          <Link to="/orders" className="home-link">View Orders</Link> */}
        </nav>
        <button onClick={() => window.location.href = '/products'} className="products-button">View Products</button>
      </div>
    </div>
  );
}

export default Home;
