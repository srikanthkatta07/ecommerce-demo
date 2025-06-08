import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

function Admin() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    imageUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/categories`
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProductImage(file);
    setForm((prev) => ({
      ...prev,
      imageUrl: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!productImage) {
        alert('Please upload an image.');
        return;
      }
      setUploading(true);

      // 1. Get presigned URL and document ID
      const presignedResponse = await fetch(
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
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/documents/${documentId}/mark-done`,
        { method: 'PUT' }
      );

      // 4. Send product details to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/admin/create-product`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            price: form.price,
            documentId: documentId, // Reverted to send documentId
            categoryId: selectedCategory, // Include category ID
            stock: parseInt(stock, 10), // Include stock value
          }),
        }
      );

      if (response.ok) {
        alert('Product created successfully!');
        setForm({ name: '', price: '', imageUrl: '' });
        setProductImage(null);
        setSelectedCategory(''); // Reset category selection
        setStock(''); // Reset stock value
      } else {
        const errorData = await response.json();
        alert(`Failed to create product: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the product.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Header />
      <h1>Admin Panel</h1>
      <nav>
        <Link to="/">Back to Home</Link>
        <Link to="/create-category">Create Category</Link>
      </nav>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Product Price:</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Product Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
          />
          {uploading && <span>Uploading...</span>}
          {form.imageUrl && (
            <div>
              <img
                src={form.imageUrl}
                alt="Product"
                style={{ maxWidth: 200, marginTop: 10 }}
              />
            </div>
          )}
        </div>
        <button type="submit" disabled={uploading}>
          Create Product
        </button>
      </form>
    </div>
  );
}

export default Admin;
