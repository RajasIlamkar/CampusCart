import React, { useState } from 'react';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ProductStyles.module.css';

export default function CreateProduct() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) return setError('Image is required');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('price', price);
    formData.append('image', image);

    const res = await fetch(`${process.env.REACT_APP_URL}/api/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: formData,
    });

    if (res.ok) {
      navigate('/');
    } else {
      const data = await res.json();
      setError(data.msg || 'Failed to create product');
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2>Sell an Item</h2>
      {error && <p className={styles.error}>{error}</p>}
      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setImage(e.target.files[0])}
        required
      />
      <button type="submit">Create</button>
    </form>
  );
}
