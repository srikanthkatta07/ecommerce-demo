import React, { useState, useEffect } from 'react';
import './ManageProducts.css';
import { fetchWithToken } from '../utils/fetchWithToken';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [stock, setStock] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [productCategory, setProductCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetchWithToken(`${import.meta.env.VITE_API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetchWithToken(`${import.meta.env.VITE_API_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetchWithToken(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProductImage(file);
  };

  const handleAddProduct = async () => {
    if (!productImage || !selectedCategoryId) {
      alert('Please upload an image and select a category.');
      return;
    }

    setUploading(true);

    try {
      // 1. Get presigned URL and document ID
      const presignedResponse = await fetchWithToken(
        `${import.meta.env.VITE_API_URL}/api/products/s3/presigned-url?fileName=${productImage.name}`,
        { method: 'POST' }
      );
      const presignedData = await presignedResponse.json();
      const presignedUrl = presignedData.presignedUrl;
      const documentId = String(presignedData.documentId);

      // 2. Upload image to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: productImage,
        headers: {
          'Content-Type': productImage.type,
        },
      });
      if (!uploadResponse.ok) {
        alert('Failed to upload image.');
        setUploading(false);
        return;
      }

      // 3. Mark document as done
      await fetchWithToken(
        `${import.meta.env.VITE_API_URL}/api/products/documents/${documentId}/mark-done`,
        { method: 'PUT' }
      );

      // 4. Send product details to backend
      const response = await fetchWithToken(
        `${import.meta.env.VITE_API_URL}/api/products/admin/create-product`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: productName,
            price: productPrice,
            documentId: documentId,
            stock: parseInt(stock, 10),
            categoryId: selectedCategoryId
          }),
        }
      );

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        setProductName('');
        setProductPrice('');
        setStock('');
        setProductImage(null);
        setSelectedCategoryId('');
        setShowModal(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to add product: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the product.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="manage-products">
      <h2>Manage Products</h2>
      <button onClick={() => setShowModal(true)} className="add-product-button">Add Product</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Product</h3>
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Product Price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="" disabled>Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <button onClick={handleAddProduct} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Submit'}
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>
            <button onClick={() => handleDelete(product.id)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageProducts;
