import React, { useState } from 'react';
import ManageProducts from './ManageProducts';
import ManageCategories from './ManageCategories';
import Header from './Header';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('addProduct');

  return (
    <div>
      <Header />
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        <div className="tabs">
          <button onClick={() => setActiveTab('addProduct')} className={activeTab === 'addProduct' ? 'active' : ''}>Add Product</button>
          <button onClick={() => setActiveTab('addCategory')} className={activeTab === 'addCategory' ? 'active' : ''}>Add Category</button>
          <button onClick={() => setActiveTab('viewProduct')} className={activeTab === 'viewProduct' ? 'active' : ''}>View Products</button>
          <button onClick={() => setActiveTab('viewCategory')} className={activeTab === 'viewCategory' ? 'active' : ''}>View Categories</button>
        </div>

        <div className="tab-content">
          {activeTab === 'addProduct' && <ManageProducts />}
          {activeTab === 'addCategory' && <ManageCategories />}
          {activeTab === 'viewProduct' && <ManageProducts />}
          {activeTab === 'viewCategory' && <ManageCategories />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
