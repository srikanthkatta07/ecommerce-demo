import React, { useState, useEffect } from 'react';
import './ManageCategories.css';
import { fetchWithToken } from '../utils/fetchWithToken';

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');

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
    const response = await fetchWithToken(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setCategories(categories.filter((category) => category.id !== id));
    }
  };

  const handleAddCategory = async () => {
    const response = await fetchWithToken(`${import.meta.env.VITE_API_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (response.ok) {
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setCategoryName('');
      setShowModal(false);
    } else {
      console.error('Failed to add category');
    }
  };

  return (
    <div className="manage-categories">
      <h2>Manage Categories</h2>
      <button onClick={() => setShowModal(true)} className="add-category-button">Add Category</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Category</h3>
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <button onClick={handleAddCategory}>Submit</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <table className="categories-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>
                <button onClick={() => handleDelete(category.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageCategories;
