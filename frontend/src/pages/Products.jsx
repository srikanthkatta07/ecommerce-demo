import React, { useState, useEffect } from 'react';
import './Products.css';
import Header from './Header';

function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    // Fetch categories from backend API
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    // Fetch products based on selected category
    const url = selectedCategoryId
      ? `${import.meta.env.VITE_API_URL}/api/products?categoryId=${selectedCategoryId}`
      : `${import.meta.env.VITE_API_URL}/api/products`;

    fetch(url)
      .then((response) => response.json())
      .then(async (data) => {
        const productsWithImageUrls = await Promise.all(
          data.map(async (product) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product.id}/image-url`);
            const imageUrl = response.ok ? await response.text() : null;
            return { ...product, imageUrl };
          })
        );
        setProducts(productsWithImageUrls);
      });
  }, [selectedCategoryId]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product, quantity = 1) => {
    if (quantity > product.stock) {
      alert('Quantity exceeds available stock.');
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    setCart([...cart]);
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const isAdmin = JSON.parse(localStorage.getItem('user'))?.role === 'ADMIN';

  const computeAvailableStock = (product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  const toggleFilterModal = () => {
    setShowFilterModal((prev) => !prev);
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategoryId((prev) => (prev === categoryId ? '' : categoryId));
  };

  return (
    <div>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="main-content">
        <div className="filter-container">
          <img
            src="/src/assets/filter.png"
            alt="Filter Icon"
            className="filter-icon"
            onClick={toggleFilterModal}
          />
          {showFilterModal && (
            <div className="filter-modal-content">
              <h3>Select Category</h3>
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedCategoryId === category.id}
                        onChange={() => toggleCategorySelection(category.id)}
                      />
                      {category.name}
                    </label>
                  </li>
                ))}
              </ul>
              <button onClick={toggleFilterModal}>Close</button>
            </div>)}
        </div>

        <div className="selected-filters">
          {selectedCategoryId && (
            <span className="filter-label">
              {categories.find((category) => category.id === selectedCategoryId)?.name}
              <button
                className="remove-filter-button"
                onClick={() => toggleCategorySelection(selectedCategoryId)}
              >
                ✕
              </button>
            </span>
          )}
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <a href={product.imageUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-image"
                />
              </a>
              <h3>{product.name}</h3>
              <p>Available Stock: {computeAvailableStock(product)}</p>
              {!isAdmin && (
                <>
                  <input
                    type="number"
                    min="1"
                    max={computeAvailableStock(product)}
                    placeholder="Quantity"
                    defaultValue="1"
                    onChange={(e) => product.quantity = parseInt(e.target.value, 10)}
                  />
                  <button onClick={() => addToCart(product, product.quantity || 1)}>Add to Cart</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2025 EcommerceDemoApp. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Products;
