import React, { useState } from 'react';
import Header from './Header';

function CreateCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryName,
          description,
        }),
      });

      if (response.ok) {
        alert('Category created successfully!');
        setCategoryName('');
        setDescription('');
      } else {
        alert('Failed to create category.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the category.');
    }
  };

  return (
    <div>
      <Header />
      <h1>Create Category</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Name:</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Create Category</button>
      </form>
    </div>
  );
}

export default CreateCategory;
