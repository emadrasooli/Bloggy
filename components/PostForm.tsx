"use client";

import { useState, FormEvent } from 'react';
import axios from 'axios';

interface PostFormProps {
  user: any;
}

const PostForm: React.FC<PostFormProps> = ({ user }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() !== '' && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/posts', {
        title,
        content,
        categories,
        userId: user.id, // Assuming user object has an id field
      });

      if (response.status === 201) {
        // Clear form or redirect
        setTitle('');
        setContent('');
        setCategories([]);
        alert('Post created successfully!');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Post</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Categories:</label>
        <div>
          {categories.map((cat, index) => (
            <span key={index} style={{ marginRight: '8px' }}>
              {cat}
            </span>
          ))}
        </div>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="button" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>

      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;
